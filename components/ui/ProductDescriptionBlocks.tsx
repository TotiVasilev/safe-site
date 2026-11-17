"use client";

import { Check, ShieldCheck } from "lucide-react";
import type { ProductAttachment, ProductDescriptionBlock } from "@/data/products";
import ProductDescription from "@/components/ui/ProductDescription";

type Props = {
  description: string;
  blocks?: ProductDescriptionBlock[];
  attachments?: ProductAttachment[];
  locale?: "bg" | "en";
};

function Paragraphs({ text, attachments, intro = false }: { text: string; attachments: ProductAttachment[]; intro?: boolean }) {
  return <div className={intro ? "space-y-3" : "space-y-4"}>
    {text.split(/\n\s*\n/).map((paragraph, index) => paragraph.trim() ? (
      <p key={index} className={intro
        ? "text-[16px] font-medium leading-[1.72] text-[#263244] sm:text-[18px]"
        : "text-[16px] leading-[1.75] text-[#4b5665] sm:text-[17px]"}>
        <ProductDescription description={paragraph.trim()} attachments={attachments} />
      </p>
    ) : null)}
  </div>;
}

export default function ProductDescriptionBlocks({ description, blocks = [], attachments = [], locale = "bg" }: Props) {
  if (blocks.length === 0) return <div className="space-y-5"><Paragraphs text={description} attachments={attachments}/></div>;

  return <div className="space-y-6 sm:space-y-7">
    {blocks.map((block, index) => {
      if (block.kind === "heading") {
        return <h2 key={index} className="text-[19px] font-semibold leading-tight text-[#172033] sm:text-[21px]">
          {block.title || block.text}
        </h2>;
      }
      if (block.kind === "features") {
        return <section key={index} className="space-y-3">
          {block.title && <h2 className="text-[18px] font-semibold text-[#172033] sm:text-[20px]">{block.title}</h2>}
          {block.text && <Paragraphs text={block.text} attachments={attachments} />}
          {Boolean(block.items?.length) && <ul className="space-y-3">
            {block.items?.map((item, itemIndex) => <li key={itemIndex} className="flex items-start gap-3 text-[16px] leading-[1.65] text-[#4b5665] sm:text-[17px]">
              <Check size={18} strokeWidth={2} className="mt-[5px] shrink-0 text-[#3f7edb]" aria-hidden="true"/>
              <span><ProductDescription description={item} attachments={attachments}/></span>
            </li>)}
          </ul>}
        </section>;
      }
      if (block.kind === "certification") {
        return <section key={index} className="rounded-xl border border-[#d9e6f7] bg-[#f5f9ff] px-4 py-4 sm:px-5">
          <div className="mb-3 flex items-center gap-2 text-[#172033]">
            <ShieldCheck size={20} className="shrink-0 text-[#3f7edb]" strokeWidth={1.8} aria-hidden="true"/>
            <h2 className="text-[16px] font-semibold sm:text-[18px]">{block.title || (locale === "en" ? "Certification" : "Сертификация")}</h2>
          </div>
          {block.text && <Paragraphs text={block.text} attachments={attachments}/>} 
          {Boolean(block.items?.length) && <ul className="mt-3 space-y-2 pl-5 text-[#4b5665]">
            {block.items?.map((item, itemIndex) => <li key={itemIndex} className="list-disc text-[16px] leading-[1.65] sm:text-[17px]">
              <ProductDescription description={item} attachments={attachments}/>
            </li>)}
          </ul>}
        </section>;
      }
      return <section key={index} className="space-y-3">
        {block.title && <h2 className="text-[18px] font-semibold text-[#172033] sm:text-[20px]">{block.title}</h2>}
        {block.text && <Paragraphs text={block.text} attachments={attachments} intro={block.kind === "intro"}/>}
        {Boolean(block.items?.length) && <ul className="space-y-2 pl-5">
          {block.items?.map((item, itemIndex) => <li key={itemIndex} className="list-disc text-[16px] leading-[1.7] text-[#4b5665] sm:text-[17px]">
            <ProductDescription description={item} attachments={attachments}/>
          </li>)}
        </ul>}
      </section>;
    })}
  </div>;
}
