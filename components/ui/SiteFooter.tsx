import Link from "next/link";
import footerData from "@/content/site-footer.json";

export default function SiteFooter() {
  const { address, mapsUrl, privacyLabel } = footerData;
  return (
    <footer className="site-global-footer">
      <div className="site-global-footer-inner">
        <span className="site-global-footer-copyright">ТЕТРАЕДЪР © {new Date().getFullYear()}</span>
        <div className="site-global-footer-links">
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="site-global-footer-address">
            <span aria-hidden="true">⌖</span> {address}
          </a>
          <Link href="/politika-za-zashtita-na-lichnite-danni/">{privacyLabel}</Link>
        </div>
      </div>
    </footer>
  );
}
