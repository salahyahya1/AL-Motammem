import { isPlatformBrowser } from '@angular/common';
import { ApplicationRef, Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

@Component({
  selector: 'app-section7',
  templateUrl: './section7.component.html',
  styleUrls: ['./section7.component.scss'],
  imports: [],
})
export class Section7Component {
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
        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: {
            trigger: '#section7',
            start: 'top top',
            end: "150% bottom",
            pin: true,
            // markers: true,
          },
        });

        document.fonts.ready.then(() => {
          const sectionHead = document.querySelector('#Text7') as HTMLElement;
          const sectionSub = document.querySelector('#SubText7') as HTMLElement;
          const sectionbottom = document.querySelector('#bottom-text') as HTMLElement;
          const card1 = document.querySelector('.card1') as HTMLElement;
          const card2 = document.querySelector('.card2') as HTMLElement;
          const card3 = document.querySelector('.card3') as HTMLElement;

          if (!sectionHead) {
            console.warn('⚠️ عناصر النص مش لاقيها SplitText');
            return;
          }

          const splitedtext = SplitText.create(sectionHead, { type: 'words' });
          const splitedSub = SplitText.create(sectionSub, { type: 'words' });
          const splitedbottom = SplitText.create(sectionbottom, { type: 'words' });
          gsap.set(['.card1', '.card2', '.card3'], {
            opacity: 0,
            visibility: 'hidden',
          });
          // ✳️ أنيميشن العنوان
          tl.fromTo(
            splitedtext.words,
            { opacity: 0, visibility: 'visible' },
            {
              opacity: 1,
              duration: 0.8,
              ease: 'sine.out',
              stagger: 0.1,
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
              duration: 0.8,
              ease: 'sine.out',
              stagger: 0.1,
              onStart: () => { gsap.set(sectionSub, { opacity: 1, visibility: 'visible' }) },
            },
            '>-0.3'
          );


          // ✳️ الكروت بالترتيب (وسط، يمين، يسار)
          // tl.to(
          //   '.card2',
          //   { opacity: 1, duration: 1.5, ease: 'sine.out' },
          //   '>-1'
          // );
          // tl.to(
          //   '.card1',
          //   { opacity: 1, right: 0, duration: 1.5, ease: 'sine.out' },
          //   '<'
          // );
          // tl.to(
          //   '.card3',
          //   { opacity: 1, left: 0, duration: 1.5, ease: 'sine.out' },
          //   '<'
          // );
          tl.fromTo(".card2", {
            autoAlpha: 0,
          }, {
            autoAlpha: 1,
            duration: 1.5,
            ease: "sine.out",
          }, '>')
          tl.fromTo(".card1", {
            // right: 50,
            autoAlpha: 0,
          }, {
            right: 130,
            autoAlpha: 1,
            duration: 1.5,
            ease: "sine.out",
          }, '<')
          tl.fromTo(".card3", {
            autoAlpha: 0,
            // left: -14,
          }, {
            autoAlpha: 1,
            left: 130,
            duration: 1.5,
            ease: "sine.out",
          }, '<')
          tl.fromTo(
            splitedbottom.words,
            { opacity: 0, visibility: 'visible' },
            {
              opacity: 1,
              duration: 0.8,
              ease: 'sine.out',
              stagger: 0.15,
              onStart: () => { gsap.set(sectionSub, { opacity: 1, visibility: 'visible' }) },
            },
            '>-0.1'
          );

        });
      });
    });
  }
}
