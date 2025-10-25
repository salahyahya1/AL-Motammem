import { isPlatformBrowser } from '@angular/common';
import { ApplicationRef, Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(ScrollTrigger, SplitText);
@Component({
  selector: 'app-section8',
  imports: [RouterLink],
  templateUrl: './section8.component.html',
  styleUrl: './section8.component.scss'
})
export class Section8Component {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appRef: ApplicationRef,
    private ngZone: NgZone

  ) { }
  section8TitleSplit: any;
  section8DetailsSplit: any;
  ngAfterViewInit() {
    if (typeof window === 'undefined') return;

    if (!isPlatformBrowser(this.platformId)) return;
    this.ngZone.onStable.subscribe(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          this.runGsapAnimation();
        }, 500);
      });
    });

  }
  private runGsapAnimation() {
    document.fonts.ready.then(() => {
      const section8Title = document.querySelector('#section8-title') as HTMLElement;
      const section8Details = document.querySelector('#section8-details') as HTMLElement;
      const section8button1 = document.querySelector('#section8-button1') as HTMLElement;
      const section8button2 = document.querySelector('#section8-button2') as HTMLElement;
      if (!section8Title || !section8Details || !section8button1 || !section8button2) {
        console.warn('⚠️ عناصر الـ section8 مش لاقيها SplitText');
        return;
      }

      // const section8TitleSplit = SplitText.create(section8Title, { type: "words" });
      // const section8DetailsSplit = SplitText.create(section8Details, { type: "words" });
      this.section8TitleSplit = new SplitText(section8Title, { type: "words" });
      this.section8DetailsSplit = new SplitText(section8Details, { type: "words" });



      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: {
          trigger: '#section8',
          start: '-20% top',
          end: "bottom bottom",
          // markers: true,
        },
      });

      tl.fromTo(this.section8TitleSplit.words,
        { opacity: 0, visibility: "visible" },
        {
          opacity: 1,
          duration: 0.4,
          ease: "sine.out",
          stagger: 0.02,
          onStart: () => { gsap.set(section8Title, { opacity: 1, visibility: "visible" }) },
        }
      );


      tl.fromTo(this.section8DetailsSplit.words,
        { opacity: 0, visibility: "visible" },
        {
          opacity: 1,
          duration: 0.4,
          ease: "sine.out",
          stagger: 0.02,
          onStart: () => { gsap.set(section8Details, { opacity: 1, visibility: "visible" }) },
        }
      );


      tl.fromTo(section8button1,
        { opacity: 0, visibility: "visible" },
        {
          opacity: 1,
          duration: 0.6,
          ease: "sine.inOut",
          onStart: () => { gsap.set(section8button1, { opacity: 1, visibility: "visible" }) },
        }
      );

      tl.fromTo(section8button2,
        { opacity: 0, visibility: "visible" },
        {
          opacity: 1,
          duration: 0.6,
          ease: "sine.inOut",
          onStart: () => { gsap.set(section8button2, { opacity: 1, visibility: "visible" }) },
        }
      );
    });
  }
}
