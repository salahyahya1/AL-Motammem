// import {
//   Component,
//   Inject,
//   PLATFORM_ID,
//   AfterViewInit,
//   NgZone,
//   ChangeDetectorRef,
// } from '@angular/core';
// import { CommonModule, isPlatformBrowser } from '@angular/common';
// import gsap from 'gsap';
// import ScrollTrigger from 'gsap/ScrollTrigger';
// import ScrollSmoother from 'gsap/ScrollSmoother';
// import { Section1Component } from './section1/section1.component';
// import { Section2Component } from './section2/section2.component';
// import { Section4Component } from './section4/section4.component';
// import { Section5Component } from './section5/section5.component';
// import { Section6Component } from "./section6/section6.component";
// import { Section7Component } from "./section7/section7.component";
// import { Section8Component } from "./section8/section8.component";
// import { BehaviorSubject } from 'rxjs';
// import { Section3Component } from "./section3/section3.component";
// import { NavbarThemeService } from '../../components/navbar/navbar-theme.service';
// import { SectionItem, SectionsRegistryService } from '../../shared/services/sections-registry.service';
// gsap.registerPlugin(ScrollTrigger, ScrollSmoother);


// @Component({
//   selector: 'app-home',
//   standalone: true,
//   imports: [CommonModule, Section1Component, Section2Component, Section4Component, Section5Component, Section6Component, Section7Component, Section8Component, Section3Component],
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.scss'],
// })
// export class HomeComponent implements AfterViewInit {
//   private visibilitySubject = new BehaviorSubject<'visible' | 'invisible'>('visible');
//   visibility$ = this.visibilitySubject.asObservable();
//   visibilityState: 'visible' | 'invisible' = 'visible';
//   private smoother!: any;

//   menuOpen = false;
//   isBrowser: boolean;

//   constructor(
//     @Inject(PLATFORM_ID) private platformId: Object,
//     private ngZone: NgZone,
//     private cdr: ChangeDetectorRef,
//     private navTheme: NavbarThemeService,
//     private sectionsRegistry: SectionsRegistryService
//   ) {
//     this.isBrowser = isPlatformBrowser(this.platformId);
//   }

//   ngAfterViewInit(): void {
//     if (!this.isBrowser) return;

//     this.ngZone.runOutsideAngular(() => {
//       setTimeout(() => {
//         const sections: SectionItem[] = [
//           { id: 'section1-home', labelKey: 'HOME.INDECATORS.ABOUT', wholeSectionId: 'section1-home' },
//           { id: 'section2-home', labelKey: 'HOME.INDECATORS.FACTS', wholeSectionId: 'section2-home' },
//           { id: 'section3-home', labelKey: 'HOME.INDECATORS.WHY', wholeSectionId: 'section3-home' },
//           { id: 'section4-home', labelKey: 'HOME.INDECATORS.APPS', wholeSectionId: 'section4-home' },
//           { id: 'section5-home', labelKey: 'HOME.INDECATORS.TESTIMONIALS', wholeSectionId: 'section5-home' },
//           { id: 'section6-home', labelKey: 'HOME.INDECATORS.INTEGRATIONS', wholeSectionId: 'section6-home' },
//           { id: 'section7-home', labelKey: 'HOME.INDECATORS.PLANS', wholeSectionId: 'section7-home' },
//           { id: 'section8-home', labelKey: 'HOME.INDECATORS.CONTACT', wholeSectionId: 'section8-home' },
//         ];
//         this.sectionsRegistry.set(sections);
//         this.sectionsRegistry.enable();
//         this.observeSections();
//         window.addEventListener('resize', () => {
//           this.ngZone.run(() => {
//             this.cdr.detectChanges();
//           });

//         });
//       }, 150);
//     });
//   }
//   private observeSections() {
//     const sections = gsap.utils.toArray<HTMLElement>('#home .panel');
//     sections.forEach((section) => {
//       const bgColor = section.dataset['bgcolor'] || 'var(--white)';
//       const textColor = section.dataset['textcolor'] || 'var(--primary)';

//       ScrollTrigger.create({
//         trigger: section,
//         start: 'top 50%',
//         end: 'bottom 50%',
//         onEnter: () => this.updateNavbarColors(textColor),
//         onEnterBack: () => this.updateNavbarColors(textColor),
//       });
//     });
//   }

//   private updateNavbarColors(textColor: string) {
//     this.navTheme.setColor(textColor);
//   }
//   ngOnDestroy(): void {
//     this.sectionsRegistry.clear();
//     this.sectionsRegistry.disable();
//     if (this.isBrowser) {
//       ScrollTrigger.getAll().forEach(t => t.kill());
//     }
//   }
// }
// import {
//   Component,
//   Inject,
//   PLATFORM_ID,
//   AfterViewInit,
//   NgZone,
//   ChangeDetectorRef,
//   OnDestroy,
// } from '@angular/core';
// import { CommonModule, isPlatformBrowser } from '@angular/common';
// import gsap from 'gsap';
// import ScrollTrigger from 'gsap/ScrollTrigger';
// import ScrollSmoother from 'gsap/ScrollSmoother';
// import { Section1Component } from './section1/section1.component';
// import { Section2Component } from './section2/section2.component';
// import { Section4Component } from './section4/section4.component';
// import { Section5Component } from './section5/section5.component';
// import { Section6Component } from './section6/section6.component';
// import { Section7Component } from './section7/section7.component';
// import { Section8Component } from './section8/section8.component';
// import { BehaviorSubject } from 'rxjs';
// import { Section3Component } from './section3/section3.component';
// import { NavbarThemeService } from '../../components/navbar/navbar-theme.service';
// import { SectionItem, SectionsRegistryService } from '../../shared/services/sections-registry.service';
// import { OpenFormDialogDirective } from '../../shared/Directives/open-form-dialog.directive';
// gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// @Component({
//   selector: 'app-home',
//   standalone: true,
//   imports: [
//     CommonModule,
//     Section1Component,
//     Section2Component,
//     Section4Component,
//     Section5Component,
//     Section6Component,
//     Section7Component,
//     Section8Component,
//     Section3Component,
//     OpenFormDialogDirective,
//   ],
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.scss'],
// })
// export class HomeComponent implements AfterViewInit, OnDestroy {
//   private visibilitySubject = new BehaviorSubject<'visible' | 'invisible'>('visible');
//   visibility$ = this.visibilitySubject.asObservable();
//   visibilityState: 'visible' | 'invisible' = 'visible';
//   private smoother!: any;
//   isMobile!: boolean
//   menuOpen = false;
//   isBrowser: boolean;

//   constructor(
//     @Inject(PLATFORM_ID) private platformId: Object,
//     private ngZone: NgZone,
//     private cdr: ChangeDetectorRef,
//     private navTheme: NavbarThemeService,
//     private sectionsRegistry: SectionsRegistryService,
//   ) {
//     this.isBrowser = isPlatformBrowser(this.platformId);
//   }
//   ngOnInit() {
//     if (!this.isBrowser) return;
//     this.isMobile = window.matchMedia('(max-width: 768px)').matches;
//   }
//   private ctx?: gsap.Context;
//   ngAfterViewInit(): void {
//     if (!this.isBrowser) return;

//     this.setupMobileStaticHeroLanguage();

//     if (this.isMobile) {
//       setTimeout(() => {
//         this.observeSectionsMobile();
//       }, 7500);
//       return;
//     };

//     this.ngZone.runOutsideAngular(() => {
//       setTimeout(() => {
//         this.ctx = gsap.context(() => {
//           const sections: SectionItem[] = [
//             { id: 'section1-home', labelKey: 'HOME.INDECATORS.ABOUT', wholeSectionId: 'section1-home' },
//             { id: 'section2-home', labelKey: 'HOME.INDECATORS.FACTS', wholeSectionId: 'section2-home' },
//             { id: 'section3-home', labelKey: 'HOME.INDECATORS.WHY', wholeSectionId: 'section3-home' },
//             { id: 'section4-home', labelKey: 'HOME.INDECATORS.APPS', wholeSectionId: 'section4-home' },
//             { id: 'section5-home', labelKey: 'HOME.INDECATORS.TESTIMONIALS', wholeSectionId: 'section5-home' },
//             { id: 'section6-home', labelKey: 'HOME.INDECATORS.INTEGRATIONS', wholeSectionId: 'section6-home' },
//             { id: 'section7-home', labelKey: 'HOME.INDECATORS.PLANS', wholeSectionId: 'section7-home' },
//             { id: 'section8-home', labelKey: 'HOME.INDECATORS.CONTACT', wholeSectionId: 'section8-home' },
//           ];

//           this.sectionsRegistry.set(sections);
//           this.sectionsRegistry.enable();

//           this.observeSections();

//           window.addEventListener('resize', this.onResize);
//         });
//       }, 150);
//       // ScrollTrigger.refresh();
//     });
//   }

//   // ✅ Desktop only
//   private observeSections() {
//     const sections = gsap.utils.toArray<HTMLElement>('#home .panel');
//     sections.forEach((section, index) => {
//       const textColor = section.dataset['textcolor'] || 'var(--primary)';
//       const bgColor = section.dataset['bgcolor'] || 'var(--white)';

//       ScrollTrigger.create({
//         trigger: section,
//         start: 'top 50%',
//         end: 'bottom 50%',
//         onEnter: () => {
//           this.navTheme.setColor(textColor);   // ✅ سيبها زي ما هي
//           this.navTheme.setBg(bgColor);        // ✅ الجديد
//         },
//         onEnterBack: () => {
//           this.navTheme.setColor(textColor);
//           this.navTheme.setBg(bgColor);
//         },
//         onLeaveBack: () => {
//           if (index === 0) {
//             this.navTheme.setBg('var(--white)');
//             this.navTheme.setColor('var(--primary)');
//             return;
//           }
//         },
//       });
//     });
//   }
//   //mobile only
//   private observeSectionsMobile() {
//     const sections = gsap.utils.toArray<HTMLElement>('#home .panel');
//     sections.forEach((section, index) => {
//       const textColor = section.dataset['textcolor'] || 'var(--primary)';
//       const bgColor = section.dataset['bgcolor'] || 'var(--white)';
//       // console.log(section);
//       ScrollTrigger.create({
//         trigger: section,
//         start: 'top 10%',
//         end: 'bottom 50%',
//         // markers: true,
//         // invalidateOnRefresh: true,
//         onEnter: () => {
//           this.navTheme.setColor(textColor);   // ✅ سيبها زي ما هي
//           this.navTheme.setBg(bgColor);        // ✅ الجديد
//         },
//         onEnterBack: () => {
//           this.navTheme.setColor(textColor);
//           this.navTheme.setBg(bgColor);
//         },
//         onLeaveBack: () => {
//           if (index === 0) {
//             this.navTheme.setBg('var(--white)');
//             this.navTheme.setColor('var(--primary)');
//             return;
//           }
//         },
//       });
//     });
//   }

//   private updateNavbarColors(textColor: string) {
//     this.navTheme.setColor(textColor);
//   }

//   private onResize = () => {
//     this.ngZone.run(() => {
//       this.cdr.detectChanges();
//     });
//   };

//   /**
//    * ✅ Mobile Static Hero i18n:
//    * - default AR (SSR)
//    * - لو localStorage = en => بدّل النص بعد idle (عشان Lighthouse)
//    */
//   private setupMobileStaticHeroLanguage() {
//     const isMobile = window.matchMedia('(max-width: 768px)').matches;
//     if (!isMobile) return;

//     const saved = (localStorage.getItem('lang') || '').toLowerCase();
//     console.log(saved);
//     if (saved !== 'en') return;

//     const run = () => this.applyEnglishToMobileHero();

//     const ric = (window as any).requestIdleCallback;
//     if (typeof ric === 'function') ric(() => run(), { timeout: 3000 });
//     else setTimeout(run, 1800);
//   }

//   private applyEnglishToMobileHero() {
//     const hero = document.getElementById('hero-mobile');
//     if (!hero) return;

//     const title = hero.querySelector('[data-i18n="title"]');
//     const subtitle = hero.querySelector('[data-i18n="subtitle"]');
//     const details = hero.querySelector('[data-i18n="details"]');
//     const btn1 = hero.querySelector('[data-i18n="btn1"]');
//     const btn2 = hero.querySelector('[data-i18n="btn2"]');

//     // 🔁 عدّل النصوص دي للقيم اللي عندك فعليًا
//     if (title) title.textContent = 'Manage all your operations in one integrated system';
//     if (subtitle) subtitle.textContent = 'Al Motammem ERP for enterprise resource management, backed by 40 years of experience in local and Gulf markets.';
//     if (details) details.textContent = 'Financial management - inventory - HR and payroll - reporting - fixed assets management - cash and banks - letters of guarantee - letters of credit - tax integrations, plus many more features tailored to your business.';
//     if (btn1) btn1.textContent = 'Book a free consultation';
//     if (btn2) btn2.textContent = "Start chat now";

//     hero.setAttribute('dir', 'ltr');
//     hero.classList.add('is-en');
//   }

//   ngOnDestroy(): void {
//     this.sectionsRegistry.clear();
//     this.sectionsRegistry.disable();
//     if (this.isBrowser) {
//       try {
//         window.removeEventListener('resize', this.onResize);
//       } catch { }

//       // ScrollTrigger.getAll().forEach((t) => t.kill());
//       this.ctx?.revert();
//     }
//   }
// }
// import {
//   Component,
//   Inject,
//   PLATFORM_ID,
//   AfterViewInit,
//   NgZone,
//   ChangeDetectorRef,
//   OnDestroy,
//   OnInit,
// } from '@angular/core';
// import { CommonModule, isPlatformBrowser } from '@angular/common';
// import gsap from 'gsap';
// import ScrollTrigger from 'gsap/ScrollTrigger';
// import ScrollSmoother from 'gsap/ScrollSmoother';

// import { Section1Component } from './section1/section1.component';
// import { Section2Component } from './section2/section2.component';
// import { Section3Component } from './section3/section3.component';
// import { Section4Component } from './section4/section4.component';
// import { Section5Component } from './section5/section5.component';
// import { Section6Component } from './section6/section6.component';
// import { Section7Component } from './section7/section7.component';
// import { Section8Component } from './section8/section8.component';

// import { BehaviorSubject } from 'rxjs';
// import { NavbarThemeService } from '../../components/navbar/navbar-theme.service';
// import { SectionItem, SectionsRegistryService } from '../../shared/services/sections-registry.service';
// import { OpenFormDialogDirective } from '../../shared/Directives/open-form-dialog.directive';

// gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// @Component({
//   selector: 'app-home',
//   standalone: true,
//   imports: [
//     CommonModule,
//     Section1Component,
//     Section2Component,
//     Section3Component,
//     Section4Component,
//     Section5Component,
//     Section6Component,
//     Section7Component,
//     Section8Component,
//     OpenFormDialogDirective,
//   ],
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.scss'],
// })
// export class HomeComponent implements AfterViewInit, OnDestroy, OnInit {
//   private visibilitySubject = new BehaviorSubject<'visible' | 'invisible'>('visible');
//   visibility$ = this.visibilitySubject.asObservable();
//   visibilityState: 'visible' | 'invisible' = 'visible';

//   isMobile!: boolean;
//   isBrowser: boolean;

//   private ctx?: gsap.Context;

//   // ---- Snap system (Desktop only) ----
//   private snapPoints: Array<{ el: HTMLElement; y: number }> = [];
//   private snapTween?: gsap.core.Tween;
//   private isSnapping = false;
//   private isRefreshing = false;

//   // لو عندك Navbar ثابتة فوق وبتغطي بداية السكشن جرّب 80
//   private readonly NAV_OFFSET_DESKTOP = 80;

//   // MutationObserver (للـ @defer)
//   private observer?: MutationObserver;
//   private lastHomeHeight = 0;
//   private refreshTimer: any;

//   constructor(
//     @Inject(PLATFORM_ID) private platformId: Object,
//     private ngZone: NgZone,
//     private cdr: ChangeDetectorRef,
//     private navTheme: NavbarThemeService,
//     private sectionsRegistry: SectionsRegistryService
//   ) {
//     this.isBrowser = isPlatformBrowser(this.platformId);
//   }

//   ngOnInit() {
//     if (!this.isBrowser) return;
//     this.isMobile = window.matchMedia('(max-width: 768px)').matches;
//   }

//   ngAfterViewInit(): void {
//     if (!this.isBrowser) return;

//     this.setupMobileStaticHeroLanguage();

//     // ✅ Mobile: بدون Snap
//     if (this.isMobile) {
//       setTimeout(() => this.observeSectionsMobile(), 750);
//       return;
//     }

//     this.ngZone.runOutsideAngular(() => {
//       this.waitForSmoother((smoother) => {
//         this.ctx = gsap.context(() => {
//           this.initDesktop(smoother);
//         });
//       });
//     });
//   }

//   /**
//    * ✅ مهم: Home ممكن يشتغل قبل Layout، فلازم نستنى ScrollSmoother.get()
//    */
//   private waitForSmoother(cb: (s: any) => void) {
//     const start = performance.now();
//     const tick = () => {
//       const s = ScrollSmoother.get() as any;
//       if (s) return cb(s);
//       if (performance.now() - start < 3000) requestAnimationFrame(tick);
//     };
//     tick();
//   }

//   private initDesktop(smoother: any) {
//     const scroller = smoother.wrapper();

//     // 1) Registry للـ section indicator
//     const sections: SectionItem[] = [
//       { id: 'section1-home', labelKey: 'HOME.INDECATORS.ABOUT', wholeSectionId: 'section1-home' },
//       { id: 'section2-home', labelKey: 'HOME.INDECATORS.FACTS', wholeSectionId: 'section2-home' },
//       { id: 'section3-home', labelKey: 'HOME.INDECATORS.WHY', wholeSectionId: 'section3-home' },
//       { id: 'section4-home', labelKey: 'HOME.INDECATORS.APPS', wholeSectionId: 'section4-home' },
//       { id: 'section5-home', labelKey: 'HOME.INDECATORS.TESTIMONIALS', wholeSectionId: 'section5-home' },
//       { id: 'section6-home', labelKey: 'HOME.INDECATORS.INTEGRATIONS', wholeSectionId: 'section6-home' },
//       { id: 'section7-home', labelKey: 'HOME.INDECATORS.PLANS', wholeSectionId: 'section7-home' },
//       { id: 'section8-home', labelKey: 'HOME.INDECATORS.CONTACT', wholeSectionId: 'section8-home' },
//     ];
//     this.sectionsRegistry.set(sections);
//     this.sectionsRegistry.enable();

//     // 2) Navbar colors triggers (مع scroller بتاع smoother)
//     this.observeSections(scroller);


//     // 5) Observer للـ @defer changes
//     this.initMutationObserver();

//     // 6) Resize
//     window.addEventListener('resize', this.onResize);

//     // أول refresh بعد ما ثبتنا كل حاجة
//     this.safeRefresh();
//   }




//   /**
//    * ✅ Refresh آمن (مرة واحدة) + يمنع snap أثناءه
//    */
//   private safeRefresh() {
//     if (this.isRefreshing) return;

//     const smoother = ScrollSmoother.get() as any;
//     if (!smoother) return;

//     this.isRefreshing = true;

//     // اقطع أي snap قبل refresh
//     this.snapTween?.kill();
//     this.snapTween = undefined;
//     this.isSnapping = false;

//     // refresh
//     smoother.refresh();
//     ScrollTrigger.refresh();


//     this.isRefreshing = false;
//   }

//   /**
//    * ✅ MutationObserver: لو @defer غيّر ارتفاع الصفحة → نعمل refresh throttled
//    */
//   private initMutationObserver() {
//     const homeEl = document.getElementById('home');
//     if (!homeEl) return;

//     this.lastHomeHeight = homeEl.scrollHeight;

//     this.observer = new MutationObserver(() => {
//       const h = homeEl.scrollHeight;
//       if (Math.abs(h - this.lastHomeHeight) < 5) return; // تجاهل تغييرات بسيطة
//       this.lastHomeHeight = h;

//       if (this.refreshTimer) clearTimeout(this.refreshTimer);
//       this.refreshTimer = setTimeout(() => this.safeRefresh(), 200);
//     });

//     this.observer.observe(homeEl, { childList: true, subtree: true });
//   }

//   // ✅ Desktop Navbar Color Observer
//   private observeSections(scroller: HTMLElement) {
//     const sections = gsap.utils.toArray<HTMLElement>('#home .panel');

//     sections.forEach((section, index) => {
//       const textColor = section.dataset['textcolor'] || 'var(--primary)';
//       const bgColor = section.dataset['bgcolor'] || 'var(--white)';

//       ScrollTrigger.create({
//         trigger: section,
//         scroller,
//         start: 'top 50%',
//         end: 'bottom 50%',
//         onEnter: () => {
//           this.navTheme.setColor(textColor);
//           this.navTheme.setBg(bgColor);
//         },
//         onEnterBack: () => {
//           this.navTheme.setColor(textColor);
//           this.navTheme.setBg(bgColor);
//         },
//         onLeaveBack: () => {
//           if (index === 0) {
//             this.navTheme.setBg('var(--white)');
//             this.navTheme.setColor('var(--primary)');
//           }
//         },
//       });
//     });
//   }

//   // ✅ Mobile Navbar Color Observer
//   private observeSectionsMobile() {
//     const sections = gsap.utils.toArray<HTMLElement>('#home .panel');

//     sections.forEach((section, index) => {
//       const textColor = section.dataset['textcolor'] || 'var(--primary)';
//       const bgColor = section.dataset['bgcolor'] || 'var(--white)';

//       ScrollTrigger.create({
//         trigger: section,
//         start: 'top 10%',
//         end: 'bottom 50%',
//         onEnter: () => {
//           this.navTheme.setColor(textColor);
//           this.navTheme.setBg(bgColor);
//         },
//         onEnterBack: () => {
//           this.navTheme.setColor(textColor);
//           this.navTheme.setBg(bgColor);
//         },
//         onLeaveBack: () => {
//           if (index === 0) {
//             this.navTheme.setBg('var(--white)');
//             this.navTheme.setColor('var(--primary)');
//           }
//         },
//       });
//     });
//   }

//   private onResize = () => {
//     // refresh بعد resize عشان points تتظبط
//     if (this.refreshTimer) clearTimeout(this.refreshTimer);
//     this.refreshTimer = setTimeout(() => this.safeRefresh(), 120);

//     this.ngZone.run(() => {
//       this.cdr.detectChanges();
//     });
//   };

//   /**
//    * ✅ Mobile Static Hero i18n:
//    * - default AR (SSR)
//    * - لو localStorage = en => بدّل النص بعد idle (عشان Lighthouse)
//    */
//   private setupMobileStaticHeroLanguage() {
//     const isMobile = window.matchMedia('(max-width: 768px)').matches;
//     if (!isMobile) return;

//     const saved = (localStorage.getItem('lang') || '').toLowerCase();
//     if (saved !== 'en') return;

//     const run = () => this.applyEnglishToMobileHero();
//     const ric = (window as any).requestIdleCallback;
//     if (typeof ric === 'function') ric(() => run(), { timeout: 3000 });
//     else setTimeout(run, 1800);
//   }

//   private applyEnglishToMobileHero() {
//     const hero = document.getElementById('hero-mobile');
//     if (!hero) return;

//     const title = hero.querySelector('[data-i18n="title"]');
//     const subtitle = hero.querySelector('[data-i18n="subtitle"]');
//     const details = hero.querySelector('[data-i18n="details"]');
//     const btn1 = hero.querySelector('[data-i18n="btn1"]');
//     const btn2 = hero.querySelector('[data-i18n="btn2"]');

//     if (title) title.textContent = 'Manage all your operations in one integrated system';
//     if (subtitle) subtitle.textContent =
//       'Al Motammem ERP for enterprise resource management, backed by 40 years of experience in local and Gulf markets.';
//     if (details) details.textContent =
//       'Financial management - inventory - HR and payroll - reporting - fixed assets management - cash and banks - letters of guarantee - letters of credit - tax integrations, plus many more features tailored to your business.';
//     if (btn1) btn1.textContent = 'Book a free consultation';
//     if (btn2) btn2.textContent = 'Start chat now';

//     hero.setAttribute('dir', 'ltr');
//     hero.classList.add('is-en');
//   }

//   ngOnDestroy(): void {
//     this.sectionsRegistry.clear();
//     this.sectionsRegistry.disable();

//     if (this.isBrowser) {
//       try {
//         window.removeEventListener('resize', this.onResize);
//       } catch { }

//       if (this.observer) this.observer.disconnect();
//       if (this.refreshTimer) clearTimeout(this.refreshTimer);

//       this.snapTween?.kill();
//       this.snapTween = undefined;

//       this.ctx?.revert();
//     }
//   }
// }

// export class HomeComponent implements AfterViewInit, OnDestroy, OnInit {
//   private visibilitySubject = new BehaviorSubject<'visible' | 'invisible'>('visible');
//   visibility$ = this.visibilitySubject.asObservable();
//   visibilityState: 'visible' | 'invisible' = 'visible';

//   isMobile!: boolean;
//   isBrowser: boolean;

//   private ctx?: gsap.Context;

//   // ✅ Refresh guard (مهم مع @defer)
//   private isRefreshing = false;

//   // لو عندك Navbar ثابتة فوق وبتغطي بداية السكشن
//   private readonly NAV_OFFSET_DESKTOP = 0;

//   // MutationObserver (للـ @defer)
//   private observer?: MutationObserver;
//   private lastHomeHeight = 0;
//   private refreshTimer: any;

//   // ===================== SMART SNAP (PIXEL-BASED) =====================
//   private snapY: number[] = [];
//   private snapListenersAttached = false;

//   // قد ايه لازم تكون "قريب" من نقطة سناب عشان يسناب
//   private readonly SNAP_ZONE_VH = 0.55;

//   constructor(
//     @Inject(PLATFORM_ID) private platformId: Object,
//     private ngZone: NgZone,
//     private cdr: ChangeDetectorRef,
//     private navTheme: NavbarThemeService,
//     private sectionsRegistry: SectionsRegistryService
//   ) {
//     this.isBrowser = isPlatformBrowser(this.platformId);
//   }

//   ngOnInit() {
//     if (!this.isBrowser) return;
//     this.isMobile = window.matchMedia('(max-width: 768px)').matches;
//   }

//   ngAfterViewInit(): void {
//     if (!this.isBrowser) return;

//     this.setupMobileStaticHeroLanguage();

//     // ✅ Mobile: بدون Snap
//     if (this.isMobile) {
//       setTimeout(() => this.observeSectionsMobile(), 750);
//       return;
//     }

//     this.ngZone.runOutsideAngular(() => {
//       this.waitForSmoother((smoother) => {
//         this.ctx = gsap.context(() => {
//           this.initDesktop(smoother);
//         });
//       });
//     });
//   }

//   /**
//    * ✅ مهم: Home ممكن يشتغل قبل Layout، فلازم نستنى ScrollSmoother.get()
//    */
//   private waitForSmoother(cb: (s: any) => void) {
//     const start = performance.now();
//     const tick = () => {
//       const s = ScrollSmoother.get() as any;
//       if (s) return cb(s);
//       if (performance.now() - start < 3000) requestAnimationFrame(tick);
//     };
//     tick();
//   }

//   private initDesktop(smoother: any) {
//     const scroller = smoother.wrapper();

//     // 1) Registry للـ section indicator
//     const sections: SectionItem[] = [
//       { id: 'section1-home', labelKey: 'HOME.INDECATORS.ABOUT', wholeSectionId: 'section1-home' },
//       { id: 'section2-home', labelKey: 'HOME.INDECATORS.FACTS', wholeSectionId: 'section2-home' },
//       { id: 'section3-home', labelKey: 'HOME.INDECATORS.WHY', wholeSectionId: 'section3-home' },
//       { id: 'section4-home', labelKey: 'HOME.INDECATORS.APPS', wholeSectionId: 'section4-home' },
//       { id: 'section5-home', labelKey: 'HOME.INDECATORS.TESTIMONIALS', wholeSectionId: 'section5-home' },
//       { id: 'section6-home', labelKey: 'HOME.INDECATORS.INTEGRATIONS', wholeSectionId: 'section6-home' },
//       { id: 'section7-home', labelKey: 'HOME.INDECATORS.PLANS', wholeSectionId: 'section7-home' },
//       { id: 'section8-home', labelKey: 'HOME.INDECATORS.CONTACT', wholeSectionId: 'section8-home' },
//     ];
//     this.sectionsRegistry.set(sections);
//     this.sectionsRegistry.enable();

//     // 2) Navbar colors triggers
//     this.observeSections(scroller);

//     // 3) ✅ Snap trigger (Smart pixel-based)
//     ScrollTrigger.create({
//       trigger: '#home',
//       scroller,
//       start: 'top top',
//       end: 'bottom bottom',
//       // markers: true,

//       snap: {
//         snapTo: (p) => this.smartSnapToProgress(smoother, p),
//         duration: { min: 0.2, max: 0.6 },
//         ease: 'power2.out',
//         inertia: true,
//       },
//     });

//     // 4) Observer للـ @defer changes
//     this.initMutationObserver();

//     // 5) Resize
//     window.addEventListener('resize', this.onResize);

//     // أول refresh بعد ما ثبتنا كل حاجة
//     this.safeRefresh();

//     // ✅ build snap points + rebuild listeners
//     this.buildSnapPoints(smoother);
//     this.attachSnapRebuildListeners();
//   }

//   /**
//    * ✅ Refresh آمن + يعيد بناء snap points (مهم مع @defer)
//    */
//   private safeRefresh() {
//     if (this.isRefreshing) return;

//     const smoother = ScrollSmoother.get() as any;
//     if (!smoother) return;

//     this.isRefreshing = true;

//     smoother.refresh();
//     ScrollTrigger.refresh();

//     // ✅ مهم جدًا بعد أي refresh
//     this.buildSnapPoints(smoother);

//     this.isRefreshing = false;
//   }

//   /**
//    * ✅ MutationObserver: لو @defer غيّر ارتفاع الصفحة → نعمل refresh throttled
//    */
//   private initMutationObserver() {
//     const homeEl = document.getElementById('home');
//     if (!homeEl) return;

//     this.lastHomeHeight = homeEl.scrollHeight;

//     this.observer = new MutationObserver(() => {
//       const h = homeEl.scrollHeight;
//       if (Math.abs(h - this.lastHomeHeight) < 5) return;
//       this.lastHomeHeight = h;

//       if (this.refreshTimer) clearTimeout(this.refreshTimer);
//       this.refreshTimer = setTimeout(() => this.safeRefresh(), 200);
//     });

//     this.observer.observe(homeEl, { childList: true, subtree: true });
//   }

//   // ✅ Desktop Navbar Color Observer
//   private observeSections(scroller: HTMLElement) {
//     const sections = gsap.utils.toArray<HTMLElement>('#home .panel');

//     sections.forEach((section, index) => {
//       const textColor = section.dataset['textcolor'] || 'var(--primary)';
//       const bgColor = section.dataset['bgcolor'] || 'var(--white)';

//       ScrollTrigger.create({
//         trigger: section,
//         scroller,
//         start: 'top 50%',
//         end: 'bottom 50%',
//         onEnter: () => {
//           this.navTheme.setColor(textColor);
//           this.navTheme.setBg(bgColor);
//         },
//         onEnterBack: () => {
//           this.navTheme.setColor(textColor);
//           this.navTheme.setBg(bgColor);
//         },
//         onLeaveBack: () => {
//           if (index === 0) {
//             this.navTheme.setBg('var(--white)');
//             this.navTheme.setColor('var(--primary)');
//           }
//         },
//       });
//     });
//   }

//   // ✅ Mobile Navbar Color Observer
//   private observeSectionsMobile() {
//     const sections = gsap.utils.toArray<HTMLElement>('#home .panel');

//     sections.forEach((section, index) => {
//       const textColor = section.dataset['textcolor'] || 'var(--primary)';
//       const bgColor = section.dataset['bgcolor'] || 'var(--white)';

//       ScrollTrigger.create({
//         trigger: section,
//         start: 'top 10%',
//         end: 'bottom 50%',
//         onEnter: () => {
//           this.navTheme.setColor(textColor);
//           this.navTheme.setBg(bgColor);
//         },
//         onEnterBack: () => {
//           this.navTheme.setColor(textColor);
//           this.navTheme.setBg(bgColor);
//         },
//         onLeaveBack: () => {
//           if (index === 0) {
//             this.navTheme.setBg('var(--white)');
//             this.navTheme.setColor('var(--primary)');
//           }
//         },
//       });
//     });
//   }

//   private onResize = () => {
//     if (this.refreshTimer) clearTimeout(this.refreshTimer);
//     this.refreshTimer = setTimeout(() => this.safeRefresh(), 120);

//     this.ngZone.run(() => {
//       this.cdr.detectChanges();
//     });
//   };

//   // ===================== SMART SNAP (PIXEL-BASED) =====================

//   private buildSnapPoints(smoother: any) {
//     const scroller = smoother.wrapper();
//     const panels = gsap.utils.toArray<HTMLElement>('#home .panel');

//     const vh = scroller?.clientHeight || window.innerHeight;
//     const max = ScrollTrigger.maxScroll(scroller) || 1;

//     const points: number[] = [];

//     panels.forEach((el) => {
//       // ✅ بداية السكشن (pixel-based / ثابت مع defer)
//       const yTop = el.offsetTop - this.NAV_OFFSET_DESKTOP;
//       points.push(this.clamp(yTop, 0, max));

//       // ✅ Tail للسكشن الطويل (زي 170vh) بدون تقسيم سكشن
//       const h = el.offsetHeight;
//       if (h > vh * 1.15) {
//         const tail = yTop + (h - vh);
//         points.push(this.clamp(tail, 0, max));
//       }
//     });

//     points.sort((a, b) => a - b);

//     // unique
//     this.snapY = points.filter((v, i, arr) => i === 0 || Math.abs(v - arr[i - 1]) > 2);
//   }

//   private smartSnapToProgress(smoother: any, p: number) {
//     if (this.isRefreshing) return p;

//     if (!this.snapY.length) this.buildSnapPoints(smoother);

//     const scroller = smoother.wrapper();
//     const max = ScrollTrigger.maxScroll(scroller) || 1;

//     const currentY = smoother.scrollTop();
//     const snappedY = gsap.utils.snap(this.snapY, currentY);

//     const threshold = (scroller.clientHeight || window.innerHeight) * this.SNAP_ZONE_VH;
//     const dist = Math.abs(snappedY - currentY);

//     // ✅ Snap only when near a snap point
//     if (dist <= threshold) {
//       return snappedY / max;
//     }

//     // no snap
//     return currentY / max;
//   }

//   private attachSnapRebuildListeners() {
//     if (this.snapListenersAttached) return;
//     this.snapListenersAttached = true;

//     const rebuild = () => {
//       const smoother = ScrollSmoother.get() as any;
//       if (smoother) this.buildSnapPoints(smoother);
//     };

//     ScrollTrigger.addEventListener('refreshInit', rebuild);
//     ScrollTrigger.addEventListener('refresh', rebuild);

//     (this as any)._snapRebuild = rebuild;
//   }

//   private clamp(v: number, min: number, max: number) {
//     return Math.max(min, Math.min(max, v));
//   }

//   // ===================================================================

//   /**
//    * ✅ Mobile Static Hero i18n:
//    * - default AR (SSR)
//    * - لو localStorage = en => بدّل النص بعد idle (عشان Lighthouse)
//    */
//   private setupMobileStaticHeroLanguage() {
//     const isMobile = window.matchMedia('(max-width: 768px)').matches;
//     if (!isMobile) return;

//     const saved = (localStorage.getItem('lang') || '').toLowerCase();
//     if (saved !== 'en') return;

//     const run = () => this.applyEnglishToMobileHero();
//     const ric = (window as any).requestIdleCallback;
//     if (typeof ric === 'function') ric(() => run(), { timeout: 3000 });
//     else setTimeout(run, 1800);
//   }

//   private applyEnglishToMobileHero() {
//     const hero = document.getElementById('hero-mobile');
//     if (!hero) return;

//     const title = hero.querySelector('[data-i18n="title"]');
//     const subtitle = hero.querySelector('[data-i18n="subtitle"]');
//     const details = hero.querySelector('[data-i18n="details"]');
//     const btn1 = hero.querySelector('[data-i18n="btn1"]');
//     const btn2 = hero.querySelector('[data-i18n="btn2"]');

//     if (title) title.textContent = 'Manage all your operations in one integrated system';
//     if (subtitle)
//       subtitle.textContent =
//         'Al Motammem ERP for enterprise resource management, backed by 40 years of experience in local and Gulf markets.';
//     if (details)
//       details.textContent =
//         'Financial management - inventory - HR and payroll - reporting - fixed assets management - cash and banks - letters of guarantee - letters of credit - tax integrations, plus many more features tailored to your business.';
//     if (btn1) btn1.textContent = 'Book a free consultation';
//     if (btn2) btn2.textContent = 'Start chat now';

//     hero.setAttribute('dir', 'ltr');
//     hero.classList.add('is-en');
//   }

//   ngOnDestroy(): void {
//     this.sectionsRegistry.clear();
//     this.sectionsRegistry.disable();

//     if (this.isBrowser) {
//       try {
//         window.removeEventListener('resize', this.onResize);
//       } catch { }

//       if (this.observer) this.observer.disconnect();
//       if (this.refreshTimer) clearTimeout(this.refreshTimer);

//       // ✅ remove snap rebuild listeners
//       const rebuild = (this as any)._snapRebuild;
//       if (rebuild) {
//         ScrollTrigger.removeEventListener('refreshInit', rebuild);
//         ScrollTrigger.removeEventListener('refresh', rebuild);
//       }

//       this.ctx?.revert();
//     }
//   }
// }
// export class HomeComponent {
//   private visibilitySubject = new BehaviorSubject<'visible' | 'invisible'>('visible');
//   visibility$ = this.visibilitySubject.asObservable();
//   visibilityState: 'visible' | 'invisible' = 'visible';

//   isMobile!: boolean;
//   isBrowser: boolean;

//   private ctx?: gsap.Context;

//   // ---- Snap system (Desktop only) ----

//   private isSnapping = false;
//   private isRefreshing = false;

//   // لو عندك Navbar ثابتة فوق وبتغطي بداية السكشن جرّب 80
//   private readonly NAV_OFFSET_DESKTOP = 0;

//   // MutationObserver (للـ @defer)
//   private observer?: MutationObserver;
//   private lastHomeHeight = 0;
//   private refreshTimer: any;

//   constructor(
//     @Inject(PLATFORM_ID) private platformId: Object,
//     private ngZone: NgZone,
//     private cdr: ChangeDetectorRef,
//   ) {
//     this.isBrowser = isPlatformBrowser(this.platformId);
//   }

//   ngOnInit() {
//     if (!this.isBrowser) return;
//     this.isMobile = window.matchMedia('(max-width: 768px)').matches;
//   }

//   ngAfterViewInit(): void {
//     if (!this.isBrowser) return;

//     // ✅ Mobile: بدون Snap
//     if (this.isMobile) {
//       setTimeout(() => this.observeSectionsMobile(), 750);
//       return;
//     }

//     this.ngZone.runOutsideAngular(() => {
//       this.waitForSmoother((smoother) => {
//         this.ctx = gsap.context(() => {
//           this.initDesktop(smoother);

//           const s = gsap.utils.toArray<HTMLElement>('#home .panel');

//           // ScrollTrigger.create({
//           //   trigger: '#home',
//           //   scroller: smoother.wrapper(),
//           //   start: 'top top',
//           //   end: 'bottom bottom',
//           //   markers: true,
//           //   snap: {
//           //     // snapTo: "labels",
//           //     snapTo: 1 / (s.length - 1),
//           //     duration: 0.5,
//           //     ease: "power2.out",
//           //   },
//           //   onEnter: () => {
//           //     console.log('home');
//           //   },
//           //   onEnterBack: () => {
//           //     console.log('home');
//           //   },
//           //   onLeaveBack: () => {
//           //     console.log('home');
//           //   }
//           // });
//           ScrollTrigger.create({
//             trigger: '#home',
//             scroller: smoother.wrapper(),
//             start: 'top top',
//             end: 'bottom bottom',
//             markers: true,

//             snap: {
//               snapTo: (_progress: number) => {
//                 // 🛑 لو احنا في refresh أو في snap شغال، سيب الدنيا
//                 if (this.isRefreshing || this.isSnapping) return _progress;

//                 if (!this.snapProgs.length) this.buildSnapPoints(smoother);

//                 const scroller = smoother.wrapper();
//                 const max = ScrollTrigger.maxScroll(scroller) || 1;

//                 // ✅ اعتمد على الـ y الحقيقي
//                 const currentY = smoother.scrollTop();

//                 // أقرب Y من نقاط السناب (بدل snapProgs)
//                 const snappedY = gsap.utils.snap(this.snapY, currentY);

//                 const threshold = (scroller.clientHeight || window.innerHeight) * this.SNAP_ZONE_VH;
//                 const dist = Math.abs(snappedY - currentY);

//                 // لو قريب → رجّع progress المقابل للنقطة
//                 if (dist <= threshold) {
//                   const targetProg = snappedY / max;
//                   return targetProg;
//                 }

//                 // لو مش قريب → مافيش سناب
//                 return currentY / max;
//               },

//               duration: { min: 0.2, max: 0.6 },
//               ease: "power2.out",
//               inertia: true,
//             },


//             onEnter: () => console.log('home'),
//             onEnterBack: () => console.log('home'),
//             onLeaveBack: () => console.log('home'),
//           });

//         });
//       });
//     });
//   }

//   /**
//    * ✅ مهم: Home ممكن يشتغل قبل Layout، فلازم نستنى ScrollSmoother.get()
//    */
//   private waitForSmoother(cb: (s: any) => void) {
//     const start = performance.now();
//     const tick = () => {
//       const s = ScrollSmoother.get() as any;
//       if (s) return cb(s);
//       if (performance.now() - start < 3000) requestAnimationFrame(tick);
//     };
//     tick();
//   }

//   private initDesktop(smoother: any) {
//     const scroller = smoother.wrapper();

//     // 1) Registry للـ section indicator
//     const sections: SectionItem[] = [
//       { id: 'section1-home', labelKey: 'HOME.INDECATORS.ABOUT', wholeSectionId: 'section1-home' },
//       { id: 'section2-home', labelKey: 'HOME.INDECATORS.FACTS', wholeSectionId: 'section2-home' },
//       { id: 'section3-home', labelKey: 'HOME.INDECATORS.WHY', wholeSectionId: 'section3-home' },
//       { id: 'section4-home', labelKey: 'HOME.INDECATORS.APPS', wholeSectionId: 'section4-home' },
//       { id: 'section5-home', labelKey: 'HOME.INDECATORS.TESTIMONIALS', wholeSectionId: 'section5-home' },
//       { id: 'section6-home', labelKey: 'HOME.INDECATORS.INTEGRATIONS', wholeSectionId: 'section6-home' },
//       { id: 'section7-home', labelKey: 'HOME.INDECATORS.PLANS', wholeSectionId: 'section7-home' },
//       { id: 'section8-home', labelKey: 'HOME.INDECATORS.CONTACT', wholeSectionId: 'section8-home' },
//     ];


//     // 2) Navbar colors triggers (مع scroller بتاع smoother)
//     this.observeSections(scroller);


//     // 4) Snap on scrollEnd (أثبت حل مع ScrollSmoother + أطوال مختلفة)
//     // ScrollTrigger.addEventListener('scrollStart', this.onScrollStart);


//     // 5) Observer للـ @defer changes
//     this.initMutationObserver();

//     // 6) Resize
//     window.addEventListener('resize', this.onResize);

//     // أول refresh بعد ما ثبتنا كل حاجة
//     this.safeRefresh();
//     this.buildSnapPoints(smoother);
//     this.attachSnapRebuildListeners();
//   }

//   // private safeRefresh() {
//   //   if (this.isRefreshing) return;

//   //   const smoother = ScrollSmoother.get() as any;
//   //   if (!smoother) return;

//   //   this.isRefreshing = true;


//   //   // refresh
//   //   smoother.refresh();
//   //   ScrollTrigger.refresh();


//   //   this.isRefreshing = false;
//   // }
//   private safeRefresh() {
//     if (this.isRefreshing) return;

//     const smoother = ScrollSmoother.get() as any;
//     if (!smoother) return;

//     this.isRefreshing = true;

//     smoother.refresh();
//     ScrollTrigger.refresh();

//     // ✅ مهم جدًا: بعد أي refresh (خصوصًا مع @defer) لازم نعيد snap points
//     this.buildSnapPoints(smoother);

//     this.isRefreshing = false;
//   }


//   /**
//    * ✅ MutationObserver: لو @defer غيّر ارتفاع الصفحة → نعمل refresh throttled
//    */
//   private initMutationObserver() {
//     const homeEl = document.getElementById('home');
//     if (!homeEl) return;

//     this.lastHomeHeight = homeEl.scrollHeight;

//     this.observer = new MutationObserver(() => {
//       const h = homeEl.scrollHeight;
//       if (Math.abs(h - this.lastHomeHeight) < 5) return; // تجاهل تغييرات بسيطة
//       this.lastHomeHeight = h;

//       if (this.refreshTimer) clearTimeout(this.refreshTimer);
//       this.refreshTimer = setTimeout(() => this.safeRefresh(), 200);
//     });

//     this.observer.observe(homeEl, { childList: true, subtree: true });
//   }

//   // ✅ Desktop Navbar Color Observer
//   private observeSections(scroller: HTMLElement) {
//     const sections = gsap.utils.toArray<HTMLElement>('#home .panel');

//     sections.forEach((section, index) => {
//       const textColor = section.dataset['textcolor'] || 'var(--primary)';
//       const bgColor = section.dataset['bgcolor'] || 'var(--white)';

//       ScrollTrigger.create({
//         trigger: section,
//         scroller,
//         start: 'top 50%',
//         end: 'bottom 50%',
//         onEnter: () => {

//         },
//         onEnterBack: () => {

//         },
//         onLeaveBack: () => {
//           if (index === 0) {
//           }
//         },
//       });
//     });
//   }

//   // ✅ Mobile Navbar Color Observer
//   private observeSectionsMobile() {
//     const sections = gsap.utils.toArray<HTMLElement>('#home .panel');

//     sections.forEach((section, index) => {
//       const textColor = section.dataset['textcolor'] || 'var(--primary)';
//       const bgColor = section.dataset['bgcolor'] || 'var(--white)';

//       ScrollTrigger.create({
//         trigger: section,
//         start: 'top 10%',
//         end: 'bottom 50%',
//         onEnter: () => {

//         },
//         onEnterBack: () => {
//         },
//         onLeaveBack: () => {
//           if (index === 0) {
//           }
//         }
//       });
//     });
//   }

//   private onResize = () => {
//     // refresh بعد resize عشان points تتظبط
//     if (this.refreshTimer) clearTimeout(this.refreshTimer);
//     this.refreshTimer = setTimeout(() => this.safeRefresh(), 120);

//     this.ngZone.run(() => {
//       this.cdr.detectChanges();
//     });
//   };


//   ngOnDestroy(): void {

//     if (this.isBrowser) {
//       try {
//         window.removeEventListener('resize', this.onResize);
//       } catch { }

//       if (this.observer) this.observer.disconnect();
//       if (this.refreshTimer) clearTimeout(this.refreshTimer);
//       const rebuild = (this as any)._snapRebuild;
//       if (rebuild) {
//         ScrollTrigger.removeEventListener('refreshInit', rebuild);
//         ScrollTrigger.removeEventListener('refresh', rebuild);
//       }

//       this.ctx?.revert();
//     }
//   }



//   // ===== SMART SNAP (pixel-based) =====
//   private snapY: number[] = [];          // snap points in PX
//   private snapProgs: number[] = [];      // snap points as progress [0..1]
//   private snapListenersAttached = false;

//   // قد ايه لازم تكون "قريب" من نقطة سناب عشان يسناب
//   private readonly SNAP_ZONE_VH = 0.55;  // 55% من ارتفاع الفيو

//   private buildSnapPoints(smoother: any) {
//     const scroller = smoother.wrapper();
//     const panels = gsap.utils.toArray<HTMLElement>('#home .panel');

//     const vh = scroller?.clientHeight || window.innerHeight;
//     const max = ScrollTrigger.maxScroll(scroller) || 1;

//     const points: number[] = [];

//     panels.forEach((el) => {
//       // 1) snap على بداية السكشن
//       const yTop = el.offsetTop - this.NAV_OFFSET_DESKTOP;

//       points.push(this.clamp(yTop, 0, max));

//       // 2) لو السكشن أطول من الشاشة -> ضيف نقطة سناب داخلية (Tail)
//       // ده مش تقسيم سكشن.. ده مجرد "نقطة سناب" إضافية
//       const h = el.offsetHeight; // px
//       if (h > vh * 1.15) {
//         const tail = yTop + (h - vh); // آخر مكان منطقي لعرض الجزء الأخير من السكشن
//         points.push(this.clamp(tail, 0, max));
//       }
//     });

//     points.sort((a, b) => a - b);

//     // unique (منع نقاط قريبة جدًا)
//     this.snapY = points.filter((v, i, arr) => i === 0 || Math.abs(v - arr[i - 1]) > 2);

//     // حوّلهم لـ progress
//     this.snapProgs = this.snapY.map((y) => y / max);
//   }

//   private clamp(v: number, min: number, max: number) {
//     return Math.max(min, Math.min(max, v));
//   }

//   private attachSnapRebuildListeners() {
//     if (this.snapListenersAttached) return;
//     this.snapListenersAttached = true;

//     const rebuild = () => {
//       const smoother = ScrollSmoother.get() as any;
//       if (smoother) this.buildSnapPoints(smoother);
//     };

//     ScrollTrigger.addEventListener('refreshInit', rebuild);
//     ScrollTrigger.addEventListener('refresh', rebuild);

//     // احتفظ بالمرجع عشان نقدر نشيله في destroy
//     (this as any)._snapRebuild = rebuild;
//   }

// }
// export class HomeComponent implements AfterViewInit, OnDestroy, OnInit {
//   private visibilitySubject = new BehaviorSubject<'visible' | 'invisible'>('visible');
//   visibility$ = this.visibilitySubject.asObservable();
//   visibilityState: 'visible' | 'invisible' = 'visible';

//   isMobile!: boolean;
//   isBrowser: boolean;

//   private ctx?: gsap.Context;

//   // guards
//   private isRefreshing = false;
//   private isRefreshQueued = false;

//   // Navbar offset (لو nav ثابت فوق)
//   private readonly NAV_OFFSET_DESKTOP = 0;

//   // MutationObserver / debounce
//   private observer?: MutationObserver;
//   private lastHomeHeight = 0;
//   private refreshTimer: any;

//   // ✅ snap points (pin-safe)
//   private snapY: number[] = [];
//   private snapListenersAttached = false;
//   private readonly SNAP_ZONE_VH = 0.98;

//   // ✅ color triggers
//   private colorTriggers: ScrollTrigger[] = [];

//   // ✅ snap triggers (REAL top/bottom) — pin-safe
//   private snapTriggers: ScrollTrigger[] = [];

//   // ✅ ResizeObserver + media load capture + fonts listener
//   private resizeObs?: ResizeObserver;
//   private cleanupLoadListener?: () => void;
//   private cleanupFontsListener?: () => void;

//   // ✅ HOME_SNAP ref
//   private homeSnapST?: ScrollTrigger;

//   // ✅ scroll-end detector via onUpdate debounce (بديل scrollEnd)
//   private snapDetectorST?: ScrollTrigger;
//   private snapDelay?: gsap.core.Tween; // delayedCall tween
//   private isSnapping = false;

//   // ✅ snap tween
//   private snapTween?: gsap.core.Tween;

//   // ✅ stop media-load refresh spam
//   private mediaRefreshArmed = true;
//   private mediaRefreshTimer: any;

//   constructor(
//     @Inject(PLATFORM_ID) private platformId: Object,
//     private ngZone: NgZone,
//     private cdr: ChangeDetectorRef,
//     private navTheme: NavbarThemeService,
//     private sectionsRegistry: SectionsRegistryService
//   ) {
//     this.isBrowser = isPlatformBrowser(this.platformId);
//   }

//   ngOnInit() {
//     if (!this.isBrowser) return;
//     this.isMobile = window.matchMedia('(max-width: 768px)').matches;
//   }

//   ngAfterViewInit(): void {
//     if (!this.isBrowser) return;

//     this.setupMobileStaticHeroLanguage();

//     // ✅ Mobile: بدون Snap
//     if (this.isMobile) {
//       setTimeout(() => this.observeSectionsMobile(), 750);
//       return;
//     }

//     this.ngZone.runOutsideAngular(() => {
//       this.waitForSmoother((smoother) => {
//         this.ctx = gsap.context(() => {
//           this.initDesktop(smoother);
//         });
//       });
//     });
//   }

//   private waitForSmoother(cb: (s: any) => void) {
//     const start = performance.now();
//     const tick = () => {
//       const s = ScrollSmoother.get() as any;
//       if (s) return cb(s);
//       if (performance.now() - start < 4500) requestAnimationFrame(tick);
//     };
//     tick();
//   }

//   private initDesktop(smoother: any) {
//     const scroller = smoother.wrapper();

//     // 1) Registry للـ section indicator
//     const sections: SectionItem[] = [
//       { id: 'section1-home', labelKey: 'HOME.INDECATORS.ABOUT', wholeSectionId: 'section1-home' },
//       { id: 'section2-home', labelKey: 'HOME.INDECATORS.FACTS', wholeSectionId: 'section2-home' },
//       { id: 'section3-home', labelKey: 'HOME.INDECATORS.WHY', wholeSectionId: 'section3-home' },
//       { id: 'section4-home', labelKey: 'HOME.INDECATORS.APPS', wholeSectionId: 'section4-home' },
//       { id: 'section5-home', labelKey: 'HOME.INDECATORS.TESTIMONIALS', wholeSectionId: 'section5-home' },
//       { id: 'section6-home', labelKey: 'HOME.INDECATORS.INTEGRATIONS', wholeSectionId: 'section6-home' },
//       { id: 'section7-home', labelKey: 'HOME.INDECATORS.PLANS', wholeSectionId: 'section7-home' },
//       { id: 'section8-home', labelKey: 'HOME.INDECATORS.CONTACT', wholeSectionId: 'section8-home' },
//     ];
//     this.sectionsRegistry.set(sections);
//     this.sectionsRegistry.enable();

//     // 2) Navbar color observers (markers ON)
//     this.observeSectionsDesktopColors(scroller);

//     // 3) ✅ build snap triggers (REAL top/bottom)
//     this.buildSnapTriggers(scroller);

//     // 4) ✅ HOME_SNAP trigger (markers ON) — بدون snap
//     this.homeSnapST?.kill();
//     this.homeSnapST = ScrollTrigger.create({
//       id: 'HOME_SNAP',
//       trigger: '#home',
//       scroller,
//       start: 0,
//       end: () => '+=' + (ScrollTrigger.maxScroll(scroller) || 1),
//       invalidateOnRefresh: true,
//       markers: {
//         startColor: 'red',
//         endColor: 'red',
//         fontSize: '12px',
//         indent: 10,
//       },
//     });

//     // 5) ✅ scrollEnd detector (الثابت)
//     this.attachSnapDetector(smoother);

//     // 6) MutationObserver للـ @defer
//     this.initMutationObserver();

//     // 7) Resize
//     window.addEventListener('resize', this.onResize);

//     // 8) pins inside sections
//     window.removeEventListener('pin-ready', this.onPinReady as any);
//     window.addEventListener('pin-ready', this.onPinReady as any);

//     // observe size/media/fonts
//     this.attachResizeObserver();
//     this.attachMediaLoadListener();
//     this.attachFontsListener();

//     // initial refresh
//     this.safeRefresh();

//     // one-time idle refresh (defer/images/fonts)
//     this.scheduleOneTimeIdleRefresh();

//     // build points + refresh listeners
//     this.buildSnapPointsFromTriggers(smoother);
//     this.attachSnapRebuildListeners();

//     // debug
//     this.debugSnapEnds();
//     this.debugSnapPoints();

//     // ✅ kill snap on user input (wheel/touch/pointer)
//     this.bindUserInputKillSnap(scroller);
//   }

//   // ===================== SNAP DETECTOR (بديل scrollEnd) =====================

//   private attachSnapDetector(smoother: any) {
//     const scroller = smoother.wrapper();

//     this.snapDetectorST?.kill();
//     this.snapDetectorST = ScrollTrigger.create({
//       id: 'SNAP_DETECTOR',
//       scroller,
//       start: 0,
//       end: () => '+=' + (ScrollTrigger.maxScroll(scroller) || 1),
//       invalidateOnRefresh: true,
//       // markers: true,
//       onUpdate: () => {
//         // كل update = user still scrolling -> restart debounce
//         this.queueSnapAfterStop(smoother);
//       },
//     });
//   }

//   private queueSnapAfterStop(smoother: any) {
//     if (this.isRefreshing || this.isRefreshQueued) return;
//     if (this.isSnapping) return;

//     // restart debounce timer
//     this.snapDelay?.kill();
//     this.snapDelay = gsap.delayedCall(0.16, () => {
//       this.performSnap(smoother);
//     });
//   }

//   private performSnap(smoother: any) {
//     if (this.isRefreshing || this.isRefreshQueued) return;

//     if (!this.snapY.length) this.buildSnapPointsFromTriggers(smoother);

//     const scroller = smoother.wrapper();
//     const vh = scroller?.clientHeight || window.innerHeight;

//     const currentY = smoother.scrollTop();
//     const targetY = gsap.utils.snap(this.snapY, currentY);

//     const threshold = vh * this.SNAP_ZONE_VH;
//     if (Math.abs(targetY - currentY) > threshold) return;

//     this.isSnapping = true;

//     // ✅ proxy tween (ScrollSmoother-safe)
//     const proxy = { y: currentY };

//     this.snapTween?.kill();
//     this.snapTween = gsap.to(proxy, {
//       y: targetY,
//       duration: 0.55,
//       ease: 'power2.out',
//       overwrite: true,
//       onUpdate: () => smoother.scrollTo(proxy.y, true),
//       onComplete: () => {
//         smoother.scrollTo(targetY, true);
//         this.isSnapping = false;
//       },
//     });
//   }

//   private bindUserInputKillSnap(scroller: HTMLElement) {
//     const kill = () => {
//       this.snapDelay?.kill();
//       this.snapDelay = undefined;
//       this.snapTween?.kill();
//       this.snapTween = undefined;
//       this.isSnapping = false;
//     };

//     // passive listeners
//     scroller.addEventListener('wheel', kill, { passive: true });
//     scroller.addEventListener('touchstart', kill, { passive: true });
//     scroller.addEventListener('pointerdown', kill, { passive: true });

//     // store cleanup
//     (this as any)._killSnapCleanup = () => {
//       scroller.removeEventListener('wheel', kill as any);
//       scroller.removeEventListener('touchstart', kill as any);
//       scroller.removeEventListener('pointerdown', kill as any);
//     };
//   }

//   // ===================== REFRESH / OBSERVERS =====================

//   private onPinReady = () => {
//     this.scheduleRefresh('pin-ready');
//   };

//   private scheduleRefresh(reason: string) {
//     if (this.isRefreshing || this.isRefreshQueued) return;

//     // ✅ media-load: مرة واحدة كل 2 ثانية كحد أقصى
//     if (reason === 'media-load') {
//       if (!this.mediaRefreshArmed) return;
//       this.mediaRefreshArmed = false;

//       clearTimeout(this.mediaRefreshTimer);
//       this.mediaRefreshTimer = setTimeout(() => {
//         this.mediaRefreshArmed = true;
//       }, 2000);
//     }

//     if (this.refreshTimer) clearTimeout(this.refreshTimer);
//     this.refreshTimer = setTimeout(() => {
//       console.log('[HOME] Refreshing due to:', reason);
//       this.safeRefresh();
//     }, 240);
//   }

//   private scheduleOneTimeIdleRefresh() {
//     const run = () => this.safeRefresh();
//     const ric = (window as any).requestIdleCallback;
//     if (typeof ric === 'function') ric(() => run(), { timeout: 2500 });
//     else setTimeout(run, 1400);
//   }

//   /**
//    * ✅ Two-pass refresh + force update HOME_SNAP end + rebuild snap triggers/points
//    */
//   private safeRefresh() {
//     if (this.isRefreshing) return;

//     const smoother = ScrollSmoother.get() as any;
//     if (!smoother) return;

//     if (this.isRefreshQueued) return;
//     this.isRefreshQueued = true;

//     // stop any snapping during refresh
//     this.snapDelay?.kill();
//     this.snapDelay = undefined;
//     this.snapTween?.kill();
//     this.snapTween = undefined;
//     this.isSnapping = false;

//     const doPass = () => {
//       this.isRefreshing = true;

//       smoother.refresh();
//       ScrollTrigger.refresh(true);
//       ScrollTrigger.update();

//       // kick scrollerProxy
//       const y = smoother.scrollTop();
//       smoother.scrollTop(y);

//       // force end update
//       this.forceUpdateHomeSnapEnd();

//       // rebuild snap triggers + points
//       this.buildSnapTriggers(smoother.wrapper());
//       this.buildSnapPointsFromTriggers(smoother);

//       // make sure detector uses new maxScroll
//       this.attachSnapDetector(smoother);

//       this.isRefreshing = false;
//     };

//     doPass();

//     requestAnimationFrame(() => {
//       const sm = ScrollSmoother.get() as any;
//       if (sm) doPass();

//       this.isRefreshQueued = false;
//       this.debugSnapEnds();
//       this.debugSnapPoints();
//     });
//   }

//   private forceUpdateHomeSnapEnd() {
//     const smoother = ScrollSmoother.get() as any;
//     if (!smoother) return;

//     const scroller = smoother.wrapper();
//     const max = ScrollTrigger.maxScroll(scroller) || 1;

//     const st = this.homeSnapST || (ScrollTrigger.getById('HOME_SNAP') as any);
//     if (!st) return;

//     (st as any).vars.end = '+=' + max;
//     try { (st as any).refresh(); } catch { }
//   }

//   private initMutationObserver() {
//     const homeEl = document.getElementById('home');
//     if (!homeEl) return;

//     this.lastHomeHeight = homeEl.scrollHeight;

//     this.observer = new MutationObserver(() => {
//       const h = homeEl.scrollHeight;
//       if (Math.abs(h - this.lastHomeHeight) < 5) return;
//       this.lastHomeHeight = h;

//       this.scheduleRefresh('mutation');
//     });

//     this.observer.observe(homeEl, { childList: true, subtree: true });
//   }

//   private attachResizeObserver() {
//     if (typeof ResizeObserver === 'undefined') return;

//     this.resizeObs?.disconnect();

//     const content = document.querySelector('#smooth-content') as HTMLElement | null;
//     const wrapper = document.querySelector('#smooth-wrapper') as HTMLElement | null;

//     this.resizeObs = new ResizeObserver(() => {
//       this.scheduleRefresh('resize-observer');
//     });

//     if (content) this.resizeObs.observe(content);
//     if (wrapper) this.resizeObs.observe(wrapper);
//   }

//   private attachMediaLoadListener() {
//     this.cleanupLoadListener?.();
//     this.cleanupLoadListener = undefined;

//     const onLoadCapture = (e: Event) => {
//       const t = e.target as HTMLElement | null;
//       if (!t) return;

//       if (
//         t.tagName === 'IMG' ||
//         t.tagName === 'VIDEO' ||
//         t.tagName === 'IFRAME' ||
//         t.tagName === 'PICTURE' ||
//         t.tagName === 'SOURCE'
//       ) {
//         this.scheduleRefresh('media-load');
//       }
//     };

//     document.addEventListener('load', onLoadCapture, true);

//     this.cleanupLoadListener = () => {
//       document.removeEventListener('load', onLoadCapture, true);
//     };
//   }

//   private attachFontsListener() {
//     this.cleanupFontsListener?.();
//     this.cleanupFontsListener = undefined;

//     const anyDoc = document as any;
//     const fonts: FontFaceSet | undefined = anyDoc.fonts;
//     if (!fonts) return;

//     const onFonts = () => this.scheduleRefresh('fonts');

//     fonts.ready?.then(onFonts).catch(() => { });

//     const done = () => onFonts();
//     try {
//       (fonts as any).addEventListener?.('loadingdone', done);
//       (fonts as any).addEventListener?.('loadingerror', done);
//     } catch { }

//     this.cleanupFontsListener = () => {
//       try {
//         (fonts as any).removeEventListener?.('loadingdone', done);
//         (fonts as any).removeEventListener?.('loadingerror', done);
//       } catch { }
//     };
//   }

//   // ===================== DESKTOP: NAV COLORS (50%) =====================

//   private observeSectionsDesktopColors(scroller: HTMLElement) {
//     this.colorTriggers.forEach(t => t.kill());
//     this.colorTriggers = [];

//     const sections = gsap.utils.toArray<HTMLElement>('#home .panel');

//     sections.forEach((section, index) => {
//       const textColor = section.dataset['textcolor'] || 'var(--primary)';
//       const bgColor = section.dataset['bgcolor'] || 'var(--white)';

//       const t = ScrollTrigger.create({
//         id: `HOME_COLOR_${index + 1}`,
//         trigger: section,
//         scroller,
//         start: 'top 50%',
//         end: 'bottom 50%',
//         invalidateOnRefresh: true,
//         onEnter: () => {
//           this.navTheme.setColor(textColor);
//           this.navTheme.setBg(bgColor);
//         },
//         onEnterBack: () => {
//           this.navTheme.setColor(textColor);
//           this.navTheme.setBg(bgColor);
//         },
//         onLeaveBack: () => {
//           if (index === 0) {
//             this.navTheme.setBg('var(--white)');
//             this.navTheme.setColor('var(--primary)');
//           }
//         },
//       });

//       this.colorTriggers.push(t);
//     });
//   }

//   private observeSectionsMobile() {
//     const sections = gsap.utils.toArray<HTMLElement>('#home .panel');

//     sections.forEach((section, index) => {
//       const textColor = section.dataset['textcolor'] || 'var(--primary)';
//       const bgColor = section.dataset['bgcolor'] || 'var(--white)';

//       ScrollTrigger.create({
//         trigger: section,
//         start: 'top 10%',
//         end: 'bottom 50%',
//         onEnter: () => {
//           this.navTheme.setColor(textColor);
//           this.navTheme.setBg(bgColor);
//         },
//         onEnterBack: () => {
//           this.navTheme.setColor(textColor);
//           this.navTheme.setBg(bgColor);
//         },
//         onLeaveBack: () => {
//           if (index === 0) {
//             this.navTheme.setBg('var(--white)');
//             this.navTheme.setColor('var(--primary)');
//           }
//         },
//       });
//     });
//   }

//   private onResize = () => {
//     this.scheduleRefresh('resize');

//     this.ngZone.run(() => {
//       this.cdr.detectChanges();
//     });
//   };

//   // ===================== SNAP TRIGGERS (REAL TOP/BOTTOM) =====================

//   private buildSnapTriggers(scroller: HTMLElement) {
//     this.snapTriggers.forEach(t => t.kill());
//     this.snapTriggers = [];

//     const panels = gsap.utils.toArray<HTMLElement>('#home .panel');

//     panels.forEach((panel, i) => {
//       const t = ScrollTrigger.create({
//         id: `SNAP_PANEL_${i + 1}`,
//         trigger: panel,
//         scroller,
//         start: 'top top',
//         end: 'bottom bottom',
//         invalidateOnRefresh: true,
//         markers: {
//           startColor: 'green',
//           endColor: 'green',
//           fontSize: '10px',
//           indent: 55,
//         },
//       });
//       this.snapTriggers.push(t);
//     });
//   }

//   // ===================== SNAP POINTS (PIN-SAFE) =====================

//   private buildSnapPointsFromTriggers(smoother: any) {
//     const scroller = smoother.wrapper();
//     const max = ScrollTrigger.maxScroll(scroller) || 1;
//     const vh = scroller?.clientHeight || window.innerHeight;

//     const points: number[] = [];

//     for (const t of this.snapTriggers) {
//       const start = t.start ?? 0;
//       const end = t.end ?? start;

//       const yTop = start - this.NAV_OFFSET_DESKTOP;
//       points.push(this.clamp(yTop, 0, max));

//       // Tail
//       const length = end - start;
//       if (length > vh * 1.15) {
//         const tail = yTop + (length - vh);
//         points.push(this.clamp(tail, 0, max));
//       }
//     }

//     points.sort((a, b) => a - b);
//     this.snapY = points.filter((v, i, arr) => i === 0 || Math.abs(v - arr[i - 1]) > 2);
//   }

//   private attachSnapRebuildListeners() {
//     if (this.snapListenersAttached) return;
//     this.snapListenersAttached = true;

//     const rebuild = () => {
//       const smoother = ScrollSmoother.get() as any;
//       if (!smoother) return;

//       this.buildSnapTriggers(smoother.wrapper());
//       this.buildSnapPointsFromTriggers(smoother);
//       this.attachSnapDetector(smoother);
//     };

//     ScrollTrigger.addEventListener('refreshInit', rebuild);
//     ScrollTrigger.addEventListener('refresh', rebuild);

//     (this as any)._snapRebuild = rebuild;
//   }

//   private clamp(v: number, min: number, max: number) {
//     return Math.max(min, Math.min(max, v));
//   }

//   // ===================== DEBUG =====================

//   private debugSnapEnds() {
//     const smoother = ScrollSmoother.get() as any;
//     if (!smoother) return;

//     const scroller = smoother.wrapper();
//     const max = ScrollTrigger.maxScroll(scroller) || 0;

//     const st = this.homeSnapST || (ScrollTrigger.getById('HOME_SNAP') as any);
//     const end = (st as any)?.end ?? 0;

//     console.log('[HOME_SNAP] maxScroll=', Math.round(max), ' end=', Math.round(end), ' diff=', Math.round(max - end));
//   }

//   private debugSnapPoints() {
//     if (!this.snapY.length) return;
//     console.log('[SNAP_Y]', this.snapY.map(v => Math.round(v)));
//   }

//   // ===================== MOBILE STATIC HERO I18N =====================

//   private setupMobileStaticHeroLanguage() {
//     const isMobile = window.matchMedia('(max-width: 768px)').matches;
//     if (!isMobile) return;

//     const saved = (localStorage.getItem('lang') || '').toLowerCase();
//     if (saved !== 'en') return;

//     const run = () => this.applyEnglishToMobileHero();
//     const ric = (window as any).requestIdleCallback;
//     if (typeof ric === 'function') ric(() => run(), { timeout: 3000 });
//     else setTimeout(run, 1800);
//   }

//   private applyEnglishToMobileHero() {
//     const hero = document.getElementById('hero-mobile');
//     if (!hero) return;

//     const title = hero.querySelector('[data-i18n="title"]');
//     const subtitle = hero.querySelector('[data-i18n="subtitle"]');
//     const details = hero.querySelector('[data-i18n="details"]');
//     const btn1 = hero.querySelector('[data-i18n="btn1"]');
//     const btn2 = hero.querySelector('[data-i18n="btn2"]');

//     if (title) title.textContent = 'Manage all your operations in one integrated system';
//     if (subtitle)
//       subtitle.textContent =
//         'Al Motammem ERP for enterprise resource management, backed by 40 years of experience in local and Gulf markets.';
//     if (details)
//       details.textContent =
//         'Financial management - inventory - HR and payroll - reporting - fixed assets management - cash and banks - letters of guarantee - letters of credit - tax integrations, plus many more features tailored to your business.';
//     if (btn1) btn1.textContent = 'Book a free consultation';
//     if (btn2) btn2.textContent = 'Start chat now';

//     hero.setAttribute('dir', 'ltr');
//     hero.classList.add('is-en');
//   }

//   ngOnDestroy(): void {
//     this.sectionsRegistry.clear();
//     this.sectionsRegistry.disable();

//     if (this.isBrowser) {
//       try {
//         window.removeEventListener('resize', this.onResize);
//       } catch { }

//       window.removeEventListener('pin-ready', this.onPinReady as any);

//       const rebuild = (this as any)._snapRebuild;
//       if (rebuild) {
//         ScrollTrigger.removeEventListener('refreshInit', rebuild);
//         ScrollTrigger.removeEventListener('refresh', rebuild);
//       }

//       this.cleanupLoadListener?.();
//       this.cleanupLoadListener = undefined;

//       this.cleanupFontsListener?.();
//       this.cleanupFontsListener = undefined;

//       this.resizeObs?.disconnect();
//       this.resizeObs = undefined;

//       this.observer?.disconnect();
//       this.observer = undefined;

//       clearTimeout(this.refreshTimer);
//       clearTimeout(this.mediaRefreshTimer);

//       this.colorTriggers.forEach(t => t.kill());
//       this.colorTriggers = [];

//       this.snapTriggers.forEach(t => t.kill());
//       this.snapTriggers = [];

//       this.snapDetectorST?.kill();
//       this.snapDetectorST = undefined;

//       this.homeSnapST?.kill();
//       this.homeSnapST = undefined;

//       this.snapDelay?.kill();
//       this.snapDelay = undefined;

//       this.snapTween?.kill();
//       this.snapTween = undefined;

//       (this as any)._killSnapCleanup?.();
//       (this as any)._killSnapCleanup = undefined;

//       this.ctx?.revert();
//     }
//   }
// }
///
// export class HomeComponent implements AfterViewInit, OnDestroy, OnInit {
//   private visibilitySubject = new BehaviorSubject<'visible' | 'invisible'>('visible');
//   visibility$ = this.visibilitySubject.asObservable();
//   visibilityState: 'visible' | 'invisible' = 'visible';

//   isMobile!: boolean;
//   isBrowser: boolean;

//   private ctx?: gsap.Context;

//   // guards
//   private isRefreshing = false;
//   private isRefreshQueued = false;

//   // Navbar offset (لو nav ثابت فوق)
//   private readonly NAV_OFFSET_DESKTOP = 0;

//   // MutationObserver / debounce
//   private observer?: MutationObserver;
//   private lastHomeHeight = 0;
//   private refreshTimer: any;

//   // ✅ snap points (pin-safe)
//   private snapY: number[] = [];
//   private snapListenersAttached = false;

//   // ✅ منطقة السماح للسناب (أنت عاملها 0.75)
//   private readonly SNAP_ZONE_VH = 0.75;

//   // ✅ NEW: snap behavior tuning
//   private readonly SNAP_ENTER_PCT = 0.02;     // ✅ 2% داخل السكشن
//   private readonly SNAP_MIN_DELTA_PX = 2;     // ✅ تجاهل micro snap
//   private readonly SNAP_CAP_VH = 0.95;        // ✅ cap لمنع الشد بعيد قوي
//   private readonly SNAP_OFFSET_CAP_VH = 0.18; // ✅ cap للـ 2% offset (pinned sections)

//   // ✅ color triggers
//   private colorTriggers: ScrollTrigger[] = [];

//   // ✅ snap triggers (REAL top/bottom) — pin-safe
//   private snapTriggers: ScrollTrigger[] = [];

//   // ✅ ResizeObserver + media load capture + fonts listener
//   private resizeObs?: ResizeObserver;
//   private cleanupLoadListener?: () => void;
//   private cleanupFontsListener?: () => void;

//   // ✅ HOME_SNAP ref
//   private homeSnapST?: ScrollTrigger;

//   // ✅ scroll-end detector via onUpdate debounce (بديل scrollEnd)
//   private snapDetectorST?: ScrollTrigger;
//   private snapDelay?: gsap.core.Tween; // delayedCall tween
//   private isSnapping = false;

//   // ✅ snap tween
//   private snapTween?: gsap.core.Tween;

//   // ✅ stop media-load refresh spam
//   private mediaRefreshArmed = true;
//   private mediaRefreshTimer: any;

//   constructor(
//     @Inject(PLATFORM_ID) private platformId: Object,
//     private ngZone: NgZone,
//     private cdr: ChangeDetectorRef,
//     private navTheme: NavbarThemeService,
//     private sectionsRegistry: SectionsRegistryService
//   ) {
//     this.isBrowser = isPlatformBrowser(this.platformId);
//   }

//   ngOnInit() {
//     if (!this.isBrowser) return;
//     this.isMobile = window.matchMedia('(max-width: 768px)').matches;
//   }

//   ngAfterViewInit(): void {
//     if (!this.isBrowser) return;

//     this.setupMobileStaticHeroLanguage();

//     // ✅ Mobile: بدون Snap
//     if (this.isMobile) {
//       setTimeout(() => this.observeSectionsMobile(), 750);
//       return;
//     }

//     this.ngZone.runOutsideAngular(() => {
//       this.waitForSmoother((smoother) => {
//         this.ctx = gsap.context(() => {
//           this.initDesktop(smoother);
//         });
//       });
//     });
//   }

//   private waitForSmoother(cb: (s: any) => void) {
//     const start = performance.now();
//     const tick = () => {
//       const s = ScrollSmoother.get() as any;
//       if (s) return cb(s);
//       if (performance.now() - start < 4500) requestAnimationFrame(tick);
//     };
//     tick();
//   }

//   private initDesktop(smoother: any) {
//     const scroller = smoother.wrapper();

//     // 1) Registry للـ section indicator
//     const sections: SectionItem[] = [
//       { id: 'section1-home', labelKey: 'HOME.INDECATORS.ABOUT', wholeSectionId: 'section1-home' },
//       { id: 'section2-home', labelKey: 'HOME.INDECATORS.FACTS', wholeSectionId: 'section2-home' },
//       { id: 'section3-home', labelKey: 'HOME.INDECATORS.WHY', wholeSectionId: 'section3-home' },
//       { id: 'section4-home', labelKey: 'HOME.INDECATORS.APPS', wholeSectionId: 'section4-home' },
//       { id: 'section5-home', labelKey: 'HOME.INDECATORS.TESTIMONIALS', wholeSectionId: 'section5-home' },
//       { id: 'section6-home', labelKey: 'HOME.INDECATORS.INTEGRATIONS', wholeSectionId: 'section6-home' },
//       { id: 'section7-home', labelKey: 'HOME.INDECATORS.PLANS', wholeSectionId: 'section7-home' },
//       { id: 'section8-home', labelKey: 'HOME.INDECATORS.CONTACT', wholeSectionId: 'section8-home' },
//     ];
//     this.sectionsRegistry.set(sections);
//     this.sectionsRegistry.enable();

//     // 2) Navbar color observers (markers ON)
//     this.observeSectionsDesktopColors(scroller);

//     // 3) ✅ build snap triggers (REAL top/bottom)
//     this.buildSnapTriggers(scroller);

//     // 4) ✅ HOME_SNAP trigger (markers ON) — بدون snap
//     this.homeSnapST?.kill();
//     this.homeSnapST = ScrollTrigger.create({
//       id: 'HOME_SNAP',
//       trigger: '#home',
//       scroller,
//       start: 0,
//       end: () => '+=' + (ScrollTrigger.maxScroll(scroller) || 1),
//       invalidateOnRefresh: true,
//       markers: {
//         startColor: 'red',
//         endColor: 'red',
//         fontSize: '12px',
//         indent: 10,
//       },
//     });

//     // 5) ✅ scrollEnd detector (الثابت)
//     this.attachSnapDetector(smoother);

//     // 6) MutationObserver للـ @defer
//     this.initMutationObserver();

//     // 7) Resize
//     window.addEventListener('resize', this.onResize);

//     // 8) pins inside sections
//     window.removeEventListener('pin-ready', this.onPinReady as any);
//     window.addEventListener('pin-ready', this.onPinReady as any);

//     // observe size/media/fonts
//     this.attachResizeObserver();
//     this.attachMediaLoadListener();
//     this.attachFontsListener();

//     // initial refresh
//     this.safeRefresh();

//     // one-time idle refresh (defer/images/fonts)
//     this.scheduleOneTimeIdleRefresh();

//     // build points + refresh listeners
//     this.buildSnapPointsFromTriggers(smoother);
//     this.attachSnapRebuildListeners();

//     // debug
//     this.debugSnapEnds();
//     this.debugSnapPoints();

//     // ✅ kill snap on user input (wheel/touch/pointer)
//     this.bindUserInputKillSnap(scroller);
//   }

//   // ===================== SNAP DETECTOR (بديل scrollEnd) =====================

//   private attachSnapDetector(smoother: any) {
//     const scroller = smoother.wrapper();

//     this.snapDetectorST?.kill();
//     this.snapDetectorST = ScrollTrigger.create({
//       id: 'SNAP_DETECTOR',
//       scroller,
//       start: 0,
//       end: () => '+=' + (ScrollTrigger.maxScroll(scroller) || 1),
//       invalidateOnRefresh: true,
//       // markers: true,
//       onUpdate: () => {
//         // كل update = user still scrolling -> restart debounce
//         this.queueSnapAfterStop(smoother);
//       },
//     });
//   }

//   private queueSnapAfterStop(smoother: any) {
//     if (this.isRefreshing || this.isRefreshQueued) return;
//     if (this.isSnapping) return;

//     // restart debounce timer
//     this.snapDelay?.kill();
//     this.snapDelay = gsap.delayedCall(0.16, () => {
//       this.performSnap(smoother);
//     });
//   }

//   // ✅ UPDATED: anti-stuck (micro-snap + cap) + keep your threshold logic
//   // private performSnap(smoother: any) {
//   //   if (this.isRefreshing || this.isRefreshQueued) return;

//   //   if (!this.snapY.length) this.buildSnapPointsFromTriggers(smoother);

//   //   const scroller = smoother.wrapper();
//   //   const vh = scroller?.clientHeight || window.innerHeight;

//   //   const currentY = smoother.scrollTop();
//   //   const targetY = gsap.utils.snap(this.snapY, currentY);

//   //   const delta = targetY - currentY;

//   //   // ✅ 1) تجاهل micro snap
//   //   if (Math.abs(delta) < this.SNAP_MIN_DELTA_PX) return;

//   //   // ✅ 2) شرط القرب (زي ما عندك)
//   //   const threshold = vh * this.SNAP_ZONE_VH;
//   //   if (Math.abs(delta) > threshold) return;

//   //   // ✅ 3) cap إضافي لمنع الشد لمسافة مبالغ فيها
//   //   const cap = vh * this.SNAP_CAP_VH;
//   //   if (Math.abs(delta) > cap) return;

//   //   this.isSnapping = true;

//   //   // ✅ proxy tween (ScrollSmoother-safe)
//   //   const proxy = { y: currentY };

//   //   this.snapTween?.kill();
//   //   this.snapTween = gsap.to(proxy, {
//   //     y: targetY,
//   //     duration: 0.55,
//   //     ease: 'power2.out',
//   //     overwrite: true,
//   //     onUpdate: () => smoother.scrollTo(proxy.y, true),
//   //     onComplete: () => {
//   //       smoother.scrollTo(targetY, true);
//   //       this.isSnapping = false;
//   //     },
//   //   });
//   // }
//   private performSnap(smoother: any) {
//     if (this.isRefreshing || this.isRefreshQueued) return;

//     if (!this.snapY.length) this.buildSnapPointsFromTriggers(smoother);

//     const scroller = smoother.wrapper();
//     const vh = scroller?.clientHeight || window.innerHeight;

//     // ✅ Round يقلل تذبذب الفلوت
//     const currentY = Math.round(smoother.scrollTop());
//     const targetY = gsap.utils.snap(this.snapY, currentY);

//     const delta = targetY - currentY;

//     // ✅ لو قريب جدًا: ثبّت على طول (ده بيحل "بيقف هنا وميسنّبش")
//     if (Math.abs(delta) <= this.SNAP_MIN_DELTA_PX) {
//       smoother.scrollTop(targetY);
//       this.isSnapping = false;
//       return;
//     }

//     // ✅ شرط القرب الأساسي
//     const threshold = vh * this.SNAP_ZONE_VH;
//     if (Math.abs(delta) > threshold) return;

//     // ✅ cap إضافي (انت مخليه 0.95) — سيبه زي ما تحب
//     const cap = vh * this.SNAP_CAP_VH;
//     if (Math.abs(delta) > cap) return;

//     this.isSnapping = true;

//     const proxy = { y: currentY };

//     this.snapTween?.kill();
//     this.snapTween = gsap.to(proxy, {
//       y: targetY,
//       duration: 0.55,
//       ease: 'power2.out',
//       overwrite: true,

//       // ✅ set مباشر (بدون smoother.scrollTo(true) عشان يمنع الفلاش)
//       onUpdate: () => smoother.scrollTop(proxy.y),

//       onComplete: () => {
//         smoother.scrollTop(targetY);
//         this.isSnapping = false;
//       },
//     });
//   }

//   private bindUserInputKillSnap(scroller: HTMLElement) {
//     const kill = () => {
//       this.snapDelay?.kill();
//       this.snapDelay = undefined;
//       this.snapTween?.kill();
//       this.snapTween = undefined;
//       this.isSnapping = false;
//     };

//     // passive listeners
//     scroller.addEventListener('wheel', kill, { passive: true });
//     scroller.addEventListener('touchstart', kill, { passive: true });
//     scroller.addEventListener('pointerdown', kill, { passive: true });

//     // store cleanup
//     (this as any)._killSnapCleanup = () => {
//       scroller.removeEventListener('wheel', kill as any);
//       scroller.removeEventListener('touchstart', kill as any);
//       scroller.removeEventListener('pointerdown', kill as any);
//     };
//   }

//   // ===================== REFRESH / OBSERVERS =====================

//   private onPinReady = () => {
//     this.scheduleRefresh('pin-ready');
//   };

//   private scheduleRefresh(reason: string) {
//     if (this.isRefreshing || this.isRefreshQueued) return;

//     // ✅ media-load: مرة واحدة كل 2 ثانية كحد أقصى
//     if (reason === 'media-load') {
//       if (!this.mediaRefreshArmed) return;
//       this.mediaRefreshArmed = false;

//       clearTimeout(this.mediaRefreshTimer);
//       this.mediaRefreshTimer = setTimeout(() => {
//         this.mediaRefreshArmed = true;
//       }, 2000);
//     }

//     if (this.refreshTimer) clearTimeout(this.refreshTimer);
//     this.refreshTimer = setTimeout(() => {
//       console.log('[HOME] Refreshing due to:', reason);
//       this.safeRefresh();
//     }, 240);
//   }

//   private scheduleOneTimeIdleRefresh() {
//     const run = () => this.safeRefresh();
//     const ric = (window as any).requestIdleCallback;
//     if (typeof ric === 'function') ric(() => run(), { timeout: 2500 });
//     else setTimeout(run, 1400);
//   }

//   /**
//    * ✅ Two-pass refresh + force update HOME_SNAP end + rebuild snap triggers/points
//    */
//   private safeRefresh() {
//     if (this.isRefreshing) return;

//     const smoother = ScrollSmoother.get() as any;
//     if (!smoother) return;

//     if (this.isRefreshQueued) return;
//     this.isRefreshQueued = true;

//     // stop any snapping during refresh
//     this.snapDelay?.kill();
//     this.snapDelay = undefined;
//     this.snapTween?.kill();
//     this.snapTween = undefined;
//     this.isSnapping = false;

//     const doPass = () => {
//       this.isRefreshing = true;

//       smoother.refresh();
//       ScrollTrigger.refresh(true);
//       ScrollTrigger.update();

//       // kick scrollerProxy
//       const y = smoother.scrollTop();
//       smoother.scrollTop(y);

//       // force end update
//       this.forceUpdateHomeSnapEnd();

//       // rebuild snap triggers + points
//       this.buildSnapTriggers(smoother.wrapper());
//       this.buildSnapPointsFromTriggers(smoother);

//       // make sure detector uses new maxScroll
//       this.attachSnapDetector(smoother);

//       this.isRefreshing = false;
//     };

//     doPass();

//     requestAnimationFrame(() => {
//       const sm = ScrollSmoother.get() as any;
//       if (sm) doPass();

//       this.isRefreshQueued = false;
//       this.debugSnapEnds();
//       this.debugSnapPoints();
//     });
//   }

//   private forceUpdateHomeSnapEnd() {
//     const smoother = ScrollSmoother.get() as any;
//     if (!smoother) return;

//     const scroller = smoother.wrapper();
//     const max = ScrollTrigger.maxScroll(scroller) || 1;

//     const st = this.homeSnapST || (ScrollTrigger.getById('HOME_SNAP') as any);
//     if (!st) return;

//     (st as any).vars.end = '+=' + max;
//     try { (st as any).refresh(); } catch { }
//   }

//   private initMutationObserver() {
//     const homeEl = document.getElementById('home');
//     if (!homeEl) return;

//     this.lastHomeHeight = homeEl.scrollHeight;

//     this.observer = new MutationObserver(() => {
//       const h = homeEl.scrollHeight;
//       if (Math.abs(h - this.lastHomeHeight) < 5) return;
//       this.lastHomeHeight = h;

//       this.scheduleRefresh('mutation');
//     });

//     this.observer.observe(homeEl, { childList: true, subtree: true });
//   }

//   private attachResizeObserver() {
//     if (typeof ResizeObserver === 'undefined') return;

//     this.resizeObs?.disconnect();

//     const content = document.querySelector('#smooth-content') as HTMLElement | null;
//     const wrapper = document.querySelector('#smooth-wrapper') as HTMLElement | null;

//     this.resizeObs = new ResizeObserver(() => {
//       this.scheduleRefresh('resize-observer');
//     });

//     if (content) this.resizeObs.observe(content);
//     if (wrapper) this.resizeObs.observe(wrapper);
//   }

//   private attachMediaLoadListener() {
//     this.cleanupLoadListener?.();
//     this.cleanupLoadListener = undefined;

//     const onLoadCapture = (e: Event) => {
//       const t = e.target as HTMLElement | null;
//       if (!t) return;

//       if (
//         t.tagName === 'VIDEO' ||
//         t.tagName === 'IFRAME' ||
//         t.tagName === 'SOURCE'
//       ) {
//         this.scheduleRefresh('media-load');
//       }
//     };

//     document.addEventListener('load', onLoadCapture, true);

//     this.cleanupLoadListener = () => {
//       document.removeEventListener('load', onLoadCapture, true);
//     };
//   }

//   private attachFontsListener() {
//     this.cleanupFontsListener?.();
//     this.cleanupFontsListener = undefined;

//     const anyDoc = document as any;
//     const fonts: FontFaceSet | undefined = anyDoc.fonts;
//     if (!fonts) return;

//     const onFonts = () => this.scheduleRefresh('fonts');

//     fonts.ready?.then(onFonts).catch(() => { });

//     const done = () => onFonts();
//     try {
//       (fonts as any).addEventListener?.('loadingdone', done);
//       (fonts as any).addEventListener?.('loadingerror', done);
//     } catch { }

//     this.cleanupFontsListener = () => {
//       try {
//         (fonts as any).removeEventListener?.('loadingdone', done);
//         (fonts as any).removeEventListener?.('loadingerror', done);
//       } catch { }
//     };
//   }

//   // ===================== DESKTOP: NAV COLORS (50%) =====================

//   private observeSectionsDesktopColors(scroller: HTMLElement) {
//     this.colorTriggers.forEach(t => t.kill());
//     this.colorTriggers = [];

//     const sections = gsap.utils.toArray<HTMLElement>('#home .panel');

//     sections.forEach((section, index) => {
//       const textColor = section.dataset['textcolor'] || 'var(--primary)';
//       const bgColor = section.dataset['bgcolor'] || 'var(--white)';

//       const t = ScrollTrigger.create({
//         id: `HOME_COLOR_${index + 1}`,
//         trigger: section,
//         scroller,
//         start: 'top 50%',
//         end: 'bottom 50%',
//         invalidateOnRefresh: true,
//         onEnter: () => {
//           this.navTheme.setColor(textColor);
//           this.navTheme.setBg(bgColor);
//         },
//         onEnterBack: () => {
//           this.navTheme.setColor(textColor);
//           this.navTheme.setBg(bgColor);
//         },
//         onLeaveBack: () => {
//           if (index === 0) {
//             this.navTheme.setBg('var(--white)');
//             this.navTheme.setColor('var(--primary)');
//           }
//         },
//       });

//       this.colorTriggers.push(t);
//     });
//   }

//   private observeSectionsMobile() {
//     const sections = gsap.utils.toArray<HTMLElement>('#home .panel');

//     sections.forEach((section, index) => {
//       const textColor = section.dataset['textcolor'] || 'var(--primary)';
//       const bgColor = section.dataset['bgcolor'] || 'var(--white)';

//       ScrollTrigger.create({
//         trigger: section,
//         start: 'top 10%',
//         end: 'bottom 50%',
//         onEnter: () => {
//           this.navTheme.setColor(textColor);
//           this.navTheme.setBg(bgColor);
//         },
//         onEnterBack: () => {
//           this.navTheme.setColor(textColor);
//           this.navTheme.setBg(bgColor);
//         },
//         onLeaveBack: () => {
//           if (index === 0) {
//             this.navTheme.setBg('var(--white)');
//             this.navTheme.setColor('var(--primary)');
//           }
//         },
//       });
//     });
//   }

//   private onResize = () => {
//     this.scheduleRefresh('resize');

//     this.ngZone.run(() => {
//       this.cdr.detectChanges();
//     });
//   };

//   // ===================== SNAP TRIGGERS (REAL TOP/BOTTOM) =====================

//   private buildSnapTriggers(scroller: HTMLElement) {
//     this.snapTriggers.forEach(t => t.kill());
//     this.snapTriggers = [];

//     const panels = gsap.utils.toArray<HTMLElement>('#home .panel');

//     panels.forEach((panel, i) => {
//       const t = ScrollTrigger.create({
//         id: `SNAP_PANEL_${i + 1}`,
//         trigger: panel,
//         scroller,
//         start: 'top top',
//         end: 'bottom bottom',
//         invalidateOnRefresh: true,
//         markers: {
//           startColor: 'green',
//           endColor: 'green',
//           fontSize: '10px',
//           indent: 55, // ✅ للـ markers فقط (تزحزح العلامات)
//         },
//       });
//       this.snapTriggers.push(t);
//     });
//   }

//   // ===================== SNAP POINTS (PIN-SAFE) =====================

//   // ✅ UPDATED: snap to 2% inside the section (pin-safe) + cap for pinned sections
//   private buildSnapPointsFromTriggers(smoother: any) {
//     const scroller = smoother.wrapper();
//     const max = ScrollTrigger.maxScroll(scroller) || 1;
//     const vh = scroller?.clientHeight || window.innerHeight;

//     const points: number[] = [];

//     for (const t of this.snapTriggers) {
//       const start = t.start ?? 0;
//       const end = t.end ?? start;

//       const length = end - start;

//       // ✅ 2% داخل السكشن (مع cap علشان pinned sections)
//       const rawOffset = length * this.SNAP_ENTER_PCT;
//       const offsetCap = vh * this.SNAP_OFFSET_CAP_VH;
//       const offset = Math.min(rawOffset, offsetCap);

//       // ✅ بدل top بالظبط: ادخل 2% (أو أقل حسب cap)
//       const yEnter = (start - this.NAV_OFFSET_DESKTOP) + offset;
//       points.push(this.clamp(yEnter, 0, max));

//       // Tail
//       if (length > vh * 1.15) {
//         const tail = (start - this.NAV_OFFSET_DESKTOP) + (length - vh) + offset;
//         points.push(this.clamp(tail, 0, max));
//       }
//     }

//     points.sort((a, b) => a - b);

//     // ✅ Round + dedupe أقوى
//     const rounded = points.map(v => Math.round(v));
//     this.snapY = rounded.filter((v, i, arr) => i === 0 || Math.abs(v - arr[i - 1]) > 8);

//   }

//   private attachSnapRebuildListeners() {
//     if (this.snapListenersAttached) return;
//     this.snapListenersAttached = true;

//     const rebuild = () => {
//       const smoother = ScrollSmoother.get() as any;
//       if (!smoother) return;

//       this.buildSnapTriggers(smoother.wrapper());
//       this.buildSnapPointsFromTriggers(smoother);
//       this.attachSnapDetector(smoother);
//     };

//     ScrollTrigger.addEventListener('refreshInit', rebuild);
//     ScrollTrigger.addEventListener('refresh', rebuild);

//     (this as any)._snapRebuild = rebuild;
//   }

//   private clamp(v: number, min: number, max: number) {
//     return Math.max(min, Math.min(max, v));
//   }

//   // ===================== DEBUG =====================

//   private debugSnapEnds() {
//     const smoother = ScrollSmoother.get() as any;
//     if (!smoother) return;

//     const scroller = smoother.wrapper();
//     const max = ScrollTrigger.maxScroll(scroller) || 0;

//     const st = this.homeSnapST || (ScrollTrigger.getById('HOME_SNAP') as any);
//     const end = (st as any)?.end ?? 0;

//     console.log('[HOME_SNAP] maxScroll=', Math.round(max), ' end=', Math.round(end), ' diff=', Math.round(max - end));
//   }

//   private debugSnapPoints() {
//     if (!this.snapY.length) return;
//     console.log('[SNAP_Y]', this.snapY.map(v => Math.round(v)));
//   }

//   // ===================== MOBILE STATIC HERO I18N =====================

//   private setupMobileStaticHeroLanguage() {
//     const isMobile = window.matchMedia('(max-width: 768px)').matches;
//     if (!isMobile) return;

//     const saved = (localStorage.getItem('lang') || '').toLowerCase();
//     if (saved !== 'en') return;

//     const run = () => this.applyEnglishToMobileHero();
//     const ric = (window as any).requestIdleCallback;
//     if (typeof ric === 'function') ric(() => run(), { timeout: 3000 });
//     else setTimeout(run, 1800);
//   }

//   private applyEnglishToMobileHero() {
//     const hero = document.getElementById('hero-mobile');
//     if (!hero) return;

//     const title = hero.querySelector('[data-i18n="title"]');
//     const subtitle = hero.querySelector('[data-i18n="subtitle"]');
//     const details = hero.querySelector('[data-i18n="details"]');
//     const btn1 = hero.querySelector('[data-i18n="btn1"]');
//     const btn2 = hero.querySelector('[data-i18n="btn2"]');

//     if (title) title.textContent = 'Manage all your operations in one integrated system';
//     if (subtitle)
//       subtitle.textContent =
//         'Al Motammem ERP for enterprise resource management, backed by 40 years of experience in local and Gulf markets.';
//     if (details)
//       details.textContent =
//         'Financial management - inventory - HR and payroll - reporting - fixed assets management - cash and banks - letters of guarantee - letters of credit - tax integrations, plus many more features tailored to your business.';
//     if (btn1) btn1.textContent = 'Book a free consultation';
//     if (btn2) btn2.textContent = 'Start chat now';

//     hero.setAttribute('dir', 'ltr');
//     hero.classList.add('is-en');
//   }

//   ngOnDestroy(): void {
//     this.sectionsRegistry.clear();
//     this.sectionsRegistry.disable();

//     if (this.isBrowser) {
//       try {
//         window.removeEventListener('resize', this.onResize);
//       } catch { }

//       window.removeEventListener('pin-ready', this.onPinReady as any);

//       const rebuild = (this as any)._snapRebuild;
//       if (rebuild) {
//         ScrollTrigger.removeEventListener('refreshInit', rebuild);
//         ScrollTrigger.removeEventListener('refresh', rebuild);
//       }

//       this.cleanupLoadListener?.();
//       this.cleanupLoadListener = undefined;

//       this.cleanupFontsListener?.();
//       this.cleanupFontsListener = undefined;

//       this.resizeObs?.disconnect();
//       this.resizeObs = undefined;

//       this.observer?.disconnect();
//       this.observer = undefined;

//       clearTimeout(this.refreshTimer);
//       clearTimeout(this.mediaRefreshTimer);

//       this.colorTriggers.forEach(t => t.kill());
//       this.colorTriggers = [];

//       this.snapTriggers.forEach(t => t.kill());
//       this.snapTriggers = [];

//       this.snapDetectorST?.kill();
//       this.snapDetectorST = undefined;

//       this.homeSnapST?.kill();
//       this.homeSnapST = undefined;

//       this.snapDelay?.kill();
//       this.snapDelay = undefined;

//       this.snapTween?.kill();
//       this.snapTween = undefined;

//       (this as any)._killSnapCleanup?.();
//       (this as any)._killSnapCleanup = undefined;

//       this.ctx?.revert();
//     }
//   }
// }

import {
  Component,
  Inject,
  PLATFORM_ID,
  AfterViewInit,
  NgZone,
  ChangeDetectorRef,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollSmoother from 'gsap/ScrollSmoother';

import { Section1Component } from './section1/section1.component';
import { Section2Component } from './section2/section2.component';
import { Section3Component } from './section3/section3.component';
import { Section4Component } from './section4/section4.component';
import { Section5Component } from './section5/section5.component';
import { Section6Component } from './section6/section6.component';
import { Section7Component } from './section7/section7.component';
import { Section8Component } from './section8/section8.component';

import { BehaviorSubject } from 'rxjs';
import { NavbarThemeService } from '../../components/navbar/navbar-theme.service';
import { SectionItem, SectionsRegistryService } from '../../shared/services/sections-registry.service';
import { OpenFormDialogDirective } from '../../shared/Directives/open-form-dialog.directive';
import { Router } from '@angular/router';
import { SeoLinkService } from '../../services/seo-link.service';
import { NavigationStart } from '@angular/router';
import { filter, Subscription } from 'rxjs';
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    Section1Component,
    Section2Component,
    Section3Component,
    Section4Component,
    Section5Component,
    Section6Component,
    Section7Component,
    Section8Component,
    OpenFormDialogDirective,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit, OnDestroy, OnInit {
  private routerSub?: Subscription;

  private teardownHomeSnap() {
    // 1) وقف أي snapping حالياً
    this.snapTween?.kill();
    this.snapTween = undefined;
    this.isSnapping = false;

    // 2) وقف idle detector (RAF + scroll listener)
    this.idleCleanup?.();
    this.idleCleanup = undefined;

    // safety: لو فيه RAF متسجل
    if (this.idleRaf) cancelAnimationFrame(this.idleRaf);
    this.idleRaf = undefined;

    // 3) شيل killSnap listeners (wheel/touch/pointer)
    (this as any)._killSnapCleanup?.();
    (this as any)._killSnapCleanup = undefined;

    // 4) شيل window listeners
    try { window.removeEventListener('resize', this.onResize); } catch { }
    window.removeEventListener('pin-ready', this.onPinReady as any);

    // 5) Kill ScrollTriggers الخاصة بالهوم فقط (بالـ ids / arrays)
    this.colorTriggers.forEach(t => t.kill());
    this.colorTriggers = [];

    this.snapTriggers.forEach(t => t.kill());
    this.snapTriggers = [];

    this.homeSnapST?.kill();
    this.homeSnapST = undefined;

    // 6) شيل refresh listeners اللي انتِ ضيفاها
    const rebuild = (this as any)._snapRebuild;
    if (rebuild) {
      ScrollTrigger.removeEventListener('refreshInit', rebuild);
      ScrollTrigger.removeEventListener('refresh', rebuild);
    }

    // 7) اقفلي observers
    this.cleanupLoadListener?.(); this.cleanupLoadListener = undefined;
    this.cleanupFontsListener?.(); this.cleanupFontsListener = undefined;

    this.resizeObs?.disconnect(); this.resizeObs = undefined;
    this.observer?.disconnect(); this.observer = undefined;

    clearTimeout(this.refreshTimer);
    clearTimeout(this.mediaRefreshTimer);

    // 8) ✅ أهم سطرين في حالتك (عشان السناب مايكملش على صفحات تانية)
    this.snapY = [];
    this.snapListenersAttached = false;

    // 9) Context revert (لو فيه animations/triggers اتعملت داخل ctx)
    this.ctx?.revert();
    this.ctx = undefined;

    // 10) تحديث GSAP state
    try { ScrollTrigger.refresh(true); } catch { }
  }
  private exposeGlobalCleanup() {
    (window as any).__HOME_SNAP_CLEANUP__ = () => {
      try {
        // نفس اللي بتعمليه في ngOnDestroy بس مركّز على السناب
        this.snapTween?.kill();
        this.snapTween = undefined;
        this.isSnapping = false;

        this.idleCleanup?.();
        this.idleCleanup = undefined;

        if (this.idleRaf) cancelAnimationFrame(this.idleRaf);
        this.idleRaf = undefined;

        (this as any)._killSnapCleanup?.();
        (this as any)._killSnapCleanup = undefined;

        // kill triggers اللي انتي عاملاها في الهوم فقط
        this.colorTriggers.forEach(t => t.kill());
        this.colorTriggers = [];

        this.snapTriggers.forEach(t => t.kill());
        this.snapTriggers = [];

        this.homeSnapST?.kill();
        this.homeSnapST = undefined;

        // remove refresh listeners
        const rebuild = (this as any)._snapRebuild;
        if (rebuild) {
          ScrollTrigger.removeEventListener('refreshInit', rebuild);
          ScrollTrigger.removeEventListener('refresh', rebuild);
        }

        // صفري نقاط السناب
        this.snapY = [];
        this.snapListenersAttached = false;

        // مهم: ctx revert (لو فيه حاجات جوّاه)
        this.ctx?.revert();
        this.ctx = undefined;

        // Update
        ScrollTrigger.update();
      } catch { }
    };
  }

  private visibilitySubject = new BehaviorSubject<'visible' | 'invisible'>('visible');
  visibility$ = this.visibilitySubject.asObservable();
  visibilityState: 'visible' | 'invisible' = 'visible';

  isMobile!: boolean;
  isBrowser: boolean;

  private ctx?: gsap.Context;

  // guards
  private isRefreshing = false;
  private isRefreshQueued = false;

  // Navbar offset (لو nav ثابت فوق)
  private readonly NAV_OFFSET_DESKTOP = 0;

  // MutationObserver / debounce
  private observer?: MutationObserver;
  private lastHomeHeight = 0;
  private refreshTimer: any;

  // ✅ snap points (pin-safe)
  private snapY: number[] = [];
  private snapListenersAttached = false;

  // ✅ منطقة السماح للسناب
  private readonly SNAP_ZONE_VH = 0.75;

  // ✅ snap behavior tuning
  private readonly SNAP_ENTER_PCT = 0.02;     // ✅ 2% داخل السكشن
  private readonly SNAP_MIN_DELTA_PX = 2;     // ✅ تجاهل micro snap
  private readonly SNAP_CAP_VH = 0.95;        // ✅ cap لمنع الشد بعيد قوي
  private readonly SNAP_OFFSET_CAP_VH = 0.18; // ✅ cap للـ 2% offset (pinned sections)

  // ✅ color triggers
  private colorTriggers: ScrollTrigger[] = [];

  // ✅ snap triggers (REAL top/bottom) — pin-safe
  private snapTriggers: ScrollTrigger[] = [];

  // ✅ ResizeObserver + media load capture + fonts listener
  private resizeObs?: ResizeObserver;
  private cleanupLoadListener?: () => void;
  private cleanupFontsListener?: () => void;

  // ✅ HOME_SNAP ref
  private homeSnapST?: ScrollTrigger;

  // ✅ snap tween
  private snapTween?: gsap.core.Tween;
  private isSnapping = false;

  // ✅ stop media-load refresh spam
  private mediaRefreshArmed = true;
  private mediaRefreshTimer: any;

  // ✅ Idle detector (بديل tick + onUpdate debounce)
  private idleRaf?: number;
  private lastIdleY = 0;
  private stillFrames = 0;
  private idleCleanup?: () => void;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private navTheme: NavbarThemeService,
    public sectionsRegistry: SectionsRegistryService,
    private router: Router,
    private seoLinks: SeoLinkService,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    const siteName = 'Al-Motammem';
    const pageTitle = "Al-Motammem ERP | نظام المتمم لإدارة المؤسسات";
    const desc = "نظام ERP متكامل لتطوير الشركات منذ 40 عامًا - المتمم.";
    const image = 'https://almotammem.com/images/Icon.webp';

    const url =
      (typeof window !== 'undefined' && window.location?.href)
        ? window.location.href
        : `https://almotammem.com/`;
    this.seoLinks.setSocialMeta({ title: pageTitle, desc, image, url, type: 'website' });
    this.seoLinks.setCanonical(url);
    if (!this.isBrowser) return;
    this.isMobile = window.matchMedia('(max-width: 768px)').matches;
  }
  private isHomeRoute() {
    const url = this.router.url.split('?')[0].split('#')[0];
    return url === '/' || url === '/home';
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    if (!this.isHomeRoute()) return;
    this.routerSub?.unsubscribe();
    this.routerSub = this.router.events
      .pipe(filter(e => e instanceof NavigationStart))
      .subscribe((e: any) => {
        // لو خارج من الهوم لأي route تاني
        const nextUrl = (e.url || '').split('?')[0].split('#')[0];
        if (this.isHomeRoute() && nextUrl !== '/' && nextUrl !== '/home') {
          this.teardownHomeSnap();
        }
      });

    this.setupMobileStaticHeroLanguage();

    // ✅ Mobile: بدون Snap
    if (this.isMobile) {
      setTimeout(() => this.observeSectionsMobile(), 750);
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      this.waitForSmoother((smoother) => {
        this.ctx = gsap.context(() => {
          this.initDesktop(smoother);
          this.exposeGlobalCleanup();

        });
      });
    });
  }

  private waitForSmoother(cb: (s: any) => void) {
    const start = performance.now();
    const tick = () => {
      const s = ScrollSmoother.get() as any;
      if (s) return cb(s);
      if (performance.now() - start < 4500) requestAnimationFrame(tick);
    };
    tick();
  }

  private initDesktop(smoother: any) {
    const scroller = smoother.wrapper();

    // 1) Registry للـ section indicator
    const sections: SectionItem[] = [
      { id: 'section1-home', labelKey: 'HOME.INDECATORS.ABOUT', wholeSectionId: 'section1-home' },
      { id: 'section2-home', labelKey: 'HOME.INDECATORS.FACTS', wholeSectionId: 'section2-home' },
      { id: 'section3-home', labelKey: 'HOME.INDECATORS.WHY', wholeSectionId: 'section3-home' },
      { id: 'section4-home', labelKey: 'HOME.INDECATORS.APPS', wholeSectionId: 'section4-home' },
      { id: 'section5-home', labelKey: 'HOME.INDECATORS.TESTIMONIALS', wholeSectionId: 'section5-home' },
      { id: 'section6-home', labelKey: 'HOME.INDECATORS.INTEGRATIONS', wholeSectionId: 'section6-home' },
      { id: 'section7-home', labelKey: 'HOME.INDECATORS.PLANS', wholeSectionId: 'section7-home' },
      { id: 'section8-home', labelKey: 'HOME.INDECATORS.CONTACT', wholeSectionId: 'section8-home' },
    ];
    this.sectionsRegistry.set(sections);
    this.sectionsRegistry.enable();

    // 2) Navbar color observers
    this.observeSectionsDesktopColors(scroller);

    // 3) ✅ build snap triggers
    this.buildSnapTriggers(scroller);

    // 4) ✅ HOME_SNAP trigger
    this.homeSnapST?.kill();
    this.homeSnapST = ScrollTrigger.create({
      id: 'HOME_SNAP',
      trigger: '#home',
      scroller,
      start: 0,
      end: () => '+=' + (ScrollTrigger.maxScroll(scroller) || 1),
      invalidateOnRefresh: true,
      // markers: {
      //   startColor: 'red',
      //   endColor: 'red',
      //   fontSize: '12px',
      //   indent: 10,
      // },
    });

    // 5) ✅ idle detector (بديل onUpdate/tick)
    this.attachSnapDetector(smoother);

    // 6) MutationObserver للـ @defer
    this.initMutationObserver();

    // 7) Resize
    window.addEventListener('resize', this.onResize);

    // 8) pins inside sections
    window.removeEventListener('pin-ready', this.onPinReady as any);
    window.addEventListener('pin-ready', this.onPinReady as any);

    // observe size/media/fonts
    this.attachResizeObserver();
    this.attachMediaLoadListener();
    this.attachFontsListener();

    // initial refresh
    this.safeRefresh();

    // one-time idle refresh (defer/images/fonts)
    this.scheduleOneTimeIdleRefresh();

    // build points + refresh listeners
    this.buildSnapPointsFromTriggers(smoother);
    this.attachSnapRebuildListeners();

    // debug
    this.debugSnapEnds();
    this.debugSnapPoints();

    // ✅ kill snap on user input (wheel/touch/pointer)
    this.bindUserInputKillSnap(scroller);
  }

  // ===================== SNAP DETECTOR (Idle: scroll + RAF) =====================

  private attachSnapDetector(smoother: any) {
    const scroller = smoother.wrapper();

    // cleanup old
    this.idleCleanup?.();
    this.idleCleanup = undefined;

    if (this.idleRaf) cancelAnimationFrame(this.idleRaf);
    this.idleRaf = undefined;

    this.lastIdleY = Math.round(smoother.scrollTop());
    this.stillFrames = 0;

    const runIdleLoop = () => {
      if (this.isRefreshing || this.isRefreshQueued || this.isSnapping) {
        this.stillFrames = 0;
        this.lastIdleY = Math.round(smoother.scrollTop());
        this.idleRaf = requestAnimationFrame(runIdleLoop);
        return;
      }

      const y = Math.round(smoother.scrollTop());
      const dy = Math.abs(y - this.lastIdleY);

      if (dy === 0) this.stillFrames++;
      else this.stillFrames = 0;

      this.lastIdleY = y;

      // ✅ بعد ~8 فريم ثابتين نفّذ snap
      if (this.stillFrames >= 8) {
        this.stillFrames = 0;
        this.performSnap(smoother);
      }

      this.idleRaf = requestAnimationFrame(runIdleLoop);
    };

    const onScroll = () => {
      // أي scroll جديد = reset
      this.stillFrames = 0;
      this.lastIdleY = Math.round(smoother.scrollTop());

      // شغّل الـ loop لو كان متوقف
      if (!this.idleRaf) this.idleRaf = requestAnimationFrame(runIdleLoop);
    };

    // شغّل من البداية
    this.idleRaf = requestAnimationFrame(runIdleLoop);

    // اسمع scroll الحقيقي
    scroller.addEventListener('scroll', onScroll, { passive: true });

    this.idleCleanup = () => {
      scroller.removeEventListener('scroll', onScroll as any);
      if (this.idleRaf) cancelAnimationFrame(this.idleRaf);
      this.idleRaf = undefined;
    };
  }

  // ===================== SNAP =====================

  private performSnap(smoother: any) {
    if (this.isRefreshing || this.isRefreshQueued) return;

    if (!this.snapY.length) this.buildSnapPointsFromTriggers(smoother);

    const scroller = smoother.wrapper();
    const vh = scroller?.clientHeight || window.innerHeight;

    const currentY = Math.round(smoother.scrollTop());
    const targetY = gsap.utils.snap(this.snapY, currentY);

    const delta = targetY - currentY;

    // ✅ لو قريب جدًا: ثبّت فورًا
    if (Math.abs(delta) <= this.SNAP_MIN_DELTA_PX) {
      smoother.scrollTop(targetY);
      ScrollTrigger.update();
      this.isSnapping = false;
      return;
    }

    // ✅ شرط القرب
    const threshold = vh * this.SNAP_ZONE_VH;
    if (Math.abs(delta) > threshold) return;

    // ✅ cap إضافي
    const cap = vh * this.SNAP_CAP_VH;
    if (Math.abs(delta) > cap) return;

    this.isSnapping = true;

    const proxy = { y: currentY };
    const distance = Math.abs(delta);

    // ✅ duration ذكي حسب المسافة (ناعم)
    const dur = gsap.utils.clamp(
      0.25,                          // أقل مدة
      0.85,                          // أقصى مدة
      distance / (vh * 1.2)          // scale حسب vh
    );
    this.snapTween?.kill();
    this.snapTween = gsap.to(proxy, {
      y: targetY,
      duration: dur,
      ease: 'power2.out',
      overwrite: true,
      onUpdate: () => smoother.scrollTop(proxy.y),
      onComplete: () => {
        smoother.scrollTop(targetY);
        ScrollTrigger.update();
        this.isSnapping = false;
      },
    });
  }

  private bindUserInputKillSnap(scroller: HTMLElement) {
    const kill = () => {
      this.snapTween?.kill();
      this.snapTween = undefined;
      this.isSnapping = false;

      // ✅ reset idle detector window
      this.stillFrames = 0;
      const sm = ScrollSmoother.get() as any;
      if (sm) this.lastIdleY = Math.round(sm.scrollTop());
    };

    scroller.addEventListener('wheel', kill, { passive: true });
    scroller.addEventListener('touchstart', kill, { passive: true });
    scroller.addEventListener('pointerdown', kill, { passive: true });

    (this as any)._killSnapCleanup = () => {
      scroller.removeEventListener('wheel', kill as any);
      scroller.removeEventListener('touchstart', kill as any);
      scroller.removeEventListener('pointerdown', kill as any);
    };
  }

  // ===================== REFRESH / OBSERVERS =====================

  private onPinReady = () => {
    this.scheduleRefresh('pin-ready');
  };

  private scheduleRefresh(reason: string) {
    if (this.isRefreshing || this.isRefreshQueued) return;

    // ✅ media-load: مرة واحدة كل 2 ثانية كحد أقصى
    if (reason === 'media-load') {
      if (!this.mediaRefreshArmed) return;
      this.mediaRefreshArmed = false;

      clearTimeout(this.mediaRefreshTimer);
      this.mediaRefreshTimer = setTimeout(() => {
        this.mediaRefreshArmed = true;
      }, 2000);
    }

    if (this.refreshTimer) clearTimeout(this.refreshTimer);
    this.refreshTimer = setTimeout(() => {
      console.log('[HOME] Refreshing due to:', reason);
      this.safeRefresh();
    }, 240);
  }

  private scheduleOneTimeIdleRefresh() {
    const run = () => this.safeRefresh();
    const ric = (window as any).requestIdleCallback;
    if (typeof ric === 'function') ric(() => run(), { timeout: 2500 });
    else setTimeout(run, 1400);
  }

  private safeRefresh() {
    if (this.isRefreshing) return;

    const smoother = ScrollSmoother.get() as any;
    if (!smoother) return;

    if (this.isRefreshQueued) return;
    this.isRefreshQueued = true;

    // stop any snapping during refresh
    this.snapTween?.kill();
    this.snapTween = undefined;
    this.isSnapping = false;

    // reset idle detector
    this.stillFrames = 0;

    const doPass = () => {
      this.isRefreshing = true;

      smoother.refresh();
      ScrollTrigger.refresh(true);
      ScrollTrigger.update();

      // kick scrollerProxy
      const y = smoother.scrollTop();
      smoother.scrollTop(y);

      // force end update
      this.forceUpdateHomeSnapEnd();

      // rebuild snap triggers + points
      this.buildSnapTriggers(smoother.wrapper());
      this.buildSnapPointsFromTriggers(smoother);

      // rebuild detector (refresh resets)
      this.attachSnapDetector(smoother);

      this.isRefreshing = false;
    };

    doPass();

    requestAnimationFrame(() => {
      const sm = ScrollSmoother.get() as any;
      if (sm) doPass();

      this.isRefreshQueued = false;
      this.debugSnapEnds();
      this.debugSnapPoints();
    });
  }

  private forceUpdateHomeSnapEnd() {
    const smoother = ScrollSmoother.get() as any;
    if (!smoother) return;

    const scroller = smoother.wrapper();
    const max = ScrollTrigger.maxScroll(scroller) || 1;

    const st = this.homeSnapST || (ScrollTrigger.getById('HOME_SNAP') as any);
    if (!st) return;

    (st as any).vars.end = '+=' + max;
    try { (st as any).refresh(); } catch { }
  }

  private initMutationObserver() {
    const homeEl = document.getElementById('home');
    if (!homeEl) return;

    this.lastHomeHeight = homeEl.scrollHeight;

    this.observer = new MutationObserver(() => {
      const h = homeEl.scrollHeight;
      if (Math.abs(h - this.lastHomeHeight) < 5) return;
      this.lastHomeHeight = h;

      this.scheduleRefresh('mutation');
    });

    this.observer.observe(homeEl, { childList: true, subtree: true });
  }

  private attachResizeObserver() {
    if (typeof ResizeObserver === 'undefined') return;

    this.resizeObs?.disconnect();

    const content = document.querySelector('#smooth-content') as HTMLElement | null;
    const wrapper = document.querySelector('#smooth-wrapper') as HTMLElement | null;

    this.resizeObs = new ResizeObserver(() => {
      this.scheduleRefresh('resize-observer');
    });

    if (content) this.resizeObs.observe(content);
    if (wrapper) this.resizeObs.observe(wrapper);
  }

  private attachMediaLoadListener() {
    this.cleanupLoadListener?.();
    this.cleanupLoadListener = undefined;

    const onLoadCapture = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;

      if (
        t.tagName === 'VIDEO' ||
        t.tagName === 'IFRAME' ||
        t.tagName === 'SOURCE'
      ) {
        this.scheduleRefresh('media-load');
      }
    };

    document.addEventListener('load', onLoadCapture, true);

    this.cleanupLoadListener = () => {
      document.removeEventListener('load', onLoadCapture, true);
    };
  }

  private attachFontsListener() {
    this.cleanupFontsListener?.();
    this.cleanupFontsListener = undefined;

    const anyDoc = document as any;
    const fonts: FontFaceSet | undefined = anyDoc.fonts;
    if (!fonts) return;

    const onFonts = () => this.scheduleRefresh('fonts');

    fonts.ready?.then(onFonts).catch(() => { });

    const done = () => onFonts();
    try {
      (fonts as any).addEventListener?.('loadingdone', done);
      (fonts as any).addEventListener?.('loadingerror', done);
    } catch { }

    this.cleanupFontsListener = () => {
      try {
        (fonts as any).removeEventListener?.('loadingdone', done);
        (fonts as any).removeEventListener?.('loadingerror', done);
      } catch { }
    };
  }

  // ===================== DESKTOP: NAV COLORS (50%) =====================

  private observeSectionsDesktopColors(scroller: HTMLElement) {
    this.colorTriggers.forEach(t => t.kill());
    this.colorTriggers = [];

    const sections = gsap.utils.toArray<HTMLElement>('#home .panel');

    sections.forEach((section, index) => {
      const textColor = section.dataset['textcolor'] || 'var(--primary)';
      const bgColor = section.dataset['bgcolor'] || 'var(--white)';

      const t = ScrollTrigger.create({
        id: `HOME_COLOR_${index + 1}`,
        trigger: section,
        scroller,
        start: 'top 50%',
        end: 'bottom 50%',
        invalidateOnRefresh: true,
        onEnter: () => {
          this.navTheme.setColor(textColor);
          this.navTheme.setBg(bgColor);
        },
        onEnterBack: () => {
          this.navTheme.setColor(textColor);
          this.navTheme.setBg(bgColor);
        },
        onLeaveBack: () => {
          if (index === 0) {
            this.navTheme.setBg('var(--white)');
            this.navTheme.setColor('var(--primary)');
          }
        },
      });

      this.colorTriggers.push(t);
    });
  }

  private observeSectionsMobile() {
    const sections = gsap.utils.toArray<HTMLElement>('#home .panel');

    sections.forEach((section, index) => {
      const textColor = section.dataset['textcolor'] || 'var(--primary)';
      const bgColor = section.dataset['bgcolor'] || 'var(--white)';

      ScrollTrigger.create({
        trigger: section,
        start: 'top 10%',
        end: 'bottom 50%',
        onEnter: () => {
          this.navTheme.setColor(textColor);
          this.navTheme.setBg(bgColor);
        },
        onEnterBack: () => {
          this.navTheme.setColor(textColor);
          this.navTheme.setBg(bgColor);
        },
        onLeaveBack: () => {
          if (index === 0) {
            this.navTheme.setBg('var(--white)');
            this.navTheme.setColor('var(--primary)');
          }
        },
      });
    });
  }

  private onResize = () => {
    this.scheduleRefresh('resize');

    this.ngZone.run(() => {
      this.cdr.detectChanges();
    });
  };

  // ===================== SNAP TRIGGERS =====================

  private buildSnapTriggers(scroller: HTMLElement) {
    this.snapTriggers.forEach(t => t.kill());
    this.snapTriggers = [];

    const panels = gsap.utils.toArray<HTMLElement>('#home .panel');

    panels.forEach((panel, i) => {
      const t = ScrollTrigger.create({
        id: `SNAP_PANEL_${i + 1}`,
        trigger: panel,
        scroller,
        start: 'top top',
        end: 'bottom bottom',
        invalidateOnRefresh: true,
        // markers: {
        //   startColor: 'green',
        //   endColor: 'green',
        //   fontSize: '10px',
        //   indent: 55,
        // },
      });
      this.snapTriggers.push(t);
    });
  }

  // ===================== SNAP POINTS (PIN-SAFE) =====================

  private buildSnapPointsFromTriggers(smoother: any) {
    const scroller = smoother.wrapper();
    const max = ScrollTrigger.maxScroll(scroller) || 1;
    const vh = scroller?.clientHeight || window.innerHeight;

    const points: number[] = [];

    for (const t of this.snapTriggers) {
      const start = t.start ?? 0;
      const end = t.end ?? start;

      const length = end - start;

      // 2% داخل السكشن + cap
      const rawOffset = length * this.SNAP_ENTER_PCT;
      const offsetCap = vh * this.SNAP_OFFSET_CAP_VH;
      const offset = Math.min(rawOffset, offsetCap);

      const yEnter = (start - this.NAV_OFFSET_DESKTOP) + offset;
      points.push(this.clamp(yEnter, 0, max));

      // Tail
      if (length > vh * 1.15) {
        const tail = (start - this.NAV_OFFSET_DESKTOP) + (length - vh) + offset;
        points.push(this.clamp(tail, 0, max));
      }
    }

    points.sort((a, b) => a - b);

    // Round + dedupe
    const rounded = points.map(v => Math.round(v));
    this.snapY = rounded.filter((v, i, arr) => i === 0 || Math.abs(v - arr[i - 1]) > 8);
  }

  private attachSnapRebuildListeners() {
    if (this.snapListenersAttached) return;
    this.snapListenersAttached = true;

    const rebuild = () => {
      const smoother = ScrollSmoother.get() as any;
      if (!smoother) return;

      this.buildSnapTriggers(smoother.wrapper());
      this.buildSnapPointsFromTriggers(smoother);
      this.attachSnapDetector(smoother);
    };

    ScrollTrigger.addEventListener('refreshInit', rebuild);
    ScrollTrigger.addEventListener('refresh', rebuild);

    (this as any)._snapRebuild = rebuild;
  }

  private clamp(v: number, min: number, max: number) {
    return Math.max(min, Math.min(max, v));
  }

  // ===================== DEBUG =====================

  private debugSnapEnds() {
    const smoother = ScrollSmoother.get() as any;
    if (!smoother) return;

    const scroller = smoother.wrapper();
    const max = ScrollTrigger.maxScroll(scroller) || 0;

    const st = this.homeSnapST || (ScrollTrigger.getById('HOME_SNAP') as any);
    const end = (st as any)?.end ?? 0;

    console.log('[HOME_SNAP] maxScroll=', Math.round(max), ' end=', Math.round(end), ' diff=', Math.round(max - end));
  }

  private debugSnapPoints() {
    if (!this.snapY.length) return;
    console.log('[SNAP_Y]', this.snapY.map(v => Math.round(v)));
  }

  // ===================== MOBILE STATIC HERO I18N =====================

  private setupMobileStaticHeroLanguage() {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (!isMobile) return;

    const saved = (localStorage.getItem('lang') || '').toLowerCase();
    if (saved !== 'en') return;

    const run = () => this.applyEnglishToMobileHero();
    const ric = (window as any).requestIdleCallback;
    if (typeof ric === 'function') ric(() => run(), { timeout: 3000 });
    else setTimeout(run, 1800);
  }

  private applyEnglishToMobileHero() {
    const hero = document.getElementById('hero-mobile');
    if (!hero) return;

    const title = hero.querySelector('[data-i18n="title"]');
    const subtitle = hero.querySelector('[data-i18n="subtitle"]');
    const details = hero.querySelector('[data-i18n="details"]');
    const btn1 = hero.querySelector('[data-i18n="btn1"]');
    const btn2 = hero.querySelector('[data-i18n="btn2"]');

    if (title) title.textContent = 'Manage all your operations in one integrated system';
    if (subtitle)
      subtitle.textContent =
        'Al Motammem ERP for enterprise resource management, backed by 40 years of experience in local and Gulf markets.';
    if (details)
      details.textContent =
        'Financial management - inventory - HR and payroll - reporting - fixed assets management - cash and banks - letters of guarantee - letters of credit - tax integrations, plus many more features tailored to your business.';
    if (btn1) btn1.textContent = 'Book a free consultation';
    if (btn2) btn2.textContent = 'Start chat now';

    hero.setAttribute('dir', 'ltr');
    hero.classList.add('is-en');
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
    this.routerSub = undefined;

    this.sectionsRegistry.clear();
    this.sectionsRegistry.disable();

    if (this.isBrowser) {
      this.teardownHomeSnap();
    }
    if (this.isBrowser) {
      try {
        window.removeEventListener('resize', this.onResize);
      } catch { }

      window.removeEventListener('pin-ready', this.onPinReady as any);

      const rebuild = (this as any)._snapRebuild;
      if (rebuild) {
        ScrollTrigger.removeEventListener('refreshInit', rebuild);
        ScrollTrigger.removeEventListener('refresh', rebuild);
      }

      // ✅ cleanup idle detector
      this.idleCleanup?.();
      this.idleCleanup = undefined;

      this.cleanupLoadListener?.();
      this.cleanupLoadListener = undefined;

      this.cleanupFontsListener?.();
      this.cleanupFontsListener = undefined;

      this.resizeObs?.disconnect();
      this.resizeObs = undefined;

      this.observer?.disconnect();
      this.observer = undefined;

      clearTimeout(this.refreshTimer);
      clearTimeout(this.mediaRefreshTimer);

      this.colorTriggers.forEach(t => t.kill());
      this.colorTriggers = [];

      this.snapTriggers.forEach(t => t.kill());
      this.snapTriggers = [];

      this.homeSnapST?.kill();
      this.homeSnapST = undefined;

      this.snapTween?.kill();
      this.snapTween = undefined;

      (this as any)._killSnapCleanup?.();
      (this as any)._killSnapCleanup = undefined;

      this.ctx?.revert();
    }
  }
}




