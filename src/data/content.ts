export type HeroLine = {
  text: string;
  variant: "fill" | "outline" | "lime";
};

export const homeContent = {
  hero: {
    lines: [
      { text: "ОРОН", variant: "fill" },
      { text: "ЗАЙГ", variant: "outline" },
      { text: "ЭВД.", variant: "lime" },
      { text: "ШИНЭЭР", variant: "outline" },
      { text: "БҮТЭЭ.", variant: "fill" },
    ] satisfies HeroLine[],
    kicker: "АРХИТЕКТУР / ИНТЕРЬЕР / ЗАСВАР",
    description: [
      "Бид зүгээр л барилга бүтээдэггүй.",
      "Бид орон зайг мэдрэмж болгодог.",
    ],
    explore: "EXPLORE WORK",
    figure: {
      index: "FIG. 01",
      title: ["FORM", "FOLLOWS", "FEELING."],
      meta: "DESIGN / SPACE / HUMAN",
    },
  },
  marquee: [
    "BEYOND THE ORDINARY",
    "FORM FOLLOWS FEELING",
    "BEYOND THE ORDINARY",
  ],
  manifesto: {
    index: "02 — MANIFESTO",
    lines: ["ЭНГИЙНЭЭС", "ЦААШ.", "ХЭВШМЭЛЭЭС", "ӨӨР."],
    body: "Бидний хувьд архитектур бол хайрцагт багтах ёсгүй бүтээлч сэтгэлгээ. Шинэ санаа, орчин үеийн материал, хүний мэдрэмжийг нэгтгэн давтагдашгүй орон зай бүтээнэ.",
    note: "Үзэл баримтлалын тэмдэглэгээ. Компанийн гүйцэтгэлийн тоо биш.",
    metrics: [
      { value: "01 / 03", label: "КОНЦЕПЦ" },
      { value: "360°", label: "ЦОГЦ ШИЙДЭЛ" },
      { value: "∞", label: "БҮТЭЭЛЧ БОЛОМЖ" },
    ],
  },
  projects: {
    index: "03 — SELECTED",
    lines: ["СОНГОСОН", "БҮТЭЭЛҮҮД."],
    note: "Доорх бүтээлүүд нь загварын жишээ үзүүлэн бөгөөд бодит захиалагчийн ажил биш.",
  },
  cinematic: {
    lines: ["ДҮРЭМ", "ЭВДСЭН", "ДИЗАЙН."],
    diagonal: "SPACE  /  FORM  /  LIGHT  /  MATTER",
  },
  services: {
    index: "04 — PRACTICE",
    lines: ["БИДНИЙ", "ЧАДВАР."],
  },
  contact: {
    index: "05 — CONTACT",
    prompt: "ОНЦГОЙ САНАА БАЙНА УУ?",
    lines: ["ХАМТДАА", "БҮТЭЭЕ."],
    cta: "ТӨСЛӨӨ ЯРИЛЦАХ",
  },
};
