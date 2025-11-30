import { isPlatformBrowser } from '@angular/common';
import { ApplicationRef, ChangeDetectorRef, Component, Inject, NgZone, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

import SplitText from "gsap/SplitText";
gsap.registerPlugin(ScrollTrigger, SplitText);
import { LanguageService } from '../../../shared/services/language.service';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
@Component({
  selector: 'app-section5',
  imports: [TranslatePipe, TranslateDirective],
  templateUrl: './section5.component.html',
  styleUrl: './section5.component.scss'
})
export class Section5Component {
  isMobile = false;
  private resizeHandler!: () => void;

  isVideoLoaded = false;
  safeVideoUrl: SafeResourceUrl | null = null;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appRef: ApplicationRef,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
    , private sanitizer: DomSanitizer,
    private language: LanguageService
  ) {
  }
  ngOnInit() {
    this.updateIsMobile();
    if (typeof window === 'undefined') return;
    if (!isPlatformBrowser(this.platformId)) return;
    gsap.set("#section100", { opacity: 0, visibility: "hidden" });
  }

  ngAfterViewInit() {
    if (typeof window === 'undefined') return;
    if (!isPlatformBrowser(this.platformId)) return;

    this.resizeHandler = () => {
      this.ngZone.run(() => {
        const next = window.innerWidth < 700;
        if (next !== this.isMobile) {
          this.isMobile = next;
          this.cdr.detectChanges();
        }
      });
    };

    window.addEventListener('resize', this.resizeHandler);
    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          const tl = gsap.timeline({
            defaults: { ease: "power3.out" }, scrollTrigger: {
              trigger: "#section5",
              start: 'top top',
              end: "100% bottom",
              pin: true,
              anticipatePin: 1,
            }
          });
          tl.to("#Text5", { opacity: 1, y: 0, duration: 0.6, ease: 'power2.inOut' });

          const path = document.querySelector(".capsule-path") as SVGPathElement;
          const length = path.getTotalLength();
          gsap.set("#image-container", { opacity: 0, visibility: "hidden" });
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length, opacity: 0, visibility: "hidden" });
          const container = document.querySelector("#image-container") as HTMLElement;
          gsap.set(container, { opacity: 0, visibility: "hidden" });

          let imagesShown = false;
          let flipStarted = false;

          tl.to(path, {
            opacity: 1,
            visibility: "visible",
            strokeDashoffset: 0,
            duration: 1,
            ease: "power2.inOut",
            onUpdate: () => {
              const currentOffset = gsap.getProperty(path, "strokeDashoffset") as number;
              const progress = 1 - currentOffset / length;

              if (progress >= 0.5 && !imagesShown) {
                imagesShown = true;
                gsap.to(container, {
                  opacity: 1,
                  visibility: "visible",
                  duration: 0.6,
                  ease: "power2.out",
                });
              }

              if (progress >= 1 && !flipStarted) {
                flipStarted = true;
                this.startImageFlip(container);
              }
            },
            onComplete: () => {
              gsap.fromTo("#section100", { opacity: 0, visibility: "hidden" }, { opacity: 1, visibility: "visible", duration: 0.5 });
            }
          });
        }, 500);
      });
    });
  }
  startImageFlip(container: HTMLElement) {
    const slots = Array.from(container.querySelectorAll(".slot")) as HTMLElement[];

    const allSources = [
      "/images/logos/1.webp",
      "/images/logos/2.webp",
      "/images/logos/3.webp",
      "/images/logos/4.webp",
      "/images/logos/5.webp",
      "/images/logos/6.webp",
      "/images/logos/7.webp",
      "/images/logos/8.webp",
      "/images/logos/9.webp",
      "/images/logos/10.webp",
      "/images/logos/11.webp",
      "/images/logos/12.webp",
      "/images/logos/13.webp",
      "/images/logos/14.webp",
      "/images/logos/15.webp"
    ];
    const slotImages: Map<HTMLElement, string[]> = new Map();

    slots.forEach((slot, i) => {
      const img = slot.querySelector("img")!;
      img.src = allSources[i];
      const remaining = allSources.filter((_, idx) => idx !== i);
      const randomSubset = gsap.utils.shuffle(remaining).slice(0, 4);
      slotImages.set(slot, randomSubset);
    });

    function flipSlot(slot: HTMLElement) {
      const img = slot.querySelector("img")!;
      const queue = slotImages.get(slot)!;
      if (!queue.length) return;

      const newSrc = queue.shift()!;
      gsap.to(img, {
        y: -80,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
          img.src = newSrc;
          gsap.set(img, { y: 80, opacity: 0 });
          gsap.to(img, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" });
        },
      });
    }

    function randomLoop() {

      const available = slots.filter(slot => (slotImages.get(slot)?.length ?? 0) > 0);
      if (!available.length) {
        console.log("✅ كل الخانات خلصت الصور");
        return;
      }

      const randomCount = gsap.utils.random(1, Math.min(3, available.length), 1);
      const randomSlots = gsap.utils.shuffle(available).slice(0, randomCount);

      randomSlots.forEach(slot => flipSlot(slot));

      const nextDelay = gsap.utils.random(1, 2.5, 0.2) * 1000;
      setTimeout(randomLoop, nextDelay);
    }

    randomLoop();
  }
  private updateIsMobile() {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth < 700;
    }
  }
  loadVideo() {
    this.isVideoLoaded = true;
    // حوّل URL إلى SafeResourceUrl
    this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.videoUrl);
    this.cdr.detectChanges();
  }

  get videoUrl() {
    return 'https://www.youtube.com/embed/inlofWRsKxU?autoplay=1&controls=1';
  }
  ngOnDestroy() {
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }
  }
}
