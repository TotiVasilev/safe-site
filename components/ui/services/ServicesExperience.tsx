"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import SafeScene from "@/components/ui/services/SafeScene";

const services = [
  {
    title: "Гаранционен и извънгаранционен сервиз",
    description:
      "Професионално обслужване и поддръжка на сейфове, трезорни системи и заключващи механизми.",
  },
  {
    title: "Монтаж на ключалки",
    description:
      "Монтаж и подмяна на механични и електронни заключващи системи според конкретните изисквания.",
  },
  {
    title:
      "Прекодиране на механични и електронни кодови ключалки",
    description:
      "Настройка, промяна на кодове и преконфигуриране на заключващи механизми.",
  },
  {
    title: "Профилактика на заключващи системи",
    description:
      "Периодична проверка, настройка и профилактика за надеждна и дългосрочна работа.",
  },
  {
    title: "Аварийно отваряне",
    description:
      "Специализирана помощ при блокирали, повредени или недостъпни заключващи системи.",
  },
  {
    title: "Консултация",
    description:
      "Професионална помощ при избор на сейф, заключваща система, монтаж и последваща поддръжка.",
  },
];

type MobileTextLayout = {
  className: string;
  width: string;
  enterX: number;
  enterY: number;
};

const mobileTextLayouts: MobileTextLayout[] = [
  /*
  |--------------------------------------------------------------------------
  | 1 - ГАРАНЦИОНЕН
  | Reference position - DO NOT CHANGE
  |--------------------------------------------------------------------------
  */
  {
    className: "left-5 right-5 top-7",
    width: "max-w-[340px]",
    enterX: 0,
    enterY: -30,
  },

  /*
  |--------------------------------------------------------------------------
  | 2 - МОНТАЖ
  | Bottom text moved UP
  |--------------------------------------------------------------------------
  */
  {
    className: "bottom-[19%] left-5 right-5",
    width: "max-w-[340px]",
    enterX: 0,
    enterY: 30,
  },

  /*
  |--------------------------------------------------------------------------
  | 3 - ПРЕКОДИРАНЕ
  | SAME vertical height as scene 1
  | Same typography
  |--------------------------------------------------------------------------
  */
  {
    className: "left-5 top-7",
    width: "w-[62vw] max-w-[235px]",
    enterX: -35,
    enterY: 0,
  },

  /*
  |--------------------------------------------------------------------------
  | 4 - ПРОФИЛАКТИКА
  | SAME vertical height as scene 1
  | Right aligned composition
  |--------------------------------------------------------------------------
  */
  {
    className: "right-5 top-7",
    width: "w-[58vw] max-w-[220px]",
    enterX: 35,
    enterY: 0,
  },

  /*
  |--------------------------------------------------------------------------
  | 5 - АВАРИЙНО
  | Text position already correct
  |--------------------------------------------------------------------------
  */
  {
    className: "left-5 right-5 top-7",
    width: "max-w-[340px]",
    enterX: 0,
    enterY: -30,
  },

  /*
  |--------------------------------------------------------------------------
  | 6 - КОНСУЛТАЦИЯ
  | Bottom text moved UP
  |--------------------------------------------------------------------------
  */
  {
    className: "bottom-[19%] left-5 right-5",
    width: "max-w-[340px]",
    enterX: 0,
    enterY: 30,
  },
];

export default function ServicesExperience() {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeService = services[activeIndex];
  const mobileText = mobileTextLayouts[activeIndex];

  const sceneLayouts = [
    {
      safeLeft: "53%",
      textClass: "left-[21%]",
      textFromLeft: true,
    },
    {
      safeLeft: "6%",
      textClass: "right-[8%]",
      textFromLeft: false,
    },
    {
      safeLeft: "57%",
      textClass: "left-[16%]",
      textFromLeft: true,
    },
    {
      safeLeft: "6%",
      textClass: "right-[8%]",
      textFromLeft: false,
    },
    {
      safeLeft: "59%",
      textClass: "left-[15%]",
      textFromLeft: true,
    },
    {
      safeLeft: "6%",
      textClass: "right-[8%]",
      textFromLeft: false,
    },
  ];

  const currentLayout = sceneLayouts[activeIndex];

  function goToNextService() {
    setActiveIndex((current) =>
      current === services.length - 1 ? 0 : current + 1
    );
  }

  function selectService(index: number) {
    setActiveIndex(index);
  }

  return (
    <main
      onClick={goToNextService}
      className="relative min-h-screen cursor-pointer overflow-hidden bg-white pt-20 text-black"
    >
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[52%] h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.035] blur-[120px]" />
      </div>

      {/* =========================================================
          MOBILE
      ========================================================= */}
      <div className="relative h-[calc(100svh-5rem)] overflow-hidden lg:hidden">
        {/* FIXED FULL-SCREEN 3D CANVAS */}
        <div className="pointer-events-none absolute inset-0 z-10">
          <SafeScene activeIndex={activeIndex} mobile />
        </div>

        {/* MOBILE TEXT */}
        <AnimatePresence mode="wait">
          <motion.section
            key={`mobile-service-${activeIndex}`}
            initial={{
              opacity: 0,
              x: mobileText.enterX,
              y: mobileText.enterY,
            }}
            animate={{
              opacity: 1,
              x: 0,
              y: 0,
            }}
            exit={{
              opacity: 0,
              x: mobileText.enterX * 0.6,
              y: mobileText.enterY * 0.6,
            }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={`absolute z-30 ${mobileText.className}`}
          >
            <div className={mobileText.width}>
              <p className="text-[9px] font-medium uppercase tracking-[0.29em] text-[#3f7edb]">
                Услуги и сервиз
              </p>

              {/* SAME FONT SIZE ON ALL MOBILE SCENES */}
              <h1 className="mt-4 text-[1.95rem] font-light leading-[1.02] tracking-[-0.04em]">
                {activeService.title}
              </h1>

              <div className="mt-5 h-px w-12 bg-[#3f7edb]" />

              {/* SAME BODY SIZE ON ALL MOBILE SCENES */}
              <p className="mt-5 text-[13px] leading-[1.7] text-black/55">
                {activeService.description}
              </p>
            </div>
          </motion.section>
        </AnimatePresence>
      </div>

      {/* =========================================================
          DESKTOP - UNCHANGED
      ========================================================= */}
      <div className="hidden lg:block">
        <nav
          onClick={(event) => event.stopPropagation()}
          className="absolute left-10 top-1/2 z-30 hidden -translate-y-1/2 xl:block"
        >
          <div className="mb-10">
            <p className="text-base font-medium uppercase tracking-[0.25em] text-[#3f7edb]">
              Услуги и сервиз
            </p>
          </div>

          <div className="relative flex flex-col gap-9">
            <div className="absolute left-[5px] top-3 h-[calc(100%-24px)] w-px bg-black/15" />

            {services.map((service, index) => {
              const active = activeIndex === index;

              return (
                <button
                  type="button"
                  key={service.title}
                  onClick={() => selectService(index)}
                  className="group relative flex items-start gap-5 text-left"
                >
                  <span
                    className={`relative z-10 mt-1.5 h-[11px] w-[11px] rounded-full border transition-all duration-500 ${
                      active
                        ? "scale-125 border-[#3f7edb] bg-[#3f7edb] shadow-[0_0_16px_rgba(63,126,219,0.4)]"
                        : "border-black/40 bg-white group-hover:border-black"
                    }`}
                  />

                  <span
                    className={`max-w-[185px] text-sm leading-5 transition-all duration-300 ${
                      active
                        ? "font-medium text-[#3f7edb]"
                        : "text-black/45 group-hover:text-black"
                    }`}
                  >
                    {service.title}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="relative mx-auto h-[calc(100vh-5rem)] max-w-[1600px] px-12">
          <motion.div
            animate={{
              left: currentLayout.safeLeft,
            }}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute bottom-[5%] top-[5%] z-10 w-[47%]"
          >
            <SafeScene activeIndex={activeIndex} />
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.section
              key={activeService.title}
              initial={{
                opacity: 0,
                x: currentLayout.textFromLeft ? -90 : 90,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: currentLayout.textFromLeft ? 60 : -60,
              }}
              transition={{
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`absolute top-1/2 z-20 w-[33%] -translate-y-1/2 ${currentLayout.textClass}`}
            >
              <h1 className="text-[clamp(2.4rem,3.5vw,4.4rem)] font-light leading-[1.02] tracking-[-0.035em]">
                {activeService.title}
              </h1>

              <div className="mt-8 h-px w-16 bg-[#3f7edb]" />

              <p className="mt-8 max-w-xl text-lg leading-8 text-black/55">
                {activeService.description}
              </p>

              <div className="mt-10 grid max-w-xl grid-cols-3 gap-6 border-t border-black/10 pt-8">
                <div>
                  <div className="mb-3 h-8 w-8 rounded-full border border-black/15" />
                  <p className="text-sm font-medium">
                    Професионално обслужване
                  </p>
                </div>

                <div>
                  <div className="mb-3 h-8 w-8 rounded-full border border-black/15" />
                  <p className="text-sm font-medium">
                    Бърза реакция
                  </p>
                </div>

                <div>
                  <div className="mb-3 h-8 w-8 rounded-full border border-black/15" />
                  <p className="text-sm font-medium">
                    Специализиран екип
                  </p>
                </div>
              </div>
            </motion.section>
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}