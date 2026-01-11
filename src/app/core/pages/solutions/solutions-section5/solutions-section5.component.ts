import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ApplicationRef, ChangeDetectorRef, Component, ElementRef, Inject, NgZone, PLATFORM_ID, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Draggable } from "gsap/all";
import InertiaPlugin from "gsap/InertiaPlugin";

import SplitText from "gsap/SplitText";

import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../shared/services/language.service';


gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, InertiaPlugin);
interface Integration {
    titleKey: string;
    textKey: string;
}

@Component({
    selector: 'app-solutions-section5',
    imports: [CommonModule, TranslatePipe],
    templateUrl: './solutions-section5.component.html',
    styleUrl: './solutions-section5.component.scss'
})
export class SolutionsSection5Component {
    section5TopSplit: any;
    @ViewChild('swiperEl') swiperEl!: ElementRef<HTMLDivElement>;
    swiperInstance: Swiper | null = null;
    constructor(
        @Inject(PLATFORM_ID) private pid: Object,
        private ngZone: NgZone
    ) { }

    Integrations: Integration[] = [
        {
            titleKey: 'SOLUTIONS.SECTION5.INTEGRATIONS.ITEM1.TITLE',
            textKey: 'SOLUTIONS.SECTION5.INTEGRATIONS.ITEM1.TEXT',
        },
        {
            titleKey: 'SOLUTIONS.SECTION5.INTEGRATIONS.ITEM2.TITLE',
            textKey: 'SOLUTIONS.SECTION5.INTEGRATIONS.ITEM2.TEXT',
        },
        {
            titleKey: 'SOLUTIONS.SECTION5.INTEGRATIONS.ITEM3.TITLE',
            textKey: 'SOLUTIONS.SECTION5.INTEGRATIONS.ITEM3.TEXT',
        },
        {
            titleKey: 'SOLUTIONS.SECTION5.INTEGRATIONS.ITEM4.TITLE',
            textKey: 'SOLUTIONS.SECTION5.INTEGRATIONS.ITEM4.TEXT',
        }
    ];
    groupedIntegrations: Integration[][] = [];



    ngOnInit() {
        this.groupIntegrations();
    }

    // private groupIntegrations() {
    //     if (!this.Integrations.length) return;

    //     const result: Integration[][] = [];

    //     result.push([this.Integrations[0]]);
    //     for (let i = 1; i < this.Integrations.length; i += 2) {
    //         const group: Integration[] = [this.Integrations[i]];
    //         // if (i + 1 < this.Integrations.length) {
    //         //     group.push(this.Integrations[i + 1]);
    //         // }
    //         result.push(group);
    //     }

    //     this.groupedIntegrations = result;
    // }
    private groupIntegrations() {
        if (!this.Integrations?.length) return;

        const result: Integration[][] = [];

        for (let i = 0; i < this.Integrations.length; i += 2) {
            result.push(this.Integrations.slice(i, i + 2)); // [item1,item2] ثم [item3,item4]...
        }

        this.groupedIntegrations = result;
    }

    async ngAfterViewInit() {
        if (!isPlatformBrowser(this.pid)) return;
        if (typeof window === 'undefined') return;

        this.ngZone.runOutsideAngular(() => {
            requestAnimationFrame(() => {
                setTimeout(() => {
                    document.fonts.ready.then(() => {
                        let mm = gsap.matchMedia();
                        const section5Top = document.querySelector('#section5-top') as HTMLElement;

                        mm.add({
                            desktop: '(min-width: 768px)',
                            mobile: '(max-width: 767px)',
                        }, (context) => {
                            let { desktop, mobile } = context.conditions as any;

                            this.section5TopSplit = new SplitText(section5Top, { type: "words" });

                            ScrollTrigger.create({
                                trigger: '#solutionsSection5',
                                start: 'top top',
                                end: mobile ? 'top 95%' : "150% bottom",
                                pin: true,
                                pinType: 'transform',
                                // markers: true,
                                id: 'pinsection',
                                anticipatePin: 1,
                                onLeave: () => { if (mobile) tl.progress(1); },
                                // onEnterBack: () => { if (mobile) tl.progress(0); },
                            });

                            const tl = gsap.timeline({
                                defaults: { ease: "power3.out" }, scrollTrigger: {
                                    trigger: "#solutionsSection5",
                                    start: 'top top',
                                    end: "150% bottom",
                                    // markers: true,
                                }
                            });

                            tl.fromTo(this.section5TopSplit.words,
                                { opacity: 0, visibility: "visible" },
                                {
                                    opacity: 1,
                                    duration: 0.2,
                                    ease: "sine.out",
                                    stagger: 0.02,
                                    onStart: () => { gsap.set(section5Top, { opacity: 1, visibility: "visible" }) },
                                }
                            );

                            tl.fromTo("#section5-bottom", { opacity: 0, visibility: "hidden" }, { opacity: 1, visibility: "visible", duration: 0.2 });

                            return () => {
                                if (this.section5TopSplit) this.section5TopSplit.revert();
                            };
                        });

                        // Swiper initialization (can remain outside matchMedia or be inside if behavior differs significantly, but here it looks consistent)
                        // However, to be safe with re-init on resize if needed, user didn't ask for responsive swiper logic change, just matchMedia for GSAP.
                        // We will keep Swiper init logic simple around matchMedia or inside if we want it strictly controlled.
                        // Given previous patterns, Swiper was initialized once. Let's keep it here but ensure idempotency is handled if we ever moved it.
                        if (this.swiperInstance) {
                            this.swiperInstance.destroy(true, true);
                            this.swiperInstance = null;
                        }
                        this.swiperInstance = new Swiper(this.swiperEl.nativeElement, {
                            modules: [Navigation, Pagination, Autoplay],
                            direction: 'vertical',
                            slidesPerView: 1,
                            slidesPerGroup: 1,
                            loop: true,
                            navigation: {
                                prevEl: "#arrowUP",
                                nextEl: "#arrowDown"
                            },
                            autoplay: {
                                delay: 2500,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true
                            },
                        });

                    });
                }, 0);
            });
        });
    }
}
