import { ChangeDetectorRef, Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { FooterComponent } from "../../components/footer/footer.component";
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollSmoother from 'gsap/ScrollSmoother';
import { NavbarThemeService } from '../../components/navbar/navbar-theme.service';
import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { SectionIndicatorComponent } from "../../components/section-indicator/section-indicator.component";
import { SectionsRegistryService } from '../../services/sections-registry.service';
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, SectionIndicatorComponent, AsyncPipe],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  isBrowser: boolean;
  private smoother!: any;
  sections$: any;



  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private navTheme: NavbarThemeService,
    private sectionsRegistry: SectionsRegistryService,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }


  ngAfterViewInit(): void {
    this.sections$ = this.sectionsRegistry.sections$;
    if (!this.isBrowser) return;

    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.initSmoothScroll();
      }, 0);
    });
  }

  private initSmoothScroll() {
    // ✅ ScrollSmoother شغال بدون أي تأثيرات إضافية
    if ((window as any).ScrollSmoother?.get?.()) {
      this.smoother = (window as any).ScrollSmoother.get();
      return; // ✅ لو السموذر شغال فعلاً، ما تعيديش إنشاءه
    }
    this.smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.2,
      normalizeScroll: true,
      effects: false,
      ignoreMobileResize: true,
      smoothTouch: 0.1,
    });

    requestAnimationFrame(() => ScrollTrigger.refresh());
    ScrollTrigger.config({ ignoreMobileResize: true });
  }
}
