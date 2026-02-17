import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
// @ts-ignore
import FlexSearch from 'flexsearch';
import { BlogsService } from '../pages/blogs/services/blogs-service';
import { FaqsService } from '../pages/faqs/Faqs-service';
import { TranslateService } from '@ngx-translate/core';

export interface SearchResult {
  id: string;
  lang: string;
  key?: string; // for i18n
  title: string;
  route: string;
  fragment?: string;

  // ✅ نص للعرض/snippet (بدون keys)
  snippetText?: string;

  // ✅ نص للبحث (ممكن يحتوي keys)
  text: string;

  snippet?: string;
  source: 'site' | 'blog' | 'faq';
}

@Injectable({ providedIn: 'root' })
export class SiteSearchService {
  private i18nIndex: any = null;
  private contentIndex: any = null;

  private currentLang: string | null = null;

  private isI18nLoaded = false;
  private isContentLoaded = false;
  private isContentLoading = false;

  private i18nLoadPromise: Promise<void> | null = null;
  private contentLoadPromise: Promise<void> | null = null;

  // ✅ retry guards
  private contentRetryCount: Record<string, number> = {};
  private maxContentRetries = 2;
  private contentRetryTimers: Record<string, any> = {};

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private blogsService: BlogsService,
    private faqsService: FaqsService,
    private translate: TranslateService
  ) { }

  private normalizeLang(lang: string): string {
    return (lang || '').toLowerCase().split('-')[0]; // ar-EG -> ar, en-US -> en
  }

  /**
   * Translate a value if it's a key.
   * If translate.instant returns the same input => treat as "not translated" and return empty string
   * (to avoid showing keys in UI/snippet).
   */
  private resolveI18nText(value?: string): string {
    if (!value) return '';
    const out = this.translate.instant(value);
    if (!out || typeof out !== 'string') return '';
    if (out === value) return ''; // ✅ still a key or missing translation
    return out;
  }

  /**
   * Ensure i18n index is ready ASAP.
   * Content index loads in background (does NOT block first search).
   */
  async ensureReady(lang: string): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    const normLang = this.normalizeLang(lang);

    // Reset if language changed
    if (this.currentLang && this.currentLang !== normLang) {
      this.reset();
    }
    this.currentLang = normLang;

    // Start Content Load in background
    if (!this.isContentLoaded && !this.isContentLoading && !this.contentLoadPromise) {
      this.contentLoadPromise = this.loadContentIndex(normLang);
    }

    // Start i18n Load if not started
    if (!this.isI18nLoaded && !this.i18nLoadPromise) {
      this.i18nLoadPromise = this.loadI18nIndex(normLang);
    }

    // IMPORTANT: wait فقط على i18n (عشان السرش يشتغل فورًا)
    if (this.i18nLoadPromise) {
      try {
        await this.i18nLoadPromise;
      } catch (e) {
        // keep behavior (was console.error only)
      }
    }
  }

  private async loadI18nIndex(lang: string): Promise<void> {
    try {
      // خليها relative عشان baseHref/virtual dir مايكسرش
      const data = await firstValueFrom(this.http.get<{ docs: any[] }>('search-index.json'));

      this.i18nIndex = new FlexSearch.Document({
        document: {
          id: 'id',
          index: ['title', 'text', 'key'], // ✅ index للـ key كمان
          store: true,
        },
        tokenize: 'forward',
        context: true,
      });

      const langDocs = (data?.docs || [])
        .filter((d) => this.normalizeLang(d?.lang || '') === lang)
        .map((d) => ({ ...d, source: 'site' as const }));

      for (const doc of langDocs) {
        // fragment based on key
        if (doc.key) {
          doc.fragment = this.getFragmentForKey(doc.key);
        }

        // ✅ نصوص مترجمة (لو مش مترجمة هترجع '')
        const resolvedTitle = this.resolveI18nText(doc.title || doc.key);
        const resolvedText = this.resolveI18nText(doc.text);

        // ✅ ده للبحث: خلي keys + النص الأصلي + المترجم (عشان searchability)
        const mergedText = `${doc.key || ''} ${doc.title || ''} ${resolvedTitle} ${doc.text || ''} ${resolvedText}`.trim();

        // ✅ ده للعرض/snippet فقط (بدون keys)
        const displayTitle = resolvedTitle || doc.title || doc.key || '';
        const snippetText = `${displayTitle} ${resolvedText || ''}`.trim();

        this.i18nIndex.add({
          ...doc,
          title: displayTitle,
          text: mergedText,        // ✅ للبحث (ممكن يحتوي keys)
          snippetText: snippetText // ✅ للعرض/snippet (مترجم قدر الإمكان وبدون keys)
        });
      }

      this.isI18nLoaded = true;
    } catch (e) {
      throw e;
    } finally {
      this.i18nLoadPromise = null;
    }
  }

  private getFragmentForKey(key: string): string | undefined {
    // Home
    if (key.includes('HOME.HERO') || key.includes('HOME.INDECATORS')) return 'section1-home';
    if (key.includes('HOME.STATUS')) return 'section2-home';
    if (key.includes('HOME.SECTION3')) return 'section3-home';
    if (key.includes('HOME.APPLICATIONS')) return 'section4-home';
    if (key.includes('HOME.TESTIMONIALS')) return 'section5-home';
    if (key.includes('HOME.INTEGRATIONS')) return 'section6-home';
    if (key.includes('HOME.PLANS')) return 'section7-home';
    if (key.includes('HOME.CONTACT-US')) return 'section8-home';

    // About
    if (key.includes('ABOUT.HERO')) return 'AboutSection1';
    if (key.includes('ABOUT.SECTION2')) return 'AboutSection2';
    if (key.includes('ABOUT.SECTION3.VISION')) return 'AboutSection3::VISION';
    if (key.includes('ABOUT.SECTION3.MISSION')) return 'AboutSection3::MISSION';
    if (key.includes('ABOUT.SECTION3.MESSAGE')) return 'AboutSection3::MESSAGE';
    if (key.includes('ABOUT.SECTION3')) return 'AboutSection3';
    if (key.includes('ABOUT.SECTION4')) return 'AboutSection4';
    if (key.includes('ABOUT.SECTION5')) return 'AboutSection5';

    // Solutions
    if (key.includes('SOLUTIONS.HERO')) return 'solutionsSection1';
    if (key.includes('SOLUTIONS.SECTION2')) return 'solutionsSection2';
    if (key.includes('SOLUTIONS.SECTION3')) return 'solutionsSection3';
    if (key.includes('SOLUTIONS.SECTION4')) return 'solutionsSection4';
    if (key.includes('SOLUTIONS.SECTION5')) return 'solutionsSection5';
    if (key.includes('SOLUTIONS.CONSULTATION')) return 'solutionsSection6';

    // Products
    if (key.includes('PRODUCTS.SECTION1')) return 'productSection1';
    if (key.includes('PRODUCTS.SECTION2')) return 'productSection2';
    if (key.includes('PRODUCTS.SECTION3')) return 'productSection3';
    if (key.includes('PRODUCTS.SECTION4')) return 'productSection4';
    if (key.includes('PRODUCTS.SECTION5')) return 'productSection5';
    if (key.includes('PRODUCTS.SECTION6')) return 'productSection6';
    if (key.includes('PRODUCTS.SECTION7')) return 'productSection7';
    if (key.includes('PRODUCTS.SECTION8')) return 'productSection8';

    return undefined;
  }

  /**
   * Limited fetch for blogs (avoid too many requests).
   */
  private async fetchAllBlogsLimited(): Promise<any[]> {
    const all: any[] = [];
    let page = 1;
    const maxPagesSafety = 10;  // ✅ reduce requests
    const maxBlogsCap = 200;    // ✅ reduce memory/size

    while (page <= maxPagesSafety && all.length < maxBlogsCap) {
      const res: any = await firstValueFrom(
        this.blogsService.getAllBlogs(page).pipe(catchError(() => of(null)))
      );

      const items = Array.isArray(res?.data) ? res.data : [];
      if (!items.length) break;

      all.push(...items);
      page++;
    }

    return all.slice(0, maxBlogsCap);
  }

  private scheduleContentRetry(lang: string) {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.isContentLoading || this.isContentLoaded) return;

    const c = (this.contentRetryCount[lang] || 0);
    if (c >= this.maxContentRetries) {
      return;
    }

    // ✅ prevent stacking multiple timers
    if (this.contentRetryTimers[lang]) return;

    this.contentRetryCount[lang] = c + 1;

    this.contentRetryTimers[lang] = setTimeout(() => {
      this.contentRetryTimers[lang] = null;

      // still needs retry?
      if (!this.isContentLoading && !this.isContentLoaded) {
        this.contentLoadPromise = this.loadContentIndex(lang);
      }
    }, 2000);
  }

  private async loadContentIndex(lang: string): Promise<void> {
    this.isContentLoading = true;

    try {
      const cacheKey = `content_search_cache_v3_${lang}`;
      const cached = localStorage.getItem(cacheKey);

      let docs: SearchResult[] = [];

      // ✅ Read cache first (and treat empty as invalid)
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            docs = parsed;
          } else {
            localStorage.removeItem(cacheKey);
          }
        } catch {
          localStorage.removeItem(cacheKey);
        }
      }

      // ✅ Cache MISS → fetch from APIs
      if (!docs || docs.length === 0) {
        const [blogsData, faqsRes] = await Promise.all([
          this.fetchAllBlogsLimited(),
          firstValueFrom(this.faqsService.GetAllFAQS().pipe(catchError(() => of(null)))),
        ]);

        const blogDocs: SearchResult[] = (blogsData || []).map((b: any) => ({
          id: `blog-${b.id}`,
          lang,
          title: b.title,
          route: `/blogs/blog/${b.url}`,
          text: `${b.title} ${b.metaDescription || ''} ${b.category || ''}`,
          snippetText: `${b.title} ${b.metaDescription || ''} ${b.category || ''}`.trim(),
          source: 'blog',
        }));

        const faqsData = Array.isArray((faqsRes as any)?.data) ? (faqsRes as any).data : [];
        const faqDocs: SearchResult[] = (faqsData || [])
          .map((f: any) => {
            const q = lang === 'ar' ? f.question : f.englishQuestion;
            const a = lang === 'ar' ? f.answer : f.englishAnswer;
            return {
              id: `faq-${f.id}`,
              lang,
              title: q,
              route: `/FAQS`,
              fragment: `faq-${f.id}`,
              text: `${q} ${a}`,
              snippetText: `${q} ${a}`.trim(),
              source: 'faq',
            } as SearchResult;
          })
          .filter((d: any) => d.title && d.text);

        docs = [...blogDocs, ...faqDocs];

        if (docs.length > 0) {
          localStorage.setItem(cacheKey, JSON.stringify(docs));
          this.contentRetryCount[lang] = 0; // reset
        } else {
          // ✅ retry safely
          this.scheduleContentRetry(lang);
        }
      }

      // ✅ If still empty: do NOT mark loaded, and do NOT build empty index
      if (!docs || docs.length === 0) {
        this.contentIndex = null;
        this.isContentLoaded = false;
        return;
      }

      this.contentIndex = new FlexSearch.Document({
        document: { id: 'id', index: ['title', 'text'], store: true },
        tokenize: 'forward',
        context: true,
      });

      for (const doc of docs) this.contentIndex.add(doc);

      this.isContentLoaded = true;
    } catch (e) {
      this.isContentLoaded = false;
    } finally {
      this.isContentLoading = false;
      this.contentLoadPromise = null;
    }
  }

  reset() {
    this.i18nIndex = null;
    this.contentIndex = null;

    this.isI18nLoaded = false;
    this.isContentLoaded = false;
    this.isContentLoading = false;

    this.currentLang = null;

    this.i18nLoadPromise = null;
    this.contentLoadPromise = null;

    // ✅ clear retry state/timers
    this.contentRetryCount = {};
    Object.keys(this.contentRetryTimers).forEach(k => {
      try { clearTimeout(this.contentRetryTimers[k]); } catch { }
    });
    this.contentRetryTimers = {};
  }

  async search(query: string, lang: string): Promise<SearchResult[]> {
    if (!isPlatformBrowser(this.platformId)) return [];

    const normLang = this.normalizeLang(lang);
    await this.ensureReady(normLang);

    if (!query || query.trim().length < 2) return [];

    const promises: Promise<SearchResult[]>[] = [];

    if (this.isI18nLoaded && this.i18nIndex) {
      promises.push(this.indexSearch(this.i18nIndex, query));
    }

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
      bool: 'or',
    });

    const uniqueDocs = new Map<string, SearchResult>();

    raw.forEach((group: any) => {
      group.result.forEach((match: any) => {
        const doc = match.doc as SearchResult;
        if (!uniqueDocs.has(doc.id)) {
          const base = (doc.snippetText && doc.snippetText.trim())
            ? doc.snippetText
            : (doc.title || '');

          const snippet = this.generateSnippet(base, query);
          uniqueDocs.set(doc.id, { ...doc, snippet });
        }
      });
    });

    return Array.from(uniqueDocs.values());
  }

  private prioritizeResults(results: SearchResult[], query: string): SearchResult[] {
    const lowerQuery = query.toLowerCase();

    return results.sort((a, b) => {
      const aTitle = (a.title || '').toLowerCase();
      const bTitle = (b.title || '').toLowerCase();

      const aExact = aTitle === lowerQuery;
      const bExact = bTitle === lowerQuery;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;

      const aStart = aTitle.startsWith(lowerQuery);
      const bStart = bTitle.startsWith(lowerQuery);
      if (aStart && !bStart) return -1;
      if (!aStart && bStart) return 1;

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
