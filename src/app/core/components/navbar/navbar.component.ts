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
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements AfterViewInit, OnDestroy {
  @ViewChild('navbar', { static: false }) navbar!: ElementRef<HTMLElement>;
  @ViewChild('navbarMenu', { static: false }) navbarMenu!: ElementRef<HTMLElement>;
  @Input() menuOpen = false;
  @ViewChild('navSmallScreen', { static: false }) navSmallScreen!: ElementRef<HTMLElement>;

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

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    const nav = this.navbar?.nativeElement;
    if (!nav) return;

    gsap.set(nav, { yPercent: -100, opacity: 0 });
    gsap.to(nav, {
      yPercent: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
    });

    this.theme.theme$
      .pipe(
        distinctUntilChanged((a, b) => a.text === b.text && a.bg === b.bg),
        takeUntil(this.destroy$)
      )
      .subscribe(({ text, bg }) => {
        // ✅ التكست زي ما هو
        nav.style.color = text;

        const brand = nav.querySelector('#brand-text') as HTMLElement | null;
        const brand2 = nav.querySelector('#brand-text2') as HTMLElement | null;
        const brand3 = nav.querySelector('#brand-text3') as HTMLElement | null;

        const brandMain = text === 'var(--primary)' ? 'var(--dark-gray)' : 'var(--white)';
        const brandAux = text === 'var(--primary)' ? 'var(--primary)' : 'var(--white)';

        if (brand) brand.style.color = brandMain;
        if (brand2) brand2.style.color = brandAux;
        if (brand3) brand3.style.color = brandAux;

        // ✅ الخلفية للموبايل فقط
        const isMobile = window.matchMedia('(max-width: 765px)').matches;

        if (isMobile) {
          nav.style.backgroundColor = bg;

          const menuEl = this.navbarMenu?.nativeElement;
          if (menuEl) menuEl.style.backgroundColor = bg;

          const topEl = this.navSmallScreen?.nativeElement;
          if (topEl) topEl.style.backgroundColor = bg;
        } else {
          // ✅ Desktop: نفس طريقة الموبايل بس للـ nav كله فقط
          nav.style.backgroundColor = bg;
          const navvv = this.navbar?.nativeElement;
          if (navvv) navvv.style.backgroundColor = bg;
        }
        // nav.style.backgroundColor = 'transparent';

        // const menuEl = this.navbarMenu?.nativeElement;
        // if (menuEl) menuEl.style.backgroundColor = 'transparent';

        // const topEl = this.navSmallScreen?.nativeElement;
        // if (topEl) topEl.style.backgroundColor = 'transparent';

      });


    // const last = this.theme.getSnapshot();
    // if (last) nav.style.color = last;
    const snap = this.theme.getSnapshot();
    nav.style.color = snap.text;
    nav.style.backgroundColor = snap.bg;
    if (window.matchMedia('(max-width: 765px)').matches) {

      this.navbarMenu?.nativeElement && (this.navbarMenu.nativeElement.style.backgroundColor = snap.bg);
      this.navSmallScreen?.nativeElement && (this.navSmallScreen.nativeElement.style.backgroundColor = snap.bg);
    } else {

      this.navbar?.nativeElement && (this.navbar.nativeElement.style.backgroundColor = snap.bg);
    }


  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // toggleMenu() {
  //   const el = this.navbarMenu.nativeElement;
  //   this.menuOpen = !this.menuOpen;

  //   if (!this.isBrowser) {
  //     el.style.transform = `translateY(${this.menuOpen ? '140px' : '-150px'})`;
  //     el.style.opacity = this.menuOpen ? '1' : '0';
  //     return;
  //   }

  //   gsap.to(el, {
  //     y: this.menuOpen ? 140 : -150,
  //     opacity: this.menuOpen ? 1 : 0,
  //     duration: 0.8,
  //     ease: 'power2.inOut',
  //   });
  // }
  toggleMenu() {
    const el = this.navbarMenu?.nativeElement;
    if (!el) return;

    // ✅ toggle الأول (كان ناقص)
    this.menuOpen = !this.menuOpen;

    // SSR
    if (!this.isBrowser) {
      el.style.display = this.menuOpen ? 'flex' : 'none';
      el.style.transform = `translateY(${this.menuOpen ? '0%' : '-100%'})`;
      el.style.opacity = this.menuOpen ? '1' : '0';
      return;
    }

    // ✅ قبل الفتح لازم يظهر عشان يتحسب -100% صح
    if (this.menuOpen) {
      el.style.display = 'flex'; // لأن عندك flex layout
      gsap.set(el, { yPercent: -110, opacity: 0 });

      // ✅ 3) افتح بسلاسة
      gsap.to(el, {
        yPercent: 10,
        opacity: 1,
        duration: 0.45,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
    else {
      gsap.to(el, {
        yPercent: -110,
        opacity: 0,
        duration: 0.35,
        ease: 'power2.in',
        overwrite: 'auto',
        onComplete: () => {
          el.style.display = 'none';
        },
      })
    }

    // gsap.to(el, {
    //   yPercent: this.menuOpen ? 0 : -100,
    //   opacity: this.menuOpen ? 1 : 0,
    //   duration: 0.45,
    //   ease: 'power2.inOut',
    //   overwrite: 'auto',
    //   onComplete: () => {
    //     if (!this.menuOpen) {
    //       el.style.display = 'none';
    //     }
    //   },
    // });
  }


  private language = inject(LanguageService);

  setLang(lang: 'en' | 'ar') {
    this.currentLang = lang;
    this.language.switchLang(lang);
    console.log(lang);

  }

}


