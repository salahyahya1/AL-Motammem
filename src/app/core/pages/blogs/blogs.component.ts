import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  NgZone,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ViewContainerRef, TemplateRef } from '@angular/core';

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/all';
import InertiaPlugin from 'gsap/InertiaPlugin';
import SplitText from 'gsap/SplitText';

import Swiper from 'swiper';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavbarThemeService } from '../../components/navbar/navbar-theme.service';
import { SectionsRegistryService } from '../../shared/services/sections-registry.service';
import { OpenFormDialogDirective } from '../../shared/Directives/open-form-dialog.directive';
import { BlogApiItem, BlogsService } from './services/blogs-service';
import { finalize } from 'rxjs';
import { DialogButton, MessegeDialogComponent } from "../../shared/messege-dialog/messege-dialog.component";
import { SafeHtml } from '@angular/platform-browser';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../shared/services/language.service';
gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, InertiaPlugin);
import { TransferState, makeStateKey } from '@angular/core';

const MOST_READ_KEY = makeStateKey<any>('mostReadBlogs');
const ALL_BLOGS_KEY = makeStateKey<any>('allBlogs_page1');

@Component({
  selector: 'app-blogs',
  imports: [CommonModule, RouterLink, OpenFormDialogDirective, MessegeDialogComponent, OverlayModule, PortalModule, TranslatePipe],
  templateUrl: './blogs.component.html',
  styleUrl: './blogs.component.scss'
})
export class BlogsComponent {
  isBrowser = false;
  page: number = 1
  totalPages!: number
  BlogsTitleSplit: any;
  BlogsSubtitleSplit: any;

  mostReadArticles: BlogApiItem[] = [];
  allBlogs: BlogApiItem[] = [];

  loadingMostRead = true;
  loadingAllBlogs = true;

  private swiper2?: Swiper;
  //
  dialogVariant: 'success' | 'error' = 'success';
  dialogTitle = '';
  dialogMessage = '';
  dialogButtons: DialogButton[] = [];
  dialogOpen = false;

  // Flags to control init once
  viewReady = false;
  uiInitialized = false;
  isAuthenticated = false;
  hasrole = false;
  role: any;
  // refresh batching
  private refreshTimer: any = null;

  get isLoading(): boolean {
    return this.loadingMostRead || this.loadingAllBlogs;
  }
  private overlayRef?: OverlayRef;
  private pendingDeleteId: number | null = null;

  @ViewChild('deleteConfirmTpl') deleteConfirmTpl!: TemplateRef<any>;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private navTheme: NavbarThemeService,
    private sectionsRegistry: SectionsRegistryService,
    private blogsService: BlogsService,
    private router: Router,
    private route: ActivatedRoute,
    private overlay: Overlay,
    private vcr: ViewContainerRef, private language: LanguageService,
    private transfer: TransferState
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  private _swiperEl2?: ElementRef<HTMLDivElement>;

  @ViewChild('swiperEl2')
  set swiperEl2Setter(el: ElementRef<HTMLDivElement> | undefined) {
    this._swiperEl2 = el;
    this.tryInitUI();
  }

  get swiperEl2(): ElementRef<HTMLDivElement> | undefined {
    return this._swiperEl2;
  }


  articles: any[] = [];

  ngOnInit(): void {
    this.loadMostRead();
    this.loadAllBlogs(this.page);
    if (this.isBrowser) {
      this.navTheme.setColor('var(--primary)');
      this.navTheme.setBg('#F8F9FB');
      this.isAuthenticated = this.blogsService.isAuthenticated();
      this.role = localStorage.getItem('role')
      this.hasrole = this.role ? true : false;
    }
  }
  private uiCtx?: gsap.Context;
  private onResizeCD = () => {
    this.ngZone.run(() => this.cdr.detectChanges());
  };

  private onResize = () => ScrollTrigger.refresh();

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.viewReady = true;
    // this.ctx5 = gsap.context(() => {
    //   this.tryInitUI();
    //   window.addEventListener('resize', this.onResize);
    //   ScrollTrigger.refresh();
    // });
    this.ngZone.runOutsideAngular(() => {
      this.tryInitUI();
      window.addEventListener('resize', this.onResizeCD);
      window.addEventListener('resize', this.onResize);
      ScrollTrigger.refresh();


    });
  }

  private tryInitUI(): void {
    if (!this.isBrowser) return;
    if (this.uiInitialized) return;

    const el = this._swiperEl2?.nativeElement;
    console.log('swiperEl2:', el);

    if (!el) return;

    this.uiInitialized = true;
    this.initMainSwiper();
  }
  private initialMostReadLoaded = false;
  private initialAllBlogsLoaded = false;

  get showInitialLoader(): boolean {
    return (!this.initialMostReadLoaded || !this.initialAllBlogsLoaded) && this.isLoading;
  }

  get showOverlayLoader(): boolean {
    // بعد أول تحميل، لو في أي تحميل جديد → Overlay صغير
    const initialDone = this.initialMostReadLoaded && this.initialAllBlogsLoaded;
    return initialDone && this.isLoading;
  }
  private scheduleScrollRefresh(): void {
    if (!this.isBrowser) return;

    if (this.refreshTimer) clearTimeout(this.refreshTimer);
    this.refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
      this.refreshTimer = null;
    }, 0);
  }

  private initMainSwiper(): void {
    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          this.uiCtx?.revert();

          this.uiCtx = gsap.context(() => {
            const BlogsTitle = document.querySelector('#title') as HTMLElement | null;
            const BlogsSubtitle = document.querySelector('#Desc') as HTMLElement | null;
            const Addbutton = document.querySelector('#Addbutton') as HTMLElement | null;
            const showMore = document.querySelector('#showMore') as HTMLElement | null;
            if (!BlogsTitle || !BlogsSubtitle) {
              console.warn('⚠️ عناصر العنوان/الوصف مش موجودة لـ SplitText');
              return;
            }

            this.BlogsTitleSplit = new SplitText(BlogsTitle, { type: 'words' });
            this.BlogsSubtitleSplit = new SplitText(BlogsSubtitle, { type: 'words' });

            const tl = gsap.timeline({
              defaults: { ease: 'power3.out' },
              scrollTrigger: { trigger: '#knowledge-center' }
            });

            tl.fromTo(
              this.BlogsTitleSplit.words,
              { opacity: 0, visibility: 'visible' },
              {
                opacity: 1,
                duration: 0.2,
                ease: 'sine.out',
                stagger: 0.02,
                onStart: () => {
                  gsap.set(BlogsTitle, { opacity: 1, visibility: 'visible' });
                }
              }
            );

            tl.fromTo(
              this.BlogsSubtitleSplit.words,
              { opacity: 0, visibility: 'visible' },
              {
                opacity: 1,
                duration: 0.2,
                ease: 'sine.out',
                stagger: 0.02,
                onStart: () => {
                  gsap.set(BlogsSubtitle, { opacity: 1, visibility: 'visible' });
                }
              }
            );
            tl.fromTo('#Addbutton', { opacity: 0, visibility: 'hidden' }, { opacity: 1, visibility: 'visible', duration: 0.2 });
            tl.fromTo('#btn1', { opacity: 0, visibility: 'hidden' }, { opacity: 1, visibility: 'visible', duration: 0.2 });
            if (showMore) {
              tl.fromTo('#showMore', { opacity: 0, visibility: 'hidden' }, { opacity: 1, visibility: 'visible', duration: 0.2 });
            }

            tl.fromTo('#blogs-bottom', { opacity: 0, visibility: 'hidden' }, { opacity: 1, visibility: 'visible', duration: 0.2 });



            Swiper.use([Navigation, Pagination]);

            const canLoop = (this.articles?.length ?? 0) > 1;

            this.swiper2 = new Swiper(this._swiperEl2!.nativeElement, {
              modules: [Navigation, Pagination, Autoplay],
              direction: 'horizontal',
              slidesPerView: 1,
              spaceBetween: 30,
              loop: canLoop,
              watchOverflow: true,
              grabCursor: true,
              navigation: {
                nextEl: '#arrowRight3',
                prevEl: '#arrowLeft3'
              },
              breakpoints: {
                0: { slidesPerView: 1, spaceBetween: 19 },
                768: { slidesPerView: 1, spaceBetween: 19 },
                1024: { slidesPerView: 1 }
              },
              autoplay: {
                delay: 2500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
                reverseDirection: this.isRtl ? false : true, // بتعكس اتجاه حركه الكارسول
              },
            });
            const zone = document.getElementById('erp-carousel') as HTMLElement;
            const zone2 = document.querySelector('.delete-popover-panel') as HTMLElement;

            // zone.addEventListener('pointerenter', () => this.swiper2?.autoplay?.stop());
            // zone.addEventListener('pointerleave', () => this.swiper2?.autoplay?.start());
            // zone2.addEventListener('pointerenter', () => this.swiper2?.autoplay?.stop());
            // zone2.addEventListener('pointerleave', () => this.swiper2?.autoplay?.start());
            if (zone) {
              zone.addEventListener('pointerenter', () => this.swiper2?.autoplay?.stop());
              zone.addEventListener('pointerleave', () => this.swiper2?.autoplay?.start());
            }
            gsap.from('.swiper-slide', {
              scrollTrigger: {
                trigger: '.erp-carousel',
                start: 'top 85%'
              },
              opacity: 0,
              y: 60,
              duration: 0.2,
              stagger: 0.2,
              ease: 'power3.out'
            });

            this.swiper2.on('slideChangeTransitionStart', () => {
              const activeSlide = document.querySelector('.swiper-slide-active .card');
              if (activeSlide) {
                gsap.fromTo(
                  activeSlide,
                  { scale: 0.9, opacity: 0.7 },
                  { scale: 1, opacity: 1, duration: 0.2, ease: 'power2.out' }
                );
              }
            });
          });

          // ✅ refresh once after init
          this.scheduleScrollRefresh();
        }, 200);
      });
    });
  }

  private updateSwiperAfterData(): void {
    requestAnimationFrame(() => {
      if (!this.swiper2) return;

      const canLoop = (this.articles?.length ?? 0) > 1;
      this.swiper2.params.loop = canLoop;

      this.swiper2.update();
      this.swiper2.navigation?.update();

      // refresh once (batched)
      this.scheduleScrollRefresh();
    });
  }

  loadMostRead() {
    const cached = this.transfer.get(MOST_READ_KEY, null as any);
    if (cached) {
      this.mostReadArticles = cached?.data ?? [];
      this.articles = this.mostReadArticles;
      this.loadingMostRead = false;
      this.initialMostReadLoaded = true;
      this.transfer.remove(MOST_READ_KEY);

      if (this.isBrowser) {
        queueMicrotask(() => {
          this.cdr.detectChanges();
          this.tryInitUI();
          this.updateSwiperAfterData();
        });
      }
      return;
    }

    // ✅ set loading BEFORE request
    this.loadingMostRead = true;

    this.blogsService
      .getMostReadBlogs()
      .pipe(finalize(() => {
        this.loadingMostRead = false
        this.initialMostReadLoaded = true;
      }))
      .subscribe({
        next: (res: any) => {
          this.mostReadArticles = res?.data ?? [];
          this.articles = this.mostReadArticles;

          if (!this.isBrowser) this.transfer.set(MOST_READ_KEY, res);

          if (this.isBrowser) {
            this.cdr.detectChanges();
            this.tryInitUI();
            this.updateSwiperAfterData();
          }
          // update DOM first
          this.cdr.detectChanges();

          // init UI once after view is ready
          this.tryInitUI();

          // update swiper after data
          // this.updateSwiperAfterData();

        },
        error: (err: any) => {
          console.log(err?.message);
        }
      });
  }

  loadAllBlogs(page: number) {
    if (page === 1) {
      const cached = this.transfer.get(ALL_BLOGS_KEY, null as any);
      if (cached) {
        this.totalPages = cached?.pagination?.totalPages ?? 1;
        this.allBlogs = cached?.data ?? [];
        this.loadingAllBlogs = false;
        this.initialAllBlogsLoaded = true;
        this.transfer.remove(ALL_BLOGS_KEY);
        return;
      }
    }
    // ✅ set loading BEFORE request
    this.loadingAllBlogs = true;

    this.blogsService
      .getAllBlogs(page)
      .pipe(finalize(() => {
        this.loadingAllBlogs = false
        if (page === 1) this.initialAllBlogsLoaded = true;
      }))
      .subscribe({
        next: (res: any) => {
          this.totalPages = res.pagination.totalPages;
          if (page === 1) this.allBlogs = res?.data ?? [];
          else this.allBlogs.push(...(res?.data ?? []));

          if (!this.isBrowser && page === 1) this.transfer.set(ALL_BLOGS_KEY, res);

          // ما نعملش refresh هنا كل مرة — بس batch refresh واحدة
          // this.scheduleScrollRefresh();
          if (this.isBrowser) queueMicrotask(() => this.cdr.detectChanges());

        },
        error: (err: any) => {
          console.log(err?.message);
          this.scheduleScrollRefresh();
        }
      });
  }

  ngOnDestroy(): void {
    this.sectionsRegistry.clear();
    this.sectionsRegistry.disable();

    // if (this.isBrowser) {
    //   ScrollTrigger.getAll().forEach((t) => t.kill());
    // }
    this.uiCtx?.revert();
    if (this.isBrowser) {
      try {
        window.removeEventListener('resize', this.onResizeCD);
        window.removeEventListener('resize', this.onResize);

      } catch { }
    }
    if (this.swiper2) {
      this.swiper2.destroy(true, true);
      this.swiper2 = undefined;
    }

    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }

    this.closeDeletePopover();
  }
  showMoreBlogs() {
    if (this.page >= this.totalPages) return;
    this.page++;
    this.loadAllBlogs(this.page);
  }
  id!: number;
  DeleteBlog(id: number) {
    // this.id = id;
    // this.dialogMessage = 'هل انت متأكد انك تريد حذف هذا المقال';
    // this.dialogButtons = [
    //   { id: 'cancel', text: 'الغاء', style: 'outline' },
    //   { id: 'ok', text: 'أجل', style: 'danger' },
    // ];
    // this.dialogOpen = true;
  }

  // ================= Dialog helpers =================


  // loading = true;
  // errorMsg = '';

  // // dialog
  // dialogOpen = false;
  // blog: any;
  // blogHtml: SafeHtml = '' as any;
  // dialogVariant: 'success' | 'error' = 'success';
  // dialogTitle = '';
  // dialogMessage = '';
  // dialogButtons: DialogButton[] = [];
  // openSuccess() {
  //   this.dialogVariant = 'success';
  //   this.dialogTitle = 'تم حذف المقال بنجاح';
  //   this.dialogMessage = '';
  //   this.dialogButtons = [
  //     { id: 'show all', text: 'عرض كل المقالات', style: 'primary' },
  //   ];
  //   this.dialogOpen = true;
  // }

  // openFail() {
  //   this.dialogVariant = 'error';
  //   this.dialogTitle = 'تعذر حذف المقال';
  //   this.dialogMessage = 'حاول مرة أخرى أو تواصل مع الدعم.';
  //   this.dialogButtons = [
  //     { id: 'show all', text: 'عرض كل المقالات', style: 'primary' },
  //   ];
  //   this.dialogOpen = true;
  // }

  // onDialogAction(id: string) {
  //   if (id === 'ok') {
  //     this.dialogOpen = false;
  //     this.blogsService.DeleteBlog(this.id).subscribe({
  //       next: (res: any) => {
  //         this.openSuccess();
  //         this.loadMostRead();
  //         this.loadAllBlogs(1);
  //       },
  //       error: (err: any) => {
  //         this.openFail();
  //         console.log(err?.message);
  //       }
  //     });
  //   }
  //   if (id === 'show all') {
  //     this.dialogOpen = false;
  //   }
  //   if (id === 'cancel') {
  //     this.dialogOpen = false;
  //   }
  // }

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
    overlayEl.addEventListener('pointerenter', () => this.swiper2?.autoplay?.stop());
    overlayEl.addEventListener('pointerleave', () => this.swiper2?.autoplay?.start());
    this.overlayRef.backdropClick().subscribe(() => this.closeDeletePopover());
    this.overlayRef.keydownEvents().subscribe((e) => {
      if (e.key === 'Escape') this.closeDeletePopover();
    });

    const portal = new TemplatePortal(this.deleteConfirmTpl, this.vcr);
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
        this.dialogTitle = 'Success';
        this.dialogMessage = 'FAQ updated successfully';
        this.dialogButtons = [{ id: 'cancel', text: 'OK', style: 'outline' }];
        this.dialogOpen = true;

        this.allBlogs = this.allBlogs.filter(b => b.id !== id);
        this.articles = this.articles.filter(a => a.id !== id);

      },
      error: (err) => {
        this.dialogVariant = 'error';
        this.dialogTitle = 'Error';
        this.dialogMessage = err?.error?.message || 'Update failed';
        this.dialogButtons = [
          { id: 'cancel', text: 'Cancel', style: 'outline' },
          { id: 'retry', text: 'Try again', style: 'danger' },
        ];
        this.dialogOpen = true;
      }
    });
  }

  get isRtl() {
    return this.language.currentLang === 'ar';
  }

  onDialogAction(id: string) {
    if (id === 'show all') {
      this.dialogOpen = false;
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
    sessionStorage.setItem('source', 'blogs');
  }
}
