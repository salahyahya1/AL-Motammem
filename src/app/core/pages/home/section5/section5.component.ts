import { isPlatformBrowser } from '@angular/common';
import { ApplicationRef, Component, Inject, NgZone, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(ScrollTrigger, SplitText);

@Component({
  selector: 'app-section5',
  imports: [],
  templateUrl: './section5.component.html',
  styleUrl: './section5.component.scss'
})
export class Section5Component {
  isMobile = false;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appRef: ApplicationRef,
    private ngZone: NgZone

  ) { }
  //second animation text apper and the celnder drawed
  ngAfterViewInit() {
    if (typeof window === 'undefined') return;
    if (!isPlatformBrowser(this.platformId)) return;
    this.isMobile = window.innerWidth < 700;

    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" }, scrollTrigger: {
            trigger: "#section5",
            start: 'top top',
            end: "150% bottom",
            pin: true,
            // markers: true
          }
        });
        // let triggered = false;
        tl.to("#Text5", { opacity: 1, y: 0, duration: 0.8, ease: 'power2.inOut' });
        // triggered = false;
        /////////////////////////////////////////////////////////
        const path = document.querySelector(".capsule-path") as SVGPathElement;
           gsap.set("#image-container", { opacity: 0, visibility: "hidden" });
gsap.set(path, { strokeDasharray: length, strokeDashoffset: length, opacity: 0, visibility: "hidden" });
const container = document.querySelector("#image-container") as HTMLElement;
      gsap.set(container, { opacity: 0, visibility: "hidden" });

      let imagesShown = false;
      let flipStarted = false;

      // التحريك الفعلي
      tl.to(path, {
        opacity: 1,
        visibility: "visible",
        strokeDashoffset: 0,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: () => {
          const currentOffset = gsap.getProperty(path, "strokeDashoffset") as number;
          const progress = 1 - currentOffset / length; // 0 → 1 = نسبة الرسم

          // ✅ عند 50% أظهر الصور
          if (progress >= 0.5 && !imagesShown) {
            imagesShown = true;
            gsap.to(container, {
              opacity: 1,
              visibility: "visible",
              duration: 0.6,
              ease: "power2.out",
            });
          }

          // ✅ عند 100% ابدأ التبديل
          if (progress >= 1 && !flipStarted) {
            flipStarted = true;
            this.startImageFlip(container);
          }
        }
      });
//       gsap.set("#image-container", { opacity: 0, visibility: "hidden" });
//         const path = document.querySelector(".capsule-path") as SVGPathElement;
//         if (!path) return; // تأكيد إن العنصر موجود
//         const length = path.getTotalLength();
//         // tl.set(path, { strokeDasharray: length, strokeDashoffset: length, opacity: 1 });
//         tl.fromTo(path,{
//  strokeDasharray: length, strokeDashoffset: length, opacity: 0 ,  visibility: "hidden" 
//         }, { opacity: 1, 
//           strokeDashoffset: 0,
//           duration: 2,
//            visibility: "visible" ,
//           ease: "power2.inOut",
//           onUpdate: () => {
//             const progress = tl.progress();
//             const container = document.querySelector("#image-container") as HTMLElement;
//             if (progress >= 0.5 && !triggered) {
//               triggered = true;
//               if (!container) return;
//               gsap.fromTo(container, { opacity: 0,visibility: 'hidden'}, { opacity: 1, visibility: "visible", duration: 0.5 });
//             }
//             if (progress >= 1) {
//               triggered = true;
//               if (!container) return;
//               this.startImageFlip(container);
//             }
//           }
//         });

/////////////////////////////////////////////////////////
      });
    });
  }
  startImageFlip(container: HTMLElement) {
    const slots = Array.from(container.querySelectorAll(".slot")) as HTMLElement[];

    // ✅ الصور المتاحة
    const allSources = [
      "/images/connect.png",
      "/images/dashboard.png",
      "/images/filter.png",
      "/images/subscriber.png",
      "/images/revenue.png",
      "/images/subscribers.png",
      "/images/active-services.png",
      "/images/merchant-onboarding.png",
      "/images/more_horiz.png",
      "/images/reports-analytics.png",
    ];

    // 🧩 تقسيم الصور على الخانات
    const slotImages: Map<HTMLElement, string[]> = new Map();

    slots.forEach((slot, i) => {
      const img = slot.querySelector("img")!;
      img.src = allSources[i]; // الصورة الأساسية

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
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
          img.src = newSrc;
          gsap.set(img, { y: 80, opacity: 0 });
          gsap.to(img, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" });
        },
      });
    }

    function randomLoop() {
      const available = slots.filter(slot => (slotImages.get(slot)?.length ?? 0) > 0);
      if (!available.length) {
        console.log("✅ كل الخانات خلصت الصور");
        return;
      }

      const randomCount = gsap.utils.random(1, Math.min(3, available.length), 1);
      const randomSlots = gsap.utils.shuffle(available).slice(0, randomCount);

      randomSlots.forEach(slot => flipSlot(slot));

      const nextDelay = gsap.utils.random(1, 2.5, 0.2) * 1000;
      setTimeout(randomLoop, nextDelay);
    }

    randomLoop();
  }
}
