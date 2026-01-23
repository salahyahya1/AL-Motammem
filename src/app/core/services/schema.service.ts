import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class SchemaService {
    constructor(@Inject(DOCUMENT) private doc: Document) { }


    setJsonLd(id: string, json: object) {
        const old = this.doc.getElementById(id);
        if (old) old.remove();

        const script = this.doc.createElement('script');
        script.type = 'application/ld+json';
        script.id = id;
        script.text = JSON.stringify(json).replace(/<\/script>/g, '<\\/script>');
        this.doc.head.appendChild(script);
    }

    removeJsonLd(id: string) {
        const old = this.doc.getElementById(id);
        if (old) old.remove();
    }
}
