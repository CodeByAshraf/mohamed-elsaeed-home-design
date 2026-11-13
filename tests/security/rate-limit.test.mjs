import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  INVALID_CLIENT,
  clientKey,
  createRateLimiter,
  readBodyLimited,
  trustedProxyHops,
} from "../../src/lib/rate-limit";

describe("trustedProxyHops", () => {
  test("defaults to 0 and rejects anything but a small whole number", () => {
    for (const value of [undefined, "", "abc", "-1", "1.5", "1e2", "0x1", "999"]) {
      assert.equal(trustedProxyHops(value), 0, `value ${value}`);
    }
    assert.equal(trustedProxyHops("1"), 1);
    assert.equal(trustedProxyHops(" 2 "), 2);
    assert.equal(trustedProxyHops("99"), 10);
  });
});

describe("clientKey", () => {
  test("hops = 0 never trusts X-Forwarded-For, spoofed or not", () => {
    for (const header of [null, "", "203.0.113.10", "198.51.100.77, 203.0.113.10", ","]) {
      assert.equal(clientKey(header, 0), null);
    }
  });

  test("hops = 1 takes the entry appended by the proxy, not the client-supplied prefix", () => {
    assert.equal(clientKey("203.0.113.10", 1), "203.0.113.10");
    assert.equal(clientKey("198.51.100.77, 203.0.113.10", 1), "203.0.113.10");
    assert.equal(clientKey("1.1.1.1, 2.2.2.2, 203.0.113.10", 1), "203.0.113.10");
  });

  test("hops = 2 takes the second entry from the right", () => {
    assert.equal(clientKey("198.51.100.77, 203.0.113.10, 10.0.0.2", 2), "203.0.113.10");
  });

  test("a chain shorter than the hop count is invalid", () => {
    assert.equal(clientKey("203.0.113.10", 2), INVALID_CLIENT);
    assert.equal(clientKey(null, 1), INVALID_CLIENT);
  });

  test("invalid, empty and oversized values map to one bounded key", () => {
    const oversized = "a".repeat(8000);
    for (const header of ["", ",", " , ", "unknown", "not-an-ip", "999.1.1.1", oversized, `1.1.1.1, ${oversized}`]) {
      assert.equal(clientKey(header, 1), INVALID_CLIENT, `header ${header.slice(0, 20)}`);
    }
  });

  test("normalizes IPv6 case and IPv4-mapped addresses", () => {
    assert.equal(clientKey("2001:DB8::1", 1), "2001:db8::1");
    assert.equal(clientKey("::ffff:203.0.113.10", 1), "203.0.113.10");
  });

  test("ports, brackets, zone IDs and other non-bare forms map to the invalid key", () => {
    const unsupported = [
      "203.0.113.10:51234",
      "[2001:db8::1]",
      "[2001:db8::1]:443",
      "fe80::1%eth0",
      "fe80::1%25eth0",
      "::ffff:203.0.113.10%1",
      "203.0.113.010",
      "203.0.113.10/32",
      '"203.0.113.10"',
      "for=203.0.113.10",
    ];
    for (const header of unsupported) {
      assert.equal(clientKey(header, 1), INVALID_CLIENT, `header ${header}`);
      assert.equal(clientKey(`198.51.100.7, ${header}`, 1), INVALID_CLIENT, `prefixed ${header}`);
    }
  });

  test("varying a port or zone ID never yields distinct keys", () => {
    const keys = new Set();
    for (let i = 0; i < 50; i++) {
      keys.add(clientKey(`203.0.113.10:${1000 + i}`, 1));
      keys.add(clientKey(`[2001:db8::1]:${1000 + i}`, 1));
      keys.add(clientKey(`fe80::1%eth${i}`, 1));
    }
    assert.deepEqual([...keys], [INVALID_CLIENT]);
  });

  test("empty entries are not skipped when counting hops", () => {
    assert.equal(clientKey("203.0.113.10, , 10.0.0.1", 2), INVALID_CLIENT);
    assert.equal(clientKey("203.0.113.10,,10.0.0.1", 3), "203.0.113.10");
  });
});

describe("createRateLimiter", () => {
  const clock = (start = 0) => {
    let t = start;
    return { now: () => t, advance: (ms) => (t += ms) };
  };

  test("rejects options that would weaken or disable the limit", () => {
    const good = { limit: 5, windowMs: 1000, maxKeys: 10 };
    for (const name of ["limit", "windowMs", "maxKeys"]) {
      for (const bad of [0, -1, 1.5, NaN, Infinity, "5", null, undefined, 2 ** 53]) {
        assert.throws(() => createRateLimiter({ ...good, [name]: bad }), RangeError, `${name} = ${String(bad)}`);
      }
    }
    assert.doesNotThrow(() => createRateLimiter(good));
  });

  test("allows 5 per window, then refuses", () => {
    const c = clock();
    const limiter = createRateLimiter({ limit: 5, windowMs: 600_000, maxKeys: 100, now: c.now });
    const results = Array.from({ length: 7 }, () => limiter.allow("k"));
    assert.deepEqual(results, [true, true, true, true, true, false, false]);
  });

  test("refused retries are not counted, so there is no permanent lockout", () => {
    const c = clock();
    const limiter = createRateLimiter({ limit: 5, windowMs: 600_000, maxKeys: 100, now: c.now });
    for (let i = 0; i < 5; i++) limiter.allow("k");
    for (let i = 0; i < 100; i++) {
      c.advance(5_000);
      assert.equal(limiter.allow("k"), false);
    }
    c.advance(100_000); // now one full window after the first counted request
    assert.equal(limiter.allow("k"), true);
  });

  test("keys are independent", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000, maxKeys: 100, now: () => 0 });
    assert.equal(limiter.allow("a"), true);
    assert.equal(limiter.allow("a"), false);
    assert.equal(limiter.allow("b"), true);
  });

  test("memory stays bounded under 100,000 unique keys", () => {
    const limiter = createRateLimiter({ limit: 5, windowMs: 600_000, maxKeys: 1000, now: () => 0 });
    for (let i = 0; i < 100_000; i++) limiter.allow(`key-${i}`);
    assert.equal(limiter.size(), 1000);
  });

  test("expired keys are swept", () => {
    const c = clock();
    const limiter = createRateLimiter({ limit: 5, windowMs: 600_000, maxKeys: 10_000, now: c.now });
    for (let i = 0; i < 500; i++) limiter.allow(`key-${i}`);
    assert.equal(limiter.size(), 500);
    c.advance(600_000);
    limiter.allow("fresh");
    assert.equal(limiter.size(), 1);
  });
});

describe("readBodyLimited", () => {
  const post = (body, headers = {}) =>
    new Request("http://localhost/api/consultation", { method: "POST", body, headers, duplex: "half" });

  /** An endless stream of 1 KiB chunks that records how much was pulled and whether it was cancelled. */
  function endlessStream() {
    const state = { pulled: 0, cancelled: false };
    const stream = new ReadableStream({
      pull(controller) {
        state.pulled++;
        controller.enqueue(new Uint8Array(1024));
      },
      cancel() {
        state.cancelled = true;
      },
    });
    return { stream, state };
  }

  test("returns the body when within the limit", async () => {
    assert.equal(await readBodyLimited(post('{"a":"é"}'), 16 * 1024), '{"a":"é"}');
  });

  test("an exact-limit body is accepted", async () => {
    assert.equal((await readBodyLimited(post("x".repeat(16 * 1024)), 16 * 1024)).length, 16 * 1024);
  });

  test("an oversized Content-Length is refused without reading", async () => {
    const { stream, state } = endlessStream();
    const request = post(stream, { "content-length": String(5 * 1024 * 1024) });
    assert.equal(await readBodyLimited(request, 16 * 1024), null);
    assert.equal(state.pulled <= 1, true, `pulled ${state.pulled} chunks`);
    assert.equal(state.cancelled, true);
  });

  test("a chunked body without Content-Length stops and is cancelled at the limit", async () => {
    const { stream, state } = endlessStream();
    assert.equal(await readBodyLimited(post(stream), 16 * 1024), null);
    assert.equal(state.cancelled, true);
    assert.equal(state.pulled <= 20, true, `pulled ${state.pulled} chunks`);
  });

  test("a small declared length cannot hide a larger streamed body", async () => {
    const { stream, state } = endlessStream();
    assert.equal(await readBodyLimited(post(stream, { "content-length": "10" }), 16 * 1024), null);
    assert.equal(state.cancelled, true);
  });

  // Values Number() cannot read fall back to counting bytes, so they cannot lift the limit.
  for (const declared of ["abc", "-1", "0", "", "10, 99999", "99999, 10", "-Infinity", "NaN"]) {
    test(`Content-Length ${JSON.stringify(declared)} with an endless body is stopped at the limit`, async () => {
      const { stream, state } = endlessStream();
      assert.equal(await readBodyLimited(post(stream, { "content-length": declared }), 16 * 1024), null);
      assert.equal(state.cancelled, true);
      assert.equal(state.pulled <= 20, true, `pulled ${state.pulled} chunks`);
    });
  }

  // Values Number() reads as over the limit are refused before reading.
  for (const declared of ["0x5000", "1e9", " 99999 ", "+99999", "16385", "16384.5", "Infinity"]) {
    test(`Content-Length ${JSON.stringify(declared)} is refused without reading`, async () => {
      const { stream, state } = endlessStream();
      assert.equal(await readBodyLimited(post(stream, { "content-length": declared }), 16 * 1024), null);
      assert.equal(state.cancelled, true);
      assert.equal(state.pulled <= 1, true, `pulled ${state.pulled} chunks`);
    });
  }

  test("a malformed Content-Length does not block a small honest body", async () => {
    for (const declared of ["abc", "-1", "10, 99999"]) {
      assert.equal(await readBodyLimited(post("{}", { "content-length": declared }), 16 * 1024), "{}");
    }
  });
});
