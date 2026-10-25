"use client";

import Image from "next/image";
import type { Partner } from "@/data/cms-homepage";

export default function Partners({ partners }: { partners: Partner[] }) {
  if (!partners.length) return null;
  // Four copies make the -25% loop seamless; the second row runs backwards.
  const renderRow = (items: Partner[], reverse: boolean) => (
    <div className="partners-marquee overflow-hidden" aria-label={reverse ? "Partners, second row" : "Partners, first row"}>
      <div className={`partners-track flex w-max items-center ${reverse ? "partners-track-reverse" : ""}`}>
        {Array.from({ length: 4 }, () => items).flat().map((partner, index) => (
          <div key={`${reverse ? "bottom" : "top"}-${partner.name}-${index}`} className="partner-item flex h-28 w-64 shrink-0 items-center justify-center px-8">
            <div className="flex h-full w-full items-center justify-center transition-transform duration-300">
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

  return (
    <div data-cms-field="partners" className="partners-double-marquee">
      {renderRow(partners, false)}
      {renderRow(partners.length > 1 ? [...partners.slice(1), partners[0]] : partners, true)}
    </div>
  );
}

function PartnerContent({ partner }: { partner: Partner }) {
  return partner.image ? (
    <div className="partner-logo-artwork relative h-28 w-64">
      <Image src={partner.image} alt={partner.name} fill sizes="(max-width: 900px) 245px, 290px" className="object-contain" />
    </div>
  ) : (
    <span className="text-lg font-medium tracking-tight text-black/40 transition-all duration-300">{partner.name}</span>
  );
}
