import "server-only";
import fs from "node:fs";
import path from "node:path";

export type Partner = { name: string; image?: string; url?: string };
export type Homepage = {
  heroTitle: string;
  heroDescription: string;
  primaryButton: string;
  secondaryButton: string;
  aboutLabel: string;
  aboutTitle: string;
  aboutParagraph1: string;
  aboutParagraph2: string;
  feature1Title: string;
  feature1Description: string;
  feature2Title: string;
  feature2Description: string;
  feature3Title: string;
  feature3Description: string;
  partnersLabel: string;
  partnersTitle: string;
  partnersDescription: string;
  productsLabel: string;
  productsTitle: string;
  productsDescription: string;
  featuredTitle: string;
  featuredDescription: string;
  catalogButton: string;
  catalogLabel: string;
  catalogTitle: string;
  catalogDescription: string;
  servicesLabel: string;
  servicesTitle: string;
  servicesDescription: string;
  servicesButton: string;
  contactLabel: string;
  contactTitle: string;
  contactDescription: string;
  contactButton: string;
  pointerLeft: string;
  pointerRight: string;
  heroBackground: string;
  primaryLink: string;
  secondaryLink: string;
  contactLink: string;
  partners: Partner[];
};

export function getHomepage(): Homepage {
  const filename = path.join(process.cwd(), "content", "homepage.json");
  const raw = JSON.parse(fs.readFileSync(filename, "utf8")) as Homepage;
  return raw;
}
