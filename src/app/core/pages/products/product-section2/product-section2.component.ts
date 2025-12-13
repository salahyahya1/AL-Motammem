import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Inject, NgZone, PLATFORM_ID, ViewChild } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import InertiaPlugin from "gsap/InertiaPlugin";

import SplitText from "gsap/SplitText";
import { OpenFormDialogDirective } from '../../../shared/Directives/open-form-dialog.directive';


gsap.registerPlugin(ScrollTrigger, SplitText, InertiaPlugin);
@Component({
  selector: 'app-product-section2',
  imports: [OpenFormDialogDirective],
  templateUrl: './product-section2.component.html',
  styleUrl: './product-section2.component.scss'
})
export class ProductSection2Component {
  isBrowser = false;
  CustomizationTitleSplit!: SplitText;
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

          ScrollTrigger.create({
            trigger: '#customizationSection',
            start: 'top top',
            end: "150% bottom",
            pin: true,
            pinType: 'transform',
            id: 'pinsection',
            anticipatePin: 1,
          });
          gsap.set("#customizationSection", { willChange: "transform, opacity" });
          const CustomizationTitle = document.getElementById('customizationTitle');
          const CustomizationSubTitle = document.getElementById('customizationSubTitle');
          const CustomizationDesc = document.getElementById('customizationDesc');
          if (!CustomizationTitle || !CustomizationSubTitle || !CustomizationDesc) {
            console.warn('⚠️ عناصر الـ hero مش لاقيها SplitText');
            return;
          }
          this.CustomizationTitleSplit = new SplitText(CustomizationTitle, { type: 'words' });
          this.CustomizationSubtitleSplit = new SplitText(CustomizationSubTitle, { type: 'words' });
          this.CustomizationDescSplit = new SplitText(CustomizationDesc, { type: 'words' });
          const tl = gsap.timeline({
            defaults: { ease: "power3.out" }, scrollTrigger: {
              trigger: "#customizationSection",
              start: 'top top',
              end: "bottom bottom",
            }
          });



          tl.fromTo(this.CustomizationTitleSplit.words,
            { opacity: 0, visibility: "visible" },
            {
              opacity: 1,
              duration: 0.4,
              ease: "sine.out",
              stagger: 0.02,
              onStart: () => { gsap.set(CustomizationTitle, { opacity: 1, visibility: "visible" }) },
            }
          );
          tl.fromTo(this.CustomizationSubtitleSplit.words,
            { opacity: 0, visibility: "visible" },
            {
              opacity: 1,
              duration: 0.4,
              ease: "sine.out",
              stagger: 0.02,
              onStart: () => { gsap.set(CustomizationSubTitle, { opacity: 1, visibility: "visible" }) },
            }
          );
          tl.fromTo(this.CustomizationDescSplit.words,
            { opacity: 0, visibility: "visible" },
            {
              opacity: 1,
              duration: 0.4,
              ease: "sine.out",
              stagger: 0.02,
              onStart: () => { gsap.set(CustomizationDesc, { opacity: 1, visibility: "visible" }) },
            }
          );
          tl.fromTo("#Customization-icons", { opacity: 0, visibility: "hidden" }, { opacity: 1, visibility: "visible", duration: 0.8 });
          tl.fromTo("#customization-bottom", { opacity: 0, visibility: "hidden" }, { opacity: 1, visibility: "visible", duration: 0.8 });


        }, 200);
      });
    });

  }
}
