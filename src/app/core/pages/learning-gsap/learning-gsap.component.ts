import { isPlatformBrowser } from '@angular/common';
import { ApplicationRef, Component, Inject, NgZone, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
  // const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  // let triggered = false;
  // // الكروت بتظهر واحد واحد
  // tl.to("#Text1", {
  //   opacity: 1,
  //   y: 0,
  //   duration: 0.8,
  // });
  // const path = document.querySelector(".capsule-path") as SVGPathElement;
  // const length = path.getTotalLength();

  // // البداية: الخط غير مرسوم
  // tl.set(path, {
  //   strokeDasharray: length,
  //   strokeDashoffset: length,
  // });

  // // أنيميشن الرسم التدريجي
  // tl.to(path, {
  //   strokeDashoffset: 0,
  //   duration: 2,
  //   ease: "power2.inOut",
  //   onUpdate:function (this: gsap.core.Tween) {
  //     const progress = this.progress();
  //         if (progress >= 0.5 && !triggered) {
  //       triggered = true; 

  //     }
  //   },
  //   onComplete:()=>{
  //     gsap.to(container,{
  //       opacity:1
  //     })
  // randomLoop();
  //   }
  // });
  // // const images = document.querySelectorAll(".img-item");
  // // const container = document.querySelector("#image-container");

  // // function flipImages() {
  // //   const first = images[0]; // أول صورة
  // //   // حركة الصورة الأولى تطلع لفوق وتختفي
  // //   gsap.to(first, {
  // //     y: -80,
  // //     opacity: 0,
  // //     duration: 0.5,
  // //     ease: "power2.in",
  // //     onComplete: () => {
  // //       // بعد ما تختفي، رجعها تحت القايمة
  // //       gsap.set(first, { y: 80, opacity: 0 });
  // // if (container) {
  // //   container.appendChild(first);
  // // }
  // //       // خليها تطلع مكانها الطبيعي وتظهر
  // //       gsap.to(first, {
  // //         y: 0,
  // //         opacity: 1,
  // //         duration: 0.5,
  // //         ease: "power2.out",
  // //       });
  // //     },
  // //   });
  // // }
  // // setInterval(flipImages, 2000);
  // /////////////////////////////////////////////////////////////////////////
  // // const container = document.querySelector("#image-container") as HTMLElement;
  // // const allImgs = Array.from(container.querySelectorAll(".img-item")) as HTMLElement[];

  // // // أول 5 ظاهرين والباقي مخفي
  // // const visibleCount = 5;
  // // let visibleImgs = allImgs.slice(0, visibleCount);
  // // let hiddenImgs  = allImgs.slice(visibleCount);

  // // // خفي الصور غير الظاهرة
  // // hiddenImgs.forEach(img => gsap.set(img, { opacity: 0, y: 80 }));

  // // // دالة لاختيار عنصر عشوائي
  // // function getRandomItem<T>(arr: T[]): T {
  // //   return arr[Math.floor(Math.random() * arr.length)];
  // // }

  // // // دالة القلب العشوائي
  // // function flipRandom() {
  // //   if (visibleImgs.length === 0 || hiddenImgs.length === 0) return;

  // //   const outImg = getRandomItem(visibleImgs);
  // //   const inImg  = getRandomItem(hiddenImgs);

  // //   // حركة خروج الصورة القديمة
  // //   gsap.to(outImg, {
  // //     y: -80,
  // //     opacity: 0,
  // //     duration: 0.5,
  // //     ease: "power2.in",
  // //     onComplete: () => {
  // //       // رجّع الصورة القديمة تحت
  // //       gsap.set(outImg, { y: 80, opacity: 0 });
  // //       container.appendChild(outImg);

  // //       // حركة دخول الصورة الجديدة
  // //       gsap.to(inImg, {
  // //         y: 0,
  // //         opacity: 1,
  // //         duration: 0.5,
  // //         ease: "power2.out",
  // //       });

  // //       // التبديل في المصفوفات
  // //       visibleImgs = visibleImgs.filter(img => img !== outImg);
  // //       hiddenImgs = hiddenImgs.filter(img => img !== inImg);
  // //       visibleImgs.push(inImg);
  // //       hiddenImgs.push(outImg);
  // //     },
  // //   });
  // // }

  // // // كرر العملية كل فترة عشوائية بين 1 و3 ثواني
  // // function randomLoop() {
  // //   flipRandom();
  // //   const nextDelay = gsap.utils.random(1, 3, 0.2) * 1000;
  // //   setTimeout(randomLoop, nextDelay);
  // // }
  // const container = document.querySelector("#image-container") as HTMLElement;
  // const slots = Array.from(container.querySelectorAll(".slot")) as HTMLElement[];

  // // كل الصور المتاحة
  // const imageSources = [
  //   "/images/connect.png",
  //   "/images/dashboard.png",
  //   "/images/filter.png",
  //   "/images/subscriber.png",
  //   "/images/revenue.png",
  //   "/images/subscribers.png",
  //   "/images/active-services.png",
  //   "/images/merchant-onboarding.png",
  //   "/images/more_horiz.png",
  //   "/images/reports-analytics.png",
  // ];

  // // أول 5 ظاهرين - الباقي احتياطي
  // let visibleSrcs = imageSources.slice(0, slots.length);
  // let hiddenSrcs = imageSources.slice(slots.length);

  // slots.forEach((slot, i) => {
  //   const img = slot.querySelector("img")!;
  //   img.src = visibleSrcs[i];
  // });

  // // دالة اختيار عنصر عشوائي
  // function getRandom<T>(arr: T[]): T {
  //   return arr[Math.floor(Math.random() * arr.length)];
  // }

  // // دالة قلب صورة في مكان ثابت
  // function flipRandomSlot() {
  //   const slot = getRandom(slots);
  //   const img = slot.querySelector("img")!;

  //   const newSrc = getRandom(hiddenSrcs);
  //   const oldSrc = img.src;

  //   // لو نفس الصورة، اختار تانية
  //   if (oldSrc.endsWith(newSrc)) return;

  //   // حركة خروج الصورة القديمة
  //   gsap.to(img, {
  //     y: -80,
  //     opacity: 0,
  //     duration: 0.4,
  //     ease: "power2.in",
  //     onComplete: () => {
  //       img.src = newSrc; // غيّر الصورة في نفس المكان
  //       gsap.set(img, { y: 80, opacity: 0 }); // ارجعه تحت قبل الدخول
  //       gsap.to(img, {
  //         y: 0,
  //         opacity: 1,
  //         duration: 0.5,
  //         ease: "power2.out",
  //       });

  //       // تحديث القوائم
  //       hiddenSrcs = hiddenSrcs.filter(s => s !== newSrc);
  //       hiddenSrcs.push(oldSrc.split("/").pop()!); // رجّع القديمة للاحتياطي
  //     },
  //   });
  // }

  // // تشغيل اللوب العشوائي
  // function randomLoop() {
  //   flipRandomSlot();
  //   const nextDelay = gsap.utils.random(1, 3, 0.2) * 1000;
  //   setTimeout(randomLoop, nextDelay);
  // }


  // // تشغيل اللوب


  // // أنيميشن نبض خفيف بعد الرسم
  // // gsap.to(path, {
  // //   repeat: -1,
  // //   yoyo: true,
  // //   scale: 1.05,
  // //   transformOrigin: "center center",
  // //   duration: 1.2,
  // //   ease: "sine.inOut",
  // //   delay: 2,
  // // });
  // });}
  ngAfterViewInit() {
    if (typeof window === 'undefined') return;
    if (!isPlatformBrowser(this.platformId)) return;

    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        let triggered = false;

        tl.to("#Text1", { opacity: 1, y: 0, duration: 0.8 });

        const path = document.querySelector(".capsule-path") as SVGPathElement;
        if (!path) return; // تأكيد إن العنصر موجود
        const length = path.getTotalLength();

        tl.set(path, { strokeDasharray: length, strokeDashoffset: length });

        tl.to(path, {
          strokeDashoffset: 0,
          duration: 2,
          ease: "power2.inOut",
          onComplete: () => {
            // ⬅️ نبدأ أنيميشن الصور بعد ما الكبسولة ترسم بالكامل
            const container = document.querySelector("#image-container") as HTMLElement;
            if (!container) return;
            gsap.to(container, { opacity: 1, duration: 0.5 });

            this.startImageFlip(container);
          },
        });
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



