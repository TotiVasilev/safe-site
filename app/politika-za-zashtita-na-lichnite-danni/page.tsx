import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import policy from "@/content/privacy-policy.json";

export const metadata: Metadata = {
  title: "Политика за защита на личните данни | ТЕТРАЕДЪР",
  description: "Информация за обработването и защитата на личните данни от ТЕТРАЕДЪР.",
};

// The CMS stores section bodies as Markdown. Render the supported formatting
// without interpreting user-authored HTML as executable markup.
function inlineMarkdown(value: string): React.ReactNode[] {
  const tokens = value.split(/(\[[^\]]+\]\(https?:\/\/[^)]+\)|\*\*[^*]+\*\*)/g);
  return tokens.map((token, i) => {
    const link = token.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
    if (link) return <a key={i} href={link[2]} className="text-[#3f7edb] underline" target="_blank" rel="noopener noreferrer">{link[1]}</a>;
    if (token.startsWith("**") && token.endsWith("**")) return <strong key={i}>{token.slice(2, -2)}</strong>;
    return token;
  });
}

function MarkdownBody({ body }: { body: string }) {
  const blocks = body.trim().split(/\n\s*\n/).filter(Boolean);
  return <>{blocks.map((block, index) => {
    const heading = block.match(/^## (.+)$/);
    if (heading) return <h2 key={index}>{heading[1]}</h2>;
    const lines = block.split("\n");
    if (lines.every((line) => /^\s*[-*]\s+/.test(line))) {
      return <ul key={index}>{lines.map((line, i) => <li key={i}>{inlineMarkdown(line.replace(/^\s*[-*]\s+/, ""))}</li>)}</ul>;
    }
    return <p key={index}>{lines.map((line, i) => <React.Fragment key={i}>{i > 0 ? <br /> : null}{inlineMarkdown(line)}</React.Fragment>)}</p>;
  })}</>;
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#f7f9fc] px-5 py-16 text-[#172033] sm:py-24" style={{fontFamily:'Arial, Helvetica, sans-serif'}}>
      <article className="mx-auto max-w-[850px] rounded-2xl bg-white px-6 py-10 shadow-sm sm:px-12 sm:py-14 [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:text-[23px] [&_h2]:font-semibold [&_p]:mb-4 [&_p]:leading-[1.8] [&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-2">
        <Link href="/" className="text-sm text-[#3f7edb] hover:underline">← Начало</Link>
        <h1 className="mb-7 mt-7 text-[36px] font-medium leading-tight sm:text-[48px]">{policy.title}</h1>
        <p className="text-sm text-[#66758b]">Последна актуализация: {policy.lastUpdated}</p>
        <MarkdownBody body={policy.content} />
      </article>
    </main>
  );
}
