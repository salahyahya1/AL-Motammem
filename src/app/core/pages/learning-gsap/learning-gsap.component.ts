import { isPlatformBrowser } from '@angular/common';
import { ApplicationRef, Component, Inject, NgZone, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(ScrollTrigger, SplitText);

@Component({
  selector: 'app-learning-gsap',
  imports: [],
  templateUrl: './learning-gsap.component.html',
  styleUrl: './learning-gsap.component.scss'
})
export class LearningGSAPComponent {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appRef: ApplicationRef,
    private ngZone: NgZone

  ) { }
  //   ngAfterViewInit() {
  //     if (typeof window === 'undefined') return;

  //     if (!isPlatformBrowser(this.platformId)) return;
  //     requestAnimationFrame(() => {
  // ///firt animation cards appear one by one
  // // const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  // // // الكروت بتظهر واحد واحد
  // // tl.to(".card", {
  // //   opacity: 1,
  // //   x: 0,
  // //   duration: 0.8,
  // //   stagger: 0.25, // الفرق الزمني بين كل كارت
  // // });
  // //////////////////////////////////////////////////////////////////////////////
  // //second animation text apper and the celnder drawed
/////   ngAfterViewInit() {
/////     if (typeof window === 'undefined') return;
/////     if (!isPlatformBrowser(this.platformId)) return;
///
/////     this.ngZone.runOutsideAngular(() => {
/////       requestAnimationFrame(() => {
/////         const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
/////         let triggered = false;
///
/////         tl.to("#Text1", { opacity: 1, y: 0, duration: 0.8 });
/////   triggered = false; 
///      
/////         const path = document.querySelector(".capsule-path") as SVGPathElement;
/////         if (!path) return; // تأكيد إن العنصر موجود
/////         const length = path.getTotalLength();
///
/////         tl.set(path, { strokeDasharray: length, strokeDashoffset: length,opacity:1 });
///
/////         tl.to(path, {
/////           strokeDashoffset: 0,
/////           duration: 2,
/////           ease: "power2.inOut",
/////  onUpdate:  ()=> {
///// const progress = tl.progress();
/////                     const container = document.querySelector("#image-container") as HTMLElement;
/////       if (progress >= 0.5 && !triggered) {
/////         triggered = true;
/////             if (!container) return;
/////             gsap.to(container, { opacity: 1, duration: 0.5 });
/////       }
/////       if (progress >= 1) {
/////         triggered = true;
/////             if (!container) return;
/////                         this.startImageFlip(container);
/////       }
///// }
/////         });
/////       });
/////     });
/////   }
/////   startImageFlip(container: HTMLElement) {
//     const slots = Array.from(container.querySelectorAll(".slot")) as HTMLElement[];

//     // ✅ الصور المتاحة
//     const allSources = [
//       "/images/connect.png",
//       "/images/dashboard.png",
//       "/images/filter.png",
//       "/images/subscriber.png",
//       "/images/revenue.png",
//       "/images/subscribers.png",
//       "/images/active-services.png",
//       "/images/merchant-onboarding.png",
//       "/images/more_horiz.png",
//       "/images/reports-analytics.png",
//     ];

//     // 🧩 تقسيم الصور على الخانات
//     const slotImages: Map<HTMLElement, string[]> = new Map();

//     slots.forEach((slot, i) => {
//       const img = slot.querySelector("img")!;
//       img.src = allSources[i]; // الصورة الأساسية

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
/////   }
 ngAfterViewInit() {
        if (typeof window === 'undefined') return;

      if (!isPlatformBrowser(this.platformId)) return;
      requestAnimationFrame(() => {
  ///firt animation cards appear one by one
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } ,
     scrollTrigger:{
trigger: '#section2',
start:"top top",
end:"bottom bottom",
markers:true
          },
   });
       document.fonts.ready.then(() => {
      const sectionHead = document.querySelector('#Text1') as HTMLElement;
      const card1 = document.querySelector('.card1') as HTMLElement;
      const card2 = document.querySelector('.card2') as HTMLElement;
      const card3 = document.querySelector('.card3') as HTMLElement;
      if (!sectionHead) {
        console.warn('⚠️ عناصر الـ hero مش لاقيها SplitText');
        return;
      }
      const splitedtext = SplitText.create(sectionHead, { type: "words" });
      // const tl = gsap.timeline();

      tl.fromTo(splitedtext.words,
        { opacity: 0, visibility: "visible" },
        {
          opacity: 1,
          duration: 0.8,
          ease: "sine.out",
          stagger: 0.2,

          onStart: () => { gsap.set(sectionHead, { opacity: 1, visibility: "visible" }) },
        }
      );
      tl.to(".card2",{
        opacity:1,
        duration: 1.5,
        ease: "sine.out",
      },'>-1')
      tl.to(".card1",{
        opacity:1,
        right:0,
        duration: 1.5,
        ease: "sine.out",
      },'<')
      tl.to(".card3",{
        opacity:1,
        left:0,
        duration: 1.5,
        ease: "sine.out",
      },'<')
  });
 });
}}



