// import { isPlatformBrowser } from '@angular/common';
// import { ApplicationRef, Component, Inject, NgZone, OnDestroy, PLATFORM_ID, ViewChild } from '@angular/core';
// import ScrollTrigger from 'gsap/ScrollTrigger';
// import gsap from "gsap";
// import SplitText from "gsap/SplitText";
// import { TranslatePipe } from '@ngx-translate/core';
// import { RemiveRoleAriaService } from '../../../shared/services/removeRoleAria';
// gsap.registerPlugin(SplitText, ScrollTrigger)

// @Component({
//   selector: 'app-solutions-section1',
//   imports: [TranslatePipe],
//   templateUrl: './solutions-section1.component.html',
//   styleUrl: './solutions-section1.component.scss'
// })
// export class SolutionsSection1Component {
//   constructor(
//     @Inject(PLATFORM_ID) private platformId: Object,
//     private ngZone: NgZone,
//     private RemiveRoleAriaService: RemiveRoleAriaService,
//   ) { }
//   timeline!: gsap.core.Timeline
//   Section1_title_split: any;
//   Section1_vedio!: HTMLElement;


//   ngAfterViewInit() {
//     if (typeof window === 'undefined') return;

//     if (!isPlatformBrowser(this.platformId)) return;
//     requestAnimationFrame(() => {
//       this.ngZone.runOutsideAngular(() => {
//         setTimeout(() => {
//           this.runGsapAnimation();
//         }, 0);
//       });
//     });

//   }
//   private runGsapAnimation() {
//     document.fonts.ready.then(() => {
//       const videoEl = document.querySelector('#solutions-Section1-vedio') as HTMLElement;
//       const titleEl = document.querySelector('#solutions-Section1-title') as HTMLElement;

//       if (!titleEl || !videoEl) {
//         console.warn('⚠️ عناصر الـ hero مش لاقيها SplitText');
//         return;
//       }


//       requestAnimationFrame(() => {
//         // Split بعد ما المتصفح رسم السطور فعليًا
//         const split = SplitText.create('#solutions-Section1-title', { type: "lines", autoSplit: true })
//         this.RemiveRoleAriaService.cleanA11y(titleEl, split);

//         gsap.set(titleEl, { opacity: 1, visibility: "visible" });
//         gsap.set(videoEl, { opacity: 1, visibility: "visible" });

//         const tl = gsap.timeline();

//         tl.from(split.lines, {
//           duration: 0.2,
//           yPercent: 100,
//           opacity: 0,
//           ease: "expo.out",
//           stagger: 0.08,
//         });

//         tl.from(videoEl, {
//           opacity: 0,
//           y: -100,
//           duration: 0.2,
//           ease: "sine.out",
//         }, "<");

//         this.timeline = tl;
//         this.Section1_title_split = split;
//       });

//     });
//   }

// }
import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  NgZone,
  PLATFORM_ID,
  ViewChild,
  ElementRef,
  OnDestroy
} from '@angular/core';
import ScrollTrigger from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import SplitText from 'gsap/SplitText';
import { TranslatePipe } from '@ngx-translate/core';
import { RemiveRoleAriaService } from '../../../shared/services/removeRoleAria';

gsap.registerPlugin(SplitText, ScrollTrigger);

@Component({
  selector: 'app-solutions-section1',
  imports: [TranslatePipe],
  templateUrl: './solutions-section1.component.html',
  styleUrl: './solutions-section1.component.scss'
})
export class SolutionsSection1Component implements OnDestroy {
  private readonly isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private ngZone: NgZone,
    private RemiveRoleAriaService: RemiveRoleAriaService,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  @ViewChild('solutionsVideo', { static: false })
  solutionsVideo?: ElementRef<HTMLVideoElement>;

  timeline!: gsap.core.Timeline;
  Section1_title_split: any;

  private onCanPlay = () => this.safePlayVideo();

  ngAfterViewInit() {
    if (!this.isBrowser) return;

    requestAnimationFrame(() => {
      this.ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          this.setupVideoAutoplayFix();
          this.runGsapAnimation();
        }, 0);
      });
    });
  }

  private setupVideoAutoplayFix() {
    const v = this.solutionsVideo?.nativeElement;
    if (!v) return;

    // لازم قبل play
    v.muted = true;
    v.playsInline = true;

    v.addEventListener('canplay', this.onCanPlay, { once: true });

    // يساعد بعد refresh/SSR hydration
    v.load();
    this.safePlayVideo();
  }

  private safePlayVideo() {
    const v = this.solutionsVideo?.nativeElement;
    if (!v) return;

    const p = v.play();
    if (p) {
      p.catch((err) => {
        // لو Autoplay اتمنع لأي سبب
        console.warn('Autoplay blocked/failed:', err);
      });
    }
  }

  private runGsapAnimation() {
    if (!this.isBrowser) return;

    document.fonts.ready.then(() => {
      const videoWrap = document.querySelector('#solutions-Section1-vedio') as HTMLElement;
      const titleEl = document.querySelector('#solutions-Section1-title') as HTMLElement;

      if (!titleEl || !videoWrap) return;

      requestAnimationFrame(() => {
        const split = SplitText.create('#solutions-Section1-title', { type: 'lines', autoSplit: true });
        this.RemiveRoleAriaService.cleanA11y(titleEl, split);

        gsap.set(titleEl, { opacity: 1, visibility: 'visible' });
        gsap.set(videoWrap, { opacity: 1, visibility: 'visible' });

        const tl = gsap.timeline();

        tl.from(split.lines, {
          duration: 0.2,
          yPercent: 100,
          opacity: 0,
          ease: 'expo.out',
          stagger: 0.08,
        });

        tl.from(videoWrap, {
          opacity: 0,
          y: -100,
          duration: 0.2,
          ease: 'sine.out',
        }, '<');

        this.timeline = tl;
        this.Section1_title_split = split;
      });
    });
  }

  ngOnDestroy(): void {
    // ✅ أهم سطر في SSR
    if (!this.isBrowser) return;

    this.timeline?.kill();
    this.Section1_title_split?.revert?.();

    const v = this.solutionsVideo?.nativeElement as any;
    if (v && typeof v.pause === 'function') {
      v.pause();
      v.removeEventListener?.('canplay', this.onCanPlay);
    }
  }
}
