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
// import { Inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';
// import gsap from 'gsap';
// import ScrollTrigger from 'gsap/ScrollTrigger';

// export type SnapOptions = {
//     panelSelector?: string;          // default: '.panel'
//     navOffsetPx?: number;            // default: 0
//     enableOnMobile?: boolean;        // default: false
//     mobileMaxWidth?: number;         // default: 767

//     // لو عايزة تحددي scroller يدويًا (اختياري)
//     scroller?: Window | HTMLElement;

//     // للسكاشن الطويلة
//     includeSectionEnd?: boolean;     // default: true
//     stationEveryVh?: boolean;        // default: false
//     stationStepVh?: number;          // default: 1

//     snapDelay?: number;              // default: 0.05
//     durationMin?: number;            // default: 0.15
//     durationMax?: number;            // default: 0.35
//     ease?: string;                   // default: 'power1.inOut'
//     inertia?: boolean;               // default: false
// };

// @Injectable({ providedIn: 'root' })
// export class ScrollSnapService {
//     private master?: ScrollTrigger;
//     private snapPoints: number[] = [];
//     private refreshHandler?: () => void;

//     // ✅ ممنوع نديها window هنا (SSR)
//     private currentScroller?: Window | HTMLElement;

//     private readonly isBrowser: boolean;

//     constructor(
//         private zone: NgZone,
//         @Inject(PLATFORM_ID) platformId: Object
//     ) {
//         this.isBrowser = isPlatformBrowser(platformId);
//     }

//     /** ✅ detect ScrollSmoother wrapper لو موجود */
//     private detectScroller(): Window | HTMLElement {
//         // دي بتتنادي في browser فقط
//         const w = window as any;
//         const smoother = w.ScrollSmoother?.get?.();
//         if (smoother?.wrapper) return smoother.wrapper();
//         return window;
//     }

//     init(options: SnapOptions = {}) {
//         if (!this.isBrowser) return;

//         // ✅ Register plugin في البراوزر فقط
//         gsap.registerPlugin(ScrollTrigger);

//         const {
//             panelSelector = '.panel',
//             navOffsetPx = 0,
//             enableOnMobile = false,
//             mobileMaxWidth = 767,
//             scroller,
//             includeSectionEnd = true,
//             stationEveryVh = false,
//             stationStepVh = 1,
//             snapDelay = 0.05,
//             durationMin = 0.15,
//             durationMax = 0.35,
//             ease = 'power1.inOut',
//             inertia = false,
//         } = options;

//         const isMobile = window.matchMedia(`(max-width: ${mobileMaxWidth}px)`).matches;
//         if (isMobile && !enableOnMobile) return;

//         this.zone.runOutsideAngular(() => {
//             // ✅ امسحي أي instance قديم
//             this.destroy();

//             this.currentScroller = scroller ?? this.detectScroller();

//             // refresh قبل القياسات
//             ScrollTrigger.refresh(true);

//             const panels = gsap.utils.toArray<HTMLElement>(panelSelector);
//             if (panels.length < 2) return;

//             const getViewportH = () => {
//                 if (this.currentScroller === window) return window.innerHeight;
//                 const el = this.currentScroller as HTMLElement;
//                 return el.clientHeight || window.innerHeight;
//             };

//             const buildSnapPoints = () => {
//                 ScrollTrigger.refresh(true);

//                 const max = ScrollTrigger.maxScroll(this.currentScroller as any);
//                 if (!max || max <= 0) return [];

//                 const vh = Math.max(1, getViewportH() - navOffsetPx);
//                 const pointsPx: number[] = [];

//                 for (const panel of panels) {
//                     // ✅ trigger مؤقت عشان start/end يطلعوا صح مع window أو smoother
//                     const tmp = ScrollTrigger.create({
//                         trigger: panel,
//                         scroller: this.currentScroller as any,
//                         start: () => `top top+=${navOffsetPx}`,
//                         end: () => `bottom bottom+=${navOffsetPx}`,
//                         invalidateOnRefresh: true,
//                     });

//                     const startY = tmp.start;
//                     const endY = tmp.end;

//                     pointsPx.push(startY);

//                     if (includeSectionEnd && endY > startY + vh * 0.25) {
//                         pointsPx.push(endY);
//                     }

//                     if (stationEveryVh && endY > startY + vh * 2) {
//                         const step = Math.max(1, stationStepVh) * vh;
//                         for (let y = startY + step; y < endY - 1; y += step) {
//                             pointsPx.push(y);
//                         }
//                     }

//                     tmp.kill();
//                 }

//                 const uniqSorted = Array.from(new Set(pointsPx))
//                     .map((y) => Math.max(0, Math.min(max, y)))
//                     .sort((a, b) => a - b);

//                 return uniqSorted.map((y) => y / max);
//             };

//             this.snapPoints = buildSnapPoints();
//             if (this.snapPoints.length < 2) return;

//             // ✅ Master Trigger: يمنع الوقوف بين السكاشن
//             this.master = ScrollTrigger.create({
//                 scroller: this.currentScroller as any,
//                 start: 0,
//                 end: () => ScrollTrigger.maxScroll(this.currentScroller as any),
//                 snap: {
//                     snapTo: (p) => gsap.utils.snap(this.snapPoints, p), // أقرب نقطة
//                     delay: snapDelay,
//                     duration: { min: durationMin, max: durationMax },
//                     ease,
//                     inertia,
//                 },
//             });

//             // ✅ قبل أي refresh: ابني النقاط من جديد
//             this.refreshHandler = () => {
//                 this.snapPoints = buildSnapPoints();
//             };
//             ScrollTrigger.addEventListener('refreshInit', this.refreshHandler);

//             ScrollTrigger.refresh(true);
//         });
//     }

//     refresh() {
//         if (!this.isBrowser) return;
//         ScrollTrigger.refresh(true);
//     }

//     destroy() {
//         if (!this.isBrowser) return;

//         try {
//             if (this.refreshHandler) {
//                 ScrollTrigger.removeEventListener('refreshInit', this.refreshHandler);
//             }
//         } catch { }

//         this.refreshHandler = undefined;

//         if (this.master) {
//             this.master.kill();
//             this.master = undefined;
//         }

//         this.snapPoints = [];
//         this.currentScroller = undefined;
//     }
// }
