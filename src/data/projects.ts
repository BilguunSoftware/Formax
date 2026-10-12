export type ProjectCategory = "architecture" | "interior" | "renovation";

export type ProjectImage = {
  src: string;
  alt: string;
};

export type Project = {
  slug: string;
  name: string;
  number: string;
  category: ProjectCategory;
  year: string;
  location: string;
  area: string;
  client: string;
  cover: string;
  coverAlt: string;
  gallery: ProjectImage[];
  summary: string;
  description: string[];
  materials: string[];
  /** Demo template content. Not a completed commission. */
  sample: true;
};

export const categoryLabels: Record<ProjectCategory, string> = {
  architecture: "Архитектур",
  interior: "Интерьер",
  renovation: "Засвар",
};

export const projectFilters = [
  { id: "all", label: "Бүгд" },
  { id: "architecture", label: "Архитектур" },
  { id: "interior", label: "Интерьер" },
  { id: "renovation", label: "Засвар" },
] as const;

export type ProjectFilter = (typeof projectFilters)[number]["id"];

export const projects: Project[] = [
  {
    slug: "monolith-house",
    name: "MONOLITH HOUSE",
    number: "01",
    category: "architecture",
    year: "2026",
    location: "Жишээ байршил — Улаанбаатар",
    area: "240 м²",
    client: "Жишээ үзэл баримтлал",
    cover: "/images/project-monolith.jpg",
    coverAlt: "Жишээ зураг: цул хэлбэрийн орчин үеийн сууц",
    gallery: [
      {
        src: "/images/project-monolith.jpg",
        alt: "Жишээ зураг: MONOLITH HOUSE-ийн фасад",
      },
      {
        src: "/images/project-monolith-2.jpg",
        alt: "Жишээ зураг: гэрэлтэй зочны өрөө",
      },
      {
        src: "/images/material.jpg",
        alt: "Жишээ зураг: материалын гадаргуу",
      },
    ],
    summary:
      "Цул бетон, өргөн шил, нам гүм хашаа. Архитектурын жишээ үзэл баримтлал.",
    description: [
      "MONOLITH HOUSE нь цул хэлбэр, ил бетон, өргөн шилэн хавтгайн харьцааг судалсан архитектурын жишээ юм. Гэрэл өдрийн турш эзлэхүүнийг тойрч, дотор гадна зааг зөөлөн уусна.",
      "Төлөвлөлт нь нэг давхарт амьдрал, хоёр дахь давхарт нам гүм өрөөг тусгаарласан. Хашааны хана барилгыг гудамжнаас хамгаалж, дотор талд нээлттэй хашаа үлдээнэ.",
    ],
    materials: ["Ил бетон", "Дулаан царс", "Бүдэг металл", "Өргөн шил"],
    sample: true,
  },
  {
    slug: "quiet-matter",
    name: "QUIET MATTER",
    number: "02",
    category: "interior",
    year: "2025",
    location: "Жишээ байршил — Улаанбаатар",
    area: "96 м²",
    client: "Жишээ үзэл баримтлал",
    cover: "/images/project-quiet.jpg",
    coverAlt: "Жишээ зураг: нам гүм интерьерийн зочны өрөө",
    gallery: [
      {
        src: "/images/project-quiet.jpg",
        alt: "Жишээ зураг: QUIET MATTER зочны өрөө",
      },
      {
        src: "/images/project-quiet-2.jpg",
        alt: "Жишээ зураг: зөөлөн гэрэлтэй интерьер",
      },
      {
        src: "/images/hero-secondary.jpg",
        alt: "Жишээ зураг: интерьерийн нарийн хэсэг",
      },
    ],
    summary:
      "Дуу чимээг намжаасан материал, зөөлөн гэрэл, нээлттэй төлөвлөлт.",
    description: [
      "QUIET MATTER нь дуу чимээг намжаасан гадаргуу, бүлээн өнгө, зөөлөн гэрлийг нэгтгэсэн интерьерийн жишээ юм. Тавилга цөөхөн, хөдөлгөөн чөлөөтэй.",
      "Гал тогоо болон зочны хэсэг нэг эзлэхүүнд багтах боловч материал солигдох үед бүсүүд уншигдана. Шүүгээний шугам тааз хүртэл үргэлжилж, орон зайг нам гүм харагдуулна.",
    ],
    materials: ["Шохойн замаск", "Маалинган даавуу", "Цайвар царс", "Зөөлөн гэрэл"],
    sample: true,
  },
  {
    slug: "new-form-office",
    name: "NEW FORM OFFICE",
    number: "03",
    category: "renovation",
    year: "2025",
    location: "Жишээ байршил — Улаанбаатар",
    area: "420 м²",
    client: "Жишээ үзэл баримтлал",
    cover: "/images/project-office.jpg",
    coverAlt: "Жишээ зураг: гэрэлтэй нээлттэй оффис",
    gallery: [
      {
        src: "/images/project-office.jpg",
        alt: "Жишээ зураг: NEW FORM OFFICE-ийн ажлын талбар",
      },
      {
        src: "/images/project-office-2.jpg",
        alt: "Жишээ зураг: хурлын өрөө, шилэн хана",
      },
      {
        src: "/images/service-renovation.jpg",
        alt: "Жишээ зураг: засварын зураг төслийн хэсэг",
      },
    ],
    summary:
      "Хуучин оффисын каркасыг хадгалж, ажлын орчныг илүү нээлттэй болгосон засварын жишээ.",
    description: [
      "NEW FORM OFFICE нь хуучин оффисын бүтцийг хадгалж, хаалттай өрөөнүүдийг гэрэлтэй, нээлттэй ажлын орчин болгосон засварын жишээ үзэл баримтлал юм.",
      "Гол коридорыг цуцалж, дунд хэсэгт уулзах талбай гаргасан. Шилэн хуваалт дуу чимээг зөөлрүүлж, багийг бие биенээсээ таслахгүй.",
    ],
    materials: ["Дахин ашигласан царс", "Шилэн хуваалт", "Хар металл", "Акустик эсгий"],
    sample: true,
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getNextProject(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index < 0) return projects[0];
  return projects[(index + 1) % projects.length];
}
