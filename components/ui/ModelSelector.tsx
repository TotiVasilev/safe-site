"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductModel } from "@/data/products";

type Props = { models: ProductModel[]; drawing?: string; productName: string };

function parseDimensions(value?: string) {
  if (!value) return ["—", "—", "—"];
  const parts = value.split(/\\s*[x×хХ;,/]\\s*/i).map((part) => part.trim()).filter(Boolean);
  return parts.length === 3 ? parts : [value, "—", "—"];
}

export default function ModelSelector({ models, drawing, productName }: Props) {
  const [selected, setSelected] = useState(0);
  const model = models[selected];
  if (!model) return null;
  const legacyExternal = parseDimensions(model.dimensions);
  const external = [model.height || legacyExternal[0], model.width || legacyExternal[1], model.depth || legacyExternal[2]];
  const legacyInternal = parseDimensions(model.internalDimensions);
  const internal = [model.innerHeight || legacyInternal[0], model.innerWidth || legacyInternal[1], model.innerDepth || legacyInternal[2]];
  const hasMeasurements = Boolean(model.dimensions || model.internalDimensions || model.height || model.width || model.depth || model.innerHeight || model.innerWidth || model.innerDepth || model.weight || model.volume || model.resistance);

  return (
    <section className="mt-32" id="modeli">
      <div className="border-b border-black/10 pb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-black/40">Модели</p>
        <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">Налични модели</h2>
      </div>
      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
        <div className="overflow-hidden rounded-2xl border border-black/10 bg-neutral-50">
          <div className="border-b border-black/10 px-6 py-4 text-sm font-medium text-black/65">Схема на размерите</div>
          {drawing ? (
            <div className="relative aspect-[4/3] w-full">
              <Image src={drawing} alt={`Схема на размерите за ${productName}`} fill unoptimized sizes="(max-width: 1024px) 100vw, 50vw" className="object-contain p-5" />
            </div>
          ) : (
            <div className="flex aspect-[4/3] items-center justify-center px-8 text-center text-sm leading-6 text-black/45">
              Техническата схема ще се появи тук, след като бъде добавена в CMS.
            </div>
          )}
          <p className="border-t border-black/10 px-6 py-3 text-xs text-black/45">Една обща схема за всички модели от серията.</p>
        </div>
        <div className="min-w-0">
          <label htmlFor="product-model-selector" className="mb-3 block text-sm font-medium text-black/65">Изберете модел</label>
          <select id="product-model-selector" value={selected} onChange={(event) => setSelected(Number(event.target.value))} className="w-full rounded-xl border border-black/15 bg-white px-4 py-4 text-base font-medium outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15">
            {models.map((item, index) => <option key={`${item.name}-${index}`} value={index}>{item.name}</option>)}
          </select>
          <div className="mt-8 flex items-center justify-between border-b border-black/10 pb-4">
            <h3 className="text-xl font-medium">Размери на {model.name}</h3>
            <span className="text-xs text-black/40">mm</span>
          </div>
          {hasMeasurements ? (
            <>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {external.map((value, index) => (
                  <div key={`outer-${index}`} className="rounded-xl bg-neutral-50 p-3 sm:p-4">
                    <p className="text-xs text-black/50">{["Височина H", "Ширина B", "Дълбочина L"][index]}</p>
                    <p className="mt-2 break-words text-lg font-medium sm:text-2xl">{value}</p>
                    <p className="text-xs text-black/35">Външен размер</p>
                  </div>
                ))}
                {internal.map((value, index) => (
                  <div key={`inner-${index}`} className="rounded-xl bg-neutral-50 p-3 sm:p-4">
                    <p className="text-xs text-black/50">{["Височина H₁", "Ширина B₁", "Дълбочина L₁"][index]}</p>
                    <p className="mt-2 break-words text-lg font-medium sm:text-2xl">{value}</p>
                    <p className="text-xs text-black/35">Вътрешен размер</p>
                  </div>
                ))}
              </div>
              {(model.weight || model.volume || model.resistance) && (
                <dl className="mt-5 divide-y divide-black/10 rounded-xl border border-black/10 px-5">
                  {model.weight && <div className="flex justify-between gap-4 py-4"><dt className="text-black/55">Маса</dt><dd className="font-medium">{model.weight}</dd></div>}
                  {model.volume && <div className="flex justify-between gap-4 py-4"><dt className="text-black/55">Обем</dt><dd className="font-medium">{model.volume}</dd></div>}
                  {model.resistance && <div className="flex justify-between gap-4 py-4"><dt className="text-black/55">Клас на устойчивост</dt><dd className="font-medium">{model.resistance}</dd></div>}
                </dl>
              )}
            </>
          ) : <p className="mt-6 rounded-xl bg-neutral-50 p-5 text-sm leading-6 text-black/55">Размерите за този модел все още не са въведени.</p>}
        </div>
      </div>
    </section>
  );
}
