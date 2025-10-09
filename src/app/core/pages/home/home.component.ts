
import { isPlatformBrowser } from '@angular/common';
import { ApplicationRef } from '@angular/core';

import { Component, Inject, PLATFORM_ID, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import Scrollbar from 'smooth-scrollbar';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Section2Component } from "./section2/section2.component";
import { Section1Component } from "./section1/section1.component";

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [Section2Component, Section1Component],
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('scrollContainer', { static: true })
  scrollContainer!: ElementRef<HTMLDivElement>;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appRef: ApplicationRef
  ) { }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Hydration-safe
    this.appRef.isStable.subscribe((isStable) => {
      if (isStable) {
        this.setupGsapScroll();
      }
    });
  }

  setupGsapScroll(): void {
    const scrollBar = Scrollbar.init(this.scrollContainer.nativeElement, {
      damping: 0.07,
      alwaysShowTracks: false,
      delegateTo: document,
    });

    ScrollTrigger.scrollerProxy(this.scrollContainer.nativeElement, {
      scrollTop(value?: number): number {
        if (value !== undefined) {
          scrollBar.scrollTop = value;
        }
        return scrollBar.scrollTop;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    scrollBar.addListener(ScrollTrigger.update);
    ScrollTrigger.defaults({ scroller: this.scrollContainer.nativeElement });

    const sections = this.scrollContainer.nativeElement.querySelectorAll('[data-bgcolor]') as NodeListOf<HTMLElement>;

    sections.forEach((section, i) => {
      const prev = i === 0 ? null : sections[i - 1];

      ScrollTrigger.create({
        trigger: section,
        start: 'top 50%',
        onEnter: () => {
          gsap.to(this.scrollContainer.nativeElement, {
            backgroundColor: section.dataset['bgcolor'],
            color: section.dataset['textcolor'],
            overwrite: 'auto',
            duration: 0.5,
          });
        },
        onLeaveBack: () => {
          if (prev) {
            gsap.to(this.scrollContainer.nativeElement, {
              backgroundColor: prev.dataset['bgcolor'],
              color: prev.dataset['textcolor'],
              overwrite: 'auto',
              duration: 0.5,
            });
          }
        },
      });
    });
  }
}
