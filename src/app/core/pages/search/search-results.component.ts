import { Component, ElementRef, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, filter, tap } from 'rxjs/operators';
import { Subscription, of } from 'rxjs';
import { SiteSearchService, SearchResult } from '../../services/site-search.service';

@Component({
    selector: 'app-search-results',
    standalone: true,
    imports: [CommonModule, TranslateModule, ReactiveFormsModule],
    template: `
    <div class="container mx-auto px-4 py-8 min-h-[60vh] rtl:text-right ltr:text-left mt-20">
      <h1 class="text-3xl font-bold mb-6 text-[var(--primary)]">{{ 'SEARCH.RESULTS_TITLE' | translate }}</h1>
      
      <div class="mb-8">
        <input 
          [formControl]="searchControl"
          type="text" 
          class="w-full max-w-2xl px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-lg"
          [placeholder]="'SEARCH.PLACEHOLDER' | translate"
        >
      </div>

      <div *ngIf="loading" class="text-center py-8">
        <p class="text-gray-500">{{ 'SEARCH.LOADING' | translate }}...</p>
      </div>

      <div *ngIf="!loading && results.length === 0" class="text-center py-8">
         <p class="text-gray-500 text-lg">{{ 'SEARCH.NO_RESULTS' | translate }}</p>
      </div>

      <div *ngIf="!loading && results.length > 0" class="flex flex-col gap-6">
        <div *ngFor="let result of results" class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <a (click)="handleResultClick(result)" class="block group cursor-pointer">
            <div class="flex items-center gap-3 mb-2">
                <h3 class="text-xl font-semibold text-[var(--dark-gray)] group-hover:text-[var(--primary)] transition-colors">
                <!-- If title is a key, we might translate it, but here we indexed the actual text or a descriptive title -->
                {{ result.title.includes('.') ? (result.title | translate) : result.title }}
                </h3>
                <span *ngIf="result.source === 'blog'"
                    class="px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-600 rounded-full border border-blue-100">
                    {{ 'SEARCH.BADGE_BLOG' | translate }}
                </span>
                <span *ngIf="result.source === 'faq'"
                    class="px-2 py-0.5 text-xs font-medium bg-orange-50 text-orange-600 rounded-full border border-orange-100">
                    {{ 'SEARCH.BADGE_FAQ' | translate }}
                </span>
                <span *ngIf="result.source === 'site'"
                    class="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-500 rounded-full border border-gray-200">
                    {{ 'SEARCH.BADGE_SITE' | translate }}
                </span>
            </div>
            <p class="text-gray-600 leading-relaxed text-sm">
              {{ result.snippet }}
            </p>
            <span class="inline-block mt-3 text-sm text-[var(--primary)] font-medium">
              {{ 'SEARCH.READ_MORE' | translate }} &rarr;
            </span>
          </a>
        </div>
      </div>
    </div>
  `
})
export class SearchResultsComponent implements OnInit, OnDestroy {
    results: SearchResult[] = [];
    searchControl = new FormControl('');
    loading = false;
    private sub: Subscription = new Subscription();
    lang = 'en';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private searchService: SiteSearchService,
        private translate: TranslateService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit(): void {
        this.lang = this.translate.currentLang || 'en';

        // Listen to query params
        this.sub.add(
            this.route.queryParams.pipe(
                tap(params => {
                    const q = params['q'];
                    if (q) {
                        this.searchControl.setValue(q, { emitEvent: false });
                        this.performSearch(q);
                    }
                })
            ).subscribe()
        );

        // Listen to input changes
        this.sub.add(
            this.searchControl.valueChanges.pipe(
                debounceTime(300),
                distinctUntilChanged()
            ).subscribe(term => {
                if (term) {
                    this.router.navigate([], {
                        relativeTo: this.route,
                        queryParams: { q: term },
                        queryParamsHandling: 'merge'
                    });
                    // performSearch is covered by queryParams subscription if we want, 
                    // but router nav is async. Better to just trigger search?
                    // Actually, navigating updates query params, which triggers the subscription above.
                } else {
                    this.results = [];
                    this.router.navigate([], {
                        relativeTo: this.route,
                        queryParams: { q: null },
                        queryParamsHandling: 'merge'
                    });
                }
            })
        );

        // Lang change
        this.sub.add(
            this.translate.onLangChange.subscribe(evt => {
                this.lang = evt.lang;
                const q = this.searchControl.value;
                if (q) this.performSearch(q);
            })
        );
    }

    handleResultClick(result: SearchResult) {
        if (result.fragment) {
            localStorage.setItem('scroll_to_section', result.fragment);

            if (isPlatformBrowser(this.platformId)) {
                const norm = (p: string) =>
                    (p || '')
                        .split('?')[0]
                        .split('#')[0]
                        .replace(/\/+$/, '') // remove trailing slashes
                        .toLowerCase();

                const currentPath = norm(this.router.url);
                const targetPath = norm(result.route || '');

                if (currentPath === targetPath) {
                    window.dispatchEvent(new CustomEvent('app-scroll-to-section', { detail: result.fragment }));
                }
            }
        }

        this.router.navigateByUrl(result.route);
    }

    async performSearch(query: string) {
        if (!query || !isPlatformBrowser(this.platformId)) return;
        this.loading = true;
        try {
            this.results = await this.searchService.search(query, this.lang);
        } catch (e) {
            console.error(e);
        } finally {
            this.loading = false;
        }
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }
}
