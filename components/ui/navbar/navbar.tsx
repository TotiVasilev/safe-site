import Link from "next/link";

const navigation = [
  { name: "Safes", href: "/safes" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-7xl px-6 py-5 lg:px-8">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-semibold tracking-tight"
          >
            SAFE<span className="font-light">CO.</span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm text-black/70 transition-colors hover:text-black"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <Link
            href="/contact"
            className="hidden rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.03] md:block"
          >
            Request a quote
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 md:hidden"
          >
            <span className="flex flex-col gap-1.5">
              <span className="h-px w-5 bg-black" />
              <span className="h-px w-5 bg-black" />
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
}