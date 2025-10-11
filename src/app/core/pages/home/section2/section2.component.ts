import { isPlatformBrowser } from '@angular/common';
import { ApplicationRef, Component, Inject, NgZone, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(ScrollTrigger, SplitText);
@Component({
  selector: 'app-section2',
  imports: [],
  templateUrl: './section2.component.html',
  styleUrls: ['./section2.component.scss'],
})
export class Section2Component {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appRef: ApplicationRef,
    private ngZone: NgZone

  ) { }
  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const text = document.querySelector('#erp-text') as HTMLElement;
    if (!text) return;

    // تقسيم النص إلى كلمات ثم إلى حروف
    const split = new SplitText(text, { type: 'words,chars' });
    const chars = split.chars; // كل الحروف

    // بداية: كل الحروف مخفية لأسفل
    gsap.set(chars, {
      opacity: 0,
      y: 60,
      // filter: 'blur(6px)',
    });

    // التايملاين — يظهر الحروف تدريجيًا
    const tl = gsap.timeline({
      defaults: {
        duration: 0.5,
        ease: 'power3.out'
      }
    });

    tl.to(text, { opacity: 1, duration: 0.1 })
      .to(chars, {
        opacity: 1,
        y: 0,
        // filter: 'blur(0px)',
        stagger: {
          each: 0.03, // سرعة ظهور الحروف
          from: 'start',
        }
      })
    // .to(chars, {
    //   color: 'var(--primary)',
    //   duration: 0.3,
    //   stagger: {
    //     each: 0.03,
    //     from: 'start'
    //   }
    // }, "<"); // يبدأ مع الأنيميشن السابق

    // لما تخلص الأنيميشن، يثبت النص كله
    // tl.to(text, { opacity: 1, duration: 0.3 });
  }
  // ngAfterViewInit() {
  //   if (typeof window === 'undefined') return;

  //   if (!isPlatformBrowser(this.platformId)) return;
  //   requestAnimationFrame(() => {
  //     this.ngZone.onStable.subscribe(() => {
  //       requestAnimationFrame(() => {
  //         setTimeout(() => {
  //           this.runGsapAnimation();
  //         }, 0);
  //       });
  //     });
  //   });

  // }
  // private runGsapAnimation() {
  //   document.fonts.ready.then(() => {
  //     const heroTitle = document.querySelector('h1#title') as HTMLElement;
  //     const heroSubtitle = document.querySelector('#subtitle') as HTMLElement;
  //     if (!heroTitle || !heroSubtitle) {
  //       console.warn('⚠️ عناصر الـ hero مش لاقيها SplitText');
  //       return;
  //     }

  //     const heroTitleSplit = SplitText.create(heroTitle, { type: "chars,words" });
  //     const heroSubtitleSplit = SplitText.create(heroSubtitle, { type: "words" });

  //     const tl = gsap.timeline();

  //     // tl.fromTo(heroTitleSplit.words,
  //     //   { opacity: 0, visibility: "visible" },
  //     //   {
  //     //     opacity: 1,
  //     //     duration: 0.8,
  //     //     ease: "sine.out",
  //     //     stagger: 0.2,
  //     //     onStart: () => { gsap.set(heroTitle, { opacity: 1, visibility: "visible" }) },
  //     //   }
  //     // );
  //     // tl.set(heroTitleSplit.chars, { opacity: 1, y: 100, rotateZ: 180, visibility: "visible" });
  //     // tl.fromTo(heroTitleSplit.chars,
  //     //   // { opacity: 0, visibility: "visible" },
  //     //   { opacity: 1, y: 100, rotateZ: 180, visibility: "visible" },
  //     //   {
  //     //     opacity: 1,
  //     //     duration: 0.8,
  //     //     y: 0, rotateZ: 0,
  //     //     ease: "sine.out",
  //     //     stagger: 0.2,
  //     //     onStart: () => { gsap.set(heroTitle, { opacity: 1, visibility: "visible" }) },
  //     //     onComplete: () => { heroTitleSplit.revert(); }
  //     //   }
  //     // );
  //     tl.fromTo(heroSubtitleSplit.words,
  //       { opacity: 0, visibility: "visible" },
  //       {
  //         opacity: 1,
  //         duration: 0.8,
  //         ease: "sine.out",
  //         stagger: 0.2,
  //         onStart: () => { gsap.set(heroSubtitle, { opacity: 1, visibility: "visible" }) },
  //       }
  //     );
  //   });
  // }
}
