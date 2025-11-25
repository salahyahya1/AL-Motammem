import { isPlatformBrowser } from '@angular/common';
import {
  ApplicationRef,
  Component,
  Inject,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';
import { AnimatedSequenceComponent } from '../../../shared/animated-sequence/animated-sequence.component';
import { RouterLink } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

gsap.registerPlugin(ScrollTrigger, SplitText);

@Component({
  selector: 'app-section1',
  templateUrl: './section1.component.html',
  styleUrl: './section1.component.scss',
  standalone: true,
  imports: [AnimatedSequenceComponent, RouterLink],
})
export class Section1Component implements OnDestroy {
  @ViewChild(AnimatedSequenceComponent) seq!: AnimatedSequenceComponent;

  private destroy$ = new Subject<void>();

  timeline!: gsap.core.Timeline;
  heroTitleSplit: any;
  heroSubtitleSplit: any;
  heroDetailsSplit: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appRef: ApplicationRef,
    private ngZone: NgZone,
    private translate: TranslateService,
  ) {
    // كل ما اللغة تتغير → حدّث النصوص + أعد الأنيميشن
    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((e: LangChangeEvent) => {
        // console.log('Lang changed to:', e.lang);
        this.revertSplits();
        // نسيب Angular/DOM يلتقطوا نفسهم
        setTimeout(() => {
          this.runGsapAnimation();
        }, 0);
      });
  }

  ngAfterViewInit() {
    if (typeof window === 'undefined') return;
    if (!isPlatformBrowser(this.platformId)) return;

    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.runGsapAnimation();
      }, 500);
    });
  }

  private setHeroTexts() {
    const heroTitle = document.querySelector('#hero-title') as HTMLElement | null;
    const heroSubtitle = document.querySelector('#hero-subtitle') as HTMLElement | null;
    const heroDetails = document.querySelector('#hero-details') as HTMLElement | null;
    const button1 = document.querySelector('#button1') as HTMLElement | null;
    const button2 = document.querySelector('#button2') as HTMLElement | null;

    if (heroTitle) {
      heroTitle.textContent = this.translate.instant('HOME.HERO.TITLE');
    }
    if (heroSubtitle) {
      heroSubtitle.textContent = this.translate.instant('HOME.HERO.SUB-TITLE');
    }
    if (heroDetails) {
      heroDetails.textContent = this.translate.instant('HOME.HERO.DETAILS');
    }
    if (button1) {
      button1.textContent = this.translate.instant('HOME.HERO.BTN1');
    }
    if (button2) {
      button2.textContent = this.translate.instant('HOME.HERO.BTN2');
    }
  }

  private runGsapAnimation() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.seq?.playForwardAnimation?.();

    document.fonts.ready.then(() => {
      gsap.set('#hero', { willChange: 'transform, opacity' });

      // 1️⃣ رجّع الـ DOM لحالة بدون SplitText
      this.revertSplits();

      // 2️⃣ حدّث النصوص حسب اللغة الحالية
      this.setHeroTexts();

      const heroTitle = document.querySelector('h1#hero-title') as HTMLElement;
      const heroSubtitle = document.querySelector('#hero-subtitle') as HTMLElement;
      const heroDetails = document.querySelector('#hero-details') as HTMLElement;
      const button1 = document.querySelector('#button1') as HTMLElement;
      const button2 = document.querySelector('#button2') as HTMLElement;

      if (!heroTitle || !heroSubtitle || !heroDetails || !button1 || !button2) {
        console.warn('⚠️ عناصر الـ hero مش لاقيها SplitText');
        return;
      }

      // 3️⃣ SplitText على النص الحالي (بعد الترجمة)
      this.heroTitleSplit = new SplitText(heroTitle, { type: 'words' });
      this.heroSubtitleSplit = new SplitText(heroSubtitle, { type: 'words' });
      this.heroDetailsSplit = new SplitText(heroDetails, { type: 'words' });

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
    });
  }

  private revertSplits() {
    this.heroTitleSplit?.revert();
    this.heroSubtitleSplit?.revert();
    this.heroDetailsSplit?.revert();
    this.heroTitleSplit = null;
    this.heroSubtitleSplit = null;
    this.heroDetailsSplit = null;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.timeline?.kill?.();
    this.revertSplits();
  }
}
