import {
  Component,
  Inject,
  PLATFORM_ID,
  AfterViewInit,
  ViewChild,
  ElementRef,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollSmoother from 'gsap/ScrollSmoother';
import { Section1Component } from './section1/section1.component';
import { Section2Component } from './section2/section2.component';
import { Section4Component } from './section4/section4.component';
import { Section5Component } from './section5/section5.component';
import { Section6Component } from "./section6/section6.component";
import { Section7Component } from "./section7/section7.component";
import { Section8Component } from "./section8/section8.component";
import { Section9Component } from './section9/section9.component';
import { Section10Component } from "./section10/section10.component";
import { BehaviorSubject } from 'rxjs';
import { Section3Component } from "./section3/section3.component";
import { RouterLink } from "@angular/router";
import { NavbarThemeService } from '../../components/navbar/navbar-theme.service';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { SectionIndicatorComponent } from "../../components/section-indicator/section-indicator.component";
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import { SectionItem, SectionsRegistryService } from '../../services/sections-registry.service';
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Section1Component, Section2Component, Section4Component, Section5Component, Section6Component, Section7Component, Section8Component, Section10Component, Section3Component, RouterLink, NavbarComponent, SectionIndicatorComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit {
  private visibilitySubject = new BehaviorSubject<'visible' | 'invisible'>('visible');
  visibility$ = this.visibilitySubject.asObservable();
  visibilityState: 'visible' | 'invisible' = 'visible';
  private smoother!: any;

  sections = [
    { id: 'section1', label: 'section1', wholeSectionId: "section1" },
    { id: 'section2', label: 'section2', wholeSectionId: "section2" },
    { id: 'section3', label: 'section3', wholeSectionId: "section3" },
    { id: 'section4', label: 'section4', wholeSectionId: "section4" },
    { id: 'section5', label: 'section5', wholeSectionId: "section5" },
    { id: 'section10', label: 'section10', wholeSectionId: "section10" },
    { id: 'section6', label: 'section6', wholeSectionId: "section6" },
    { id: 'section7', label: 'section7', wholeSectionId: "section7" },
    { id: 'section8', label: 'section8', wholeSectionId: "section8" },
  ];
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
        const sections: SectionItem[] = [
          { id: 'section1', label: 'عن المتمم', wholeSectionId: 'section1' },
          { id: 'section2', label: 'حقائق سريعة', wholeSectionId: 'section2' },
          { id: 'section3', label: 'لماذا المتمم؟', wholeSectionId: 'section3' },
          { id: 'section4', label: 'التطبيقات', wholeSectionId: 'section4' },
          { id: 'section5', label: 'شهادات العملاء', wholeSectionId: 'section5' },
          { id: 'section6', label: 'التكاملات', wholeSectionId: 'section6' },
          { id: 'section7', label: 'الخطط', wholeSectionId: 'section7' },
          { id: 'section8', label: 'تواصل معنا', wholeSectionId: 'section8' },
        ];
        this.sectionsRegistry.set(sections);
        this.sectionsRegistry.enable();
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
