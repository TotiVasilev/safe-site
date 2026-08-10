"use client";

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

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-black/10 bg-white/85 shadow-sm backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-12">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          className="group flex items-center"
        >
          <span className="text-xl font-semibold tracking-[0.18em]">
            SAFE
          </span>

          <span className="ml-1 text-xl font-light tracking-[0.18em] text-black/50">
            SECURITY
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-10 md:flex">
          <Link
            href="/"
            className="text-sm text-black/60 transition-colors hover:text-black"
          >
            Начало
          </Link>

          <Link
            href="/produkti"
            className="text-sm text-black/60 transition-colors hover:text-black"
          >
            Продукти
          </Link>

          <Link
            href="/uslugi"
            className="text-sm text-black/60 transition-colors hover:text-black"
          >
            Услуги и Сервиз
          </Link>

          <span className="ml-2 h-5 w-px bg-black/10" />

          <button
            type="button"
            className="text-xs font-medium tracking-[0.15em] text-black/50 transition-colors hover:text-black"
          >
            EN
          </button>
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label={menuOpen ? "Затвори менюто" : "Отвори менюто"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
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

      {/* Mobile menu */}
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
              className="self-start pt-6 text-xs font-medium tracking-[0.2em] text-black/50"
            >
              ENGLISH
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}