// preload.service.ts
import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PreloadService {
    private renderer: Renderer2;
    private addedLinks: HTMLLinkElement[] = [];

    constructor(private rendererFactory: RendererFactory2) {
        this.renderer = rendererFactory.createRenderer(null, null);
    }

    addPreloads(preloads: { href: string; as: string; media?: string }[]) {
        // أولًا نشيل أي preloads قديمة
        this.clearPreloads();

        preloads.forEach(p => {
            const link = this.renderer.createElement('link');
            this.renderer.setAttribute(link, 'rel', 'preload');
            this.renderer.setAttribute(link, 'href', p.href);
            this.renderer.setAttribute(link, 'as', p.as);
            if (p.media) this.renderer.setAttribute(link, 'media', p.media);
            this.renderer.appendChild(document.head, link);
            this.addedLinks.push(link);
        });
    }

    clearPreloads() {
        this.addedLinks.forEach(link => this.renderer.removeChild(document.head, link));
        this.addedLinks = [];
    }
}
