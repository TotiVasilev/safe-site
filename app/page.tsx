import Link from "next/link";
import Partners from "@/components/ui/Partners";
import Reveal from "@/components/ui/Reveal";
import ProductGrid from "@/components/ui/ProductGrid";
import { productCategories } from "@/data/products";

export default function Home() {
  return (
    <main className="overflow-hidden bg-white">
      {/* HERO */}
      <section className="flex min-h-screen items-center px-6 pb-20 pt-28 lg:px-12">
        <div className="mx-auto w-full max-w-7xl">
          <Reveal direction="fade" duration={1}>
            <div className="max-w-5xl">
              <p className="text-xs uppercase tracking-[0.35em] text-black/40">
                Сигурност без компромис
              </p>

              <h1 className="mt-7 text-5xl font-medium leading-[0.98] tracking-[-0.04em] sm:text-6xl md:text-7xl lg:text-8xl">
                Защита на това,
                <br />
                което има значение.
              </h1>

              <p className="mt-8 max-w-2xl text-lg leading-8 text-black/55 sm:text-xl">
                Професионални решения за сигурност, сейфове, трезорни
                системи и специализирано банково оборудване.
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  href="/produkti"
                  className="rounded-full bg-black px-7 py-4 text-sm font-medium text-white transition-transform duration-300 hover:scale-[1.03]"
                >
                  Разгледайте продуктите
                </Link>

                <Link
                  href="/uslugi"
                  className="rounded-full border border-black/15 px-7 py-4 text-sm font-medium transition-colors duration-300 hover:bg-black hover:text-white"
                >
                  Услуги и сервиз
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ABOUT */}
      <section className="border-t border-black/10 px-6 py-28 lg:px-12 lg:py-36">
        <div className="mx-auto max-w-7xl">
          <Reveal direction="right">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-black/40">
                За нас
              </p>

              <h2 className="mt-6 max-w-4xl text-3xl font-medium leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Решения за сигурност, създадени за хора и организации,
                които не правят компромис със защитата.
              </h2>

              <p className="mt-8 max-w-3xl text-base leading-8 text-black/55 sm:text-lg">
                Предлагаме професионални решения за защита на ценности,
                документи и специализирани помещения. От избора на
                подходящ продукт до монтажа и последващото обслужване,
                целта ни е надеждност във всеки етап.
              </p>

              {/* Trust points */}
              <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-black/10 bg-black/10 sm:grid-cols-3">
                <div className="bg-white p-7">
                  <span className="text-xs text-black/30">01</span>

                  <h3 className="mt-8 text-lg font-medium">
                    Надеждни решения
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-black/50">
                    Продукти и системи, предназначени за високо ниво на
                    защита и дългосрочна употреба.
                  </p>
                </div>

                <div className="bg-white p-7">
                  <span className="text-xs text-black/30">02</span>

                  <h3 className="mt-8 text-lg font-medium">
                    Професионален подход
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-black/50">
                    Консултация и решение според конкретните изисквания
                    на клиента и обекта.
                  </p>
                </div>

                <div className="bg-white p-7">
                  <span className="text-xs text-black/30">03</span>

                  <h3 className="mt-8 text-lg font-medium">
                    Сервиз и поддръжка
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-black/50">
                    Подкрепа и след доставката чрез професионално
                    обслужване и сервиз.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* PARTNERS */}
          <Reveal direction="up">
            <div className="mt-32 border-t border-black/10 pt-16">
              <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-black/40">
                    Доверени партньори
                  </p>

                  <h3 className="mt-4 text-2xl font-medium tracking-tight sm:text-3xl">
                    Доверие, изградено с времето.
                  </h3>
                </div>

                <p className="max-w-md text-sm leading-6 text-black/45">
                  Решения, на които се доверяват водещи финансови
                  институции.
                </p>
              </div>

              <Partners />
            </div>
          </Reveal>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="border-t border-black/10 px-6 py-28 lg:px-12 lg:py-36">
        <div className="mx-auto max-w-7xl">
          <Reveal direction="up">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-black/40">
                  Продукти
                </p>

                <h2 className="mt-5 text-4xl font-medium tracking-tight sm:text-5xl">
                  Решения за сигурност
                </h2>

                <p className="mt-5 max-w-2xl text-base leading-7 text-black/50">
                  Разгледайте основните категории от нашия каталог.
                </p>
              </div>

              <Link
                href="/produkti"
                className="text-sm font-medium transition-opacity hover:opacity-60"
              >
                Виж целия каталог →
              </Link>
            </div>
          </Reveal>

          <ProductGrid categories={productCategories} />
        </div>
      </section>

      {/* SERVICES */}
      <section className="border-t border-black/10 px-6 py-28 lg:px-12 lg:py-36">
        <div className="mx-auto max-w-7xl">
          <Reveal direction="left">
            <div className="grid gap-14 lg:grid-cols-2 lg:gap-24">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-black/40">
                  Услуги и сервиз
                </p>

                <h2 className="mt-5 max-w-xl text-4xl font-medium tracking-tight sm:text-5xl">
                  Сигурността не приключва с доставката.
                </h2>
              </div>

              <div className="flex flex-col justify-end">
                <p className="max-w-xl text-lg leading-8 text-black/55">
                  Предлагаме консултация, монтаж, сервиз и поддръжка,
                  за да осигурим надеждна работа на вашето оборудване
                  в дългосрочен план.
                </p>

                <div className="mt-9">
                  <Link
                    href="/uslugi"
                    className="inline-flex rounded-full border border-black/15 px-6 py-3 text-sm font-medium transition-colors hover:bg-black hover:text-white"
                  >
                    Научете повече →
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}