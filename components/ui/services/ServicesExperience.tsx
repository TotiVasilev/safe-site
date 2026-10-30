"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import SafeScene from "@/components/ui/services/SafeScene";
import { ShieldCheck, Wrench, RefreshCw, KeyRound, LockKeyhole, Settings, Hash, SlidersHorizontal, SearchCheck, LockOpen, CircleAlert, Shield, ClipboardList, MessageCircle } from "lucide-react";

import servicesContent from "@/content/services.json";

const services = Array.from({ length: 6 }, (_, index) => ({
  title: servicesContent[`title${index + 1}` as keyof typeof servicesContent],
  description: servicesContent[`description${index + 1}` as keyof typeof servicesContent],
}));

const serviceDetails = [
  [{ icon: ShieldCheck, label: "Гаранционно обслужване" }, { icon: Wrench, label: "Диагностика и ремонт" }, { icon: RefreshCw, label: "Подмяна на компоненти" }],
  [{ icon: KeyRound, label: "Механични ключалки" }, { icon: LockKeyhole, label: "Електронни ключалки" }, { icon: Settings, label: "Монтаж и настройка" }],
  [{ icon: Hash, label: "Промяна на кодове" }, { icon: ShieldCheck, label: "Контрол на достъпа" }, { icon: Settings, label: "Настройка на системи" }],
  [{ icon: SearchCheck, label: "Технически преглед" }, { icon: SlidersHorizontal, label: "Проверка и настройка" }, { icon: ShieldCheck, label: "Превенция на повреди" }],
  [{ icon: LockOpen, label: "Възстановяване на достъпа" }, { icon: CircleAlert, label: "Блокирали механизми" }, { icon: Shield, label: "Внимателна намеса" }],
  [{ icon: ClipboardList, label: "Оценка на нуждите" }, { icon: ShieldCheck, label: "Избор на защита" }, { icon: MessageCircle, label: "Индивидуално решение" }],
];

const englishServiceDetails = [["Warranty service", "Diagnostics and repair", "Component replacement"], ["Mechanical locks", "Electronic locks", "Installation and configuration"], ["Code changes", "Access control", "System configuration"], ["Technical inspection", "Inspection and adjustment", "Fault prevention"], ["Restoring access", "Jammed mechanisms", "Careful intervention"], ["Needs assessment", "Choosing protection", "Tailored solution"]];

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
  |
  | IMPORTANT:
  | Much wider than before.
  |
  | Old:
  | w-[62vw] max-w-[235px]
  |
  | New:
  | w-[78vw] max-w-[330px]
  |--------------------------------------------------------------------------
  */
  {
    className: "left-5 top-7",
    width: "w-[78vw] max-w-[330px]",
    enterX: -35,
    enterY: 0,
  },

  /*
  |--------------------------------------------------------------------------
  | 4 - ПРОФИЛАКТИКА
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
  |--------------------------------------------------------------------------
  */
  {
    className: "bottom-[19%] left-5 right-5",
    width: "max-w-[340px]",
    enterX: 0,
    enterY: 30,
  },
];

export default function ServicesExperience({ englishContent }: { englishContent?: typeof servicesContent }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const localizedServices = englishContent ? Array.from({ length: 6 }, (_, index) => ({ title: englishContent[`title${index + 1}` as keyof typeof englishContent], description: englishContent[`description${index + 1}` as keyof typeof englishContent] })) : services;
  const activeService = localizedServices[activeIndex];
  const mobileText = mobileTextLayouts[activeIndex];

  /*
  |--------------------------------------------------------------------------
  | REAL MOBILE VIEWPORT HEIGHT
  |--------------------------------------------------------------------------
  |
  | iOS Safari, Chrome and in-app browsers can all expose slightly
  | different visible viewport heights because their browser bars are
  | different.
  |
  | visualViewport.height tells us how much space is ACTUALLY visible.
  |
  */

  useEffect(() => {
    function updateViewportHeight() {
      const viewportHeight =
        window.visualViewport?.height ??
        window.innerHeight;

      document.documentElement.style.setProperty(
        "--tetra-mobile-height",
        `${Math.floor(viewportHeight)}px`
      );
    }

    updateViewportHeight();

    const visualViewport =
      window.visualViewport;

    visualViewport?.addEventListener(
      "resize",
      updateViewportHeight
    );

    window.addEventListener(
      "resize",
      updateViewportHeight
    );

    window.addEventListener(
      "orientationchange",
      updateViewportHeight
    );

    return () => {
      visualViewport?.removeEventListener(
        "resize",
        updateViewportHeight
      );

      window.removeEventListener(
        "resize",
        updateViewportHeight
      );

      window.removeEventListener(
        "orientationchange",
        updateViewportHeight
      );
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | DESKTOP LAYOUT
  |--------------------------------------------------------------------------
  */

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
      safeLeft: "53%",
      textClass: "left-[16%]",
      textFromLeft: true,
    },
    {
      safeLeft: "6%",
      textClass: "right-[8%]",
      textFromLeft: false,
    },
    {
      safeLeft: "53%",
      textClass: "left-[15%]",
      textFromLeft: true,
    },
    {
      safeLeft: "6%",
      textClass: "right-[8%]",
      textFromLeft: false,
    },
  ];

  // Compact laptop framing only. Full-size desktop positions are unchanged.
  const [compactLaptop, setCompactLaptop] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px) and (max-width: 1599px)");
    const update = () => setCompactLaptop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const currentLayout = sceneLayouts[activeIndex];
  const safeLeft = compactLaptop && [1, 3, 5].includes(activeIndex)
    ? "13%"
    : currentLayout.safeLeft;

  function goToNextService() {
    setActiveIndex((current) =>
      current === localizedServices.length - 1
        ? 0
        : current + 1
    );
  }

  function selectService(index: number) {
    setActiveIndex(index);
  }

  return (
    <main
      onClick={goToNextService}
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
      className="
        relative
        overflow-hidden
        font-[Arial,Helvetica,sans-serif]
        bg-white
        pt-20
        text-black
        lg:min-h-screen
      "
    >
      {/* =========================================================
          BACKGROUND
      ========================================================= */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[52%] h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.035] blur-[120px]" />
      </div>

      {/* =========================================================
          MOBILE
      ========================================================= */}

      <div
        className="relative w-full overflow-hidden lg:hidden"
        style={{
          height:
            "calc(var(--tetra-mobile-height, 100svh) - 5rem)",
        }}
      >
        {/* =======================================================
            3D SAFE
        ======================================================= */}

        <div className="pointer-events-none absolute inset-0 z-10">
          <SafeScene
            activeIndex={activeIndex}
            mobile
          />
        </div>

        {/* =======================================================
            MOBILE TEXT
        ======================================================= */}

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
              x:
                mobileText.enterX *
                0.6,
              y:
                mobileText.enterY *
                0.6,
            }}
            transition={{
              duration: 0.5,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            className={`absolute z-30 ${mobileText.className}`}
          >
            <div
              className={
                mobileText.width
              }
            >
              <p className="text-base font-semibold tracking-normal text-[#172033]">
                {englishContent ? "Services & Support" : "Услуги и сервиз"}
              </p>

              <h1 data-cms-field={`title${activeIndex + 1}`} className="mt-4 text-[42px] font-medium leading-[1.02] tracking-[-0.045em] text-[#3f7edb]">
                {activeService.title}
              </h1>

              <div className="mt-5 h-px w-12 bg-[#3f7edb]" />

              <p data-cms-field={`description${activeIndex + 1}`} className="mt-5 text-[15px] leading-[1.7] text-[#263244]">
                {
                  activeService.description
                }
              </p>
            </div>
          </motion.section>
        </AnimatePresence>
      </div>

      {/* =========================================================
          DESKTOP
      ========================================================= */}

      <div className="hidden lg:block">
        {/* =======================================================
            LEFT SERVICE MENU
        ======================================================= */}

        <nav
          onClick={(event) =>
            event.stopPropagation()
          }
          className="absolute left-10 top-1/2 z-30 hidden -translate-y-1/2 xl:block"
        >
          <div className="mb-10">
            <p className="text-[24px] font-semibold leading-none tracking-normal text-[#172033]">
              {englishContent ? "Services & Support" : "Услуги и сервиз"}
            </p>
          </div>

          <div className="relative flex flex-col gap-9">
            <div className="absolute left-[5px] top-3 h-[calc(100%-24px)] w-px bg-black/15" />

            {localizedServices.map(
              (service, index) => {
                const active =
                  activeIndex === index;

                return (
                  <button
                    type="button"
                    data-cms-service-index={index}
                    key={
                      service.title
                    }
                    onClick={() =>
                      selectService(
                        index
                      )
                    }
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
                      data-cms-field={`title${index + 1}`}
                      className={`max-w-[185px] text-sm leading-5 transition-all duration-300 ${
                        active
                          ? "font-medium text-[#3f7edb]"
                          : "text-black/45 group-hover:text-black"
                      }`}
                    >
                      {
                        service.title
                      }
                    </span>
                  </button>
                );
              }
            )}
          </div>
        </nav>

        {/* =======================================================
            DESKTOP STAGE
        ======================================================= */}

        <div className="relative mx-auto h-[calc(100vh-5rem)] max-w-[1600px] px-12">
          {/* SAFE */}

          <motion.div
            animate={{
              left:
                safeLeft,
            }}
            transition={{
              duration: 0.9,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            className="absolute bottom-[5%] top-[5%] z-10 w-[47%]"
          >
            <SafeScene
              activeIndex={
                activeIndex
              }
            />
          </motion.div>

          {/* TEXT */}

          <AnimatePresence mode="wait">
            <motion.section
              key={
                activeService.title
              }
              initial={{
                opacity: 0,
                x:
                  currentLayout.textFromLeft
                    ? -90
                    : 90,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x:
                  currentLayout.textFromLeft
                    ? 60
                    : -60,
              }}
              transition={{
                duration: 0.65,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
              className={`absolute top-1/2 z-20 w-[33%] -translate-y-1/2 ${currentLayout.textClass}`}
            >
              <h1 data-cms-field={`title${activeIndex + 1}`} className="text-[60px] font-medium leading-[1.04] tracking-[-0.035em] text-[#3f7edb]">
                {
                  activeService.title
                }
              </h1>

              <div className="mt-8 h-px w-16 bg-[#3f7edb]" />

              <p data-cms-field={`description${activeIndex + 1}`} className="mt-8 max-w-xl text-[16px] leading-[1.75] text-[#263244]">
                {
                  activeService.description
                }
              </p>

              {/* Service-specific details; preserve the existing three-column row. */}
              <div className="mt-10 grid max-w-xl grid-cols-3 gap-6 border-t border-black/10 pt-8">
                {serviceDetails[activeIndex].map(({ icon: Icon, label }, index) => (
                  <div key={`${activeIndex}-${index}`}>
                    <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full border border-[#3f7edb]/35 text-[#3f7edb]">
                      <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
                    </div>
                    <p className="text-sm font-medium leading-5">{englishContent ? englishServiceDetails[activeIndex][index] : label}</p>
                  </div>
                ))}
              </div>
            </motion.section>
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}