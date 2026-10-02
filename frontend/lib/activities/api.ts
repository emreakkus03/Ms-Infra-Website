export type Activity = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  tags: string[];
  hero_image: string | null;
  is_featured: boolean;
  sort_order: number;
};

type ActivityPayload = Omit<Activity, "tags"> & { tags?: unknown };

type ActivitiesResponse = {
  data?: ActivityPayload[];
};

export async function getActivities(
  locale: string,
): Promise<Activity[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is niet ingesteld.");
  }

  const response = await fetch(
    `${apiUrl}/activities?locale=${locale}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(
      "Activiteiten konden niet worden opgehaald.",
    );
  }

  const result: ActivitiesResponse | ActivityPayload[] =
    await response.json();

  const activities = Array.isArray(result) ? result : result.data ?? [];

  return activities.map((activity) => ({
    ...activity,
    tags: Array.isArray(activity.tags)
      ? activity.tags.filter((label): label is string => typeof label === "string" && label.trim().length > 0)
      : [],
  }));
}