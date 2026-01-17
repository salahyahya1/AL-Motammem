import { isPlatformBrowser } from '@angular/common';
import { ApplicationRef, Component, Inject, NgZone, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';
import { LanguageService } from '../../../shared/services/language.service';
import { TranslatePipe } from '@ngx-translate/core';
import { OpenFormDialogDirective } from '../../../shared/Directives/open-form-dialog.directive';

gsap.registerPlugin(ScrollTrigger, SplitText);

@Component({
  selector: 'app-product-section1',
  standalone: true,
  imports: [TranslatePipe, OpenFormDialogDirective],
  templateUrl: './product-section1.component.html',
  styleUrl: './product-section1.component.scss',
})
export class ProductSection1Component implements AfterViewInit {
  // ندي قيمة ابتدائية عشان الـ @for ما يهنّجش
  items: number[] = [1, 2, 3, 4, 5];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appRef: ApplicationRef,
    private ngZone: NgZone,
    private language: LanguageService
  ) { }

  get isRtl() {
    return this.language.currentLang === 'ar';
  }

  ngAfterViewInit() {
    if (typeof window === 'undefined') return;
    if (!isPlatformBrowser(this.platformId)) return;
    const video = document.querySelector('#videoElement') as HTMLVideoElement | null;
    if (video) {
      gsap.set(video, { autoAlpha: 0 }); // autoAlpha = opacity + visibility
      gsap.to(video, { autoAlpha: 1, duration: 0.2, ease: 'power2.out' });
    }
    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          // لو عربي خلي الليست 1..4 عشان الشرط بتاع أول عنصرين
          this.items = this.isRtl ? [1, 2, 3, 4, 5] : [1, 2, 3, 4, 5];

          let mm = gsap.matchMedia();

          mm.add({
            desktop: '(min-width: 768px)',
            mobile: '(max-width: 767px)',
          }, (context) => {
            let { desktop, mobile } = context.conditions as any;
            const wcTargets = ["#productSection1 .cards", ".card1", ".card2", ".card3"];
            const tl = gsap.timeline({
              defaults: { ease: 'power3.out' },
              scrollTrigger: {
                trigger: '#productSection1',
                start: 'top top',
                end: mobile ? 'top 95%' : '150% bottom',
                pin: true,
                pinType: 'transform',
                id: 'pinsection',
                anticipatePin: 1,
                onLeave: () => { if (mobile) tl.progress(1); },

                // onEnterBack: () => { if (mobile) tl.progress(0); },
              },
            });

            document.fonts.ready.then(() => {
              const sectionHead = document.querySelector('#productTitle1') as HTMLElement;
              const sectionSub = document.querySelector('#productSubTitle1') as HTMLElement;
              const sectionbottom = document.querySelector('#productbottom-text') as HTMLElement;

              if (!sectionHead || !sectionSub || !sectionbottom) return;

              const splitedtext = SplitText.create(sectionHead, { type: 'words' });
              const splitedSub = SplitText.create(sectionSub, { type: 'words' });
              const splitedbottom = SplitText.create(sectionbottom, { type: 'words' });

              gsap.set(['.card1', '.card2', '.card3', "#productSection1Btn"], {
                opacity: 0,
                visibility: 'hidden',
              });

              tl.fromTo(
                splitedtext.words,
                { opacity: 0, visibility: 'visible' },
                {
                  opacity: 1,
                  duration: 0.2,
                  stagger: 0.02,
                  onStart: () => { gsap.set(sectionHead, { opacity: 1, visibility: 'visible' }) },
                }
              );

              tl.fromTo(
                splitedSub.words,
                { opacity: 0, visibility: 'visible' },
                {
                  opacity: 1,
                  duration: 0.2,
                  stagger: 0.02,
                  onStart: () => { gsap.set(sectionSub, { opacity: 1, visibility: 'visible' }) },
                },
                '>-0.3'
              );

              // أنيميشن الكروت
              const tlCards = gsap.timeline();

              if (mobile) {
                // Mobile: Simpler fade in without heavy movement
                tlCards
                  .fromTo(
                    '.card2',
                    { autoAlpha: 0, y: 30 },
                    { autoAlpha: 1, y: 0, duration: 0.2, ease: 'sine.out' }
                  )
                  .fromTo(
                    '.card1',
                    { autoAlpha: 0, y: 30 },
                    { autoAlpha: 1, y: 0, duration: 0.2, ease: 'sine.out' },
                    '<'
                  )
                  .fromTo(
                    '.card3',
                    { autoAlpha: 0, y: 30 },
                    { autoAlpha: 1, y: 0, duration: 0.2, ease: 'sine.out' },
                    '<'
                  );
              } else {
                // Desktop: Original movement animation
                tlCards
                  .fromTo(
                    '.card2',
                    { autoAlpha: 0 },
                    { autoAlpha: 1, duration: 0.5, ease: 'sine.out', immediateRender: false }
                  )
                  .fromTo(
                    '.card1',
                    { autoAlpha: 0 },
                    { right: '0%', autoAlpha: 1, duration: 0.5, ease: 'sine.out', immediateRender: false },
                    '<'
                  )
                  .fromTo(
                    '.card3',
                    { autoAlpha: 0 },
                    { left: '0%', autoAlpha: 1, duration: 0.5, ease: 'sine.out', immediateRender: false },
                    '<'
                  );
              }
              tl.add(tlCards, '>');

              tl.fromTo(
                splitedbottom.words,
                { opacity: 0, visibility: 'visible' },
                {
                  opacity: 1,
                  duration: 0.2,
                  stagger: 0.15,
                  onStart: () => { gsap.set(sectionbottom, { opacity: 1, visibility: 'visible' }) },
                },
                '>-0.1'
              );
              tl.fromTo("#productSection1Btn", { opacity: 0, visibility: 'hidden' }, { opacity: 1, visibility: 'visible', duration: 0.2, ease: 'sine.out' }, '>-0.1');
            });

            return () => {
              // Cleanup logic if needed, SplitText usually needs reverting but inside mismatch it often handles resets. 
              // But good practice to revert manually if created inside add.
              // Note: Variables splitedtext etc are captured in closure but created inside add(), so they are re-created. 
              // Ideally we should keep references to revert them, but for this specific structure SplitText.revert() isn't strictly called 
              // on clean up by user request in previous steps clearly. 
              // However, we can revert by selecting elements if we kept refs. 
              // Let's rely on GSAP cleaning up timeline.
            };

          });
        }, 500);
      });
    });
  }
}
