import {
  Component,
  Inject,
  PLATFORM_ID,
  NgZone,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { BehaviorSubject } from 'rxjs';
import { NavbarThemeService } from '../../components/navbar/navbar-theme.service';
import { SectionsRegistryService } from "../../shared/services/sections-registry.service";
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import { TranslatePipe } from '@ngx-translate/core';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

@Component({
  selector: 'app-contact-us',
  imports: [TranslatePipe],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent implements OnDestroy {
  private visibilitySubject = new BehaviorSubject<'visible' | 'invisible'>('visible');
  visibility$ = this.visibilitySubject.asObservable();
  visibilityState: 'visible' | 'invisible' = 'visible';

  @ViewChild('bgVideo', { static: false })
  bgVideo?: ElementRef<HTMLVideoElement>;

  isBrowser: boolean;
  private ctx6?: gsap.Context;
  private onResize = () => ScrollTrigger.refresh();

  private onCanPlay = () => this.safePlayBgVideo();

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

    this.setupBgVideoAutoplayFix();

    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.ctx6 = gsap.context(() => {
          this.navTheme.setColor('var(--white)');
          this.navTheme.setBg('#0c81ff');
        });

        window.addEventListener('resize', this.onResize);
        ScrollTrigger.refresh();
      }, 150);
    });
  }

  private setupBgVideoAutoplayFix() {
    const v = this.bgVideo?.nativeElement;
    if (!v) return;

    // شروط autoplay خصوصًا iOS/Safari
    v.muted = true;
    v.playsInline = true;
    v.autoplay = true;
    v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', '');

    // حاول تشغله بعد ما يبقى جاهز
    v.addEventListener('canplay', this.onCanPlay, { once: true });

    v.load();
    this.safePlayBgVideo();
  }

  private safePlayBgVideo() {
    const v = this.bgVideo?.nativeElement;
    if (!v) return;

    const p = v.play();
    if (p) {
      p.catch((err) => {
        // لو autoplay اتمنع على جهاز معين
        console.warn('BG video autoplay blocked/failed:', err);
      });
    }
  }

  ngOnDestroy(): void {
    this.sectionsRegistry.clear();
    this.sectionsRegistry.disable();

    this.ctx6?.revert();

    if (this.isBrowser) {
      window.removeEventListener('resize', this.onResize);

      const v: any = this.bgVideo?.nativeElement;
      if (v && typeof v.pause === 'function') {
        v.pause();
        v.removeEventListener?.('canplay', this.onCanPlay);
      }
    }
  }
}
