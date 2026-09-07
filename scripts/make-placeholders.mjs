// Generates labelled blank "worksheet" frames (no drawings) for levels that have no
// real artwork yet, so layouts can be checked. Usage:
//   node scripts/make-placeholders.mjs public/mock-assets
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = process.argv[2] ?? "public/mock-assets";
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";

function sheet({ w, h, title, subtitle, note, label }) {
  const cx = w / 2;
  const titleSize = Math.round(w * 0.08);
  const subSize = Math.round(w * 0.045);
  const noteSize = Math.round(w * 0.028);
  const tag = label
    ? `<rect x="${w - 240}" y="40" width="200" height="56" rx="28" fill="#FBF3E0"/>
  <text x="${w - 140}" y="77" text-anchor="middle" font-family="${SANS}" font-size="28" fill="#8A5C00">${label}</text>`
    : "";
  const inset = Math.round(w * 0.07);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${title}, ${subtitle}">
  <defs>
    <pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
      <circle cx="15" cy="15" r="1.6" fill="#DDDCD5"/>
    </pattern>
  </defs>
  <rect width="${w}" height="${h}" fill="#FFFFFF"/>
  <rect x="${inset}" y="${inset}" width="${w - inset * 2}" height="${h - inset * 2}" fill="url(#dots)"/>
  <rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" fill="none" stroke="#DDDCD5"/>
  ${tag}
  <text x="${cx}" y="${Math.round(h * 0.45)}" text-anchor="middle" font-family="${SERIF}" font-size="${titleSize}" fill="#23231F">${title}</text>
  <text x="${cx}" y="${Math.round(h * 0.45) + subSize * 1.9}" text-anchor="middle" font-family="${SANS}" font-size="${subSize}" fill="#1E5AA8">${subtitle}</text>
  <text x="${cx}" y="${h - Math.round(h * 0.06)}" text-anchor="middle" font-family="${SANS}" font-size="${noteSize}" fill="#6B6A63">${note}</text>
</svg>
`;
}

// Only subjects/levels without real artwork. Real sheets are named <slug>-<level>.png.
const subjects = [
  { slug: "butterfly", title: "Butterfly", levels: ["beginner"], previews: [] },
  {
    slug: "dog",
    title: "Dog",
    levels: ["beginner", "intermediate", "advanced"],
    previews: ["intermediate"],
  },
  {
    slug: "lighthouse",
    title: "Lighthouse",
    levels: ["beginner", "intermediate"],
    previews: ["intermediate"],
  },
  { slug: "palm-tree", title: "Palm Tree", levels: ["beginner"], previews: [] },
];

const WORKSHEET = { w: 1024, h: 1536 }; // 2:3, same as the real exports
const THUMBNAIL = { w: 600, h: 900 };
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const NOTE = "Placeholder worksheet. Upload the real artwork in Admin.";
let count = 0;

for (const s of subjects) {
  const files = [
    [
      `tutorials/${s.slug}/thumbnail/thumbnail.svg`,
      sheet({
        ...THUMBNAIL,
        title: s.title,
        subtitle: "Drawing tutorial",
        note: "Placeholder thumbnail",
      }),
    ],
    ...s.levels.map((d) => [
      `tutorials/${s.slug}/${d}/tutorial-mock.svg`,
      sheet({
        ...WORKSHEET,
        title: s.title,
        subtitle: `${cap(d)} tutorial`,
        note: NOTE,
      }),
    ]),
    ...s.previews.map((d) => [
      `tutorials/${s.slug}/${d}/preview-mock.svg`,
      sheet({
        ...WORKSHEET,
        title: s.title,
        subtitle: `${cap(d)} tutorial preview`,
        note: "Public preview placeholder. The full worksheet stays protected.",
        label: "Preview",
      }),
    ]),
  ];
  for (const [rel, svg] of files) {
    const out = join(root, rel);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, svg);
    count += 1;
  }
}
console.log(`wrote ${count} placeholder files under ${root}`);
