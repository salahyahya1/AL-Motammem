import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class SeoLinkService {
    constructor(@Inject(DOCUMENT) private doc: Document, private title: Title,
        private meta: Meta,) { }

    setCanonical(url: string) {
        let link = this.doc.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
        if (!link) {
            link = this.doc.createElement('link');
            link.setAttribute('rel', 'canonical');
            this.doc.head.appendChild(link);
        }
        link.setAttribute('href', url);
    }
    //function عشان تضيف ال meta tags لاي صفحه انته عايزها
    setSocialMeta({ title, desc, image, url, type = 'website' }: any) {
        this.title.setTitle(title);

        // description
        this.meta.removeTag("name='description'");
        this.meta.addTag({ name: 'description', content: desc });

        // OG
        this.meta.removeTag("property='og:type'");
        this.meta.addTag({ property: 'og:type', content: type });

        this.meta.removeTag("property='og:title'");
        this.meta.addTag({ property: 'og:title', content: title });

        this.meta.removeTag("property='og:description'");
        this.meta.addTag({ property: 'og:description', content: desc });

        this.meta.removeTag("property='og:image'");
        this.meta.addTag({ property: 'og:image', content: image });

        this.meta.removeTag("property='og:url'");
        this.meta.addTag({ property: 'og:url', content: url });

        // Twitter (لازم name)
        this.meta.removeTag("name='twitter:card'");
        this.meta.addTag({ name: 'twitter:card', content: 'summary_large_image' });

        this.meta.removeTag("name='twitter:title'");
        this.meta.addTag({ name: 'twitter:title', content: title });

        this.meta.removeTag("name='twitter:description'");
        this.meta.addTag({ name: 'twitter:description', content: desc });

        this.meta.removeTag("name='twitter:image'");
        this.meta.addTag({ name: 'twitter:image', content: image });

        this.meta.removeTag("name='twitter:url'");
        this.meta.addTag({ name: 'twitter:url', content: url });
    }


}
