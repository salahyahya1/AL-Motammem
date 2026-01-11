import {
  Component,
  Inject,
  PLATFORM_ID,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { BehaviorSubject } from 'rxjs';
import { NavbarThemeService } from '../../components/navbar/navbar-theme.service';
import { SectionsRegistryService } from "../../shared/services/sections-registry.service";
import ScrollToPlugin from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
@Component({
  selector: 'app-contact-us',
  imports: [],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent {
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

  private ctx6?: gsap.Context;
  private onResize = () => ScrollTrigger.refresh();
  ngAfterViewInit(): void {
    if (!this.isBrowser) return;


    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.ctx6 = gsap.context(() => {
          this.navTheme.setColor('var(--white)');
          // window.addEventListener('resize', () => {
          //   this.ngZone.run(() => {
          //     this.cdr.detectChanges();
          //   });
          // });
        });
        window.addEventListener('resize', this.onResize);
        ScrollTrigger.refresh();
      }, 150);
    });
  }

  ngOnDestroy(): void {
    this.sectionsRegistry.clear();
    this.sectionsRegistry.disable();

    // if (this.isBrowser) {
    //   ScrollTrigger.getAll().forEach(t => t.kill());
    // }
    this.ctx6?.revert();
    if (this.isBrowser) {
      window.removeEventListener('resize', this.onResize);
    }
  }
}
