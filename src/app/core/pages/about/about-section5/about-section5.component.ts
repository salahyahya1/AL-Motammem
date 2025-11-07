import { isPlatformBrowser } from '@angular/common';
import { ApplicationRef, Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from "gsap/SplitText";
import { RouterLink } from "@angular/router";
gsap.registerPlugin(ScrollTrigger, SplitText);
@Component({
  selector: 'app-about-section5',
  imports: [RouterLink],
  templateUrl: './about-section5.component.html',
  styleUrl: './about-section5.component.scss'
})
export class AboutSection5Component {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
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

    document.fonts.ready.then(() => {
      gsap.set("#AboutSection5", { willChange: "transform, opacity" });
      const section = document.querySelector('#AboutSection5') as HTMLElement;
      const image = document.querySelector('#AboutSection5Image') as HTMLElement;
      const video = document.getElementById('About-Section5-video') as HTMLVideoElement;
      const heroTitle = document.querySelector('h1#AboutSection5title') as HTMLElement;
      const button2 = document.querySelector('#AboutSection5Button') as HTMLElement;
      if (!heroTitle || !button2) {
        console.warn('⚠️ عناصر الـ hero مش لاقيها SplitText');
        return;
      }

      this.heroTitleSplit = new SplitText(heroTitle, { type: "words" });


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


      tl.fromTo(button2,
        { opacity: 0, visibility: "visible" },
        {
          opacity: 1,
          duration: 0.5,
          ease: "sine.inOut",
          onStart: () => { gsap.set(button2, { opacity: 1, visibility: "visible" }) },
        }
      );
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: "150% bottom",
        pin: true,
        anticipatePin: 1,
        // markers: true,
        id: 'pinsection',
        animation: tl,
        onEnter: () => {
          gsap.to(section, { backgroundColor: "transparent", duration: 0.5, ease: "sine.out" });
          gsap.to(video, { opacity: "1", duration: 0.5, ease: "sine.out" });
          video?.play();
          gsap.to(image, { opacity: "1", duration: 0.5, ease: "sine.out" });
        },
      })
      this.timeline = tl
    });
  }
}
