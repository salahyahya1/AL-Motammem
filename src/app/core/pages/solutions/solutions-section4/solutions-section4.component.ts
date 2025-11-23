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
@Component({
  selector: 'app-solutions-section4',
  imports: [CommonModule],
  templateUrl: './solutions-section4.component.html',
  styleUrl: './solutions-section4.component.scss'
})
export class SolutionsSection4Component {
  @ViewChild('swiperEl') swiperEl!: ElementRef<HTMLDivElement>;
  swiperInstance: Swiper | null = null;

  sectors = [
    {
      title: ' تكامل داخلي',
      text: `
أي تحديث في قسم واحد ينعكس فورًا في جميع الأقسام الأخرى، ويمكنك تأكيد صحة البيانات قبل تأثيرها
`    },
    {
      title: ' تكامل داخلي',
      text: `
أي تحديث في قسم واحد ينعكس فورًا في جميع الأقسام الأخرى، ويمكنك تأكيد صحة البيانات قبل تأثيرها
`    },
    {
      title: ' تكامل داخلي',
      text: `
أي تحديث في قسم واحد ينعكس فورًا في جميع الأقسام الأخرى، ويمكنك تأكيد صحة البيانات قبل تأثيرها
`    },
    {
      title: ' تكامل داخلي',
      text: `
أي تحديث في قسم واحد ينعكس فورًا في جميع الأقسام الأخرى، ويمكنك تأكيد صحة البيانات قبل تأثيرها
`    },
    {
      title: ' تكامل داخلي',
      text: `
أي تحديث في قسم واحد ينعكس فورًا في جميع الأقسام الأخرى، ويمكنك تأكيد صحة البيانات قبل تأثيرها
`    },
    {
      title: ' تكامل داخلي',
      text: `
أي تحديث في قسم واحد ينعكس فورًا في جميع الأقسام الأخرى، ويمكنك تأكيد صحة البيانات قبل تأثيرها
`    },
    {
      title: ' تكامل داخلي',
      text: `
أي تحديث في قسم واحد ينعكس فورًا في جميع الأقسام الأخرى، ويمكنك تأكيد صحة البيانات قبل تأثيرها
`    },
    {
      title: ' تكامل داخلي',
      text: `
أي تحديث في قسم واحد ينعكس فورًا في جميع الأقسام الأخرى، ويمكنك تأكيد صحة البيانات قبل تأثيرها
`    },
    {
      title: ' تكامل داخلي',
      text: `
أي تحديث في قسم واحد ينعكس فورًا في جميع الأقسام الأخرى، ويمكنك تأكيد صحة البيانات قبل تأثيرها
`    },
  ];
  constructor(
    @Inject(PLATFORM_ID) private pid: Object,
    private ngZone: NgZone
  ) { }

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.pid)) return;
    if (typeof window === 'undefined') return;

    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          // لو في instance قديم (في dev أو HMR) دمّره
          if (this.swiperInstance) {
            this.swiperInstance.destroy(true, true);
            this.swiperInstance = null;
          }

          // ✅ Swiper بسيط من غير Navigation module
          this.swiperInstance = new Swiper(this.swiperEl.nativeElement, {
            direction: 'vertical',
            slidesPerView: 2,
            slidesPerGroup: 2,
            loop: true,
            autoplay: {
              delay: 2500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            },
            navigation: {
              prevEl: "#arrowUP",
              nextEl: "#arrowDown"
            }
          });

          // const nextBtn = document.getElementById('arrowRight3');
          // const prevBtn = document.getElementById('arrowLeft3');

          // nextBtn?.addEventListener('click', () => {
          //   this.swiperInstance?.slideNext();
          // });

          // prevBtn?.addEventListener('click', () => {
          //   this.swiperInstance?.slidePrev();
          // });

          // this.swiperInstance.on('slideChange', () => {
          //   console.log('active index:', this.swiperInstance?.realIndex);
          // });
        }, 200);
      });
    });
  }
}
