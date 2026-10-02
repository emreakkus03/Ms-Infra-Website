import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { getActivities } from "../lib/activities/api.ts";

const originalFetch = globalThis.fetch;
const originalUrl = process.env.NEXT_PUBLIC_API_URL;
afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalUrl === undefined) delete process.env.NEXT_PUBLIC_API_URL;
  else process.env.NEXT_PUBLIC_API_URL = originalUrl;
});
function respond(payload) {
  process.env.NEXT_PUBLIC_API_URL = "https://api.example.com/api";
  globalThis.fetch = async () => Response.json(payload);
}
test("ordered localized tags are retained alongside existing activity fields", async () => {
  respond({ data: [{ id: 1, title: "Utilities", slug: "utilities", tags: ["Gas", "Electricity", "Water"] }] });
  const [activity] = await getActivities("en");
  assert.deepEqual(activity.tags, ["Gas", "Electricity", "Water"]);
  assert.equal(activity.slug, "utilities");
});
test("older wrapped and unwrapped responses without tags normalize to empty arrays", async () => {
  for (const response of [{ data: [{ id: 1 }] }, [{ id: 1 }]]) {
    respond(response);
    assert.deepEqual((await getActivities("nl"))[0].tags, []);
  }
});
test("empty or invalid tags are safe for consumers", async () => {
  for (const tags of [null, "Gas", [], [null, 12, " "]]) {
    respond({ data: [{ id: 1, tags }] });
    assert.deepEqual((await getActivities("nl"))[0].tags, []);
  }
});
