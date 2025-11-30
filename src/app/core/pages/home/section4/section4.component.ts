import { isPlatformBrowser } from '@angular/common';
import { ApplicationRef, Component, Inject, NgZone, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { LanguageService } from '../../../shared/services/language.service';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-section4',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './section4.component.html',
  styleUrl: './section4.component.scss'
})
export class Section4Component {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appRef: ApplicationRef,
    private ngZone: NgZone,
    private language: LanguageService

  ) { }
  ngAfterViewInit() {
    if (typeof window === 'undefined') return;

    if (!isPlatformBrowser(this.platformId)) return;
    requestAnimationFrame(() => {
      setTimeout(() => {
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: "#section4",
            start: 'top top',
            end: "140% bottom",
            pin: true,
            // markers: true
          }
        });

        tl.to("#Text1", {
          opacity: 1,
          y: 0,
          duration: 0.8,
        });

        tl.to(".card", {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.20,
        }, "-1.5");
        tl.to("#Text2", {
          opacity: 1,
          y: 0,
          duration: 0.8,
        });
      }, 500);
    });


  }
  get isRtl() {
    return this.language.currentLang === 'ar';
  }
}
