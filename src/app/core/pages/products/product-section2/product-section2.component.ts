import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Inject, NgZone, PLATFORM_ID, ViewChild } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import InertiaPlugin from "gsap/InertiaPlugin";

import SplitText from "gsap/SplitText";
import { OpenFormDialogDirective } from '../../../shared/Directives/open-form-dialog.directive';
import { TranslatePipe } from '@ngx-translate/core';


gsap.registerPlugin(ScrollTrigger, SplitText, InertiaPlugin);
@Component({
  selector: 'app-product-section2',
  imports: [OpenFormDialogDirective, TranslatePipe],
  templateUrl: './product-section2.component.html',
  styleUrl: './product-section2.component.scss'
})
export class ProductSection2Component {
  isBrowser = false;
  CustomizationTitle1Split!: SplitText;
  CustomizationTitle2Split!: SplitText;
  CustomizationSubtitleSplit!: SplitText;
  CustomizationDescSplit!: SplitText;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.initMainSwiper();
  }

  private initMainSwiper(): void {
    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          let mm = gsap.matchMedia();

          const customizationTitle1 = document.getElementById('customizationTitle1');
          const customizationTitle2 = document.getElementById('customizationTitle2');
          const CustomizationSubTitle = document.getElementById('customizationSubTitle');
          const CustomizationDesc = document.getElementById('customizationDesc');

          if (!customizationTitle1 || !customizationTitle2 || !CustomizationSubTitle || !CustomizationDesc) {
            console.warn('⚠️ عناصر الـ hero مش لاقيها SplitText');
            return;
          }

          mm.add({
            desktop: '(min-width: 768px)',
            mobile: '(max-width: 767px)',
          }, (context) => {
            let { desktop, mobile } = context.conditions as any;

            this.CustomizationTitle1Split = new SplitText(customizationTitle1, { type: 'words' });
            this.CustomizationTitle2Split = new SplitText(customizationTitle2, { type: 'words' });
            this.CustomizationSubtitleSplit = new SplitText(CustomizationSubTitle, { type: 'words' });
            this.CustomizationDescSplit = new SplitText(CustomizationDesc, { type: 'words' });

            ScrollTrigger.create({
              trigger: '#productsection2',
              start: 'top top',
              end: mobile ? 'top 95%' : "150% bottom",
              pin: true,
              pinType: 'transform',
              id: 'pinsection',
              anticipatePin: 1,
              onLeave: () => { if (mobile) tl.progress(1); },
              // onEnterBack: () => { if (mobile) tl.progress(0); },
            });

            const tl = gsap.timeline({
              defaults: { ease: "power3.out" }, scrollTrigger: {
                trigger: "#productsection2",
                start: 'top top',
                end: "bottom bottom",
              }
            });

            tl.fromTo(this.CustomizationTitle1Split.words,
              { opacity: 0, visibility: "visible" },
              {
                opacity: 1,
                duration: 0.2,
                ease: "sine.out",
                stagger: 0.02,
                onStart: () => { gsap.set(customizationTitle1, { opacity: 1, visibility: "visible" }) },
              }
            );
            tl.fromTo(this.CustomizationTitle2Split.words,
              { opacity: 0, visibility: "visible" },
              {
                opacity: 1,
                duration: 0.2,
                ease: "sine.out",
                stagger: 0.02,
                onStart: () => { gsap.set(customizationTitle2, { opacity: 1, visibility: "visible" }) },
              }
            );
            tl.fromTo(this.CustomizationSubtitleSplit.words,
              { opacity: 0, visibility: "visible" },
              {
                opacity: 1,
                duration: 0.2,
                ease: "sine.out",
                stagger: 0.02,
                onStart: () => { gsap.set(CustomizationSubTitle, { opacity: 1, visibility: "visible" }) },
              }
            );
            tl.fromTo(this.CustomizationDescSplit.words,
              { opacity: 0, visibility: "visible" },
              {
                opacity: 1,
                duration: 0.2,
                ease: "sine.out",
                stagger: 0.02,
                onStart: () => { gsap.set(CustomizationDesc, { opacity: 1, visibility: "visible" }) },
              }
            );
            tl.fromTo("#Customization-icons", { opacity: 0, visibility: "hidden" }, { opacity: 1, visibility: "visible", duration: 0.2 });
            tl.fromTo("#customization-bottom", { opacity: 0, visibility: "hidden" }, { opacity: 1, visibility: "visible", duration: 0.2 });

            return () => {
              if (this.CustomizationTitle1Split) this.CustomizationTitle1Split.revert();
              if (this.CustomizationTitle2Split) this.CustomizationTitle2Split.revert();
              if (this.CustomizationSubtitleSplit) this.CustomizationSubtitleSplit.revert();
              if (this.CustomizationDescSplit) this.CustomizationDescSplit.revert();
            };
          });

        }, 200);
      });
    });

  }
}
