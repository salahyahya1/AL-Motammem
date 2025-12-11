import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ApplicationRef, ChangeDetectorRef, Component, ElementRef, Inject, NgZone, PLATFORM_ID, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Draggable } from "gsap/all";
import InertiaPlugin from "gsap/InertiaPlugin";

import SplitText from "gsap/SplitText";

import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

import { TranslatePipe } from '@ngx-translate/core';
import { RemiveRoleAriaService } from '../../../shared/services/removeRoleAria';
gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, InertiaPlugin);
interface Sector {
  titleKey: string;
  textKey: string;
}

@Component({
  selector: 'app-solutions-section2',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './solutions-section2.component.html',
  styleUrl: './solutions-section2.component.scss'
})
export class SolutionsSection2Component {
  swipeConfig: any;

  isBrowser = false;


  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private RemiveRoleAriaService: RemiveRoleAriaService,
  ) {
  }
  @ViewChild('swiperEl') swiperEl!: ElementRef<HTMLDivElement>;
  sectors: Sector[] = [
    {
      titleKey: 'SOLUTIONS.COURSES.FINANCE.TITLE',
      textKey: 'SOLUTIONS.COURSES.FINANCE.DESC',
    },
    {
      titleKey: 'SOLUTIONS.COURSES.INVENTORY.TITLE',
      textKey: 'SOLUTIONS.COURSES.INVENTORY.DESC',
    },
    {
      titleKey: 'SOLUTIONS.COURSES.PURCHASING.TITLE',
      textKey: 'SOLUTIONS.COURSES.PURCHASING.DESC',
    },
    {
      titleKey: 'SOLUTIONS.COURSES.SALES.TITLE',
      textKey: 'SOLUTIONS.COURSES.SALES.DESC',
    },
    {
      titleKey: 'SOLUTIONS.COURSES.HR.TITLE',
      textKey: 'SOLUTIONS.COURSES.HR.DESC',
    },
    {
      titleKey: 'SOLUTIONS.COURSES.PROJECTS.TITLE',
      textKey: 'SOLUTIONS.COURSES.PROJECTS.DESC',
    },
    {
      titleKey: 'SOLUTIONS.COURSES.REPORTS.TITLE',
      textKey: 'SOLUTIONS.COURSES.REPORTS.DESC',
    },
  ];


  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (typeof window === 'undefined') return;
    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          const solutionsSection2TITLE = document.querySelector('#solutionsSection2-TITLE') as HTMLElement;
          const solutionsSection2TITLESplit = SplitText.create(solutionsSection2TITLE, { type: "words" });
          this.RemiveRoleAriaService.cleanA11y(solutionsSection2TITLE, solutionsSection2TITLESplit);
          ScrollTrigger.create({
            trigger: '#solutionsSection2',
            start: 'top top',
            end: "170% bottom",
            pin: true,
            pinType: 'transform',
            // markers: true,
            id: 'pinsection',
            anticipatePin: 1,
          });
          const tl = gsap.timeline({
            defaults: { ease: "power3.out" }, scrollTrigger: {
              trigger: "#solutionsSection2",
              start: 'top top',
              end: "150% bottom",
              // markers: true,
            }
          });

          const path = document.querySelector(".capsule-path3") as SVGPathElement;
          if (!path) return;
          const length = path.getTotalLength();
          gsap.set('#capsule3', { y: 100 })
          tl.fromTo(path, { strokeDasharray: length, strokeDashoffset: length, opacity: 0, visibility: "hidden" },
            {
              strokeDashoffset: 0,
              opacity: 1,
              visibility: "visible",
              duration: 0.5,
              ease: "power2.inOut"
            });
          gsap.set("#solutionsSection2-TITLE", { perspective: 800 });

          tl.fromTo(solutionsSection2TITLESplit.words,
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
              duration: 1.2,
              stagger: {
                each: 0.25,
                from: "start"
              }
            }
          );
          tl.to("#capsule3", {
            y: -60,
            duration: 1,
            ease: "power2.inOut",
          }, ">-0.4");
          tl.fromTo("#solutionsSection2Bottom",
            { opacity: 0, y: 100 },
            {
              opacity: 1,
              y: 0,
              ease: "sine.out",
              stagger: 0.1,
            }, "<+0.5"
          );

          Swiper.use([Navigation, Pagination]);

          const swiper = new Swiper(this.swiperEl.nativeElement, {
            modules: [Navigation, Pagination],
            direction: 'horizontal',
            slidesPerView: 3,
            spaceBetween: 30,
            loop: true,
            grabCursor: true,
            navigation: {
              nextEl: '#arrowRight2',
              prevEl: '#arrowLeft2',
            },
            breakpoints: {
              0: { slidesPerView: 2, spaceBetween: 19 },
              768: { slidesPerView: 2, spaceBetween: 19, },
              1024: { slidesPerView: 3 },
            },
          });

          gsap.from('.swiper-slide', {
            scrollTrigger: {
              trigger: '.erp-carousel',
              start: 'top 85%',
            },
            opacity: 0,
            y: 60,
            duration: 0.7,
            stagger: 0.2,
            ease: 'power3.out',
          });
          swiper.on('slideChangeTransitionStart', () => {
            const activeSlide = document.querySelector('.swiper-slide-active .card');
            if (activeSlide) {
              gsap.fromTo(
                activeSlide,
                { scale: 0.9, opacity: 0.7 },
                { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out' }
              );
            }
          });
        }, 0);
      })
    })
  }
}
