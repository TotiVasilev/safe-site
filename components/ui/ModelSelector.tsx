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

function DimensionColumn({ title, values, labels }: { title: string; values: string[]; labels: string[] }) {
  return (
    <div className="min-w-0">
      <h4 className="mb-3 text-center text-xs font-medium text-black/65 sm:text-sm">{title}</h4>
      <dl className="space-y-2">
        {values.map((value, index) => (
          <div key={labels[index]} className="min-w-0 rounded-xl bg-neutral-50 px-3 py-3">
            <dt className="text-xs text-black/45">{labels[index]}</dt>
            <dd className="mt-1 break-words text-lg font-medium tabular-nums sm:text-xl">{value || "—"}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
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

      {/* On desktop the drawing, measurements, and model list are independent columns.
          Selecting a model changes only the middle column, never the page layout. */}
      <div className="mt-8 grid items-start gap-5 md:grid-cols-12 lg:gap-6">
        <div className="min-w-0 overflow-hidden rounded-2xl border border-black/10 bg-neutral-50 md:col-span-5">
          <div className="border-b border-black/10 px-5 py-4 text-sm font-medium text-black/65">Схема на размерите</div>
          {drawing ? (
            <div className="relative aspect-[4/3] w-full">
              <Image src={drawing} alt={`Схема на размерите за ${productName}`} fill unoptimized sizes="(max-width: 767px) 100vw, 42vw" className="object-contain" />
            </div>
          ) : (
            <div className="flex aspect-[4/3] items-center justify-center px-8 text-center text-sm leading-6 text-black/45 ">
              Техническата схема ще се появи тук, след като бъде добавена в CMS.
            </div>
          )}
          <p className="border-t border-black/10 px-5 py-3 text-xs text-black/45">Една обща схема за всички модели от серията.</p>
        </div>

        <div className="min-w-0 md:col-span-4">
          <div className="flex min-h-10 items-center justify-between gap-2 border-b border-black/10 pb-3">
            <h3 className="min-w-0 break-words text-lg font-medium">Размери на {model.name}</h3>
            <span className="shrink-0 text-xs text-black/40">mm</span>
          </div>
          {hasMeasurements ? (
            <>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <DimensionColumn title="Външни размери" values={external} labels={["Височина H", "Ширина B", "Дълбочина L"]} />
                <DimensionColumn title="Вътрешни размери" values={internal} labels={["Височина H₁", "Ширина B₁", "Дълбочина L₁"]} />
              </div>
              {(model.weight || model.volume || model.resistance) && (
                <dl className="mt-3 divide-y divide-black/10 rounded-xl border border-black/10 px-4">
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

        <div className="min-w-0 md:col-span-3">
          <div className="flex min-h-10 items-center justify-between gap-2 border-b border-black/10 pb-3">
            <h3 className="text-sm font-medium text-black/70">Изберете модел</h3>
          </div>
          <div className={`mt-4 grid gap-2 ${models.length <= 2 ? "grid-cols-1" : "grid-cols-2"}`} role="group" aria-label="Изберете модел">
            {models.map((item, index) => (
              <button
                key={`${item.name}-${index}`}
                type="button"
                aria-pressed={selected === index}
                onClick={() => setSelected(index)}
                className={`min-w-0 rounded-lg border px-2 py-3 text-center text-xs font-medium transition-colors sm:text-sm ${selected === index ? "border-[#3f7edb] bg-[#3f7edb]/10 text-[#3f7edb]" : "border-black/10 bg-neutral-50 text-black/70 hover:border-black/25 hover:bg-neutral-100"}`}
              >
                <span className="break-words">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
