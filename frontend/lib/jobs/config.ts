import "server-only";

// One application address for every vacancy. Defaults to the existing company contact address.
export function applicationEmail(): string {
  const email = process.env.JOBS_APPLICATION_EMAIL ?? "sollicitatie@msinfra.be";
  if (!/^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    throw new Error("JOBS_APPLICATION_EMAIL must be a valid email address.");
  }
  return email;
}

export function siteUrl(): URL {
  return new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");
}
