import "server-only";
import { cache } from "react";
import type { JobDetail, JobLocale, JobSummary } from "./types";

async function requestJobs(path: string, locale: JobLocale): Promise<unknown | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/jobs${path}?locale=${locale}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(10000),
  });
  if (path && response.status === 404) return null;
  if (!response.ok) throw new Error(`Jobs API returned HTTP ${response.status}.`);
  const result = await response.json();
  if (!result || !("data" in result)) throw new Error("Invalid Jobs API response.");
  return result.data;
}

function isJob(value: unknown): value is JobSummary {
  if (!value || typeof value !== "object") return false;
  const job = value as Record<string, unknown>;
  return typeof job.id === "number" && typeof job.title === "string" && typeof job.slug === "string"
    && (job.locale === "nl" || job.locale === "en")
    && typeof job.alternate_slugs === "object" && job.alternate_slugs !== null;
}

export const getJobs = cache(async (locale: JobLocale): Promise<JobSummary[]> => {
  const jobs = await requestJobs("", locale);
  if (!Array.isArray(jobs) || !jobs.every(isJob)) throw new Error("Invalid Jobs list response.");
  return jobs;
});

export const getJob = cache(async (locale: JobLocale, slug: string): Promise<JobDetail | null> => {
  const job = await requestJobs(`/${encodeURIComponent(slug)}`, locale);
  if (job === null) return null;
  if (!isJob(job) || !("sections" in job) || !Array.isArray(job.sections)) {
    throw new Error("Invalid Job detail response.");
  }
  return job as JobDetail;
});
