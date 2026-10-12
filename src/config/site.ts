/**
 * FORMA X template configuration.
 * Change company details, contact, SEO, and colors here.
 * Do not scatter these values through components.
 */

export type ContactMode = "demo" | "mailto" | "formspree";

export type SocialLink = {
  label: string;
  href: string;
};

export type SiteConfig = {
  name: string;
  fullName: string;
  logoText: string;
  tagline: string;
  description: string;
  url: string;
  locale: string;
  language: string;
  /** JSON-LD is emitted only when this is true and the details below are real. */
  isRealBusiness: boolean;
  contact: {
    phone: string;
    phoneHref: string;
    email: string;
    address: string;
    hours: string;
    mode: ContactMode;
    /** Used when mode is "formspree". Can also be set with NEXT_PUBLIC_FORMSPREE_ENDPOINT. */
    formspreeEndpoint: string;
  };
  socials: SocialLink[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
  };
  theme: {
    background: string;
    secondary: string;
    paper: string;
    lime: string;
    sage: string;
    stone: string;
    mist: string;
  };
  credits: {
    text: string;
    url: string;
  };
  copyrightYear: string;
};

export const siteConfig: SiteConfig = {
  name: "FORMA X",
  fullName: "FORMA X — Architecture & Interior Studio",
  logoText: "FORMA X",
  tagline: "Архитектур, интерьер, засвар",
  description:
    "FORMA X нь архитектур, интерьер, засвар тохижилтын студи. Бид орон зайг мэдрэмж болгодог.",
  url: "https://formax.example.com",
  locale: "mn_MN",
  language: "mn",
  isRealBusiness: false,
  contact: {
    phone: "+976 7000 0000",
    phoneHref: "tel:+97670000000",
    email: "hello@formax.studio",
    address: "Улаанбаатар хот, Сүхбаатар дүүрэг",
    hours: "Даваа–Баасан, 09:00–18:00",
    mode: "demo",
    formspreeEndpoint: "",
  },
  socials: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Facebook", href: "https://facebook.com" },
    { label: "Behance", href: "https://behance.net" },
  ],
  seo: {
    title: "FORMA X — Архитектур & Интерьер Студи",
    description:
      "Архитектур, интерьер дизайн, засвар тохижилт. FORMA X орон зайг мэдрэмж болгон бүтээнэ. Энэ хуудас нь BilguunSoft-ийн загвар вэбсайт юм.",
    keywords: [
      "архитектур",
      "интерьер дизайн",
      "засвар",
      "тохижилт",
      "орон зай",
      "Улаанбаатар",
    ],
    ogImage: "/images/cinematic.jpg",
  },
  theme: {
    background: "#141713",
    secondary: "#1D241E",
    paper: "#F2F0E7",
    lime: "#D7FA65",
    sage: "#A2B684",
    stone: "#C7C7BD",
    mist: "#D9DDD2",
  },
  credits: {
    text: "Website by BilguunSoft",
    url: "",
  },
  copyrightYear: "2026",
};

export type ContactDelivery =
  | { type: "demo" }
  | { type: "mailto"; email: string }
  | { type: "formspree"; endpoint: string };

export function getContactDelivery(): ContactDelivery {
  const endpoint =
    process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT ||
    siteConfig.contact.formspreeEndpoint;

  if (siteConfig.contact.mode === "formspree" && endpoint) {
    return { type: "formspree", endpoint };
  }

  if (siteConfig.contact.mode === "mailto" && siteConfig.contact.email) {
    return { type: "mailto", email: siteConfig.contact.email };
  }

  if (endpoint && siteConfig.contact.mode !== "mailto") {
    return { type: "formspree", endpoint };
  }

  return { type: "demo" };
}
