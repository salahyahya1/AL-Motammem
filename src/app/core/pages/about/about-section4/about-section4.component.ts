import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, NgZone, PLATFORM_ID, ViewChild } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Draggable } from "gsap/all";
import InertiaPlugin from "gsap/InertiaPlugin";

import SplitText from "gsap/SplitText";

import Swiper from 'swiper';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { LanguageService } from '../../../shared/services/language.service';
import { TranslatePipe } from '@ngx-translate/core';
gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, InertiaPlugin);
@Component({
  selector: 'app-about-section4',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './about-section4.component.html',
  styleUrl: './about-section4.component.scss'
})
export class AboutSection4Component {
  swipeConfig: any;

  isBrowser = false;


  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private language: LanguageService
  ) {
  }
  @ViewChild('swiperEl') swiperEl!: ElementRef<HTMLDivElement>;


  features = [
    {
      title: 'ABOUT.SECTION4.VALUES.TRUST.TITLE',
      text: 'ABOUT.SECTION4.VALUES.TRUST.TEXT',
    },
    {
      title: 'ABOUT.SECTION4.VALUES.QUALITY.TITLE',
      text: 'ABOUT.SECTION4.VALUES.QUALITY.TEXT',
    },
    {
      title: 'ABOUT.SECTION4.VALUES.INNOVATION.TITLE',
      text: 'ABOUT.SECTION4.VALUES.INNOVATION.TEXT',
    },
    {
      title: 'ABOUT.SECTION4.VALUES.EFFICIENCY.TITLE',
      text: 'ABOUT.SECTION4.VALUES.EFFICIENCY.TEXT',
    },
    {
      title: 'ABOUT.SECTION4.VALUES.COMMITMENT.TITLE',
      text: 'ABOUT.SECTION4.VALUES.COMMITMENT.TEXT',
    },
    {
      title: 'ABOUT.SECTION4.VALUES.INTEGRITY.TITLE',
      text: 'ABOUT.SECTION4.VALUES.INTEGRITY.TEXT',
    },
  ];


  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (typeof window === 'undefined') return;
    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {

          let mm = gsap.matchMedia();
          const AboutSection4TITLE = document.querySelector('#AboutSection4-TITLE') as HTMLElement;
          let AboutSection4TITLESplit: SplitText;

          // Initialize Swiper (Common for both, handled by internal breakpoints)
          Swiper.use([Navigation, Pagination, Autoplay]);
          const swiper = new Swiper(this.swiperEl.nativeElement, {
            modules: [Navigation, Pagination, Autoplay],
            direction: 'horizontal',
            slidesPerView: 3,
            spaceBetween: 30,
            loop: true,
            grabCursor: true,
            navigation: {
              nextEl: this.isRtl ? '#arrowLeft2' : '#arrowLeft2',
              prevEl: this.isRtl ? '#arrowRight2' : '#arrowRight2',
            },
            breakpoints: {
              0: { slidesPerView: 2, spaceBetween: 19 },
              768: { slidesPerView: 2, spaceBetween: 19, },
              1024: { slidesPerView: 3 },
            },
            autoplay: {
              delay: 2500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
              reverseDirection: this.isRtl ? false : true, // بتعكس اتجاه حركه الكارسول
            },
          });
          const zone = document.getElementById('AboutSection4Bottom') as HTMLElement;

          zone.addEventListener('pointerenter', () => swiper.autoplay?.stop());
          zone.addEventListener('pointerleave', () => swiper.autoplay?.start());
          swiper.on('slideChangeTransitionStart', () => {
            const activeSlide = document.querySelector('.swiper-slide-active .card');
            if (activeSlide) {
              gsap.fromTo(
                activeSlide,
                { scale: 0.9, opacity: 0.7 },
                { scale: 1, opacity: 1, duration: 0.2, ease: 'power2.out' }
              );
            }
          });

          mm.add({
            desktop: '(min-width: 768px)',
            mobile: '(max-width: 767px)',
          }, (context) => {
            let { desktop, mobile } = context.conditions as any;

            // Re-select title to ensure fresh reference if needed, though simpler to just use outer var
            // Initialize SplitText
            AboutSection4TITLESplit = SplitText.create(AboutSection4TITLE, { type: "words" });

            ScrollTrigger.create({
              trigger: '#AboutSection4',
              start: 'top top',
              end: mobile ? 'top 95%' : "170% bottom",
              pin: true,
              pinType: 'transform',
              id: 'pinsection',
              anticipatePin: 1,
              onLeave: () => { if (mobile) tl.progress(0.5); },
              // onEnterBack: () => { if (mobile) tl.progress(0); },
            });

            const tl = gsap.timeline({
              defaults: { ease: "power3.out" }, scrollTrigger: {
                trigger: "#AboutSection4",
                start: 'top top',
                end: "150% bottom",
              }
            });

            const path = document.querySelector(".capsule-aboutRect") as SVGPathElement;
            if (path) {
              const length = path.getTotalLength();
              gsap.set('#capsuleAboutWrap', { y: 100 });

              tl.fromTo(path, { strokeDasharray: length, strokeDashoffset: length, opacity: 0, visibility: "hidden" },
                {
                  strokeDashoffset: 0,
                  opacity: 1,
                  visibility: "visible",
                  duration: 0.5,
                  ease: "power2.inOut"
                });
            }

            gsap.set("#AboutSection4-TITLE", { perspective: 800, visibility: "visible", opacity: 1 });

            // Title Animation: Lighter on mobile
            if (mobile) {
              tl.fromTo(AboutSection4TITLESplit.words,
                {
                  opacity: 0,
                  filter: "blur(2px)"
                },
                {
                  opacity: 1,
                  filter: "blur(0px)",
                  duration: 0.8,
                  stagger: 0.1
                }
              );
            } else {
              // Desktop: Original Complex Animation
              tl.fromTo(AboutSection4TITLESplit.words,
                {
                  opacity: 0,
                  rotateY: gsap.utils.random(-80, 80),
                  filter: "blur(6px)"
                },
                {
                  opacity: 1,
                  rotateY: 0,
                  y: 0,
                  filter: "blur(0px)",
                  duration: 0.2,
                  stagger: {
                    each: 0.25,
                    from: "start"
                  }
                }
              );
            }

            tl.to("#capsuleAboutWrap", {
              y: mobile ? 20 : -40, // Reduced movement on mobile
              duration: 0.2,
              ease: "power2.inOut",
            }, ">-0.4");

            tl.fromTo("#AboutSection4Bottom",
              { opacity: 0, y: mobile ? 50 : 100 }, // Reduced movement on mobile
              {
                opacity: 1,
                y: 35,
                ease: "sine.out",
                stagger: 0.1,
              }, "<+0.5"
            );

            gsap.from('.swiper-slide', {
              scrollTrigger: {
                trigger: '.erp-carousel',
                start: 'top 85%',
              },
              opacity: 0,
              y: mobile ? 40 : 60, // Reduced movement on mobile
              duration: 0.2,
              stagger: 0.2,
              ease: 'power3.out',
            });

            return () => {
              if (AboutSection4TITLESplit) AboutSection4TITLESplit.revert();
            };
          });

        }, 500);
      });
    });
  }
  get isRtl() {
    return this.language.currentLang === 'ar';
  }
}
