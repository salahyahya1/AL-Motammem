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
import { RemiveRoleAriaService } from '../../../shared/services/removeRoleAria';

gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, InertiaPlugin);

@Component({
    selector: 'app-solutions-section4',
    standalone: true,
    imports: [CommonModule, TranslatePipe],
    templateUrl: './solutions-section4.component.html',
    styleUrl: './solutions-section4.component.scss'
})
export class SolutionsSection4Component {
    solutionsSection4DetailsSplit: any;
    constructor(
        @Inject(PLATFORM_ID) private pid: Object,
        private ngZone: NgZone,
        private language: LanguageService,
                private RemiveRoleAriaService: RemiveRoleAriaService,
    ) { }

    ngAfterViewInit() {
        if (!isPlatformBrowser(this.pid)) return;
        if (typeof window === 'undefined') return;

        this.ngZone.runOutsideAngular(() => {
            requestAnimationFrame(() => {
                setTimeout(() => {

                    const solutionsSection4TITLE = document.querySelector('#solutionsSection4-TITLE') as HTMLElement;
                    const solutionsSection4Details = document.querySelector('#solutionsSection4-Detailes') as HTMLElement;
                    this.solutionsSection4DetailsSplit = new SplitText(solutionsSection4Details, { type: "words" });
                    const solutionsSection4TITLESplit = SplitText.create(solutionsSection4TITLE, { type: "words" });

                    this.RemiveRoleAriaService.cleanA11y(solutionsSection4TITLE, solutionsSection4TITLESplit);
                    this.RemiveRoleAriaService.cleanA11y(solutionsSection4Details, this.solutionsSection4DetailsSplit);
                    ScrollTrigger.create({
                        trigger: '#solutionsSection4',
                        start: 'top top',
                        end: "150% bottom",
                        pin: true,
                        pinType: 'transform',
                        // markers: true,
                        id: 'pinsection',
                        anticipatePin: 1,
                    });
                    const tl = gsap.timeline({
                        defaults: { ease: "power3.out" }, scrollTrigger: {
                            trigger: "#solutionsSection4",
                            start: 'top top',
                            end: "150% bottom",
                            // markers: true,
                        }
                    });
                    let triggered = false;
                    triggered = false;

                    const path = document.querySelector(".capsule-path4") as SVGPathElement;
                    if (!path) return;
                    const length = path.getTotalLength();
                    gsap.set('#capsule4', { y: 78 })
                    tl.fromTo(path, { strokeDasharray: length, strokeDashoffset: length, opacity: 0, visibility: "hidden" },
                        {
                            strokeDashoffset: 0,
                            opacity: 1,
                            visibility: "visible",
                            duration: 1,
                            ease: "power2.inOut"
                        });
                    gsap.set("#solutionsSection4-TITLE", { perspective: 800 });

                    tl.fromTo(solutionsSection4TITLESplit.words,
                        {
                            opacity: 0,
                            rotateY: gsap.utils.random(-80, 80),
                            filter: "blur(6px)"
                        },
                        {
                            opacity: 1,
                            rotateY: 0,
                            y: 0,
                            filter: "blur(0px)",
                            duration: 0.4,
                            stagger: {
                                each: 0.15,
                                from: "start"
                            }

                        }
                    );
                    tl.to("#capsule4", {
                        scale: 0.85,
                        duration: 0.6,
                        ease: "power2.inOut",
                        onStart: () => {
                            gsap.to('#solutionsSection4', {
                                backgroundColor: '#ffffff',
                                duration: 0.8,
                                ease: "power2.inOut"
                            });
                        }
                    }, ">+0.3");
                    tl.to("#capsule4", {
                        y: -30,
                        duration: 0.7,
                        ease: "power2.inOut",
                    }, ">-0.4");

                    tl.fromTo(this.solutionsSection4DetailsSplit.words,
                        { opacity: 0, visibility: "visible" },
                        {
                            opacity: 1,
                            duration: 0.4,
                            ease: "sine.out",
                            stagger: 0.02,
                            onStart: () => { gsap.set(solutionsSection4Details, { opacity: 1, visibility: "visible" }) },
                        }
                    );
                }, 200);
            });
        });
    }
}
