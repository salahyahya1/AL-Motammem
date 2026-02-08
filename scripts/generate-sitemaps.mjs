import fs from "fs/promises";

const SITE = "https://almotammem.com";
const API_BASE = "https://almotammem.com/api/articles/allblogs";

const OUT_DIR = "./public";
const OUT_INDEX = `${OUT_DIR}/sitemap.xml`;
const OUT_STATIC = `${OUT_DIR}/sitemap-static.xml`;
const OUT_BLOGS = `${OUT_DIR}/sitemap-blogs.xml`;

const BLOG_VIEW_PREFIX = `${SITE}/blogs/blog/`;

const staticUrls = [
    { loc: `${SITE}/`, changefreq: "weekly", priority: "1.0" },
    { loc: `${SITE}/about`, changefreq: "monthly", priority: "0.8" },
    { loc: `${SITE}/solutions`, changefreq: "monthly", priority: "0.8" },
    { loc: `${SITE}/products`, changefreq: "monthly", priority: "0.8" },
    { loc: `${SITE}/plans`, changefreq: "monthly", priority: "0.8" },
    { loc: `${SITE}/blogs`, changefreq: "daily", priority: "0.7" },
    { loc: `${SITE}/FAQS`, changefreq: "monthly", priority: "0.6" },
    { loc: `${SITE}/ContactUs`, changefreq: "monthly", priority: "0.6" },
    { loc: `${SITE}/TermsPlicy`, changefreq: "yearly", priority: "0.4" },
    { loc: `${SITE}/PrivacyPlicy`, changefreq: "yearly", priority: "0.4" },
];

// ===== Helpers =====
function escapeXml(str) {
    return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&apos;");
}

function toIso(dateStr) {
    try {
        return new Date(dateStr).toISOString();
    } catch {
        return "";
    }
}

function buildUrlset(urls) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
            .map((u) => {
                const lastmod = u.lastmod ? toIso(u.lastmod) : "";
                return `
  <url>
    <loc>${escapeXml(u.loc)}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`;
            })
            .join("")}
</urlset>
`;
}

function buildSitemapIndex() {
    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE}/sitemap-static.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${SITE}/sitemap-blogs.xml</loc>
  </sitemap>
</sitemapindex>
`;
}

async function fetchAllBlogs() {
    const all = [];
    let page = 1;
    let totalPages = 1;

    while (page <= totalPages) {
        const url = new URL(API_BASE);
        url.searchParams.set("page", String(page));

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error(`Failed page=${page}: ${res.status}`);

        const json = await res.json();
        all.push(...(json?.data ?? []));

        totalPages = json?.pagination?.totalPages ?? totalPages;
        page++;




    }

    return all;
}

// ===== Main =====
async function main() {
    await fs.mkdir(OUT_DIR, { recursive: true });

    // 1) static sitemap
    const staticXml = buildUrlset(staticUrls);
    await fs.writeFile(OUT_STATIC, staticXml, "utf8");

    // 2) blogs sitemap
    const blogs = await fetchAllBlogs();
    const blogUrls = blogs
        .map((b) => {
            const slug = b?.englishURL; // ✅ englishURL
            if (!slug) return null;

            return {
                loc: `${BLOG_VIEW_PREFIX}${encodeURIComponent(slug)}`,
                lastmod: b.updatedAt || b.createdAt,
                changefreq: "weekly",
                priority: "0.6",
            };
        })
        .filter(Boolean);

    // remove duplicates
    const uniq = new Map();
    blogUrls.forEach((u) => uniq.set(u.loc, u));
    const blogsXml = buildUrlset([...uniq.values()]);
    await fs.writeFile(OUT_BLOGS, blogsXml, "utf8");

    // 3) sitemap index
    const indexXml = buildSitemapIndex();
    await fs.writeFile(OUT_INDEX, indexXml, "utf8");


}

main().catch((e) => {
    console.error("❌ generate-sitemaps failed:", e);
    process.exit(1);
});
