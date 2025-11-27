// import { Component, AfterViewInit, ViewChildren, ElementRef, QueryList, inject, ViewChild, PLATFORM_ID, Inject, ApplicationRef, NgZone, ChangeDetectorRef } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import gsap from 'gsap';
// import ScrollTrigger from 'gsap/ScrollTrigger';
// import { isPlatformBrowser } from '@angular/common';
// import { DomSanitizer } from '@angular/platform-browser';
// gsap.registerPlugin(ScrollTrigger);
// @Component({
//   selector: 'app-about-section3',
//   imports: [CommonModule],
//   templateUrl: './about-section3.component.html',
//   styleUrl: './about-section3.component.scss'
// })
// export class AboutSection3Component {
//   public AboutSection3Timeline!: GSAPTimeline;
//   private mm = gsap.matchMedia();
//   private completedBlocksCount = 0;
//   DivisionId = 0
//   isMobile = false;
//   private resizeHandler!: () => void;
//   show = 0;
//   // @ViewChildren(Section6bgChangerComponent) bgChangers!: QueryList<Section6bgChangerComponent>;
//   @ViewChild('DivisionsTrigger', { static: true }) DivisionsTrigger!: ElementRef
//   @ViewChild('AboutSection3') AboutSection3!: ElementRef


//   public sections = [
//     { bgUrl: './About us/2.jpg', text: 'Delivering complete telecom and IT solutions from design to support, empowering clients to stay ahead with optimized solutions.' },
//     { bgUrl: './About us/3.jpg', text: 'Your trusted partner in managing content and growing your digital presence.' },
//     { bgUrl: './About us/4.jpg', text: 'Empowering businesses with tailored outsourcing solutions across IT, finance, HR, and more.' },
//   ];

//   public mobileBg = [
//     './About us/Vertical about us copy1.jpg',
//     './About us/Vertical about us copy2.jpg',
//     './About us/Vertical about us copy3.jpg',
//   ];
//   constructor(
//     @Inject(PLATFORM_ID) private platformId: Object,
//     private appRef: ApplicationRef,
//     private ngZone: NgZone,
//     private cdr: ChangeDetectorRef
//     , private sanitizer: DomSanitizer

//   ) {
//     if (typeof window === 'undefined') return;
//     if (!isPlatformBrowser(this.platformId)) return;

//     this.resizeHandler = () => {
//       // نفذ التغيير داخل Angular zone
//       this.ngZone.run(() => {
//         const next = window.innerWidth < 700;
//         if (next !== this.isMobile) {
//           this.isMobile = next;
//           // بلّغ أن فيه تغيير بعد حدث خارج دورة الفحص
//           this.cdr.detectChanges();
//         }
//       });
//     };
//   }
//   ngAfterViewInit(): void {
//     if (typeof window === 'undefined') return;
//     if (!isPlatformBrowser(this.platformId)) return;



//     window.addEventListener('resize', this.resizeHandler);

//     this.ngZone.runOutsideAngular(() => {
//       requestAnimationFrame(() => {
//         setTimeout(() => {
//           this.makeanimation();
//         }, 500)
//       })
//     })

//   }
//   makeanimation() {
//     const finalTextScrollDuration = 1.5;
//     // main timeLine
//     this.mm.add('(max-width: 699px)', () => {
//       this.AboutSection3Timeline = gsap.timeline({
//         id: 'AboutSection3TL',
//         scrollTrigger: {
//           id: 'AboutSection3Trigger',
//           trigger: '#AboutSection3',
//           start: 'top top',
//           end: '+=4000 bottom',
//           scrub: true,
//           pin: true,
//           // markers: true,
//           // pinType: 'transform',
//         }
//       });
//       this.AboutSection3Timeline.fromTo('.scroll-bg-section-m', {
//         autoAlpha: 0
//       }, {
//         autoAlpha: 1,
//         onStart: () => {
//           this.show = 1
//           this.DivisionId = 1
//         },
//         onReverseComplete: () => {
//           this.show = 0
//         }
//       }, '>-0.2');
//       this.AboutSection3Timeline.fromTo('.scroll-bg-section-text-m', {
//         yPercent: 50
//       }, {
//         yPercent: -190,
//       }, '<');
//       this.AboutSection3Timeline.fromTo('.scroll-bg-section-text-m', {
//         yPercent: -190,
//         opacity: 1
//       }, {
//         yPercent: -350,
//         opacity: 0,
//         duration: finalTextScrollDuration
//       }, '>+0.8');



//       this.AboutSection3Timeline.fromTo('.scroll-bg-section1-m', {
//         autoAlpha: 0
//       }, {
//         autoAlpha: 1,
//         duration: 0.7
//       }, '>-0.67');
//       this.AboutSection3Timeline.fromTo('.scroll-bg-section-text1-m', {
//         yPercent: 50
//       }, {
//         yPercent: -190,
//       }, '<');

//       this.AboutSection3Timeline.fromTo('.scroll-bg-section-text1-m', {
//         yPercent: -190,
//         opacity: 1
//       }, {
//         yPercent: -350,
//         opacity: 0,
//         duration: finalTextScrollDuration
//       }, '>+0.8');
//       this.AboutSection3Timeline.fromTo('.scroll-bg-section2-m', {
//         autoAlpha: 0
//       }, {
//         autoAlpha: 1,
//         duration: 0.7
//       }, '>-0.67');
//       this.AboutSection3Timeline.fromTo('.scroll-bg-section-text2-m', {
//         yPercent: 50
//       }, {
//         yPercent: -190,
//       }, '<');
//       this.AboutSection3Timeline.fromTo('.scroll-bg-section-text2-m', {
//         yPercent: -190,
//         opacity: 1
//       }, {
//         yPercent: -350,
//         opacity: 0,
//         duration: finalTextScrollDuration
//       }, '>+0.8');
//     })
//     this.mm.add('(min-width: 700px)', () => {
//       this.AboutSection3Timeline = gsap.timeline({
//         id: 'AboutSection3TL',
//         scrollTrigger: {
//           id: 'AboutSection3Trigger',
//           trigger: '#AboutSection3',
//           start: 'top top',
//           end: '+=4000 bottom',
//           scrub: true,
//           pin: true,
//           // markers: true,
//           // pinType: 'transform',
//         }
//       });
//       this.AboutSection3Timeline.fromTo('.scroll-bg-section', {
//         autoAlpha: 0
//       }, {
//         autoAlpha: 1,
//         onStart: () => {
//           this.show = 1
//           this.DivisionId = 1
//         },
//         onReverseComplete: () => {
//           this.show = 0
//         }
//       }, '>-0.2');
//       this.AboutSection3Timeline.fromTo('.scroll-bg-section-text', {
//         yPercent: 50
//       }, {
//         yPercent: -190,
//       }, '<');
//       this.AboutSection3Timeline.fromTo('.scroll-bg-section-text', {
//         yPercent: -190,
//         opacity: 1
//       }, {
//         yPercent: -350,
//         opacity: 0,
//         duration: finalTextScrollDuration
//       }, '>+0.8');



//       this.AboutSection3Timeline.fromTo('.scroll-bg-section1', {
//         autoAlpha: 0
//       }, {
//         autoAlpha: 1,
//         duration: 0.7
//       }, '>-0.67');
//       this.AboutSection3Timeline.fromTo('.scroll-bg-section-text1', {
//         yPercent: 50
//       }, {
//         yPercent: -190,
//       }, '<');

//       this.AboutSection3Timeline.fromTo('.scroll-bg-section-text1', {
//         yPercent: -190,
//         opacity: 1
//       }, {
//         yPercent: -350,
//         opacity: 0,
//         duration: finalTextScrollDuration
//       }, '>+0.8');
//       this.AboutSection3Timeline.fromTo('.scroll-bg-section2', {
//         autoAlpha: 0
//       }, {
//         autoAlpha: 1,
//         duration: 0.7
//       }, '>-0.67');
//       this.AboutSection3Timeline.fromTo('.scroll-bg-section-text2', {
//         yPercent: 50
//       }, {
//         yPercent: -190,
//       }, '<');
//       this.AboutSection3Timeline.fromTo('.scroll-bg-section-text2', {
//         yPercent: -190,
//         opacity: 1
//       }, {
//         yPercent: -350,
//         opacity: 0,
//         duration: finalTextScrollDuration
//       }, '>+0.8');
//     })
//   }
//   ngOnDestroy() {
//     // ✅ شيل الـ listener لما الكومبوننت يتدمّر
//     if (this.resizeHandler) {
//       window.removeEventListener('resize', this.resizeHandler);
//     }
//   }


// }
import {
  Component, AfterViewInit, ViewChild, ElementRef, Inject,
  ApplicationRef, NgZone, ChangeDetectorRef, PLATFORM_ID, OnInit, OnDestroy
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { DomSanitizer } from '@angular/platform-browser';
import {  TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../shared/services/language.service';
gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-about-section3',
  imports: [CommonModule,TranslatePipe],
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
    private language:LanguageService,
  ) { }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    // ✅ مهم جداً: حدد وضع الموبايل قبل ما الـ template يترندر
    this.isMobile = window.innerWidth < 700;
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // لو الـ template اتبدّل (موبايل/ديسكتوب) فعليًا، أعلم أنجلر
    this.cdr.detectChanges();

    // شغّل الأنيميشن بعد ما الـ DOM يستقر
    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        setTimeout(() => this.makeanimation(), 0);
      });
    });

    // تحديث وضع الموبايل عند تغيير الحجم (مع إعادة بناء الأنيميشن)
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
    // الغِ كل ما أنشأته matchMedia قبل كده
    try { this.mm.revert(); } catch { }
    // غيّر الـ template للمود الجديد ثم ابنِ الأنيميشن من جديد
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

    // ============== موبايل ==============
    this.mm.add('(max-width: 699px)', () => {
      // ⚠️ Guard: لو عناصر الموبايل مش موجودة (لأن قالب الديسكتوب ظاهر)، متعملش تايملاين
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
          // pinType: 'transform', // ممكن تفعلها لو فيه رعشة على موبايل
          // markers: true,
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

    // ============== ديسكتوب ==============
    this.mm.add('(min-width: 700px)', () => {
      // ⚠️ Guard: لو عناصر الديسكتوب مش موجودة (لأن قالب الموبايل ظاهر)، متعملش تايملاين
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
          // markers: true,
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

  ngOnDestroy() {
    if (this.resizeHandler) window.removeEventListener('resize', this.resizeHandler);
    try { this.mm.revert(); } catch { }
  }
}
