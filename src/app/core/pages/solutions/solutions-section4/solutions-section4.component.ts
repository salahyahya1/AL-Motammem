import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ApplicationRef, ChangeDetectorRef, Component, ElementRef, Inject, NgZone, PLATFORM_ID, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Draggable } from "gsap/all";
import InertiaPlugin from "gsap/InertiaPlugin";

import SplitText from "gsap/SplitText";


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
                    let mm = gsap.matchMedia();
                    const solutionsSection4TITLE = document.querySelector('#solutionsSection4-TITLE') as HTMLElement;
                    const solutionsSection4Details = document.querySelector('#solutionsSection4-Detailes') as HTMLElement;

                    let solutionsSection4TITLESplit: SplitText;

                    mm.add({
                        desktop: '(min-width: 768px)',
                        mobile: '(max-width: 767px)',
                    }, (context) => {
                        let { desktop, mobile } = context.conditions as any;

                        this.solutionsSection4DetailsSplit = new SplitText(solutionsSection4Details, { type: "words" });
                        solutionsSection4TITLESplit = SplitText.create(solutionsSection4TITLE, { type: "words" });

                        this.RemiveRoleAriaService.cleanA11y(solutionsSection4TITLE, solutionsSection4TITLESplit);
                        this.RemiveRoleAriaService.cleanA11y(solutionsSection4Details, this.solutionsSection4DetailsSplit);

                        ScrollTrigger.create({
                            trigger: '#solutionsSection4',
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
                                trigger: "#solutionsSection4",
                                start: 'top top',
                                end: "150% bottom",
                                // markers: true,
                            }
                        });


                        const path = document.querySelector(".capsule-solutionsRect") as SVGPathElement;
                        if (path) {
                            const length = path.getTotalLength();
                            gsap.set('#capsuleSolutionsWrap', { y: 78 });
                            tl.fromTo(path, { strokeDasharray: length, strokeDashoffset: length, opacity: 0, visibility: "hidden" },
                                {
                                    strokeDashoffset: 0,
                                    opacity: 1,
                                    visibility: "visible",
                                    duration: 0.2,
                                    ease: "power2.inOut"
                                });
                        }

                        gsap.set("#solutionsSection4-TITLE", { perspective: 800, visibility: "visible", opacity: 1 });

                        if (mobile) {
                            // Lighter Mobile Animation
                            tl.fromTo(solutionsSection4TITLESplit.words,
                                {
                                    opacity: 0,
                                    y: 20,
                                    filter: "blur(2px)"
                                },
                                {
                                    opacity: 1,
                                    y: 0,
                                    filter: "blur(0px)",
                                    duration: 0.2,
                                    stagger: 0.05
                                }
                            );
                        } else {
                            // Desktop Animation
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
                                    duration: 0.2,
                                    stagger: {
                                        each: 0.15,
                                        from: "start"
                                    }
                                }
                            );
                        }

                        tl.to("#capsuleSolutionsWrap", {
                            scale: 0.85,
                            duration: 0.2,
                            y: mobile ? 50 : 30, // Adjusted for mobile if needed
                            ease: "power2.inOut",
                            onStart: () => {
                                gsap.to('#solutionsSection4', {
                                    backgroundColor: '#ffffff',
                                    duration: 0.2,
                                    ease: "power2.inOut"
                                });
                            }
                        }, ">+0.3");

                        tl.to("#solutions-Section4-container", {
                            y: -30,
                            duration: 0.2,
                            ease: "power2.inOut",
                        }, ">-0.4");

                        tl.fromTo(this.solutionsSection4DetailsSplit.words,
                            { opacity: 0, visibility: "visible" },
                            {
                                opacity: 1,
                                duration: 0.2,
                                ease: "sine.out",
                                stagger: 0.02,
                                onStart: () => { gsap.set(solutionsSection4Details, { opacity: 1, visibility: "visible" }) },
                            }
                        );

                        return () => {
                            if (solutionsSection4TITLESplit) solutionsSection4TITLESplit.revert();
                            if (this.solutionsSection4DetailsSplit) this.solutionsSection4DetailsSplit.revert();
                        };
                    });
                }, 200);
            });
        });
    }
    get isRtl() {
        return this.language.currentLang === 'ar';
    }
}
