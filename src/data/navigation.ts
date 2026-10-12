export type NavLink = {
  label: string;
  href: string;
  id?: string;
};

export const mainNav: NavLink[] = [
  { label: "Төслүүд", href: "/#projects", id: "projects" },
  { label: "Үйлчилгээ", href: "/#services", id: "services" },
  { label: "Бидний тухай", href: "/#about", id: "about" },
];

export const footerNav: NavLink[] = [
  { label: "Нүүр", href: "/" },
  { label: "Төслүүд", href: "/#projects", id: "projects" },
  { label: "Үйлчилгээ", href: "/#services", id: "services" },
  { label: "Бидний тухай", href: "/#about", id: "about" },
  { label: "Холбогдох", href: "/#contact", id: "contact" },
];

export const ctaLabel = "LET'S TALK";
