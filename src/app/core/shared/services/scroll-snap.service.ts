// // import { Injectable, NgZone } from '@angular/core';
// // import gsap from 'gsap';
// // import ScrollTrigger from 'gsap/ScrollTrigger';

// // gsap.registerPlugin(ScrollTrigger);

// // export type SnapOptions = {
// //     panelSelector?: string;      // default: '.panel'
// //     navOffsetPx?: number;        // لو عندك Navbar ثابت
// //     enableOnMobile?: boolean;    // default: false
// //     mobileMaxWidth?: number;     // default: 767
// //     stationEveryVh?: boolean;    // محطات جوه السكشن الطويل جدًا (اختياري)
// //     stationStepVh?: number;      // default: 1 (كل شاشة)
// //     snapDelay?: number;          // default: 0.05
// //     durationMin?: number;        // default: 0.15
// //     durationMax?: number;        // default: 0.35
// //     ease?: string;               // default: 'power1.inOut'
// //     inertia?: boolean;           // default: false
// // };

// // @Injectable({ providedIn: 'root' })
// // export class ScrollSnapService {
// //     private trigger?: ScrollTrigger;
// //     private snapPoints: number[] = [];
// //     private refreshPointsHandler?: () => void;

// //     constructor(private zone: NgZone) { }

// //     init(options: SnapOptions = {}) {
// //         const {
// //             panelSelector = '.panel',
// //             navOffsetPx = 0,
// //             enableOnMobile = false,
// //             mobileMaxWidth = 767,
// //             stationEveryVh = false,
// //             stationStepVh = 1,
// //             snapDelay = 0.05,
// //             durationMin = 0.15,
// //             durationMax = 0.35,
// //             ease = 'power1.inOut',
// //             inertia = false,
// //         } = options;

// //         const isMobile = window.matchMedia(`(max-width: ${mobileMaxWidth}px)`).matches;
// //         if (isMobile && !enableOnMobile) return;

// //         this.zone.runOutsideAngular(() => {
// //             const panels = gsap.utils.toArray<HTMLElement>(panelSelector);
// //             if (panels.length < 2) return;

// //             const buildSnapPoints = () => {
// //                 const max = ScrollTrigger.maxScroll(window);
// //                 if (max <= 0) return [];

// //                 const vh = window.innerHeight - navOffsetPx;
// //                 const pointsPx: number[] = [];

// //                 panels.forEach((p) => {
// //                     const top = p.offsetTop;
// //                     const h = p.offsetHeight;

// //                     // بداية السكشن
// //                     pointsPx.push(top);

// //                     // آخر Full Screen داخل السكشن لو أطول من الشاشة
// //                     const lastFullScreenY = top + (h - vh);
// //                     if (h > vh + 10) pointsPx.push(lastFullScreenY);

// //                     // (اختياري) محطات كل شاشة داخل السكشن الطويل جدًا
// //                     if (stationEveryVh && h > vh * 2) {
// //                         const step = Math.max(1, stationStepVh) * vh;
// //                         for (let y = top + step; y < lastFullScreenY; y += step) {
// //                             pointsPx.push(y);
// //                         }
// //                     }
// //                 });

// //                 const uniqueSorted = Array.from(new Set(pointsPx))
// //                     .map((y) => Math.max(0, Math.min(max, y)))
// //                     .sort((a, b) => a - b);

// //                 return uniqueSorted.map((y) => y / max);
// //             };

// //             // نقاط أولية
// //             this.snapPoints = buildSnapPoints();

// //             // kill لو كان فيه قديم
// //             this.destroy();

// //             // أنشئ Trigger واحد للصفحة كلها
// //             this.trigger = ScrollTrigger.create({
// //                 start: 0,
// //                 end: () => ScrollTrigger.maxScroll(window),
// //                 snap: {
// //                     snapTo: (progress) => gsap.utils.snap(this.snapPoints, progress),
// //                     duration: { min: durationMin, max: durationMax },
// //                     delay: snapDelay,
// //                     ease,
// //                     inertia,
// //                 },
// //             });

// //             // تحديث نقاط السناب قبل refresh
// //             this.refreshPointsHandler = () => {
// //                 this.snapPoints = buildSnapPoints();
// //             };

// //             ScrollTrigger.addEventListener('refreshInit', this.refreshPointsHandler);
// //         });
// //     }

// //     refresh() {
// //         ScrollTrigger.refresh();
// //     }

// //     destroy() {
// //         try {
// //             if (this.refreshPointsHandler) {
// //                 ScrollTrigger.removeEventListener('refreshInit', this.refreshPointsHandler);
// //             }
// //         } catch { }

// //         this.refreshPointsHandler = undefined;

// //         if (this.trigger) {
// //             this.trigger.kill();
// //             this.trigger = undefined;
// //         }
// //     }

// //     disable() {
// //         this.trigger?.disable();
// //     }

// //     enable() {
// //         this.trigger?.enable();
// //     }
// // }
// // import { Inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
// // import { isPlatformBrowser } from '@angular/common';
// // import gsap from 'gsap';
// // import ScrollTrigger from 'gsap/ScrollTrigger';

// // export type SnapOptions = {
// //     panelSelector?: string;          // default: '.panel'
// //     navOffsetPx?: number;            // default: 0
// //     enableOnMobile?: boolean;        // default: false
// //     mobileMaxWidth?: number;         // default: 767

// //     // لو عايزة تحددي scroller يدويًا (اختياري)
// //     scroller?: Window | HTMLElement;

// //     // للسكاشن الطويلة
// //     includeSectionEnd?: boolean;     // default: true
// //     stationEveryVh?: boolean;        // default: false
// //     stationStepVh?: number;          // default: 1

// //     snapDelay?: number;              // default: 0.05
// //     durationMin?: number;            // default: 0.15
// //     durationMax?: number;            // default: 0.35
// //     ease?: string;                   // default: 'power1.inOut'
// //     inertia?: boolean;               // default: false
// // };

// // @Injectable({ providedIn: 'root' })
// // export class ScrollSnapService {
// //     private master?: ScrollTrigger;
// //     private snapPoints: number[] = [];
// //     private refreshHandler?: () => void;

// //     // ✅ ممنوع نديها window هنا (SSR)
// //     private currentScroller?: Window | HTMLElement;

// //     private readonly isBrowser: boolean;

// //     constructor(
// //         private zone: NgZone,
// //         @Inject(PLATFORM_ID) platformId: Object
// //     ) {
// //         this.isBrowser = isPlatformBrowser(platformId);
// //     }

// //     /** ✅ detect ScrollSmoother wrapper لو موجود */
// //     private detectScroller(): Window | HTMLElement {
// //         // دي بتتنادي في browser فقط
// //         const w = window as any;
// //         const smoother = w.ScrollSmoother?.get?.();
// //         if (smoother?.wrapper) return smoother.wrapper();
// //         return window;
// //     }

// //     init(options: SnapOptions = {}) {
// //         if (!this.isBrowser) return;

// //         // ✅ Register plugin في البراوزر فقط
// //         gsap.registerPlugin(ScrollTrigger);

// //         const {
// //             panelSelector = '.panel',
// //             navOffsetPx = 0,
// //             enableOnMobile = false,
// //             mobileMaxWidth = 767,
// //             scroller,
// //             includeSectionEnd = true,
// //             stationEveryVh = false,
// //             stationStepVh = 1,
// //             snapDelay = 0.05,
// //             durationMin = 0.15,
// //             durationMax = 0.35,
// //             ease = 'power1.inOut',
// //             inertia = false,
// //         } = options;

// //         const isMobile = window.matchMedia(`(max-width: ${mobileMaxWidth}px)`).matches;
// //         if (isMobile && !enableOnMobile) return;

// //         this.zone.runOutsideAngular(() => {
// //             // ✅ امسحي أي instance قديم
// //             this.destroy();

// //             this.currentScroller = scroller ?? this.detectScroller();

// //             // refresh قبل القياسات
// //             ScrollTrigger.refresh(true);

// //             const panels = gsap.utils.toArray<HTMLElement>(panelSelector);
// //             if (panels.length < 2) return;

// //             const getViewportH = () => {
// //                 if (this.currentScroller === window) return window.innerHeight;
// //                 const el = this.currentScroller as HTMLElement;
// //                 return el.clientHeight || window.innerHeight;
// //             };

// //             const buildSnapPoints = () => {
// //                 ScrollTrigger.refresh(true);

// //                 const max = ScrollTrigger.maxScroll(this.currentScroller as any);
// //                 if (!max || max <= 0) return [];

// //                 const vh = Math.max(1, getViewportH() - navOffsetPx);
// //                 const pointsPx: number[] = [];

// //                 for (const panel of panels) {
// //                     // ✅ trigger مؤقت عشان start/end يطلعوا صح مع window أو smoother
// //                     const tmp = ScrollTrigger.create({
// //                         trigger: panel,
// //                         scroller: this.currentScroller as any,
// //                         start: () => `top top+=${navOffsetPx}`,
// //                         end: () => `bottom bottom+=${navOffsetPx}`,
// //                         invalidateOnRefresh: true,
// //                     });

// //                     const startY = tmp.start;
// //                     const endY = tmp.end;

// //                     pointsPx.push(startY);

// //                     if (includeSectionEnd && endY > startY + vh * 0.25) {
// //                         pointsPx.push(endY);
// //                     }

// //                     if (stationEveryVh && endY > startY + vh * 2) {
// //                         const step = Math.max(1, stationStepVh) * vh;
// //                         for (let y = startY + step; y < endY - 1; y += step) {
// //                             pointsPx.push(y);
// //                         }
// //                     }

// //                     tmp.kill();
// //                 }

// //                 const uniqSorted = Array.from(new Set(pointsPx))
// //                     .map((y) => Math.max(0, Math.min(max, y)))
// //                     .sort((a, b) => a - b);

// //                 return uniqSorted.map((y) => y / max);
// //             };

// //             this.snapPoints = buildSnapPoints();
// //             if (this.snapPoints.length < 2) return;

// //             // ✅ Master Trigger: يمنع الوقوف بين السكاشن
// //             this.master = ScrollTrigger.create({
// //                 scroller: this.currentScroller as any,
// //                 start: 0,
// //                 end: () => ScrollTrigger.maxScroll(this.currentScroller as any),
// //                 snap: {
// //                     snapTo: (p) => gsap.utils.snap(this.snapPoints, p), // أقرب نقطة
// //                     delay: snapDelay,
// //                     duration: { min: durationMin, max: durationMax },
// //                     ease,
// //                     inertia,
// //                 },
// //             });

// //             // ✅ قبل أي refresh: ابني النقاط من جديد
// //             this.refreshHandler = () => {
// //                 this.snapPoints = buildSnapPoints();
// //             };
// //             ScrollTrigger.addEventListener('refreshInit', this.refreshHandler);

// //             ScrollTrigger.refresh(true);
// //         });
// //     }

// //     refresh() {
// //         if (!this.isBrowser) return;
// //         ScrollTrigger.refresh(true);
// //     }

// //     destroy() {
// //         if (!this.isBrowser) return;

// //         try {
// //             if (this.refreshHandler) {
// //                 ScrollTrigger.removeEventListener('refreshInit', this.refreshHandler);
// //             }
// //         } catch { }

// //         this.refreshHandler = undefined;

// //         if (this.master) {
// //             this.master.kill();
// //             this.master = undefined;
// //         }

// //         this.snapPoints = [];
// //         this.currentScroller = undefined;
// //     }
// // }
// import { Inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';
// import gsap from 'gsap';
// import ScrollTrigger from 'gsap/ScrollTrigger';
// import ScrollToPlugin from 'gsap/ScrollToPlugin';

// export type SnapOptions = {
//     panelSelector?: string;       // default: '.panel'
//     navOffsetPx?: number;         // default: 0
//     enableOnMobile?: boolean;     // default: false
//     mobileMaxWidth?: number;      // default: 767

//     /**
//      * snapMode:
//      * - 'startsOnly' : سناب لبدايات السكاشن فقط (أنسب لو كل سكشن 100vh)
//      * - 'startsAndEnds' : يضيف نقطة "آخر full-screen" للسكشن الطويل
//      */
//     snapMode?: 'startsOnly' | 'startsAndEnds';

//     /**
//      * snapZoneRatio:
//      * قد إيه قريب من بداية/نهاية السكشن نعمل snap؟
//      * مثال: 0.35 يعني لو انتي ضمن 35% من vh من boundary هنعمل snap
//      */
//     snapZoneRatio?: number;       // default: 0.35

//     /**
//      * stopDelayMs:
//      * قد إيه لازم اليوزر يقف (مفيش تغيير في scroll) عشان نعمل snap
//      */
//     stopDelayMs?: number;         // default: 140

//     durationMin?: number;         // default: 0.15
//     durationMax?: number;         // default: 0.35
//     ease?: string;                // default: 'power1.inOut'

//     // لو حابة تحددي scroller يدويًا (اختياري)
//     scroller?: Window | HTMLElement;
// };

// @Injectable({ providedIn: 'root' })
// export class ScrollSnapService {
//     private readonly isBrowser: boolean;

//     private scroller?: Window | HTMLElement;
//     private smoother?: any;

//     private pointsPx: number[] = [];

//     private tickerFn?: () => void;
//     private refreshInitFn?: () => void;

//     private lastY = 0;
//     private lastMoveAt = 0;

//     private animating = false;
//     private inited = false;

//     constructor(
//         private zone: NgZone,
//         @Inject(PLATFORM_ID) platformId: Object
//     ) {
//         this.isBrowser = isPlatformBrowser(platformId);
//     }

//     init(opts: SnapOptions = {}) {
//         if (!this.isBrowser) return;

//         const options: Required<SnapOptions> = {
//             panelSelector: opts.panelSelector ?? '.panel',
//             navOffsetPx: opts.navOffsetPx ?? 0,
//             enableOnMobile: opts.enableOnMobile ?? false,
//             mobileMaxWidth: opts.mobileMaxWidth ?? 767,
//             snapMode: opts.snapMode ?? 'startsAndEnds',
//             snapZoneRatio: opts.snapZoneRatio ?? 0.35,
//             stopDelayMs: opts.stopDelayMs ?? 140,
//             durationMin: opts.durationMin ?? 0.15,
//             durationMax: opts.durationMax ?? 0.35,
//             ease: opts.ease ?? 'power1.inOut',
//             scroller: (opts.scroller as any) ?? undefined,
//         };

//         const isMobile = window.matchMedia(`(max-width: ${options.mobileMaxWidth}px)`).matches;
//         if (isMobile && !options.enableOnMobile) return;

//         gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

//         this.zone.runOutsideAngular(() => {
//             this.destroy(); // امسحي أي قديم

//             // ✅ مهم جدًا: نستنى ScrollSmoother لو موجود (عشان scroller الحقيقي)
//             const tryStart = (triesLeft: number) => {
//                 const w = window as any;
//                 this.smoother = w.ScrollSmoother?.get?.() ?? undefined;

//                 // لو انتي مستخدمة ScrollSmoother في layout: غالبًا wrapper موجود
//                 // بس smoother.get() ممكن يبقى لسه null أول فريمين
//                 const wrapperEl = document.querySelector('#smooth-wrapper') as HTMLElement | null;

//                 if (!options.scroller) {
//                     if (this.smoother?.wrapper) {
//                         this.scroller = this.smoother.wrapper();
//                     } else if (wrapperEl) {
//                         // لو wrapper موجود بس smoother لسه متهيأش، استنى شوية
//                         if (triesLeft > 0) {
//                             requestAnimationFrame(() => tryStart(triesLeft - 1));
//                             return;
//                         }
//                         // fallback
//                         this.scroller = window;
//                     } else {
//                         this.scroller = window;
//                     }
//                 } else {
//                     this.scroller = options.scroller;
//                 }

//                 this.startInternal(options);
//             };

//             tryStart(25); // ~25 frame max
//         });
//     }

//     refresh() {
//         if (!this.isBrowser) return;
//         ScrollTrigger.refresh(true);
//         // rebuild points immediately
//         this.rebuildPoints();
//     }

//     destroy() {
//         if (!this.isBrowser) return;

//         // remove listeners
//         try {
//             if (this.tickerFn) gsap.ticker.remove(this.tickerFn);
//             if (this.refreshInitFn) ScrollTrigger.removeEventListener('refreshInit', this.refreshInitFn);
//         } catch { }

//         this.tickerFn = undefined;
//         this.refreshInitFn = undefined;

//         this.pointsPx = [];
//         this.scroller = undefined;
//         this.smoother = undefined;

//         this.lastY = 0;
//         this.lastMoveAt = 0;
//         this.animating = false;
//         this.inited = false;
//     }

//     // ====================== internal ======================

//     private startInternal(options: Required<SnapOptions>) {
//         if (!this.scroller) return;

//         // build points
//         this.rebuildPoints(options);

//         if (this.pointsPx.length < 2) return;

//         // rebuild on refreshInit
//         this.refreshInitFn = () => this.rebuildPoints(options);
//         ScrollTrigger.addEventListener('refreshInit', this.refreshInitFn);

//         // ticker "scroll stop" detector (شغال مع smoother أو بدون)
//         this.lastY = this.getScrollTop();
//         this.lastMoveAt = performance.now();

//         this.tickerFn = () => {
//             if (!this.inited) this.inited = true;

//             if (this.animating) {
//                 // أثناء الأنيميشن، حدّث lastY عشان ما يعملش snap تاني
//                 this.lastY = this.getScrollTop();
//                 this.lastMoveAt = performance.now();
//                 return;
//             }

//             const y = this.getScrollTop();
//             const now = performance.now();

//             if (Math.abs(y - this.lastY) > 0.5) {
//                 this.lastY = y;
//                 this.lastMoveAt = now;
//                 return;
//             }

//             // وقف
//             if (now - this.lastMoveAt >= options.stopDelayMs) {
//                 this.lastMoveAt = now + 999999; // امنع تكرار فوري
//                 this.snapIfNeeded(options);
//             }
//         };

//         gsap.ticker.add(this.tickerFn);

//         // initial refresh
//         ScrollTrigger.refresh(true);
//     }

//     private rebuildPoints(options?: Required<SnapOptions>) {
//         if (!this.scroller) return;

//         const panelSelector = options?.panelSelector ?? '.panel';
//         const navOffsetPx = options?.navOffsetPx ?? 0;
//         const snapMode = options?.snapMode ?? 'startsAndEnds';

//         ScrollTrigger.refresh(true);

//         const panels = gsap.utils.toArray<HTMLElement>(panelSelector);
//         if (panels.length < 2) {
//             this.pointsPx = [];
//             return;
//         }

//         const max = ScrollTrigger.maxScroll(this.scroller as any);
//         if (!max || max <= 0) {
//             this.pointsPx = [];
//             return;
//         }

//         const vh = Math.max(1, this.getViewportH() - navOffsetPx);
//         const pts: number[] = [];

//         for (const panel of panels) {
//             // start الحقيقي للسكشن مع scroller سواء window أو smoother.wrapper
//             const tmp = ScrollTrigger.create({
//                 trigger: panel,
//                 scroller: this.scroller as any,
//                 start: () => `top top+=${navOffsetPx}`,
//                 end: () => `bottom top+=${navOffsetPx}`,
//                 invalidateOnRefresh: true,
//             });

//             const startY = tmp.start;
//             tmp.kill();

//             pts.push(this.clamp(startY, 0, max));

//             if (snapMode === 'startsAndEnds') {
//                 const h = panel.offsetHeight;
//                 if (h > vh + 10) {
//                     // آخر full-screen داخل السكشن (بدون ما يطلع فراغ)
//                     const endFull = this.clamp(startY + (h - vh), 0, max);
//                     pts.push(endFull);
//                 }
//             }
//         }

//         this.pointsPx = Array.from(new Set(pts)).sort((a, b) => a - b);
//     }

//     private snapIfNeeded(options: Required<SnapOptions>) {
//         if (!this.scroller || this.pointsPx.length < 2) return;

//         const y = this.getScrollTop();
//         const vh = Math.max(1, this.getViewportH() - options.navOffsetPx);

//         // snap zone: فقط لو قريب من boundary (عشان السكشن الطويل مايتخطفش)
//         const zonePx = Math.max(140, vh * options.snapZoneRatio);

//         const nearest = this.findNearest(this.pointsPx, y);

//         if (Math.abs(nearest - y) > zonePx) return; // بعيد → سيبه
//         if (Math.abs(nearest - y) < 6) return;      // قريب جدًا → سيبه

//         const dist = Math.abs(nearest - y);
//         const duration = this.clamp(dist / 2600, options.durationMin, options.durationMax);

//         this.scrollTo(nearest, duration, options.ease);
//     }

//     private getViewportH(): number {
//         if (this.scroller === window) return window.innerHeight;
//         const el = this.scroller as HTMLElement;
//         return el?.clientHeight || window.innerHeight;
//     }

//     private getScrollTop(): number {
//         if (this.smoother?.scrollTop) return this.smoother.scrollTop();
//         if (this.scroller === window) return window.scrollY || window.pageYOffset || 0;
//         return (this.scroller as HTMLElement).scrollTop || 0;
//     }

//     private scrollTo(y: number, duration: number, ease: string) {
//         this.animating = true;

//         if (this.smoother) {
//             // ✅ أحسن طريقة مع smoother: animate scrollTop بتاعه مباشرة
//             gsap.to(this.smoother, {
//                 scrollTop: y,
//                 duration,
//                 ease,
//                 overwrite: true,
//                 onComplete: () => { this.animating = false; },
//                 onInterrupt: () => { this.animating = false; },
//             });
//             return;
//         }

//         const target = this.scroller === window ? window : (this.scroller as HTMLElement);

//         gsap.to(target as any, {
//             duration,
//             ease,
//             overwrite: true,
//             scrollTo: { y, autoKill: false },
//             onComplete: () => { this.animating = false; },
//             onInterrupt: () => { this.animating = false; },
//         });
//     }

//     private findNearest(list: number[], value: number): number {
//         let best = list[0];
//         let bestDist = Math.abs(best - value);
//         for (let i = 1; i < list.length; i++) {
//             const d = Math.abs(list[i] - value);
//             if (d < bestDist) {
//                 best = list[i];
//                 bestDist = d;
//             }
//         }
//         return best;
//     }

//     private clamp(n: number, min: number, max: number) {
//         return Math.max(min, Math.min(max, n));
//     }
// }
