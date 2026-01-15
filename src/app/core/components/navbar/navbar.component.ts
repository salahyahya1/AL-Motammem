import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, Input, PLATFORM_ID, ViewChild, AfterViewInit, OnDestroy, inject, HostListener, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subject, from, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil, map, tap, catchError } from 'rxjs/operators';
import gsap from 'gsap';
import { NavbarThemeService } from './navbar-theme.service';
import { LanguageService } from '../../shared/services/language.service';
import { TranslateDirective, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SiteSearchService, SearchResult } from '../../services/site-search.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe, ReactiveFormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('navbar', { static: false }) navbar!: ElementRef<HTMLElement>;
  @ViewChild('navbarMenu', { static: false }) navbarMenu!: ElementRef<HTMLElement>;
  @Input() menuOpen = false;
  @ViewChild('navSmallScreen', { static: false }) navSmallScreen!: ElementRef<HTMLElement>;
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('searchContainer') searchContainer!: ElementRef<HTMLElement>;

  private isBrowser: boolean;
  private destroy$ = new Subject<void>();
  currentLang: 'ar' | 'en' = 'ar';


  // Search related
  searchControl = new FormControl('');
  searchResults: SearchResult[] = [];
  showResults = false;
  searchLoading = false;
  searchRequestId = 0;
  isSearchOpen = false;

  constructor(
    private theme: NavbarThemeService,
    private searchService: SiteSearchService,
    private router: Router,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (!this.isBrowser) return;
    const saved = localStorage?.getItem('lang') as 'ar' | 'en' | null;
    if (saved === 'ar' || saved === 'en') {
      this.currentLang = saved;
    }
  }

  ngOnInit(): void {
    // RxJS Pipeline for Search Input
    this.searchControl.valueChanges.pipe(
      map(term => term?.trim() || ''),
      // debounceTime(150), // Moved after tap to feel more responsive on clear? No, typically before.
      // Actually user asked to "Clear previous results immediately".
      // So we tap FIRST to clear, then debounce the actual API call?
      // But valueChanges emits immediately.
      // If we debounce first, the clear happens late.
      // WE NEED TO SPLIT:
      // 1. Immediate clear on any change.
      // 2. Debounced search.
      tap(term => {
        // Immediate UI feedback
        this.searchResults = [];
        this.searchLoading = (term.length >= 2);
        this.searchRequestId++; // Invalidate previous
        this.cdr.markForCheck();
      }),
      debounceTime(150),
      distinctUntilChanged(),
      switchMap(term => {
        if (!term || term.length < 2) {
          this.searchLoading = false;
          this.cdr.markForCheck();
          return of({ results: [], id: this.searchRequestId });
        }

        // Capture current ID for this stream
        const requestId = this.searchRequestId;

        // Return observable of search
        return from(this.searchService.search(term, this.currentLang)).pipe(
          map(results => ({ results, id: requestId })),
          catchError(err => {
            console.error(err);
            return of({ results: [], id: requestId });
          })
        );
      }),
      takeUntil(this.destroy$)
    ).subscribe(({ results, id }) => {
      // Guard: only accept if it matches latest request ID
      // (Note: switchMap handles cancellation of in-flight observables,
      // but this adds extra safety if promises resolve out of order in some weird edge cases)
      if (id === this.searchRequestId) {
        this.searchResults = results;
        this.searchLoading = false;
        this.cdr.markForCheck();
        if (this.isSearchOpen && results.length > 0) {
          this.showResults = true;
        }
      }
    });
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

        // const brand = nav.querySelectorAll('.brand-text') as NodeListOf<HTMLElement>;
        const brand = Array.from(nav.querySelectorAll('.brand-text')) as HTMLElement[];
        const brand2 = nav.querySelector('#brand-text2') as HTMLElement | null;
        const brand3 = nav.querySelector('#brand-text3') as HTMLElement | null;

        const brandMain = text === 'var(--primary)' ? 'var(--dark-gray)' : 'var(--white)';
        const brandAux = text === 'var(--primary)' ? 'var(--primary)' : 'var(--white)';

        if (brand) brand.forEach(b => b.style.color = brandMain);
        if (brand2) brand2.style.color = brandAux;
        if (brand3) brand3.style.color = brandAux;
        const seprator = nav.querySelector('#navbar-seprator') as HTMLElement | null;
        if (seprator) seprator.style.backgroundColor = text;

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
    // Reset search on lang change
    this.closeSearch();
  }

  // Use only for toggling open state
  openSearch() {
    if (this.isSearchOpen) return;
    this.isSearchOpen = true;
    this.showResults = false; // logic in pipeline will show it if valid input
    this.searchService.ensureReady(this.currentLang);

    // Autofocus input
    if (this.isBrowser) {
      // Use short timeout to allow CSS transition to start/render
      setTimeout(() => {
        this.searchInput?.nativeElement.focus();
      }, 50);
    }
  }

  closeSearch() {
    this.isSearchOpen = false;
    this.showResults = false;
    this.searchControl.setValue('');
    this.searchResults = [];
    this.searchLoading = false;
  }

  onSearchFocus() {
    // Re-trigger ensures loading if needed, though openSearch does it too
    this.searchService.ensureReady(this.currentLang);
    if (this.searchControl.value && this.searchControl.value.length >= 2) {
      this.showResults = true;
    }
  }

  // NOTE: onSearchInput removed as it's handled by RxJS pipeline in ngOnInit

  onSearchSubmit() {
    const query = this.searchControl.value;
    if (query) {
      this.closeSearch(); // Close on submit navigation? user said "Navigating to a result closes the bar".
      // Submitting usually goes to results page, so closing is good.
      this.router.navigate(['/search'], { queryParams: { q: query } });
    }
  }

  navigateToResult(result: SearchResult) {
    this.closeSearch();

    if (result.fragment) {
      localStorage.setItem('scroll_to_section', result.fragment);
    }

    this.router.navigateByUrl(result.route);
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    // If click is outside the search component/container, close search
    // But verify we are not clicking inside the search container specifically
    if (this.isSearchOpen && this.searchContainer && !this.searchContainer.nativeElement.contains(event.target)) {
      this.closeSearch();
    }

    // Also existing logic for results dropdown safety? same logic covers it.
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: Event) {
    if (this.isSearchOpen) {
      this.closeSearch();
    }
  }

}
