// Route-level limits. SMTP_HOST stays unset, so no request here can reach a mail server.
// Each test imports a fresh copy of the route, so its limiters start empty and tests can run
// alone or in any order.
import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, test } from "node:test";

const ROUTE = new URL("../../src/app/api/consultation/route.ts", import.meta.url).href;
let instance = 0;

/** A POST helper bound to a new route instance with its own empty limiters. */
async function freshRoute() {
  const { POST } = await import(`${ROUTE}?instance=${++instance}`);
  return (headers = {}, body = "{}") =>
    POST(
      new Request("http://localhost/api/consultation", {
        method: "POST",
        headers: { "content-type": "application/json", ...headers },
        body,
        duplex: "half",
      }),
    );
}

const ENV_KEYS = ["SMTP_HOST", "TRUSTED_PROXY_HOPS"];
const savedEnv = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));
function restoreEnv() {
  for (const key of ENV_KEYS) {
    if (savedEnv[key] === undefined) delete process.env[key];
    else process.env[key] = savedEnv[key];
  }
}
beforeEach(() => {
  delete process.env.SMTP_HOST;
  delete process.env.TRUSTED_PROXY_HOPS;
});
afterEach(restoreEnv);

const statuses = (responses) => responses.map((r) => r.status);
const withHops = (hops) => {
  process.env.TRUSTED_PROXY_HOPS = hops;
};
/** Sends one request per header set, in sequence, and returns the status codes. */
async function sendEach(post, headerSets, body) {
  const results = [];
  for (const headers of headerSets) results.push(await post(headers, body));
  return statuses(results);
}
const FIVE_THEN_REFUSED = [422, 422, 422, 422, 422, 429];
const xff = (value) => ({ "x-forwarded-for": value });
const sixOf = (make) => Array.from({ length: 6 }, (_, i) => make(i));
/** An endless body of 1 KiB chunks that records how much was pulled and whether it was cancelled. */
function endlessBody() {
  const state = { pulled: 0, cancelled: false };
  const stream = new ReadableStream({
    pull: (c) => (state.pulled++, c.enqueue(new Uint8Array(1024))),
    cancel: () => (state.cancelled = true),
  });
  return { stream, state };
}

describe("TRUSTED_PROXY_HOPS = 0 (default)", () => {
  test("X-Forwarded-For is ignored: a fixed value cannot lock anyone out", async () => {
    const post = await freshRoute();
    assert.deepEqual(await sendEach(post, Array(8).fill(xff("192.0.2.44"))), Array(8).fill(422));
  });
});

describe("TRUSTED_PROXY_HOPS = 1 (one appending proxy)", () => {
  test("6th request from one client is refused", async () => {
    withHops("1");
    const post = await freshRoute();
    assert.deepEqual(await sendEach(post, sixOf(() => xff("203.0.113.10"))), FIVE_THEN_REFUSED);
  });

  test("rotating the client-controlled prefix does not escape the limit", async () => {
    withHops("1");
    const post = await freshRoute();
    assert.deepEqual(await sendEach(post, sixOf((i) => xff(`198.51.100.${i}, 203.0.113.11`))), FIVE_THEN_REFUSED);
  });

  test("a spoofed prefix naming a victim does not consume the victim's bucket", async () => {
    withHops("1");
    const post = await freshRoute();
    await sendEach(post, sixOf(() => xff("192.0.2.50, 203.0.113.12")));
    assert.equal((await post(xff("192.0.2.50"))).status, 422);
  });

  test("invalid and oversized values share one bounded bucket", async () => {
    withHops("1");
    const post = await freshRoute();
    const values = [",", "unknown", "a".repeat(8000), "999.0.0.1", "not-an-ip", "x"];
    assert.deepEqual(await sendEach(post, values.map(xff)), FIVE_THEN_REFUSED);
  });

  test("rotating ports, brackets or zone IDs shares the invalid bucket instead of minting keys", async () => {
    withHops("1");
    for (const make of [
      (i) => `203.0.113.15:${40000 + i}`,
      (i) => `[2001:db8::15]:${40000 + i}`,
      (i) => `[2001:db8::${i + 1}]`,
      (i) => `fe80::1%eth${i}`,
    ]) {
      const post = await freshRoute();
      assert.deepEqual(await sendEach(post, sixOf((i) => xff(make(i)))), FIVE_THEN_REFUSED, make(0));
    }
  });

  test("other client-supplied address headers do not change the key", async () => {
    withHops("1");
    const post = await freshRoute();
    const headerSets = sixOf((i) => ({
      ...xff("203.0.113.16"),
      forwarded: `for=198.51.100.${i}`,
      "x-real-ip": `198.51.100.${i}`,
      "cf-connecting-ip": `198.51.100.${i}`,
      "true-client-ip": `198.51.100.${i}`,
    }));
    assert.deepEqual(await sendEach(post, headerSets), FIVE_THEN_REFUSED);
  });

  test("a client-sent X-Forwarded-For line is combined with the proxy's; only the last entry counts", async () => {
    withHops("1");
    const post = await freshRoute();
    const headerSets = sixOf((i) => {
      const headers = new Headers();
      headers.append("x-forwarded-for", `198.51.100.${i}`); // from the client
      headers.append("x-forwarded-for", "203.0.113.17"); // appended by the proxy
      return Object.fromEntries(headers);
    });
    assert.equal(headerSets[0]["x-forwarded-for"], "198.51.100.0, 203.0.113.17");
    assert.deepEqual(await sendEach(post, headerSets), FIVE_THEN_REFUSED);
  });

  test("10 concurrent requests from one client: exactly 5 pass", async () => {
    withHops("1");
    const post = await freshRoute();
    const codes = statuses(await Promise.all(Array.from({ length: 10 }, () => post(xff("203.0.113.13")))));
    assert.equal(codes.filter((c) => c === 422).length, 5);
    assert.equal(codes.filter((c) => c === 429).length, 5);
  });

  test("an over-limit request is refused before its body is read", async () => {
    withHops("1");
    const post = await freshRoute();
    await sendEach(post, Array(5).fill(xff("203.0.113.14")));
    const { stream, state } = endlessBody();
    assert.equal((await post(xff("203.0.113.14"), stream)).status, 429);
    assert.equal(state.pulled <= 1, true, `pulled ${state.pulled} chunks`);
  });
});

describe("TRUSTED_PROXY_HOPS = 2 (CDN, then load balancer)", () => {
  test("the client is the second entry from the right; rotating either end does not escape", async () => {
    withHops("2");
    const post = await freshRoute();
    const codes = await sendEach(post, sixOf((i) => xff(`198.51.100.${i}, 203.0.113.20, 10.0.0.${i}`)));
    assert.deepEqual(codes, FIVE_THEN_REFUSED);
    assert.equal((await post(xff("203.0.113.21, 10.0.0.1"))).status, 422);
  });

  test("a chain shorter than the configured hops cannot pick its own key", async () => {
    withHops("2");
    const post = await freshRoute();
    assert.deepEqual(await sendEach(post, sixOf((i) => xff(`203.0.113.${100 + i}`))), FIVE_THEN_REFUSED);
  });
});

describe("request body limit (16 KiB)", () => {
  test("oversized Content-Length gets 413", async () => {
    const post = await freshRoute();
    const body = JSON.stringify({ notes: "x".repeat(20_000) });
    const response = await post({ "content-length": String(Buffer.byteLength(body)) }, body);
    assert.equal(response.status, 413);
    assert.equal((await response.json()).ok, false);
  });

  test("streamed body without Content-Length gets 413 and is cancelled", async () => {
    const post = await freshRoute();
    const { stream, state } = endlessBody();
    assert.equal((await post({}, stream)).status, 413);
    assert.equal(state.cancelled, true);
    assert.equal(state.pulled <= 20, true, `pulled ${state.pulled} chunks`);
  });

  test("malformed or misleading Content-Length cannot get an endless body past 413", async () => {
    const post = await freshRoute();
    for (const declared of ["abc", "-1", "0", "10", "10, 99999", "NaN"]) {
      const { stream, state } = endlessBody();
      assert.equal((await post({ "content-length": declared }, stream)).status, 413, declared);
      assert.equal(state.cancelled, true, declared);
      assert.equal(state.pulled <= 20, true, `${declared}: pulled ${state.pulled} chunks`);
    }
  });

  test("a malformed Content-Length on a small body is still validated normally", async () => {
    const post = await freshRoute();
    for (const declared of ["abc", "-1", "10, 99999"]) {
      assert.equal((await post({ "content-length": declared }, "{}")).status, 422, declared);
    }
  });

  test("malformed JSON within the limit still gets 400", async () => {
    const post = await freshRoute();
    assert.equal((await post({}, "{not json")).status, 400);
  });
});
