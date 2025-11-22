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
import { SectionsRegistryService } from "../../services/sections-registry.service";
import ScrollToPlugin from 'gsap/ScrollToPlugin';


import { SolutionsSection1Component } from "./solutions-section1/solutions-section1.component";
import { SolutionsSection2Component } from "./solutions-section2/solutions-section2.component";
import { SolutionsSection3Component } from "./solutions-section3/solutions-section3.component";
import { SolutionsSection4Component } from "./solutions-section4/solutions-section4.component";
import { SolutionsSection5Component } from "./solutions-section5/solutions-section5.component";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

@Component({
  selector: 'app-solutions',
  imports: [SolutionsSection1Component, SolutionsSection2Component, SolutionsSection3Component, SolutionsSection4Component, SolutionsSection5Component],
  templateUrl: './solutions.component.html',
  styleUrl: './solutions.component.scss'
})
export class SolutionsComponent {

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

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.observeSections();
        window.addEventListener('resize', () => {
          this.ngZone.run(() => {
            this.cdr.detectChanges();
          });
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
        onEnter: () => this.updateNavbarColors(textColor),
        onEnterBack: () => this.updateNavbarColors(textColor),
      });
    });
  }

  private updateNavbarColors(textColor: string) {
    this.navTheme.setColor(textColor);
  }
  ngOnDestroy(): void {
    this.sectionsRegistry.clear();
    this.sectionsRegistry.disable();
  }
}
