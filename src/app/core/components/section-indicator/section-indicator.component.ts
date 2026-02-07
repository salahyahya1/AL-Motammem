// import {
//   AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Inject, Input, OnDestroy,
//   PLATFORM_ID, ViewChild, WritableSignal, signal
// } from '@angular/core';
// import { CommonModule, isPlatformBrowser } from '@angular/common';
// import gsap from 'gsap';
// import ScrollTrigger from 'gsap/ScrollTrigger';
// import { fromEvent, Subscription, Subject, takeUntil } from 'rxjs';
// import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
// import { SectionItem, SectionsRegistryService } from '../../shared/services/sections-registry.service';
// import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';


// gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// @Component({
//   selector: 'app-section-indicator',
//   standalone: true,
//   imports: [CommonModule, TranslatePipe],
//   template: `
// <div #indicator
//   [class.opacity-100]="shouldShow()"
//   [class.pointer-events-auto]="shouldShow()"
//   [class.opacity-100]="!shouldShow()"
//   [class.pointer-events-none]="!shouldShow()"
//   class="indicator transition-opacity duration-500 ease-in-out fixed rtl:top-1/2 ltr:top-[49%] rtl:right-10 rtl:-translate-y-1/2 ltr:left-10 ltr:-translate-y-1/2 z-[1000] flex flex-col items-center">

//   <div class="relative h-[420px] w-[2px] bg-[#F5A605]">
//     <ng-container *ngFor="let s of sectionsList; let i = index; trackBy: trackById">
//       <div class="group absolute left-1/2 -translate-x-1/2 cursor-pointer"
//            [attr.id]="'dot-' + (s.wholeSectionId || s.id)"
//            [ngStyle]="{ top: (i * 100 / Math.max(1, sectionsList.length - 1)) + '%' }"
//            (click)="scrollToSection(s.targetId || s.id)">
//            <!-- (click)="scrollToSection(s.id)"> -->
//         <div class="absolute inset-[-16px] w-10 h-10 cursor-pointer"></div>
//         <div class="dot w-2 h-2 bg-[#fca61f] rounded-full transition-transform duration-300 group-hover:scale-[2] group-active:scale-[1.5]"></div>
//         <div class="dot-label absolute rtl:right-6 ltr:left-6 top-1/2 -translate-y-1/2 text-[var(--primary)] text-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 whitespace-nowrap">
//               {{ s.labelKey | translate }} 
//         </div>
//       </div>
//     </ng-container>
//   </div>
// </div>
//   `,
//   styleUrls: ['./section-indicator.component.scss'],
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class SectionIndicatorComponent implements AfterViewInit, OnDestroy {
//   @ViewChild('indicator', { static: false }) indicator!: ElementRef<HTMLElement>;

//   @Input() sections: SectionItem[] | null = null;

//   @Input() forceEnable: boolean | undefined;

//   @Input() hideBelow = 700;
//   @Input() start = 'top center';
//   @Input() end = 'bottom center';
//   @Input() showLabels = true;

//   public Math = Math;

//   private isBrowser: boolean;
//   private resizeSub?: Subscription;
//   private triggers: ScrollTrigger[] = [];
//   private destroy$ = new Subject<void>();

//   private registrySections: SectionItem[] = [];
//   private registryEnabled = false;

//   activeId: WritableSignal<string | null> = signal(null);
//   visible: WritableSignal<boolean> = signal(true);

//   constructor(
//     @Inject(PLATFORM_ID) platformId: Object,
//     private registry: SectionsRegistryService
//   ) {
//     this.isBrowser = isPlatformBrowser(platformId);
//   }

//   get sectionsList(): SectionItem[] {
//     return (this.sections && this.sections.length) ? this.sections : this.registrySections;
//   }

//   shouldShow(): boolean {
//     if (!this.isBrowser) return true;
//     const widthOK = window.innerWidth >= this.hideBelow;
//     const hasSections = this.sectionsList.length > 0;

//     const enabled = (typeof this.forceEnable === 'boolean') ? this.forceEnable : this.registryEnabled;

//     return widthOK && hasSections && enabled;
//   }

//   trackById = (_: number, s: SectionItem) => s.wholeSectionId || s.id;

//   ngAfterViewInit(): void {
//     if (!this.isBrowser) return;
//     const indicator = this.indicator?.nativeElement;
//     if (!indicator) return;

//     this.registry.sections$
//       .pipe(takeUntil(this.destroy$))
//       .subscribe((list: any) => {
//         this.registrySections = list ?? [];
//         this.rebuild();
//       });

//     this.registry.enabled$
//       .pipe(takeUntil(this.destroy$))
//       .subscribe((on: any) => {
//         this.registryEnabled = on;
//         this.rebuild();
//       });

//     this.applyVisibility();
//     this.runIntroAnimation(indicator);
//     this.resizeSub = fromEvent(window, 'resize').subscribe(() => {
//       this.applyVisibility();
//       this.runIntroAnimation(indicator, true);
//       this.rebuild();
//     });

//     this.rebuild();
//   }

//   private applyVisibility() {
//     if (!this.isBrowser) return;
//     this.visible.set(window.innerWidth >= this.hideBelow);
//   }

//   private runIntroAnimation(indicator: HTMLElement, isResize = false) {
//     if (!this.isBrowser) return;

//     const canAnimate = this.shouldShow();
//     if (!canAnimate) {
//       indicator.style.removeProperty('transform');
//       indicator.style.removeProperty('opacity');
//       return;
//     }

//     const needIntro = !isResize || parseFloat(getComputedStyle(indicator).opacity || '0') < 0.5;
//     if (needIntro) {
//       const offscreenPx = Math.min(200, Math.max(80, window.innerWidth * 0.06));
//       gsap.set(indicator, { x: offscreenPx, opacity: 0 });
//       gsap.to(indicator, {
//         x: 0,
//         opacity: 1,
//         duration: 0.6,
//         ease: 'power3.out',
//         clearProps: 'transform',
//       });
//     }
//   }

//   private rebuild() {
//     const indicator = this.indicator?.nativeElement;
//     if (!indicator) return;

//     if (!this.shouldShow()) {
//       this.cleanTriggers();
//       indicator.style.opacity = '0';
//       return;
//     }

//     indicator.style.opacity = '1';

//     this.waitForPanelsAndDots().then(() => {
//       this.buildScrollTriggers();
//       this.updateActiveFromViewport();

//       ScrollTrigger.create({
//         trigger: document.documentElement,
//         start: 0,
//         end: 'max',
//         onUpdate: () => this.updateActiveFromViewport(),
//       });

//       ScrollTrigger.addEventListener('refresh', () => this.updateActiveFromViewport());
//       requestAnimationFrame(() => ScrollTrigger.refresh());
//     });
//   }

//   private waitForPanelsAndDots(): Promise<void> {
//     return new Promise(resolve => {
//       const ready = () => {
//         const panels = document.querySelectorAll<HTMLElement>('.panel');
//         if (!panels.length) return false;
//         return this.sectionsList.every(s => !!document.getElementById('dot-' + (s.wholeSectionId || s.id)));
//       };
//       const loop = () => (ready() ? resolve() : setTimeout(loop, 50));
//       loop();
//     });
//   }

//   private buildScrollTriggers() {
//     this.cleanTriggers();

//     for (const s of this.sectionsList) {
//       const id = s.targetId || s.id;
//       const el = document.getElementById(id);
//       if (!el) continue;

//       const dotWrapper = document.getElementById('dot-' + (s.wholeSectionId || s.id));
//       const dot = dotWrapper?.querySelector('.dot') as HTMLElement | null;
//       const label = dotWrapper?.querySelector('.dot-label') as HTMLElement | null;

//       const setActive = (on: boolean) => {
//         if (on) this.clearAllDots();
//         if (on) {
//           this.activeId.set(id);
//           dot?.classList.add('active');
//           label?.classList.add('active', 'opacity-100');
//           label?.classList.remove('invisible');
//         } else {
//           if (this.activeId() === id) this.activeId.set(null);
//           dot?.classList.remove('active');
//           label?.classList.remove('active', 'opacity-100');
//           label?.classList.add('invisible');
//         }
//       };

//       const t = ScrollTrigger.create({
//         trigger: el,
//         start: this.start,
//         end: this.end,
//         onEnter: () => setActive(true),
//         onEnterBack: () => setActive(true),
//         onLeave: () => setActive(false),
//         onLeaveBack: () => setActive(false),
//       });

//       this.triggers.push(t);
//     }
//   }

//   private updateActiveFromViewport() {
//     const items = this.sectionsList
//       .map(s => {
//         const id = s.targetId || s.id;
//         const el = document.getElementById(id);
//         if (!el) return null;

//         const rect = el.getBoundingClientRect();
//         const center = rect.top + rect.height / 2;
//         const dist = Math.abs(center - window.innerHeight / 2);

//         const dotWrapper = document.getElementById('dot-' + (s.wholeSectionId || s.id));
//         const dot = dotWrapper?.querySelector('.dot') as HTMLElement | null;
//         const label = dotWrapper?.querySelector('.dot-label') as HTMLElement | null;

//         return { id, dist, dot, label };
//       })
//       .filter(Boolean) as Array<{ id: string; dist: number; dot: HTMLElement | null; label: HTMLElement | null }>;

//     if (!items.length) return;

//     items.sort((a, b) => a.dist - b.dist);
//     const current = items[0];

//     this.clearAllDots();
//     current.dot?.classList.add('active');
//     current.label?.classList.add('active');
//     current.label?.classList.remove('invisible');
//     this.activeId.set(current.id);
//   }

//   private clearAllDots() {
//     document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
//     document.querySelectorAll('.dot-label').forEach(l => {
//       l.classList.remove('active', 'opacity-100');
//       l.classList.add('invisible');
//     });
//   }

//   // scrollToSection(sectionId: string) {
//   //   const s = this.sectionsList.find(x => x.id === sectionId || x.targetId === sectionId);
//   //   if (!s) return;

//   //   const id = s.targetId || s.id;
//   //   const target = document.getElementById(id);
//   //   if (!target) return;

//   //   const offset = target.offsetHeight * 0.01;

//   //   const smoother = (window as any).ScrollSmoother?.get?.();
//   //   if (smoother) {
//   //     smoother.scrollTo(target, true, 'top+=' + offset);
//   //   } else {
//   //     gsap.to(window, {
//   //       duration: 1,
//   //       scrollTo: { y: target, offsetY: -offset },
//   //       ease: 'power2.out'
//   //     } as any);
//   //   }
//   // }
//   scrollToSection(sectionId: string) {
//     const s = this.sectionsList.find(x => x.id === sectionId || x.targetId === sectionId);
//     if (!s) return;

//     const id = s.targetId || s.id;
//     const smoother = (window as any).ScrollSmoother?.get?.();
//     if (!smoother) return;

//     // حلقة المراقبة المستمرة
//     let refreshCount = 0;
//     const maxRefreshes = 12;

//     const doScroll = () => {
//       const target = document.getElementById(id);
//       if (!target) return;

//       const navbar = document.querySelector('app-navbar') as HTMLElement | null;
//       const navOffset = (navbar?.getBoundingClientRect().height ?? 0) + 8;

//       // استخدام scrollTo مع العنصر مباشرة (أدق طريقة)
//       smoother.scrollTo(target, true, `top -=${navOffset}`);
//     };

//     // ابدأ السكرول الأولي
//     doScroll();

//     // حلقة المراقبة: كل 400ms نعمل refresh ونتحقق
//     const monitorInterval = setInterval(() => {
//       refreshCount++;

//       if (refreshCount >= maxRefreshes) {
//         clearInterval(monitorInterval);
//         // تصحيح نهائي
//         setTimeout(() => {
//           ScrollTrigger.refresh();
//           smoother.refresh();
//           doScroll();
//         }, 300);
//         return;
//       }

//       // نعمل refresh كامل
//       ScrollTrigger.refresh();
//       smoother.refresh();

//       // نتحقق هل وصلنا
//       const currentTarget = document.getElementById(id);
//       if (currentTarget) {
//         const rect = currentTarget.getBoundingClientRect();
//         // إذا كنا بعيدين أكثر من 100px، نعيد السكرول
//         if (Math.abs(rect.top + 8) > 100) {
//           doScroll();
//         }
//       }
//     }, 400);
//   }

//   private cleanTriggers() {
//     this.triggers.forEach(t => t.kill());
//     this.triggers = [];
//   }

//   ngOnDestroy(): void {
//     this.destroy$.next(); this.destroy$.complete();
//     this.cleanTriggers();
//     this.resizeSub?.unsubscribe();
//   }
// }
// import {
//   AfterViewInit,
//   ChangeDetectionStrategy,
//   Component,
//   ElementRef,
//   Inject,
//   Input,
//   OnDestroy,
//   PLATFORM_ID,
//   ViewChild,
//   WritableSignal,
//   signal,
// } from '@angular/core';
// import { CommonModule, isPlatformBrowser } from '@angular/common';
// import gsap from 'gsap';
// import ScrollTrigger from 'gsap/ScrollTrigger';
// import { fromEvent, Subscription, Subject, takeUntil } from 'rxjs';
// import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
// import { SectionItem, SectionsRegistryService } from '../../shared/services/sections-registry.service';
// import { TranslatePipe } from '@ngx-translate/core';

// gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// @Component({
//   selector: 'app-section-indicator',
//   standalone: true,
//   imports: [CommonModule, TranslatePipe],
//   template: `
// <div #indicator
//   [class.opacity-100]="shouldShow()"
//   [class.pointer-events-auto]="shouldShow()"
//   [class.opacity-0]="!shouldShow()"
//   [class.pointer-events-none]="!shouldShow()"
//   class="indicator transition-opacity duration-500 ease-in-out fixed rtl:top-1/2 ltr:top-[49%] rtl:right-10 rtl:-translate-y-1/2 ltr:left-10 ltr:-translate-y-1/2 z-[1000] flex flex-col items-center">

//   <div class="relative h-[420px] w-[2px] bg-[#F5A605]">
//     <ng-container *ngFor="let s of sectionsList; let i = index; trackBy: trackById">
//       <div class="group absolute left-1/2 -translate-x-1/2 cursor-pointer"
//            [attr.id]="'dot-' + (s.wholeSectionId || s.id)"
//            [ngStyle]="{ top: (i * 100 / Math.max(1, sectionsList.length - 1)) + '%' }"
//            (click)="scrollToSection(s.targetId || s.id)">
//         <div class="absolute inset-[-16px] w-10 h-10 cursor-pointer"></div>
//         <div class="dot w-2 h-2 bg-[#fca61f] rounded-full transition-transform duration-300 group-hover:scale-[2] group-active:scale-[1.5]"></div>
//         <div class="dot-label absolute rtl:right-6 ltr:left-6 top-1/2 -translate-y-1/2 text-[var(--primary)] text-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 whitespace-nowrap rounded-full bg-white px-3 py-2">
//           {{ s.labelKey | translate }}
//         </div>
//       </div>
//     </ng-container>
//   </div>
// </div>
//   `,
//   styleUrls: ['./section-indicator.component.scss'],
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class SectionIndicatorComponent implements AfterViewInit, OnDestroy {
//   @ViewChild('indicator', { static: false }) indicator!: ElementRef<HTMLElement>;

//   @Input() sections: SectionItem[] | null = null;
//   @Input() forceEnable: boolean | undefined;

//   @Input() hideBelow = 700;
//   @Input() start = 'top center';
//   @Input() end = 'bottom center';
//   @Input() showLabels = true;

//   public Math = Math;

//   private isBrowser: boolean;
//   private resizeSub?: Subscription;
//   private destroy$ = new Subject<void>();

//   private registrySections: SectionItem[] = [];
//   private registryEnabled = false;

//   private triggers: ScrollTrigger[] = [];

//   // ✅ prevent leaks (master trigger + refresh listener)
//   private masterTrigger?: ScrollTrigger;
//   private onRefresh = () => this.updateActiveFromViewport();

//   activeId: WritableSignal<string | null> = signal(null);
//   visible: WritableSignal<boolean> = signal(true);

//   // ✅ scroll state
//   private jumpToken = 0;
//   private postFixTimer?: any;

//   // ✅ tweak knobs (غيرهم براحتك)
//   private readonly INSIDE_SECTION_PX = 24;   // يخش جوه السكشن شوية عشان الأنيميشن تبدأ
//   private readonly CROSS_START_PX = 80;      // micro pre-jump لضمان crossing للـ start
//   private readonly NAV_EXTRA_PX = 8;         // margin تحت الـ navbar

//   constructor(
//     @Inject(PLATFORM_ID) platformId: Object,
//     private registry: SectionsRegistryService
//   ) {
//     this.isBrowser = isPlatformBrowser(platformId);
//   }

//   get sectionsList(): SectionItem[] {
//     return (this.sections && this.sections.length) ? this.sections : this.registrySections;
//   }

//   shouldShow(): boolean {
//     if (!this.isBrowser) return true;
//     const widthOK = window.innerWidth >= this.hideBelow;
//     const hasSections = this.sectionsList.length > 0;
//     const enabled = (typeof this.forceEnable === 'boolean') ? this.forceEnable : this.registryEnabled;
//     return widthOK && hasSections && enabled;
//   }

//   trackById = (_: number, s: SectionItem) => s.wholeSectionId || s.id;

//   ngAfterViewInit(): void {
//     if (!this.isBrowser) return;

//     const indicator = this.indicator?.nativeElement;
//     if (!indicator) return;

//     this.registry.sections$
//       .pipe(takeUntil(this.destroy$))
//       .subscribe((list: any) => {
//         this.registrySections = list ?? [];
//         this.rebuild();
//       });

//     this.registry.enabled$
//       .pipe(takeUntil(this.destroy$))
//       .subscribe((on: any) => {
//         this.registryEnabled = on;
//         this.rebuild();
//       });

//     this.applyVisibility();
//     this.runIntroAnimation(indicator);

//     this.resizeSub = fromEvent(window, 'resize').subscribe(() => {
//       this.applyVisibility();
//       this.runIntroAnimation(indicator, true);
//       this.rebuild();
//     });

//     this.rebuild();
//   }

//   private applyVisibility() {
//     if (!this.isBrowser) return;
//     this.visible.set(window.innerWidth >= this.hideBelow);
//   }

//   private runIntroAnimation(indicator: HTMLElement, isResize = false) {
//     if (!this.isBrowser) return;

//     const canAnimate = this.shouldShow();
//     if (!canAnimate) {
//       indicator.style.removeProperty('transform');
//       indicator.style.removeProperty('opacity');
//       return;
//     }

//     const needIntro = !isResize || parseFloat(getComputedStyle(indicator).opacity || '0') < 0.5;
//     if (needIntro) {
//       const offscreenPx = Math.min(200, Math.max(80, window.innerWidth * 0.06));
//       gsap.set(indicator, { x: offscreenPx, opacity: 0 });
//       gsap.to(indicator, {
//         x: 0,
//         opacity: 1,
//         duration: 0.6,
//         ease: 'power3.out',
//         clearProps: 'transform',
//       });
//     }
//   }

//   private rebuild() {
//     const indicator = this.indicator?.nativeElement;
//     if (!indicator) return;

//     // ✅ avoid leaks
//     this.masterTrigger?.kill();
//     this.masterTrigger = undefined;
//     ScrollTrigger.removeEventListener('refresh', this.onRefresh);

//     if (!this.shouldShow()) {
//       this.cleanTriggers();
//       indicator.style.opacity = '0';
//       return;
//     }

//     indicator.style.opacity = '1';

//     this.waitForPanelsAndDots().then(() => {
//       if (!this.shouldShow()) return;

//       this.buildScrollTriggers();
//       this.updateActiveFromViewport();

//       this.masterTrigger = ScrollTrigger.create({
//         trigger: document.documentElement,
//         start: 0,
//         end: 'max',
//         onUpdate: () => this.updateActiveFromViewport(),
//       });

//       ScrollTrigger.addEventListener('refresh', this.onRefresh);
//       requestAnimationFrame(() => ScrollTrigger.refresh(true));
//     });
//   }

//   private waitForPanelsAndDots(): Promise<void> {
//     return new Promise(resolve => {
//       const ready = () => {
//         const panels = document.querySelectorAll<HTMLElement>('.panel');
//         if (!panels.length) return false;
//         return this.sectionsList.every(s =>
//           !!document.getElementById('dot-' + (s.wholeSectionId || s.id))
//         );
//       };
//       const loop = () => (ready() ? resolve() : setTimeout(loop, 50));
//       loop();
//     });
//   }

//   private buildScrollTriggers() {
//     this.cleanTriggers();

//     for (const s of this.sectionsList) {
//       const id = s.targetId || s.id;
//       const el = document.getElementById(id);
//       if (!el) continue;

//       const dotWrapper = document.getElementById('dot-' + (s.wholeSectionId || s.id));
//       const dot = dotWrapper?.querySelector('.dot') as HTMLElement | null;
//       const label = dotWrapper?.querySelector('.dot-label') as HTMLElement | null;

//       const setActive = (on: boolean) => {
//         if (on) this.clearAllDots();
//         if (on) {
//           this.activeId.set(id);
//           dot?.classList.add('active');
//           label?.classList.add('active', 'opacity-100');
//           label?.classList.remove('invisible');
//         } else {
//           if (this.activeId() === id) this.activeId.set(null);
//           dot?.classList.remove('active');
//           label?.classList.remove('active', 'opacity-100');
//           label?.classList.add('invisible');
//         }
//       };

//       const t = ScrollTrigger.create({
//         trigger: el,
//         start: this.start,
//         end: this.end,
//         onEnter: () => setActive(true),
//         onEnterBack: () => setActive(true),
//         onLeave: () => setActive(false),
//         onLeaveBack: () => setActive(false),
//       });

//       this.triggers.push(t);
//     }
//   }

//   private updateActiveFromViewport() {
//     if (!this.isBrowser) return;

//     const items = this.sectionsList
//       .map(s => {
//         const id = s.targetId || s.id;
//         const el = document.getElementById(id);
//         if (!el) return null;

//         const rect = el.getBoundingClientRect();
//         const center = rect.top + rect.height / 2;
//         const dist = Math.abs(center - window.innerHeight / 2);

//         const dotWrapper = document.getElementById('dot-' + (s.wholeSectionId || s.id));
//         const dot = dotWrapper?.querySelector('.dot') as HTMLElement | null;
//         const label = dotWrapper?.querySelector('.dot-label') as HTMLElement | null;

//         return { id, dist, dot, label };
//       })
//       .filter(Boolean) as Array<{ id: string; dist: number; dot: HTMLElement | null; label: HTMLElement | null }>;

//     if (!items.length) return;

//     items.sort((a, b) => a.dist - b.dist);
//     const current = items[0];

//     this.clearAllDots();
//     current.dot?.classList.add('active');
//     current.label?.classList.add('active', 'opacity-100');
//     current.label?.classList.remove('invisible');
//     this.activeId.set(current.id);
//   }

//   private clearAllDots() {
//     document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
//     document.querySelectorAll('.dot-label').forEach(l => {
//       l.classList.remove('active', 'opacity-100');
//       l.classList.add('invisible');
//     });
//   }

//   // =========================
//   // ✅ FINAL Scroll (stable + triggers fire)
//   // =========================

//   private getNavOffset(): number {
//     const nav =
//       (document.querySelector('app-navbar') as HTMLElement | null) ||
//       (document.querySelector('header') as HTMLElement | null) ||
//       (document.querySelector('.navbar') as HTMLElement | null);

//     return (nav?.getBoundingClientRect().height ?? 0) + this.NAV_EXTRA_PX;
//   }

//   private clamp(n: number, min: number, max: number) {
//     return Math.min(max, Math.max(min, n));
//   }

//   scrollToSection(sectionId: string) {
//     void this._scrollToSection(sectionId);
//   }

//   private async _scrollToSection(sectionId: string) {
//     if (!this.isBrowser) return;

//     const s = this.sectionsList.find(x => x.id === sectionId || x.targetId === sectionId);
//     if (!s) return;

//     const id = s.targetId || s.id;

//     // ✅ cancel any pending post-fix from previous click
//     const token = ++this.jumpToken;
//     if (this.postFixTimer) clearTimeout(this.postFixTimer);

//     // ✅ Force load @defer block before scrolling
//     this.registry.requestForceLoad(id);

//     // ادي فريم للـ DOM
//     await new Promise<void>(r => requestAnimationFrame(() => r()));
//     if (token !== this.jumpToken) return;

//     const target = document.getElementById(id);
//     if (!target) return;

//     const navOffset = this.getNavOffset();
//     const insidePx = this.INSIDE_SECTION_PX;
//     const crossPx = Math.min(this.CROSS_START_PX, Math.round(window.innerHeight * 0.18));

//     const smoother = (window as any).ScrollSmoother?.get?.();

//     // kill old tweens (ده بيحل “التعليق” مع سكاشن طويلة)
//     if (smoother) gsap.killTweensOf(smoother);
//     else gsap.killTweensOf(window);

//     // refresh مرة واحدة قبل الحساب
//     ScrollTrigger.refresh(true);
//     smoother?.refresh?.();

//     // ✅ حساب Y النهائي: بداية السكشن + شوية جوه منه
//     let finalY: number;
//     let currentY: number;

//     if (smoother) {
//       currentY = smoother.scrollTop();
//       const base = smoother.offset(target, `top ${navOffset}px`);
//       finalY = base + insidePx;
//     } else {
//       currentY = window.scrollY || document.documentElement.scrollTop || 0;
//       const base = target.getBoundingClientRect().top + currentY - navOffset;
//       finalY = base + insidePx;
//     }

//     // micro pre-jump لضمان الأنيميشن تشتغل (cross start)
//     const goingDown = finalY > currentY;
//     const preY = goingDown ? (finalY - crossPx) : (finalY + crossPx);

//     // clamp within range
//     const maxScroll = ScrollTrigger.maxScroll(window);
//     const preYc = this.clamp(preY, 0, maxScroll);
//     const finalYc = this.clamp(finalY, 0, maxScroll);

//     // ✅ نفّذ: set للـ preY ثم tween للـ finalY
//     if (smoother) {
//       smoother.scrollTop(preYc);

//       await new Promise<void>(resolve => {
//         gsap.to(smoother, {
//           scrollTop: finalYc,
//           duration: 1.05,
//           ease: 'power2.inOut',
//           overwrite: 'auto',
//           onComplete: () => resolve(),
//         });
//       });

//       // ✅ تصحيح واحد خفيف بعد ما أي layout يتحرك (مهم مع سكاشن طويلة/صور)
//       this.postFixTimer = setTimeout(() => {
//         if (token !== this.jumpToken) return;
//         try {
//           ScrollTrigger.refresh(true);
//           smoother.refresh?.();

//           const t2 = document.getElementById(id);
//           if (!t2) return;

//           const base2 = smoother.offset(t2, `top ${navOffset}px`);
//           const y2 = this.clamp(base2 + insidePx, 0, ScrollTrigger.maxScroll(window));

//           if (Math.abs(smoother.scrollTop() - y2) > 2) {
//             gsap.to(smoother, { scrollTop: y2, duration: 0.22, ease: 'none', overwrite: 'auto' });
//           }
//         } catch { }
//       }, 120);

//     } else {
//       window.scrollTo(0, preYc);

//       await new Promise<void>(resolve => {
//         gsap.to(window, {
//           duration: 1.05,
//           scrollTo: { y: finalYc },
//           ease: 'power2.inOut',
//           overwrite: 'auto',
//           onComplete: () => resolve(),
//         } as any);
//       });

//       this.postFixTimer = setTimeout(() => {
//         if (token !== this.jumpToken) return;
//         try {
//           ScrollTrigger.refresh(true);
//           const cur = window.scrollY || 0;
//           const base2 = target.getBoundingClientRect().top + cur - navOffset;
//           const y2 = this.clamp(base2 + insidePx, 0, ScrollTrigger.maxScroll(window));
//           if (Math.abs(cur - y2) > 2) window.scrollTo(0, y2);
//         } catch { }
//       }, 120);
//     }
//   }

//   private cleanTriggers() {
//     this.triggers.forEach(t => t.kill());
//     this.triggers = [];
//   }

//   ngOnDestroy(): void {
//     // ✅ Cancel any pending scroll operations
//     this.jumpToken++;

//     // ✅ Complete destroy subject (stops registry subscriptions)
//     try {
//       this.destroy$.next();
//       this.destroy$.complete();
//     } catch { }

//     // ✅ Clear pending timer
//     try {
//       if (this.postFixTimer) {
//         clearTimeout(this.postFixTimer);
//         this.postFixTimer = undefined;
//       }
//     } catch { }

//     // ✅ Kill all section triggers
//     try {
//       this.cleanTriggers();
//     } catch { }

//     // ✅ Kill master trigger
//     try {
//       this.masterTrigger?.kill();
//       this.masterTrigger = undefined;
//     } catch { }

//     // ✅ Remove global ScrollTrigger event listener (CRITICAL)
//     try {
//       ScrollTrigger.removeEventListener('refresh', this.onRefresh);
//     } catch { }

//     // ✅ Unsubscribe from resize events
//     try {
//       this.resizeSub?.unsubscribe();
//       this.resizeSub = undefined;
//     } catch { }
//   }
// }
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  WritableSignal,
  signal,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollSmoother from 'gsap/ScrollSmoother';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import { fromEvent, Subject, takeUntil } from 'rxjs';
import { SectionItem, SectionsRegistryService } from '../../shared/services/sections-registry.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-section-indicator',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
<div #indicator
  [class.opacity-100]="shouldShow()"
  [class.pointer-events-auto]="shouldShow()"
  [class.opacity-0]="!shouldShow()"
  [class.pointer-events-none]="!shouldShow()"
  class="indicator transition-opacity duration-500 ease-in-out fixed rtl:top-1/2 ltr:top-[49%] rtl:right-10 rtl:-translate-y-1/2 ltr:left-10 ltr:-translate-y-1/2 z-[1000] flex flex-col items-center">

  <div class="relative h-[420px] w-[2px] bg-[#F5A605]">
    <ng-container *ngFor="let s of sectionsList; let i = index; trackBy: trackById">
      <div class="group absolute left-1/2 -translate-x-1/2 cursor-pointer"
           [attr.id]="'dot-' + (s.wholeSectionId || s.id)"
           [ngStyle]="{ top: (i * 100 / Math.max(1, sectionsList.length - 1)) + '%' }"
           (click)="scrollToSection(s.targetId || s.id)">
        <div class="absolute inset-[-16px] w-10 h-10 cursor-pointer"></div>
        <div class="dot w-2 h-2 bg-[#fca61f] rounded-full transition-transform duration-300 group-hover:scale-[2] group-active:scale-[1.5]"></div>

        <div
          class="dot-label absolute rtl:right-6 ltr:left-6 top-1/2 -translate-y-1/2 text-[var(--primary)] text-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 whitespace-nowrap rounded-full bg-white px-3 py-2"
          [class.hidden]="!showLabels">
          {{ s.labelKey | translate }}
        </div>
      </div>
    </ng-container>
  </div>
</div>
  `,
  styleUrls: ['./section-indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionIndicatorComponent implements AfterViewInit, OnDestroy {
  private static pluginsRegistered = false;

  @ViewChild('indicator', { static: false }) indicator!: ElementRef<HTMLElement>;

  @Input() sections: SectionItem[] | null = null;
  @Input() forceEnable: boolean | undefined;

  @Input() hideBelow = 700;
  @Input() start = 'top center';
  @Input() end = 'bottom center';
  @Input() showLabels = true;

  public Math = Math;

  private isBrowser: boolean;
  private destroy$ = new Subject<void>();

  private registrySections: SectionItem[] = [];
  private registryEnabled = false;

  private triggers: ScrollTrigger[] = [];

  // ✅ prevent leaks (master trigger + refresh listener)
  private masterTrigger?: ScrollTrigger;
  private onRefresh = () => this.updateActiveFromViewport();

  // ✅ rebuild/wait cancellation
  private destroyed = false;
  private rebuildToken = 0;
  private waitTimer?: any;

  activeId: WritableSignal<string | null> = signal(null);
  visible: WritableSignal<boolean> = signal(true);

  // ✅ scroll state
  private jumpToken = 0;
  private postFixTimer?: any;

  // ✅ tweak knobs
  private readonly INSIDE_SECTION_PX = 24;
  private readonly CROSS_START_PX = 80;
  private readonly NAV_EXTRA_PX = 8;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private registry: SectionsRegistryService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  get sectionsList(): SectionItem[] {
    return (this.sections && this.sections.length) ? this.sections : this.registrySections;
  }

  shouldShow(): boolean {
    if (!this.isBrowser) return true;

    const widthOK = this.visible(); // ✅ reactive (updated on resize)
    const hasSections = this.sectionsList.length > 0;
    const enabled = (typeof this.forceEnable === 'boolean') ? this.forceEnable : this.registryEnabled;

    return widthOK && hasSections && enabled;
  }

  trackById = (_: number, s: SectionItem) => s.wholeSectionId || s.id;

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    // ✅ SSR-safe plugins register (مرة واحدة)
    if (!SectionIndicatorComponent.pluginsRegistered) {
      gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, ScrollSmoother);
      SectionIndicatorComponent.pluginsRegistered = true;
    }

    const indicator = this.indicator?.nativeElement;
    if (!indicator) return;

    this.registry.sections$
      .pipe(takeUntil(this.destroy$))
      .subscribe((list: any) => {
        this.registrySections = list ?? [];
        this.rebuild();
      });

    this.registry.enabled$
      .pipe(takeUntil(this.destroy$))
      .subscribe((on: any) => {
        this.registryEnabled = on;
        this.rebuild();
      });

    this.applyVisibility();
    this.runIntroAnimation(indicator);

    fromEvent(window, 'resize')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.applyVisibility();
        this.runIntroAnimation(indicator, true);
        this.rebuild();
      });

    this.rebuild();
  }

  private applyVisibility() {
    if (!this.isBrowser) return;
    this.visible.set(window.innerWidth >= this.hideBelow);
  }

  private runIntroAnimation(indicator: HTMLElement, isResize = false) {
    if (!this.isBrowser) return;

    const canAnimate = this.shouldShow();
    if (!canAnimate) {
      indicator.style.removeProperty('transform');
      indicator.style.removeProperty('opacity');
      return;
    }

    const needIntro = !isResize || parseFloat(getComputedStyle(indicator).opacity || '0') < 0.5;
    if (needIntro) {
      const offscreenPx = Math.min(200, Math.max(80, window.innerWidth * 0.06));
      gsap.set(indicator, { x: offscreenPx, opacity: 0 });
      gsap.to(indicator, {
        x: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out',
        clearProps: 'transform',
      });
    }
  }

  private rebuild() {
    const indicator = this.indicator?.nativeElement;
    if (!indicator) return;

    // ✅ cancel any pending wait loop
    this.rebuildToken++;
    if (this.waitTimer) {
      clearTimeout(this.waitTimer);
      this.waitTimer = undefined;
    }

    // ✅ avoid leaks
    this.masterTrigger?.kill();
    this.masterTrigger = undefined;
    ScrollTrigger.removeEventListener('refresh', this.onRefresh);

    if (!this.shouldShow()) {
      this.cleanTriggers();
      indicator.style.opacity = '0';
      return;
    }

    indicator.style.opacity = '1';

    const token = this.rebuildToken;

    this.waitForPanelsAndDots(token).then((ok) => {
      if (!ok) return;
      if (this.destroyed) return;
      if (token !== this.rebuildToken) return;
      if (!this.shouldShow()) return;

      this.buildScrollTriggers();
      this.updateActiveFromViewport();

      this.masterTrigger = ScrollTrigger.create({
        trigger: document.documentElement,
        start: 0,
        end: 'max',
        onUpdate: () => this.updateActiveFromViewport(),
      });

      ScrollTrigger.addEventListener('refresh', this.onRefresh);
      requestAnimationFrame(() => ScrollTrigger.refresh(true));
    });
  }

  private waitForPanelsAndDots(token: number): Promise<boolean> {
    return new Promise(resolve => {
      const startedAt = performance.now();
      const maxWaitMs = 2500;

      const ready = () => {
        if (this.destroyed) return false;
        if (token !== this.rebuildToken) return false;

        const panels = document.querySelectorAll<HTMLElement>('.panel');
        if (!panels.length) return false;

        return this.sectionsList.every(s =>
          !!document.getElementById('dot-' + (s.wholeSectionId || s.id))
        );
      };

      const loop = () => {
        if (this.destroyed) return resolve(false);
        if (token !== this.rebuildToken) return resolve(false);

        if (ready()) return resolve(true);

        if (performance.now() - startedAt > maxWaitMs) return resolve(false);

        this.waitTimer = setTimeout(loop, 50);
      };

      loop();
    });
  }

  private buildScrollTriggers() {
    this.cleanTriggers();

    for (const s of this.sectionsList) {
      const id = s.targetId || s.id;
      const el = document.getElementById(id);
      if (!el) continue;

      const dotWrapper = document.getElementById('dot-' + (s.wholeSectionId || s.id));
      const dot = dotWrapper?.querySelector('.dot') as HTMLElement | null;
      const label = dotWrapper?.querySelector('.dot-label') as HTMLElement | null;

      const setActive = (on: boolean) => {
        if (on) this.clearAllDots();
        if (on) {
          this.activeId.set(id);
          dot?.classList.add('active');

          if (this.showLabels) {
            label?.classList.add('active', 'opacity-100');
            label?.classList.remove('invisible');
          }
        } else {
          if (this.activeId() === id) this.activeId.set(null);
          dot?.classList.remove('active');

          if (this.showLabels) {
            label?.classList.remove('active', 'opacity-100');
            label?.classList.add('invisible');
          }
        }
      };

      const t = ScrollTrigger.create({
        trigger: el,
        start: this.start,
        end: this.end,
        onEnter: () => setActive(true),
        onEnterBack: () => setActive(true),
        onLeave: () => setActive(false),
        onLeaveBack: () => setActive(false),
      });

      this.triggers.push(t);
    }
  }

  private updateActiveFromViewport() {
    if (!this.isBrowser) return;
    if (!this.shouldShow()) return;

    const items = this.sectionsList
      .map(s => {
        const id = s.targetId || s.id;
        const el = document.getElementById(id);
        if (!el) return null;

        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const dist = Math.abs(center - window.innerHeight / 2);

        const dotWrapper = document.getElementById('dot-' + (s.wholeSectionId || s.id));
        const dot = dotWrapper?.querySelector('.dot') as HTMLElement | null;
        const label = dotWrapper?.querySelector('.dot-label') as HTMLElement | null;

        return { id, dist, dot, label };
      })
      .filter(Boolean) as Array<{ id: string; dist: number; dot: HTMLElement | null; label: HTMLElement | null }>;

    if (!items.length) return;

    items.sort((a, b) => a.dist - b.dist);
    const current = items[0];

    this.clearAllDots();
    current.dot?.classList.add('active');

    if (this.showLabels) {
      current.label?.classList.add('active', 'opacity-100');
      current.label?.classList.remove('invisible');
    }

    this.activeId.set(current.id);
  }

  private clearAllDots() {
    document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));

    if (!this.showLabels) return;

    document.querySelectorAll('.dot-label').forEach(l => {
      l.classList.remove('active', 'opacity-100');
      l.classList.add('invisible');
    });
  }

  // =========================
  // ✅ FINAL Scroll (stable + triggers fire)
  // =========================

  private getNavOffset(): number {
    const nav =
      (document.querySelector('app-navbar') as HTMLElement | null) ||
      (document.querySelector('header') as HTMLElement | null) ||
      (document.querySelector('.navbar') as HTMLElement | null);

    return (nav?.getBoundingClientRect().height ?? 0) + this.NAV_EXTRA_PX;
  }

  private clamp(n: number, min: number, max: number) {
    return Math.min(max, Math.max(min, n));
  }

  scrollToSection(sectionId: string) {
    void this._scrollToSection(sectionId);
  }

  private async _scrollToSection(sectionId: string) {
    if (!this.isBrowser) return;

    const s = this.sectionsList.find(x => x.id === sectionId || x.targetId === sectionId);
    if (!s) return;

    const id = s.targetId || s.id;

    const token = ++this.jumpToken;
    if (this.postFixTimer) clearTimeout(this.postFixTimer);

    // ✅ Force load @defer block before scrolling (لو موجودة)
    try { (this.registry as any).requestForceLoad?.(id); } catch { }

    await new Promise<void>(r => requestAnimationFrame(() => r()));
    if (token !== this.jumpToken) return;

    const target = document.getElementById(id);
    if (!target) return;

    const navOffset = this.getNavOffset();
    const insidePx = this.INSIDE_SECTION_PX;
    const crossPx = Math.min(this.CROSS_START_PX, Math.round(window.innerHeight * 0.18));

    const smoother = ScrollSmoother.get() as any;

    // kill old tweens
    try {
      if (smoother) gsap.killTweensOf(smoother);
      gsap.killTweensOf(window);
    } catch { }

    // refresh مرة واحدة قبل الحساب
    try {
      ScrollTrigger.refresh(true);
      smoother?.refresh?.();
    } catch { }

    let finalY: number;
    let currentY: number;

    const maxScroll = ScrollTrigger.maxScroll(smoother ? smoother.wrapper() : window) || 1;

    if (smoother) {
      currentY = smoother.scrollTop();
      const base = smoother.offset(target, `top ${navOffset}px`);
      finalY = base + insidePx;
    } else {
      currentY = window.scrollY || document.documentElement.scrollTop || 0;
      const base = target.getBoundingClientRect().top + currentY - navOffset;
      finalY = base + insidePx;
    }

    const goingDown = finalY > currentY;
    const preY = goingDown ? (finalY - crossPx) : (finalY + crossPx);

    const preYc = this.clamp(preY, 0, maxScroll);
    const finalYc = this.clamp(finalY, 0, maxScroll);

    if (smoother) {
      smoother.scrollTop(preYc);

      await new Promise<void>(resolve => {
        gsap.to(smoother, {
          scrollTop: finalYc,
          duration: 1.05,
          ease: 'power2.inOut',
          overwrite: 'auto',
          onComplete: () => resolve(),
        });
      });

      this.postFixTimer = setTimeout(() => {
        if (token !== this.jumpToken) return;
        try {
          ScrollTrigger.refresh(true);
          smoother.refresh?.();

          const t2 = document.getElementById(id);
          if (!t2) return;

          const base2 = smoother.offset(t2, `top ${navOffset}px`);
          const y2 = this.clamp(base2 + insidePx, 0, ScrollTrigger.maxScroll(smoother.wrapper()) || 1);

          if (Math.abs(smoother.scrollTop() - y2) > 2) {
            gsap.to(smoother, { scrollTop: y2, duration: 0.22, ease: 'none', overwrite: 'auto' });
          }
        } catch { }
      }, 120);
    } else {
      window.scrollTo(0, preYc);

      await new Promise<void>(resolve => {
        gsap.to(window, {
          duration: 1.05,
          scrollTo: { y: finalYc, autoKill: true },
          ease: 'power2.inOut',
          overwrite: 'auto',
          onComplete: () => resolve(),
        } as any);
      });

      this.postFixTimer = setTimeout(() => {
        if (token !== this.jumpToken) return;
        try {
          ScrollTrigger.refresh(true);
          const cur = window.scrollY || 0;
          const base2 = target.getBoundingClientRect().top + cur - navOffset;
          const y2 = this.clamp(base2 + insidePx, 0, ScrollTrigger.maxScroll(window) || 1);
          if (Math.abs(cur - y2) > 2) window.scrollTo(0, y2);
        } catch { }
      }, 120);
    }
  }

  private cleanTriggers() {
    this.triggers.forEach(t => t.kill());
    this.triggers = [];
  }

  ngOnDestroy(): void {
    this.destroyed = true;

    // ✅ Cancel any pending scroll operations
    this.jumpToken++;
    this.rebuildToken++;

    // ✅ stop wait loop
    try {
      if (this.waitTimer) {
        clearTimeout(this.waitTimer);
        this.waitTimer = undefined;
      }
    } catch { }

    // ✅ Complete destroy subject
    try {
      this.destroy$.next();
      this.destroy$.complete();
    } catch { }

    // ✅ Clear pending timer
    try {
      if (this.postFixTimer) {
        clearTimeout(this.postFixTimer);
        this.postFixTimer = undefined;
      }
    } catch { }

    // ✅ Kill all section triggers
    try {
      this.cleanTriggers();
    } catch { }

    // ✅ Kill master trigger
    try {
      this.masterTrigger?.kill();
      this.masterTrigger = undefined;
    } catch { }

    // ✅ Remove global ScrollTrigger event listener
    try {
      ScrollTrigger.removeEventListener('refresh', this.onRefresh);
    } catch { }
  }
}
