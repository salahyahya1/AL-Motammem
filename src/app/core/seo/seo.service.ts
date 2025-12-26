import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

type SeoConfig = {
    title?: string;
    description?: string;
    image?: string;
    canonical?: string;
    robots?: string;     // ✅ جديد
    jsonld?: any;
};

@Injectable({ providedIn: 'root' })
export class SeoService {
    constructor(
        private meta: Meta,
        private title: Title,
        @Inject(DOCUMENT) private doc: Document,
        @Inject(PLATFORM_ID) private pid: Object
    ) { }

    set(cfg: SeoConfig) {
        // ✅ Title
        if (cfg.title) {
            this.title.setTitle(cfg.title);

            // OG / Twitter title
            this.meta.updateTag({ property: 'og:title', content: cfg.title });
            this.meta.updateTag({ name: 'twitter:title', content: cfg.title });
        }

        // ✅ Description
        if (cfg.description) {
            this.meta.updateTag({ name: 'description', content: cfg.description });
            this.meta.updateTag({ property: 'og:description', content: cfg.description });
            this.meta.updateTag({ name: 'twitter:description', content: cfg.description });
        }

        // ✅ Image
        if (cfg.image) {
            this.meta.updateTag({ property: 'og:image', content: cfg.image });
            this.meta.updateTag({ name: 'twitter:image', content: cfg.image });
        }

        // ✅ Robots (noindex / nofollow)
        if (cfg.robots) {
            this.meta.updateTag({ name: 'robots', content: cfg.robots });
        } else {
            // افتراضي: index, follow (اختياري)
            this.meta.updateTag({ name: 'robots', content: 'index, follow' });
        }

        // ✅ Canonical (في البراوزر فقط)
        if (cfg.canonical && isPlatformBrowser(this.pid)) {
            this.setCanonical(cfg.canonical);
        }

        // ✅ JSON-LD
        if (cfg.jsonld && isPlatformBrowser(this.pid)) {
            this.setJsonLd(cfg.jsonld);
        }
    }

    private setCanonical(href: string) {
        let link = this.doc.querySelector<HTMLLinkElement>('link[rel="canonical"]');
        if (!link) {
            link = this.doc.createElement('link');
            link.rel = 'canonical';
            this.doc.head.appendChild(link);
        }
        link.href = href;
    }

    private setJsonLd(schema: any) {
        let script = this.doc.getElementById('jsonld-main') as HTMLScriptElement | null;
        if (!script) {
            script = this.doc.createElement('script');
            script.id = 'jsonld-main';
            script.type = 'application/ld+json';
            this.doc.head.appendChild(script);
        }
        script.textContent = JSON.stringify(schema);
    }
}
