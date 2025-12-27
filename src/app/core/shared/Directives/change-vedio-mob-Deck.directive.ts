import { Directive, ElementRef, Inject, Input, NgZone, OnDestroy, AfterViewInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({ selector: '[appResponsiveVideo]' })
export class ResponsiveVideoDirective implements AfterViewInit, OnDestroy {
  @Input() desktopWebm = '';
  @Input() mobileWebm = '';
  @Input() desktopMp4 = '';
  @Input() mobileMp4 = '';

  private io?: IntersectionObserver;
  private chosen = '';

  constructor(
    private el: ElementRef<HTMLVideoElement>,
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.zone.runOutsideAngular(() => {
      const video = this.el.nativeElement;

      // ✅ اختار src مرة واحدة
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      const supportsWebm = video.canPlayType('video/webm') !== '';

      const src = isMobile
        ? (supportsWebm ? this.mobileWebm : this.mobileMp4)
        : (supportsWebm ? this.desktopWebm : this.desktopMp4);

      this.chosen = src;

      // ✅ ما تحملش دلوقتي
      video.preload = 'none';

      // ✅ حمل بس لما يدخل viewport
      this.io = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;

        // امنع تكرار
        this.io?.disconnect();

        // الغِ أي تحميل قديم
        video.pause();
        video.removeAttribute('src');
        video.load();

        video.src = this.chosen;
        video.load(); // يبدأ التحميل هنا فقط
      }, { rootMargin: '200px' }); // يبدأ قبل ما يدخل بـ 200px

      this.io.observe(video);
    });
  }

  ngOnDestroy(): void {
    this.io?.disconnect();
  }
}
