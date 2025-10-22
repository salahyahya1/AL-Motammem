import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ApplicationRef, ChangeDetectorRef, Component, Inject, NgZone, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(ScrollTrigger, SplitText);
@Component({
  selector: 'app-section10',
  imports: [],
  templateUrl: './section10.component.html',
  styleUrl: './section10.component.scss'
})
export class Section10Component {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appRef: ApplicationRef,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,

  ) {
  }
  ngAfterViewInit() {
    if (typeof window === 'undefined') return;

    if (!isPlatformBrowser(this.platformId)) return;
    this.ngZone.onStable.subscribe(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          const tl = gsap.timeline({
            defaults: { ease: 'power3.out' },
            scrollTrigger: {
              trigger: '#section100',
              start: 'top top',
              end: "100% bottom",
              // markers: true,
              // pin: true,
              anticipatePin: 1,
            },
          });

        }, 0);
      });
    });
  }
}
