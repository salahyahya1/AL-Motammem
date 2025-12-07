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
import { TranslatePipe } from '@ngx-translate/core';

gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, InertiaPlugin);
interface course {
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
  ) {
  }
  @ViewChild('swiperEl') swiperEl!: ElementRef<HTMLDivElement>;
  courses: course[] = [
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

  // features = [
  //   {
  //     title: 'الثقة:',
  //     text:
  //       'خلال أربعة عقود من العمل المتواصل استطاع المتمم أن يكتسب ثقة العديد والعديد من العملاء في مصر والشرق الاوسط وشمال افريقيا وكانت هذه الثقة منبعها الحرفية والمهنية العالية لدينا في كل مراحل العمل.',
  //   },
  //   {
  //     title: 'الجودة:',
  //     text:
  //       'يسعى المتمم لتوفير حلول لأنظمة تخطيط موارد المؤسسات ERP System من خلال برامج عالية الجودة تضيف قيمة حقيقية لعملائها وتساهم في نمو أعمالهم.',
  //   },
  //   {
  //     title: 'التطوير والابتكار:',
  //     text: `یؤمن المتمم والقائمین علیه بأن التطویر والابتكار المستمر ھو الضامن لتقدیم حلول متطورة ومبتكرة توفر تجربة مستخدم مختلفة تمامًا. من خلال الدراسات والبحث المستمر ومتابعة جدید التشریعات والتكنولوجیا من خلال فرقنا ومھندسینا لنقدم حلول تكنولوجیة مبتكرة تساھم في تبسیط المھام والعملیات بما یتوافق مع القوانین واللوائح والتشریعات.`,
  //   },
  //   {
  //     title: 'الكفاءة والفعالیة:',
  //     text: `الكفاءة والفعالیة التي تتمتع بھا خدماتنا وفریق عملنا وفریق الدعم لدینا ھما ركیزتان أساسیتان في اكتساب ثقة عملائنا واعتمادھم على الحلول التي نقدمھا لتبسیط مھامھم ودفعھم نحو الازدھار والنمو.`,
  //   },
  //   {
  //     title: 'الالتزام:',
  //     text: `نحن ملتزمون بالدعم المستمر لأنظمتنا ولفرق العمل لدى عملائنا وتقدیم حلول SYSTEM ERP ذكیة وشاملة تساعد وتساھم في تحقیق أھداف عملائنا.`,
  //   },
  //   {
  //     title: 'القوة والأخلاق:',
  //     text: `یؤمن المتمم أن القوة تنبع من مبادئ مھنیة وقیم أخلاقیة وحضاریة، والالتزام بالمبادئ والقیم الخاصة بالمؤسسة وسیاستنا الأخلاقیة یجسدھا كل العاملین لدینا، لأن قیمنا الأخلاقیة ھي مبادئ شخصیة وأسلوب حیاة یتمتع بھ كل العاملین لدینا.`,
  //   },
  // ];
  // sectors = [
  //   {
  //     title: 'التصنيع',
  //     text:
  //       'متابعة الاصناف وحركاتها متضمنة الخامات والمنتجات نصف مصنعة والمنتج التام وتكلفة كل منتج منها وربط كل ذلك مع المبيعات والمشتريات ومتابعة مراكز التكلفة الانتاجية والخدمية والتنبيه عند حدوث او قبل حدوث ماسبق تحديده للبرامج',
  //   },
  //   {
  //     title: 'المقاولات',
  //     text:
  //       'متابعة حسابات الموردين ومقاولى الباطن واستخراج تكاليف وايرادات كل مشروع وكل بند اعمال وقتيا وربط ذلك بموازين المراجعة وقائمة الدخل والميزانية العمومية',
  //   },
  //   {
  //     title: 'الجهات الغير هادفة للربح',
  //     text:
  //       'متابعة مصادر الاموال وجهات الصرف الخاصة بها مع ربطها مع الموازنة التقديرية والتنبيه عند حدوث او قبل حدوث ماسبق تحديده للبرامج',
  //   },
  //   {
  //     title: 'التصدير والاستيراد',
  //     text:
  //       'متابعة عمليات الاستيراد وحساب تكلفة كل رسالة على حدة وكل صنف بداخلها وربط ذلك مع المخزون والحسابات وصولا لتكلفة الصنف حتى دخوله المخزن وبالتالى حساب تكلفة المبيعات والربحية وقتيا',
  //   },
  //   {
  //     title: 'التوزيع',
  //     text:
  //       'متابعة خطة المبيعات على مستوى الشركة والمنطقة والمندوب وغيرها ومتابعة مندوبى المبيعات وعمولاتهم واستخراج تقارير تحليل المبيعات والربحية بالمندوب والمنطقة والمحافظة والمدينة وخط السيروالصنف وغير ذلك من التحليلات',
  //   },
  //   {
  //     title: 'الشركات متعددة الجنسيات',
  //     text:
  //       'إدارة دقيقة للبيانات المالية، مع تقارير وتحليلات متقدمة واستخراج كافة التقارير المالية وقتيا بالعملات المستخدمه وبالعمله المحلية وعملة البلد الام',
  //   },
  //   {
  //     title: 'الاطعمة والمشروبات',
  //     text:
  //       'متابعة دقيقة للاصناف وتواريخ انتهاء صلاحيتها ومتابعة التشغيلة للصنف سواء عند الشراء او البيع او الرصيد الخاص بالصنف',
  //   },
  //   {
  //     title: 'الخدمات (Services))',
  //     text:
  //       'إدارة العقود، متابعة أداء الفرق، وإصدار الفواتير بسهولة.',
  //   },
  //   {
  //     title: 'القطاع التجاري والمشروعات (Trading/Import Export/Projects))',
  //     text:
  //       'تخطيط الموارد، مراقبة التكاليف، وجدولة المهام لكل مشروع.',
  //   },
  //   {
  //     title: 'القطاع المالي (Finance & Accounting)',
  //     text:
  //       'إدارة دقيقة للبيانات المالية، مع تقارير وتحليلات متقدمة.',
  //   },
  // ];


  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (typeof window === 'undefined') return;
    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          const solutionsSection2TITLE = document.querySelector('#solutionsSection2-TITLE') as HTMLElement;
          const solutionsSection2TITLESplit = SplitText.create(solutionsSection2TITLE, { type: "words" });
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
