// import { CommonModule, isPlatformBrowser } from '@angular/common';
// import {
//   Component,
//   ElementRef,
//   Inject,
//   NgZone,
//   PLATFORM_ID,
//   ViewChild,
// } from '@angular/core';

// import Swiper from 'swiper/bundle';
// import 'swiper/css/bundle';
// @Component({
//   selector: 'app-solutions-section4',
//   imports: [CommonModule],
//   templateUrl: './solutions-section4.component.html',
//   styleUrl: './solutions-section4.component.scss'
// })
// export class SolutionsSection4Component {
//   @ViewChild('swiperEl') swiperEl!: ElementRef<HTMLDivElement>;
//   swiperInstance: Swiper | null = null;
//   private hasSwitchedToTwo = false

//   sectors = [
//     {
//       title: ' تكامل',
//       text: `
// أي تحديث في قسم واحد ينعكس فورًا في جميع الأقسام الأخرى، ويمكنك تأكيد صحة البيانات قبل تأثيرها
// `    },
//     {
//       title: ' تكامل',
//       text: `
// أي تحديث في قسم واحد ينعكس فورًا في جميع الأقسام الأخرى، ويمكنك تأكيد صحة البيانات قبل تأثيرها
// `    },
//     {
//       title: ' تكامل داخلي',
//       text: `
// أي تحديث في قسم واحد ينعكس فورًا في جميع الأقسام الأخرى، ويمكنك تأكيد صحة البيانات قبل تأثيرها
// `    },
//     {
//       title: ' تكامل داخلي',
//       text: `
// أي تحديث في قسم واحد ينعكس فورًا في جميع الأقسام الأخرى، ويمكنك تأكيد صحة البيانات قبل تأثيرها
// `    },
//     {
//       title: ' تكامل داخلي',
//       text: `
// أي تحديث في قسم واحد ينعكس فورًا في جميع الأقسام الأخرى، ويمكنك تأكيد صحة البيانات قبل تأثيرها
// `    },
//     {
//       title: ' تكامل داخلي',
//       text: `
// أي تحديث في قسم واحد ينعكس فورًا في جميع الأقسام الأخرى، ويمكنك تأكيد صحة البيانات قبل تأثيرها
// `    },
//     {
//       title: ' تكامل داخلي',
//       text: `
// أي تحديث في قسم واحد ينعكس فورًا في جميع الأقسام الأخرى، ويمكنك تأكيد صحة البيانات قبل تأثيرها
// `    },
//     {
//       title: ' تكامل داخلي',
//       text: `
// أي تحديث في قسم واحد ينعكس فورًا في جميع الأقسام الأخرى، ويمكنك تأكيد صحة البيانات قبل تأثيرها
// `    },
//     {
//       title: ' تكامل داخلي',
//       text: `
// أي تحديث في قسم واحد ينعكس فورًا في جميع الأقسام الأخرى، ويمكنك تأكيد صحة البيانات قبل تأثيرها
// `    },
//   ];
//   constructor(
//     @Inject(PLATFORM_ID) private pid: Object,
//     private ngZone: NgZone
//   ) { }

//   async ngAfterViewInit() {
//     if (!isPlatformBrowser(this.pid)) return;
//     if (typeof window === 'undefined') return;

//     this.ngZone.runOutsideAngular(() => {
//       requestAnimationFrame(() => {
//         setTimeout(() => {
//           // لو في instance قديم (في dev أو HMR) دمّره
//           if (this.swiperInstance) {
//             this.swiperInstance.destroy(true, true);
//             this.swiperInstance = null;
//           }

//           // ✅ Swiper بسيط من غير Navigation module
//           this.swiperInstance = new Swiper(this.swiperEl.nativeElement, {
//             direction: 'vertical',
//             slidesPerView: 1,
//             slidesPerGroup: 1,
//             centeredSlides: true,
//             // slidesPerView: 2,
//             // slidesPerGroup: 2,
//             loop: true,
//             // autoplay: {
//             //   delay: 2500,
//             //   disableOnInteraction: false,
//             //   pauseOnMouseEnter: true
//             // },
//             navigation: {
//               prevEl: "#arrowUP",
//               nextEl: "#arrowDown"
//             }


//               , on: {
//               slideChange: () => {
//                 // أول مرة بس نغيّر الإعدادات
//                 if (!this.hasSwitchedToTwo && this.swiperInstance) {
//                   this.hasSwitchedToTwo = true;

//                   const s = this.swiperInstance;
//                   s.params.slidesPerView = 2;
//                   s.params.slidesPerGroup = 2;
//                   s.params.centeredSlides = false; // خلاص هنشتغل 2 فوق بعض
//                   s.update();

//                   // لو حابب تتأكد في اللوج:
//                   console.log('Switched to 2 per view');
//                 }
//               }
//             }
//           });

//         }, 200);
//       });
//     });
//   }
// }
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  NgZone,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';

import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../shared/services/language.service';
interface Sector {
  titleKey: string;
  textKey: string;
}

@Component({
  selector: 'app-solutions-section4',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './solutions-section4.component.html',
  styleUrl: './solutions-section4.component.scss'
})
export class SolutionsSection4Component {
  @ViewChild('swiperEl') swiperEl!: ElementRef<HTMLDivElement>;
  swiperInstance: Swiper | null = null;


  sectors: Sector[] = [
    {
      titleKey: 'SOLUTIONS.SECTION4.CORE_MODULES.FINANCE.TITLE',
      textKey: 'SOLUTIONS.SECTION4.CORE_MODULES.FINANCE.DESC',
    },
    {
      titleKey: 'SOLUTIONS.SECTION4.CORE_MODULES.INVENTORY.TITLE',
      textKey: 'SOLUTIONS.SECTION4.CORE_MODULES.INVENTORY.DESC',
    },
    {
      titleKey: 'SOLUTIONS.SECTION4.CORE_MODULES.PURCHASING.TITLE',
      textKey: 'SOLUTIONS.SECTION4.CORE_MODULES.PURCHASING.DESC',
    },
    {
      titleKey: 'SOLUTIONS.SECTION4.CORE_MODULES.SALES.TITLE',
      textKey: 'SOLUTIONS.SECTION4.CORE_MODULES.SALES.DESC',
    },
    {
      titleKey: 'SOLUTIONS.SECTION4.CORE_MODULES.HR.TITLE',
      textKey: 'SOLUTIONS.SECTION4.CORE_MODULES.HR.DESC',
    },
    {
      titleKey: 'SOLUTIONS.SECTION4.CORE_MODULES.PROJECTS.TITLE',
      textKey: 'SOLUTIONS.SECTION4.CORE_MODULES.PROJECTS.DESC',
    },
    {
      titleKey: 'SOLUTIONS.SECTION4.CORE_MODULES.REPORTS.TITLE',
      textKey: 'SOLUTIONS.SECTION4.CORE_MODULES.REPORTS.DESC',
    },
  ];
  groupedSectors: Sector[][] = [];

  constructor(
    @Inject(PLATFORM_ID) private pid: Object,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.groupSectors();
  }

  private groupSectors() {
    if (!this.sectors.length) return;

    const result: Sector[][] = [];

    result.push([this.sectors[0]]);
    for (let i = 1; i < this.sectors.length; i += 2) {
      const group: Sector[] = [this.sectors[i]];
      if (i + 1 < this.sectors.length) {
        group.push(this.sectors[i + 1]);
      }
      result.push(group);
    }

    this.groupedSectors = result;
  }

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.pid)) return;
    if (typeof window === 'undefined') return;

    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (this.swiperInstance) {
            this.swiperInstance.destroy(true, true);
            this.swiperInstance = null;
          }
          this.swiperInstance = new Swiper(this.swiperEl.nativeElement, {
            direction: 'vertical',
            slidesPerView: 1,
            slidesPerGroup: 1,
            loop: true,
            navigation: {
              prevEl: "#arrowUP",
              nextEl: "#arrowDown"
            },
            autoplay: {
              delay: 2500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            },
          });
        }, 200);
      });
    });
  }
}
