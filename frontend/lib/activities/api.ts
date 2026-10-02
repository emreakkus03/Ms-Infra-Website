export type Activity = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  hero_image: string | null;
  is_featured: boolean;
  sort_order: number;
};

type ActivitiesResponse = {
  data?: Activity[];
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

  const result: ActivitiesResponse | Activity[] =
    await response.json();

  if (Array.isArray(result)) {
    return result;
  }

  return result.data ?? [];
}