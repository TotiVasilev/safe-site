"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import type { ProductAttachment } from "@/data/products";

type Props = { description: string; attachments?: ProductAttachment[] };

export default function ProductDescription({ description, attachments = [] }: Props) {
  const [image, setImage] = useState<string | null>(null);
  const matches = attachments.filter((item) => item.phrase && item.file && description.includes(item.phrase));
  const parts: { text: string; file?: string }[] = [];
  let position = 0;
  while (position < description.length) {
    const candidates = matches.map((item) => ({ ...item, index: description.indexOf(item.phrase, position) })).filter((item) => item.index >= 0).sort((a, b) => a.index - b.index || b.phrase.length - a.phrase.length);
    const match = candidates[0];
    if (!match) { parts.push({ text: description.slice(position) }); break; }
    if (match.index > position) parts.push({ text: description.slice(position, match.index) });
    parts.push({ text: match.phrase, file: match.file });
    position = match.index + match.phrase.length;
  }
  const isImage = (file: string) => /\.(png|jpe?g|gif|webp|avif|svg)(?:[?#].*)?$/i.test(file);
  const isSafeFile = (file: string) => file.startsWith("/products/uploads/") || /^https:\/\//i.test(file);

  return <>
    {parts.map((part, index) => part.file && isSafeFile(part.file) ? (
      <a key={index} href={part.file} target="_blank" rel="noopener noreferrer"
        className="relative z-20 font-medium text-blue-600 no-underline hover:text-blue-800"
        onClick={(event) => {
          event.stopPropagation();
          if (part.file && isImage(part.file)) { event.preventDefault(); setImage(part.file); }
        }}>{part.text}</a>
    ) : <span key={index}>{part.text}</span>)}
    {image && typeof document !== "undefined" && createPortal(<div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 p-5" role="dialog" aria-modal="true" aria-label="Преглед на изображение" onClick={(event) => { event.stopPropagation(); setImage(null); }}>
      <button type="button" className="absolute right-5 top-5 rounded-full bg-white px-4 py-2 text-black" onClick={(event) => { event.stopPropagation(); setImage(null); }} aria-label="Затвори">✕</button>
      {/* A user-uploaded image can have arbitrary dimensions. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt="Прикачено изображение" className="max-h-[90vh] max-w-full object-contain" onClick={(event) => event.stopPropagation()} />
    </div>, document.body)}
  </>;
}
