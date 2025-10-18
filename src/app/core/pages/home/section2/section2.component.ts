import { isPlatformBrowser } from '@angular/common';
import { ApplicationRef, Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
gsap.registerPlugin(ScrollTrigger, SplitText);

@Component({
  selector: 'app-section2',
  imports: [],
  templateUrl: './section2.component.html',
  styleUrls: ['./section2.component.scss'],
})
export class Section2Component {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appRef: ApplicationRef,
    private ngZone: NgZone
  ) { }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        document.fonts.ready.then(() => {
          const section = document.querySelector('#stats-section') as HTMLElement;
          const triggerEl = (document.querySelector('#section2') as HTMLElement) || section;
          if (!section) return;

          // ✅ هنا التعديل المهم
          const rows = Array.from(section.querySelectorAll('.stat-card')) as HTMLElement[];
          if (!rows.length) {
            console.warn('⚠️ لم يتم العثور على أي stat-card');
            return;
          }

          // تصفير العدادات
          rows.forEach(row => {
            const c = row.querySelector('.counter') as HTMLElement | null;
            if (c) c.textContent = '0';
          });

          const animateCounter = (el: HTMLElement, to: number, duration = 1.4, decimals = 0) => {
            const obj = { val: 0 };
            gsap.to(obj, {
              val: to,
              duration,
              ease: 'power3.out',
              onUpdate: () => {
                el.textContent = obj.val.toFixed(decimals);
              },
            });
          };

          // تجهيز النصوص (SplitText)
          rows.forEach(row => {
            const labelEl = row.querySelector('.label') as HTMLElement | null;
            if (labelEl) {
              const sLabel = SplitText.create(labelEl, { type: 'words', aria: 'hidden' });
              gsap.set(sLabel.words, { opacity: 0 });
              (labelEl as any)._splitWords = sLabel.words;
            }
          });

          // تجهيز الأرقام
          rows.forEach(row => {
            const numEl = row.querySelector('.num') as HTMLElement | null;
            if (numEl) {
              gsap.set(numEl, { opacity: 0 });
            }
          });
          ///////////////
          // function videoScrub(video: HTMLVideoElement | string, vars: gsap.TweenVars): gsap.core.Tween {
          //   const videoEl = typeof video === "string"
          //     ? (gsap.utils.toArray(video)[0] as HTMLVideoElement)
          //     : video;

          //   // دالة لإضافة event لمرة واحدة فقط
          //   const once = (
          //     el: Element | Document,
          //     event: string,
          //     fn: (this: Element, ev: Event) => any
          //   ) => {
          //     const onceFn = function (this: Element, ev: Event) {
          //       el.removeEventListener(event, onceFn as EventListener);
          //       fn.call(this, ev);
          //     };
          //     el.addEventListener(event, onceFn as EventListener);
          //     return onceFn;
          //   };

          //   const prepFunc = () => {
          //     videoEl.play();
          //     videoEl.pause();
          //   };

          //   const prep = () => once(document.documentElement, "touchstart", prepFunc);
          //   const tween = gsap.fromTo(
          //     videoEl,
          //     { currentTime: 0 },
          //     {
          //       paused: true,
          //       immediateRender: false,
          //       currentTime: videoEl.duration || 1,
          //       ease: "none",
          //       ...vars,
          //     }
          //   );

          //   const resetTime = () => {
          //     tween.vars['currentTime'] = videoEl.duration || 1;
          //     tween.invalidate();
          //   };

          //   prep();

          //   if (videoEl.readyState) {
          //     resetTime();
          //   } else {
          //     once(videoEl, "loadedmetadata", resetTime);
          //   }

          //   return tween;
          // }

          // // مثال على الاستخدام
          // const videoElement = document.querySelector("video") as HTMLVideoElement;

          // videoScrub(videoElement, {
          //   scrollTrigger: {
          //     trigger: videoElement,
          //     start: "center center",
          //     scrub: true,
          //     pin: true,
          //   },
          // });
          ///////////////
          ScrollTrigger.create({
            trigger: triggerEl || section,  // عنصر داخل السكشن
            start: 'top top',
            end: '+=50%', // يفضل تستخدم قيمة محددة
            pin: true,
            scrub: true, pinType: 'transform',
            // markers: true,
            id: 'pinsection',
          });
          const tl = gsap.timeline({
            defaults: { ease: 'power3.out' },
            scrollTrigger: {
              trigger: triggerEl || section,
              start: 'top top',
              end: '+=400',
              // scrub: true,
              // markers: true,
            },
          });

          // ✅ الترتيب المطلوب (بالتسلسل)
          const order = [0, 1, 2, 3]; // [عميل نشط, سنة خبرة, توافر النظام, أسابيع]

          order.forEach((index, i) => {
            const row = rows[index];
            const labelEl = row.querySelector('.label') as HTMLElement | null;
            const numEl = row.querySelector('.num') as HTMLElement | null;
            const counterEl = row.querySelector('.counter') as HTMLElement | null;
            const labelWords = (labelEl && (labelEl as any)._splitWords) || null;

            const rowTL = gsap.timeline();
            if (labelWords) {
              rowTL.to(labelWords, {
                opacity: 1,
                duration: 1.3,
                ease: 'sine.out',
                stagger: { each: 0.08, from: 'start' },
              });
            }
            if (numEl && counterEl) {
              rowTL.to(
                numEl,
                {
                  opacity: 1,
                  duration: 1.3,
                  ease: 'power2.out',
                  onStart: () => {
                    const target = Number(counterEl.getAttribute('data-target') ?? 0);
                    const decimals = target % 1 !== 0 ? 1 : 0;
                    animateCounter(counterEl, target, 1.4, decimals);
                  },
                },
                0
              );
            }

            // كل عنصر يبدأ بعد ما اللي قبله يخلص
            tl.add(rowTL, i === 0 ? '>' : '-=0.8');
          });

          // ✅ الزرار والجملة
          const cta = section.querySelector('button') as HTMLElement | null;
          const subtitle = section.querySelector('p') as HTMLElement | null;
          if (cta) {
            gsap.set(cta, { opacity: 0, y: 20 });
            tl.to(cta, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '+=0.1');
          }
          if (subtitle) {
            gsap.set(subtitle, { opacity: 0, y: 10 });
            tl.to(subtitle, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '+=0.1');
          }
        });
      });
    });
  }
}


//
function videoScrub(
  video: HTMLVideoElement | string,
  vars: gsap.TweenVars & { scrollTrigger?: ScrollTrigger.Vars }
): gsap.core.Tween {
  const videoEl = (typeof video === 'string'
    ? (gsap.utils.toArray(video)[0] as HTMLVideoElement)
    : video) as HTMLVideoElement;

  // 1) تأمين الـ "unlock" على اللمس و الكليك (موبايل + ديسكتوب)
  const unlock = () => {
    // play → pause لتفعيل التحكم في currentTime (سياسات المتصفح)
    const p = videoEl.play();
    if (p && typeof p.then === 'function') {
      p.then(() => videoEl.pause()).catch(() => {/* تجاهل */ });
    } else {
      videoEl.pause();
    }
    document.documentElement.removeEventListener('touchstart', unlock);
    document.documentElement.removeEventListener('click', unlock);
  };
  document.documentElement.addEventListener('touchstart', unlock, { once: true });
  document.documentElement.addEventListener('click', unlock, { once: true });

  // 2) تحضير التوين بعد ما نضمن الـ duration
  const makeTween = () => {
    // لو لسه مفيش مدة، حط 1 ك fallback (هيتحدث بعد invalidate)
    const dur = isFinite(videoEl.duration) && videoEl.duration > 0 ? videoEl.duration : 1;

    const tween = gsap.fromTo(
      videoEl,
      { currentTime: 0 },
      {
        currentTime: dur,
        ease: 'none',
        paused: true,
        immediateRender: false,
        ...vars,
        // مهم جدًا مع ScrollTrigger علشان يحسب من جديد بعد resize/refresh
        onUpdate: (self) => {
          vars?.onUpdate?.(self as any);
        },
      }
    );

    // لما تتغير المدة (مثلاً بعد refresh)، حدّث التوين
    const resetTime = () => {
      const d = isFinite(videoEl.duration) && videoEl.duration > 0 ? videoEl.duration : 1;
      tween.vars['currentTime'] = d;
      tween.invalidate(); // يعيد حساب كل حاجة
    };

    // ربط reset بالـ refresh بتاع ScrollTrigger
    ScrollTrigger.addEventListener('refreshInit', resetTime);

    return tween;
  };

  if (videoEl.readyState >= 1) {
    return makeTween();
  } else {
    // استنى metadata مرة واحدة
    return new Promise<gsap.core.Tween>((resolve) => {
      const onMeta = () => {
        videoEl.removeEventListener('loadedmetadata', onMeta);
        resolve(makeTween());
      };
      videoEl.addEventListener('loadedmetadata', onMeta, { once: true });
    }) as unknown as gsap.core.Tween;
  }
}
