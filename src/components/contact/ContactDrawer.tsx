"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getContactDelivery, siteConfig } from "@/config/site";
import { serviceOptions } from "@/data/services";
import { lockScroll, unlockScroll } from "@/lib/scroll";
import { useContact } from "@/components/providers/ContactProvider";
import { useMotion } from "@/components/providers/MotionProvider";

type Fields = {
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
};

const empty: Fields = {
  name: "",
  phone: "",
  email: "",
  service: "",
  message: "",
};

export function ContactDrawer() {
  const { open, closeContact } = useContact();
  const { motionEnabled } = useMotion();
  const titleId = useId();
  const panelRef = useRef<HTMLElement>(null);
  const [fields, setFields] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Partial<Fields>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [notice, setNotice] = useState("");
  const delivery = getContactDelivery();

  useEffect(() => {
    if (!open) return;
    lockScroll();
    const timeout = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("input, select, textarea, button")?.focus();
    }, motionEnabled ? 420 : 0);

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") closeContact();
      if (event.key !== "Tab" || !panelRef.current) return;
      const nodes = panelRef.current.querySelectorAll<HTMLElement>(
        "button, [href], input, select, textarea",
      );
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timeout);
      document.removeEventListener("keydown", onKey);
      unlockScroll();
    };
  }, [open, closeContact, motionEnabled]);

  function update(key: keyof Fields, value: string) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  function validate() {
    const next: Partial<Fields> = {};
    if (!fields.name.trim()) next.name = "Нэрээ оруулна уу.";
    if (!fields.phone.trim()) next.phone = "Утасны дугаараа оруулна уу.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      next.email = "И-мэйл хаягаа зөв оруулна уу.";
    }
    if (!fields.service) next.service = "Үйлчилгээний төрлөө сонгоно уу.";
    if (fields.message.trim().length < 8) next.message = "Төслийн мэдээллээ товч бичнэ үү.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setNotice("");
    if (!validate()) return;

    const body = [
      `Нэр: ${fields.name}`,
      `Утас: ${fields.phone}`,
      `И-мэйл: ${fields.email}`,
      `Үйлчилгээ: ${fields.service}`,
      "",
      fields.message,
    ].join("\n");

    if (delivery.type === "demo") {
      setStatus("idle");
      setNotice(
        "Энэ бол загварын горим. Мэдээлэл хадгалагдаагүй, илгээгдээгүй. Бодит холбоос тохируулахын тулд src/config/site.ts файл дахь contact.mode утгыг солино уу.",
      );
      return;
    }

    if (delivery.type === "mailto") {
      const href = `mailto:${delivery.email}?subject=${encodeURIComponent("FORMA X — Төслийн хүсэлт")}&body=${encodeURIComponent(body)}`;
      window.location.href = href;
      setNotice("И-мэйл программ нээгдлээ. Захидлыг илгээхийн тулд өөрийн мэйл дээрээ баталгаажуулна уу.");
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch(delivery.endpoint, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fields.name,
          phone: fields.phone,
          email: fields.email,
          service: fields.service,
          message: fields.message,
        }),
      });
      if (!response.ok) throw new Error("Request failed");
      setStatus("sent");
      setFields(empty);
      setNotice("Хүсэлтийг хүлээн авлаа. Бид тантай удахгүй холбогдоно.");
    } catch {
      setStatus("error");
      setNotice("Илгээж чадсангүй. Дахин оролдоно уу, эсвэл шууд имэйлээр холбогдоно уу.");
    }
  }

  const duration = motionEnabled ? 0.55 : 0;

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Хаах"
            className="fixed inset-0 z-[80] bg-ink/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration }}
            onClick={closeContact}
          />
          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            data-lenis-prevent
            className="fixed inset-y-0 right-0 z-[81] flex w-full max-w-[560px] flex-col overflow-y-auto bg-paper text-ink"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="flex items-center justify-between px-6 py-5">
              <p className="font-accent text-[11px] uppercase tracking-[0.2em] text-ink/50">Contact</p>
              <button type="button" onClick={closeContact} className="font-accent text-[11px] uppercase tracking-[0.16em]">
                Хаах
              </button>
            </div>
            <div className="px-6 pb-10">
              <h2 id={titleId} className="font-display text-5xl font-black leading-[0.88] tracking-[-0.04em]">
                Төслөө
                <br />
                ярилцъя.
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-6 text-ink/70">
                Хэдэн мөрөөр төслөө танилцуулаарай. Бид эргээд холбогдоно.
              </p>
              {delivery.type === "demo" ? (
                <p className="mt-4 border border-ink/15 bg-lime/50 px-3 py-3 text-sm leading-6">
                  Загварын горим. Форм одоогоор илгээгдэхгүй. Тохиргоо: src/config/site.ts
                </p>
              ) : null}

              <form className="mt-8 space-y-5" onSubmit={onSubmit} noValidate>
                <Field
                  id="contact-name"
                  label="Нэр"
                  value={fields.name}
                  error={errors.name}
                  onChange={(value) => update("name", value)}
                />
                <Field
                  id="contact-phone"
                  label="Утас"
                  value={fields.phone}
                  error={errors.phone}
                  onChange={(value) => update("phone", value)}
                />
                <Field
                  id="contact-email"
                  label="И-мэйл"
                  type="email"
                  value={fields.email}
                  error={errors.email}
                  onChange={(value) => update("email", value)}
                />
                <label className="block" htmlFor="contact-service">
                  <span className="font-accent text-[11px] uppercase tracking-[0.16em]">Үйлчилгээний төрөл</span>
                  <select
                    id="contact-service"
                    value={fields.service}
                    onChange={(event) => update("service", event.target.value)}
                    className="mt-2 w-full border-b border-ink/20 bg-transparent py-3 outline-none focus:border-ink"
                  >
                    <option value="">Сонгоно уу</option>
                    {serviceOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.service ? <span className="mt-1 block text-sm text-red-800">{errors.service}</span> : null}
                </label>
                <label className="block" htmlFor="contact-message">
                  <span className="font-accent text-[11px] uppercase tracking-[0.16em]">Төслийн мэдээлэл</span>
                  <textarea
                    id="contact-message"
                    rows={5}
                    value={fields.message}
                    onChange={(event) => update("message", event.target.value)}
                    className="mt-2 w-full resize-none border-b border-ink/20 bg-transparent py-3 outline-none focus:border-ink"
                  />
                  {errors.message ? <span className="mt-1 block text-sm text-red-800">{errors.message}</span> : null}
                </label>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="bg-ink px-5 py-3 font-accent text-[12px] uppercase tracking-[0.16em] text-lime disabled:opacity-60"
                >
                  {status === "sending" ? "Илгээж байна..." : "Илгээх ↗"}
                </button>
                <p className="text-sm leading-6 text-ink/70" aria-live="polite">
                  {notice}
                </p>
                <p className="text-xs text-ink/50">
                  {siteConfig.contact.email} · {siteConfig.contact.phone}
                </p>
              </form>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}

function Field({
  id,
  label,
  value,
  error,
  onChange,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block" htmlFor={id}>
      <span className="font-accent text-[11px] uppercase tracking-[0.16em]">{label}</span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full border-b border-ink/20 bg-transparent py-3 outline-none focus:border-ink"
      />
      {error ? <span className="mt-1 block text-sm text-red-800">{error}</span> : null}
    </label>
  );
}
