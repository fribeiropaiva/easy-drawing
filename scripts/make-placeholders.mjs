// Throwaway generator for Phase 1 placeholder assets.
// Produces labelled blank "worksheet" frames (no drawings) so layouts can be checked.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = process.argv[2];
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";

function sheet({ w, h, title, subtitle, note, label }) {
  const cx = w / 2;
  const titleSize = Math.round(w * 0.08);
  const subSize = Math.round(w * 0.045);
  const noteSize = Math.round(w * 0.028);
  const tag = label
    ? `<rect x="${w - 40 - 200}" y="40" width="200" height="56" rx="28" fill="#FBF3E0"/>
  <text x="${w - 40 - 100}" y="77" text-anchor="middle" font-family="${SANS}" font-size="28" fill="#8A5C00">${label}</text>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${title}, ${subtitle}">
  <defs>
    <pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
      <circle cx="15" cy="15" r="1.6" fill="#DDDCD5"/>
    </pattern>
  </defs>
  <rect width="${w}" height="${h}" fill="#FFFFFF"/>
  <rect x="${Math.round(w * 0.07)}" y="${Math.round(w * 0.07)}" width="${w - Math.round(w * 0.14)}" height="${h - Math.round(w * 0.14)}" fill="url(#dots)"/>
  <rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" fill="none" stroke="#DDDCD5"/>
  ${tag}
  <text x="${cx}" y="${Math.round(h * 0.45)}" text-anchor="middle" font-family="${SERIF}" font-size="${titleSize}" fill="#23231F">${title}</text>
  <text x="${cx}" y="${Math.round(h * 0.45) + subSize * 1.9}" text-anchor="middle" font-family="${SANS}" font-size="${subSize}" fill="#1E5AA8">${subtitle}</text>
  <text x="${cx}" y="${h - Math.round(h * 0.06)}" text-anchor="middle" font-family="${SANS}" font-size="${noteSize}" fill="#6B6A63">${note}</text>
</svg>
`;
}

const subjects = [
  {
    slug: "coconut-tree",
    title: "Coconut Tree",
    levels: ["beginner", "intermediate", "advanced"],
    previews: ["advanced"],
  },
  {
    slug: "sunset",
    title: "Sunset",
    levels: ["beginner", "intermediate"],
    previews: ["intermediate"],
  },
  {
    slug: "boat-on-shore",
    title: "Boat on a Shore",
    levels: ["beginner", "intermediate"],
    previews: ["intermediate"],
  },
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

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const NOTE = "Placeholder worksheet. Upload the real artwork in Admin.";
let count = 0;

for (const s of subjects) {
  const files = [
    [
      `tutorials/${s.slug}/thumbnail/thumbnail.svg`,
      sheet({
        w: 600,
        h: 800,
        title: s.title,
        subtitle: "Drawing tutorial",
        note: "Placeholder thumbnail",
      }),
    ],
    ...s.levels.map((d) => [
      `tutorials/${s.slug}/${d}/tutorial-mock.svg`,
      sheet({
        w: 900,
        h: 1200,
        title: s.title,
        subtitle: `${cap(d)} tutorial`,
        note: NOTE,
      }),
    ]),
    ...s.previews.map((d) => [
      `tutorials/${s.slug}/${d}/preview-mock.svg`,
      sheet({
        w: 900,
        h: 1200,
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
