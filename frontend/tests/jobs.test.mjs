import assert from "node:assert/strict";
import { test } from "node:test";
import { safeContentUrl } from "../lib/jobs/content-url.ts";

test("CMS links reject executable and protocol-relative URLs", () => {
  for (const url of ["javascript:alert(1)", "data:text/html,<script>alert(1)</script>", "//evil.example", "/\\evil.example", "https://example.com/\nattack", "file:///etc/passwd"]) {
    assert.equal(safeContentUrl(url), undefined, url);
  }
});
test("CMS URLs preserve localized paths and HTTP(S) storage URLs", () => {
  assert.equal(safeContentUrl("/en/contact"), "/en/contact");
  assert.equal(safeContentUrl("https://cdn.example.com/image.webp"), "https://cdn.example.com/image.webp");
  assert.equal(safeContentUrl("http://localhost:8000/storage/image.jpg"), "http://localhost:8000/storage/image.jpg");
  assert.equal(safeContentUrl(null), undefined);
});
