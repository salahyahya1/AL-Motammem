
import {
  Component,
  Inject,
  PLATFORM_ID,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { BehaviorSubject } from 'rxjs';
import { NavbarThemeService } from '../../components/navbar/navbar-theme.service';
import { SectionsRegistryService } from "../../shared/services/sections-registry.service";
import ScrollToPlugin from 'gsap/ScrollToPlugin';

import { AboutSection1Component } from "./about-section1/about-section1.component";
import { AboutSection2Component } from "./about-section2/about-section2.component";
import { AboutSection3Component } from "./about-section3/about-section3.component";
import { AboutSection4Component } from "./about-section4/about-section4.component";
import { AboutSection5Component } from "./about-section5/about-section5.component";
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

@Component({
  selector: 'app-about',
  imports: [AboutSection1Component, AboutSection2Component, AboutSection3Component, CommonModule, AboutSection4Component, AboutSection5Component],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {

  private visibilitySubject = new BehaviorSubject<'visible' | 'invisible'>('visible');
  visibility$ = this.visibilitySubject.asObservable();
  visibilityState: 'visible' | 'invisible' = 'visible';



  menuOpen = false;
  isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private navTheme: NavbarThemeService,
    private sectionsRegistry: SectionsRegistryService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
  private ctx3?: gsap.Context;
  private onResizeRefresh = () => ScrollTrigger.refresh();
  private onResizeCD = () => {
    this.ngZone.run(() => this.cdr.detectChanges());
  };
  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.ctx3 = gsap.context(() => {
          this.observeSections();
          window.addEventListener('resize', this.onResizeCD);
          window.addEventListener('resize', this.onResizeRefresh);

          ScrollTrigger.refresh();
        });
      }, 150);
    });
  }
  private observeSections() {
    const sections = gsap.utils.toArray<HTMLElement>('.panel');

    sections.forEach((section) => {
      const bgColor = section.dataset['bgcolor'] || 'var(--white)';
      const textColor = section.dataset['textcolor'] || 'var(--primary)';

      ScrollTrigger.create({
        trigger: section,
        start: 'top 50%',
        end: 'bottom 50%',
        // onEnter: () => this.updateNavbarColors(textColor),
        // onEnterBack: () => this.updateNavbarColors(textColor),
        onEnter: () => {
          this.navTheme.setColor(textColor);
          this.navTheme.setBg(bgColor);
        },
        onEnterBack: () => {
          this.navTheme.setColor(textColor);
          this.navTheme.setBg(bgColor);
        },
      });
    });
  }

  private updateNavbarColors(textColor: string) {
    this.navTheme.setColor(textColor);
  }
  ngOnDestroy(): void {
    this.sectionsRegistry.clear();
    this.sectionsRegistry.disable();
    this.ctx3?.revert();

    if (this.isBrowser) {
      window.removeEventListener('resize', this.onResizeCD);
      window.removeEventListener('resize', this.onResizeRefresh);
    }
  }
}
