"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import footerData from "@/content/site-footer.json";
import englishFooterData from "@/content/en/site-footer.json";

export default function SiteFooter() {
  const english = usePathname().startsWith("/en");
  const { mapsUrl, privacyLabel } = footerData;
  const address = english ? englishFooterData.address : footerData.address;
  return (
    <footer className="site-global-footer">
      <div className="site-global-footer-inner">
        <span className="site-global-footer-copyright">{english ? "TETRAEDAR" : "ТЕТРАЕДЪР"} © {new Date().getFullYear()}</span>
        <div className="site-global-footer-links">
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="site-global-footer-address">
            {address}
          </a>
          <Link href={english ? "/en/politika-za-zashtita-na-lichnite-danni/" : "/politika-za-zashtita-na-lichnite-danni/"}>{english ? "Privacy Policy" : privacyLabel}</Link>
        </div>
      </div>
    </footer>
  );
}
