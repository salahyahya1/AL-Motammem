import { isPlatformBrowser } from '@angular/common';
import { ApplicationRef, Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);
@Component({
  selector: 'app-solutions-section3',
  imports: [RouterLink],
  templateUrl: './solutions-section3.component.html',
  styleUrl: './solutions-section3.component.scss'
})
export class SolutionsSection3Component {
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
          const tl = gsap.timeline({
            defaults: { ease: 'power3.out' },
            scrollTrigger: {
              trigger: '#solutionsSection3',
              start: 'top top',
              end: "150% bottom",
              pin: true,
              // markers: true,
            },
          });

          document.fonts.ready.then(() => {
            const sectionHead = document.querySelector('#solutionsSection3Title') as HTMLElement;
            const sectionSub = document.querySelector('#solutionsSection3SubTitle') as HTMLElement;

            if (!sectionHead) {
              console.warn('⚠️ عناصر النص مش لاقيها SplitText');
              return;
            }

            const splitedtext = SplitText.create(sectionHead, { type: 'words' });
            const splitedSub = SplitText.create(sectionSub, { type: 'words' });

            // ✳️ أنيميشن العنوان
            tl.fromTo(
              splitedtext.words,
              { opacity: 0, visibility: 'visible' },
              {
                opacity: 1,
                duration: 0.4,
                ease: 'sine.out',
                stagger: 0.02,
                onStart: () => {
                  gsap.set(sectionHead, { opacity: 1, visibility: 'visible' })
                }
              }
            );

            // ✳️ أنيميشن السطر الفرعي
            tl.fromTo(
              splitedSub.words,
              { opacity: 0, visibility: 'visible' },
              {
                opacity: 1,
                duration: 0.4,
                ease: 'sine.out',
                stagger: 0.02,
                onStart: () => { gsap.set(sectionSub, { opacity: 1, visibility: 'visible' }) },
              },
              '>-0.3'
            );
          });
        }, 500);
      });
    });
  }
}
