import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';

import { AnimatedSequenceComponent } from '../../../shared/animated-sequence/animated-sequence.component';
import { RouterLink } from '@angular/router';
import { LangChangeEvent, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { AnimationLoaderService } from '../../../shared/services/animation-loader.service';
import { RemiveRoleAriaService } from '../../../shared/services/removeRoleAria';
import { OpenFormDialogDirective } from '../../../shared/Directives/open-form-dialog.directive';



@Component({
  selector: 'app-section1',
  templateUrl: './section1.component.html',
  styleUrl: './section1.component.scss',
  standalone: true,
  imports: [AnimatedSequenceComponent, RouterLink, TranslatePipe, OpenFormDialogDirective],
})
export class Section1Component implements OnDestroy {
  @ViewChild(AnimatedSequenceComponent) seq!: AnimatedSequenceComponent;
  @ViewChild('heroVideo') heroVideo?: ElementRef<HTMLVideoElement>;

  spriteReady = false;
  private destroy$ = new Subject<void>();
  isSequenceReady: boolean = false;
  timeline!: gsap.core.Timeline;
  private mm?: any;
  heroTitleSplit: any;
  heroSubtitleSplit: any;
  heroDetailsSplit: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private translate: TranslateService,
    private animationLoader: AnimationLoaderService,
    private RemiveRoleAriaService: RemiveRoleAriaService,
  ) {
    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((e: LangChangeEvent) => {
        this.revertSplits();
        setTimeout(() => {
          this.runGsapAnimation();
        }, 0);
      });
  }

  ngAfterViewInit() {
    if (typeof window === 'undefined') return;
    if (!isPlatformBrowser(this.platformId)) return;

    this.ngZone.runOutsideAngular(() => {
          this.runAfterPaint(() => this.waitForLCPThenInit());
    this.runAfterPaint(() => this.runGsapAnimation(), 150);
      });
  }


  private runGsapAnimation() {
    if (!isPlatformBrowser(this.platformId)) return;

    (document as any).fonts.ready.then(async () => {
      const loaded = await this.animationLoader.loadGsapWithSplitText();
      if (!loaded) return;

      const { gsap, SplitText } = loaded;
      gsap.set('#hero', { willChange: 'transform, opacity' });
      this.revertSplits();

      const heroTitle = document.querySelector('h1#hero-title') as HTMLElement;
      const heroSubtitle = document.querySelector('#hero-subtitle') as HTMLElement;
      const heroDetails = document.querySelector('#hero-details') as HTMLElement;
      const button1 = document.querySelector('#button1') as HTMLElement;
      const button2 = document.querySelector('#button2') as HTMLElement;

      if (!heroTitle || !heroSubtitle || !heroDetails || !button1 || !button2) {
        console.warn('⚠️ عناصر الـ hero مش لاقيها SplitText');
        return;
      }
      gsap.set([heroTitle, heroSubtitle, heroDetails, button1, button2], {
        opacity: 0,
        visibility: 'visible',
      });

      this.heroTitleSplit = new SplitText(heroTitle, { type: 'words' });
      this.heroSubtitleSplit = new SplitText(heroSubtitle, { type: 'words' });
      this.heroDetailsSplit = new SplitText(heroDetails, { type: 'words' });
      this.RemiveRoleAriaService.cleanA11y(heroSubtitle, this.heroSubtitleSplit);
      this.RemiveRoleAriaService.cleanA11y(heroDetails, this.heroDetailsSplit);
      const tl = gsap.timeline();

      tl.fromTo(
        this.heroTitleSplit.words,
        { opacity: 0, visibility: 'visible' },
        {
          opacity: 1,
          duration: 0.4,
          ease: 'sine.out',
          stagger: 0.02,
          onStart: () => { gsap.set(heroTitle, { opacity: 1, visibility: 'visible' }) },
        }
      );

      tl.fromTo(
        this.heroSubtitleSplit.words,
        { opacity: 0, visibility: 'visible' },
        {
          opacity: 1,
          duration: 0.4,
          ease: 'sine.out',
          stagger: 0.02,
          onStart: () => { gsap.set(heroSubtitle, { opacity: 1, visibility: 'visible' }) },
        }
      );

      tl.fromTo(
        this.heroDetailsSplit.words,
        { opacity: 0, visibility: 'visible' },
        {
          opacity: 1,
          duration: 0.4,
          ease: 'sine.out',
          stagger: 0.02,
          onStart: () => { gsap.set(heroDetails, { opacity: 1, visibility: 'visible' }) },
        }
      );

      tl.fromTo(
        button1,
        { opacity: 0, visibility: 'visible' },
        {
          opacity: 1,
          duration: 0.5,
          ease: 'sine.inOut',
          onStart: () => { gsap.set(button1, { opacity: 1, visibility: 'visible' }) },
        }
      );

      tl.fromTo(
        button2,
        { opacity: 0, visibility: 'visible' },
        {
          opacity: 1,
          duration: 0.5,
          ease: 'sine.inOut',
          onStart: () => { gsap.set(button2, { opacity: 1, visibility: 'visible' }) },
        }
      );

      this.timeline = tl;

      try {
        const ScrollTriggerModule = await import('gsap/ScrollTrigger');
        const ScrollTrigger = ScrollTriggerModule?.default ?? ScrollTriggerModule;
        gsap.registerPlugin(ScrollTrigger);

        this.mm?.revert?.();
        this.mm = gsap.matchMedia();

        let pinInstance: any;
        this.mm.add("(min-width: 700px)", () => {
          pinInstance = ScrollTrigger.create({
            trigger: '#hero',
            start: 'top top',
            end: '150% bottom',
            pin: true,
            pinType: 'transform',
            id: 'hero-pin',
            anticipatePin: 1,
          });
          return () => { pinInstance?.kill?.(); pinInstance = null; };
        });

        this.mm.add("(max-width: 699px)", () => {
          pinInstance = ScrollTrigger.create({
            trigger: '#hero',
            start: 'top top',
            end: '+=1',
            pin: false,
            id: 'hero-pin-small',
          });
          return () => { pinInstance?.kill?.(); pinInstance = null; };
        });
      } catch (e) {
        console.warn('ScrollTrigger failed to load', e);
      }

    });

    if (this.heroVideo && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          const v = this.heroVideo!.nativeElement;
          v.src = '/videos/gradient.webm';
          v.play().catch(() => { });
          io.disconnect();
        }
      }, { threshold: 0.2 });

      io.observe(this.heroVideo.nativeElement);
    }
  }

  private revertSplits() {
    this.heroTitleSplit?.revert();
    this.heroSubtitleSplit?.revert();
    this.heroDetailsSplit?.revert();
    this.heroTitleSplit = null;
    this.heroSubtitleSplit = null;
    this.heroDetailsSplit = null;
  }


  private waitForLCPThenInit() {
    if (typeof window === 'undefined') return;
    const win: any = window;
    if ('PerformanceObserver' in window) {
      const po = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lcpEntry = entries[entries.length - 1];
        if (lcpEntry) {
          this.initAnimatedSequenceAfterIdle();
          po.disconnect();
        }
      });
      try {
        po.observe({ type: 'largest-contentful-paint', buffered: true });
        setTimeout(() => {
          try { po.disconnect(); } catch (e) { }
        }, 5000);
      } catch (e) {
        // fallback
        this.initAnimatedSequenceAfterIdle();
      }
    } else {
      // no PerformanceObserver -> fallback
      // setTimeout(() => this.initAnimatedSequenceAfterIdle(), 2000);
    }
  }

  // private initAnimatedSequenceAfterIdle() {
  //   this.ngZone.runOutsideAngular(() => {
  //     const run = () => {
  //       setTimeout(() => {
  //         try {
  //           this.ngZone.run(() => {
  //             this.spriteReady = true;
  //           });

  //           this.seq?.playForwardAnimation?.();
  //         } catch (e) { }
  //       }, 80);
  //     };

  //     if ('requestIdleCallback' in window) {
  //       (window as any).requestIdleCallback(run, { timeout: 2000 });
  //     } else {
  //       setTimeout(run, 700);
  //     }
  //   });
  // }
  private initAnimatedSequenceAfterIdle() {
  this.ngZone.runOutsideAngular(() => {
    const run = () => {
      setTimeout(() => {
        try {
          this.ngZone.run(() => {
            this.spriteReady = true;
          });

          this.seq?.playForwardAnimation?.();
        } catch (e) {}
      }, 80);
    };

    // بدل idleCallback
    this.runAfterPaint(run, 0);
  });
}

  private runAfterPaint(cb: () => void, delayMs = 0) {
  if (typeof window === 'undefined') return;

  // after next paint
  requestAnimationFrame(() => {
    // after paint queue
    setTimeout(cb, delayMs);
  });
}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.mm?.revert?.();
    this.timeline?.kill?.();
    this.revertSplits();
  }
}
