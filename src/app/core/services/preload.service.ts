import {
    Injectable,
    Renderer2,
    RendererFactory2,
    Inject,
    PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface PreloadItem {
    href: string;
    as: string; // image | style | script | font | fetch | video | audio ...
    rel?: 'preload' | 'prefetch'; // NEW
    media?: string;
    type?: string; // e.g. 'video/mp4', 'image/webp'
    crossorigin?: 'anonymous' | 'use-credentials';
    fetchpriority?: 'high' | 'low' | 'auto';
}

@Injectable({ providedIn: 'root' })
export class PreloadService {
    private renderer: Renderer2;
    private addedLinks: HTMLLinkElement[] = [];
    private isBrowser: boolean;

    constructor(
        rendererFactory: RendererFactory2,
        @Inject(PLATFORM_ID) platformId: object
    ) {
        this.renderer = rendererFactory.createRenderer(null, null);
        this.isBrowser = isPlatformBrowser(platformId);
    }

    addPreloads(preloads: PreloadItem[]) {
        if (!this.isBrowser) return;

        // يشيل بس اللي السيرفس أضافه (page-specific زي الأول)
        this.clearPreloads();

        preloads.forEach((p) => {
            if (!p?.href) return;

            const link = this.renderer.createElement('link') as HTMLLinkElement;

            // preload vs prefetch
            this.renderer.setAttribute(link, 'rel', p.rel ?? 'preload');

            // FIX: منع double-encoding (%2520)
            this.renderer.setAttribute(link, 'href', this.normalizeHref(p.href));

            // Normalize as (Safari warns مع video/audio)
            this.renderer.setAttribute(link, 'as', this.normalizeAs(p.as));

            if (p.type) this.renderer.setAttribute(link, 'type', p.type);
            if (p.media) this.renderer.setAttribute(link, 'media', p.media);
            if (p.crossorigin) this.renderer.setAttribute(link, 'crossorigin', p.crossorigin);
            if (p.fetchpriority) this.renderer.setAttribute(link, 'fetchpriority', p.fetchpriority);

            this.renderer.appendChild(document.head, link);
            this.addedLinks.push(link);
        });
    }

    clearPreloads() {
        if (!this.isBrowser) return;

        this.addedLinks.forEach((link) => {
            if (link?.parentNode === document.head) {
                this.renderer.removeChild(document.head, link);
            }
        });
        this.addedLinks = [];
    }

    private normalizeHref(href: string): string {
        // فكّ أي encoding قديم وبعدين encode مرة واحدة
        try {
            return encodeURI(decodeURI(href));
        } catch {
            // لو فيه sequence بايظة، على الأقل بدّل المسافات
            return href.replace(/ /g, '%20');
        }
    }

    private normalizeAs(asValue: string): string {
        const v = (asValue || '').toLowerCase().trim();

        // video/audio كتير من المتصفحات بتعمل warning => خليها fetch
        if (v === 'video' || v === 'audio') return 'fetch';

        const allowed = new Set([
            'fetch',
            'image',
            'style',
            'script',
            'font',
            'document',
            'track',
            'worker',
        ]);

        return allowed.has(v) ? v : 'fetch';
    }
}
