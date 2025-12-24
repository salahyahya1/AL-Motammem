// import { CommonModule, isPlatformBrowser } from '@angular/common';
// import { ChangeDetectorRef, Component, ElementRef, Inject, NgZone, PLATFORM_ID, ViewChild } from '@angular/core';
// import gsap from 'gsap';
// import ScrollTrigger from 'gsap/ScrollTrigger';
// import { Draggable } from "gsap/all";
// import InertiaPlugin from "gsap/InertiaPlugin";

// import SplitText from "gsap/SplitText";

// import Swiper from 'swiper';
// import { Navigation, Pagination } from 'swiper/modules';

// import { TranslatePipe } from '@ngx-translate/core';
// import { RouterLink } from '@angular/router';
// import { NavbarThemeService } from '../../components/navbar/navbar-theme.service';
// import { SectionsRegistryService } from '../../shared/services/sections-registry.service';
// import { OpenFormDialogDirective } from '../../shared/Directives/open-form-dialog.directive';
// import { AllBlogsResponse, BlogApiItem, BlogsService, MostReadResponse } from './services/blogs-service';
// import { finalize } from 'rxjs';
// import { error } from 'console';

// gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, InertiaPlugin);

// interface KnowledgeArticle {
//   id: number;
//   title: string;
//   excerpt: string;
//   imageUrl: string;
//   ctaLabel: string;
//   link?: string;
// }
// @Component({
//   selector: 'app-blogs',
//   imports: [CommonModule, RouterLink, OpenFormDialogDirective],
//   templateUrl: './blogs.component.html',
//   styleUrl: './blogs.component.scss'
// })
// export class BlogsComponent {
//   swipeConfig: any;

//   isBrowser = false;
//   BlogsTitleSplit: any;
//   BlogsSubtitleSplit: any;
//   mostReadArticles: BlogApiItem[] = [];
//   allBlogs: BlogApiItem[] = [];
//   loadingMostRead = true;
//   loadingAllBlogs = true;
//   private swiper2?: Swiper;

//   get isLoading(): boolean {
//     return this.loadingMostRead || this.loadingAllBlogs;
//   }

//   constructor(
//     @Inject(PLATFORM_ID) private platformId: Object,
//     private ngZone: NgZone,
//     private cdr: ChangeDetectorRef,
//     private navTheme: NavbarThemeService,
//     private sectionsRegistry: SectionsRegistryService,
//     private blogsService: BlogsService
//   ) {
//     this.isBrowser = isPlatformBrowser(this.platformId);
//   }
//   @ViewChild('swiperEl2') swiperEl2!: ElementRef<HTMLDivElement>;

//   articles: any = [];
//   ngOnInit(): void {
//     if (!this.isBrowser) return;
//     this.loadMostRead();
//     this.loadAllBlogs(1);
//   }

//   ngAfterViewInit(): void {
//     if (!isPlatformBrowser(this.platformId)) return;
//     if (this.isLoading) {
//       this.initMainSwiper();
//     }
//   }

//   private initMainSwiper(): void {
//     this.ngZone.runOutsideAngular(() => {
//       requestAnimationFrame(() => {
//         setTimeout(() => {


//           ScrollTrigger.getById('pinsection')?.kill();

//           ScrollTrigger.create({
//             trigger: '#knowledge-center',
//             start: 'top top',
//             end: "110% bottom",
//             pin: true,
//             pinType: 'transform',
//             id: 'pinsection',
//             anticipatePin: 1,
//           });

//           const BlogsTitle = document.querySelector('#title') as HTMLElement | null;
//           const BlogsSubtitle = document.querySelector('#Desc') as HTMLElement | null;
//           if (!BlogsTitle || !BlogsSubtitle) {
//             console.warn('⚠️ عناصر الـ hero مش لاقيها SplitText');
//             return;
//           }
//           this.BlogsTitleSplit = new SplitText(BlogsTitle, { type: 'words' });
//           this.BlogsSubtitleSplit = new SplitText(BlogsSubtitle, { type: 'words' });
//           const tl = gsap.timeline({
//             defaults: { ease: "power3.out" }, scrollTrigger: {
//               trigger: "#knowledge-center",
//             }
//           });



//           tl.fromTo(this.BlogsTitleSplit.words,
//             { opacity: 0, visibility: "visible" },
//             {
//               opacity: 1,
//               duration: 0.4,
//               ease: "sine.out",
//               stagger: 0.02,
//               onStart: () => { gsap.set(BlogsTitle, { opacity: 1, visibility: "visible" }) },
//             }
//           );
//           tl.fromTo(this.BlogsSubtitleSplit.words,
//             { opacity: 0, visibility: "visible" },
//             {
//               opacity: 1,
//               duration: 0.4,
//               ease: "sine.out",
//               stagger: 0.02,
//               onStart: () => { gsap.set(BlogsSubtitle, { opacity: 1, visibility: "visible" }) },
//             }
//           );
//           tl.fromTo("#btn1", { opacity: 0, visibility: "hidden" }, { opacity: 1, visibility: "visible", duration: 0.8 });
//           tl.fromTo("#blogs-bottom", { opacity: 0, visibility: "hidden" }, { opacity: 1, visibility: "visible", duration: 0.8 });

//           this.navTheme.setColor('var(--primary)');
//           Swiper.use([Navigation, Pagination]);
//           const canLoop = (this.articles?.length ?? 0) > 1;
//           this.swiper2 = new Swiper(this.swiperEl2.nativeElement, {
//             modules: [Navigation, Pagination],
//             direction: 'horizontal',
//             slidesPerView: 1,
//             spaceBetween: 30,
//             loop: canLoop,
//             watchOverflow: true,
//             grabCursor: true,
//             navigation: {
//               nextEl: '#arrowRight3',
//               prevEl: '#arrowLeft3',
//             },
//             breakpoints: {
//               0: { slidesPerView: 1, spaceBetween: 19 },
//               768: { slidesPerView: 1, spaceBetween: 19, },
//               1024: { slidesPerView: 1 },
//             },
//           });

//           gsap.from('.swiper-slide', {
//             scrollTrigger: {
//               trigger: '.erp-carousel',
//               start: 'top 85%',
//             },
//             opacity: 0,
//             y: 60,
//             duration: 0.7,
//             stagger: 0.2,
//             ease: 'power3.out',
//           });
//           this.swiper2.on('slideChangeTransitionStart', () => {
//             const activeSlide = document.querySelector('.swiper-slide-active .card');
//             if (activeSlide) {
//               gsap.fromTo(
//                 activeSlide,
//                 { scale: 0.9, opacity: 0.7 },
//                 { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out' }
//               );
//             }
//           });
//         }, 200);
//       });
//     });

//   }
//   loadMostRead() {
//     this.blogsService.getMostReadBlogs().pipe(finalize(() => (this.loadingMostRead = false))).subscribe({
//       next: (res: any) => {
//         this.loadingMostRead = true;
//         this.mostReadArticles = res.data;
//         this.articles = this.mostReadArticles;

//         requestAnimationFrame(() => {
//           if (!this.swiper2) {
//             this.initMainSwiper();
//           } else {
//             // حدّث loop حسب عدد السلايدز
//             const canLoop = (this.articles?.length ?? 0) > 1;
//             this.swiper2.params.loop = canLoop;

//             this.swiper2.update();
//             this.swiper2.navigation?.update();
//           }
//         });
//         setTimeout(() => ScrollTrigger.refresh(), 0);
//         console.log(this.mostReadArticles);
//       },
//       error: (err: any) => {
//         console.log(err.message);

//       }

//     });
//   }
//   loadAllBlogs(page: number) {
//     this.blogsService.getAllBlogs(page).pipe(finalize(() => (this.loadingAllBlogs = false))).subscribe((res: any) => {
//       this.loadingAllBlogs = true
//       this.allBlogs = res.data;
//       console.log(this.allBlogs);
//       setTimeout(() => ScrollTrigger.refresh(), 0);

//     });
//   }
//   ngOnDestroy(): void {
//     this.sectionsRegistry.clear();
//     this.sectionsRegistry.disable();
//     if (this.isBrowser) {
//       ScrollTrigger.getAll().forEach(t => t.kill());
//     }
//   }
// }
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  NgZone,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/all';
import InertiaPlugin from 'gsap/InertiaPlugin';
import SplitText from 'gsap/SplitText';

import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

import { RouterLink } from '@angular/router';
import { NavbarThemeService } from '../../components/navbar/navbar-theme.service';
import { SectionsRegistryService } from '../../shared/services/sections-registry.service';
import { OpenFormDialogDirective } from '../../shared/Directives/open-form-dialog.directive';
import { BlogApiItem, BlogsService } from './services/blogs-service';
import { finalize } from 'rxjs';

gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, InertiaPlugin);

@Component({
  selector: 'app-blogs',
  imports: [CommonModule, RouterLink, OpenFormDialogDirective],
  templateUrl: './blogs.component.html',
  styleUrl: './blogs.component.scss'
})
export class BlogsComponent {
  isBrowser = false;

  BlogsTitleSplit: any;
  BlogsSubtitleSplit: any;

  mostReadArticles: BlogApiItem[] = [];
  allBlogs: BlogApiItem[] = [];

  loadingMostRead = true;
  loadingAllBlogs = true;

  private swiper2?: Swiper;

  // Flags to control init once
  private viewReady = false;
  private uiInitialized = false;
  isAuthenticated = false;
  hasrole = false;
  role: any;
  // refresh batching
  private refreshTimer: any = null;

  get isLoading(): boolean {
    return this.loadingMostRead || this.loadingAllBlogs;
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private navTheme: NavbarThemeService,
    private sectionsRegistry: SectionsRegistryService,
    private blogsService: BlogsService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  @ViewChild('swiperEl2') swiperEl2!: ElementRef<HTMLDivElement>;

  articles: any[] = [];

  ngOnInit(): void {
    if (!this.isBrowser) return;

    this.isAuthenticated = this.blogsService.isAuthenticated();
    this.role = localStorage.getItem('role')
    this.hasrole = this.role ? true : false;
    console.log(this.isAuthenticated);
    console.log(this.role);
    console.log(this.hasrole);

    this.loadMostRead();
    this.loadAllBlogs(1);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.viewReady = true;

    // لو الداتا كانت وصلت قبل الـ view
    this.tryInitUI();
  }

  // -------------------------
  // Core Fix: init once only
  // -------------------------
  private tryInitUI(): void {
    if (!this.isBrowser) return;
    if (!this.viewReady) return;
    if (this.uiInitialized) return;

    // لازم يكون عندي element + ممكن أكون لسه مستني articles (بس حتى لو 0 هننشيء)
    if (!this.swiperEl2?.nativeElement) return;

    this.uiInitialized = true;
    this.initMainSwiper();
  }

  // -------------------------
  // Batch ScrollTrigger.refresh
  // -------------------------
  private scheduleScrollRefresh(): void {
    if (!this.isBrowser) return;

    if (this.refreshTimer) clearTimeout(this.refreshTimer);
    this.refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
      this.refreshTimer = null;
    }, 0);
  }

  private initMainSwiper(): void {
    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          // ✅ prevent duplicate pin trigger
          // ScrollTrigger.create({
          //   trigger: '#knowledge-center',
          //   start: 'top top',
          //   end: '5% bottom',
          // });
          const BlogsTitle = document.querySelector('#title') as HTMLElement | null;
          const BlogsSubtitle = document.querySelector('#Desc') as HTMLElement | null;
          if (!BlogsTitle || !BlogsSubtitle) {
            console.warn('⚠️ عناصر العنوان/الوصف مش موجودة لـ SplitText');
            return;
          }

          this.BlogsTitleSplit = new SplitText(BlogsTitle, { type: 'words' });
          this.BlogsSubtitleSplit = new SplitText(BlogsSubtitle, { type: 'words' });

          const tl = gsap.timeline({
            defaults: { ease: 'power3.out' },
            scrollTrigger: { trigger: '#knowledge-center' }
          });

          tl.fromTo(
            this.BlogsTitleSplit.words,
            { opacity: 0, visibility: 'visible' },
            {
              opacity: 1,
              duration: 0.4,
              ease: 'sine.out',
              stagger: 0.02,
              onStart: () => {
                gsap.set(BlogsTitle, { opacity: 1, visibility: 'visible' });
              }
            }
          );

          tl.fromTo(
            this.BlogsSubtitleSplit.words,
            { opacity: 0, visibility: 'visible' },
            {
              opacity: 1,
              duration: 0.4,
              ease: 'sine.out',
              stagger: 0.02,
              onStart: () => {
                gsap.set(BlogsSubtitle, { opacity: 1, visibility: 'visible' });
              }
            }
          );

          tl.fromTo('#btn1', { opacity: 0, visibility: 'hidden' }, { opacity: 1, visibility: 'visible', duration: 0.8 });
          tl.fromTo('#blogs-bottom', { opacity: 0, visibility: 'hidden' }, { opacity: 1, visibility: 'visible', duration: 0.8 });

          this.navTheme.setColor('var(--primary)');

          Swiper.use([Navigation, Pagination]);

          const canLoop = (this.articles?.length ?? 0) > 1;

          this.swiper2 = new Swiper(this.swiperEl2.nativeElement, {
            modules: [Navigation, Pagination],
            direction: 'horizontal',
            slidesPerView: 1,
            spaceBetween: 30,
            loop: canLoop,
            watchOverflow: true,
            grabCursor: true,
            navigation: {
              nextEl: '#arrowRight3',
              prevEl: '#arrowLeft3'
            },
            breakpoints: {
              0: { slidesPerView: 1, spaceBetween: 19 },
              768: { slidesPerView: 1, spaceBetween: 19 },
              1024: { slidesPerView: 1 }
            }
          });

          gsap.from('.swiper-slide', {
            scrollTrigger: {
              trigger: '.erp-carousel',
              start: 'top 85%'
            },
            opacity: 0,
            y: 60,
            duration: 0.7,
            stagger: 0.2,
            ease: 'power3.out'
          });

          this.swiper2.on('slideChangeTransitionStart', () => {
            const activeSlide = document.querySelector('.swiper-slide-active .card');
            if (activeSlide) {
              gsap.fromTo(
                activeSlide,
                { scale: 0.9, opacity: 0.7 },
                { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out' }
              );
            }
          });

          // ✅ refresh once after init
          this.scheduleScrollRefresh();
        }, 200);
      });
    });
  }

  private updateSwiperAfterData(): void {
    requestAnimationFrame(() => {
      if (!this.swiper2) return;

      const canLoop = (this.articles?.length ?? 0) > 1;
      this.swiper2.params.loop = canLoop;

      this.swiper2.update();
      this.swiper2.navigation?.update();

      // refresh once (batched)
      this.scheduleScrollRefresh();
    });
  }

  loadMostRead() {
    // ✅ set loading BEFORE request
    this.loadingMostRead = true;

    this.blogsService
      .getMostReadBlogs()
      .pipe(finalize(() => (this.loadingMostRead = false)))
      .subscribe({
        next: (res: any) => {
          this.mostReadArticles = res?.data ?? [];
          this.articles = this.mostReadArticles;

          // update DOM first
          this.cdr.detectChanges();

          // init UI once after view is ready
          this.tryInitUI();

          // update swiper after data
          this.updateSwiperAfterData();

          console.log(this.mostReadArticles);
        },
        error: (err: any) => {
          console.log(err?.message);
        }
      });
  }

  loadAllBlogs(page: number) {
    // ✅ set loading BEFORE request
    this.loadingAllBlogs = true;

    this.blogsService
      .getAllBlogs(page)
      .pipe(finalize(() => (this.loadingAllBlogs = false)))
      .subscribe({
        next: (res: any) => {
          this.allBlogs = res?.data ?? [];
          console.log(this.allBlogs);

          // ما نعملش refresh هنا كل مرة — بس batch refresh واحدة
          this.scheduleScrollRefresh();
        },
        error: (err: any) => {
          console.log(err?.message);
          this.scheduleScrollRefresh();
        }
      });
  }

  ngOnDestroy(): void {
    this.sectionsRegistry.clear();
    this.sectionsRegistry.disable();

    if (this.isBrowser) {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    }

    if (this.swiper2) {
      this.swiper2.destroy(true, true);
      this.swiper2 = undefined;
    }

    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }
  DeleteBlog(id: number) {
    this.blogsService.DeleteBlog(id).subscribe({
      next: (res: any) => {
        this.loadMostRead();
        this.loadAllBlogs(1);
      },
      error: (err: any) => {
        console.log(err?.message);
      }
    });
  }
}
