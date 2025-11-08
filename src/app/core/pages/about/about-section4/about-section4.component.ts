import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ApplicationRef, ChangeDetectorRef, Component, ElementRef, Inject, NgZone, PLATFORM_ID, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Draggable from "gsap/Draggable";
import InertiaPlugin from "gsap/InertiaPlugin";

import SplitText from "gsap/SplitText";

import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, InertiaPlugin);
@Component({
  selector: 'app-about-section4',
  imports: [CommonModule],
  templateUrl: './about-section4.component.html',
  styleUrl: './about-section4.component.scss'
})
export class AboutSection4Component {
  swipeConfig: any;

  isBrowser = false;


  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
  ) {
  }
  @ViewChild('swiperEl') swiperEl!: ElementRef<HTMLDivElement>;


  features = [
    {
      title: 'التطوير والابتكار:',
      text:
        'يؤمن المتمم والقائمين عليه بأن التطوير والابتكار المستمر هو الضامن لتقديم حلول متطورة ومبتكرة توفر تجربة مستخدم مختلفة تمامًا.من خلال الدراسات والبحث المستمر ومتابعة جديد التشريعات والتكنولوجيا من خلال فرقنا ومهندسينا لنقدم حلول تكنولوجية مبتكرة تساهم في تبسيط المهام والعمليات بما يتوافق مع القوانين واللوائح والتشريعات.',
    },
    {
      title: 'الجودة:',
      text:
        'يسعى المتمم لتوفير حلول لأنظمة تخطيط موارد المؤسسات ERP System من خلال برامج عالية الجودة تضيف قيمة حقيقية لعملائها وتساهم في نمو أعمالهم.ابدأ العمل بالمتمم خلال أسابيع، وليس شهور أو سنوات، لتجني النتائج فورًا.',
    },
    {
      title: 'الثقة:',
      text: ' خلال أربعة عقود من العمل المتواصل استطاع المتمم أن يكتسب ثقة العديد والعديد من العملاء في مصر والشرق الاوسط وشمال افريقيا وكانت هذه الثقة منبعها الحرفية والمهنية العالية لدينا في كل مراحل العمل.دعم فني محلي سريع في مصر والسعودية بمعايير خدمة مضمونة.',
    },
    {
      title: 'حل ERP عربي وانجليزي شامل:',
      text: 'واجهة استخدام عربية وتجربة مخصصة للشركات المحلية، مع توافق كامل مع لوائح الضرائب والعمل والفوترة الإلكترونية.',
    },
    {
      title: 'تشغيل سريع:',
      text: 'ابدأ العمل بالمتمم خلال أسابيع، وليس شهور أو سنوات، لتجني النتائج فورًا.',
    },
    {
      title: 'دعم عربي محلي مع SLAs:',
      text: 'دعم فني محلي سريع في مصر والسعودية بمعايير خدمة مضمونة.',
    },
    {
      title: 'حل ERP عربي وانجليزي شامل:',
      text: 'واجهة استخدام عربية وتجربة مخصصة للشركات المحلية، مع توافق كامل مع لوائح الضرائب والعمل والفوترة الإلكترونية.',
    },
    {
      title: 'تشغيل سريع:',
      text: 'ابدأ العمل بالمتمم خلال أسابيع، وليس شهور أو سنوات، لتجني النتائج فورًا.',
    },
    {
      title: 'دعم عربي محلي مع SLAs:',
      text: 'دعم فني محلي سريع في مصر والسعودية بمعايير خدمة مضمونة.',
    },
    {
      title: 'حل ERP عربي وانجليزي شامل:',
      text: 'واجهة استخدام عربية وتجربة مخصصة للشركات المحلية، مع توافق كامل مع لوائح الضرائب والعمل والفوترة الإلكترونية.',
    },
    {
      title: 'تشغيل سريع:',
      text: 'ابدأ العمل بالمتمم خلال أسابيع، وليس شهور أو سنوات، لتجني النتائج فورًا.',
    },
    {
      title: 'دعم عربي محلي مع SLAs:',
      text: 'دعم فني محلي سريع في مصر والسعودية بمعايير خدمة مضمونة.',
    },
  ];
  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (typeof window === 'undefined') return;
    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          const AboutSection4TITLE = document.querySelector('#AboutSection4-TITLE') as HTMLElement;
          const AboutSection4TITLESplit = SplitText.create(AboutSection4TITLE, { type: "words" });
          ScrollTrigger.create({
            trigger: '#AboutSection4',
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
              trigger: "#AboutSection4",
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
              duration: 2,
              ease: "power2.inOut"
            });
          gsap.set("#AboutSection4-TITLE", { perspective: 800 });

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
          tl.fromTo("#AboutSection4Bottom",
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
        }, 500);
      })
    })
  }
}
