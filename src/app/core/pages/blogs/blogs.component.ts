import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Inject, NgZone, PLATFORM_ID, ViewChild } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Draggable from "gsap/Draggable";
import InertiaPlugin from "gsap/InertiaPlugin";

import SplitText from "gsap/SplitText";

import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

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
  BlogsTitleSplit: any;
  BlogsSubtitleSplit: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private navTheme: NavbarThemeService,
    private sectionsRegistry: SectionsRegistryService
  ) {
  }
  @ViewChild('swiperEl2') swiperEl2!: ElementRef<HTMLDivElement>;

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



          ScrollTrigger.create({
            trigger: '#knowledge-center',
            start: 'top top',
            end: "150% bottom",
            pin: true,
            pinType: 'transform',
            id: 'pinsection',
            anticipatePin: 1,
          });

          const BlogsTitle = document.querySelector('#title') as HTMLElement | null;
          const BlogsSubtitle = document.querySelector('#Desc') as HTMLElement | null;
          if (!BlogsTitle || !BlogsSubtitle) {
            console.warn('⚠️ عناصر الـ hero مش لاقيها SplitText');
            return;
          }
          this.BlogsTitleSplit = new SplitText(BlogsTitle, { type: 'words' });
          this.BlogsSubtitleSplit = new SplitText(BlogsSubtitle, { type: 'words' });
          const tl = gsap.timeline({
            defaults: { ease: "power3.out" }, scrollTrigger: {
              trigger: "#knowledge-center",
            }
          });



          tl.fromTo(this.BlogsTitleSplit.words,
            { opacity: 0, visibility: "visible" },
            {
              opacity: 1,
              duration: 0.4,
              ease: "sine.out",
              stagger: 0.02,
              onStart: () => { gsap.set(BlogsTitle, { opacity: 1, visibility: "visible" }) },
            }
          );
          tl.fromTo(this.BlogsSubtitleSplit.words,
            { opacity: 0, visibility: "visible" },
            {
              opacity: 1,
              duration: 0.4,
              ease: "sine.out",
              stagger: 0.02,
              onStart: () => { gsap.set(BlogsSubtitle, { opacity: 1, visibility: "visible" }) },
            }
          );
          tl.fromTo("#btn1", { opacity: 0, visibility: "hidden" }, { opacity: 1, visibility: "visible", duration: 0.8 });
          tl.fromTo("#blogs-bottom", { opacity: 0, visibility: "hidden" }, { opacity: 1, visibility: "visible", duration: 0.8 });

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
