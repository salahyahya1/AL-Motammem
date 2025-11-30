import {
  AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Inject, Input, OnDestroy,
  PLATFORM_ID, ViewChild, WritableSignal, signal
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { fromEvent, Subscription, Subject, takeUntil } from 'rxjs';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { SectionItem, SectionsRegistryService } from '../../shared/services/sections-registry.service';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';


gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

@Component({
  selector: 'app-section-indicator',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
<div #indicator
  [class.opacity-100]="shouldShow()"
  [class.pointer-events-auto]="shouldShow()"
  [class.opacity-100]="!shouldShow()"
  [class.pointer-events-none]="!shouldShow()"
  class="indicator transition-opacity duration-500 ease-in-out fixed rtl:top-1/2 ltr:top-[49%] rtl:right-10 rtl:-translate-y-1/2 ltr:left-10 ltr:-translate-y-1/2 z-[1000] flex flex-col items-center">

  <div class="relative h-[420px] w-[2px] bg-[#F5A605]">
    <ng-container *ngFor="let s of sectionsList; let i = index; trackBy: trackById">
      <div class="group absolute left-1/2 -translate-x-1/2 cursor-pointer"
           [attr.id]="'dot-' + (s.wholeSectionId || s.id)"
           [ngStyle]="{ top: (i * 100 / Math.max(1, sectionsList.length - 1)) + '%' }"
           (click)="scrollToSection(s.id)">
        <div class="absolute inset-[-16px] w-10 h-10 cursor-pointer"></div>
        <div class="dot w-2 h-2 bg-[#fca61f] rounded-full transition-transform duration-300 group-hover:scale-[2] group-active:scale-[1.5]"></div>
        <div class="dot-label absolute rtl:right-6 ltr:left-6 top-1/2 -translate-y-1/2 text-[var(--primary)] text-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 whitespace-nowrap">
              {{ s.labelKey | translate }} 
        </div>
      </div>
    </ng-container>
  </div>
</div>
  `,
  styleUrls: ['./section-indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionIndicatorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('indicator', { static: false }) indicator!: ElementRef<HTMLElement>;

  @Input() sections: SectionItem[] | null = null;

  @Input() forceEnable: boolean | undefined;

  @Input() hideBelow = 700;
  @Input() start = 'top center';
  @Input() end = 'bottom center';
  @Input() showLabels = true;

  public Math = Math;

  private isBrowser: boolean;
  private resizeSub?: Subscription;
  private triggers: ScrollTrigger[] = [];
  private destroy$ = new Subject<void>();

  private registrySections: SectionItem[] = [];
  private registryEnabled = false;

  activeId: WritableSignal<string | null> = signal(null);
  visible: WritableSignal<boolean> = signal(true);

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private registry: SectionsRegistryService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  get sectionsList(): SectionItem[] {
    return (this.sections && this.sections.length) ? this.sections : this.registrySections;
  }

  shouldShow(): boolean {
    if (!this.isBrowser) return true;
    const widthOK = window.innerWidth >= this.hideBelow;
    const hasSections = this.sectionsList.length > 0;

    const enabled = (typeof this.forceEnable === 'boolean') ? this.forceEnable : this.registryEnabled;

    return widthOK && hasSections && enabled;
  }

  trackById = (_: number, s: SectionItem) => s.wholeSectionId || s.id;

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    const indicator = this.indicator?.nativeElement;
    if (!indicator) return;

    this.registry.sections$
      .pipe(takeUntil(this.destroy$))
      .subscribe((list: any) => {
        this.registrySections = list ?? [];
        this.rebuild();
      });

    this.registry.enabled$
      .pipe(takeUntil(this.destroy$))
      .subscribe((on: any) => {
        this.registryEnabled = on;
        this.rebuild();
      });

    this.applyVisibility();
    this.runIntroAnimation(indicator);
    this.resizeSub = fromEvent(window, 'resize').subscribe(() => {
      this.applyVisibility();
      this.runIntroAnimation(indicator, true);
      this.rebuild();
    });

    this.rebuild();
  }

  private applyVisibility() {
    if (!this.isBrowser) return;
    this.visible.set(window.innerWidth >= this.hideBelow);
  }

  private runIntroAnimation(indicator: HTMLElement, isResize = false) {
    if (!this.isBrowser) return;

    const canAnimate = this.shouldShow();
    if (!canAnimate) {
      indicator.style.removeProperty('transform');
      indicator.style.removeProperty('opacity');
      return;
    }

    const needIntro = !isResize || parseFloat(getComputedStyle(indicator).opacity || '0') < 0.5;
    if (needIntro) {
      const offscreenPx = Math.min(200, Math.max(80, window.innerWidth * 0.06));
      gsap.set(indicator, { x: offscreenPx, opacity: 0, willChange: 'transform,opacity' });
      gsap.to(indicator, {
        x: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out',
        clearProps: 'transform',
        onComplete: () => { indicator.style.willChange = ''; }
      });
    }
  }

  private rebuild() {
    const indicator = this.indicator?.nativeElement;
    if (!indicator) return;

    if (!this.shouldShow()) {
      this.cleanTriggers();
      indicator.style.opacity = '0';
      return;
    }

    indicator.style.opacity = '1';

    this.waitForPanelsAndDots().then(() => {
      this.buildScrollTriggers();
      this.updateActiveFromViewport();

      ScrollTrigger.create({
        trigger: document.documentElement,
        start: 0,
        end: 'max',
        onUpdate: () => this.updateActiveFromViewport(),
      });

      ScrollTrigger.addEventListener('refresh', () => this.updateActiveFromViewport());
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });
  }

  private waitForPanelsAndDots(): Promise<void> {
    return new Promise(resolve => {
      const ready = () => {
        const panels = document.querySelectorAll<HTMLElement>('.panel');
        if (!panels.length) return false;
        return this.sectionsList.every(s => !!document.getElementById('dot-' + (s.wholeSectionId || s.id)));
      };
      const loop = () => (ready() ? resolve() : setTimeout(loop, 50));
      loop();
    });
  }

  private buildScrollTriggers() {
    this.cleanTriggers();

    for (const s of this.sectionsList) {
      const id = s.targetId || s.id;
      const el = document.getElementById(id);
      if (!el) continue;

      const dotWrapper = document.getElementById('dot-' + (s.wholeSectionId || s.id));
      const dot = dotWrapper?.querySelector('.dot') as HTMLElement | null;
      const label = dotWrapper?.querySelector('.dot-label') as HTMLElement | null;

      const setActive = (on: boolean) => {
        if (on) this.clearAllDots();
        if (on) {
          this.activeId.set(id);
          dot?.classList.add('active');
          label?.classList.add('active', 'opacity-100');
          label?.classList.remove('invisible');
        } else {
          if (this.activeId() === id) this.activeId.set(null);
          dot?.classList.remove('active');
          label?.classList.remove('active', 'opacity-100');
          label?.classList.add('invisible');
        }
      };

      const t = ScrollTrigger.create({
        trigger: el,
        start: this.start,
        end: this.end,
        onEnter: () => setActive(true),
        onEnterBack: () => setActive(true),
        onLeave: () => setActive(false),
        onLeaveBack: () => setActive(false),
      });

      this.triggers.push(t);
    }
  }

  private updateActiveFromViewport() {
    const items = this.sectionsList
      .map(s => {
        const id = s.targetId || s.id;
        const el = document.getElementById(id);
        if (!el) return null;

        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const dist = Math.abs(center - window.innerHeight / 2);

        const dotWrapper = document.getElementById('dot-' + (s.wholeSectionId || s.id));
        const dot = dotWrapper?.querySelector('.dot') as HTMLElement | null;
        const label = dotWrapper?.querySelector('.dot-label') as HTMLElement | null;

        return { id, dist, dot, label };
      })
      .filter(Boolean) as Array<{ id: string; dist: number; dot: HTMLElement | null; label: HTMLElement | null }>;

    if (!items.length) return;

    items.sort((a, b) => a.dist - b.dist);
    const current = items[0];

    this.clearAllDots();
    current.dot?.classList.add('active');
    current.label?.classList.add('active');
    current.label?.classList.remove('invisible');
    this.activeId.set(current.id);
  }

  private clearAllDots() {
    document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
    document.querySelectorAll('.dot-label').forEach(l => {
      l.classList.remove('active', 'opacity-100');
      l.classList.add('invisible');
    });
  }

  scrollToSection(sectionId: string) {
    const s = this.sectionsList.find(x => x.id === sectionId || x.targetId === sectionId);
    if (!s) return;

    const id = s.targetId || s.id;
    const target = document.getElementById(id);
    if (!target) return;

    const offset = target.offsetHeight * 0.01;

    const smoother = (window as any).ScrollSmoother?.get?.();
    if (smoother) {
      smoother.scrollTo(target, true, 'top+=' + offset);
    } else {
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: target, offsetY: -offset },
        ease: 'power2.out'
      } as any);
    }
  }

  private cleanTriggers() {
    this.triggers.forEach(t => t.kill());
    this.triggers = [];
  }

  ngOnDestroy(): void {
    this.destroy$.next(); this.destroy$.complete();
    this.cleanTriggers();
    this.resizeSub?.unsubscribe();
  }
}
