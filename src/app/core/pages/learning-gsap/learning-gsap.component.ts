import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ApplicationRef, ChangeDetectorRef, Component, Inject, NgZone, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

import { SplitText } from "gsap/SplitText";
import { VedioPlayerSsrComponent } from "../../shared/vedio-player-ssr/vedio-player-ssr.component";
gsap.registerPlugin(ScrollTrigger, SplitText);
declare var YT: any;

@Component({
  selector: 'app-learning-gsap',
  imports: [CommonModule, VedioPlayerSsrComponent],
  templateUrl: './learning-gsap.component.html',
  styleUrl: './learning-gsap.component.scss'
})
export class LearningGSAPComponent {
  isBrowser = false;


  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appRef: ApplicationRef,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,

  ) {
  }
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
  // ngAfterViewInit() {
  //   if (typeof window === 'undefined') return;

  //   if (!isPlatformBrowser(this.platformId)) return;
  //   requestAnimationFrame(() => {
  //     ///firt animation cards appear one by one
  //     const tl = gsap.timeline({
  //       defaults: { ease: "power3.out" },
  //       scrollTrigger: {
  //         trigger: '#section2',
  //         start: "top 10%",
  //         end: "bottom 101%",
  //         markers: true
  //       },
  //     });
  //     document.fonts.ready.then(() => {
  //       const sectionHead = document.querySelector('#Text1') as HTMLElement;
  //       const card1 = document.querySelector('.card1') as HTMLElement;
  //       const card2 = document.querySelector('.card2') as HTMLElement;
  //       const card3 = document.querySelector('.card3') as HTMLElement;
  //       if (!sectionHead) {
  //         console.warn('⚠️ عناصر الـ hero مش لاقيها 3333SplitText');
  //         return;
  //       }
  //       const splitedtext = SplitText.create(sectionHead, { type: "words" });
  //       // const tl = gsap.timeline();

  //       tl.fromTo(splitedtext.words,
  //         { opacity: 0, visibility: "visible" },
  //         {
  //           opacity: 1,
  //           duration: 0.8,
  //           ease: "sine.out",
  //           stagger: 0.2,

  //           onStart: () => { gsap.set(sectionHead, { opacity: 1, visibility: "visible" }) },
  //         }
  //       );
  //       tl.to(".card2", {
  //         opacity: 1,
  //         duration: 1.5,
  //         ease: "sine.out",
  //       }, '>-1')
  //       tl.to(".card1", {
  //         opacity: 1,
  //         right: 0,
  //         duration: 1.5,
  //         ease: "sine.out",
  //       }, '<')
  //       tl.to(".card3", {
  //         opacity: 1,
  //         left: 0,
  //         duration: 1.5,
  //         ease: "sine.out",
  //       }, '<')
  //     });
  //   });
  // }
  //  ngAfterViewInit() {
  //         if (typeof window === 'undefined') return;

  //       if (!isPlatformBrowser(this.platformId)) return;
  //       requestAnimationFrame(() => {
  //   ///firt animation cards appear one by one
  //   const tl = gsap.timeline({ defaults: { ease: "power3.out" } ,
  //      scrollTrigger:{
  //      trigger: '#section3',
  //      start:"top 5%",
  //      end:"bottom 101%",
  //      markers:true
  //           },
  //    });
  //        document.fonts.ready.then(() => {
  //       const sectionHead = document.querySelector('#Text1') as HTMLElement;
  //       if (!sectionHead) {
  //         console.warn('⚠️ عناصر الـ hero مش لاقيها 3333SplitText');
  //         return;
  //       }
  //       const splitedtext = SplitText.create(sectionHead, { type: "words" });
  //       // const tl = gsap.timeline();

  //       tl.fromTo(splitedtext.words,
  //         { opacity: 0, visibility: "visible" },
  //         {
  //           opacity: 1,
  //           duration: 0.8,
  //           ease: "sine.out",
  //           stagger: 0.2,

  //           onStart: () => { gsap.set(sectionHead, { opacity: 1, visibility: "visible" }) },
  //         }
  //       );
  //  const section = document.querySelector('#stats-section') as HTMLElement;
  //         if (!section) return;

  //         // دالة تعيين حالة البداية (تصفير وإخفاء)
  //         const setInitial = () => {
  //           gsap.set('.hero-title',  { opacity: 0, y: 30 });
  //           gsap.set('.stat-card',   { opacity: 0, y: 30, scale: 0.98 });
  //           gsap.set('.label',       { opacity: 0, y: 10 });
  //           gsap.set('.cta-btn',     { opacity: 0, y: 30, pointerEvents: 'none' });

  //           // صفّر النصوص الرقمية
  //           const counters = Array.from(section.querySelectorAll('.counter')) as HTMLElement[];
  //           counters.forEach(c => c.textContent = '0');
  //         };

  //         // دالة عدّاد رقم
  //         const animateCounter = (el: HTMLElement, to: number, duration = 1.6, decimals = 0) => {
  //           const obj = { val: 0 };
  //           return gsap.to(obj, {
  //             val: to,
  //             duration,
  //             ease: 'power3.out',
  //             onUpdate: () => {
  //               el.textContent = obj.val.toFixed(decimals);
  //             }
  //           });
  //         };

  //         // نبني التايملاين (نستدعيها كل دخول)
  //         const buildTimeline = () => {
  //           const tl = gsap.timeline({ defaults: { ease: 'power3.out' }});

  //           // 1) العنوان
  //           tl.to('.hero-title', { opacity: 1, y: 0, duration: 0.7 });

  //           // 2) الكروت تدخل بستاجر
  //           tl.to('.stat-card', { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.15 }, '>-0.1');

  //           // 3) العدّادات (بعد ما الكروت تظهر)
  //           tl.add(() => {
  //             const cards = Array.from(section.querySelectorAll('.stat-card')) as HTMLElement[];
  //             cards.forEach((card, i) => {
  //               const counter = card.querySelector('.counter') as HTMLElement;
  //               const target = Number(counter?.getAttribute('data-target') ?? 0);

  //               // ظبط مدة العدّاد لكل واحدة حسب الفيديو (عدّل الأرقام لو عايز):
  //               const dur = i === 0 ? 1.8 : i === 1 ? 1.2 : 1.4;
  //               const decimals = target % 1 !== 0 ? 1 : 0;

  //               animateCounter(counter, target, dur, decimals);
  //             });
  //           }, '>-0.2');

  //           // 4) الليبلز تظهر تحت كل كارت
  //           tl.to('.label', { opacity: 1, y: 0, duration: 0.5, stagger: 0.12 }, '>-0.2');

  //           // 5) الزرار
  //           tl.to('.cta-btn', { opacity: 1, y: 0, duration: 0.6, onStart: () => {
  //             const btn = section.querySelector('.cta-btn') as HTMLElement;
  //             btn && (btn.style.pointerEvents = 'auto');
  //           }}, '>-0.1');

  //           return tl;
  //         };

  //         // ScrollTrigger: إعادة تشغيل كامل عند كل دخول، وتصفيـر عند الخروج
  //         let tl2: gsap.core.Timeline | null = null;

  //         ScrollTrigger.create({
  //           trigger: section,
  //           start: 'top 70%',
  //           end: 'bottom 30%',
  //           // onEnter & onEnterBack: ابدأ من الأول
  //           onEnter: () => { setInitial(); tl2?.kill(); tl2 = buildTimeline(); },
  //           onEnterBack: () => { setInitial(); tl2?.kill(); tl2 = buildTimeline(); },
  //           // onLeave & onLeaveBack: صفّر وامسح التايملاين
  //           onLeave: () => { tl2?.kill(); tl2 = null; setInitial(); },
  //           onLeaveBack: () => { tl2?.kill(); tl2 = null; setInitial(); },
  //           // لو تحب تراقب البوينتس أثناء الضبط، فعّلها مؤقتًا:
  //           // markers: true,
  //         });

  //         // أول مرة لو السكشن في الفيو من البداية:
  //         setInitial();
  //       });



  //   });
  // }
  // ngAfterViewInit() {
  //   if (!isPlatformBrowser(this.platformId)) return;

  //   this.ngZone.runOutsideAngular(() => {
  //     requestAnimationFrame(() => {
  //       document.fonts.ready.then(() => {
  //         // عناصر النص والستاتس
  //         const section3 = document.querySelector('#section3') as HTMLElement;
  //         const sectionStats = document.querySelector('#stats-section') as HTMLElement;
  //         const sectionHead = document.querySelector('#Text1') as HTMLElement;
  //         const sectionlabels = document.querySelector('.label') as HTMLElement;
  //         const sectionnumber = document.querySelector('.num') as HTMLElement;

  //         if (!section3 || !sectionHead || !sectionStats) {
  //           console.warn('⚠️ عناصر مطلوبة للأنيميشن غير موجودة (#section3 / #Text1 / #stats-section).');
  //           return;
  //         }

  //         // SplitText: خليه آخر حاجة تتنفذ عشان النص موجود فعليًا للـ SEO
  //         const split = SplitText.create(sectionHead, { type: 'words' });
  //         const splitlabel = SplitText.create(sectionlabels, { type: 'words',aria: "hidden"});
  //         const splitNumber = SplitText.create(sectionnumber, { type: 'chars',aria: "hidden"});

  //         // حالات البداية (للاستقرار البصري)
  //         gsap.set(split.words, { opacity: 0, y: 20, willChange: 'opacity, transform' });
  //         gsap.set(splitlabel.words, { opacity: 0, willChange: 'opacity' });
  //         gsap.set(splitNumber.words, { opacity: 0, willChange: 'opacity' });
  //         // gsap.set('.label',      { opacity: 0 });
  //         gsap.set('.cta-btn',    { opacity: 0, y: 30, pointerEvents: 'none' });
  //         // تصفير العدادات نصيًا
  //         Array.from(sectionStats.querySelectorAll('.counter') as NodeListOf<HTMLElement>)
  //           .forEach(c => c.textContent = '0');

  //         // دالة عدّاد رقمي
  //         const animateCounter = (el: HTMLElement, to: number, duration = 1.6, decimals = 0,midAt = 0.5,  midFx = () => {}) => {
  //           const obj = { val: 0 };
  //             let fired = false;
  //             const tween =gsap.to(obj, {
  //             val: to,
  //             duration,
  //             ease: 'power3.out',
  //             onUpdate: () => {el.textContent = obj.val.toFixed(decimals)

  //                     const p = tween.progress(); // 0..1
  //       if (!fired && p >= midAt) {
  //         fired = true;
  // // gsap.to(,{})
  //   midFx(); 
  //       }
  //             },
  //           });
  //         };

  //         // تايملاين واحد موحّد + ScrollTrigger
  //         const tl = gsap.timeline({
  //           defaults: { ease: 'power3.out' },
  //           scrollTrigger: {
  //             trigger: '#section3',
  //             start: 'top 5%',
  //             end: 'bottom 101%',
  //             toggleActions: 'play none none none',
  //             once: true,            
  //             // markers: true,
  //           },
  //         });

  //         // 1) ظهور كلمات العنوان (SplitText)
  //         tl.fromTo(
  //           split.words,
  //           { opacity: 0, y: 20 },
  //           {
  //             opacity: 1,
  //             y: 0,
  //             duration: 0.8,
  //             stagger: 0.2,
  //             onStart: () => {gsap.set(sectionHead, { opacity: 1, visibility: 'visible' })},
  //           }
  //         );

  //         // 3) دخول كروت الإحصائيات بستاجر
  //         tl.to(
  //           '.stat-card1',
  //           { opacity: 1, duration: 0.6,  ease: 'back.out(1.6)',
  //            },
  //           '>-0.1'
  //         );

  //         // 4) تشغيل العدادات بعد ظهور الكروت مباشرة
  //         tl.add(() => {
  //           const cards = Array.from(sectionStats.querySelectorAll('.stat-card1')) as HTMLElement[];
  //           cards.forEach((card, i) => {
  //             const counter = card.querySelector('.counter') as HTMLElement;
  //             const target = Number(counter?.getAttribute('data-target') ?? 0);
  //             const dur = i === 0 ? 1.8 : i === 1 ? 1.2 : 1.4;
  //             const decimals = target % 1 !== 0 ? 1 : 0;
  //             animateCounter(counter, target, dur, decimals,0.5,() =>{
  //                       tl.fromTo(
  //           splitNumber.words,
  //           { opacity: 0 },
  //           {
  //             opacity: 1,
  //             duration: 1.5,
  //             stagger: 0.2,
  //             ease: "sine.out",
  //             onStart: () => {gsap.set(sectionHead, { opacity: 1, visibility: 'visible' })},
  //           }
  //         )
  //             });
  //           });
  //         }, '>-0.2');

  //         // 5) ظهور الليبلز تحت كل كارت
  //         // tl.to('.labe', { opacity: 1, y: 0, duration: 0.5 }, '>');
  //         tl.fromTo(
  //           splitlabel.words,
  //           { opacity: 0 },
  //           {
  //             opacity: 1,
  //             duration: 1.5,
  //             stagger: 0.2,
  //             ease: "sine.out",
  //             onStart: () => {gsap.set(sectionHead, { opacity: 1, visibility: 'visible' })},
  //           }
  //         );

  //         // 6) الزرار
  //         tl.to(
  //           '.cta-btn',
  //           {
  //             opacity: 1,
  //             y: 0,
  //             duration: 0.6,
  //             ease: 'back.out(1.6)',
  //             onStart: () => {
  //               const btn = sectionStats.querySelector('.cta-btn') as HTMLElement;
  //               if (btn) btn.style.pointerEvents = 'auto';
  //             },
  //           },
  //           '>-0.1'
  //         );
  //       });
  //     });
  //   });
  // }
  // ngAfterViewInit() {
  //   if (!isPlatformBrowser(this.platformId)) return;

  //   this.ngZone.runOutsideAngular(() => {
  //     requestAnimationFrame(() => {
  //       document.fonts.ready.then(() => {
  //         const section = document.querySelector('#stats-section') as HTMLElement;
  //         const triggerEl = document.querySelector('#section3') as HTMLElement || section;
  //         if (!section) {
  //           console.warn('⚠️ #stats-section غير موجود.');
  //           return;
  //         }

  //         const rows = Array.from(section.querySelectorAll('.stat-row')) as HTMLElement[];
  //         if (!rows.length) {
  //           console.warn('⚠️ لم يتم العثور على .stat-row داخل #stats-section.');
  //           return;
  //         }

  //         // تصفير العدادات مبدئيًا
  //         rows.forEach(row => {
  //           const c = row.querySelector('.counter') as HTMLElement | null;
  //           if (c) c.textContent = '0';
  //         });

  //         // 🧮 دالة العدّاد
  //         const animateCounter = (
  //           el: HTMLElement,
  //           to: number,
  //           duration = 1.6,
  //           decimals = 0
  //         ) => {
  //           const obj = { val: 0 };
  //           gsap.to(obj, {
  //             val: to,
  //             duration,
  //             ease: 'power3.out',
  //             onUpdate: () => {
  //               el.textContent = obj.val
  //                 .toFixed(decimals)
  //                 .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  //             }
  //           });
  //         };

  //         // SplitText + الإعداد الابتدائي (الليبل والرقم)
  //         rows.forEach(row => {
  //           const labelEl = row.querySelector('.label') as HTMLElement | null;
  //           const numEl = row.querySelector('.num') as HTMLElement | null;

  //           if (labelEl) {
  //             const sLabel = SplitText.create(labelEl, { type: 'words', aria: 'hidden' });
  //             gsap.set(sLabel.words, { opacity: 0, willChange: 'opacity' });
  //             (labelEl as any)._splitWords = sLabel.words;
  //           }

  //           if (numEl) {
  //             const sNum = SplitText.create(numEl, { type: 'chars', aria: 'hidden' });
  //             gsap.set(sNum.chars, { opacity: 0, willChange: 'opacity' });
  //             (numEl as any)._splitChars = sNum.chars;
  //           }
  //         });

  //         // التايملاين الرئيسي
  //         const tl = gsap.timeline({
  //           defaults: { ease: 'power3.out' },
  //           scrollTrigger: {
  //             trigger: triggerEl || section,
  //             start: 'top 10%',
  //             end: 'bottom 100%',
  //             toggleActions: 'play none none none',
  //             once: true,
  //             // markers: true,
  //           },
  //         });

  //         // 🔹 العنوان (اختياري)
  //         const head = document.querySelector('#Text1') as HTMLElement | null;
  //         if (head) {
  //           const splitHead = SplitText.create(head, { type: 'words' });
  //           gsap.set(splitHead.words, { opacity: 0 });
  //           tl.fromTo(
  //             splitHead.words,
  //             { opacity: 0 },
  //             { opacity: 1, duration: 0.7, stagger: 0.18 },
  //             0
  //           );
  //         }

  //         // 🔸 ظهور كل صف إحصائي (label + number في نفس الوقت) بـ Fade فقط
  //         rows.forEach((row, i) => {
  //           const labelEl = row.querySelector('.label') as HTMLElement | null;
  //           const numEl = row.querySelector('.num') as HTMLElement | null;
  //           const counter = row.querySelector('.counter') as HTMLElement | null;

  //           const labelWords = (labelEl && (labelEl as any)._splitWords) || null;
  //           const numChars = (numEl && (numEl as any)._splitChars) || null;

  //           const rowPos = i === 0 ? '>' : '>-0.2';

  //           // 1️⃣ label fade-in
  //           if (labelWords) {
  //             tl.fromTo(
  //               labelWords,
  //               { opacity: 0 },
  //               {
  //                 opacity: 1,
  //                 duration: 1.2,
  //                 stagger: { each: 0.08, from: 'start' },
  //                 ease: 'sine.out',
  //               },
  //               rowPos
  //             );
  //           }

  //           // 2️⃣ number fade-in + تشغيل العدّاد
  //           if (numChars) {
  //             tl.fromTo(
  //               numChars,
  //               { opacity: 0 },
  //               {
  //                 opacity: 1,
  //                 duration: 1.2,
  //                 stagger: { each: 0.06, from: 'end' },
  //                 ease: 'sine.out',
  //                 onStart: () => {
  //                   if (counter) {
  //                     const target = Number(counter.getAttribute('data-target') ?? 0);
  //                     const decimals = target % 1 !== 0 ? 1 : 0;
  //                     animateCounter(counter, target, 1.4, decimals);
  //                   }
  //                 },
  //               },
  //               rowPos
  //             );
  //           }
  //         });

  //         // CTA (اختياري)
  //         const cta = section.querySelector('.cta-btn') as HTMLElement | null;
  //         if (cta) {
  //           gsap.set(cta, { opacity: 0, pointerEvents: 'none' });
  //           tl.to(cta, {
  //             opacity: 1,
  //             duration: 0.8,
  //             ease: 'power2.out',
  //             onStart: () => {
  //               cta.style.pointerEvents = 'auto';
  //             },
  //           }, '>-0.1');
  //         }
  //       });
  //     });
  //   });
  // }
  ///
  // ngAfterViewInit() {
  //   if (!isPlatformBrowser(this.platformId)) return;

  //   this.ngZone.runOutsideAngular(() => {
  //     requestAnimationFrame(() => {
  //       document.fonts.ready.then(() => {
  //         const section = document.querySelector('#stats-section') as HTMLElement;
  //         const triggerEl = document.querySelector('#section3') as HTMLElement || section;

  //         if (!section) {
  //           console.warn('⚠️ #stats-section غير موجود.');
  //           return;
  //         }

  //         const rows = Array.from(section.querySelectorAll('.stat-row')) as HTMLElement[];
  //         if (!rows.length) {
  //           console.warn('⚠️ لم يتم العثور على .stat-row داخل #stats-section.');
  //           return;
  //         }

  //         // 🔹 تصفير العدادات مبدئيًا
  //         rows.forEach(row => {
  //           const counter = row.querySelector('.counter') as HTMLElement | null;
  //           if (counter) counter.textContent = '0';
  //         });

  //         // 🔢 دالة العدّاد
  //         const animateCounter = (
  //           el: HTMLElement,
  //           to: number,
  //           duration = 5,
  //           decimals = 0
  //         ) => {
  //           const obj = { val: 0 };
  //           gsap.to(obj, {
  //             val: to,
  //             duration,
  //             ease: 'power3.out',
  //             onUpdate: () => {
  //               el.textContent = obj.val
  //                 .toFixed(decimals)
  //                 .replace(/\B(?=(\d{3})+(?!\d))/g, ','); // فواصل الألوف
  //             },
  //           });
  //         };

  //         // SplitText لليبل فقط (الأرقام بدون split)
  //         rows.forEach(row => {
  //           const labelEl = row.querySelector('.label') as HTMLElement | null;
  //           if (labelEl) {
  //             const sLabel = SplitText.create(labelEl, { type: 'words', aria: 'hidden' });
  //             gsap.set(sLabel.words, { opacity: 0, willChange: 'opacity' });
  //             (labelEl as any)._splitWords = sLabel.words;
  //           }

  //           const numEl = row.querySelector('.num') as HTMLElement | null;
  //           if (numEl) gsap.set(numEl, { opacity: 0, willChange: 'opacity' });
  //         });

  //         // التايملاين الرئيسي
  //         const tl = gsap.timeline({
  //           defaults: { ease: 'power2.out' },
  //           scrollTrigger: {
  //             trigger: triggerEl || section,
  //             start: 'top 10%',
  //             end: 'bottom 100%',
  //             toggleActions: 'play none none none',
  //             once: true,
  //             // markers: true,
  //           },
  //         });

  //         // 🔹 العنوان الرئيسي (اختياري)
  //         const head = document.querySelector('#Text1') as HTMLElement | null;
  //         if (head) {
  //           const splitHead = SplitText.create(head, { type: 'words' });
  //           gsap.set(splitHead.words, { opacity: 0 });
  //           tl.fromTo(
  //             splitHead.words,
  //             { opacity: 0 },
  //             { opacity: 1, duration: 0.7, stagger: 0.15 },
  //             0
  //           );
  //         }

  //         // 🔸 كل صف (label + number في نفس الوقت) بـ fade فقط
  //         rows.forEach((row, i) => {
  //           const labelEl = row.querySelector('.label') as HTMLElement | null;
  //           const numEl = row.querySelector('.num') as HTMLElement | null;
  //           const counter = row.querySelector('.counter') as HTMLElement | null;
  //           const labelWords = (labelEl && (labelEl as any)._splitWords) || null;

  //           // كل صف بعد اللي قبله بـ 0.3 ثانية
  //           const rowPos = i === 0 ? '>' : `>+${0.3}`;

  //           const rowTL = gsap.timeline();

  //           // 1️⃣ label fade-in
  //           if (labelWords) {
  //             rowTL.fromTo(
  //               labelWords,
  //               { opacity: 0 },
  //               {
  //                 opacity: 1,
  //                 duration: 5,
  //                 stagger: { each: 0.08, from: 'start' },
  //                 ease: 'sine.out',
  //               },
  //               0
  //             );
  //           }

  //           // 2️⃣ number fade-in + تشغيل العدّاد
  //           if (numEl && counter) {
  //             rowTL.fromTo(
  //               numEl,
  //               { opacity: 0 },
  //               {
  //                 opacity: 1,
  //                 duration: 5,
  //                 ease: 'sine.out',
  //                 onStart: () => {
  //                   const target = Number(counter.getAttribute('data-target') ?? 0);
  //                   const decimals = target % 1 !== 0 ? 1 : 0;
  //                   animateCounter(counter, target, 1.4, decimals);
  //                 },
  //               },
  //               0 // ✅ نفس اللحظة مع الليبل
  //             );
  //           }

  //           tl.add(rowTL, rowPos);
  //         });

  //         // CTA (اختياري)
  //         const cta = section.querySelector('.cta-btn') as HTMLElement | null;
  //         if (cta) {
  //           gsap.set(cta, { opacity: 0, pointerEvents: 'none' });
  //           tl.to(
  //             cta,
  //             {
  //               opacity: 1,
  //               duration: 0.8,
  //               ease: 'power2.out',
  //               onStart: () => {
  //                 cta.style.pointerEvents = 'auto';
  //               },
  //             },
  //             '>-0.1'
  //           );
  //         }
  //       });
  //     });
  //   });
  // }
  ////
  // ngAfterViewInit() {
  //   if (!isPlatformBrowser(this.platformId)) return;

  //   this.ngZone.runOutsideAngular(() => {
  //     requestAnimationFrame(() => {
  //       document.fonts.ready.then(() => {
  //         const section = document.querySelector('#stats-section') as HTMLElement;
  //         const triggerEl = (document.querySelector('#section3') as HTMLElement) || section;
  //         if (!section) return;

  //         const rows = Array.from(section.querySelectorAll('.stat-row')) as HTMLElement[];
  //         if (!rows.length) return;

  //         // تصفير العدادات
  //         rows.forEach(row => {
  //           const c = row.querySelector('.counter') as HTMLElement | null;
  //           if (c) c.textContent = '0';
  //         });

  //         // دالة العدّاد
  //         const animateCounter = (el: HTMLElement, to: number, duration = 1.4, decimals = 0) => {
  //           const obj = { val: 0 };
  //           gsap.to(obj, {
  //             val: to,
  //             duration,
  //             ease: 'power3.out',
  //             onUpdate: () => {
  //               el.textContent = obj.val
  //                 .toFixed(decimals)
  //                 .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  //             },
  //           });
  //         };

  //         // SplitText على الليبل والرقم
  //         rows.forEach(row => {
  //           const labelEl = row.querySelector('.label') as HTMLElement | null;
  //           const numEl = row.querySelector('.num') as HTMLElement | null;

  //           if (labelEl) {
  //             const sLabel = SplitText.create(labelEl, { type: 'chars', aria: 'hidden' });
  //             gsap.set(sLabel.chars, { opacity: 0 });
  //             (labelEl as any)._splitChars = sLabel.chars;
  //           }

  //           if (numEl) {
  //             const sNum = SplitText.create(numEl, { type: 'chars', aria: 'hidden' });
  //             gsap.set(sNum.chars, { opacity: 0 });
  //             (numEl as any)._splitChars = sNum.chars;
  //           }
  //         });

  //         // التايملاين الرئيسي
  //         const tl = gsap.timeline({
  //           defaults: { ease: 'power3.out' },
  //           scrollTrigger: {
  //             trigger: triggerEl || section,
  //             start: 'top 20%',
  //             end: 'bottom 100%',
  //             toggleActions: 'play none none none',
  //             once: true,
  //             // markers: true,
  //           },
  //         });

  //         // العنوان (اختياري)
  //         const head = document.querySelector('#Text1') as HTMLElement | null;
  //         if (head) {
  //           const splitHead = SplitText.create(head, { type: 'words' });
  //           gsap.set(splitHead.words, { opacity: 0, y: 10 });
  //           tl.fromTo(
  //             splitHead.words,
  //             { opacity: 0, y: 10 },
  //             { opacity: 1, y: 0, duration: 0.7, stagger: 0.15 },
  //             0
  //           );
  //         }

  //         // صفوف العدادات
  //         rows.forEach((row, i) => {
  //           const labelEl = row.querySelector('.label') as HTMLElement | null;
  //           const numEl = row.querySelector('.num') as HTMLElement | null;
  //           const counterEl = row.querySelector('.counter') as HTMLElement | null;
  //           const labelChars = (labelEl && (labelEl as any)._splitChars) || null;
  //           const numChars = (numEl && (numEl as any)._splitChars) || null;

  //           const rowPos = i === 0 ? '>' : `>+0.35`;
  //           const rowTL = gsap.timeline();

  //           // 1️⃣ الليبل (fade من اليمين → الشمال)
  //           if (labelChars) {
  //             rowTL.to(
  //               labelChars,
  //               {
  //                 opacity: 1,
  //                 duration: 1.2,
  //                 ease: 'sine.out',
  //                 stagger: { each: 0.04, from: 'end' }, // ← من اليمين
  //               },
  //               0
  //             );
  //           }

  //           // 2️⃣ الرقم (fade من الشمال → اليمين)
  //           if (numChars && counterEl) {
  //             rowTL.to(
  //               numChars,
  //               {
  //                 opacity: 1,
  //                 duration: 1.2,
  //                 ease: 'sine.out',
  //                 stagger: { each: 0.04, from: 'start' }, // ← من الشمال
  //                 onStart: () => {
  //                   const target = Number(counterEl.getAttribute('data-target') ?? 0);
  //                   const decimals = target % 1 !== 0 ? 1 : 0;
  //                   animateCounter(counterEl, target, 1.4, decimals);
  //                 },
  //               },
  //               0
  //             );
  //           }

  //           tl.add(rowTL, rowPos);
  //         });

  //         // CTA زرار
  //         const cta = section.querySelector('.cta-btn') as HTMLElement | null;
  //         if (cta) {
  //           gsap.set(cta, { opacity: 0 });
  //           tl.to(cta, { opacity: 1, duration: 0.8, ease: 'power2.out' }, '>-0.2');
  //         }
  //       });
  //     });
  //   });
  // }

  // ngAfterViewInit() {
  //   if (!isPlatformBrowser(this.platformId)) return;

  //   this.ngZone.runOutsideAngular(() => {
  //     requestAnimationFrame(() => {
  //       document.fonts.ready.then(() => {
  //         const section = document.querySelector('#stats-section') as HTMLElement;
  //         const triggerEl = (document.querySelector('#section3') as HTMLElement) || section;
  //         if (!section) return;

  //         const rows = Array.from(section.querySelectorAll('.stat-row')) as HTMLElement[];
  //         if (!rows.length) return;

  //         // 🔹 تصفير العدادات أولًا
  //         rows.forEach(row => {
  //           const c = row.querySelector('.counter') as HTMLElement | null;
  //           if (c) c.textContent = '0';
  //         });

  //         // 🔹 دالة العدّاد
  //         const animateCounter = (el: HTMLElement, to: number, duration = 1.4, decimals = 0) => {
  //           const obj = { val: 0 };
  //           gsap.to(obj, {
  //             val: to,
  //             duration,
  //             ease: 'power3.out',
  //             onUpdate: () => {
  //               // يعرض الرقم بشكل طبيعي بدون صفر إضافي في البداية
  //               el.textContent = obj.val.toFixed(decimals);
  //             },
  //           });
  //         };

  //         // 🔹 SplitText على الـ label فقط (كلمات مش حروف)
  //         rows.forEach(row => {
  //           const labelEl = row.querySelector('.label') as HTMLElement | null;
  //           if (labelEl) {
  //             const sLabel = SplitText.create(labelEl, { type: 'words', aria: 'hidden' });
  //             gsap.set(sLabel.words, { opacity: 0 });
  //             (labelEl as any)._splitWords = sLabel.words;
  //           }
  //         });

  //         // 🔹 التايملاين الرئيسي
  //         const tl = gsap.timeline({
  //           defaults: { ease: 'power3.out' },
  //           scrollTrigger: {
  //             trigger: triggerEl || section,
  //             start: 'top 20%',
  //             end: 'bottom 100%',
  //             toggleActions: 'play none none none',
  //             once: true,
  //             // markers: true,
  //           },
  //         });

  //         // ✳️ العنوان الرئيسي (اختياري)
  //         const head = document.querySelector('#Text1') as HTMLElement | null;
  //         if (head) {
  //           const splitHead = SplitText.create(head, { type: 'words' });
  //           gsap.set(splitHead.words, { opacity: 0, y: 10 });
  //           tl.fromTo(
  //             splitHead.words,
  //             { opacity: 0, y: 10 },
  //             { opacity: 1, y: 0, duration: 0.7, stagger: 0.15 },
  //             0
  //           );
  //         }

  //         // ✳️ أنيميشن الصفوف
  //         rows.forEach((row, i) => {
  //           const labelEl = row.querySelector('.label') as HTMLElement | null;
  //           const numEl = row.querySelector('.num') as HTMLElement | null;
  //           const counterEl = row.querySelector('.counter') as HTMLElement | null;
  //           const labelWords = (labelEl && (labelEl as any)._splitWords) || null;

  //           const rowPos = i === 0 ? '>' : `>+0.35`;
  //           const rowTL = gsap.timeline();

  //           // 1️⃣ الليبل - كلمات - fade من اليمين → الشمال
  //           if (labelWords) {
  //             rowTL.to(
  //               labelWords,
  //               {
  //                 opacity: 1,
  //                 duration: 1.5,
  //                 ease: 'sine.out',
  //                 stagger: { each: 0.08, from: 'start' }, // من اليمين
  //               },
  //               0
  //             );
  //           }

  //           // 2️⃣ الرقم - fade كامل + عداد شغال بنفس الوقت
  //           if (numEl && counterEl) {
  //             gsap.set(numEl, { opacity: 0 });
  //             rowTL.to(
  //               numEl,
  //               {
  //                 opacity: 1,
  //                 duration: 1.5,
  //                 ease: 'sine.out',
  //                 stagger: { each: 0.08, from: 'end' },
  //                 onStart: () => {
  //                   const target = Number(counterEl.getAttribute('data-target') ?? 0);
  //                   const decimals = target % 1 !== 0 ? 1 : 0;
  //                   animateCounter(counterEl, target, 1.4, decimals);
  //                 },
  //               },
  //               0 // في نفس الوقت مع الليبل
  //             );
  //           }

  //           tl.add(rowTL, rowPos);
  //         });

  //         // ✳️ الزرار في الآخر
  //         const cta = section.querySelector('.cta-btn') as HTMLElement | null;
  //         if (cta) {
  //           gsap.set(cta, { opacity: 0 });
  //           tl.to(cta, { opacity: 1, duration: 0.8, ease: 'power2.out' }, '>-0.2');
  //         }
  //       });
  //     });
  //   });
  // }

  //last verion 1
  // ngAfterViewInit() {
  //   if (!isPlatformBrowser(this.platformId)) return;

  //   this.ngZone.runOutsideAngular(() => {
  //     requestAnimationFrame(() => {
  //       document.fonts.ready.then(() => {
  //         const section = document.querySelector('#stats-section') as HTMLElement;
  //         const triggerEl = (document.querySelector('#section3') as HTMLElement) || section;
  //         if (!section) return;

  //         const rows = Array.from(section.querySelectorAll('.stat-row')) as HTMLElement[];
  //         if (!rows.length) return;

  //         // 🔹 تصفير العدادات
  //         rows.forEach(row => {
  //           const c = row.querySelector('.counter') as HTMLElement | null;
  //           if (c) c.textContent = '0';
  //         });

  //         // 🔹 دالة العدّاد
  //         const animateCounter = (el: HTMLElement, to: number, duration = 1.4, decimals = 0) => {
  //           const obj = { val: 0 };
  //           gsap.to(obj, {
  //             val: to,
  //             duration,
  //             ease: 'power3.out',
  //             onUpdate: () => {
  //               el.textContent = obj.val.toFixed(decimals);
  //             },
  //           });
  //         };

  //         // 🔹 SplitText لليبل فقط (كلمات مش حروف)
  //         rows.forEach(row => {
  //           const labelEl = row.querySelector('.label') as HTMLElement | null;
  //           if (labelEl) {
  //             const sLabel = SplitText.create(labelEl, { type: 'words', aria: 'hidden' });
  //             gsap.set(sLabel.words, { opacity: 0 });
  //             (labelEl as any)._splitWords = sLabel.words;
  //           }
  //         });

  //         // 🔹 إعداد mask للأرقام (عشان يبانوا تدريجيًا من الشمال)
  //         rows.forEach(row => {
  //           const numEl = row.querySelector('.num') as HTMLElement | null;
  //           if (numEl) {
  //             gsap.set(numEl, {
  //               opacity: 1,
  //               clipPath: 'inset(0 100% 0 0)', // يبدأ مخفي من الشمال
  //             });
  //           }
  //         });

  //         // 🔹 التايملاين الرئيسي
  //         const tl = gsap.timeline({
  //           defaults: { ease: 'power3.out' },
  //           scrollTrigger: {
  //             trigger: triggerEl || section,
  //             start: 'top 20%',
  //             end: 'bottom 100%',
  //             toggleActions: 'play none none none',
  //             once: true,
  //             // markers: true,
  //           },
  //         });

  //         // ✳️ العنوان الرئيسي
  //         const head = document.querySelector('#Text1') as HTMLElement | null;
  //         if (head) {
  //           const splitHead = SplitText.create(head, { type: 'words' });
  //           gsap.set(splitHead.words, { opacity: 0, y: 10 });
  //           tl.fromTo(
  //             splitHead.words,
  //             { opacity: 0, y: 10 },
  //             { opacity: 1, y: 0, duration: 0.7, stagger: 0.15 },
  //             0
  //           );
  //         }

  //         // ✳️ أنيميشن الصفوف
  //         rows.forEach((row, i) => {
  //           const labelEl = row.querySelector('.label') as HTMLElement | null;
  //           const numEl = row.querySelector('.num') as HTMLElement | null;
  //           const counterEl = row.querySelector('.counter') as HTMLElement | null;
  //           const labelWords = (labelEl && (labelEl as any)._splitWords) || null;

  //           const rowPos = i === 0 ? '>' : `>+0.35`;
  //           const rowTL = gsap.timeline();

  //           // 🟢 الليبل – fade من اليمين → الشمال
  //           if (labelWords) {
  //             rowTL.to(
  //               labelWords,
  //               {
  //                 opacity: 1,
  //                 duration: 1.4,
  //                 ease: 'sine.out',
  //                 stagger: { each: 0.08, from: 'end' },
  //               },
  //               0
  //             );
  //           }

  //           // 🔵 الرقم – يظهر من الشمال → اليمين + تشغيل العدّاد
  //           if (numEl && counterEl) {
  //             rowTL.to(
  //               numEl,
  //               {
  //                 clipPath: 'inset(0 0% 0 0)', // يكشف تدريجيًا من الشمال
  //                 duration: 1.4,
  //                 ease: 'power2.out',
  //                 onStart: () => {
  //                   const target = Number(counterEl.getAttribute('data-target') ?? 0);
  //                   const decimals = target % 1 !== 0 ? 1 : 0;
  //                   animateCounter(counterEl, target, 1.4, decimals);
  //                 },
  //               },
  //               0
  //             );
  //           }

  //           tl.add(rowTL, rowPos);
  //         });

  //         // ✳️ الزرار
  //         const cta = section.querySelector('.cta-btn') as HTMLElement | null;
  //         if (cta) {
  //           gsap.set(cta, { opacity: 0 });
  //           tl.to(cta, { opacity: 1, duration: 0.8, ease: 'power2.out' }, '>-0.2');
  //         }
  //       });
  //     });
  //   });
  // }
  //last verion 2
  // ngAfterViewInit() {
  //   if (!isPlatformBrowser(this.platformId)) return;

  //   this.ngZone.runOutsideAngular(() => {
  //     requestAnimationFrame(() => {
  //       document.fonts.ready.then(() => {
  //         const section = document.querySelector('#stats-section') as HTMLElement;
  //         const triggerEl = (document.querySelector('#section3') as HTMLElement) || section;
  //         if (!section) return;

  //         const rows = Array.from(section.querySelectorAll('.stat-row')) as HTMLElement[];
  //         if (!rows.length) return;

  //         rows.forEach(row => {
  //           const c = row.querySelector('.counter') as HTMLElement | null;
  //           if (c) c.textContent = '0';
  //         });
  //         const animateCounter = (el: HTMLElement, to: number, duration = 1.4, decimals = 0) => {
  //           const obj = { val: 0 };
  //           gsap.to(obj, {
  //             val: to,
  //             duration,
  //             ease: 'power3.out',
  //             onUpdate: () => {
  //               el.textContent = obj.val.toFixed(decimals);
  //             },
  //           });
  //         };
  //         rows.forEach(row => {
  //           const labelEl = row.querySelector('.label') as HTMLElement | null;
  //           if (labelEl) {
  //             const sLabel = SplitText.create(labelEl, { type: 'words', aria: 'hidden' });
  //             gsap.set(sLabel.words, { opacity: 0 });
  //             (labelEl as any)._splitWords = sLabel.words;
  //           }
  //         });
  //         rows.forEach(row => {
  //           const numEl = row.querySelector('.num') as HTMLElement | null;
  //           if (numEl) {
  //             gsap.set(numEl, { opacity: 0 });
  //           }
  //         });
  //         const tl = gsap.timeline({
  //           defaults: { ease: 'power3.out' },
  //           scrollTrigger: {
  //             trigger: triggerEl || section,
  //             start: 'top 20%',
  //             end: 'bottom 100%',
  //             toggleActions: 'play none none none',
  //             once: true,
  //             // markers: true,
  //           },
  //         });
  //         const head = document.querySelector('#Text1') as HTMLElement | null;
  //         if (head) {
  //           const splitHead = SplitText.create(head, { type: 'words' });
  //           gsap.set(splitHead.words, { opacity: 0, y: 10 });
  //           tl.fromTo(
  //             splitHead.words,
  //             { opacity: 0, y: 10 },
  //             { opacity: 1, y: 0, duration: 0.7, stagger: 0.15 },
  //             0
  //           );
  //         }
  //         rows.forEach((row, i) => {
  //           const labelEl = row.querySelector('.label') as HTMLElement | null;
  //           const numEl = row.querySelector('.num') as HTMLElement | null;
  //           const counterEl = row.querySelector('.counter') as HTMLElement | null;
  //           const labelWords = (labelEl && (labelEl as any)._splitWords) || null;

  //           const rowPos = i === 0 ? '>' : `>+0.35`;
  //           const rowTL = gsap.timeline();
  //           if (labelWords) {
  //             rowTL.to(
  //               labelWords,
  //               {
  //                 opacity: 1,
  //                 duration: 1.3,
  //                 ease: 'sine.out',
  //                 stagger: { each: 0.08, from: 'start' },
  //               },
  //               0
  //             );
  //           }
  //           if (numEl && counterEl) {
  //             rowTL.to(
  //               numEl,
  //               {
  //                 opacity: 1,
  //                 duration: 1.3,
  //                 ease: 'power2.out',
  //                 onStart: () => {
  //                   const target = Number(counterEl.getAttribute('data-target') ?? 0);
  //                   const decimals = target % 1 !== 0 ? 1 : 0;
  //                   animateCounter(counterEl, target, 1.4, decimals);
  //                 },
  //               },
  //               0
  //             );
  //           }

  //           tl.add(rowTL, rowPos);
  //         });
  //         const cta = section.querySelector('.cta-btn') as HTMLElement | null;
  //         if (cta) {
  //           gsap.set(cta, { opacity: 0 });
  //           tl.to(cta, { opacity: 1, duration: 0.8, ease: 'power2.out' }, '>-0.2');
  //         }
  //       });
  //     });
  //   });
  // }

  // ngAfterViewInit() {
  //   if (isPlatformBrowser(this.platformId)) {
  //     this.isBrowser = true;
  //     console.log(isPlatformBrowser(this.platformId));
  //     this.cdr.detectChanges();
  //   }
  //   console.log(isPlatformBrowser(this.platformId));
  // }



}



