"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
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

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-black/10 bg-white/90 shadow-sm backdrop-blur-xl"
          : "bg-white/80 backdrop-blur-md"
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
        <nav className="hidden items-center gap-10 md:flex">
          <Link
            href="/"
            className="text-sm text-black/55 transition-colors hover:text-black"
          >
            Начало
          </Link>

          <Link
            href="/produkti"
            className="text-sm text-black/55 transition-colors hover:text-black"
          >
            Продукти
          </Link>

          <Link
            href="/uslugi"
            className="text-sm text-black/55 transition-colors hover:text-black"
          >
            Услуги и Сервиз
          </Link>

          <span className="h-5 w-px bg-black/10" />

          <button
            type="button"
            className="text-xs font-medium tracking-[0.15em] text-black/45 transition-colors hover:text-black"
          >
            EN
          </button>
        </nav>

        {/* MOBILE BUTTON */}
        <button
          type="button"
          aria-label={menuOpen ? "Затвори менюто" : "Отвори менюто"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="relative z-50 flex h-10 w-10 items-center justify-center md:hidden"
        >
          <div className="flex w-5 flex-col gap-1.5">
            <span
              className={`h-px w-full bg-black transition-all duration-300 ${
                menuOpen ? "translate-y-[4px] rotate-45" : ""
              }`}
            />

            <span
              className={`h-px w-full bg-black transition-all duration-300 ${
                menuOpen ? "-translate-y-[3px] -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`overflow-hidden transition-all duration-500 md:hidden ${
          menuOpen ? "max-h-[400px]" : "max-h-0"
        }`}
      >
        <nav className="border-t border-black/10 bg-white px-6 py-8">
          <div className="flex flex-col">
            <Link
              href="/"
              onClick={closeMenu}
              className="border-b border-black/10 py-5 text-2xl font-medium"
            >
              Начало
            </Link>

            <Link
              href="/produkti"
              onClick={closeMenu}
              className="border-b border-black/10 py-5 text-2xl font-medium"
            >
              Продукти
            </Link>

            <Link
              href="/uslugi"
              onClick={closeMenu}
              className="border-b border-black/10 py-5 text-2xl font-medium"
            >
              Услуги и Сервиз
            </Link>

            <button
              type="button"
              className="self-start pt-6 text-xs font-medium tracking-[0.2em] text-black/45"
            >
              ENGLISH
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}