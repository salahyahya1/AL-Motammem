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
//     const sections = gsap.utils.toArray<HTMLElement>('.panel');
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
import {
  Component,
  Inject,
  PLATFORM_ID,
  AfterViewInit,
  NgZone,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollSmoother from 'gsap/ScrollSmoother';
import { Section1Component } from './section1/section1.component';
import { Section2Component } from './section2/section2.component';
import { Section4Component } from './section4/section4.component';
import { Section5Component } from './section5/section5.component';
import { Section6Component } from './section6/section6.component';
import { Section7Component } from './section7/section7.component';
import { Section8Component } from './section8/section8.component';
import { BehaviorSubject } from 'rxjs';
import { Section3Component } from './section3/section3.component';
import { NavbarThemeService } from '../../components/navbar/navbar-theme.service';
import { SectionItem, SectionsRegistryService } from '../../shared/services/sections-registry.service';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    Section1Component,
    Section2Component,
    Section4Component,
    Section5Component,
    Section6Component,
    Section7Component,
    Section8Component,
    Section3Component,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  private visibilitySubject = new BehaviorSubject<'visible' | 'invisible'>('visible');
  visibility$ = this.visibilitySubject.asObservable();
  visibilityState: 'visible' | 'invisible' = 'visible';
  private smoother!: any;
  isMobile!: boolean
  menuOpen = false;
  isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private navTheme: NavbarThemeService,
    private sectionsRegistry: SectionsRegistryService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    // ✅ 1) لو موبايل: عدّل نص الـ Static Hero للإنجليزي لو المستخدم مختاره (بعد idle)
    this.setupMobileStaticHeroLanguage();

    // ✅ 2) ScrollTriggers/Indicators خليهم Desktop فقط (عشان ما نحرّقش الموبايل)
    this.isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (this.isMobile) {
      setTimeout(() => {
        this.observeSectionsMobile();
      }, 7500);
      return;
    };

    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
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

        this.observeSections();

        window.addEventListener('resize', this.onResize);
      }, 150);
    });
  }

  // ✅ Desktop only
  private observeSections() {
    const sections = gsap.utils.toArray<HTMLElement>('.panel');
    sections.forEach((section) => {
      const textColor = section.dataset['textcolor'] || 'var(--primary)';

      ScrollTrigger.create({
        trigger: section,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => this.updateNavbarColors(textColor),
        onEnterBack: () => this.updateNavbarColors(textColor),
      });
    });
  }
  //mobile only
  private observeSectionsMobile() {
    const sections = gsap.utils.toArray<HTMLElement>('.panel');
    sections.forEach((section, index) => {
      const textColor = section.dataset['textcolor'] || 'var(--primary)';
      const bgColor = section.dataset['bgcolor'] || 'var(--white)';
      // console.log(section);
      ScrollTrigger.create({
        trigger: section,
        start: 'top 10%',
        end: 'bottom 50%',
        // markers: true,
        // invalidateOnRefresh: true,
        onEnter: () => {
          this.navTheme.setColor(textColor);   // ✅ سيبها زي ما هي
          this.navTheme.setBg(bgColor);        // ✅ الجديد
        },
        onEnterBack: () => {
          this.navTheme.setColor(textColor);
          this.navTheme.setBg(bgColor);
        },
        onLeaveBack: () => {
          if (index === 0) {
            this.navTheme.setBg('var(--white)');
            this.navTheme.setColor('var(--primary)');
            return;
          }
        },
      });
    });
  }

  private updateNavbarColors(textColor: string) {
    this.navTheme.setColor(textColor);
  }

  private onResize = () => {
    this.ngZone.run(() => {
      this.cdr.detectChanges();
    });
  };

  /**
   * ✅ Mobile Static Hero i18n:
   * - default AR (SSR)
   * - لو localStorage = en => بدّل النص بعد idle (عشان Lighthouse)
   */
  private setupMobileStaticHeroLanguage() {
    const isMobile = window.matchMedia('(max-width: 699px)').matches;
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

    // 🔁 عدّل النصوص دي للقيم اللي عندك فعليًا
    if (title) title.textContent = 'Manage all your operations in one integrated system';
    if (subtitle) subtitle.textContent = 'Al Motammem ERP for enterprise resource management, backed by 40 years of experience in local and Gulf markets.';
    if (details) details.textContent = 'Financial management - inventory - HR and payroll - reporting - fixed assets management - cash and banks - letters of guarantee - letters of credit - tax integrations, plus many more features tailored to your business.';
    if (btn1) btn1.textContent = 'Book a free consultation';
    if (btn2) btn2.textContent = 'Try Mini Motammem for individuals for free';

    hero.setAttribute('dir', 'ltr');
    hero.classList.add('is-en');
  }

  ngOnDestroy(): void {
    this.sectionsRegistry.clear();
    this.sectionsRegistry.disable();

    if (this.isBrowser) {
      try {
        window.removeEventListener('resize', this.onResize);
      } catch { }

      ScrollTrigger.getAll().forEach((t) => t.kill());
    }
  }
}
