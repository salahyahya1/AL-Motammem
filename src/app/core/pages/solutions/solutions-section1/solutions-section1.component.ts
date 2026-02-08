import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, NgZone, OnDestroy, PLATFORM_ID } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';
import { TranslatePipe } from '@ngx-translate/core';
import { RemiveRoleAriaService } from '../../../shared/services/removeRoleAria';

gsap.registerPlugin(SplitText, ScrollTrigger);

@Component({
  selector: 'app-solutions-section1',
  imports: [TranslatePipe],
  templateUrl: './solutions-section1.component.html',
  styleUrl: './solutions-section1.component.scss',
})
export class SolutionsSection1Component implements OnDestroy {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private RemiveRoleAriaService: RemiveRoleAriaService
  ) { }

  timeline?: gsap.core.Timeline;
  Section1_title_split?: any;

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        this.runGsapAnimation();
      });
    });
  }

  private runGsapAnimation() {
    const videoWrap = document.querySelector('#solutions-Section1-vedio') as HTMLElement | null;
    const titleEl = document.querySelector('#solutions-Section1-title') as HTMLElement | null;

    // ✅ الفيديو يظهر فورًا (حتى لو الفونتات لسه بتتحمّل)
    if (videoWrap) gsap.set(videoWrap, { opacity: 1, visibility: 'visible' });

    // SplitText يستنى الفونتات
    document.fonts.ready.then(() => {
      if (!titleEl) {
        console.warn('⚠️ title element not found');
        return;
      }

      requestAnimationFrame(() => {
        const split = SplitText.create(titleEl, { type: 'lines', autoSplit: true });
        this.RemiveRoleAriaService.cleanA11y(titleEl, split);

        gsap.set(titleEl, { opacity: 1, visibility: 'visible' });

        const tl = gsap.timeline();

        tl.from(split.lines, {
          duration: 0.2,
          yPercent: 100,
          opacity: 0,
          ease: 'expo.out',
          stagger: 0.08,
        });

        // ✅ أنيميت الفيديو لو موجود، غير كده مش مشكلة
        if (videoWrap) {
          tl.from(
            videoWrap,
            {
              opacity: 0,
              y: -100,
              duration: 0.2,
              ease: 'sine.out',
            },
            '<'
          );
        }

        this.timeline = tl;
        this.Section1_title_split = split;
      });
    });
  }

  ngOnDestroy() {
    this.timeline?.kill();
    this.Section1_title_split?.revert?.();
    ScrollTrigger.getAll().forEach((t) => t.kill());
  }
}
