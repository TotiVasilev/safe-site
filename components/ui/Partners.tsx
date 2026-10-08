"use client";

import Image from "next/image";
import type { Partner } from "@/data/cms-homepage";

export default function Partners({ partners }: { partners: Partner[] }) {
  if (!partners.length) return null;
  const repeatedPartners = Array.from({ length: 4 }, () => partners).flat();

  return (
    <div data-cms-field="partners" className="partners-marquee overflow-hidden">
      <div className="partners-track flex w-max items-center">
        {repeatedPartners.map((partner, index) => (
          <div key={`${partner.name}-${index}`} className="partner-item flex h-28 w-64 shrink-0 items-center justify-center px-8">
            <div className="flex h-full w-full items-center justify-center rounded-2xl border border-black/10 bg-white transition-all duration-300">
              {partner.url ? (
                <a href={partner.url} target="_blank" rel="noopener noreferrer" className="flex h-full w-full items-center justify-center">
                  <PartnerContent partner={partner} />
                </a>
              ) : (
                <PartnerContent partner={partner} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PartnerContent({ partner }: { partner: Partner }) {
  return partner.image ? (
    <div className="relative h-16 w-40">
      <Image src={partner.image} alt={partner.name} fill sizes="160px" className="object-contain" />
    </div>
  ) : (
    <span className="text-lg font-medium tracking-tight text-black/40 transition-all duration-300">{partner.name}</span>
  );
}
