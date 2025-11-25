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
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../shared/services/language.service';


gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, InertiaPlugin);

@Component({
  selector: 'app-section3',
  imports: [CommonModule, TranslatePipe, TranslateDirective],
  templateUrl: './section3.component.html',
  styleUrl: './section3.component.scss'
})
export class Section3Component {
  swipeConfig: any;

  isBrowser = false;


  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appRef: ApplicationRef,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private language: LanguageService
  ) {
  }
  @ViewChild('swiperEl') swiperEl!: ElementRef<HTMLDivElement>;


  // features = [
  //   {
  //     title: 'حل ERP عربي وانجليزي شامل:',
  //     text: 'واجهة استخدام عربية وتجربة مخصصة للشركات المحلية، مع توافق كامل مع لوائح الضرائب والعمل والفوترة الإلكترونية.',
  //   },
  //   {
  //     title: 'تشغيل سريع:',
  //     text: 'ابدأ العمل بالمتمم خلال أسابيع، وليس شهور أو سنوات، لتجني النتائج فورًا.',
  //   },
  //   {
  //     title: 'أسعار شفافة:',
  //     text: 'خطط واضحة بلا أي رسوم خفية – تعرف بالضبط ما تدفعه.',
  //   },
  //   {
  //     title: 'دعم عربي محلي مع SLAs:',
  //     text: 'دعم فني محلي سريع في مصر والسعودية بمعايير خدمة مضمونة.',
  //   },
  //   {
  //     title: 'تكاملات جاهزة:',
  //     text: ' ربط فوري مع أنظمة الدفع، الضرائب، وواجهات الـ APIs لتسهيل العمل.',
  //   },
  //   {
  //     title: 'حماية وأمان بيانات متقدم: ',
  //     text: ' المتمم يعتمد معايير أمان عالية ويقدم حوكمة بيانات لحماية معلومات شركتك وضمان التوافق مع اللوائح المحلية والدولية.',
  //   },
  //   {
  //     title: 'خطط مرنة تناسب نموك: ',
  //     text: 'Mini للأفراد والفريلانسرز، Standard للشركات الصغيرة والمتوسطة، وPlus للشركات الكبرى التي تحتاج تخصيصات متقدمة.',
  //   },
  // ];
  features = [
    {
      titleKey: 'HOME.SECTION3.FEATURES.FEATURE1.TITLE',
      textKey: 'HOME.SECTION3.FEATURES.FEATURE1.TEXT',
    },
    {
      titleKey: 'HOME.SECTION3.FEATURES.FEATURE2.TITLE',
      textKey: 'HOME.SECTION3.FEATURES.FEATURE2.TEXT',
    },
    {
      titleKey: 'HOME.SECTION3.FEATURES.FEATURE3.TITLE',
      textKey: 'HOME.SECTION3.FEATURES.FEATURE3.TEXT',
    },
    {
      titleKey: 'HOME.SECTION3.FEATURES.FEATURE4.TITLE',
      textKey: 'HOME.SECTION3.FEATURES.FEATURE4.TEXT',
    },
    {
      titleKey: 'HOME.SECTION3.FEATURES.FEATURE5.TITLE',
      textKey: 'HOME.SECTION3.FEATURES.FEATURE5.TEXT',
    },
    {
      titleKey: 'HOME.SECTION3.FEATURES.FEATURE6.TITLE',
      textKey: 'HOME.SECTION3.FEATURES.FEATURE6.TEXT',
    },
    {
      titleKey: 'HOME.SECTION3.FEATURES.FEATURE7.TITLE',
      textKey: 'HOME.SECTION3.FEATURES.FEATURE7.TEXT',
    },
  ];
  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (typeof window === 'undefined') return;
    let playedOnce = false;
    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          const video = document.getElementById('bg-vedio') as HTMLVideoElement;
          const section50Details = document.querySelector('#section50-details') as HTMLElement;
          const section50TITLE = document.querySelector('#section50-TITLE') as HTMLElement;
          const section50DetailsSplit = SplitText.create(section50Details, { type: "words" });
          const section50TITLESplit = SplitText.create(section50TITLE, { type: "words" });
          ScrollTrigger.create({
            trigger: '#section50',
            start: 'top top',
            end: "150% bottom",
            pin: true,
            pinType: 'transform',
            // markers: true,
            id: 'pinsection',
            anticipatePin: 1,
            onEnter: () => {
              if (!playedOnce) {
                playedOnce = true;
                video.currentTime = 0;
                video.play();
              }
            },
          });
          const tl = gsap.timeline({
            defaults: { ease: "power3.out" }, scrollTrigger: {
              trigger: "#section50",
              start: 'top top',
              end: "150% bottom",
              // markers: true,
            }
          });
          let triggered = false;
          triggered = false;

          const path = document.querySelector(".capsule-path2") as SVGPathElement;
          if (!path) return;
          const length = path.getTotalLength();
          gsap.set('#capsule2', { y: 78 })
          tl.fromTo(path, { strokeDasharray: length, strokeDashoffset: length, opacity: 0, visibility: "hidden" },
            {
              strokeDashoffset: 0,
              opacity: 1,
              visibility: "visible",
              duration: 1,
              ease: "power2.inOut"
            });
          gsap.set("#section50-TITLE", { perspective: 800 });

          tl.fromTo(section50TITLESplit.words,
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
              duration: 0.4,
              stagger: {
                each: 0.15,
                from: "start"
              }
              ,
              onStart: () => { gsap.set(section50Details, { opacity: 1, visibility: "visible" }) },
            }
          );
          tl.fromTo(section50DetailsSplit.words,
            { opacity: 0, visibility: "visible" },
            {
              opacity: 1,
              duration: 0.44,
              ease: "sine.out",
              stagger: 0.1,
              onStart: () => { gsap.set(section50Details, { opacity: 1, visibility: "visible" }) },
              onComplete: () => {
                gsap.to(video, {
                  opacity: 0,
                  duration: 0.7,
                  ease: "power2.out",
                  onComplete: () => {
                    video.pause();
                    gsap.set(video, { display: 'none' });
                  }
                });
              }
            }
          );
          tl.to("#capsule2", {
            scale: 0.85,
            duration: 0.6,
            ease: "power2.inOut",
            onStart: () => {
              gsap.to('#section50', {
                backgroundColor: '#ffffff',
                duration: 0.8,
                ease: "power2.inOut"
              });
            }
          }, ">+0.3");
          tl.to("#capsule2", {
            y: -60,
            duration: 0.7,
            ease: "power2.inOut",
          }, ">-0.4");
          tl.fromTo("#section50Bottom",
            { opacity: 0, y: 100 },
            {
              opacity: 1,
              y: 0,
              ease: "sine.out",
              stagger: 0.1,
            }, "<+0.5"
          );

          ////////////////////////////////////////////////////////////////////
          // Swiper.use([Navigation]);
          // //
          // const swiper = new Swiper(this.swiperEl.nativeElement, {
          //   slidesPerView: 3,
          //   spaceBetween: 30,
          //   loop: true,
          //   grabCursor: true,
          //   centeredSlides: false,
          //   navigation: {
          //     nextEl: '#arrowLeft', // لاحظ: عكس الاتجاهات
          //     prevEl: '#arrowRight',
          //   },
          //   breakpoints: {
          //     0: { slidesPerView: 1 },
          //     768: { slidesPerView: 2 },
          //     1024: { slidesPerView: 3 },
          //   }
          // });

          // // GSAP دخول الكروت
          // gsap.from('.swiper-slide', {
          //   scrollTrigger: {
          //     trigger: '.erp-carousel',
          //     start: 'top 85%',
          //   },
          //   opacity: 0,
          //   y: 60,
          //   duration: 0.7,
          //   stagger: 0.2,
          //   ease: 'power3.out',
          // });

          // // GSAP تأثير التبديل
          // swiper.on('slideChangeTransitionStart', () => {
          //   const activeSlide = document.querySelector('.swiper-slide-active .card');
          //   if (activeSlide) {
          //     gsap.fromTo(
          //       activeSlide,
          //       { scale: 0.9, opacity: 0.7 },
          //       { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out' }
          //     );
          //   }
          // });
          Swiper.use([Navigation, Pagination]);

          const swiper = new Swiper(this.swiperEl.nativeElement, {
            modules: [Navigation, Pagination],
            direction: 'horizontal',
            slidesPerView: 3,
            spaceBetween: 30,
            loop: true,
            grabCursor: true,
            navigation: {
              nextEl: '#arrowRight',
              prevEl: '#arrowLeft',
            },
            breakpoints: {
              0: { slidesPerView: 2, spaceBetween: 19 },
              768: { slidesPerView: 2, spaceBetween: 19, },
              1024: { slidesPerView: 3 },
            },
          });

          // ✅ GSAP دخول الكروت
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

          // ✅ تأثير عند التبديل
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
  get isRtl() {
    return this.language.currentLang === 'ar';
  }
}
