import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Inject, NgZone, PLATFORM_ID, ViewChild } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Draggable } from "gsap/all";
import InertiaPlugin from "gsap/InertiaPlugin";

import SplitText from "gsap/SplitText";


import { RouterLink } from '@angular/router';
import { NavbarThemeService } from '../../../components/navbar/navbar-theme.service';
import { SectionsRegistryService } from '../../../shared/services/sections-registry.service';


gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, InertiaPlugin);

@Component({
  selector: 'app-blog-veiw',
  imports: [CommonModule],
  templateUrl: './blog-veiw.component.html',
  styleUrl: './blog-veiw.component.scss'
})
export class BlogVeiwComponent {
  swipeConfig: any;

  isBrowser = false;


  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private navTheme: NavbarThemeService,
    private sectionsRegistry: SectionsRegistryService
  ) {
  }



  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.navTheme.setColor('var(--primary)');

  }

  ngOnDestroy(): void {
    this.sectionsRegistry.clear();
    this.sectionsRegistry.disable();
    if (this.isBrowser) {
      ScrollTrigger.getAll().forEach(t => t.kill());
    }
  }
}
