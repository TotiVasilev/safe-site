"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductModel } from "@/data/products";

type Props = { models: ProductModel[]; drawing?: string; productName: string };

function parseDimensions(value?: string) {
  if (!value) return ["—", "—", "—"];
  const parts = value.split(/\s*[x×хХ;,/]\s*/i).map((part) => part.trim()).filter(Boolean);
  return parts.length === 3 ? parts : [value, "—", "—"];
}

export default function ModelSelector({ models, drawing, productName }: Props) {
  const [selected, setSelected] = useState(0);
  const model = models[selected];
  if (!model) return null;

  const legacyExternal = parseDimensions(model.dimensions);
  const legacyInternal = parseDimensions(model.internalDimensions);
  const external = [model.height || legacyExternal[0], model.width || legacyExternal[1], model.depth || legacyExternal[2]];
  const internal = [model.innerHeight || legacyInternal[0], model.innerWidth || legacyInternal[1], model.innerDepth || legacyInternal[2]];
  const hasMeasurements = Boolean(model.dimensions || model.internalDimensions || model.height || model.width || model.depth || model.innerHeight || model.innerWidth || model.innerDepth || model.weight || model.volume || model.resistance);

  return (
    <section className="mt-32" id="modeli">
      <div className="border-b border-black/10 pb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-black/40">Модели</p>
        <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">Налични модели</h2>
      </div>

      {/* Keep the original two-panel proportions. Model buttons sit above the
          measurements and wrap left-to-right after the seventh button. */}
      <div className="mt-8 grid items-start gap-8 md:grid-cols-2 lg:gap-10">
        <div className="min-w-0 overflow-hidden rounded-2xl border border-black/10 bg-neutral-50">
          <div className="border-b border-black/10 px-5 py-4 text-sm font-medium text-black/65">Схема на размерите</div>
          {drawing ? (
            <div className="relative aspect-[4/3] w-full">
              <Image src={drawing} alt={`Схема на размерите за ${productName}`} fill unoptimized sizes="(max-width: 767px) 100vw, 50vw" className="object-contain" />
            </div>
          ) : (
            <div className="flex aspect-[4/3] items-center justify-center px-8 text-center text-sm leading-6 text-black/45">
              Техническата схема ще се появи тук, след като бъде добавена в CMS.
            </div>
          )}
          <p className="border-t border-black/10 px-5 py-3 text-xs text-black/45">Една обща схема за всички модели от серията.</p>
        </div>

        <div className="min-w-0">
          <h3 className="mb-3 text-sm font-medium text-black/70">Изберете модел</h3>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-7" role="group" aria-label="Изберете модел">
            {models.map((item, index) => (
              <button
                key={`${item.name}-${index}`}
                type="button"
                aria-pressed={selected === index}
                onClick={() => setSelected(index)}
                className={`min-w-0 rounded-lg border px-1.5 py-2.5 text-center text-xs font-medium transition-colors ${selected === index ? "border-[#3f7edb] bg-[#3f7edb]/10 text-[#3f7edb]" : "border-black/10 bg-neutral-50 text-black/70 hover:border-black/25 hover:bg-neutral-100"}`}
              >
                <span className="break-words">{item.name}</span>
              </button>
            ))}
          </div>

          <div className="mt-7 flex items-center justify-between gap-2 border-b border-black/10 pb-4">
            <h3 className="min-w-0 break-words text-lg font-medium">Размери на {model.name}</h3>
            <span className="shrink-0 text-xs text-black/40">mm</span>
          </div>
          {hasMeasurements ? (
            <>
              <dl className="mt-4 grid grid-cols-3 gap-2">
                {[
                  ["Височина H", external[0], "Външен размер"],
                  ["Ширина B", external[1], "Външен размер"],
                  ["Дълбочина L", external[2], "Външен размер"],
                  ["Височина H₁", internal[0], "Вътрешен размер"],
                  ["Ширина B₁", internal[1], "Вътрешен размер"],
                  ["Дълбочина L₁", internal[2], "Вътрешен размер"],
                ].map(([label, value, caption]) => (
                  <div key={label} className="min-w-0 rounded-xl bg-neutral-50 px-3 py-3">
                    <dt className="text-xs text-black/45">{label}</dt>
                    <dd className="mt-1 break-words text-lg font-medium tabular-nums sm:text-xl">{value || "—"}</dd>
                    <dd className="text-xs text-black/40">{caption}</dd>
                  </div>
                ))}
              </dl>
              {(model.weight || model.volume || model.resistance) && (
                <dl className="mt-4 divide-y divide-black/10 rounded-xl border border-black/10 px-4">
                  {model.weight && <div className="flex justify-between gap-4 py-3 text-sm"><dt className="text-black/55">Маса</dt><dd className="font-medium">{model.weight}</dd></div>}
                  {model.volume && <div className="flex justify-between gap-4 py-3 text-sm"><dt className="text-black/55">Обем</dt><dd className="font-medium">{model.volume}</dd></div>}
                  {model.resistance && <div className="flex justify-between gap-4 py-3 text-sm"><dt className="text-black/55">Клас на устойчивост</dt><dd className="font-medium">{model.resistance}</dd></div>}
                </dl>
              )}
            </>
          ) : (
            <p className="mt-4 rounded-xl bg-neutral-50 p-5 text-sm leading-6 text-black/55">Размерите за този модел все още не са въведени.</p>
          )}
        </div>
      </div>
    </section>
  );
}
