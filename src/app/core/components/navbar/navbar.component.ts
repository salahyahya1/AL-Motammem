import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, Input, PLATFORM_ID, ViewChild, AfterViewInit, OnDestroy, inject, HostListener, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { BehaviorSubject, Subject, from, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil, map, tap, catchError } from 'rxjs/operators';
import gsap from 'gsap';
import { NavbarThemeService } from './navbar-theme.service';
import { LanguageService } from '../../shared/services/language.service';
import { TranslateDirective, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SiteSearchService, SearchResult } from '../../services/site-search.service';
import { SearchNavigationCoordinatorService } from '../../services/search-navigation-coordinator.service';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe, ReactiveFormsModule, RouterLinkActive],
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

  isMobile = false;
  

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
    private searchNav: SearchNavigationCoordinatorService,
    private router: Router,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private auth: AuthService,
    @Inject(PLATFORM_ID) platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (!this.isBrowser) return;
    const saved = localStorage?.getItem('lang') as 'ar' | 'en' | null;
    if (saved === 'ar' || saved === 'en') {
      this.currentLang = saved;
    }
  }
  isAuthenticated!:boolean;
  hasrole!:boolean;
  role = '';
  isLangOpen = false;

  toggleLangDropdown() {
    this.isLangOpen = !this.isLangOpen;
  }

  closeLangDropdown() {
    this.isLangOpen = false;
  }
  onLogoutClick(e: Event) {
    e.preventDefault();
    e.stopPropagation();
  
    console.log('logout clicked');
    this.logout();
  }
  
  logout() {
  
    this.auth.logout();
  
    this.closeSearch();
    this.closeLangDropdown();
    this.closeMenuOnMobile();
  
    this.router.navigateByUrl('/');this.router.navigateByUrl('/', { replaceUrl: true });
  
    this.cdr.markForCheck();
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
    this.auth.authenticated$
    .pipe(takeUntil(this.destroy$))
    .subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      this.cdr.markForCheck();
    });
  
  this.auth.roleObs$
    .pipe(takeUntil(this.destroy$))
    .subscribe(r => {
      this.role = r || '';
      this.hasrole = !!r;
      this.cdr.markForCheck();
    });
  
    this.auth.syncFromStorage();

  }
  private onBp!: () => void;
  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    const nav = this.navbar?.nativeElement;
    if (!nav) return;

    gsap.set(nav, { yPercent: -31, opacity: 0 });
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
        const menuEl = this.navbarMenu?.nativeElement;
        const topEl  = this.navSmallScreen?.nativeElement;
      
        // ✅ apply bg to ALL always (mobile + desktop)
        nav.style.backgroundColor = bg;
        if (menuEl) menuEl.style.backgroundColor = bg;
        if (topEl)  topEl.style.backgroundColor = bg;
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
    this.navbarMenu?.nativeElement && (this.navbarMenu.nativeElement.style.backgroundColor = snap.bg);
    this.navSmallScreen?.nativeElement && (this.navSmallScreen.nativeElement.style.backgroundColor = snap.bg);
    if (window.matchMedia('(max-width: 765px)').matches) {

      this.navbarMenu?.nativeElement && (this.navbarMenu.nativeElement.style.backgroundColor = snap.bg);
      this.navSmallScreen?.nativeElement && (this.navSmallScreen.nativeElement.style.backgroundColor = snap.bg);
    } else {

      this.navbar?.nativeElement && (this.navbar.nativeElement.style.backgroundColor = snap.bg);
    }

    this.mq = window.matchMedia('(min-width: 768px)');

    this.onBp = () => {
      this.isMobile = !this.mq!.matches;
      // this.applyThemeForViewport();
      this.resetMenuForBreakpoint();
    };

    this.mq.addEventListener('change', this.onBp);

    // نفّذ مرة أول ما الصفحة تفتح
    this.onBp();

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.mq?.removeEventListener('change', this.onBp as any);

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
    if (window.matchMedia('(min-width: 768px)').matches) return;
    // ✅ toggle الأول (كان ناقص)
    this.menuOpen = !this.menuOpen;

    // SSR
    if (!this.isBrowser) {
      el.style.display = this.menuOpen ? 'flex' : 'none';
      el.style.transform = `translateY(${this.menuOpen ? '31%' : '-31%'})`;
      el.style.opacity = this.menuOpen ? '1' : '0';
      return;
    }

    // ✅ قبل الفتح لازم يظهر عشان يتحسب -100% صح
    if (this.menuOpen) {
      el.style.display = 'flex'; // لأن عندك flex layout
      gsap.set(el, { opacity: 1 });

      // ✅ 3) افتح بسلاسة
      gsap.to(el, {
        yPercent: 31,
        opacity: 1,
        duration: 0.45,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
    else {
      gsap.to(el, {
        yPercent: -31,
        opacity: 0,
        duration: 0.35,
        ease: 'power2.in',
        overwrite: 'auto',
        onComplete: () => {
          // gsap.set(".navbar", { yPercent: -31, color: "transparent", duration: 0.2 });
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
    this.closeMenuOnMobile();
    this.searchNav.requestNavigation({
      route: result.route,
      fragment: result.fragment,
      source: 'navbar',
    });
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    // If click is outside the search component/container, close search
    // But verify we are not clicking inside the search container specifically
    if (this.isSearchOpen && this.searchContainer && !this.searchContainer.nativeElement.contains(event.target)) {
      this.closeSearch();
    }

    // Also existing logic for results dropdown safety? same logic covers it.
    // ✅ close lang dropdown on outside click
    this.isLangOpen = false;
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: Event) {
    if (this.isSearchOpen) {
      this.closeSearch();
    }
    if (this.isLangOpen) {
      this.isLangOpen = false;
    }
  }
  private mq?: MediaQueryList;

  // private applyThemeForViewport() {
  //   const nav = this.navbar?.nativeElement;
  //   if (!nav) return;

  //   const snap = this.theme.getSnapshot();
  //   if (!snap) return;

  //   nav.style.color = snap.text;
  //   nav.style.backgroundColor = snap.bg;

  //   // مهم: طبّقي على التلاتة دايمًا عشان مايبقاش في ستايل stale بعد resize
  //   const menuEl = this.navbarMenu?.nativeElement;
  //   const topEl = this.navSmallScreen?.nativeElement;
  //   if (menuEl) menuEl.style.backgroundColor = snap.bg;
  //   if (topEl) topEl.style.backgroundColor = snap.bg;
  // }

  private resetMenuForBreakpoint() {
    const el = this.navbarMenu?.nativeElement;
    if (!el || !this.mq) return;

    if (this.mq.matches) {
      // Desktop (>=768px): لازم المنيو تبقى ظاهرة ومش متحوّلة
      this.menuOpen = false;
      el.style.display = 'flex';
      gsap.set(el, { clearProps: 'transform,opacity' });
    } else {
      // Mobile: ارجعي لحالة menuOpen الحالية
      if (!this.menuOpen) {
        el.style.display = 'none';
        gsap.set(el, { yPercent: -31, opacity: 0 });
      } else {
        el.style.display = 'flex';
        gsap.set(el, { yPercent: 31, opacity: 1 });
      }
    }
  }
  closeMenuOnMobile() {
    if (this.mq?.matches) return; // desktop
    this.closeMenu();
  }
  closeMenu() {
    if (this.mq?.matches) return; // desktop
  if (!this.menuOpen) return;  
    this.toggleMenu();
  }
}
