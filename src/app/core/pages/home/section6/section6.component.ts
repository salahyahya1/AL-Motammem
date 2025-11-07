import { isPlatformBrowser } from '@angular/common';
import { ApplicationRef, Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

@Component({
  selector: 'app-section6',
  templateUrl: './section6.component.html',
  styleUrls: ['./section6.component.scss'],
  imports: [],
})
export class Section6Component {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appRef: ApplicationRef,
    private ngZone: NgZone
  ) { }

  ngAfterViewInit() {
    if (typeof window === 'undefined') return;
    if (!isPlatformBrowser(this.platformId)) return;

    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          this.runGsapAnimation()
        }, 500);
      });
    });

  }

  private runGsapAnimation() {
    document.fonts.ready.then(() => {
      const title = document.querySelector('#integration-title') as HTMLElement;
      const subtitle = document.querySelector('#integration-subtitle') as HTMLElement;
      const desc = document.querySelector('#integration-desc') as HTMLElement;
      const logos = document.querySelector('#integration-logos') as HTMLElement;

      if (!title || !subtitle || !desc || !logos) return;

      const titleSplit = SplitText.create(title, { type: 'words' });
      const subtitleSplit = SplitText.create(subtitle, { type: 'words' });
      const descSplit = SplitText.create(desc, { type: 'words' });


      const tl = gsap.timeline({
        defaults: { ease: "power3.out" }, scrollTrigger: {
          trigger: "#section6",
          start: 'top top',
          end: "150% bottom",
          pin: true,
          // markers: false,
          // pinSpacing: false, // يمنع المسافة الإضافية
          // scroller: "#smooth-content",
        }
      });



      // 2️⃣ النص الرئيسي
      tl.fromTo(
        titleSplit.words,
        { opacity: 0, visibility: 'visible' },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'sine.out',
          stagger: 0.02,
          onStart: () => { gsap.set(title, { opacity: 1, visibility: 'visible' }) },
        }
      );

      // 3️⃣ السطر الفرعي
      tl.fromTo(
        subtitleSplit.words,
        { opacity: 0, visibility: 'visible' },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'sine.out',
          stagger: 0.02,
          onStart: () => { gsap.set(subtitle, { opacity: 1, visibility: 'visible' }) },
        }
      );
      // 1️⃣ ظهور الأيقونات مرة واحدة
      tl.fromTo(
        logos,
        { opacity: 0 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '>'
      );

      // 4️⃣ الوصف السفلي
      tl.fromTo(
        descSplit.words,
        { opacity: 0, visibility: 'visible' },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'sine.out',
          stagger: 0.02,
          onStart: () => { gsap.set(desc, { opacity: 1, visibility: 'visible' }) },
        }
      );
    });
  }
}
