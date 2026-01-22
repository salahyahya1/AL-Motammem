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
import { ChangeDetectorRef, Component, HostListener, Inject, NgZone, PLATFORM_ID, TemplateRef, makeStateKey, TransferState, ViewChild, ViewContainerRef } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Draggable } from "gsap/all";
import InertiaPlugin from "gsap/InertiaPlugin";
import SplitText from "gsap/SplitText";
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavbarThemeService } from '../../../components/navbar/navbar-theme.service';
import { SectionsRegistryService } from '../../../shared/services/sections-registry.service';
import { BlogsService } from '../services/blogs-service';
import { AccordionComponent } from "../../../shared/accordion/accordion.component";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../shared/services/language.service';
import { DialogButton, MessegeDialogComponent } from "../../../shared/messege-dialog/messege-dialog.component";
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Title, Meta } from '@angular/platform-browser';
import { SeoLinkService } from '../../../services/seo-link.service';


const BLOG_KEY = (slug: string) => makeStateKey<any>(`blog_${slug}`);

gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, InertiaPlugin);

@Component({
  selector: 'app-blog-veiw',
  imports: [CommonModule, AccordionComponent, TranslatePipe, RouterLink, MessegeDialogComponent],
  templateUrl: './blog-veiw.component.html',
  styleUrl: './blog-veiw.component.scss'
})
export class BlogVeiwComponent {
  isBrowser = false;
  @ViewChild('deleteConfirmTpl2') deleteConfirmTpl2!: TemplateRef<any>;
  blog: any;
  blogHtml: SafeHtml = '';
  loading = true;
  errorMsg = '';
  isAuthenticated = false;
  hasrole = false;
  role: any;
  //
  dialogVariant: 'success' | 'error' = 'success';
  dialogTitle = '';
  dialogMessage = '';
  dialogButtons: DialogButton[] = [];
  dialogOpen = false;
  private overlayRef?: OverlayRef;
  private pendingDeleteId: number | null = null;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private navTheme: NavbarThemeService,
    private sectionsRegistry: SectionsRegistryService,
    private route: ActivatedRoute,
    private blogsService: BlogsService,
    private sanitizer: DomSanitizer,
    private overlay: Overlay,
    private router: Router,
    private vcr: ViewContainerRef, private language: LanguageService,
    private transfer: TransferState,
    private title: Title,
    private meta: Meta,
    private seoLinks: SeoLinkService
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
    if (this.isBrowser) {
      this.isAuthenticated = this.blogsService.isAuthenticated();
      this.role = localStorage.getItem('role')
      this.hasrole = this.role ? true : false;
    }

    // ✅ يقبل /BlogVeiw/ERP أو /BlogVeiw/blog:draft:ERP
    // const url = rawParam.startsWith('blog:draft:')
    //   ? rawParam.replace('blog:draft:', '')
    //   : rawParam;

    // ✅ 1) LocalStorage First
    // if (this.isBrowser) {
    //   const key = `blog:draft:${url}`;
    //   const raw = localStorage.getItem(key);

    //   if (raw) {
    //     try {
    //       this.blog = JSON.parse(raw);

    //       // ✅ Fix any old body shape (list items objects) before render
    //       const fixedBody = this.fixEditorJsBody(this.blog.body);
    //       this.blogHtml = this.sanitizer.bypassSecurityTrustHtml(
    //         this.renderEditorJsBody(fixedBody)
    //       );

    //       this.loading = false;
    //       return;
    //     } catch {
    //       // ignore and fallback
    //     }
    //   }
    // }
    const cached = this.transfer.get(BLOG_KEY(rawParam), null as any);
    if (cached) {
      this.applyBlog(cached);
      this.transfer.remove(BLOG_KEY(rawParam));
      return;
    }
    // ✅ 2) Fallback API
    this.blogsService.getBlogByName(rawParam).subscribe({
      next: (res: any) => {
        this.blog = res.data;
        if (!this.isBrowser) this.transfer.set(BLOG_KEY(rawParam), this.blog);
        this.applyBlog(this.blog);
        // const fixedBody = this.fixEditorJsBody(this.blog?.body);
        // console.log(this.blog.faqs);
        // this.blogHtml = this.sanitizer.bypassSecurityTrustHtml(
        //   this.renderEditorJsBody(fixedBody)
        // );

        // this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMsg = 'تعذر تحميل المقال';
      }
    });

  }
  private applyBlog(data: any) {
    this.blog = data;
    this.setSeoForBlog(this.blog);
    const fixedBody = this.fixEditorJsBody(this.blog?.body);
    this.blogHtml = this.sanitizer.bypassSecurityTrustHtml(
      this.renderEditorJsBody(fixedBody)
    );
    this.loading = false;
  }
  private setSeoForBlog(blog: any) {
    const siteName = 'Al-Motammem';
    const pageTitle = blog?.metaTitle || blog?.title || 'مدونه';
    const desc = blog?.metaDescription || '';
    const image = blog?.mainImage || 'https://www.almotammem.com/images/Icon.webp';

    // ✅ URL الحالي (على السيرفر والعميل)
    const url =
      (typeof window !== 'undefined' && window.location?.href)
        ? window.location.href
        : `https://almotammem.com/blogs/BlogVeiw/${blog?.englishURL || blog?.url}`;

    // ---- Title + Description
    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: desc });

    // ---- Robots (اختياري)
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });

    // ---- OpenGraph
    this.meta.updateTag({ property: 'og:type', content: 'article' });
    this.meta.updateTag({ property: 'og:site_name', content: siteName });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: desc });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: image });

    // ---- Twitter
    this.meta.updateTag({ name: 'twitter:url', content: url });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: desc });
    this.meta.updateTag({ name: 'twitter:image', content: image });
    if (blog?.createdAt) this.meta.updateTag({ property: 'article:published_time', content: blog.createdAt });
    if (blog?.updatedAt) this.meta.updateTag({ property: 'article:modified_time', content: blog.updatedAt });

    this.seoLinks.setCanonical(url);

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
  get isRtl() {
    return this.language.currentLang === 'ar';
  }
  DeleteBlog(id: number) {

  }
  openDeletePopover(ev: MouseEvent, id: number) {
    ev.stopPropagation();

    const origin = ev.currentTarget as HTMLElement;
    this.pendingDeleteId = id;

    // this.closeDeletePopover();

    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(origin).withFlexibleDimensions(false)
      .withGrowAfterOpen(false)
      .withPush(false)
      .withPositions([
        { originX: 'end', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 8, offsetX: 8 },
        { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -8, offsetX: 8 },
        { originX: 'start', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 8, offsetX: -8 },
      ])
      .withPush(true);


    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      panelClass: 'delete-popover-panel'
    });

    const overlayEl = this.overlayRef.overlayElement;
    this.overlayRef.backdropClick().subscribe(() => this.closeDeletePopover());
    this.overlayRef.keydownEvents().subscribe((e) => {
      if (e.key === 'Escape') this.closeDeletePopover();
    });

    const portal = new TemplatePortal(this.deleteConfirmTpl2, this.vcr);
    this.overlayRef.attach(portal);
  }

  closeDeletePopover() {
    this.overlayRef?.detach();
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
    this.pendingDeleteId = null;
  }

  confirmDeletePopover() {
    if (!this.pendingDeleteId) return;
    const id = this.pendingDeleteId;

    this.closeDeletePopover();

    this.blogsService.DeleteBlog(id).subscribe({
      next: () => {
        // ✅ Update UI بدون reload كامل
        this.dialogVariant = 'success';
        this.dialogTitle = 'تم حذف المقال بنجاح';
        this.dialogMessage = '';
        this.dialogButtons = [{ id: 'show all', text: 'عرض كل المقالات', style: 'outline' }];
        this.dialogOpen = true;
      },
      error: (err) => {
        this.dialogVariant = 'error';
        this.dialogTitle = 'تعذر حذف المقال';
        this.dialogMessage = err?.error?.message || '';
        this.dialogButtons = [
          { id: 'cancel', text: 'الغاء', style: 'outline' },
          { id: 'retry', text: 'حاول مرة أخرى', style: 'danger' },
        ];
        this.dialogOpen = true;
      }
    });
  }

  onDialogAction(id: string) {
    if (id === 'show all') {
      this.dialogOpen = false;
      //خليه يرجع لصفحه البلوجز
      this.router.navigate(['/blogs']);
    }
    if (id === 'show edited blog') {
      this.dialogOpen = false;
    }
    if (id === 'retry') {
      this.dialogOpen = false;
    }
    if (id === 'cancel') {
      this.dialogOpen = false;
    }
  }
  StoreSource() {
    if (!this.isBrowser) return;
    sessionStorage.setItem('source', 'ViewBlog');
  }

  closeDialog() {
    this.router.navigate(['/blogs']);
    this.dialogOpen = false;
  }
}
