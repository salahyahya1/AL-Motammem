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
import { RouterLink } from '@angular/router';
import { NavbarThemeService } from '../../components/navbar/navbar-theme.service';
import { SectionsRegistryService } from '../../shared/services/sections-registry.service';

gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, InertiaPlugin);

interface KnowledgeArticle {
  id: number;
  title: string;
  excerpt: string;
  imageUrl: string;
  ctaLabel: string;
  link?: string;
}
@Component({
  selector: 'app-blogs',
  imports: [CommonModule, RouterLink],
  templateUrl: './blogs.component.html',
  styleUrl: './blogs.component.scss'
})
export class BlogsComponent {
  swipeConfig: any;

  isBrowser = false;


  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private navTheme: NavbarThemeService,
    private sectionsRegistry: SectionsRegistryService
  ) {
  }
  @ViewChild('swiperEl2') swiperEl2!: ElementRef<HTMLDivElement>;

  // هنا الكونتنت بتاع الكاروسول
  articles: KnowledgeArticle[] = [
    {
      id: 1,
      title: 'كيف تُحدث الأنظمة المحاسبية السحابية تحوّلًا في إدارة الأعمال؟',
      excerpt:
        'مستقبل المحاسبة يبدأ من السحابة. اكتشف لماذا تعتمد الشركات الحديثة على الأنظمة الذكية في إدارة عملياتها المالية.',
      imageUrl: './assets/knowledge/article-1.png',
      ctaLabel: 'اكتشف المزيد',
      link: '/BlogVeiw',
    },
    {
      id: 2,
      title: '5 مؤشرات تخبرك أن نظام الـ ERP الحالي لم يعد مناسبًا لشركتك',
      excerpt:
        'تعرف على العلامات المبكرة التي تشير إلى أن الوقت قد حان للانتقال إلى نظام ERP أكثر تطورًا ومرونة.',
      imageUrl: './assets/knowledge/article-2.png',
      ctaLabel: 'اكتشف المزيد',
      link: '/BlogVeiw',
    },
    {
      id: 3,
      title: 'كيف تساعدك الأتمتة في تقليل الأخطاء المحاسبية بنسبة 60٪؟',
      excerpt:
        'من خلال تبسيط دورات العمل وتقليل التدخل اليدوي، يمكنك رفع دقة التقارير وزيادة سرعة اتخاذ القرار.',
      imageUrl: './assets/knowledge/article-3.png',
      ctaLabel: 'اكتشف المزيد',
      link: '/BlogVeiw',
    },
  ];


  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.initMainSwiper();
  }

  private initMainSwiper(): void {
    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          this.navTheme.setColor('var(--primary)');
          Swiper.use([Navigation, Pagination]);

          const swiper = new Swiper(this.swiperEl2.nativeElement, {
            modules: [Navigation, Pagination],
            direction: 'horizontal',
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            grabCursor: true,
            navigation: {
              nextEl: '#arrowRight3',
              prevEl: '#arrowLeft3',
            },
            breakpoints: {
              0: { slidesPerView: 1, spaceBetween: 19 },
              768: { slidesPerView: 1, spaceBetween: 19, },
              1024: { slidesPerView: 1 },
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
        }, 200);
      });
    });

  }
  ngOnDestroy(): void {
    this.sectionsRegistry.clear();
    this.sectionsRegistry.disable();
    if (this.isBrowser) {
      ScrollTrigger.getAll().forEach(t => t.kill());
    }
  }
}
