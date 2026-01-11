import { isPlatformBrowser } from '@angular/common';
import { ApplicationRef, Component, inject, Inject, NgZone, OnDestroy, PLATFORM_ID, ViewChild } from '@angular/core';
import ScrollTrigger from 'gsap/ScrollTrigger';
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../shared/services/language.service';
gsap.registerPlugin(SplitText, ScrollTrigger)
@Component({
  selector: 'app-about-section1',
  imports: [TranslatePipe],
  templateUrl: './about-section1.component.html',
  styleUrl: './about-section1.component.scss'
})
export class AboutSection1Component {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private language: LanguageService,
  ) { }
  timeline!: gsap.core.Timeline
  Section1_title_split: any;
  Section1_vedio!: HTMLElement;
  ngAfterViewInit() {
    if (typeof window === 'undefined') return;
    if (!isPlatformBrowser(this.platformId)) return;
    requestAnimationFrame(() => {
      this.ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          this.runGsapAnimation();
        }, 500);
      });
    });
  }
  private runGsapAnimation() {
    document.fonts.ready.then(() => {
      const videoEl = document.querySelector('#About-Section1-vedio') as HTMLElement;
      const titleEl = document.querySelector('#About-Section1-title') as HTMLElement;
      if (!titleEl || !videoEl) {
        console.warn('⚠️ عناصر الـ hero مش لاقيها SplitText');
        return;
      }
      requestAnimationFrame(() => {
        gsap.set(titleEl, { opacity: 1, visibility: "visible" });
        gsap.set(videoEl, { opacity: 1, visibility: "visible" });
        const tl = gsap.timeline();
        tl.from(titleEl, {
          duration: 1,
          yPercent: 100,
          opacity: 0,
          ease: "expo.out",
          stagger: 0.08,
        });

        tl.from(videoEl, {
          opacity: 0,
          y: -100,
          duration: 0.2,
          ease: "sine.out",
        }, "<");

        this.timeline = tl;
        this.Section1_title_split = titleEl;
      });
    });
  }
}
