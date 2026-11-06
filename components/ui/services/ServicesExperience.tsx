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
  // Warranty service
  {
    className: "left-5 right-5 top-7",
    width: "max-w-[340px]",
    enterX: 0,
    enterY: -30,
  },

  // Installation
  {
    className: "bottom-[19%] left-5 right-5",
    width: "max-w-[340px]",
    enterX: 0,
    enterY: 30,
  },

  // Recoding: wider text area to accommodate the description
  {
    className: "left-5 top-7",
    width: "w-[78vw] max-w-[330px]",
    enterX: -35,
    enterY: 0,
  },

  // Preventive maintenance
  {
    className: "right-5 top-7",
    width: "w-[58vw] max-w-[220px]",
    enterX: 35,
    enterY: 0,
  },

  // Emergency opening
  {
    className: "left-5 right-5 top-7",
    width: "max-w-[340px]",
    enterX: 0,
    enterY: -30,
  },

  // Consultation
  {
    className: "bottom-[19%] left-5 right-5",
    width: "max-w-[340px]",
    enterX: 0,
    enterY: 30,
  },
];

export default function ServicesExperience({ englishContent }: { englishContent?: typeof servicesContent }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mobileHeight, setMobileHeight] = useState(700);

  const localizedServices = englishContent ? Array.from({ length: 6 }, (_, index) => ({ title: englishContent[`title${index + 1}` as keyof typeof englishContent], description: englishContent[`description${index + 1}` as keyof typeof englishContent] })) : services;
  const activeService = localizedServices[activeIndex];
  const mobileText = mobileTextLayouts[activeIndex];

  // Use the visible viewport height to account for mobile browser toolbars.

  useEffect(() => {
    function updateViewportHeight() {
      const viewportHeight =
        window.visualViewport?.height ??
        window.innerHeight;

      document.documentElement.style.setProperty(
        "--tetra-mobile-height",
        `${Math.floor(viewportHeight)}px`
      );
      setMobileHeight(Math.floor(viewportHeight));
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
      textClass: "left-[21%]",
      textFromLeft: true,
    },
    {
      safeLeft: "6%",
      textClass: "right-[8%]",
      textFromLeft: false,
    },
  ];

  // Apply separate framing for compact desktop viewports.
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
      onClick={() => { if (window.innerWidth >= 1024) goToNextService(); }}
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
      className="
        relative
        overflow-x-hidden
        lg:overflow-hidden
        font-[Arial,Helvetica,sans-serif]
        bg-white
        pt-20
        text-black
        lg:min-h-screen
      "
    >
      {}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[52%] h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.035] blur-[120px]" />
      </div>

      {}

      <section
        className="relative z-20 px-5 pb-5 pt-4 sm:px-8 lg:hidden"
        style={{ touchAction: "pan-y" }}
        aria-label={englishContent ? "Services" : "Услуги"}
        onClick={(event) => {
          // Never hijack buttons, links, or other interactive elements.
          const target = event.target;
          if (!(target instanceof Element)) return;
          if (target.closest('button, a, input, select, textarea, [role="button"], [data-no-service-advance]')) return;
          // A normal tap advances; scrolling is handled natively by the browser.
          goToNextService();
        }}
      >
        <div className="mx-auto flex max-w-xl flex-col" style={{ minHeight: `max(0px, ${mobileHeight - 116}px)` }}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h1 className="text-xl font-semibold text-[#172033]">
              {englishContent ? "Services & Support" : "Услуги и сервиз"}
            </h1>
            <span className="text-xs font-semibold tracking-[0.12em] text-[#3f7edb]">
              {String(activeIndex + 1).padStart(2, "0")} / {String(localizedServices.length).padStart(2, "0")}
            </span>
          </div>
          <div
            className="relative flex flex-1 flex-col"
            aria-live="polite"
            style={{
              // Reserve enough space for the three-line reference heading on every slide.
              // Dot buttons are 16px high with 4px gaps: the last center is 108px from their top.
              "--service-title-font-size": `clamp(26px, ${Math.min(9, Math.max(6.5, mobileHeight / 95))}vw, 48px)`,
              "--service-title-slot-height": "calc(3 * var(--service-title-font-size) * 1.08 + 24px)",
            } as React.CSSProperties}
          >
            {/* The last dot and divider share the bottom edge of the same title slot. */}
            <div className="absolute right-0 z-10 flex flex-col items-center gap-1" style={{ top: "calc(var(--service-title-slot-height) - 108px)" }} aria-label={englishContent ? "Service position" : "Позиция на услугата"}>
              {localizedServices.map((_, index) => (
                <button
                  type="button"
                  key={index}
                  aria-label={`${englishContent ? "Service" : "Услуга"} ${index + 1}`}
                  aria-current={index === activeIndex ? "step" : undefined}
                  onClick={() => selectService(index)}
                  className="flex h-4 w-5 items-center justify-center"
                >
                  <span className={`h-2 w-2 rounded-full transition-all duration-300 ${index === activeIndex ? "scale-125 bg-[#3f7edb]" : "bg-[#3f7edb]/25"}`} />
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.article
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-1 flex-col"
                style={{ minHeight: `max(0px, ${mobileHeight - 190}px)` }}
              >
                <div className="relative shrink-0" style={{ height: "var(--service-title-slot-height)" }}>
                  <h2
                    data-cms-field={`title${activeIndex + 1}`}
                    className="absolute bottom-5 left-0 right-8 font-medium leading-[1.08] tracking-[-0.035em] text-[#3f7edb]"
                    style={{ fontSize: "var(--service-title-font-size)" }}
                  >
                    {activeService.title}
                  </h2>
                  <div className="absolute bottom-0 left-0 h-px w-16 bg-[#3f7edb]" />
                </div>
                {/* Fixed-height description zone keeps the icon row at identical coordinates
                    on every slide. The text starts higher; spare viewport height stays below icons. */}
                <div
                  className="flex shrink-0 flex-col justify-start"
                  style={{
                    height: `clamp(190px, ${Math.round(mobileHeight * 0.4 - 80)}px, 260px)`,
                    paddingTop: "clamp(24px, 4vh, 44px)",
                  }}
                >
                  <p data-cms-field={`description${activeIndex + 1}`} className="text-[#263244]"
                    style={{ fontSize: `clamp(12px, ${mobileHeight / 45}px, 16px)`, lineHeight: mobileHeight < 650 ? 1.4 : 1.7 }}>
                    {activeService.description}
                  </p>
                </div>
                <div className="grid shrink-0 grid-cols-3 gap-2 border-y border-black/10 py-3 text-center">
                  {serviceDetails[activeIndex].map(({ icon: Icon, label }, index) => (
                    <motion.div
                      key={`${activeIndex}-${index}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.38, delay: 0.12 + index * 0.09, ease: [0.22, 1, 0.36, 1] }}
                      className="flex min-w-0 flex-col items-center"
                    >
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.38, delay: 0.12 + index * 0.09, ease: [0.22, 1, 0.36, 1] }}
                        className="mb-2 flex items-center justify-center rounded-full border border-[#3f7edb]/35 text-[#3f7edb]"
                        style={{ width: `clamp(34px, ${mobileHeight / 13}px, 48px)`, height: `clamp(34px, ${mobileHeight / 13}px, 48px)` }}
                      >
                        <Icon size={mobileHeight < 650 ? 19 : 24} strokeWidth={1.8} aria-hidden="true" />
                      </motion.div>
                      <p className="min-h-[44px] break-words leading-[1.35] text-[#172033]"
                        style={{ fontSize: `clamp(11px, ${mobileHeight / 45}px, 16px)` }}>
                        {englishContent ? englishServiceDetails[activeIndex][index] : label}
                      </p>
                    </motion.div>
                  ))}
                </div>
                {/* Remaining height is below the icons, not between content blocks. */}
                <div className="min-h-0 flex-1" aria-hidden="true" />
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <div className="hidden lg:block">
        

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

        <div className="relative mx-auto h-[calc(100vh-5rem)] max-w-[1600px] px-12">
          

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

              {/* Three details for the active service. */}
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