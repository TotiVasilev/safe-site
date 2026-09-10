import Link from "next/link";
import Partners from "@/components/ui/Partners";
import Reveal from "@/components/ui/Reveal";
import ProductGrid from "@/components/ui/ProductGrid";
import { productCategories } from "@/data/products";

export default function Home() {
  return (
    <main className="overflow-hidden bg-white text-black">
      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative min-h-screen overflow-hidden px-6 pb-16 pt-28 lg:px-12">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.035)_1px,transparent_1px)] bg-[size:72px_72px]" />

          <div className="absolute right-[-10%] top-[20%] h-[650px] w-[650px] rounded-full bg-[#3f7edb]/[0.07] blur-[120px]" />
        </div>

        <div className="relative mx-auto flex min-h-[calc(100vh-7rem)] max-w-7xl items-center">
          <div className="grid w-full items-center gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
            {/* LEFT */}
            <Reveal direction="fade" duration={1}>
              <div className="relative z-20">
                <h1 className="max-w-4xl text-[clamp(3rem,5.1vw,5.8rem)] font-medium leading-[0.94] tracking-[-0.045em]">
                  Сигурност,
                  <br />
                  създадена
                  <br />
                  да издържи
                </h1>

                <p className="mt-9 max-w-xl text-base leading-8 text-black/55 sm:text-lg">
                  Професионални решения за физическа сигурност,
                  сейфове, трезорни системи и специализирано банково
                  оборудване.
                </p>

                <div className="mt-10 flex flex-wrap items-center gap-7">
                  <Link
                    href="/produkti"
                    className="group inline-flex items-center gap-4 bg-[#3f7edb] px-7 py-4 text-sm font-medium text-white transition-all duration-300 hover:bg-[#326dc3]"
                  >
                    Разгледайте продуктите
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>

                  <Link
                    href="/uslugi"
                    className="group inline-flex items-center gap-3 text-sm font-medium text-black/65 transition-colors hover:text-black"
                  >
                    Услуги и сервиз
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* RIGHT - TECHNICAL SAFE */}
            <Reveal direction="up" duration={1}>
              <div className="relative mx-auto h-[560px] w-full max-w-[620px] lg:h-[670px]">
                {/* HEIGHT */}
                <div className="absolute bottom-[13%] left-[3%] top-[15%] w-px bg-black/15" />
                <div className="absolute left-[-8px] top-[15%] h-px w-4 bg-black/30" />
                <div className="absolute bottom-[13%] left-[-8px] h-px w-4 bg-black/30" />

                <span className="absolute left-[-30px] top-1/2 -rotate-90 text-[9px] uppercase tracking-[0.25em] text-black/30">
                  Височина
                </span>

                {/* WIDTH */}
                <div className="absolute bottom-[7%] left-[18%] right-[6%] h-px bg-black/15" />
                <div className="absolute bottom-[calc(7%-8px)] left-[18%] h-4 w-px bg-black/30" />
                <div className="absolute bottom-[calc(7%-8px)] right-[6%] h-4 w-px bg-black/30" />

                <span className="absolute bottom-[2%] left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-[0.25em] text-black/30">
                  Ширина
                </span>

                {/* SHADOW */}
                <div className="absolute bottom-[14%] left-1/2 h-14 w-[62%] -translate-x-1/2 rounded-[50%] bg-black/10 blur-2xl" />

                {/* SAFE */}
                <div className="absolute left-1/2 top-1/2 h-[70%] w-[56%] -translate-x-1/2 -translate-y-1/2 bg-[#25292f] shadow-[24px_35px_70px_rgba(0,0,0,0.22)]">
                  <div className="absolute inset-x-0 top-0 h-px bg-white/20" />
                  <div className="absolute bottom-0 right-0 top-0 w-px bg-white/10" />

                  <div className="absolute inset-[6%] border border-white/10 bg-[#30353c] shadow-[inset_-14px_-10px_28px_rgba(0,0,0,0.2),inset_8px_8px_20px_rgba(255,255,255,0.025)]">
                    {/* LOCK */}
                    <div className="absolute right-[17%] top-[28%] flex h-20 w-20 items-center justify-center rounded-full border border-white/15 bg-[#202329] shadow-[0_10px_25px_rgba(0,0,0,0.25)]">
                      <div className="h-11 w-11 rounded-full border border-white/15 bg-[#343941]">
                        <div className="mx-auto mt-[9px] h-6 w-[2px] bg-white/35" />
                      </div>
                    </div>

                    {/* HANDLE */}
                    <div className="absolute right-[24%] top-[51%] h-28 w-[7px] -translate-y-1/2 bg-[#b7bcc2] shadow-[0_3px_8px_rgba(0,0,0,0.3)]">
                      <div className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d0d4d8] shadow-md" />
                    </div>

                    <div className="absolute bottom-[8%] left-[8%]">
                      <span className="text-[9px] font-medium uppercase tracking-[0.35em] text-white/25">
                        Tetraedar
                      </span>
                    </div>
                  </div>
                </div>

                {/* LOCK CALLOUT */}
                <div className="absolute right-[-2%] top-[27%] w-[170px]">
                  <div className="mb-2 flex items-center">
                    <div className="h-px flex-1 bg-[#3f7edb]/60" />
                    <div className="h-2 w-2 rounded-full bg-[#3f7edb]" />
                  </div>

                  <p className="text-right text-[10px] uppercase tracking-[0.18em] text-[#3f7edb]">
                    Заключваща система
                  </p>
                </div>

                {/* CONSTRUCTION CALLOUT */}
                <div className="absolute bottom-[22%] left-[4%] w-[150px]">
                  <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-[#3f7edb]">
                    Усилена конструкция
                  </p>

                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-[#3f7edb]" />
                    <div className="h-px flex-1 bg-[#3f7edb]/60" />
                  </div>
                </div>

                <div className="absolute bottom-[10%] right-0">
                  <p className="text-right font-mono text-[9px] leading-5 text-black/30">
                    ТЕТРАЕДАР
                    <br />
                    ФИЗИЧЕСКА СИГУРНОСТ
                    <br />
                    БЪЛГАРИЯ
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =========================================================
          ABOUT
      ========================================================= */}
      <section className="border-t border-black/10 px-6 py-28 lg:px-12 lg:py-40">
        <div className="mx-auto max-w-7xl">
          <Reveal direction="right">
            <div className="max-w-5xl">
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#3f7edb]">
                За нас
              </p>

              <h2 className="mt-6 max-w-4xl text-4xl font-medium leading-[1.04] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
                Защитата започва с правилното инженерно решение
              </h2>

              <div className="mt-10 grid max-w-5xl gap-8 border-t border-black/10 pt-10 md:grid-cols-2">
                <p className="text-base leading-8 text-black/55">
                  Предлагаме професионални решения за защита на
                  ценности, документи и специализирани помещения.
                  Работим с продукти и системи, създадени за надеждна
                  и дългосрочна експлоатация.
                </p>

                <p className="text-base leading-8 text-black/55">
                  От избора на подходящ продукт до монтажа,
                  настройката и последващото обслужване - подходът ни
                  е насочен към сигурността във всеки етап.
                </p>
              </div>
            </div>
          </Reveal>

          {/* FEATURES */}
          <Reveal direction="up">
            <div className="mt-24 grid border-y border-black/10 md:grid-cols-3">
              <div className="border-b border-black/10 py-10 md:border-b-0 md:border-r md:pr-10">
                <h3 className="text-2xl font-medium">
                  Надеждни решения
                </h3>

                <p className="mt-4 max-w-sm text-sm leading-7 text-black/50">
                  Оборудване, предназначено за високо ниво на защита и
                  дългосрочна употреба.
                </p>
              </div>

              <div className="border-b border-black/10 py-10 md:border-b-0 md:border-r md:px-10">
                <h3 className="text-2xl font-medium">
                  Професионален подход
                </h3>

                <p className="mt-4 max-w-sm text-sm leading-7 text-black/50">
                  Решения според конкретните изисквания на клиента,
                  обекта и начина на експлоатация.
                </p>
              </div>

              <div className="py-10 md:pl-10">
                <h3 className="text-2xl font-medium">
                  Сервиз и поддръжка
                </h3>

                <p className="mt-4 max-w-sm text-sm leading-7 text-black/50">
                  Професионално обслужване и подкрепа след доставката и
                  монтажа.
                </p>
              </div>
            </div>
          </Reveal>

          {/* =====================================================
              PARTNERS
          ===================================================== */}
          <Reveal direction="up">
            <div className="mt-28">
              <div className="max-w-5xl">
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#3f7edb]">
                  Доверени партньори
                </p>

                <h2 className="mt-6 max-w-4xl text-4xl font-medium leading-[1.04] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
                  Доверие, изградено с времето
                </h2>

                <p className="mt-8 max-w-2xl text-sm leading-7 text-black/45">
                  Решения за сигурност, използвани от водещи
                  финансови институции.
                </p>
              </div>

              <div className="mt-14">
                <Partners />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* =========================================================
          PRODUCT SHOWCASE
      ========================================================= */}
      <section className="relative overflow-hidden bg-[#171a1f] px-6 py-28 text-white lg:px-12 lg:py-40">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:80px_80px]" />

        <div className="relative mx-auto max-w-7xl">
          <Reveal direction="up">
            <div className="max-w-5xl">
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#6ea4f1]">
                Продуктова гама
              </p>

              <h2 className="mt-6 max-w-4xl text-4xl font-medium leading-[1.04] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
                Оборудване за реална защита
              </h2>

              <div className="mt-10 flex flex-col gap-8 border-t border-white/10 pt-10 sm:flex-row sm:items-end sm:justify-between">
                <p className="max-w-2xl text-base leading-8 text-white/45">
                  Решения за различни нива на физическа сигурност -
                  от сейфове до специализирано банково и трезорно
                  оборудване.
                </p>

                <Link
                  href="/produkti"
                  className="group inline-flex w-fit items-center gap-4 text-sm font-medium text-white"
                >
                  Виж целия каталог

                  <span className="text-[#6ea4f1] transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </Reveal>

          {/* FEATURED PRODUCT */}
          <Reveal direction="up">
            <div className="relative mt-24 min-h-[560px] border-y border-white/10">
              <div className="grid min-h-[560px] items-center gap-16 py-16 lg:grid-cols-2">
                {/* PRODUCT PLACEHOLDER */}
                <div className="relative flex h-[420px] items-center justify-center">
                  <div className="absolute h-[320px] w-[320px] rounded-full bg-[#3f7edb]/10 blur-[80px]" />

                  <div className="relative h-[360px] w-[240px] bg-gradient-to-br from-[#4c535c] via-[#30353c] to-[#202328] shadow-[35px_45px_80px_rgba(0,0,0,0.45)]">
                    <div className="absolute inset-[7%] border border-white/10 bg-[#343a42]">
                      <div className="absolute right-[14%] top-[28%] h-16 w-16 rounded-full border border-white/15 bg-[#22262b]" />

                      <div className="absolute right-[26%] top-[48%] h-24 w-[6px] bg-white/45" />
                    </div>
                  </div>

                  <div className="absolute bottom-8 left-0 hidden w-[170px] lg:block">
                    <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[#6ea4f1]">
                      Усилена конструкция
                    </p>

                    <div className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-[#6ea4f1]" />
                      <span className="h-px flex-1 bg-[#6ea4f1]/50" />
                    </div>
                  </div>
                </div>

                {/* TEXT */}
                <div>
                  <h3 className="text-4xl font-medium leading-[1.04] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
                    Сейфове и системи
                    <br />
                    за физическа сигурност
                  </h3>

                  <p className="mt-7 max-w-lg text-base leading-8 text-white/45">
                    Продуктови решения за защита на ценности,
                    документи и специализирани помещения.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* =========================================================
          CATALOG
      ========================================================= */}
      <section className="px-6 py-28 lg:px-12 lg:py-36">
        <div className="mx-auto max-w-7xl">
          <Reveal direction="up">
            <div className="max-w-5xl">
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#3f7edb]">
                Каталог
              </p>

              <h2 className="mt-6 max-w-4xl text-4xl font-medium leading-[1.04] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
                Основни категории
              </h2>

              <p className="mt-8 max-w-2xl text-sm leading-7 text-black/45">
                Разгледайте основните категории от нашето портфолио.
              </p>
            </div>
          </Reveal>

          <div className="mt-16">
            <ProductGrid categories={productCategories} />
          </div>
        </div>
      </section>

      {/* =========================================================
          SERVICES
      ========================================================= */}
      <section className="border-t border-black/10 px-6 py-28 lg:px-12 lg:py-40">
        <div className="mx-auto max-w-7xl">
          <Reveal direction="left">
            <div className="max-w-5xl">
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#3f7edb]">
                Услуги и сервиз
              </p>

              <h2 className="mt-6 max-w-4xl text-4xl font-medium leading-[1.04] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
                Сигурността не приключва с доставката
              </h2>

              <div className="mt-10 flex flex-col gap-8 border-t border-black/10 pt-10 sm:flex-row sm:items-end sm:justify-between">
                <p className="max-w-2xl text-base leading-8 text-black/55">
                  Консултация, монтаж, прекодиране, профилактика,
                  аварийно отваряне и професионална сервизна
                  поддръжка.
                </p>

                <Link
                  href="/uslugi"
                  className="group inline-flex w-fit items-center gap-5 bg-black px-6 py-4 text-sm font-medium text-white transition-colors hover:bg-[#3f7edb]"
                >
                  Виж услугите

                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
            {/* =========================================================
          INQUIRY
      ========================================================= */}
      <section className="relative overflow-hidden bg-[#3f7edb] px-6 py-28 text-white lg:px-12 lg:py-36">
        {/* SUBTLE GRID */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:72px_72px]" />

        <div className="relative mx-auto max-w-7xl">
          <Reveal direction="up">
            <div className="max-w-5xl">
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/65">
                Запитване
              </p>

              <h2 className="mt-6 max-w-4xl text-4xl font-medium leading-[1.04] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
                Нека намерим правилното решение за вашия обект
              </h2>

              <div className="mt-10 flex flex-col gap-10 border-t border-white/20 pt-10 sm:flex-row sm:items-end sm:justify-between">
                <p className="max-w-2xl text-base leading-8 text-white/70">
                  Свържете се с нас за консултация, продуктово
                  запитване или индивидуално решение според вашите
                  изисквания.
                </p>

                <Link
                  href="/kontakti"
                  className="group inline-flex w-fit shrink-0 items-center gap-5 bg-white px-7 py-4 text-sm font-medium text-black transition-all duration-300 hover:bg-black hover:text-white"
                >
                  Изпратете запитване

                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}