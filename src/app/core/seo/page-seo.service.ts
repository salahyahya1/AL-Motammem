import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export type PageSeoConfig = {
    title?: string;                 // بدون suffix
    description?: string;
    image?: string;                 // absolute preferred
    canonical?: string;             // absolute preferred
    robots?: string;                // "index,follow" | "noindex,nofollow"
    type?: 'website' | 'article';
    jsonld?: any;                   // object | object[]
    jsonldId?: string;              // default: 'jsonld-main'
    twitterCard?: 'summary' | 'summary_large_image';
};

@Injectable({ providedIn: 'root' })
export class PageSeoService {
    private readonly defaultJsonldId = 'jsonld-main';
    private readonly siteNameSuffix = 'المتمم';

    constructor(
        private meta: Meta,
        private titleSrv: Title,
        @Inject(DOCUMENT) private doc: Document,
        @Inject(PLATFORM_ID) private pid: Object
    ) { }

    apply(cfg: PageSeoConfig) {
        // 1) Title (مع suffix موحد)
        if (cfg.title) {
            const full = cfg.title.includes(this.siteNameSuffix)
                ? cfg.title
                : `${cfg.title} | ${this.siteNameSuffix}`;

            this.titleSrv.setTitle(full);
            this.meta.updateTag({ property: 'og:title', content: full });
            this.meta.updateTag({ name: 'twitter:title', content: full });
        }

        // 2) Description
        if (cfg.description) {
            this.meta.updateTag({ name: 'description', content: cfg.description });
            this.meta.updateTag({ property: 'og:description', content: cfg.description });
            this.meta.updateTag({ name: 'twitter:description', content: cfg.description });
        }

        // 3) Type
        this.meta.updateTag({ property: 'og:type', content: cfg.type || 'website' });

        // 4) Robots
        this.meta.updateTag({ name: 'robots', content: cfg.robots || 'index, follow' });

        // 5) Canonical + URLs
        if (cfg.canonical) {
            this.setCanonical(cfg.canonical);
            this.meta.updateTag({ property: 'og:url', content: cfg.canonical });
            this.meta.updateTag({ name: 'twitter:url', content: cfg.canonical });
        }

        // 6) Image
        if (cfg.image) {
            const image = cfg.image || 'https://almotammem.com/images/Icon.webp';
            this.meta.updateTag({ property: 'og:image', content: image });
            this.meta.updateTag({ name: 'twitter:image', content: image });
        }
                  // twitter card
        this.meta.updateTag({
            name: 'twitter:card',
            content: cfg.twitterCard || 'summary_large_image'
        });
        // 7) JSON-LD
        if (cfg.jsonld) {
            this.setJsonLd(cfg.jsonldId || this.defaultJsonldId, cfg.jsonld);
        }
    }

    setCanonical(href: string) {
        let link = this.doc.querySelector<HTMLLinkElement>('link[rel="canonical"]');
        if (!link) {
            link = this.doc.createElement('link');
            link.rel = 'canonical';
            this.doc.head.appendChild(link);
        }
        link.href = href;
    }

    setJsonLd(id: string, json: any) {
        // remove old
        const old = this.doc.getElementById(id);
        if (old) old.remove();

        const script = this.doc.createElement('script');
        script.type = 'application/ld+json';
        script.id = id;

        // حماية من </script>
        script.text = JSON.stringify(json).replace(/<\/script>/g, '<\\/script>');

        this.doc.head.appendChild(script);
    }

    removeJsonLd(id: string = this.defaultJsonldId) {
        const old = this.doc.getElementById(id);
        if (old) old.remove();
    }
}
