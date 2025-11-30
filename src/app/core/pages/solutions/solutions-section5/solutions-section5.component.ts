import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ApplicationRef, ChangeDetectorRef, Component, ElementRef, Inject, NgZone, PLATFORM_ID, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Draggable from "gsap/Draggable";
import InertiaPlugin from "gsap/InertiaPlugin";

import SplitText from "gsap/SplitText";

import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../shared/services/language.service';


gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, InertiaPlugin);
interface Sector {
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

    sectors: Sector[] = [
        {
            titleKey: 'SOLUTIONS.SECTION5.CORE_MODULES.FINANCE.TITLE',
            textKey: 'SOLUTIONS.SECTION5.CORE_MODULES.FINANCE.DESC',
        },
        {
            titleKey: 'SOLUTIONS.SECTION5.CORE_MODULES.INVENTORY.TITLE',
            textKey: 'SOLUTIONS.SECTION5.CORE_MODULES.INVENTORY.DESC',
        },
        {
            titleKey: 'SOLUTIONS.SECTION5.CORE_MODULES.PURCHASING.TITLE',
            textKey: 'SOLUTIONS.SECTION5.CORE_MODULES.PURCHASING.DESC',
        },
        {
            titleKey: 'SOLUTIONS.SECTION5.CORE_MODULES.SALES.TITLE',
            textKey: 'SOLUTIONS.SECTION5.CORE_MODULES.SALES.DESC',
        },
        {
            titleKey: 'SOLUTIONS.SECTION5.CORE_MODULES.HR.TITLE',
            textKey: 'SOLUTIONS.SECTION5.CORE_MODULES.HR.DESC',
        },
        {
            titleKey: 'SOLUTIONS.SECTION5.CORE_MODULES.PROJECTS.TITLE',
            textKey: 'SOLUTIONS.SECTION5.CORE_MODULES.PROJECTS.DESC',
        },
        {
            titleKey: 'SOLUTIONS.SECTION5.CORE_MODULES.REPORTS.TITLE',
            textKey: 'SOLUTIONS.SECTION5.CORE_MODULES.REPORTS.DESC',
        },
    ];
    groupedSectors: Sector[][] = [];



    ngOnInit() {
        this.groupSectors();
    }

    private groupSectors() {
        if (!this.sectors.length) return;

        const result: Sector[][] = [];

        result.push([this.sectors[0]]);
        for (let i = 1; i < this.sectors.length; i += 2) {
            const group: Sector[] = [this.sectors[i]];
            if (i + 1 < this.sectors.length) {
                group.push(this.sectors[i + 1]);
            }
            result.push(group);
        }

        this.groupedSectors = result;
    }

    async ngAfterViewInit() {
        if (!isPlatformBrowser(this.pid)) return;
        if (typeof window === 'undefined') return;

        this.ngZone.runOutsideAngular(() => {
            requestAnimationFrame(() => {
                setTimeout(() => {
                    document.fonts.ready.then(() => {

                        ScrollTrigger.create({
                            trigger: '#solutionsSection5',
                            start: 'top top',
                            end: "150% bottom",
                            pin: true,
                            pinType: 'transform',
                            // markers: true,
                            id: 'pinsection',
                            anticipatePin: 1,
                        });


                        const section5Top = document.querySelector('#section5-top') as HTMLElement;
                        this.section5TopSplit = new SplitText(section5Top, { type: "words" });
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
                                duration: 0.4,
                                ease: "sine.out",
                                stagger: 0.02,
                                onStart: () => { gsap.set(section5Top, { opacity: 1, visibility: "visible" }) },
                            }
                        );
                        tl.fromTo("#section5-bottom", { opacity: 0, visibility: "hidden" }, { opacity: 1, visibility: "visible", duration: 0.8 });
                        if (this.swiperInstance) {
                            this.swiperInstance.destroy(true, true);
                            this.swiperInstance = null;
                        }
                        this.swiperInstance = new Swiper(this.swiperEl.nativeElement, {
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
