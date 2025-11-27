// import { CommonModule, isPlatformBrowser } from '@angular/common';
// import { AfterViewInit, Component, ElementRef, Inject, Input, OnDestroy, PLATFORM_ID, ViewChild } from '@angular/core';
// import { RouterLink } from '@angular/router';
// import { NavbarThemeService } from './navbar-theme.service';
// import gsap from 'gsap';
// import ScrollTrigger from 'gsap/ScrollTrigger';
// import ScrollSmoother from 'gsap/ScrollSmoother';
// import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';
// gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
// @Component({
//   selector: 'app-navbar',
//   imports: [CommonModule, RouterLink],
//   templateUrl: './navbar.component.html',
//   styleUrl: './navbar.component.scss'
// })
// export class NavbarComponent {
//   @ViewChild('navbar', { static: false }) navbar!: ElementRef<HTMLElement>;
//   @ViewChild('navbarMenu', { static: false }) navbarMenu!: ElementRef<HTMLElement>;
//   @Input() menuOpen: boolean = false;
//   private isBrowser: boolean;
//   constructor(
//     private theme: NavbarThemeService,
//     @Inject(PLATFORM_ID) platformId: Object,
//   ) {
//     this.isBrowser = isPlatformBrowser(platformId);
//   }
//   ngAfterViewInit(): void {


//     this.theme.color$.subscribe((textColor) => {
//       const nav = this.navbar?.nativeElement;
//       if (!nav) return;
//       //  gsap.fromTo(navbarEl, { y: -100, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power2.inOut' });
//       gsap.fromTo(nav, { y: -100, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power2.inOut' });
//       // لون النص الرئيسي للنافبار
//       nav.style.color = textColor;

//       // منطقك القديم للـbrand-text
//       const brand = nav.querySelector('#brand-text') as HTMLElement | null;
//       const brand2 = nav.querySelector('#brand-text2') as HTMLElement | null;
//       const brand3 = nav.querySelector('#brand-text3') as HTMLElement | null;

//       const brandMain = (textColor === 'var(--primary)') ? 'var(--dark-gray)' : 'var(--white)';
//       const brandAux = (textColor === 'var(--primary)') ? 'var(--primary)' : 'var(--white)';

//       if (brand) brand.style.color = brandMain;
//       if (brand2) brand2.style.color = brandAux;
//       if (brand3) brand3.style.color = brandAux;

//     });

//   }
//   async toggleMenu() {
//     this.menuOpen = !this.menuOpen;
//     const el = this.navbarMenu.nativeElement;

//     if (!this.isBrowser) {
//       // SSR: حدّث الحالة بس
//       el.style.transform = `translateY(${this.menuOpen ? '165px' : '-120px'})`;
//       el.style.opacity = this.menuOpen ? '1' : '0';
//       return;
//     }

//     // استدعاء gsap lazy عشان يقلل وزن الباندل + يحترم SSR
//     const { default: gsap } = await import('gsap');
//     gsap.to(el, {
//       y: this.menuOpen ? 165 : -120,
//       opacity: this.menuOpen ? 1 : 0,
//       duration: 0.8,
//       ease: 'power2.inOut',
//     });
//   }
// }
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, Input, PLATFORM_ID, ViewChild, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subject, distinctUntilChanged, takeUntil } from 'rxjs';
import gsap from 'gsap';
import { NavbarThemeService } from './navbar-theme.service';
import { LanguageService } from '../../shared/services/language.service';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  standalone: true,                  // ✅ مهم لو بتستوردها في Home imports
  imports: [CommonModule, RouterLink, TranslatePipe, TranslateDirective],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'] // ✅ مش styleUrl
})
export class NavbarComponent implements AfterViewInit, OnDestroy {
  @ViewChild('navbar', { static: false }) navbar!: ElementRef<HTMLElement>;
  @ViewChild('navbarMenu', { static: false }) navbarMenu!: ElementRef<HTMLElement>;
  @Input() menuOpen = false;

  private isBrowser: boolean;
  private destroy$ = new Subject<void>();
  currentLang: 'ar' | 'en' = 'ar';
  constructor(
    private theme: NavbarThemeService,
    @Inject(PLATFORM_ID) platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (!this.isBrowser) return;
    const saved = localStorage?.getItem('lang') as 'ar' | 'en' | null;
    if (saved === 'ar' || saved === 'en') {
      this.currentLang = saved;
    }
  }

  // ✅ الهـوك الصح
  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    const nav = this.navbar?.nativeElement;
    if (!nav) return;
    gsap.set(nav, { yPercent: -100, opacity: 0, willChange: 'transform,opacity' });
    // أنيميشن نزول النافبار أول مرة
    gsap.to(nav, {
      yPercent: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
      onComplete: () => { nav.style.willChange = '' }
    });

    // استقبل اللون وطبّقه
    this.theme.color$
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((textColor) => {
        nav.style.color = textColor;

        const brand = nav.querySelector('#brand-text') as HTMLElement | null;
        const brand2 = nav.querySelector('#brand-text2') as HTMLElement | null;
        const brand3 = nav.querySelector('#brand-text3') as HTMLElement | null;

        const brandMain = textColor === 'var(--primary)' ? 'var(--dark-gray)' : 'var(--white)';
        const brandAux = textColor === 'var(--primary)' ? 'var(--primary)' : 'var(--white)';

        if (brand) brand.style.color = brandMain;
        if (brand2) brand2.style.color = brandAux;
        if (brand3) brand3.style.color = brandAux;
      });

    // اختيارى: طبّق آخر قيمة فورًا
    const last = this.theme.getSnapshot();
    if (last) nav.style.color = last;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleMenu() {
    const el = this.navbarMenu.nativeElement;
    this.menuOpen = !this.menuOpen;

    if (!this.isBrowser) {
      el.style.transform = `translateY(${this.menuOpen ? '165px' : '-150px'})`;
      el.style.opacity = this.menuOpen ? '1' : '0';
      return;
    }

    gsap.to(el, {
      y: this.menuOpen ? 165 : -150,
      opacity: this.menuOpen ? 1 : 0,
      duration: 0.8,
      ease: 'power2.inOut',
    });
  }
  private language = inject(LanguageService);

  setLang(lang: 'en' | 'ar') {
    this.currentLang = lang;
    this.language.switchLang(lang);
    console.log(lang);

  }

}


