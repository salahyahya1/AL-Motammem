import { isPlatformBrowser } from '@angular/common';
import { ApplicationRef, Component, Inject, NgZone, OnDestroy, PLATFORM_ID, ViewChild, ViewEncapsulation } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from "gsap/SplitText";
import { AnimatedSequenceComponent } from "../../../shared/animated-sequence/animated-sequence.component";
gsap.registerPlugin(ScrollTrigger, SplitText);

@Component({
  selector: 'app-about-section2',
  imports: [],
  templateUrl: './about-section2.component.html',
  styleUrl: './about-section2.component.scss'
})
export class AboutSection2Component {
  @ViewChild(AnimatedSequenceComponent) seq!: AnimatedSequenceComponent;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appRef: ApplicationRef,
    private ngZone: NgZone

  ) { }
  timeline!: gsap.core.Timeline
  AboutSection2TitleSplit: any;
  AboutSection2SubtitleSplit: any;

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
    let playedOnce = false;
    document.fonts.ready.then(() => {
      gsap.set("#About-Section2", { willChange: "transform, opacity" });
      const section = document.querySelector('#About-Section2') as HTMLElement;
      const video = document.getElementById('About-Section2-video') as HTMLVideoElement;
      const AboutSection2Title = document.querySelector('h1#About-Section2-title') as HTMLElement;
      const AboutSection2Subtitle = document.querySelector('#About-Section2-title2') as HTMLElement;
      const AboutSection2Details = document.querySelector('#About-Section2-title3') as HTMLElement;
      if (!AboutSection2Title || !AboutSection2Subtitle || !AboutSection2Details) {
        console.warn('⚠️ عناصر الـ hero مش لاقيها SplitText');
        return;
      }

      this.AboutSection2TitleSplit = new SplitText(AboutSection2Title, { type: "words" });
      this.AboutSection2SubtitleSplit = new SplitText(AboutSection2Subtitle, { type: "words" });


      const tl = gsap.timeline(

      );

      tl.fromTo(this.AboutSection2TitleSplit.words,
        { opacity: 0, visibility: "visible" },
        {
          opacity: 1,
          duration: 0.5,
          ease: "sine.out",
          stagger: 0.03,
          onStart: () => { gsap.set(AboutSection2Title, { opacity: 1, visibility: "visible" }) },
        }
      );

      tl.fromTo(this.AboutSection2SubtitleSplit.words,
        { opacity: 0, visibility: "visible" },
        {
          opacity: 1,
          duration: 0.5,
          ease: "sine.out",
          stagger: 0.03,
          onStart: () => { gsap.set(AboutSection2Subtitle, { opacity: 1, visibility: "visible" }) },
        }
      );

      tl.fromTo(AboutSection2Details,
        { opacity: 0, y: 50, visibility: "visible" },
        {
          opacity: 1,
          duration: 0.5,
          y: 0,
          ease: "sine.out",
          stagger: 0.02,
          onStart: () => { gsap.set(AboutSection2Details, { opacity: 1, visibility: "visible" }) },
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
          if (!playedOnce) {
            playedOnce = true;
            video.currentTime = 0;
            // video.play().catch(() => console.warn('Autoplay prevented'));
            video?.play();
          }
        },
        // onLeave: () => {
        //   gsap.to(section, { backgroundColor: "white", duration: 0.5, ease: "sine.out" });
        //   gsap.to(video, { opacity: "0", duration: 0.5, ease: "sine.out" });

        // }
      })

      this.timeline = tl
    });
  }
}
