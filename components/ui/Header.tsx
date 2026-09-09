"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function closeMenu() {
    setMenuOpen(false);
  }

  function isActive(path: string) {
    if (path === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(path);
  }

  function desktopNavClass(path: string) {
    const active = isActive(path);

    return `
      flex w-[150px] items-center justify-center
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

  function mobileNavClass(path: string) {
    const active = isActive(path);

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
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#f3f3f2]/95 shadow-[0_2px_12px_rgba(0,0,0,0.035)] backdrop-blur-xl"
          : "bg-[#f5f5f4]/95 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-12">
        {/* LOGO */}
        <Link
          href="/"
          onClick={closeMenu}
          className="flex items-center gap-3"
        >
          <Image
            src="/branding/tetraedar-logo.png"
            alt="Tetraedar"
            width={48}
            height={48}
            priority
            className="h-11 w-auto object-contain"
          />

          <span
            className="
              text-[24px]
              font-medium
              tracking-[0.01em]
              text-[#3f7edb]
              sm:text-[28px]
            "
          >
            TETRAEDAR
          </span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden items-center gap-2 md:flex">
          <Link
            href="/"
            className={desktopNavClass("/")}
          >
            Начало
          </Link>

          <Link
            href="/produkti"
            className={desktopNavClass("/produkti")}
          >
            Продукти
          </Link>

          <Link
            href="/uslugi"
            className={desktopNavClass("/uslugi")}
          >
            Услуги и Сервиз
          </Link>

          {/* LANGUAGE DIVIDER */}
          <span className="mx-3 h-5 w-px bg-black/10" />

          {/* LANGUAGE */}
          <button
            type="button"
            className="rounded-lg px-2 py-2 text-xs font-medium tracking-[0.15em] text-black/45 transition-all duration-300 hover:bg-white/60 hover:text-[#3f7edb]"
          >
            EN
          </button>
        </nav>

        {/* MOBILE BUTTON */}
        <button
          type="button"
          aria-label={
            menuOpen
              ? "Затвори менюто"
              : "Отвори менюто"
          }
          aria-expanded={menuOpen}
          onClick={() =>
            setMenuOpen((open) => !open)
          }
          className="relative z-50 flex h-10 w-10 items-center justify-center md:hidden"
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
        className={`overflow-hidden transition-all duration-500 md:hidden ${
          menuOpen
            ? "max-h-[420px]"
            : "max-h-0"
        }`}
      >
        <nav className="bg-[#f3f3f2] px-6 py-6">
          <div className="flex flex-col gap-2">
            <Link
              href="/"
              onClick={closeMenu}
              className={mobileNavClass("/")}
            >
              Начало
            </Link>

            <Link
              href="/produkti"
              onClick={closeMenu}
              className={mobileNavClass("/produkti")}
            >
              Продукти
            </Link>

            <Link
              href="/uslugi"
              onClick={closeMenu}
              className={mobileNavClass("/uslugi")}
            >
              Услуги и Сервиз
            </Link>

            <button
              type="button"
              className="self-start px-4 pt-5 text-xs font-medium tracking-[0.2em] text-black/45 transition-colors hover:text-[#3f7edb]"
            >
              ENGLISH
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}