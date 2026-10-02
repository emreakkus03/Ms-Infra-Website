import { getTranslations } from "next-intl/server";

const recognitionCodes = [
  "2C2",
  "2C6",
  "2G",
  "2P1",
  "2S",
];

function RecognitionCard({ code }: { code: string }) {
  return (
    <div className="group relative z-10 flex h-[108px] w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#B81C31]/40 hover:shadow-lg">
      <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-[#B81C31] transition-transform duration-300 group-hover:scale-x-100" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(184,28,49,0.06),_transparent_55%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <span className="relative text-2xl font-bold tracking-tight text-slate-900 transition-colors duration-300 group-hover:text-[#B81C31] sm:text-3xl">
        {code}
      </span>
    </div>
  );
}

export default async function AboutRecognitions() {
  const t = await getTranslations("AboutRecognitions");

  return (
    <section className="overflow-hidden bg-slate-50 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-[2px] w-9 bg-[#B81C31]" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B81C31] sm:text-sm">
                {t("eyebrow")}
              </span>
            </div>

            <h2 className="max-w-xl text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              {t("title")}
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              {t("description")}
            </p>
          </div>

          <div>
            <div className="group/diagram relative hidden h-[360px] lg:block">
              <div className="pointer-events-none absolute inset-0">
                <span className="absolute left-[7%] top-[28px] select-none text-[180px] font-black leading-none tracking-[-0.08em] text-slate-900/[0.035] transition-colors duration-300 group-hover/diagram:text-[#B81C31]/[0.05]">
                  M
                </span>

                <span className="absolute right-[2%] top-[110px] select-none text-[180px] font-black leading-none tracking-[-0.08em] text-slate-900/[0.03] transition-colors duration-300 group-hover/diagram:text-[#B81C31]/[0.045]">
                  S
                </span>
              </div>

              <div className="pointer-events-none absolute left-[68px] top-[54px] h-[2px] w-[160px] origin-left rotate-[24deg] rounded-full bg-slate-300 transition-colors duration-300 group-hover/diagram:bg-[#B81C31]/55" />

              <div className="pointer-events-none absolute left-[236px] top-[133px] h-[2px] w-[142px] origin-left -rotate-[28deg] rounded-full bg-slate-300 transition-colors duration-300 group-hover/diagram:bg-[#B81C31]/55" />

              <div className="pointer-events-none absolute right-[236px] top-[133px] h-[2px] w-[142px] origin-right rotate-[28deg] rounded-full bg-slate-300 transition-colors duration-300 group-hover/diagram:bg-[#B81C31]/55" />

              <div className="pointer-events-none absolute right-[68px] top-[54px] h-[2px] w-[160px] origin-right -rotate-[24deg] rounded-full bg-slate-300 transition-colors duration-300 group-hover/diagram:bg-[#B81C31]/55" />

              <div className="absolute left-0 top-0 w-[138px]">
                <RecognitionCard code={recognitionCodes[0]} />
              </div>

              <div className="absolute left-[18%] top-[148px] w-[138px]">
                <RecognitionCard code={recognitionCodes[1]} />
              </div>

              <div className="absolute left-1/2 top-[36px] w-[138px] -translate-x-1/2">
                <RecognitionCard code={recognitionCodes[2]} />
              </div>

              <div className="absolute right-[18%] top-[148px] w-[138px]">
                <RecognitionCard code={recognitionCodes[3]} />
              </div>

              <div className="absolute right-0 top-0 w-[138px]">
                <RecognitionCard code={recognitionCodes[4]} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:hidden">
              {recognitionCodes.map((code, index) => (
                <div
                  key={code}
                  className={index === 4 ? "col-span-2 mx-auto w-full max-w-[170px] sm:col-span-1 sm:max-w-none" : ""}
                >
                  <RecognitionCard code={code} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}