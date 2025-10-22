// import { isPlatformBrowser } from '@angular/common';
// import { Component, AfterViewInit, OnDestroy, PLATFORM_ID, Inject, ApplicationRef, NgZone } from '@angular/core';
// import { gsap } from 'gsap';
// import { Draggable } from 'gsap/Draggable';
// import { InertiaPlugin } from 'gsap/InertiaPlugin';

// gsap.registerPlugin(Draggable, InertiaPlugin);

// @Component({
//   selector: 'app-section9',
//   templateUrl: './section9.component.html',
//   styleUrls: ['./section9.component.scss']
// })
// export class Section9Component {
//   constructor(
//     @Inject(PLATFORM_ID) private platformId: Object,
//     private appRef: ApplicationRef,
//     private ngZone: NgZone

//   ) { }
//   ngAfterViewInit() {
//     if (typeof window === 'undefined') return;

//     if (!isPlatformBrowser(this.platformId)) return;
//     this.ngZone.onStable.subscribe(() => {
//       requestAnimationFrame(() => {
//         setTimeout(() => {
//           const wrapper = document.querySelector('.wrapper') as HTMLElement;
//           const boxes = gsap.utils.toArray<HTMLElement>('.box');

//           let activeElement: HTMLElement | null = null;

//           const loop = this.horizontalLoop(boxes, {
//             paused: false,
//             draggable: true,
//             center: true,
//             onChange: (element: HTMLElement) => {
//               if (!element) return;
//               activeElement?.classList.remove('active');
//               element.classList.add('active');
//               activeElement = element;
//             },
//           });

//           document.querySelector('.next')?.addEventListener('click', () =>
//             (loop as any).next({ duration: 0.5, ease: 'power1.inOut' })
//           );

//         }, 0);
//       });
//     });


//   }
//   horizontalLoop(items: HTMLElement[], config: any = {}): gsap.core.Timeline {
//     if (!items || items.length === 0) {
//       console.warn('[horizontalLoop] لا يوجد عناصر!');
//       return gsap.timeline();
//     }

//     const tl = gsap.timeline({
//       repeat: config.repeat ?? -1,
//       paused: !!config.paused,
//       defaults: { ease: 'none' },
//       onReverseComplete: () => { tl.totalTime(tl.rawTime() + tl.duration() * 100) },
//     });

//     const length = items.length;
//     const widths: number[] = [];
//     const xPercents: number[] = [];
//     const times: number[] = [];
//     const spaceBefore: number[] = [];

//     let curIndex = 0;
//     let lastIndex = 0;
//     let indexIsDirty = false;
//     const pixelsPerSecond = (config.speed || 1) * 100;
//     const snap =
//       config.snap === false
//         ? (v: number) => v
//         : gsap.utils.snap(config.snap || 1);

//     const container: HTMLElement =
//       (config.center === true
//         ? (items[0].parentNode as HTMLElement)
//         : (gsap.utils.toArray(config.center)[0] as HTMLElement)) ||
//       (items[0].parentNode as HTMLElement);

//     const startX = items[0].offsetLeft;

//     const getTotalWidth = (): number => {
//       const last = items[length - 1];
//       return (
//         last.offsetLeft +
//         (xPercents[length - 1] / 100) * widths[length - 1] -
//         startX +
//         spaceBefore[0] +
//         last.offsetWidth * Number(gsap.getProperty(last, 'scaleX')) +
//         (parseFloat(config.paddingRight) || 0)
//       );
//     };

//     const populateWidths = () => {
//       let b1 = container.getBoundingClientRect();
//       let b2: DOMRect;
//       items.forEach((el, i) => {
//         widths[i] = Number(gsap.getProperty(el, 'width', 'px')) || el.offsetWidth;
//         const xPx = Number(gsap.getProperty(el, 'x', 'px')) || 0;
//         const xPercent = Number(gsap.getProperty(el, 'xPercent')) || 0;
//         xPercents[i] = snap((xPx / widths[i]) * 100 + xPercent);
//         b2 = el.getBoundingClientRect();
//         spaceBefore[i] = b2.left - (i ? b1.right : b1.left);
//         b1 = b2;
//       });
//       gsap.set(items, { xPercent: (i: number) => xPercents[i] });
//     };

//     let totalWidth = 0;
//     let timeWrap: (n: number) => number;

//     const populateTimeline = () => {
//       tl.clear();
//       totalWidth = getTotalWidth();
//       for (let i = 0; i < length; i++) {
//         const item = items[i];
//         const curX = (xPercents[i] / 100) * widths[i];
//         const distanceToStart = item.offsetLeft + curX - startX + spaceBefore[0];
//         const distanceToLoop = distanceToStart + widths[i] * Number(gsap.getProperty(item, 'scaleX'));

//         tl.to(
//           item,
//           {
//             xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
//             duration: distanceToLoop / pixelsPerSecond,
//           },
//           0
//         )
//           .fromTo(
//             item,
//             {
//               xPercent: snap(((curX - distanceToLoop + totalWidth) / widths[i]) * 100),
//             },
//             {
//               xPercent: xPercents[i],
//               duration:
//                 (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
//               immediateRender: false,
//             },
//             distanceToLoop / pixelsPerSecond
//           )
//           .add('label' + i, distanceToStart / pixelsPerSecond);

//         times[i] = distanceToStart / pixelsPerSecond;
//       }
//       timeWrap = gsap.utils.wrap(0, tl.duration());
//     };

//     populateWidths();
//     populateTimeline();

//     const toIndex = (index: number, vars: any = {}) => {
//       if (!length) return tl;
//       const l = length;
//       if (Math.abs(index - curIndex) > l / 2)
//         index += index > curIndex ? -l : l;
//       const newIndex = gsap.utils.wrap(0, l, index);
//       let time = times[newIndex];
//       if (time > tl.time() !== index > curIndex && index !== curIndex) {
//         time += tl.duration() * (index > curIndex ? 1 : -1);
//       }
//       if (time < 0 || time > tl.duration()) {
//         vars.modifiers = { time: timeWrap };
//       }
//       curIndex = newIndex;
//       vars.overwrite = true;
//       return vars.duration === 0
//         ? tl.time(timeWrap(time))
//         : tl.tweenTo(time, vars);
//     };

//     (tl as any).toIndex = (index: number, vars?: any) => toIndex(index, vars);
//     (tl as any).closestIndex = (setCurrent?: boolean) => {
//       const index = getClosest(times, tl.time(), tl.duration());
//       if (setCurrent) {
//         curIndex = index;
//         indexIsDirty = false;
//       }
//       return index;
//     };
//     (tl as any).current = () =>
//       indexIsDirty ? (tl as any).closestIndex(true) : curIndex;
//     (tl as any).next = (vars?: any) => toIndex(curIndex + 1, vars);
//     (tl as any).previous = (vars?: any) => toIndex(curIndex - 1, vars);
//     (tl as any).times = times;

//     function getClosest(values: number[], value: number, wrap: number): number {
//       let i = values.length,
//         closest = 1e10,
//         index = 0,
//         d: number;
//       while (i--) {
//         d = Math.abs(values[i] - value);
//         if (d > wrap / 2) d = wrap - d;
//         if (d < closest) {
//           closest = d;
//           index = i;
//         }
//       }
//       return index;
//     }

//     if (config.draggable && typeof Draggable === 'function') {
//       const proxy = document.createElement('div');
//       const wrap = gsap.utils.wrap(0, 1);
//       let ratio = 0;
//       let startProgress = 0;
//       let draggable: any;
//       let wasPlaying = false;

//       const align = (): void => {
//         tl.progress(wrap(startProgress + (draggable.startX - draggable.x) * ratio));
//       };

//       const syncIndex = (): void => {
//         (tl as any).closestIndex(true);
//       };

//       draggable = Draggable.create(proxy, {
//         trigger: container,
//         type: 'x',
//         inertia: !!config.inertia,
//         onPressInit(): void {
//           gsap.killTweensOf(tl);
//           wasPlaying = !tl.paused();
//           tl.pause();
//           startProgress = tl.progress();
//           ratio = 1 / totalWidth;
//           gsap.set(proxy, { x: startProgress / -ratio });
//         },
//         onDrag(): void {
//           align();
//         },
//         onThrowUpdate(): void {
//           align();
//         },
//         onRelease(): void {
//           syncIndex();
//           if (wasPlaying) tl.play();
//         },
//       })[0];

//       (tl as any).draggable = draggable;
//     }


//     (tl as any).closestIndex(true);
//     lastIndex = curIndex;
//     if (config.onChange) config.onChange(items[curIndex], curIndex);

//     const onResize = () => {
//       const progress = tl.progress();
//       populateWidths();
//       populateTimeline();
//       tl.progress(progress, true);
//     };
//     window.addEventListener('resize', onResize);

//     (tl as any).cleanup = () => window.removeEventListener('resize', onResize);

//     return tl;
//   }

// }
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  NgZone,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import Draggable from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

@Component({
  selector: 'app-section9',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './section9.component.html',
  styleUrls: ['./section9.component.scss'],
})
export class Section9Component {
  @ViewChild('wrapper', { static: false }) wrapperRef!: ElementRef<HTMLElement>;
  @ViewChild('nextBtn', { static: false }) nextBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('prevBtn', { static: false }) prevBtn!: ElementRef<HTMLButtonElement>;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone
  ) { }

  // ngAfterViewInit(): void {
  //   if (!isPlatformBrowser(this.platformId)) return;

  //   this.ngZone.runOutsideAngular(() => {
  //     const wrapper = this.wrapperRef.nativeElement;
  //     const boxes = gsap.utils.toArray<HTMLElement>('.box');
  //     if (!boxes.length) return;

  //     let activeElement: HTMLElement | null = null;

  //     const loop = this.horizontalLoop(boxes, {
  //       draggable: true,
  //       center: true,
  //       speed: 1,
  //       onChange: (element: HTMLElement) => {
  //         if (activeElement) activeElement.classList.remove('active');
  //         element.classList.add('active');
  //         activeElement = element;
  //       },
  //     });

  //     // ✅ أزرار التحكم
  //     this.nextBtn.nativeElement.addEventListener('click', () => {
  //       (loop as any).next({ duration: 0.6, ease: 'power1.inOut' });
  //     });

  //     this.prevBtn.nativeElement.addEventListener('click', () => {
  //       (loop as any).previous({ duration: 0.6, ease: 'power1.inOut' });
  //     });
  //   });
  // }

  // horizontalLoop(items: HTMLElement[], config: any = {}): gsap.core.Timeline {
  //   if (!items.length) return gsap.timeline();

  //   const tl = gsap.timeline({
  //     repeat: -1,
  //     paused: !!config.paused,
  //     defaults: { ease: 'none' },
  //   });

  //   const length = items.length;
  //   const widths: number[] = [];
  //   const xPercents: number[] = [];
  //   const times: number[] = [];

  //   const pixelsPerSecond = (config.speed || 1) * 100;
  //   const snap = config.snap === false ? (v: number) => v : gsap.utils.snap(1);

  //   const startX = items[0].offsetLeft;

  //   const getTotalWidth = (): number =>
  //     items[length - 1].offsetLeft +
  //     items[length - 1].offsetWidth -
  //     startX +
  //     (parseFloat(config.paddingRight) || 0);

  //   const populateWidths = (): void => {
  //     items.forEach((el, i) => {
  //       widths[i] = Number(gsap.getProperty(el, 'width', 'px')) || el.offsetWidth;
  //       const xPx = Number(gsap.getProperty(el, 'x', 'px')) || 0;
  //       const xPercent = Number(gsap.getProperty(el, 'xPercent')) || 0;
  //       xPercents[i] = snap((xPx / widths[i]) * 100 + xPercent);
  //     });
  //     gsap.set(items, { xPercent: (i: number) => xPercents[i] });
  //   };

  //   let totalWidth = 0;
  //   let timeWrap: (n: number) => number;

  //   const populateTimeline = (): void => {
  //     tl.clear();
  //     totalWidth = getTotalWidth();

  //     items.forEach((item, i) => {
  //       const curX = (xPercents[i] / 100) * widths[i];
  //       const distanceToStart = item.offsetLeft + curX - startX;
  //       const distanceToLoop = distanceToStart + widths[i];

  //       tl.to(
  //         item,
  //         {
  //           xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
  //           duration: distanceToLoop / pixelsPerSecond,
  //         },
  //         0
  //       )
  //         .fromTo(
  //           item,
  //           {
  //             xPercent: snap(((curX - distanceToLoop + totalWidth) / widths[i]) * 100),
  //           },
  //           {
  //             xPercent: xPercents[i],
  //             duration:
  //               (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
  //             immediateRender: false,
  //           },
  //           distanceToLoop / pixelsPerSecond
  //         )
  //         .add('label' + i, distanceToStart / pixelsPerSecond);

  //       times[i] = distanceToStart / pixelsPerSecond;
  //     });

  //     timeWrap = gsap.utils.wrap(0, tl.duration());
  //   };

  //   populateWidths();
  //   populateTimeline();

  //   const toIndex = (index: number, vars: any = {}): gsap.core.Tween => {
  //     const curIndex = Math.round(tl.time() / (tl.duration() / length));
  //     if (Math.abs(index - curIndex) > length / 2)
  //       index += index > curIndex ? -length : length;

  //     const newIndex = gsap.utils.wrap(0, length, index);
  //     let time = times[newIndex];
  //     if (time < 0 || time > tl.duration()) vars.modifiers = { time: timeWrap };
  //     vars.overwrite = true;
  //     return tl.tweenTo(timeWrap(time), vars);
  //   };

  //   (tl as any).toIndex = (index: number, vars?: any) => toIndex(index, vars);
  //   (tl as any).next = (vars?: any) =>
  //     toIndex(1 + Math.round(tl.time() / (tl.duration() / length)), vars);
  //   (tl as any).previous = (vars?: any) =>
  //     toIndex(-1 + Math.round(tl.time() / (tl.duration() / length)), vars);

  //   // ✅ Draggable integration
  //   if (config.draggable && typeof Draggable === 'function') {
  //     const proxy = document.createElement('div');
  //     const wrap = gsap.utils.wrap(0, 1);
  //     let ratio = 0;
  //     let startProgress = 0;
  //     let draggable: any;
  //     let wasPlaying = false;

  //     const align = (): void => {
  //       tl.progress(wrap(startProgress + (draggable.startX - draggable.x) * ratio));
  //     };

  //     draggable = Draggable.create(proxy, {
  //       trigger: items[0].parentNode as HTMLElement,
  //       type: 'x',
  //       inertia: true,
  //       allowEventDefault: true, // ✅ يمنع تحذير preventDefault
  //       onPressInit(): void {
  //         gsap.killTweensOf(tl);
  //         wasPlaying = !tl.paused();
  //         tl.pause();
  //         startProgress = tl.progress();
  //         ratio = 1 / totalWidth;
  //         gsap.set(proxy, { x: startProgress / -ratio });
  //       },
  //       onDrag(): void {
  //         align();
  //       },
  //       onThrowUpdate(): void {
  //         align();
  //       },
  //       onRelease(): void {
  //         if (wasPlaying) tl.play();
  //       },
  //     })[0];

  //     (tl as any).draggable = draggable;
  //   }

  //   return tl;
  // }
}
