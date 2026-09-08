"use client";

const partners = [
  { name: "Fibank" },
  { name: "ОББ" },
  { name: "DSK" },
  { name: "UniCredit Bulbank" },
];

export default function Partners() {
  const repeatedPartners = [
    ...partners,
    ...partners,
    ...partners,
    ...partners,
  ];

  return (
    <div className="partners-marquee overflow-hidden">
      <div className="partners-track flex w-max items-center">
        {repeatedPartners.map((partner, index) => (
          <div
            key={`${partner.name}-${index}`}
            className="partner-item flex h-28 w-64 shrink-0 items-center justify-center px-8"
          >
            <div className="flex h-full w-full items-center justify-center rounded-2xl border border-black/10 bg-white transition-all duration-300">
              <span className="text-lg font-medium tracking-tight text-black/40 transition-all duration-300">
                {partner.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}