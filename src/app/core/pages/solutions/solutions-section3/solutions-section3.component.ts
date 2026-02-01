import { isPlatformBrowser } from '@angular/common';
import { ApplicationRef, Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';
import { RemiveRoleAriaService } from '../../../shared/services/removeRoleAria';
gsap.registerPlugin(ScrollTrigger, SplitText);
interface Sector {
  titleKey: string;
  textKey: string;
}

@Component({
  selector: 'app-solutions-section3',
  imports: [TranslatePipe],
  templateUrl: './solutions-section3.component.html',
  styleUrl: './solutions-section3.component.scss'
})
export class SolutionsSection3Component {
  private mm: gsap.MatchMedia | null = null;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appRef: ApplicationRef,
    private ngZone: NgZone,
    private RemiveRoleAriaService: RemiveRoleAriaService,
  ) { }
  sectors: Sector[] = [
    {
      titleKey: 'SOLUTIONS.SECTION3.SECTORS.COMMERCIAL.TITLE',
      textKey: 'SOLUTIONS.SECTION3.SECTORS.COMMERCIAL.DESC',
    },
    {
      titleKey: 'SOLUTIONS.SECTION3.SECTORS.FINANCE_ACCOUNTING.TITLE',
      textKey: 'SOLUTIONS.SECTION3.SECTORS.FINANCE_ACCOUNTING.DESC',
    },

    {
      titleKey: 'SOLUTIONS.SECTION3.SECTORS.CONTRACTING.TITLE',
      textKey: 'SOLUTIONS.SECTION3.SECTORS.CONTRACTING.DESC',
    },
    {
      titleKey: 'SOLUTIONS.SECTION3.SECTORS.NON_PROFIT.TITLE',
      textKey: 'SOLUTIONS.SECTION3.SECTORS.NON_PROFIT.DESC',
    },
    {
      titleKey: 'SOLUTIONS.SECTION3.SECTORS.IMPORT_EXPORT.TITLE',
      textKey: 'SOLUTIONS.SECTION3.SECTORS.IMPORT_EXPORT.DESC',
    },
    {
      titleKey: 'SOLUTIONS.SECTION3.SECTORS.DISTRIBUTION.TITLE',
      textKey: 'SOLUTIONS.SECTION3.SECTORS.DISTRIBUTION.DESC',
    },
    {
      titleKey: 'SOLUTIONS.SECTION3.SECTORS.MULTINATIONAL.TITLE',
      textKey: 'SOLUTIONS.SECTION3.SECTORS.MULTINATIONAL.DESC',
    },
    {
      titleKey: 'SOLUTIONS.SECTION3.SECTORS.FOOD_BEVERAGE.TITLE',
      textKey: 'SOLUTIONS.SECTION3.SECTORS.FOOD_BEVERAGE.DESC',
    },
    {
      titleKey: 'SOLUTIONS.SECTION3.SECTORS.SERVICES.TITLE',
      textKey: 'SOLUTIONS.SECTION3.SECTORS.SERVICES.DESC',
    },
    {
      titleKey: 'SOLUTIONS.SECTION3.SECTORS.TRADING_PROJECTS.TITLE',
      textKey: 'SOLUTIONS.SECTION3.SECTORS.TRADING_PROJECTS.DESC',
    },
    {
      titleKey: 'SOLUTIONS.SECTION3.SECTORS.MANUFACTURING.TITLE',
      textKey: 'SOLUTIONS.SECTION3.SECTORS.MANUFACTURING.DESC',
    },
  ];
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
            this.RemiveRoleAriaService.cleanA11y(sectionHead, splitedtext);
            this.RemiveRoleAriaService.cleanA11y(sectionSub, splitedSub);
            const addTextAnimation = (tl: gsap.core.Timeline) => {
              // ✳️ أنيميشن العنوان
              tl.fromTo(
                splitedtext.words,
                { opacity: 0, visibility: 'visible' },
                {
                  opacity: 1,
                  duration: 0.1,
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
                  duration: 0.1,
                  ease: 'sine.out',
                  stagger: 0.02,
                  onStart: () => { gsap.set(sectionSub, { opacity: 1, visibility: 'visible' }) },
                },
                '>-0.3'
              );
            };
            this.mm = gsap.matchMedia();
            this.mm.add('(min-width: 768px)', () => {
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
              // for (let i = 1; i < 7; i++) {
              //   tl.fromTo(`.pills-container${i}`, {
              //     yPercent: -100 * i,
              //     autoAlpha: 0,
              //     duration: 1,
              //     ease: 'power3.out'
              //   }, {
              //     autoAlpha: 1,
              //     yPercent: 0
              //   }, '>')
              // }
              const rowsCount = Math.ceil(this.sectors.length / 2);

              for (let i = 1; i <= rowsCount; i++) {
                tl.fromTo(
                  `.pills-container${i}`,
                  {
                    yPercent: -100 * i,
                    autoAlpha: 0,
                  },
                  {
                    autoAlpha: 1,
                    yPercent: 0,
                    duration: 0.1,
                    ease: 'power3.out',
                  },
                  '>'
                );
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
            this.mm.add('(max-width: 767px)', () => {
              const tl = gsap.timeline({
                defaults: { ease: 'power3.out' },
                scrollTrigger: {
                  trigger: '#solutionsSection3',
                  start: 'top top',
                  end: 'top 95%',
                  pin: true,
                  onLeave: () => { tl.progress(1) },
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
                  duration: 0.1,
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
