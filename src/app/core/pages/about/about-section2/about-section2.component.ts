import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, NgZone, PLATFORM_ID, ViewChild } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from "gsap/SplitText";
import { AnimatedSequenceComponent } from "../../../shared/animated-sequence/animated-sequence.component";
gsap.registerPlugin(ScrollTrigger, SplitText);
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../shared/services/language.service';
import { VedioPlayerServiceForIosService } from '../../../shared/services/vedio-player-service-for-ios.service';
@Component({
  selector: 'app-about-section2',
  imports: [TranslatePipe],
  templateUrl: './about-section2.component.html',
  styleUrl: './about-section2.component.scss'
})
export class AboutSection2Component {
  @ViewChild(AnimatedSequenceComponent) seq!: AnimatedSequenceComponent;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private language: LanguageService,
    private vedioPlayer: VedioPlayerServiceForIosService,
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
      const section = document.querySelector('#About-Section2') as HTMLElement;
      const video = document.getElementById('About-Section2-video') as HTMLVideoElement;
      const AboutSection2Title = document.querySelector('h1#About-Section2-title') as HTMLElement;
      const AboutSection2Subtitle = document.querySelector('#About-Section2-title2') as HTMLElement;
      const AboutSection2Details = document.querySelector('#About-Section2-title3') as HTMLElement;

      if (!AboutSection2Title || !AboutSection2Subtitle || !AboutSection2Details) {
        console.warn('⚠️ عناصر الـ hero مش لاقيها SplitText');
        return;
      }

      let mm = gsap.matchMedia();

      mm.add({
        desktop: '(min-width: 768px)',
        mobile: '(max-width: 767px)',
      }, (context) => {
        let { desktop, mobile } = context.conditions as any;

        gsap.set("#About-Section2", { willChange: "transform, opacity" });

        this.AboutSection2TitleSplit = new SplitText(AboutSection2Title, { type: "words" });
        this.AboutSection2SubtitleSplit = new SplitText(AboutSection2Subtitle, { type: "words" });

        const tl = gsap.timeline();

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

        const yDistance = mobile ? 30 : 50; // Lighter animation for mobile

        tl.fromTo(AboutSection2Details,
          { opacity: 0, y: yDistance, visibility: "visible" },
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
          end: mobile ? 'top 95%' : "150% bottom",
          pin: true,
          pinType: 'transform',
          anticipatePin: 1,
          id: 'pinsection',
          animation: tl,
          onEnter: () => {
            gsap.to(section, { backgroundColor: "transparent", duration: 0.5, ease: "sine.out" });
            gsap.to(video, { opacity: "1", duration: 0.5, ease: "sine.out" });
            if (!playedOnce) {
              playedOnce = true;
              video.currentTime = 0;
              this.vedioPlayer.requestPlay(video);
            }
          },
          onLeave: () => { if (mobile) tl.progress(1); },
          onLeaveBack: () => { if (mobile) tl.progress(0); },
        });

        this.timeline = tl;

        return () => {
          if (this.AboutSection2TitleSplit) this.AboutSection2TitleSplit.revert();
          if (this.AboutSection2SubtitleSplit) this.AboutSection2SubtitleSplit.revert();
        };
      });
    });
  }
}
