import {
  Component,
  Input,
  Inject,
  PLATFORM_ID,
  ElementRef,
  OnInit,
  OnDestroy,
  NgZone,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DomSanitizer, Meta, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-vedio-player-ssr',
  templateUrl: './vedio-player-ssr.component.html',
  styleUrls: ['./vedio-player-ssr.component.scss'],
})
export class VedioPlayerSsrComponent {
  @Input() videoUrl: string = '';
  thumbnailUrl = '';
  isBrowser = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private el: ElementRef,
    private zone: NgZone
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.thumbnailUrl = this.getThumbnail(this.videoUrl);

    if (this.isBrowser) {
      // ⏳ تأجيل التنفيذ لما بعد الـ hydration بالكامل
      this.zone.runOutsideAngular(() => {
        setTimeout(() => this.initClientOnly(), 1500);
      });
    }
  }

  private initClientOnly() {
    const container = this.el.nativeElement.querySelector('.video-wrapper');
    if (!container) return;

    // هنا بنسيب الصورة بدون أي تغيير — الفيديو مش هيتضاف غير بعد كليك
    const thumb = container.querySelector('.thumbnail');
    if (thumb) {
      thumb.addEventListener('click', () => {
        const iframe = document.createElement('iframe');
        iframe.width = '560';
        iframe.height = '315';
        iframe.src = `${this.videoUrl}?autoplay=1&rel=0`;
        iframe.title = 'YouTube video player';
        iframe.frameBorder = '0';
        iframe.allow =
          'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.referrerPolicy = 'strict-origin-when-cross-origin';
        iframe.allowFullscreen = true;

        container.innerHTML = '';
        container.appendChild(iframe);
      });
    }
  }

  private getThumbnail(url: string): string {
    const videoId = this.extractYouTubeId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';
  }

  private extractYouTubeId(url: string): string {
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/
    );
    return match ? match[1] : '';
  }
}
