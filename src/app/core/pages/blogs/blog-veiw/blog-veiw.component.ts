// import { CommonModule, isPlatformBrowser } from '@angular/common';
// import { ChangeDetectorRef, Component, ElementRef, Inject, NgZone, PLATFORM_ID, ViewChild } from '@angular/core';
// import gsap from 'gsap';
// import ScrollTrigger from 'gsap/ScrollTrigger';
// import { Draggable } from "gsap/all";
// import InertiaPlugin from "gsap/InertiaPlugin";

// import SplitText from "gsap/SplitText";


// import { ActivatedRoute, RouterLink } from '@angular/router';
// import { NavbarThemeService } from '../../../components/navbar/navbar-theme.service';
// import { SectionsRegistryService } from '../../../shared/services/sections-registry.service';
// import { BlogsService } from '../services/blogs-service';
// import { AccordionComponent } from "../../../shared/accordion/accordion.component";


// gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, InertiaPlugin);
// type FaqItem = { question: string; answer: string; startOpen: boolean };

// @Component({
//   selector: 'app-blog-veiw',
//   imports: [CommonModule, AccordionComponent],
//   templateUrl: './blog-veiw.component.html',
//   styleUrl: './blog-veiw.component.scss'
// })
// export class BlogVeiwComponent {
//   swipeConfig: any;
//   isBrowser = false;

//   blog: any;
//   loading = true;
//   errorMsg = '';
//   constructor(
//     @Inject(PLATFORM_ID) private platformId: Object,
//     private ngZone: NgZone,
//     private cdr: ChangeDetectorRef,
//     private navTheme: NavbarThemeService,
//     private sectionsRegistry: SectionsRegistryService,
//     private route: ActivatedRoute,
//     private blogsService: BlogsService
//   ) {
//     this.isBrowser = isPlatformBrowser(this.platformId);
//   }
//   ngOnInit(): void {
//     const url = this.route.snapshot.paramMap.get('url'); // ✅ ده الـ :url

//     if (!url) {
//       this.loading = false;
//       this.errorMsg = 'الرابط غير صحيح';
//       return;
//     }

//     this.blogsService.getBlogByName(url).subscribe({
//       next: (res: any) => {
//         this.blog = res.data; // حسب شكل الـ API عندك
//         this.loading = false;
//       },
//       error: () => {
//         this.loading = false;
//         this.errorMsg = 'تعذر تحميل المقال';
//       }
//     });
//   }


//   ngAfterViewInit(): void {
//     if (!isPlatformBrowser(this.platformId)) return;
//     this.navTheme.setColor('var(--primary)');

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
import { ChangeDetectorRef, Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Draggable } from "gsap/all";
import InertiaPlugin from "gsap/InertiaPlugin";
import SplitText from "gsap/SplitText";
import { ActivatedRoute } from '@angular/router';
import { NavbarThemeService } from '../../../components/navbar/navbar-theme.service';
import { SectionsRegistryService } from '../../../shared/services/sections-registry.service';
import { BlogsService } from '../services/blogs-service';
import { AccordionComponent } from "../../../shared/accordion/accordion.component";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, InertiaPlugin);

@Component({
  selector: 'app-blog-veiw',
  imports: [CommonModule, AccordionComponent],
  templateUrl: './blog-veiw.component.html',
  styleUrl: './blog-veiw.component.scss'
})
export class BlogVeiwComponent {
  isBrowser = false;

  blog: any;
  blogHtml: SafeHtml = '';
  loading = true;
  errorMsg = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private navTheme: NavbarThemeService,
    private sectionsRegistry: SectionsRegistryService,
    private route: ActivatedRoute,
    private blogsService: BlogsService,
    private sanitizer: DomSanitizer
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    const rawParam = this.route.snapshot.paramMap.get('url');

    if (!rawParam) {
      this.loading = false;
      this.errorMsg = 'الرابط غير صحيح';
      return;
    }

    // ✅ يقبل /BlogVeiw/ERP أو /BlogVeiw/blog:draft:ERP
    const url = rawParam.startsWith('blog:draft:')
      ? rawParam.replace('blog:draft:', '')
      : rawParam;

    // ✅ 1) LocalStorage First
    if (this.isBrowser) {
      const key = `blog:draft:${url}`;
      const raw = localStorage.getItem(key);

      if (raw) {
        try {
          this.blog = JSON.parse(raw);

          // ✅ Fix any old body shape (list items objects) before render
          const fixedBody = this.fixEditorJsBody(this.blog.body);
          this.blogHtml = this.sanitizer.bypassSecurityTrustHtml(
            this.renderEditorJsBody(fixedBody)
          );

          this.loading = false;
          return;
        } catch {
          // ignore and fallback
        }
      }
    }

    // ✅ 2) Fallback API
    this.blogsService.getBlogByName(url).subscribe({
      next: (res: any) => {
        this.blog = res.data;

        const fixedBody = this.fixEditorJsBody(this.blog?.body);
        this.blogHtml = this.sanitizer.bypassSecurityTrustHtml(
          this.renderEditorJsBody(fixedBody)
        );

        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMsg = 'تعذر تحميل المقال';
      }
    });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.navTheme.setColor('var(--primary)');
  }

  ngOnDestroy(): void {
    this.sectionsRegistry.clear();
    this.sectionsRegistry.disable();
    if (this.isBrowser) ScrollTrigger.getAll().forEach(t => t.kill());
  }

  // =========================================================
  // ✅ FIX / MIGRATE EditorJS body (especially list items)
  // =========================================================
  private fixEditorJsBody(body: any): any {
    if (!body) return body;

    let data: any;
    try {
      data = typeof body === 'string' ? JSON.parse(body) : body;
    } catch {
      return body;
    }

    if (!Array.isArray(data?.blocks)) return body;

    const normalizeItem = (it: any): any => {
      // string already ok
      if (typeof it === 'string') return it;

      // object item (nested list)
      const content = it?.content ?? it?.text ?? '';
      const nested = Array.isArray(it?.items) ? it.items.map(normalizeItem) : [];

      // keep nested form if exists
      if (nested.length) return { content, items: nested };

      // fallback to string
      return content;
    };

    data.blocks.forEach((b: any) => {
      if (b?.type === 'list' && Array.isArray(b?.data?.items)) {
        b.data.items = b.data.items.map(normalizeItem);
      }
    });

    return data;
  }

  // =========================================================
  // ✅ Renderer (EditorJS JSON -> HTML)
  // =========================================================
  private renderEditorJsBody(body: any): string {
    if (!body) return '';

    let data: any;

    try {
      data = typeof body === 'string' ? JSON.parse(body) : body;
    } catch {
      // plain text fallback
      return `<p>${this.escapeHtml(String(body))}</p>`;
    }

    const blocks = Array.isArray(data?.blocks) ? data.blocks : [];
    return blocks.map((b: any) => this.renderBlock(b)).join('\n');
  }

  private renderBlock(block: any): string {
    if (!block?.type) return '';

    switch (block.type) {
      case 'header': {
        const level = Number(block?.data?.level) || 2;
        const text = block?.data?.text ?? '';
        const tag = `h${Math.min(Math.max(level, 1), 6)}`;
        return `<${tag}>${text}</${tag}>`;
      }

      case 'paragraph': {
        const text = block?.data?.text ?? '';
        return `<p>${text}</p>`;
      }

      // ✅ FIXED LIST: supports string items + object items + nested
      case 'list': {
        const style = block?.data?.style === 'ordered' ? 'ol' : 'ul';
        const itemsArr = Array.isArray(block?.data?.items) ? block.data.items : [];

        const renderItem = (it: any): string => {
          if (typeof it === 'string') return `<li>${it}</li>`;

          const content = it?.content ?? it?.text ?? '';
          const nested = Array.isArray(it?.items) && it.items.length
            ? `<ul>${it.items.map(renderItem).join('')}</ul>`
            : '';

          return `<li>${content}${nested}</li>`;
        };

        return `<${style}>${itemsArr.map(renderItem).join('')}</${style}>`;
      }

      case 'image': {
        const url = block?.data?.file?.url ?? '';
        const caption = block?.data?.caption ?? '';
        return `
          <figure>
            <img src="${this.escapeAttr(url)}" alt="${this.escapeAttr(caption)}" />
            ${caption ? `<figcaption>${caption}</figcaption>` : ''}
          </figure>
        `;
      }

      case 'embed': {
        const embed = block?.data?.embed ?? '';
        return embed
          ? `<div class="embed"><iframe src="${this.escapeAttr(embed)}" loading="lazy" allowfullscreen></iframe></div>`
          : '';
      }

      case 'quote': {
        const text = block?.data?.text ?? '';
        const caption = block?.data?.caption ?? '';
        return `
          <blockquote>
            ${text}
            ${caption ? `<footer>${caption}</footer>` : ''}
          </blockquote>
        `;
      }

      case 'delimiter':
        return `<hr />`;

      case 'code': {
        const code = block?.data?.code ?? '';
        return `<pre><code>${this.escapeHtml(code)}</code></pre>`;
      }

      default:
        return '';
    }
  }

  private escapeHtml(s: string) {
    return s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  }

  private escapeAttr(s: string) {
    return String(s ?? '').replaceAll('"', '&quot;');
  }

  // ✅ optional: load latest draft manually
  loadLatestDraftFromLocalStorage() {
    if (!this.isBrowser) return;

    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('blog:draft:')) keys.push(k);
    }
    const lastKey = keys[keys.length - 1];
    if (!lastKey) return;

    const raw = localStorage.getItem(lastKey);
    if (!raw) return;

    this.blog = JSON.parse(raw);

    const fixedBody = this.fixEditorJsBody(this.blog.body);
    this.blogHtml = this.sanitizer.bypassSecurityTrustHtml(
      this.renderEditorJsBody(fixedBody)
    );

    this.loading = false;
  }
}
