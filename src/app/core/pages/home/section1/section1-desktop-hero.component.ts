import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

import { AnimatedSequenceComponent } from '../../../shared/animated-sequence/animated-sequence.component';
import { AnimationLoaderService } from '../../../shared/services/animation-loader.service';
import { RemiveRoleAriaService } from '../../../shared/services/removeRoleAria';

@Component({
  selector: 'app-section1-desktop-hero',
  standalone: true,
  imports: [AnimatedSequenceComponent],
  templateUrl: './section1-desktop-hero.component.html',
  styleUrl: './section1-desktop-hero.component.scss',
})
export class Section1DesktopHeroComponent implements AfterViewInit, OnDestroy {
  @ViewChild(AnimatedSequenceComponent) seq!: AnimatedSequenceComponent;
  @ViewChild('heroVideo') heroVideo?: ElementRef<HTMLVideoElement>;

  spriteReady = false;
  showDesktopSprite = false;

  private readonly destroy$ = new Subject<void>();

  private spritePreloaded = false;
  private spritePreloadImg: HTMLImageElement | null = null;

  private mm?: any;
  private timeline?: gsap.core.Timeline;

  private heroTitleSplit: any;
  private heroSubtitleSplit: any;
  private heroDetailsSplit: any;

  readonly SPRITE_URL = '/images/homepage/SS_final_4cols_q92.webp';

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    private readonly ngZone: NgZone,
    private readonly translate: TranslateService,
    private readonly animationLoader: AnimationLoaderService,
    private readonly RemiveRoleAriaService: RemiveRoleAriaService
  ) {
    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((_e: LangChangeEvent) => {
        // إعادة تشغيل GSAP بعد تغيير اللغة (ديسكتوب فقط)
        this.revertSplits();
        setTimeout(() => this.kickDesktopAfterLCP(), 0);
      });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.ngZone.runOutsideAngular(() => {
      this.kickDesktopAfterLCP();
    });
  }

  // =========================================================
  // ✅ Desktop orchestrator
  // =========================================================
  private desktopStarted = false;

  private kickDesktopAfterLCP() {
    if (!isPlatformBrowser(this.platformId)) return;

    if (this.desktopStarted) {
      this.waitForLCP(() => this.runAfterPaint(() => this.runGsapAnimation(), 0));
      return;
    }

    this.desktopStarted = true;

    this.waitForLCP(() => {
      queueMicrotask(() => this.ngZone.run(() => (this.showDesktopSprite = true)));

      this.runAfterPaint(() => this.runGsapAnimation(), 0);
      this.runAfterPaint(() => this.preloadAndShowSpriteDesktop(), 0);
      this.runAfterPaint(() => this.initHeroVideoLazy(), 0);
    });
  }

  private waitForLCP(cb: () => void) {
    let done = false;
    const run = () => {
      if (done) return;
      done = true;
      cb();
    };

    const fallback = setTimeout(run, 1600);

    if (!('PerformanceObserver' in window)) {
      clearTimeout(fallback);
      run();
      return;
    }

    try {
      const po = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries && entries.length) {
          clearTimeout(fallback);
          run();
          po.disconnect();
        }
      });

      po.observe({ type: 'largest-contentful-paint', buffered: true });

      setTimeout(() => {
        try { po.disconnect(); } catch { }
        run();
      }, 3500);
    } catch {
      clearTimeout(fallback);
      run();
    }
  }

  private preloadAndShowSpriteDesktop() {
    if (this.spritePreloaded) return;
    this.spritePreloaded = true;

    const img = new Image();
    this.spritePreloadImg = img;

    try { (img as any).fetchPriority = 'high'; } catch { }

    img.src = this.SPRITE_URL;

    const done = () => {
      this.ngZone.run(() => (this.spriteReady = true));
      setTimeout(() => {
        try { this.seq?.playForwardAnimation?.(); } catch { }
      }, 50);
    };

    if (typeof (img as any).decode === 'function') {
      (img as any).decode().then(done).catch(done);
    } else {
      img.onload = done;
      img.onerror = () => { };
    }
  }

  private runGsapAnimation() {
    if (!isPlatformBrowser(this.platformId)) return;

    (document as any).fonts?.ready?.then(async () => {
      const loaded = await this.animationLoader.loadGsapWithSplitText();
      if (!loaded) return;

      const { gsap, SplitText } = loaded;

      this.revertSplits();
      this.timeline?.kill?.();
      this.mm?.revert?.();

      // عناصر النص موجودة في Section1Component (الأب)
      const heroTitle = document.querySelector('h1#hero-title') as HTMLElement;
      const heroSubtitle = document.querySelector('#hero-subtitle') as HTMLElement;
      const heroDetails = document.querySelector('#hero-details') as HTMLElement;
      const button1 = document.querySelector('#button1') as HTMLElement;
      const button2 = document.querySelector('#button2') as HTMLElement;
      if (!heroTitle || !heroSubtitle || !heroDetails || !button1 || !button2) return;

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

      tl.fromTo(this.heroTitleSplit.words, { opacity: 0 }, {
        opacity: 1,
        duration: 0.4,
        ease: 'sine.out',
        stagger: 0.02,
        onStart: () => gsap.set(heroTitle, { opacity: 1 }),
      });

      tl.fromTo(this.heroSubtitleSplit.words, { opacity: 0 }, {
        opacity: 1,
        duration: 0.35,
        ease: 'sine.out',
        stagger: 0.015,
        onStart: () => gsap.set(heroSubtitle, { opacity: 1 }),
      });

      tl.fromTo(this.heroDetailsSplit.words, { opacity: 0 }, {
        opacity: 1,
        duration: 0.35,
        ease: 'sine.out',
        stagger: 0.015,
        onStart: () => gsap.set(heroDetails, { opacity: 1 }),
      });

      // ✅ أزرار
      tl.fromTo(button1, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'sine.inOut' });
      tl.fromTo(button2, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'sine.inOut' });

      this.timeline = tl;

      try {
        const ScrollTriggerModule = await import('gsap/ScrollTrigger');
        const ScrollTrigger = (ScrollTriggerModule as any)?.default ?? ScrollTriggerModule;
        gsap.registerPlugin(ScrollTrigger);

        this.mm = gsap.matchMedia();
        this.mm.add('(min-width: 767px)', () => {
          const pin = ScrollTrigger.create({
            trigger: '#hero',
            start: 'top top',
            end: '150% bottom',
            pin: true,
            pinType: 'transform',
            id: 'hero-pin',
            anticipatePin: 1,
          });
          return () => pin?.kill?.();
        });
      } catch (e) {
        console.warn('ScrollTrigger failed to load', e);
      }
    });
  }

  private initHeroVideoLazy() {
    if (!this.heroVideo || !('IntersectionObserver' in window)) return;

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

  private revertSplits() {
    this.heroTitleSplit?.revert();
    this.heroSubtitleSplit?.revert();
    this.heroDetailsSplit?.revert();
    this.heroTitleSplit = null;
    this.heroSubtitleSplit = null;
    this.heroDetailsSplit = null;
  }

  private runAfterPaint(cb: () => void, delayMs = 0) {
    requestAnimationFrame(() => setTimeout(cb, delayMs));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    this.mm?.revert?.();
    this.timeline?.kill?.();
    this.revertSplits();

    if (this.spritePreloadImg) {
      this.spritePreloadImg.onload = null;
      this.spritePreloadImg.onerror = null;
      this.spritePreloadImg.src = '';
      this.spritePreloadImg = null;
    }
  }
}
