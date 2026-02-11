import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { FaqAccordionRegistryService } from '../../services/faq-accordion-registry.service';

@Component({
  selector: 'app-accordion',
  standalone: true,
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.scss',
  imports: [NgClass],
})
export class AccordionComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input({ required: true }) title!: string;
  @Output() deletefaq = new EventEmitter<number>();
  @Output() editfaq = new EventEmitter<number>();
  /** لو عندك أكتر من مجموعة Accordions في نفس الصفحة */
  @Input() groupId: string = 'default';

  @Input() singleOpen = true;

  @Input() startOpen = false;
  /** When set (e.g. "faq-123"), this accordion registers with FaqAccordionRegistryService for search-driven open. */
  @Input() fragmentId?: string;
  @Input() disabled = false;
  @Input() duration = 0.35;
  @Input() isDeleteable = false;
  @Input() isEditable = false;

  isOpen = false;

  @ViewChild('panel', { static: true }) panelRef!: ElementRef<HTMLElement>;
  @ViewChild('inner', { static: true }) innerRef!: ElementRef<HTMLElement>;

  private gsap: any = null;
  private browser = false;
  private viewReady = false;

  // ====== static registry (هنا الدمج الحقيقي) ======
  private static uid = 0;
  private id = `acc_${++AccordionComponent.uid}`;
  private static groups = new Map<string, Map<string, AccordionComponent>>();

  private register() {
    const g = AccordionComponent.groups.get(this.groupId) ?? new Map();
    g.set(this.id, this);
    AccordionComponent.groups.set(this.groupId, g);
  }

  private unregister() {
    const g = AccordionComponent.groups.get(this.groupId);
    if (!g) return;
    g.delete(this.id);
    if (g.size === 0) AccordionComponent.groups.delete(this.groupId);
  }

  private closeOthersInGroup() {
    if (!this.singleOpen) return;
    const g = AccordionComponent.groups.get(this.groupId);
    if (!g) return;

    g.forEach((acc) => {
      if (acc !== this) acc.close();
    });
  }
  // ================================================

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private faqRegistry: FaqAccordionRegistryService
  ) {
    this.browser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.register();
    if (this.fragmentId) {
      this.faqRegistry.register(this.fragmentId, () => this.open());
    }
    this.isOpen = this.startOpen;
  }

  async ngAfterViewInit() {
    this.viewReady = true;

    if (this.browser) {
      const mod = await import('gsap');
      this.gsap = mod.gsap;
    }

    // init styles
    this.applyInstantState();

    // لو startOpen=true في واحد، اقفل الباقي تلقائياً
    if (this.isOpen) {
      this.closeOthersInGroup();
      // وتأكّد إنه متفتح بسموز (اختياري)
      this.open(true);
    }
  }

  ngOnDestroy(): void {
    if (this.fragmentId) {
      this.faqRegistry.unregister(this.fragmentId);
    }
    this.unregister();
  }

  toggle() {
    if (this.disabled) return;
    this.isOpen ? this.close() : this.open();
  }

  /** open with GSAP */
  public open(silent = false) {
    if (this.disabled) return;

    this.isOpen = true;
    if (!silent) this.closeOthersInGroup();

    if (!this.viewReady) return;

    const panel = this.panelRef.nativeElement;
    const inner = this.innerRef.nativeElement;

    if (!this.gsap) {
      panel.style.height = 'auto';
      inner.style.opacity = '1';
      inner.style.transform = 'translateY(0px)';
      return;
    }

    this.gsap.killTweensOf([panel, inner]);

    this.gsap.set(panel, { height: 'auto' });
    const autoH = panel.getBoundingClientRect().height;
    this.gsap.set(panel, { height: 0 });

    this.gsap.to(panel, {
      height: autoH,
      duration: this.duration,
      ease: 'power2.out',
      onComplete: () => this.gsap.set(panel, { height: 'auto' }),
    });

    this.gsap.to(inner, {
      opacity: 1,
      y: 0,
      duration: this.duration,
      ease: 'power2.out',
    });
  }

  /** close with GSAP */
  public close() {
    this.isOpen = false;
    if (!this.viewReady) return;

    const panel = this.panelRef.nativeElement;
    const inner = this.innerRef.nativeElement;

    if (!this.gsap) {
      panel.style.height = '0px';
      inner.style.opacity = '0';
      inner.style.transform = 'translateY(-6px)';
      return;
    }

    this.gsap.killTweensOf([panel, inner]);

    this.gsap.to(panel, {
      height: 0,
      duration: this.duration,
      ease: 'power2.inOut',
    });

    this.gsap.to(inner, {
      opacity: 0,
      y: -6,
      duration: this.duration * 0.9,
      ease: 'power2.inOut',
    });
  }

  private applyInstantState() {
    const panel = this.panelRef.nativeElement;
    const inner = this.innerRef.nativeElement;

    if (!this.isOpen) {
      panel.style.height = '0px';
      inner.style.opacity = '0';
      // inner.style.transform = 'translateY(-6px)';
    } else {
      panel.style.height = 'auto';
      inner.style.opacity = '1';
      // inner.style.transform = 'translateY(0px)';
    }
  }
  delete() {
    this.deletefaq.emit();
    // console.log(this.id);

  }
  Edit() {
    this.editfaq.emit();
    // console.log(this.id);

  }
}
