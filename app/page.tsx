import Link from "next/link";
import Script from "next/script";
import {getProductCategories} from "@/data/cms-products";
import {getHomepage} from "@/data/cms-homepage";
import Partners from "@/components/ui/Partners";
import KineticMotion from "@/components/ui/KineticMotion";
import HeroImageStack from "@/components/ui/HeroImageStack";
import AboutLogoReveal from "@/components/ui/AboutLogoReveal";
import "./blue-home.css";

export default function Home(){
 const h=getHomepage();const categories=getProductCategories();
 return <main className="blue-site">
  <Script src="/admin/homepage-bridge.js" strategy="afterInteractive"/>
  <KineticMotion/>
  <section className="b-hero">
   <div className="b-hero-grain" aria-hidden="true"/>
   <div className="b-shell">
    <div className="b-hero-kicker"><span className="b-blue-dot"/> ТЕТРАЕДЪР <span className="b-hero-kicker-right">ИНЖЕНЕРНА СИГУРНОСТ / БЪЛГАРИЯ</span></div>
    <div className="b-hero-layout">
     <div className="b-hero-text">
      <h1 data-reveal="fade" data-cms-field="heroTitle">{h.heroTitle}</h1>
      <p data-reveal="fade" data-reveal-delay="1" data-cms-field="heroDescription">{h.heroDescription}</p>
      <div className="b-actions" data-reveal="up" data-reveal-delay="2"><Link href={h.primaryLink} className="b-primary"><span data-cms-field="primaryButton">{h.primaryButton}</span><span>↗</span></Link><Link href={h.secondaryLink} className="b-secondary"><span data-cms-field="secondaryButton">{h.secondaryButton}</span> ↗</Link></div>
     </div>
     <div className="b-hero-media-reveal" data-reveal="right" data-reveal-delay="1"><HeroImageStack/></div>
    </div>
   </div>
  </section>

  <section className="b-intro" id="b-about"><div className="b-shell b-intro-grid">
    <AboutLogoReveal/>
    <div className="b-about-content" data-reveal="up"><span className="b-overline" data-cms-field="aboutLabel">{h.aboutLabel}</span><h2 data-cms-field="aboutTitle">{h.aboutTitle}</h2><div className="b-intro-text"><p data-cms-field="aboutParagraph1">{h.aboutParagraph1}</p><p data-cms-field="aboutParagraph2">{h.aboutParagraph2}</p></div>
    <div className="b-about-features">{[["feature1Title","feature1Description"],["feature2Title","feature2Description"],["feature3Title","feature3Description"]].map(([a,b],i)=><div className="b-about-feature" data-reveal="fade" style={{"--reveal-delay": `${i * 110}ms`} as React.CSSProperties} key={a}><span className="b-about-feature-number">0{i+1}</span><div><strong data-cms-field={a}>{h[a as keyof typeof h] as string}</strong><p data-cms-field={b}>{h[b as keyof typeof h] as string}</p></div></div>)}</div>
    </div></div></section>

  <section className="b-range" id="b-products"><div className="b-shell"><div className="b-range-top" data-reveal="fade"><div><span className="b-overline" data-cms-field="productsLabel">{h.productsLabel}</span><h2 data-cms-field="productsTitle">{h.productsTitle}</h2></div><div><Link href={h.primaryLink} className="b-white-button"><span data-cms-field="catalogButton">{h.catalogButton}</span> ↗</Link></div></div>
   <div className="b-range-list" data-reveal-group="catalog">{categories.map((c,i)=><Link key={c.id} href={`/produkti#category-${c.slug}`} className="b-range-item"><span className="b-range-index">{String(i+1).padStart(2,"0")}</span><span className="b-range-name">{c.name}</span><span className="b-range-arrow">↗</span></Link>)}</div>
  </div></section>

  <section className="b-partners"><div className="b-shell b-partners-layout"><div className="b-partners-head" data-reveal="fade"><span className="b-overline" data-cms-field="partnersLabel">{h.partnersLabel}</span><h2 data-cms-field="partnersTitle">{h.partnersTitle}</h2><p data-cms-field="partnersDescription">{h.partnersDescription}</p></div><div className="b-partner-marquee" data-reveal="fade" data-reveal-delay="1"><Partners partners={h.partners}/></div></div></section>

  <section className="b-service"><div className="b-shell b-service-grid"><div className="b-service-image" data-reveal="fade"/><div className="b-service-copy" data-reveal="down"><span className="b-overline" data-cms-field="servicesLabel">{h.servicesLabel}</span><h2 data-cms-field="servicesTitle">{h.servicesTitle}</h2><p data-cms-field="servicesDescription">{h.servicesDescription}</p><Link href={h.secondaryLink} className="b-primary"><span data-cms-field="servicesButton">{h.servicesButton}</span><span>↗</span></Link></div></div></section>

  <section className="b-contact"><div className="b-shell"><span className="b-overline" data-reveal="fade" data-cms-field="contactLabel">{h.contactLabel}</span><div className="b-contact-grid"><div><h2 data-reveal="contact" data-cms-field="contactTitle">{h.contactTitle}</h2><p data-reveal="fade" data-reveal-delay="1" data-cms-field="contactDescription">{h.contactDescription}</p></div><Link href={h.contactLink} className="b-contact-action" data-reveal="up" data-reveal-delay="2"><span data-cms-field="contactButton">{h.contactButton}</span><span>↗</span></Link></div><div className="b-contact-footer"><span>ТЕТРАЕДЪР © 2026</span><Link href="/politika-za-zashtita-na-lichnite-danni/" className="b-privacy-link">Политика за защита на личните данни</Link></div></div></section>
 </main>
}
