// Global send budget. nodemailer.createTransport is replaced for the whole file, so sendMail
// is a mock and nothing leaves the process. Each test imports a fresh copy of the route, so
// its budget starts full and tests can run alone or in any order.
import assert from "node:assert/strict";
import { after, afterEach, beforeEach, test } from "node:test";
import nodemailer from "nodemailer";

// Every 4th call fails like an SMTP error, to show failed attempts still use the budget.
let sent = [];
const realCreateTransport = nodemailer.createTransport;
nodemailer.createTransport = () => ({
  sendMail: async (message) => {
    const call = sent.push(message);
    await new Promise((resolve) => setTimeout(resolve, 5)); // let concurrent requests overlap
    if (call % 4 === 0) throw new Error("mock SMTP failure");
    return { messageId: `mock-${call}` };
  },
});
after(() => {
  nodemailer.createTransport = realCreateTransport;
});

const ENV_KEYS = ["SMTP_HOST", "MAIL_TO", "TRUSTED_PROXY_HOPS"];
const savedEnv = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));
beforeEach(() => {
  sent = [];
  process.env.SMTP_HOST = "smtp.invalid";
  process.env.MAIL_TO = "budget-test@example.invalid";
  delete process.env.TRUSTED_PROXY_HOPS;
});
afterEach(() => {
  for (const key of ENV_KEYS) {
    if (savedEnv[key] === undefined) delete process.env[key];
    else process.env[key] = savedEnv[key];
  }
});

const ROUTE = new URL("../../src/app/api/consultation/route.ts", import.meta.url).href;
let instance = 0;

/** A POST helper bound to a new route instance with a full send budget. */
async function freshRoute() {
  const { POST } = await import(`${ROUTE}?instance=${++instance}`);
  return (payload, forwardedFor) =>
    POST(
      new Request("http://localhost/api/consultation", {
        method: "POST",
        headers: { "content-type": "application/json", "x-forwarded-for": forwardedFor },
        body: JSON.stringify(payload),
      }),
    );
}

const valid = {
  fullName: "Test Visitor",
  phone: "010 1234 5678",
  email: "visitor@example.invalid",
  projectType: "Apartment",
  notes: "Budget test",
};

test("honeypot and invalid requests do not consume the send budget", async () => {
  const post = await freshRoute();
  for (let i = 0; i < 30; i++) {
    const honeypot = await post({ ...valid, website: "spam" }, `198.51.100.${i}`);
    assert.equal(honeypot.status, 200);
    assert.deepEqual(await honeypot.json(), { ok: true });
    assert.equal((await post({ ...valid, email: "nope" }, `198.51.100.${i}`)).status, 422);
  }
  assert.equal(sent.length, 0);

  // The full budget is still there afterwards.
  const codes = (await Promise.all(Array.from({ length: 21 }, (_, i) => post(valid, `203.0.113.${i}`)))).map((r) => r.status);
  assert.equal(sent.length, 20);
  assert.equal(codes.filter((c) => c === 503).length, 1);
});

test("rotated client identifiers and failed sends cannot push sendMail past 20 per hour", async () => {
  const post = await freshRoute();
  const results = await Promise.all(Array.from({ length: 30 }, (_, i) => post(valid, `203.0.113.${i}`)));
  const codes = results.map((r) => r.status);
  assert.equal(sent.length, 20);
  assert.equal(codes.filter((c) => c === 200).length, 15);
  assert.equal(codes.filter((c) => c === 502).length, 5);
  assert.equal(codes.filter((c) => c === 503).length, 10);

  const refused = await post(valid, "192.0.2.1");
  assert.equal(refused.status, 503);
  assert.match((await refused.json()).message, /WhatsApp/);
  assert.equal(sent.length, 20);
  assert.ok(sent.every((m) => m.to === "budget-test@example.invalid"));
});
