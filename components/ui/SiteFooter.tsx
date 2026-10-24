"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import footerData from "@/content/site-footer.json";

export default function SiteFooter() {
  const { address, mapsUrl, privacyLabel } = footerData;
  const english = usePathname().startsWith("/en");
  return (
    <footer className="site-global-footer">
      <div className="site-global-footer-inner">
        <span className="site-global-footer-copyright">ТЕТРАЕДЪР © {new Date().getFullYear()}</span>
        <div className="site-global-footer-links">
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="site-global-footer-address">
            <span aria-hidden="true">⌖</span> {address}
          </a>
          <Link href={english ? "/en/politika-za-zashtita-na-lichnite-danni/" : "/politika-za-zashtita-na-lichnite-danni/"}>{english ? "Privacy Policy" : privacyLabel}</Link>
        </div>
      </div>
    </footer>
  );
}
