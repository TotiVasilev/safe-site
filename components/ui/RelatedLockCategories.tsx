import Image from "next/image";
import Link from "next/link";

type RelatedLock = {
  slug: string;
  name: string;
  image?: string;
};

export default function RelatedLockCategories({
  locks,
  currentSlug,
  locale = "bg",
}: {
  locks: RelatedLock[];
  currentSlug: string;
  locale?: "bg" | "en";
}) {
  const related = locks.filter((lock) => lock.slug !== currentSlug);
  if (related.length === 0) return null;

  return (
    <section className="mt-20 sm:mt-24" aria-label={locale === "en" ? "Other lock categories" : "Други категории ключалки"}>
      <h2 className="mb-7 text-2xl font-medium tracking-tight sm:text-3xl">
        {locale === "en" ? "Other lock categories" : "Други категории ключалки"}
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {related.map((lock) => (
          <Link
            key={lock.slug}
            href={`${locale === "en" ? "/en" : ""}/produkti/${lock.slug}`}
            className="group min-w-0 overflow-hidden rounded-2xl border border-black/10 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-[#3f7edb]/40 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3f7edb]"
          >
            <div className="relative aspect-[4/3] bg-neutral-50">
              {lock.image ? (
                <Image src={lock.image} alt="" fill unoptimized sizes="(max-width: 639px) 50vw, (max-width: 1023px) 25vw, 300px" className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.04]" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-black/35">
                  {locale === "en" ? "No image available" : "Няма снимка"}
                </div>
              )}
            </div>
            <div className="px-4 py-4 sm:px-5">
              <h3 className="text-sm font-medium leading-snug text-black sm:text-base">{lock.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
