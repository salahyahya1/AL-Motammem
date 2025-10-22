// seo-title.strategy.ts
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TitleStrategy, RouterStateSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class SeoTitleStrategy extends TitleStrategy {
    constructor(private readonly title: Title) {
        super();
    }

    override updateTitle(snapshot: RouterStateSnapshot) {
        const pageTitle = this.buildTitle(snapshot);
        this.title.setTitle(pageTitle ? `${pageTitle} | Al-Motammem` : 'Al-Motammem');
    }
}
