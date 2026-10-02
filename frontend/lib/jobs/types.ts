export type JobLocale = "nl" | "en";
export type EmploymentType = "full_time" | "part_time" | "temporary" | "internship";
import type { ContentSection } from "../content";
export type { ContentSection } from "../content";
export type JobSummary = {
  id: number; locale: JobLocale; title: string; slug: string;
  short_description: string | null; hero_image: string | null;
  employment_type: EmploymentType | null; location: string | null;
  is_featured: boolean; sort_order: number;
  alternate_slugs: Partial<Record<JobLocale, string>>;
};
export type JobDetail = JobSummary & {
  seo_title: string | null; seo_description: string | null;
  sections: ContentSection[]; updated_at: string | null;
};
