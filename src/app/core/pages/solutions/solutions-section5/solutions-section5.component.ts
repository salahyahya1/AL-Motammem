import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
    Component,
    ElementRef,
    Inject,
    NgZone,
    PLATFORM_ID,
    ViewChild,
} from '@angular/core';

import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../shared/services/language.service';
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
                }, 200);
            });
        });
    }
}
