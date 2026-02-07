import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const i18nDir = path.join(rootDir, 'public', 'i18n');
const outPath = path.join(rootDir, 'public', 'search-index.json');

// MINIMAL exclusion: only exclude truly irrelevant stuff.
// BLOGS and FAQS are now INCLUDED.
const EXCLUDED_PREFIXES = ['FOOTER', 'COPYRIGHT', 'LANGUAGES_TITLE'];

const ROUTE_MAP = {
    'HOME': '/',
    'ABOUT': '/about',
    'SOLUTIONS': '/solutions',
    'PRODUCTS': '/products',
    'CONTACT': '/ContactUs',
    'CONTACT-US': '/ContactUs',
    'privacy': '/PrivacyPlicy', // Matches route key
    'terms': '/TermsPlicy',     // Matches route key
    'BLOGS': '/blogs',
    'BLOG_VIEW': '/blogs',      // Fallback to list if specific not found
    'FAQ': '/FAQS',
    'FAQS': '/FAQS',
    'NAVBAR': '/'               // Default, specific keys overridden below
};

function getRouteForKey(key) {
    const parts = key.split('.');
    const topLevel = parts[0];
    const secondLevel = parts[1];

    if (topLevel === 'NAVBAR') {
        if (secondLevel === 'ABOUT-US') return '/about';
        if (secondLevel === 'SOLUTIONS') return '/solutions';
        if (secondLevel === 'PRODUCTS') return '/products';
        if (secondLevel === 'kNOWLEDGE') return '/blogs'; // Matches NAVBAR.kNOWLEDGE
        if (secondLevel === 'CONTACT') return '/ContactUs';
        if (secondLevel === 'SUPPORT') return '/FAQS'; // Matches NAVBAR.SUPPORT (FAQs)
    }

    if (ROUTE_MAP[topLevel]) return ROUTE_MAP[topLevel];

    return '/';
}

function shouldExclude(key) {
    const parts = key.split('.');
    const topLevel = parts[0];
    if (EXCLUDED_PREFIXES.includes(topLevel)) return true;
    return false;
}

function flatten(obj, prefix = '', lang, docs) {
    for (const k in obj) {
        if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
            flatten(obj[k], prefix ? `${prefix}.${k}` : k, lang, docs);
        } else if (typeof obj[k] === 'string') {
            const key = prefix ? `${prefix}.${k}` : k;

            if (shouldExclude(key)) continue;

            const route = getRouteForKey(key);
            const text = obj[k];

            // Determine a user-friendly title if possible
            let title = key;
            if (key.startsWith('BLOGS')) title = 'Knowledge Base'; // Generic title for blog hits
            if (key.startsWith('FAQ') || key.startsWith('FAQS')) title = 'FAQs';
            if (key.includes('TITLE') && !key.includes('NAVBAR')) title = text; // Use the text itself if it's a title

            docs.push({
                id: `${lang}-${docs.length}`,
                lang: lang,
                key: key,
                title: title,
                route: route,
                text: text
            });
        }
    }
}

async function buildIndex() {
    try {
        const langs = ['en', 'ar'];
        const docs = [];

        for (const lang of langs) {
            const filePath = path.join(i18nDir, `${lang}.json`);
            if (!fs.existsSync(filePath)) {
                console.warn(`Warning: ${filePath} not found.`);
                continue;
            }
            const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            flatten(content, '', lang, docs);
        }

        const output = { docs };
        fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
        fs.writeFileSync(path.join(rootDir, 'public', 'build-status.txt'), `Done with ${docs.length} entries at ${new Date().toISOString()}`);

    } catch (err) {
        console.error('Error building search index:', err);
        process.exit(1);
    }
}

buildIndex();
