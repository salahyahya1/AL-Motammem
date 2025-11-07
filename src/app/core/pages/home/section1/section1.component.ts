import { isPlatformBrowser } from '@angular/common';
import { ApplicationRef, Component, Inject, NgZone, OnDestroy, PLATFORM_ID, ViewChild, ViewEncapsulation } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from "gsap/SplitText";
import { AnimatedSequenceComponent } from "../../../shared/animated-sequence/animated-sequence.component";
import { RouterLink } from "@angular/router";
gsap.registerPlugin(ScrollTrigger, SplitText);
@Component({
  selector: 'app-section1',
  templateUrl: './section1.component.html',
  styleUrl: './section1.component.scss',
  imports: [AnimatedSequenceComponent, RouterLink],
})
export class Section1Component implements OnDestroy {
  @ViewChild(AnimatedSequenceComponent) seq!: AnimatedSequenceComponent;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appRef: ApplicationRef,
    private ngZone: NgZone

  ) { }
  timeline!: gsap.core.Timeline
  heroTitleSplit: any;
  heroSubtitleSplit: any;
  heroDetailsSplit: any;

  ngAfterViewInit() {
    if (typeof window === 'undefined') return;

    if (!isPlatformBrowser(this.platformId)) return;
    requestAnimationFrame(() => {
      this.ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          this.runGsapAnimation();
        }, 500);
      });
    });

  }
  private runGsapAnimation() {
    this.seq.playForwardAnimation();
    document.fonts.ready.then(() => {
      gsap.set("#hero", { willChange: "transform, opacity" });

      const heroTitle = document.querySelector('h1#hero-title') as HTMLElement;
      const heroSubtitle = document.querySelector('#hero-subtitle') as HTMLElement;
      const heroDetails = document.querySelector('#hero-details') as HTMLElement;
      const button1 = document.querySelector('#button1') as HTMLElement;
      const button2 = document.querySelector('#button2') as HTMLElement;
      if (!heroTitle || !heroSubtitle || !heroDetails || !button1 || !button2) {
        console.warn('⚠️ عناصر الـ hero مش لاقيها SplitText');
        return;
      }

      this.heroTitleSplit = new SplitText(heroTitle, { type: "words" });
      this.heroSubtitleSplit = new SplitText(heroSubtitle, { type: "words" });
      this.heroDetailsSplit = new SplitText(heroDetails, { type: "words" });


      const tl = gsap.timeline();

      tl.fromTo(this.heroTitleSplit.words,
        { opacity: 0, visibility: "visible" },
        {
          opacity: 1,
          duration: 0.4,
          ease: "sine.out",
          stagger: 0.02,
          onStart: () => { gsap.set(heroTitle, { opacity: 1, visibility: "visible" }) },
        }
      );

      tl.fromTo(this.heroSubtitleSplit.words,
        { opacity: 0, visibility: "visible" },
        {
          opacity: 1,
          duration: 0.4,
          ease: "sine.out",
          stagger: 0.02,
          onStart: () => { gsap.set(heroSubtitle, { opacity: 1, visibility: "visible" }) },
        }
      );

      tl.fromTo(this.heroDetailsSplit.words,
        { opacity: 0, visibility: "visible" },
        {
          opacity: 1,
          duration: 0.4,
          ease: "sine.out",
          stagger: 0.02,
          onStart: () => { gsap.set(heroDetails, { opacity: 1, visibility: "visible" }) },
        }
      );


      tl.fromTo(button1,
        { opacity: 0, visibility: "visible" },
        {
          opacity: 1,
          duration: 0.5,
          ease: "sine.inOut",
          onStart: () => { gsap.set(button1, { opacity: 1, visibility: "visible" }) },
        }
      );

      tl.fromTo(button2,
        { opacity: 0, visibility: "visible" },
        {
          opacity: 1,
          duration: 0.5,
          ease: "sine.inOut",
          onStart: () => { gsap.set(button2, { opacity: 1, visibility: "visible" }) },
        }
      );

      this.timeline = tl
    });
  }
  ngOnDestroy(): void {
    // if (!isPlatformBrowser(this.platformId)) return;
    // if (this.timeline) {
    //   this.timeline.clear();
    // }
    // requestAnimationFrame(() => {
    //   this.heroTitleSplit?.revert();
    //   this.heroSubtitleSplit?.revert();
    //   this.heroDetailsSplit?.revert();
    // });

  }
}
