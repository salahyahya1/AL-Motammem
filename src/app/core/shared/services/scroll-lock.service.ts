import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import ScrollSmoother from 'gsap/ScrollSmoother';
@Injectable({ providedIn: 'root' })
export class ScrollLockService {
    private locked = false;
    private smoother!: any;
    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
    ) { }

    lock() {
        if (!isPlatformBrowser(this.platformId) || this.locked) return;
        this.locked = true;
        this.smoother = ScrollSmoother.get();
        this.smoother?.paused(true);
    }

    unlock() {
        if (!isPlatformBrowser(this.platformId) || !this.locked) return;
        this.locked = false;
        this.smoother = ScrollSmoother.get();
        this.smoother?.paused(false);
    }
}
