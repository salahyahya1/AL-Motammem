import { isPlatformBrowser } from '@angular/common';
import { ApplicationRef, Component, Inject, NgZone, OnDestroy, PLATFORM_ID, ViewChild } from '@angular/core';
import ScrollTrigger from 'gsap/ScrollTrigger';
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import { TranslatePipe } from '@ngx-translate/core';
import { RemiveRoleAriaService } from '../../../shared/services/removeRoleAria';
gsap.registerPlugin(SplitText, ScrollTrigger)

@Component({
  selector: 'app-solutions-section1',
  imports: [TranslatePipe],
  templateUrl: './solutions-section1.component.html',
  styleUrl: './solutions-section1.component.scss'
})
export class SolutionsSection1Component {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private RemiveRoleAriaService: RemiveRoleAriaService,
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
        }, 0);
      });
    });

  }
  private runGsapAnimation() {
    document.fonts.ready.then(() => {
      const videoEl = document.querySelector('#solutions-Section1-vedio') as HTMLElement;
      const titleEl = document.querySelector('#solutions-Section1-title') as HTMLElement;

      if (!titleEl || !videoEl) {
        console.warn('⚠️ عناصر الـ hero مش لاقيها SplitText');
        return;
      }


      requestAnimationFrame(() => {
        // Split بعد ما المتصفح رسم السطور فعليًا
        const split = SplitText.create('#solutions-Section1-title', { type: "lines", autoSplit: true })
        this.RemiveRoleAriaService.cleanA11y(titleEl, split);

        gsap.set(titleEl, { opacity: 1, visibility: "visible" });
        gsap.set(videoEl, { opacity: 1, visibility: "visible" });

        const tl = gsap.timeline();

        tl.from(split.lines, {
          duration: 0.2,
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
        this.Section1_title_split = split;
      });

    });
  }

}
