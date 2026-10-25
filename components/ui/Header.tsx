"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Phone, Mail } from "lucide-react";

export default function Header({ contact }: { contact: {phone:string;email:string;address:string;locationLabel:string} }) {
  const pathname = usePathname();
  const english = pathname.startsWith("/en/") || pathname === "/en";
  const localePrefix = english ? "/en" : "";
  const languageTarget = english ? (pathname.replace(/^\/en(?=\/|$)/, "") || "/") : `/en${pathname === "/" ? "/" : pathname}`;


  const [scrolled, setScrolled] =
    useState(false);

  const [menuOpen, setMenuOpen] =
    useState(false);

  // Let the browser restore the previous scroll position on Back/Forward.
  useEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "auto";
    const markHistoryNavigation = () => {
      // The catalog consumes this marker to avoid overriding a restored
      // position with its category hash on a Back/Forward navigation.
      sessionStorage.setItem(
        "tetraedar:history-navigation",
        window.location.pathname + window.location.hash
      );
    };
    window.addEventListener("popstate", markHistoryNavigation);
    return () => {
      window.removeEventListener("popstate", markHistoryNavigation);
      window.history.scrollRestoration = previous;
    };
  }, []);

  /* =========================================================
     HEADER SCROLL STATE
  ========================================================= */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(
        window.scrollY > 30
      );
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  // Close the mobile menu on navigation without resetting page scroll.
  // Next.js and the browser handle new navigations and history restoration.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  function closeMenu() {
    setMenuOpen(false);
  }

  function toggleMenu() {
    setMenuOpen((open) => {
      const next = !open;

      if (next) {
        window.dispatchEvent(
          new Event(
            "tetraedar:main-menu-open"
          )
        );
      }

      return next;
    });
  }

  function isActive(
    path: string
  ) {
    if (path === "/") {
      return pathname === `${localePrefix}/` || pathname === localePrefix;
    }

    return pathname.startsWith(`${localePrefix}${path}`);
  }

  function desktopNavClass(
    path: string
  ) {
    const active =
      isActive(path);

    return `
      flex w-[142px] shrink-0 items-center justify-center whitespace-nowrap
      rounded-xl px-4 py-2.5
      text-sm font-medium
      transition-all duration-300
      ${
        active
          ? "bg-[#3f7edb] text-white shadow-[0_1px_8px_rgba(63,126,219,0.18)]"
          : "text-black/55 hover:bg-white/60 hover:text-black"
      }
    `;
  }

  function mobileNavClass(
    path: string
  ) {
    const active =
      isActive(path);

    return `
      rounded-xl px-4 py-4
      text-xl font-medium
      transition-all duration-300
      ${
        active
          ? "bg-[#3f7edb] text-white"
          : "text-black/65 hover:bg-white/60 hover:text-black"
      }
    `;
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[100] transition-all duration-500 ${
          scrolled
            ? "bg-[#f3f3f2]/95 shadow-[0_2px_12px_rgba(0,0,0,0.035)] backdrop-blur-xl"
            : "bg-[#f5f5f4]/95 backdrop-blur-md"
        }`}
      >
        <div className="relative z-30 mx-auto flex h-16 sm:h-20 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-0">
          {/* LOGO */}

          <Link
            href={`${localePrefix}/`}
            onClick={closeMenu}
            className="flex w-max items-center gap-1.5"
          >
            <Image
              src="/branding/tetraedar-logo.png"
              alt="Tetraedar"
              width={48}
              height={48}
              priority
              className="h-9 sm:h-12 w-auto object-contain"
            />

            <span className="text-[20px] font-medium leading-none tracking-[0.005em] text-[#3f7edb] sm:text-[29px]">ТЕТРАЕДЪР</span>
          </Link>

          {/* DESKTOP NAVIGATION */}

          <nav className="absolute left-[calc(50%-133px)] hidden shrink-0 items-center gap-1 xl:flex">
            <Link
              href={`${localePrefix}/`}
              className={desktopNavClass(
                "/"
              )}
            >
              {english ? "Home" : "Начало"}
            </Link>

            <Link
              href={`${localePrefix}/produkti`}
              className={desktopNavClass(
                "/produkti"
              )}
            >
              {english ? "Products" : "Продукти"}
            </Link>

            <Link
              href={`${localePrefix}/uslugi`}
              className={desktopNavClass(
                "/uslugi"
              )}
            >
              {english ? "Services & Support" : "Услуги и Сервиз"}
            </Link>

            <span className="mx-3 h-5 w-px bg-black/10" />

            <Link href={languageTarget} className="rounded-lg px-2 py-2 text-xs font-medium tracking-[0.15em] text-black/65 transition-all duration-300 hover:bg-white/60 hover:text-[#3f7edb]" aria-label={english ? "Switch to Bulgarian" : "Switch to English"}>{english ? "BG" : "EN"}</Link>
          </nav>

          {/* Phone and email stay stacked at the right content edge. */}
          {(contact.phone || contact.email) && (
            <div className="ml-auto hidden shrink-0 items-center xl:flex">
              <div className="flex flex-col items-start gap-1 text-[11px] text-black/60">
                {contact.phone && <a className="flex items-center gap-2 hover:text-[#3f7edb]" href={`tel:${contact.phone.replace(/\s/g, "")}`}><Phone size={13} aria-hidden="true" />{contact.phone}</a>}
                {contact.email && <a className="flex items-center gap-2 hover:text-[#3f7edb]" href={`mailto:${contact.email}`}><Mail size={13} aria-hidden="true" />{contact.email}</a>}
              </div>

            </div>
          )}
          {/* MOBILE BUTTON */}

          <button
            type="button"
            aria-label={
              menuOpen
                ? "Затвори менюто"
                : "Отвори менюто"
            }
            aria-expanded={
              menuOpen
            }
            onClick={toggleMenu}
            className="relative z-50 flex h-10 w-10 items-center justify-center ml-auto xl:hidden"
          >
            <div className="flex w-5 flex-col gap-1.5">
              <span
                className={`h-px w-full bg-black transition-all duration-300 ${
                  menuOpen
                    ? "translate-y-[4px] rotate-45"
                    : ""
                }`}
              />

              <span
                className={`h-px w-full bg-black transition-all duration-300 ${
                  menuOpen
                    ? "-translate-y-[3px] -rotate-45"
                    : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* MOBILE MENU */}

        <div
          className={`relative z-30 overflow-hidden transition-all duration-500 xl:hidden ${
            menuOpen
              ? "max-h-[420px]"
              : "max-h-0"
          }`}
        >
          <nav className="bg-[#f3f3f2] px-6 py-6 shadow-[0_16px_30px_rgba(0,0,0,0.06)]">
            <div className="flex flex-col gap-2">
              <Link
                href={`${localePrefix}/`}
                onClick={
                  closeMenu
                }
                className={mobileNavClass(
                  "/"
                )}
              >
                Начало
              </Link>

              <Link
                href={`${localePrefix}/produkti`}
                onClick={
                  closeMenu
                }
                className={mobileNavClass(
                  "/produkti"
                )}
              >
                Продукти
              </Link>

              <Link
                href={`${localePrefix}/uslugi`}
                onClick={
                  closeMenu
                }
                className={mobileNavClass(
                  "/uslugi"
                )}
              >
                Услуги и Сервиз
              </Link>

              {(contact.phone || contact.email) && <div className="mt-4 flex flex-col gap-2 border-t border-black/10 px-4 pt-4 text-sm text-black/60">
                {contact.phone && <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a>}
                {contact.email && <a href={`mailto:${contact.email}`}>{contact.email}</a>}
              </div>}
              <Link href={languageTarget} onClick={closeMenu} className="self-start px-4 pt-5 text-xs font-medium tracking-[0.2em] text-black/65 transition-colors hover:text-[#3f7edb]">{english ? "БЪЛГАРСКИ" : "ENGLISH"}</Link>
            </div>
          </nav>
        </div>
      </header>

      {/* =========================================================
          OUTSIDE CLICK AREA
      ========================================================= */}

      {menuOpen && (
        <button
          type="button"
          aria-label="Затвори менюто"
          onClick={closeMenu}
          className="fixed inset-x-0 bottom-0 top-16 sm:top-20 z-[90] bg-black/[0.04] xl:hidden"
        />
      )}
    </>
  );
}