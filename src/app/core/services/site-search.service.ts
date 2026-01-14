import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, firstValueFrom, forkJoin, from, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
// @ts-ignore
import FlexSearch from 'flexsearch';
import { BlogsService, BlogApiItem } from '../pages/blogs/services/blogs-service';
import { FaqsService } from '../pages/faqs/Faqs-service';

export interface SearchResult {
    id: string;
    lang: string;
    key?: string; // for i18n
    title: string;
    route: string;
    text: string;
    snippet?: string;
    source: 'site' | 'blog' | 'faq';
}

@Injectable({
    providedIn: 'root'
})
export class SiteSearchService {
    private i18nIndex: any = null;
    private contentIndex: any = null;

    private currentLang: string | null = null;

    // Status flags
    private isI18nLoaded = false;
    private isContentLoaded = false;
    private isContentLoading = false;

    private i18nLoadPromise: Promise<void> | null = null;
    private contentLoadPromise: Promise<void> | null = null;

    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: Object,
        private blogsService: BlogsService,
        private faqsService: FaqsService
    ) { }

    /**
     * Ensure the index is ready for the given language.
     * Starts loading both indexes if not ready.
     * Returns when i18n index is ready (fast). Content index loads in background.
     */
    async ensureReady(lang: string): Promise<void> {
        if (!isPlatformBrowser(this.platformId)) return;

        // Reset if language changed
        if (this.currentLang && this.currentLang !== lang) {
            this.reset();
        }
        this.currentLang = lang;

        // Trigger Content Load (Background) if not started
        if (!this.isContentLoaded && !this.isContentLoading) {
            this.contentLoadPromise = this.loadContentIndex(lang);
        }

        // Trigger i18n Load (Background) if not started
        if (!this.isI18nLoaded && !this.i18nLoadPromise) {
            this.i18nLoadPromise = this.loadI18nIndex(lang);
        }

        // Wait for BOTH to be ready before returning
        // This ensures the first search includes all results.
        const promises = [];
        if (this.contentLoadPromise) promises.push(this.contentLoadPromise);
        if (this.i18nLoadPromise) promises.push(this.i18nLoadPromise);

        if (promises.length > 0) {
            const results = await Promise.allSettled(promises);
            // Log errors if any, but don't crash everything if one fails
            results.forEach(res => {
                if (res.status === 'rejected') console.error('Index load failed', res.reason);
            });
        }
    }

    private async loadI18nIndex(lang: string): Promise<void> {
        try {
            const data = await firstValueFrom(this.http.get<{ docs: any[] }>('/search-index.json'));

            this.i18nIndex = new FlexSearch.Document({
                document: {
                    id: 'id',
                    index: ['title', 'text'],
                    store: true
                },
                tokenize: 'forward',
                context: true
            });

            const langDocs = data.docs
                .filter(d => d.lang === lang)
                .map(d => ({ ...d, source: 'site' }));

            for (const doc of langDocs) {
                this.i18nIndex.add(doc);
            }
            this.isI18nLoaded = true;
        } catch (e) {
            console.error('Failed to load i18n search index', e);
            throw e;
        } finally {
            this.i18nLoadPromise = null;
        }
    }

    private async loadContentIndex(lang: string): Promise<void> {
        this.isContentLoading = true;
        try {
            const cacheKey = `content_search_cache_v2_${lang}`;
            const cached = localStorage.getItem(cacheKey);

            let docs: SearchResult[] = [];

            if (cached) {
                try {
                    docs = JSON.parse(cached);
                } catch {
                    localStorage.removeItem(cacheKey);
                }
            }

            // If no cache (or invalid), fetch from API
            if (!docs || docs.length === 0) {
                // Fetch in parallel
                /* 
                   BlogsService.getAllBlogs(1) returns { success, data: [], pagination } 
                   FaqsService.GetAllFAQS() returns { data: [] } (inferred)
                */
                const result = await firstValueFrom(
                    forkJoin({
                        blogs: this.blogsService.getAllBlogs(1).pipe(catchError(() => of({ data: [] }))),
                        faqs: this.faqsService.GetAllFAQS().pipe(catchError(() => of({ data: [] })))
                    })
                );

                // Process Blogs
                const blogsData = (result.blogs as any).data || [];
                const blogDocs = blogsData.map((b: any) => ({
                    id: `blog-${b.id}`,
                    lang,
                    title: b.title,
                    // Use 'url' as slug. Route: /blogs/BlogVeiw/:url
                    route: `/blogs/BlogVeiw/${b.url}`,
                    text: `${b.title} ${b.metaDescription || ''} ${b.category || ''}`,
                    source: 'blog'
                }));

                // Process FAQs
                const faqsData = (result.faqs as any).data || [];
                const faqDocs = faqsData.map((f: any) => {
                    const q = lang === 'ar' ? f.question : f.englishQuestion;
                    const a = lang === 'ar' ? f.answer : f.englishAnswer;
                    return {
                        id: `faq-${f.id}`,
                        lang,
                        title: q,
                        route: `/FAQS#faq-${f.id}`,
                        text: `${q} ${a}`,
                        source: 'faq'
                    };
                }).filter((d: any) => d.title && d.text); // validation

                docs = [...blogDocs, ...faqDocs];

                // Cache it
                localStorage.setItem(cacheKey, JSON.stringify(docs));
            }

            // Initialize Index
            this.contentIndex = new FlexSearch.Document({
                document: {
                    id: 'id',
                    index: ['title', 'text'],
                    store: true
                },
                tokenize: 'forward',
                context: true
            });

            for (const doc of docs) {
                this.contentIndex.add(doc);
            }

            this.isContentLoaded = true;

        } catch (e) {
            console.error('Failed to load content search index', e);
        } finally {
            this.isContentLoading = false;
        }
    }

    reset() {
        this.i18nIndex = null;
        this.contentIndex = null;
        this.isI18nLoaded = false;
        this.isContentLoaded = false;
        this.isContentLoading = false;
        this.currentLang = null;
    }

    async search(query: string, lang: string): Promise<SearchResult[]> {
        if (!isPlatformBrowser(this.platformId)) return [];

        await this.ensureReady(lang);

        if (!query || query.length < 2) return [];

        const promises = [];

        // Search I18n
        if (this.isI18nLoaded && this.i18nIndex) {
            promises.push(this.indexSearch(this.i18nIndex, query));
        }

        // Search Content (only if ready)
        if (this.isContentLoaded && this.contentIndex) {
            promises.push(this.indexSearch(this.contentIndex, query));
        }

        const results = await Promise.all(promises);
        const merged = results.flat();

        return this.prioritizeResults(merged, query).slice(0, 20);
    }

    private async indexSearch(index: any, query: string): Promise<SearchResult[]> {
        const raw = await index.search(query, {
            limit: 20,
            enrich: true,
            bool: "or"
        });

        const uniqueDocs = new Map<string, SearchResult>();

        raw.forEach((group: any) => {
            group.result.forEach((match: any) => {
                const doc = match.doc as SearchResult;
                if (!uniqueDocs.has(doc.id)) {
                    const snippet = this.generateSnippet(doc.text, query);
                    uniqueDocs.set(doc.id, { ...doc, snippet });
                }
            });
        });

        return Array.from(uniqueDocs.values());
    }

    private prioritizeResults(results: SearchResult[], query: string): SearchResult[] {
        const lowerQuery = query.toLowerCase();
        return results.sort((a, b) => {
            const aTitle = a.title.toLowerCase();
            const bTitle = b.title.toLowerCase();

            // Exact match priority
            const aExact = aTitle === lowerQuery;
            const bExact = bTitle === lowerQuery;
            if (aExact && !bExact) return -1;
            if (!aExact && bExact) return 1;

            // Starts with priority
            const aStart = aTitle.startsWith(lowerQuery);
            const bStart = bTitle.startsWith(lowerQuery);
            if (aStart && !bStart) return -1;
            if (!aStart && bStart) return 1;

            // Site pages priority over logs/faqs (optional, but good for UX)
            // if (a.source === 'site' && b.source !== 'site') return -1;
            // if (a.source !== 'site' && b.source === 'site') return 1;

            return 0;
        });
    }

    private generateSnippet(text: string, query: string): string {
        if (!text) return '';
        const lowerText = text.toLowerCase();
        const lowerQuery = query.toLowerCase();
        const index = lowerText.indexOf(lowerQuery);

        if (index === -1) return text.slice(0, 140) + '...';

        const start = Math.max(0, index - 60);
        const end = Math.min(text.length, index + 80);

        let snippet = text.slice(start, end);
        if (start > 0) snippet = '...' + snippet;
        if (end < text.length) snippet = snippet + '...';

        return snippet;
    }
}
