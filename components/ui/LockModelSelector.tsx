"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductModel } from "@/data/products";

type Props = { models: ProductModel[]; productName: string; locale?: "bg" | "en" };

export default function LockModelSelector({ models, productName, locale = "bg" }: Props) {
  const [selected, setSelected] = useState(0);
  const model = models[selected];
  if (!model) return null;
  const en = locale === "en";
  const t = (bg: string, english: string) => en ? english : bg;

  return (
    <section className="mt-32" id="modeli">
      <div className="border-b border-black/10 pb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-black/40">{t("Модели", "Models")}</p>
        <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">{t("Налични модели", "Available Models")}</h2>
      </div>
      <div className="mt-8">
        <h3 className="mb-3 text-sm font-medium text-[#374151]">{t("Изберете модел", "Select a Model")}</h3>
        <div className="flex flex-wrap gap-2" role="group" aria-label={t("Изберете модел", "Select a Model")}>
          {models.map((item, index) => (
            <button key={`${item.name}-${index}`} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}
              className={`min-w-[90px] rounded-lg border px-4 py-2.5 text-center text-xs font-medium transition-colors ${selected === index ? "border-[#3f7edb] bg-[#3f7edb]/10 text-[#3f7edb]" : "border-black/10 bg-neutral-50 text-black/70 hover:border-black/25 hover:bg-neutral-100"}`}>
              {item.name}
            </button>
          ))}
        </div>
        <div className="mt-7 grid items-start gap-8 md:grid-cols-2 lg:gap-10">
          <div className="min-w-0 overflow-hidden rounded-2xl border border-black/10 bg-neutral-50">
            <div className="border-b border-black/10 px-5 py-4 text-sm font-medium text-black/65">{t("Снимка на модела", "Model Image")}</div>
            <div className="relative aspect-[4/3] w-full">
              {model.image ? <Image src={model.image} alt={`${productName} — ${model.name}`} fill unoptimized sizes="(max-width: 767px) 100vw, 50vw" className="object-contain p-5" /> :
                <div className="flex h-full items-center justify-center px-8 text-center text-sm text-black/45">{t("Добавете снимка за този модел в CMS.", "Add an image for this model in the CMS.")}</div>}
            </div>
          </div>
          <div className="min-w-0">
            <h3 className="border-b border-black/10 pb-4 text-lg font-medium">{model.name}</h3>
            <div className="mt-5 whitespace-pre-line break-words text-sm leading-7 text-black/65">
              {model.description || t("Добавете информация за този модел в CMS.", "Add information about this model in the CMS.")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
