import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class SeoService {
    constructor(
        private meta: Meta, private title: Title,
        @Inject(DOCUMENT) private doc: Document,
        @Inject(PLATFORM_ID) private pid: Object
    ) { }

    set(cfg: { title?: string; description?: string; image?: string; canonical?: string; jsonld?: any }) {
        if (cfg.title) this.title.setTitle(cfg.title);
        if (cfg.description) this.meta.updateTag({ name: 'description', content: cfg.description });
        if (cfg.image) {
            this.meta.updateTag({ property: 'og:image', content: cfg.image });
            this.meta.updateTag({ name: 'twitter:image', content: cfg.image });
        }
        if (cfg.canonical) this.setCanonical(cfg.canonical);
        if (cfg.jsonld) this.setJsonLd(cfg.jsonld);
    }
    private setCanonical(href: string) {
        let link = this.doc.querySelector<HTMLLinkElement>('link[rel="canonical"]');
        if (!link) { link = this.doc.createElement('link'); link.rel = 'canonical'; this.doc.head.appendChild(link); }
        link.href = href;
    }
    private setJsonLd(schema: any) {
        let script = this.doc.getElementById('jsonld-main') as HTMLScriptElement | null;
        if (!script) {
            script = this.doc.createElement('script');
            script.id = 'jsonld-main'; script.type = 'application/ld+json';
            this.doc.head.appendChild(script);
        }
        script.textContent = JSON.stringify(schema);
    }
}
