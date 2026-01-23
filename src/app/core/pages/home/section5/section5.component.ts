// import { isPlatformBrowser } from '@angular/common';
// import { ApplicationRef, ChangeDetectorRef, Component, Inject, NgZone, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
// import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
// import gsap from 'gsap';
// import ScrollTrigger from 'gsap/ScrollTrigger';

// import SplitText from "gsap/SplitText";
// gsap.registerPlugin(ScrollTrigger, SplitText);
// import { LanguageService } from '../../../shared/services/language.service';
// import { TranslatePipe } from '@ngx-translate/core';
// @Component({
//   selector: 'app-section5',
//   imports: [TranslatePipe],
//   templateUrl: './section5.component.html',
//   styleUrl: './section5.component.scss'
// })
// export class Section5Component {
//   isMobile = false;
//   private resizeHandler!: () => void;

//   isVideoLoaded = false;
//   safeVideoUrl: SafeResourceUrl | null = null;
//   constructor(
//     @Inject(PLATFORM_ID) private platformId: Object,
//     private appRef: ApplicationRef,
//     private ngZone: NgZone,
//     private cdr: ChangeDetectorRef
//     , private sanitizer: DomSanitizer,
//     private language: LanguageService
//   ) {
//   }
//   ngOnInit() {
//     this.updateIsMobile();
//     if (typeof window === 'undefined') return;
//     if (!isPlatformBrowser(this.platformId)) return;
//     gsap.set("#section100", { opacity: 0, visibility: "hidden" });
//   }

//   ngAfterViewInit() {
//     if (typeof window === 'undefined') return;
//     if (!isPlatformBrowser(this.platformId)) return;

//     this.resizeHandler = () => {
//       this.ngZone.run(() => {
//         const next = window.innerWidth < 700;
//         if (next !== this.isMobile) {
//           this.isMobile = next;
//           this.cdr.detectChanges();
//         }
//       });
//     };

//     window.addEventListener('resize', this.resizeHandler);
//     this.ngZone.runOutsideAngular(() => {
//       requestAnimationFrame(() => {
//         setTimeout(() => {
//           const tl = gsap.timeline({
//             defaults: { ease: "power3.out" }, scrollTrigger: {
//               trigger: "#section5",
//               start: 'top top',
//               end: "100% bottom",
//               pin: true,
//               anticipatePin: 1,
//               pinType: 'transform',
//             }
//           });
//           tl.to("#Text5", { opacity: 1, y: 0, duration: 0.6, ease: 'power2.inOut' });

//           const path = document.querySelector(".capsule-path") as SVGPathElement;
//           const length = path.getTotalLength();
//           gsap.set("#image-container", { opacity: 0, visibility: "hidden" });
//           gsap.set(path, { strokeDasharray: length, strokeDashoffset: length, opacity: 0, visibility: "hidden" });
//           const container = document.querySelector("#image-container") as HTMLElement;
//           gsap.set(container, { opacity: 0, visibility: "hidden" });

//           let imagesShown = false;
//           let flipStarted = false;

//           tl.to(path, {
//             opacity: 1,
//             visibility: "visible",
//             strokeDashoffset: 0,
//             duration: 1,
//             ease: "power2.inOut",
//             onUpdate: () => {
//               const currentOffset = gsap.getProperty(path, "strokeDashoffset") as number;
//               const progress = 1 - currentOffset / length;

//               if (progress >= 0.5 && !imagesShown) {
//                 imagesShown = true;
//                 gsap.to(container, {
//                   opacity: 1,
//                   visibility: "visible",
//                   duration: 0.6,
//                   ease: "power2.out",
//                 });
//               }

//               if (progress >= 1 && !flipStarted) {
//                 flipStarted = true;
//                 this.startImageFlip(container);
//               }
//             },
//             onComplete: () => {
//               gsap.fromTo("#section100", { opacity: 0, visibility: "hidden" }, { opacity: 1, visibility: "visible", duration: 0.5 });
//             }
//           });
//         }, 500);
//       });
//     });
//   }
//   startImageFlip(container: HTMLElement) {
//     const slots = Array.from(container.querySelectorAll(".slot")) as HTMLElement[];

//     const allSources = [
//       "/images/homepage/logos/1.webp",
//       "/images/homepage/logos/2.webp",
//       "/images/homepage/logos/3.webp",
//       "/images/homepage/logos/4.webp",
//       "/images/homepage/logos/5.webp",
//       "/images/homepage/logos/6.webp",
//       "/images/homepage/logos/7.webp",
//       "/images/homepage/logos/8.webp",
//       "/images/homepage/logos/9.webp",
//       "/images/homepage/logos/10.webp",
//       "/images/homepage/logos/11.webp",
//       "/images/homepage/logos/12.webp",
//       "/images/homepage/logos/13.webp",
//       "/images/homepage/logos/14.webp",
//       "/images/homepage/logos/15.webp"
//     ];
//     const slotImages: Map<HTMLElement, string[]> = new Map();

//     slots.forEach((slot, i) => {
//       const img = slot.querySelector("img")!;
//       img.src = allSources[i];
//       const remaining = allSources.filter((_, idx) => idx !== i);
//       const randomSubset = gsap.utils.shuffle(remaining).slice(0, 4);
//       slotImages.set(slot, randomSubset);
//     });

//     function flipSlot(slot: HTMLElement) {
//       const img = slot.querySelector("img")!;
//       const queue = slotImages.get(slot)!;
//       if (!queue.length) return;

//       const newSrc = queue.shift()!;
//       gsap.to(img, {
//         y: -80,
//         opacity: 0,
//         duration: 0.4,
//         ease: "power2.in",
//         onComplete: () => {
//           img.src = newSrc;
//           gsap.set(img, { y: 80, opacity: 0 });
//           gsap.to(img, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" });
//         },
//       });
//     }

//     function randomLoop() {

//       const available = slots.filter(slot => (slotImages.get(slot)?.length ?? 0) > 0);
//       if (!available.length) {
//         console.log("✅ كل الخانات خلصت الصور");
//         return;
//       }

//       const randomCount = gsap.utils.random(1, Math.min(3, available.length), 1);
//       const randomSlots = gsap.utils.shuffle(available).slice(0, randomCount);

//       randomSlots.forEach(slot => flipSlot(slot));

//       const nextDelay = gsap.utils.random(1, 2.5, 0.2) * 1000;
//       setTimeout(randomLoop, nextDelay);
//     }

//     randomLoop();
//   }
//   private updateIsMobile() {
//     if (isPlatformBrowser(this.platformId)) {
//       this.isMobile = window.innerWidth < 700;
//     }
//   }
//   loadVideo() {
//     this.isVideoLoaded = true;
//     // حوّل URL إلى SafeResourceUrl
//     this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.videoUrl);
//     this.cdr.detectChanges();
//   }

//   get videoUrl() {
//     return 'https://www.youtube.com/embed/inlofWRsKxU?autoplay=1&controls=1';
//   }
//   ngOnDestroy() {
//     if (this.resizeHandler) {
//       window.removeEventListener('resize', this.resizeHandler);
//     }
//   }
// }
import { isPlatformBrowser } from '@angular/common';
import { ApplicationRef, ChangeDetectorRef, Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from "gsap/SplitText";
gsap.registerPlugin(ScrollTrigger, SplitText);
import { LanguageService } from '../../../shared/services/language.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-section5',
  imports: [TranslatePipe],
  templateUrl: './section5.component.html',
  styleUrl: './section5.component.scss'
})
export class Section5Component {

  isVideoLoaded = false;
  safeVideoUrl: SafeResourceUrl | null = null;

  private isIOS = false;
  private flipTimer: any = null;
  private mm?: gsap.MatchMedia;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appRef: ApplicationRef,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private language: LanguageService
  ) { }

  ngOnInit() {
    if (typeof window === 'undefined') return;
    if (!isPlatformBrowser(this.platformId)) return;

    const ua = navigator.userAgent;
    this.isIOS =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    gsap.set("#section100", { opacity: 0, visibility: "hidden" });
  }

  ngAfterViewInit() {
    if (typeof window === 'undefined') return;
    if (!isPlatformBrowser(this.platformId)) return;

    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          ScrollTrigger.config({ ignoreMobileResize: true });

          // ✅ أهم تعديل: نخزن matchMedia في this.mm عشان ngOnDestroy يقدر ينضفه
          this.mm = gsap.matchMedia();

          this.mm.add(
            {
              desktop: '(min-width: 700px)',
              mobile: '(max-width: 699px)',
            },
            (ctx) => {
              const { desktop, mobile } = (ctx.conditions || {}) as any;

              const container = document.querySelector("#image-container") as HTMLElement | null;
              if (container) {
                gsap.set(container, { opacity: 0, visibility: "hidden", y: 10 });
              }

              gsap.set("#section100", { opacity: 0, visibility: "hidden" });

              let flipStarted = false;

              const tl = gsap.timeline({
                defaults: { ease: "power3.out" },
                scrollTrigger: {
                  trigger: "#homeSection5",
                  start: mobile ? 'top 85%' : 'top top',
                  end: desktop ? "100% bottom" : '50% bottom',
                  pin: desktop ? true : false,
                  anticipatePin: 1,
                  // markers: true,
                  scrub: mobile ? 0.2 : false,
                  pinType: 'transform',
                  invalidateOnRefresh: true,
                  pinSpacing: mobile ? false : true,
                  onLeave: () => {
                    if (mobile) {
                      tl.totalProgress(1, false)

                      // (اختياري) لو عايز تمنع flip لو اليوزر نزل بسرعة
                      if (this.flipTimer) clearTimeout(this.flipTimer);
                    }
                  },
                  onLeaveBack: () => {
                    if (mobile) tl.totalProgress(0, false);
                  },
                }
              });
              ScrollTrigger.refresh();
              setTimeout(() => window.dispatchEvent(new Event('pin-ready')), 0);


              // 1) العنوان
              tl.to("#Text5", { opacity: 1, y: 0, duration: 0.1, ease: 'power2.inOut' });

              // 2) الكونتينر اللي شايل الصور يظهر
              if (container) {
                tl.to(container, {
                  opacity: 1,
                  y: 0,
                  visibility: "visible",
                  duration: 0.2,
                  ease: "power2.out",
                  onComplete: () => {
                    if (!flipStarted) {
                      flipStarted = true;
                      if (!mobile && !this.isIOS) this.startImageFlip(container);
                    }
                  }
                }, ">-0.1");
              }

              // 3) باقي السكشن يظهر
              tl.to("#section100", {
                opacity: 1,
                visibility: "visible",
                duration: 0.2,
                ease: "power2.out",
              }, ">-0.05");

              // ScrollTrigger.refresh();

              return () => {
                tl.scrollTrigger?.kill();
                tl.kill();
              };
            }
          );
          requestAnimationFrame(() => {
            ScrollTrigger.refresh();
          });
        }, 0);
      });
    });
  }

  startImageFlip(container: HTMLElement) {
    const slots = Array.from(container.querySelectorAll(".slot")) as HTMLElement[];

    const allSources = [
      "/images/homepage/logos/1.webp",
      "/images/homepage/logos/2.webp",
      "/images/homepage/logos/3.webp",
      "/images/homepage/logos/4.webp",
      "/images/homepage/logos/5.webp",
      "/images/homepage/logos/6.webp",
      "/images/homepage/logos/7.webp",
      "/images/homepage/logos/8.webp",
      "/images/homepage/logos/9.webp",
      "/images/homepage/logos/10.webp",
      "/images/homepage/logos/11.webp",
      "/images/homepage/logos/12.webp",
      "/images/homepage/logos/13.webp",
      "/images/homepage/logos/14.webp",
      "/images/homepage/logos/15.webp",
      "/images/homepage/logos/16.webp",
      "/images/homepage/logos/17.webp",
      "/images/homepage/logos/18.webp",
      "/images/homepage/logos/19.webp",
      "/images/homepage/logos/20.webp",
      "/images/homepage/logos/21.webp",
      "/images/homepage/logos/22.webp",
      "/images/homepage/logos/23.webp",
      "/images/homepage/logos/24.webp",
      "/images/homepage/logos/25.webp",
      "/images/homepage/logos/26.webp",
      "/images/homepage/logos/27.webp",
      "/images/homepage/logos/28.webp",
      "/images/homepage/logos/29.webp",
      "/images/homepage/logos/30.webp",
      "/images/homepage/logos/31.webp",
      "/images/homepage/logos/32.webp",
      "/images/homepage/logos/33.webp",
      "/images/homepage/logos/34.webp",
      "/images/homepage/logos/35.webp",
      "/images/homepage/logos/36.webp",
      "/images/homepage/logos/37.webp",
      "/images/homepage/logos/38.webp",
      "/images/homepage/logos/39.webp",
      "/images/homepage/logos/40.webp",
      "/images/homepage/logos/41.webp",
      "/images/homepage/logos/42.webp",
      "/images/homepage/logos/43.webp",
      "/images/homepage/logos/44.webp",

    ];

    const slotImages: Map<HTMLElement, string[]> = new Map();

    slots.forEach((slot, i) => {
      const img = slot.querySelector("img")!;
      img.src = allSources[i];
      const remaining = allSources.filter((_, idx) => idx !== i);
      const randomSubset = gsap.utils.shuffle(remaining).slice(0, 4);
      slotImages.set(slot, randomSubset);
    });

    function flipSlot(slot: HTMLElement) {
      const img = slot.querySelector("img")!;
      const queue = slotImages.get(slot)!;
      if (!queue.length) return;

      const newSrc = queue.shift()!;
      gsap.to(img, {
        y: -80,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          img.src = newSrc;
          gsap.set(img, { y: 80, opacity: 0 });
          gsap.to(img, { y: 0, opacity: 1, duration: 0.2, ease: "power2.out" });
        },
      });
    }

    const scheduleNext = (ms: number) => {
      this.flipTimer = setTimeout(randomLoop, ms);
    };

    function randomLoop() {
      const available = slots.filter(slot => (slotImages.get(slot)?.length ?? 0) > 0);
      if (!available.length) return;

      const randomCount = gsap.utils.random(1, Math.min(3, available.length), 1);
      const randomSlots = gsap.utils.shuffle(available).slice(0, randomCount);
      randomSlots.forEach(slot => flipSlot(slot));

      const nextDelay = gsap.utils.random(1, 2, 0.2) * 1000;
      scheduleNext(nextDelay);
    }

    randomLoop();
  }

  loadVideo() {
    this.isVideoLoaded = true;
    this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.videoUrl);
    this.cdr.detectChanges();
  }

  get videoUrl() {
    return 'https://www.youtube.com/embed/N-o9jYbBdyM?si=x11IbITJyoYWMZIl';
  }

  ngOnDestroy() {
    if (this.flipTimer) clearTimeout(this.flipTimer);
    this.mm?.revert(); // ✅ دلوقتي هتشتغل فعلاً
  }
}
