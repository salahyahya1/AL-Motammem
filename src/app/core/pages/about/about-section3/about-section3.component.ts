import {
  Component, AfterViewInit, ViewChild, ElementRef, Inject,
  ApplicationRef, NgZone, ChangeDetectorRef, PLATFORM_ID, OnInit, OnDestroy
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../shared/services/language.service';
gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-about-section3',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './about-section3.component.html',
  styleUrl: './about-section3.component.scss',
  standalone: true
})
export class AboutSection3Component implements OnInit, AfterViewInit, OnDestroy {
  public AboutSection3Timeline!: GSAPTimeline;
  private mm = gsap.matchMedia();

  DivisionId = 0;
  isMobile = false;
  show = 0;

  private resizeHandler!: () => void;

  @ViewChild('DivisionsTrigger', { static: false }) DivisionsTrigger!: ElementRef;
  @ViewChild('AboutSection3', { static: false }) AboutSection3!: ElementRef;

  public sections = [
    { bgUrl: './About us/2.jpg', text: 'Delivering complete telecom and IT solutions from design to support, empowering clients to stay ahead with optimized solutions.' },
    { bgUrl: './About us/3.jpg', text: 'Your trusted partner in managing content and growing your digital presence.' },
    { bgUrl: './About us/4.jpg', text: 'Empowering businesses with tailored outsourcing solutions across IT, finance, HR, and more.' },
  ];

  public mobileBg = [
    './About us/Vertical about us copy1.jpg',
    './About us/Vertical about us copy2.jpg',
    './About us/Vertical about us copy3.jpg',
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appRef: ApplicationRef,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private language: LanguageService,
  ) { }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.isMobile = window.innerWidth < 700;
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.cdr.detectChanges();

    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        setTimeout(() => this.makeanimation(), 0);
      });
    });

    this.resizeHandler = () => {
      const next = window.innerWidth < 700;
      if (next !== this.isMobile) {
        this.isMobile = next;
        this.rebuildAnimations();
      }
    };
    window.addEventListener('resize', this.resizeHandler);
  }

  private rebuildAnimations() {
    try { this.mm.revert(); } catch { }
    this.cdr.detectChanges();
    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          this.makeanimation();
          ScrollTrigger.refresh();
        }, 0);
      });
    });
  }

  makeanimation() {
    const finalTextScrollDuration = 1.5;

    this.mm.add('(max-width: 699px)', () => {
      if (!document.querySelector('.scroll-bg-section-m')) return () => { };

      const tl = gsap.timeline({
        id: 'AboutSection3TL-mobile',
        scrollTrigger: {
          id: 'AboutSection3Trigger-mobile',
          trigger: '#AboutSection3',
          start: 'top top',
          end: '+=4000 bottom',
          scrub: true,
          pin: true,
        }
      });
      this.AboutSection3Timeline = tl;

      tl.fromTo('.scroll-bg-section-m', { autoAlpha: 0 }, {
        autoAlpha: 1,
        onStart: () => { this.show = 1; this.DivisionId = 1; },
        onReverseComplete: () => { this.show = 0; }
      }, '>-0.2');

      tl.fromTo('.scroll-bg-section-text-m', { yPercent: 50 }, { yPercent: -190 }, '<')
        .fromTo('.scroll-bg-section-text-m', { yPercent: -190, opacity: 1 }, {
          yPercent: -350, opacity: 0, duration: finalTextScrollDuration
        }, '>+0.8');

      tl.fromTo('.scroll-bg-section1-m', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7 }, '>-0.67')
        .fromTo('.scroll-bg-section-text1-m', { yPercent: 50 }, { yPercent: -190 }, '<')
        .fromTo('.scroll-bg-section-text1-m', { yPercent: -190, opacity: 1 }, {
          yPercent: -350, opacity: 0, duration: finalTextScrollDuration
        }, '>+0.8');

      tl.fromTo('.scroll-bg-section2-m', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7 }, '>-0.67')
        .fromTo('.scroll-bg-section-text2-m', { yPercent: 50 }, { yPercent: -190 }, '<')
        .fromTo('.scroll-bg-section-text2-m', { yPercent: -190, opacity: 1 }, {
          yPercent: -350, opacity: 0, duration: finalTextScrollDuration
        }, '>+0.8');

      return () => { tl.kill(); ScrollTrigger.getById('AboutSection3Trigger-mobile')?.kill(); };
    });

    this.mm.add('(min-width: 700px)', () => {
      if (!document.querySelector('.scroll-bg-section')) return () => { };

      const tl = gsap.timeline({
        id: 'AboutSection3TL-desktop',
        scrollTrigger: {
          id: 'AboutSection3Trigger-desktop',
          trigger: '#AboutSection3',
          start: 'top top',
          end: '+=4000 bottom',
          scrub: true,
          pin: true,
        }
      });
      this.AboutSection3Timeline = tl;

      tl.fromTo('.scroll-bg-section', { autoAlpha: 0 }, {
        autoAlpha: 1,
        onStart: () => { this.show = 1; this.DivisionId = 1; },
        onReverseComplete: () => { this.show = 0; }
      }, '>-0.2');

      tl.fromTo('.scroll-bg-section-text', { yPercent: 50 }, { yPercent: -190 }, '<')
        .fromTo('.scroll-bg-section-text', { yPercent: -190, opacity: 1 }, {
          yPercent: -350, opacity: 0, duration: finalTextScrollDuration
        }, '>+0.8');

      tl.fromTo('.scroll-bg-section1', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7 }, '>-0.67')
        .fromTo('.scroll-bg-section-text1', { yPercent: 50 }, { yPercent: -190 }, '<')
        .fromTo('.scroll-bg-section-text1', { yPercent: -190, opacity: 1 }, {
          yPercent: -350, opacity: 0, duration: finalTextScrollDuration
        }, '>+0.8');

      tl.fromTo('.scroll-bg-section2', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7 }, '>-0.67')
        .fromTo('.scroll-bg-section-text2', { yPercent: 50 }, { yPercent: -190 }, '<')
        .fromTo('.scroll-bg-section-text2', { yPercent: -190, opacity: 1 }, {
          yPercent: -350, opacity: 0, duration: finalTextScrollDuration
        }, '>+0.8');

      return () => { tl.kill(); ScrollTrigger.getById('AboutSection3Trigger-desktop')?.kill(); };
    });
  }
  get isRtl() {
    return this.language.currentLang === 'ar';
  }
  ngOnDestroy() {
    if (this.resizeHandler) window.removeEventListener('resize', this.resizeHandler);
    try { this.mm.revert(); } catch { }
  }
}
