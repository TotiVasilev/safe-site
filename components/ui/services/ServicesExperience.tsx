"use client";

import { useEffect, useRef, useState } from "react";
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
  const [mobileDetail, setMobileDetail] = useState<number | null>(null);
  useEffect(() => {
    const syncFromUrl = () => {
      const raw = new URLSearchParams(window.location.search).get("service");
      const value = raw ? Number(raw) : 0;
      setMobileDetail(Number.isInteger(value) && value >= 1 && value <= 6 ? value - 1 : null);
    };
    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, []);

  function openMobileDetail(index: number) {
    const url = new URL(window.location.href);
    url.searchParams.set("service", String(index + 1));
    window.history.pushState({}, "", url.toString());
    setMobileDetail(index);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function closeMobileDetail() {
    const url = new URL(window.location.href);
    url.searchParams.delete("service");
    window.history.pushState({}, "", url.toString());
    setMobileDetail(null);
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  const [mobileHeight, setMobileHeight] = useState(700);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const suppressSwipeClick = useRef(false);

  const localizedServices = englishContent ? Array.from({ length: 6 }, (_, index) => ({ title: englishContent[`title${index + 1}` as keyof typeof englishContent], description: englishContent[`description${index + 1}` as keyof typeof englishContent] })) : services;
  const activeService = localizedServices[activeIndex];
  const mobileText = mobileTextLayouts[activeIndex];

  // Keep mobile dimensions stable when browser chrome expands/collapses during scrolling.
  // Only remeasure when the physical viewport width changes (e.g. rotation).
  useEffect(() => {
    let measuredWidth = window.innerWidth;

    function updateViewportHeight() {
      const viewportHeight = Math.floor(window.innerHeight);
      document.documentElement.style.setProperty(
        "--tetra-mobile-height",
        `${viewportHeight}px`
      );
      setMobileHeight(viewportHeight);
    }

    function handleResize() {
      // Mobile address-bar animations can fire resize events without changing
      // the layout width. Ignore those to avoid layout shifts while scrolling.
      if (Math.abs(window.innerWidth - measuredWidth) < 2) return;
      measuredWidth = window.innerWidth;
      updateViewportHeight();
    }

    updateViewportHeight();
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
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

      {/* Mobile-only service directory; desktop presentation remains untouched. */}
      <section className="relative z-20 mx-auto w-full max-w-xl px-4 pb-12 pt-5 sm:px-8 lg:hidden" aria-label={englishContent ? "Services" : "Услуги"}>
        <AnimatePresence mode="popLayout" initial={false}>
          {mobileDetail === null ? (
            <motion.div key="service-directory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.12 } }}>
              <div className="mb-5">
                <h1 className="text-[clamp(29px,7.7vw,39px)] font-semibold leading-[1.07] tracking-[-0.06em] text-[#172033]">
                  {englishContent ? "Services & Support" : "Услуги и сервиз"}
                </h1>
                <div className="mt-4 h-[2px] w-12 bg-[#3f7edb]" />
              </div>
              <div className="grid grid-cols-2 items-stretch gap-3 sm:gap-4">
                {localizedServices.map((service, index) => (
                  <motion.button
                    layoutId={`mobile-service-card-${index}`}
                    key={index}
                    type="button"
                    onClick={() => openMobileDetail(index)}
                    transition={{ layout: { duration: 0.48, ease: [0.22, 1, 0.36, 1] } }}
                    className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#dce5f1] bg-white text-left shadow-[0_5px_18px_rgba(24,57,104,0.07)]"
                    style={{ height: 200, minHeight: 200, maxHeight: 200 }}
                    aria-label={service.title}
                  >
                    <motion.div className="relative w-full shrink-0 overflow-hidden bg-[#edf3fa]" style={{ height: 125, minHeight: 125, maxHeight: 125, display: "block" }}>
                      <img src={`/services/mobile-service-${index + 1}.jpg`} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", transform: index === 1 ? "scale(1.28)" : "none" }} loading={index < 2 ? "eager" : "lazy"} />
                    </motion.div>
                    <div className="flex min-h-0 flex-1 items-start px-3 py-3" style={{ height: 75, minHeight: 75 }}>
                      <h2 data-cms-field={`title${index + 1}`} className="text-[13px] font-semibold leading-[1.35] text-[#172033] sm:text-[15px]">{service.title}</h2>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.article
              key={`service-detail-${mobileDetail}`}
              layoutId={`mobile-service-card-${mobileDetail}`}
              transition={{ layout: { duration: 0.48, ease: [0.22, 1, 0.36, 1] } }}
              className="overflow-hidden rounded-2xl bg-white pb-3"
            >
              <button type="button" onClick={closeMobileDetail} className="mb-4 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[#3f7edb]">
                <span aria-hidden="true">←</span> {englishContent ? "All services" : "Всички услуги"}
              </button>
              <motion.div className="relative w-full overflow-hidden rounded-2xl bg-[#edf3fa] shadow-[0_8px_25px_rgba(24,57,104,0.08)]" style={{ height: 215, minHeight: 215 }}>
                <img src={`/services/mobile-service-${mobileDetail + 1}.jpg`} alt="" className="h-full w-full object-cover" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", transform: mobileDetail === 1 ? "scale(1.18)" : "none" }} />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.22, duration: 0.3 } }}>
                <h1 data-cms-field={`title${mobileDetail + 1}`} className="mt-7 text-[29px] font-semibold leading-[1.13] tracking-[-0.035em] text-[#172033]">
                  {localizedServices[mobileDetail].title}
                </h1>
                <p data-cms-field={`description${mobileDetail + 1}`} className="text-[15px] leading-[1.8] text-[#263244]">
                  {localizedServices[mobileDetail].description}
                </p>
                <div className="mt-8 grid grid-cols-3 gap-2 py-5">
                  {serviceDetails[mobileDetail].map(({ icon: Icon, label }, index) => (
                    <div key={index} className="flex min-w-0 flex-col items-center text-center">
                      <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-[#3f7edb]/35 text-[#3f7edb]">
                        <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
                      </span>
                      <span className="break-words text-[12px] font-medium leading-[1.4] text-[#172033]">
                        {englishContent ? englishServiceDetails[mobileDetail][index] : label}
                      </span>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={closeMobileDetail} className="mx-auto mt-6 flex min-h-10 w-fit items-center justify-center rounded-lg bg-[#3f7edb] px-5 py-2.5 text-sm font-semibold text-white shadow-sm">
                  {englishContent ? "Back to all services" : "Обратно към всички услуги"}
                </button>
              </motion.div>
            </motion.article>
          )}
        </AnimatePresence>
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
                  <div key={`${activeIndex}-${index}`} className="flex flex-col items-center text-center">
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