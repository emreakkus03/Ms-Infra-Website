"use client";

import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";

export default function ContactForm() {
  const t = useTranslations("ContactPage.Form");

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatus("loading");
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      subject: formData.get("subject"),
      message: formData.get("message"),
      website: formData.get("website"),
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        throw new Error("NEXT_PUBLIC_API_URL is not configured.");
      }

      const response = await fetch(`${apiUrl}/contact`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Unable to send message.");
      }

      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
      setError(t("error"));
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8 lg:p-10">
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-semibold text-slate-900"
            >
              {t("name")}
            </label>

            <input
              id="name"
              name="name"
              type="text"
              required
              disabled={status === "loading"}
              className="h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-slate-900 outline-none transition focus:border-[#B81C31] focus:ring-2 focus:ring-[#B81C31]/10 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-slate-900"
            >
              {t("email")}
            </label>

            <input
              id="email"
              name="email"
              type="email"
              required
              disabled={status === "loading"}
              className="h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-slate-900 outline-none transition focus:border-[#B81C31] focus:ring-2 focus:ring-[#B81C31]/10 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-semibold text-slate-900"
            >
              {t("phone")}
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              disabled={status === "loading"}
              className="h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-slate-900 outline-none transition focus:border-[#B81C31] focus:ring-2 focus:ring-[#B81C31]/10 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div>
            <label
              htmlFor="subject"
              className="mb-2 block text-sm font-semibold text-slate-900"
            >
              {t("subject")}
            </label>

            <input
              id="subject"
              name="subject"
              type="text"
              required
              disabled={status === "loading"}
              className="h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-slate-900 outline-none transition focus:border-[#B81C31] focus:ring-2 focus:ring-[#B81C31]/10 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="message"
            className="mb-2 block text-sm font-semibold text-slate-900"
          >
            {t("message")}
          </label>

          <textarea
            id="message"
            name="message"
            rows={6}
            required
            disabled={status === "loading"}
            className="w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#B81C31] focus:ring-2 focus:ring-[#B81C31]/10 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        {status === "success" && (
          <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
            <span>{t("success")}</span>
          </div>
        )}

        {status === "error" && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
  type="submit"
  disabled={status === "loading" || status === "success"}
  className="group inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#B81C31] px-6 py-3.5 font-semibold text-white transition-colors duration-200 hover:bg-[#971728] disabled:cursor-not-allowed disabled:opacity-60"
>
  {status === "loading" ? (
    <>
      <Loader2 size={18} className="animate-spin" />
      {t("sending")}
    </>
  ) : status === "success" ? (
    <>
      <CheckCircle2 size={18} />
      {t("sent")}
    </>
  ) : (
    <>
      {t("submit")}
      <ArrowRight
        size={18}
        className="transition-transform duration-200 group-hover:translate-x-1"
      />
    </>
  )}
</button>
      </form>
    </div>
  );
}