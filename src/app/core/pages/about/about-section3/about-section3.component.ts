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
  lang: string = 'ar'
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
    this.isMobile = window.innerWidth < 768;
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    let snapEnabled = false;
    this.cdr.detectChanges();

    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        setTimeout(async () => {
          await document.fonts?.ready;
          this.makeanimation();
          ScrollTrigger.refresh();
        }, 0);
      });
    });

    this.resizeHandler = () => {
      const next = window.innerWidth < 768;
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
        setTimeout(async () => {
          await document.fonts?.ready;
          this.makeanimation();
          ScrollTrigger.refresh(true);
        }, 0);
      });
    });
  }

  // makeanimation() {
  //   const finalTextScrollDuration = 1.5;

  //   this.mm.add({
  //     desktop: '(min-width: 768px)',
  //     mobile: '(max-width: 767px)',
  //   }, (context) => {
  //     let { desktop, mobile } = context.conditions as any;

  //     if (mobile) {
  //       if (!document.querySelector('.scroll-bg-section-m')) return;

  //       const tl = gsap.timeline({
  //         id: 'AboutSection3TL-mobile',
  //         scrollTrigger: {
  //           id: 'AboutSection3Trigger-mobile',
  //           trigger: '#AboutSection3',
  //           start: 'top top',
  //           end: '+=4000 bottom',
  //           scrub: true,
  //           pin: true,
  //         }
  //       });
  //       this.AboutSection3Timeline = tl;

  //       tl.fromTo('.scroll-bg-section-m', { autoAlpha: 0 }, {
  //         autoAlpha: 1,
  //         onStart: () => { this.show = 1; this.DivisionId = 1; },
  //         onReverseComplete: () => { this.show = 0; }
  //       }, '>-0.2');

  //       // Lighter animation for mobile (reduced yPercent)
  //       tl.fromTo('.scroll-bg-section-text-m', { yPercent: 50 }, { yPercent: -130 }, '<')
  //         .fromTo('.scroll-bg-section-text-m', { yPercent: -130, opacity: 1 }, {
  //           yPercent: -250, opacity: 0, duration: finalTextScrollDuration
  //         }, '>+0.8');

  //       tl.fromTo('.scroll-bg-section1-m', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7 }, '>-0.67')
  //         .fromTo('.scroll-bg-section-text1-m', { yPercent: 50 }, { yPercent: -130 }, '<')
  //         .fromTo('.scroll-bg-section-text1-m', { yPercent: -130, opacity: 1 }, {
  //           yPercent: -250, opacity: 0, duration: finalTextScrollDuration
  //         }, '>+0.8');

  //       tl.fromTo('.scroll-bg-section2-m', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7 }, '>-0.67')
  //         .fromTo('.scroll-bg-section-text2-m', { yPercent: 50 }, { yPercent: -130 }, '<')
  //         .fromTo('.scroll-bg-section-text2-m', { yPercent: -130, opacity: 1 }, {
  //           yPercent: -250, opacity: 0, duration: finalTextScrollDuration
  //         }, '>+0.8');

  //       return () => { tl.kill(); ScrollTrigger.getById('AboutSection3Trigger-mobile')?.kill(); };
  //     } else {
  ////without snap
  //       // if (!document.querySelector('.scroll-bg-section')) return;

  //       // const tl = gsap.timeline({
  //       //   id: 'AboutSection3TL-desktop',
  //       //   scrollTrigger: {
  //       //     id: 'AboutSection3Trigger-desktop',
  //       //     trigger: '#AboutSection3',
  //       //     start: 'top top',
  //       //     end: '+=4000 bottom',
  //       //     scrub: true,
  //       //     pin: true,
  //       //     // snap: 0.1
  //       //   }
  //       // });
  //       // this.AboutSection3Timeline = tl;

  //       // tl.fromTo('.scroll-bg-section', { autoAlpha: 0 }, {
  //       //   autoAlpha: 1,
  //       //   onStart: () => { this.show = 1; this.DivisionId = 1; },
  //       //   onReverseComplete: () => { this.show = 0; }
  //       // }, '>-0.2');

  //       // tl.fromTo('.scroll-bg-section-text', { yPercent: 50 }, { yPercent: -190 }, '<')
  //       //   .fromTo('.scroll-bg-section-text', { yPercent: -190, opacity: 1 }, {
  //       //     yPercent: -350, opacity: 0, duration: finalTextScrollDuration
  //       //   }, '>+0.8');

  //       // tl.fromTo('.scroll-bg-section1', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7 }, '>-0.67')
  //       //   .fromTo('.scroll-bg-section-text1', { yPercent: 50 }, { yPercent: -190 }, '<')
  //       //   .fromTo('.scroll-bg-section-text1', { yPercent: -190, opacity: 1 }, {
  //       //     yPercent: -350, opacity: 0, duration: finalTextScrollDuration
  //       //   }, '>+0.8');

  //       // tl.fromTo('.scroll-bg-section2', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7 }, '>-0.67')
  //       //   .fromTo('.scroll-bg-section-text2', { yPercent: 50 }, { yPercent: -190 }, '<')
  //       //   .fromTo('.scroll-bg-section-text2', { yPercent: -190, opacity: 1 }, {
  //       //     yPercent: -350, opacity: 0, duration: finalTextScrollDuration
  //       //   }, '>+0.8');

  //       // return () => { tl.kill(); ScrollTrigger.getById('AboutSection3Trigger-desktop')?.kill(); };
  //       // ===================== DESKTOP =====================
  //       if (!document.querySelector('.scroll-bg-section')) return;

  //       gsap.set(
  //         ['.scroll-bg-section-text', '.scroll-bg-section-text1', '.scroll-bg-section-text2'],
  //         { autoAlpha: 0, yPercent: 50 }
  //       );
  //       gsap.set(
  //         ['.scroll-bg-section', '.scroll-bg-section1', '.scroll-bg-section2'],
  //         { autoAlpha: 0 }
  //       );

  //       let textAnchors: number[] = [];

  //       const tl = gsap.timeline({
  //         id: 'AboutSection3TL-desktop',
  //         scrollTrigger: {
  //           id: 'AboutSection3Trigger-desktop',
  //           trigger: '#AboutSection3',
  //           start: 'top top',
  //           end: '+=4000 bottom',
  //           scrub: 1,
  //           pin: true,

  //           snap: {
  //             snapTo: (value: number) => textAnchors.length ? gsap.utils.snap(textAnchors, value) : value,
  //             duration: { min: 0.18, max: 0.45 },
  //             delay: 0.06,
  //             ease: 'power3.out',
  //           },
  //         }
  //       });

  //       this.AboutSection3Timeline = tl;

  //       const addScene = (
  //         bgSel: string,
  //         textSel: string,
  //         stableLabel: string,
  //         enterY = -190,
  //         exitY = -350
  //       ) => {
  //         tl.to(bgSel, { autoAlpha: 1, duration: 0.35 }, '>')

  //         const enterTween = tl.fromTo(
  //           textSel,
  //           { yPercent: 50, autoAlpha: 0 },
  //           { yPercent: enterY, autoAlpha: 1, duration: 0.55, ease: 'power2.out' },
  //           '<'
  //         );

  //         tl.addLabel(stableLabel, enterTween.endTime());

  //         tl.to({}, { duration: 0.12 });

  //         tl.to(
  //           textSel,
  //           { yPercent: exitY, autoAlpha: 0, duration: 1.5, ease: 'none' },
  //           '>'
  //         );
  //       };

  //       tl.fromTo('.scroll-bg-section', { autoAlpha: 0 }, {
  //         autoAlpha: 1,
  //         onStart: () => { this.show = 1; this.DivisionId = 1; },
  //         onReverseComplete: () => { this.show = 0; }
  //       }, 0);

  //       addScene('.scroll-bg-section', '.scroll-bg-section-text', 't0_stable');

  //       addScene('.scroll-bg-section1', '.scroll-bg-section-text1', 't1_stable');
  //       addScene('.scroll-bg-section2', '.scroll-bg-section-text2', 't2_stable');

  //       const dur = tl.duration() || 1;
  //       textAnchors = Object.entries(tl.labels)
  //         .filter(([name]) => name.endsWith('_stable'))
  //         .map(([, time]) => time / dur)
  //         .sort((a, b) => a - b);

  //       return () => {
  //         tl.kill();
  //         ScrollTrigger.getById('AboutSection3Trigger-desktop')?.kill();
  //       };

  //     }
  //   });
  // }


  //nice sol
  makeanimation() {
    const finalTextScrollDuration = 0.2;

    this.mm.add({
      desktop: '(min-width: 768px)',
      mobile: '(max-width: 767px)',
    }, (context) => {
      let { desktop, mobile } = context.conditions as any;

      // ------------------ MOBILE (زي ما هو) ------------------
      if (mobile) {
        if (!document.querySelector('.scroll-bg-section-m')) return;

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

        tl.fromTo('.scroll-bg-section-text-m', { yPercent: 50 }, { yPercent: -130 }, '<')
          .fromTo('.scroll-bg-section-text-m', { yPercent: -130, opacity: 1 }, {
            yPercent: -250, opacity: 0, duration: finalTextScrollDuration
          }, '>+0.8');

        tl.fromTo('.scroll-bg-section1-m', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7 }, '>-0.67')
          .fromTo('.scroll-bg-section-text1-m', { yPercent: 50 }, { yPercent: -130 }, '<')
          .fromTo('.scroll-bg-section-text1-m', { yPercent: -130, opacity: 1 }, {
            yPercent: -250, opacity: 0, duration: finalTextScrollDuration
          }, '>+0.8');

        tl.fromTo('.scroll-bg-section2-m', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7 }, '>-0.67')
          .fromTo('.scroll-bg-section-text2-m', { yPercent: 50 }, { yPercent: -130 }, '<')
          .fromTo('.scroll-bg-section-text2-m', { yPercent: -130, opacity: 1 }, {
            yPercent: -250, opacity: 0, duration: finalTextScrollDuration
          }, '>+0.8');

        return () => { tl.kill(); ScrollTrigger.getById('AboutSection3Trigger-mobile')?.kill(); };
      }

      // ------------------ DESKTOP (Optimized Snapping) ------------------
      if (!document.querySelector('.scroll-bg-section')) return;

      // Reset initial states to avoid flashes
      gsap.set(['.scroll-bg-section-text', '.scroll-bg-section-text1', '.scroll-bg-section-text2'], { opacity: 0, yPercent: 50 });
      gsap.set(['.scroll-bg-section', '.scroll-bg-section1', '.scroll-bg-section2'], { autoAlpha: 0 });

      let textAnchors: number[] = [];
      const transitionDuration = 0.2;
      const holdDuration = 1.0; // Increased hold time relative to transitions

      const tl = gsap.timeline({
        id: 'AboutSection3TL-desktop',
        scrollTrigger: {
          id: 'AboutSection3Trigger-desktop',
          trigger: '#AboutSection3',
          start: 'top top',
          end: '+=4500 bottom', // Slightly longer to accommodate more "hold" space
          scrub: 0.5, // Faster response to scroll
          pin: true,
          snap: {
            snapTo: (value) => textAnchors.length ? gsap.utils.snap(textAnchors, value) : value,
            duration: { min: 0.2, max: 0.5 },
            delay: 0.05,
            ease: 'power2.out',
          }
        }
      });

      this.AboutSection3Timeline = tl;

      const getY = (sel: string) => {
        const el = document.querySelector(sel) as HTMLElement | null;
        if (!el) return { enter: -140, exit: -260 };
        const h = el.getBoundingClientRect().height || 100;
        return {
          enter: -(h * 2.1), // Target position to stay visible
          exit: -(h * 3.1),  // Exit position
        };
      };

      const addScene = (opts: { bg: string; text: string; index: number; }) => {
        const { bg, text, index } = opts;
        const { enter, exit } = getY(text);

        // 1. Scene Entrance (Background fades in + Text moves to focus)
        tl.to(bg, { autoAlpha: 1, duration: transitionDuration }, index === 0 ? 0 : '>');
        if (index === 0) {
          tl.add(() => {
            this.show = 1;
            this.DivisionId = index + 1;
          }, 0);
        } else {
          tl.add(() => { this.DivisionId = index + 1; }, '>');
        }

        const enterTween = tl.to(text, {
          y: enter,
          opacity: 1,
          duration: transitionDuration,
          ease: 'power2.out'
        }, '<');

        // 2. STABLE ZONE / HOLD (This is where we snap)
        // We put the label in the MIDDLE of the hold for best snapping accuracy
        const holdStartTime = tl.duration();
        tl.to({}, { duration: holdDuration });
        const midHoldTime = holdStartTime + (holdDuration / 2);
        tl.addLabel(`scene_${index}_stable`, midHoldTime);

        // 3. Scene Exit (Text moves up and out)
        tl.to(text, {
          y: exit,
          opacity: 0,
          duration: transitionDuration,
          ease: 'power2.in'
        }, '>');
      };

      addScene({ bg: '.scroll-bg-section', text: '.scroll-bg-section-text', index: 0 });
      addScene({ bg: '.scroll-bg-section1', text: '.scroll-bg-section-text1', index: 1 });
      addScene({ bg: '.scroll-bg-section2', text: '.scroll-bg-section-text2', index: 2 });

      // Calculate anchor points from labels
      const totalDuration = tl.duration() || 1;
      textAnchors = Object.entries(tl.labels)
        .filter(([name]) => name.includes('_stable'))
        .map(([, time]) => time / totalDuration)
        .sort((a, b) => a - b);

      return () => {
        tl.kill();
        ScrollTrigger.getById('AboutSection3Trigger-desktop')?.kill();
      };
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