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
  private mm: gsap.MatchMedia | null = null;
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
          const sectionHead = document.querySelector('#solutionsSection3Title') as HTMLElement;
          const sectionSub = document.querySelector('#solutionsSection3SubTitle') as HTMLElement;

          if (!sectionHead) {
            console.warn('⚠️ عناصر النص مش لاقيها SplitText');
            return;
          }


          // const tl = gsap.timeline({
          //   defaults: { ease: 'power3.out' },
          //   scrollTrigger: {
          //     trigger: '#solutionsSection3',
          //     start: 'top top',
          //     end: "150% bottom",
          //     pin: true,
          //     // markers: true,
          //   },
          // });

          document.fonts.ready.then(() => {

            const splitedtext = SplitText.create(sectionHead, { type: 'words' });
            const splitedSub = SplitText.create(sectionSub, { type: 'words' });
            const addTextAnimation = (tl: gsap.core.Timeline) => {
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
            };
            this.mm = gsap.matchMedia();
            this.mm.add('(min-width: 700px)', () => {
              const tl = gsap.timeline({
                defaults: { ease: 'power3.out' },
                scrollTrigger: {
                  trigger: '#solutionsSection3',
                  start: 'top top',
                  end: "140% bottom",
                  pin: true,
                  // scrub: true,
                  // markers: true,
                },
              });
              // أنيميشن النص (مشترك)
              addTextAnimation(tl);

              // 🔷 هنا بعدين هتزود أنيميشن الكروت بتاعت الشاشات الكبيرة
              // tl.from('.solution-card', { ... }, '<+0.3');
              for (let i = 1; i < 7; i++) {
                tl.fromTo(`.pills-container${i}`, {
                  yPercent: -100 * i,
                  autoAlpha: 0,
                  duration: 1,
                  ease: 'power3.out'
                }, {
                  autoAlpha: 1,
                  yPercent: 0
                }, '>')
              }
              // tl.fromTo('.pills-container1', {
              //   yPercent: -100,
              //   duration: 1,
              //   ease: 'power2.in'
              // }, {
              //   yPercent: 0
              // })

              return () => {
                tl.kill();
              };
            });
            this.mm.add('(max-width: 699px)', () => {
              const tl = gsap.timeline({
                defaults: { ease: 'power3.out' },
                scrollTrigger: {
                  trigger: '#solutionsSection3',
                  start: 'top top',
                  end: '+=50%',
                  pin: true,
                  // markers: true,
                },
              });

              addTextAnimation(tl);
              for (let i = 1; i < 7; i++) {
                tl.fromTo(`.pills-container${i}>.pill`, {
                  yPercent: -100 * i,
                  autoAlpha: 0,
                }, {
                  autoAlpha: 1,
                  yPercent: 0,
                  duration: 1,
                  ease: 'power3.out',
                  stagger: 0.15,
                }, '>')
              }
              return () => {
                tl.kill();
              };
            });



          });
        }, 0);
      });
    });
  }
}
