import { Component, Inject, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrl: './coming-soon.component.scss'
})
export class ComingSoonComponent implements OnInit, OnDestroy {
  year = new Date().getFullYear();
  private timerId: any;
  private readonly launchDate = new Date('2025-12-01T00:00:00Z');

  days = '00';
  hours = '00';
  minutes = '00';
  seconds = '00';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.updateCountdown();
      this.timerId = setInterval(() => this.updateCountdown(), 1000);
    } else {
      // في السيرفر نعمل فقط أول تحديث مرة واحدة
      this.updateCountdown();
    }
  }

  ngOnDestroy() {
    if (this.timerId) clearInterval(this.timerId);
  }

  private updateCountdown() {
    const now = new Date();
    const diff = this.launchDate.getTime() - now.getTime();

    if (diff <= 0) {
      this.days = this.hours = this.minutes = this.seconds = '00';
      if (this.timerId) clearInterval(this.timerId);
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    this.days = this.pad(days);
    this.hours = this.pad(hours);
    this.minutes = this.pad(minutes);
    this.seconds = this.pad(seconds);
  }

  private pad(num: number): string {
    return num.toString().padStart(2, '0');
  }

  notify(event: Event) {
    event.preventDefault();
    alert('تم استلام بريدك بنجاح — سنخبرك عند الإطلاق 🎉');
  }
}
