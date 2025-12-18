import { isPlatformBrowser } from '@angular/common';
import { ApplicationRef, Component, ElementRef, Inject, NgZone, PLATFORM_ID, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';
import { TranslatePipe } from '@ngx-translate/core';
import { OpenFormDialogDirective } from '../../../shared/Directives/open-form-dialog.directive';
import { VedioPlayerServiceForIosService } from '../../../shared/services/vedio-player-service-for-ios.service';
gsap.registerPlugin(ScrollTrigger, SplitText);

@Component({
  selector: 'app-section2',
  imports: [RouterLink, TranslatePipe, OpenFormDialogDirective],
  templateUrl: './section2.component.html',
  styleUrls: ['./section2.component.scss'],
})
export class Section2Component {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private vedioPlayer:VedioPlayerServiceForIosService,
    private appRef: ApplicationRef,
    private ngZone: NgZone
  ) { }
  @ViewChild('section4Video') section4Video!: ElementRef<HTMLVideoElement>;
  ngAfterViewInit() {

    if (!isPlatformBrowser(this.platformId)) return;
    let playedOnce = false;
    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          document.fonts.ready.then(() => {
            const section = document.querySelector('#stats-section') as HTMLElement;
            const triggerEl = (document.querySelector('#section2') as HTMLElement) || section;
            const video = document.getElementById('section4Video') as HTMLVideoElement;
            const content = document.getElementById('section4Content');
            const cta = section.querySelector('button') as HTMLElement | null;
            const subtitle = section.querySelector('p') as HTMLElement | null;
            if (!section) return;
            gsap.set(cta, { opacity: 0 });
            gsap.set(subtitle, { opacity: 0 });
            const rows = Array.from(section.querySelectorAll('.stat-card')) as HTMLElement[];
            if (!rows.length) {
              console.warn('⚠️ لم يتم العثور على أي stat-card');
              return;
            }

            rows.forEach(row => {
              const c = row.querySelector('.counter') as HTMLElement | null;
              if (c) c.textContent = '0';
            });

            const animateCounter = (el: HTMLElement, to: number, duration = 1.4, decimals = 0) => {
              const obj = { val: 0 };
              gsap.to(obj, {
                val: to,
                duration,
                ease: 'power3.out',
                onUpdate: () => {
                  el.textContent = obj.val.toFixed(decimals);
                },
              });
            };

            rows.forEach(row => {
              const labelEl = row.querySelector('.label') as HTMLElement | null;
              if (labelEl) {
                const sLabel = SplitText.create(labelEl, { type: 'words', aria: 'hidden' });
                gsap.set(sLabel.words, { opacity: 0 });
                (labelEl as any)._splitWords = sLabel.words;
              }
            });

            rows.forEach(row => {
              const numEl = row.querySelector('.num') as HTMLElement | null;
              if (numEl) {
                gsap.set(numEl, { opacity: 0 });
              }
            });
            ScrollTrigger.create({
              trigger: triggerEl || section,
              start: 'top top',
              end: '+=400',
              scrub: true,
              pinType: 'transform',
              pin: true,
              anticipatePin: 1,
              id: 'pinsection',
              onEnter: () => {
                if (!playedOnce) {
                  playedOnce = true;
                  video.currentTime = 0;
                  this.vedioPlayer.requestPlay(video);
                }
              },
            });
            video.addEventListener('ended', () => {
              const tl = gsap.timeline({
                defaults: { ease: 'power3.out' },
                scrollTrigger: {
                  trigger: triggerEl || section,
                  start: '-50% top',
                  end: '+=400',
                },
              });
              const order = [0, 1, 2, 3];
              order.forEach((index, i) => {
                const row = rows[index];
                const labelEl = row.querySelector('.label') as HTMLElement | null;
                const numEl = row.querySelector('.num') as HTMLElement | null;
                const counterEl = row.querySelector('.counter') as HTMLElement | null;
                const labelWords = (labelEl && (labelEl as any)._splitWords) || null;
                const rowTL = gsap.timeline();
                if (labelWords) {
                  rowTL.to(labelWords, {
                    opacity: 1,
                    duration: 0.6,
                    ease: 'sine.out',
                    stagger: { each: 0.4, from: 'start' },
                  });
                }
                if (numEl && counterEl) {
                  rowTL.to(
                    numEl,
                    {
                      opacity: 1,
                      duration: 0.8,
                      ease: 'power2.out',
                      onStart: () => {
                        const target = Number(counterEl.getAttribute('data-target') ?? 0);
                        const decimals = target % 1 !== 0 ? 1 : 0;
                        animateCounter(counterEl, target, 1.5, decimals);
                      },
                    },
                    0
                  );
                }
                tl.add(rowTL, i === 0 ? '>' : '-=0.8');
              });
              if (cta) {
                gsap.set(cta, { opacity: 0, y: 20 });
                tl.to(cta, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '+=0.1');
              }
              if (subtitle) {
                gsap.set(subtitle, { opacity: 0, y: 10 });
                tl.to(subtitle, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '+=0.1');
              }
            });
          });
        }, 500);
      });
    });
  }
  
}