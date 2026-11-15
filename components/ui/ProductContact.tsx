"use client";

import { useRef, useState, type FormEvent } from "react";

type ProductContactProps = {
  productName: string;
  locale?: "bg" | "en";
  variant?: "product" | "model";
  desktopOnly?: boolean;
};

const copy = {
  bg: {
    productLabel: "Имате въпроси?",
    productTitle: "Нека намерим правилното решение за вашите нужди.",
    introduction: "Свържете се с нас за повече информация относно моделите, характеристиките и възможностите за доставка и монтаж.",
    customOrder: "Предлагаме и възможност за изработка по индивидуална поръчка, съобразена с вашите размери, предпочитания и специфични изисквания.",
    modelLabel: "Нуждаете се от информация?",
    modelTitle: "Свържете се с нас за повече информация.",
    modelDescription: "Нашият екип може да ви помогне с избора на подходящ модел и да предостави допълнителна информация.",
    name: "Име", phone: "Телефон", email: "Имейл", message: "Вашето съобщение",
    button: "Свържете се с нас", subject: "Запитване за продукт", product: "Продукт",
    sending: "Изпращане…", success: "Вашето запитване е изпратено успешно!", error: "Запитването не беше изпратено. Моля, опитайте отново.", close: "Затвори формата",
  },
  en: {
    productLabel: "Have questions?",
    productTitle: "Let us find the right solution for your needs.",
    introduction: "Contact us for more information about the models, their specifications, and delivery and installation options.",
    customOrder: "We also offer custom-made solutions, tailored to your specific dimensions, preferences, and requirements.",
    modelLabel: "Need more information?",
    modelTitle: "Contact us for more information.",
    modelDescription: "Our team can help you choose the right model and provide additional information.",
    name: "Name", phone: "Phone", email: "Email", message: "Your message",
    button: "Contact us", subject: "Product inquiry", product: "Product",
    sending: "Sending…", success: "Your inquiry was sent successfully!", error: "Your inquiry could not be sent. Please try again.", close: "Close form",
  },
};

const fieldClass = "mt-1.5 w-full min-w-0 rounded-xl border border-white/20 bg-white/[0.07] px-4 py-3 text-base text-white outline-none transition-colors focus:border-[#3f7edb]";
const buttonClass = "rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3f7edb]";

export default function ProductContact({ productName, locale = "bg", variant = "product", desktopOnly = false }: ProductContactProps) {
  const t = copy[locale];
  const isModel = variant === "model";

  const [mobileOpen, setMobileOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const pending = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const value = (key: string) => String(data.get(key) ?? "").trim();
    pending.current = true;
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: value("name"), phone: value("phone"), email: value("email"),
          message: value("message"), website: value("website"), productName, locale,
        }),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) throw new Error("Submission failed");
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      pending.current = false;
    }
  }

  return (
    <section className={`mt-32 rounded-3xl bg-black px-8 py-16 text-white sm:px-12 lg:px-16 ${desktopOnly ? "hidden lg:block" : ""}`}>
      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-12 xl:gap-16">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">
            {isModel ? t.modelLabel : t.productLabel}
          </p>
          <h2 className="mt-5 max-w-2xl break-words text-3xl font-medium tracking-tight sm:text-4xl">
            {isModel ? t.modelTitle : t.productTitle}
          </h2>
          {isModel ? (
            <p className="mt-5 max-w-xl leading-7 text-white/60">{t.modelDescription}</p>
          ) : (
            <>
              <p className="mt-5 hidden max-w-xl leading-7 text-white/60 lg:block">{t.introduction}</p>
              <p className="mt-5 max-w-xl leading-7 text-white/60 lg:mt-7">{t.customOrder}</p>
            </>
          )}
          <button type="button" aria-expanded={mobileOpen} aria-controls="product-contact-form" onClick={() => setMobileOpen((open) => !open)} className={`mt-8 flex w-fit ml-auto sm:ml-0 lg:hidden ${buttonClass}`}>
            {mobileOpen ? t.close : t.button}
          </button>
        </div>

        <form id="product-contact-form" onSubmit={handleSubmit} className={`${mobileOpen ? "block mt-8" : "hidden"} min-w-0 space-y-4 lg:mt-0 lg:block`} aria-label={t.button} aria-busy={status === "sending"}>
          <div className="hidden" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
          <div className="grid grid-cols-2 gap-4">
            <label className="min-w-0 text-sm text-white/70">
              {t.name}
              <input className={fieldClass} name="name" autoComplete="name" required maxLength={120} />
            </label>
            <label className="min-w-0 text-sm text-white/70">
              {t.phone}
              <input className={fieldClass} type="tel" name="phone" autoComplete="tel" required maxLength={60} />
            </label>
          </div>
          <label className="block text-sm text-white/70">
            {t.email}
            <input className={fieldClass} type="email" name="email" autoComplete="email" required maxLength={254} />
          </label>
          <label className="block text-sm text-white/70">
            {t.message}
            <textarea className={`${fieldClass} min-h-32 resize-y`} name="message" rows={5} required maxLength={2000} />
          </label>
          <div className="flex flex-col items-end gap-3 pt-1">
            <button type="submit" disabled={status === "sending"} className={`${buttonClass} disabled:cursor-wait disabled:opacity-60`}>{status === "sending" ? t.sending : t.button}</button>
            <div role="status" aria-live="polite" className="text-right text-sm leading-5">
              {status === "success" && <p className="text-green-300">{t.success}</p>}
              {status === "error" && <p className="text-red-300">{t.error}</p>}
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
