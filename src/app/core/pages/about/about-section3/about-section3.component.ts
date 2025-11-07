import { Component, AfterViewInit, ViewChildren, ElementRef, QueryList, inject, ViewChild, PLATFORM_ID, Inject, ApplicationRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { isPlatformBrowser } from '@angular/common';
gsap.registerPlugin(ScrollTrigger);
@Component({
  selector: 'app-about-section3',
  imports: [CommonModule],
  templateUrl: './about-section3.component.html',
  styleUrl: './about-section3.component.scss'
})
export class AboutSection3Component {
  public AboutSection3Timeline!: GSAPTimeline;
  private completedBlocksCount = 0;
  DivisionId = 0
  show = 0;
  // @ViewChildren(Section6bgChangerComponent) bgChangers!: QueryList<Section6bgChangerComponent>;
  @ViewChild('DivisionsTrigger', { static: true }) DivisionsTrigger!: ElementRef
  @ViewChild('AboutSection3') AboutSection3!: ElementRef


  public sections = [
    { bgUrl: './About us/2.jpg', text: 'Delivering complete telecom and IT solutions from design to support, empowering clients to stay ahead with optimized solutions.' },
    { bgUrl: './About us/3.jpg', text: 'Your trusted partner in managing content and growing your digital presence.' },
    { bgUrl: './About us/4.jpg', text: 'Empowering businesses with tailored outsourcing solutions across IT, finance, HR, and more.' },
  ];
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appRef: ApplicationRef,
    private ngZone: NgZone

  ) { }
  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const finalTextScrollDuration = 1.5;
    // main timeLine

    this.AboutSection3Timeline = gsap.timeline({
      id: 'AboutSection3TL',
      scrollTrigger: {
        id: 'AboutSection3Trigger',
        trigger: '#AboutSection3',
        start: 'top top',
        end: '+=4000 bottom',
        scrub: true,
        pin: true,
        // markers: true,
        // pinType: 'transform',
      }
    });
    //secondery TimeLine 




    this.AboutSection3Timeline.fromTo('.scroll-bg-section', {
      autoAlpha: 0
    }, {
      autoAlpha: 1,
      onStart: () => {
        this.show = 1
        this.DivisionId = 1
      },
      onReverseComplete: () => {
        this.show = 0
      }
    }, '>-0.2');
    this.AboutSection3Timeline.fromTo('.scroll-bg-section-text', {
      yPercent: 50
    }, {
      yPercent: -190,
    }, '<');
    this.AboutSection3Timeline.fromTo('.scroll-bg-section-text', {
      yPercent: -190,
      opacity: 1
    }, {
      yPercent: -350,
      opacity: 0,
      duration: finalTextScrollDuration
    }, '>+0.8');



    this.AboutSection3Timeline.fromTo('.scroll-bg-section1', {
      autoAlpha: 0
    }, {
      autoAlpha: 1,
      duration: 0.7
    }, '>-0.67');
    this.AboutSection3Timeline.fromTo('.scroll-bg-section-text1', {
      yPercent: 50
    }, {
      yPercent: -190,
    }, '<');

    this.AboutSection3Timeline.fromTo('.scroll-bg-section-text1', {
      yPercent: -190,
      opacity: 1
    }, {
      yPercent: -350,
      opacity: 0,
      duration: finalTextScrollDuration
    }, '>+0.8');
    this.AboutSection3Timeline.fromTo('.scroll-bg-section2', {
      autoAlpha: 0
    }, {
      autoAlpha: 1,
      duration: 0.7
    }, '>-0.67');
    this.AboutSection3Timeline.fromTo('.scroll-bg-section-text2', {
      yPercent: 50
    }, {
      yPercent: -190,
    }, '<');
    this.AboutSection3Timeline.fromTo('.scroll-bg-section-text2', {
      yPercent: -190,
      opacity: 1
    }, {
      yPercent: -350,
      opacity: 0,
      duration: finalTextScrollDuration
    }, '>+0.8');


    // this.AboutSection3Timeline.fromTo(`.scroll-bg-section3`, {
    //   autoAlpha: 0
    // }, {
    //   autoAlpha: 1,
    //   duration: 0.7
    // }, '>-0.67');
    // this.AboutSection3Timeline.fromTo(`.scroll-bg-section-text3`, {
    //   yPercent: 0
    // }, {
    //   yPercent: -134,
    // }, '<');
    // this.AboutSection3Timeline.fromTo(`.scroll-bg-section-text3`, {
    //   yPercent: -134,
    //   opacity: 1
    // }, {
    //   yPercent: -350,
    //   opacity: 0.2,
    //   duration: finalTextScrollDuration
    // }, '>+0.8');


    // mm.add("(min-width: 1401px) and (max-width: 1549px)", () => {
    //   this.section6Timeline = gsap.timeline({
    //     id: 'section6TL',
    //     scrollTrigger: {
    //       id: 'section6Trigger',
    //       trigger: '#section6',
    //       start: 'top top',
    //       end: '+=8400 bottom',
    //       // end: () => `+=${this.section6Timeline.duration() * 1000}`,
    //       scrub: true,
    //       pin: true,
    //       // markers: true,
    //       pinType: 'transform',
    //       scroller: "#smooth-wrapper",
    //     }
    //   });
    //   //secondery TimeLine 
    //   gsap.set("#readButton", { display: 'none' })
    //   ScrollTrigger.create({
    //     trigger: '.scroll-bg-section',
    //     // start: '300% 50%',
    //     // end: '400% 20%',
    //     start: '230% 50%',
    //     end: '1230% 20%',
    //     // markers: true,
    //   });


    //   const buttonDuration = 1.5;
    //   const borderStartDuration = buttonDuration; // هيكمل لاحقًا
    //   const circleStartOffset = 0.15; // بعد 0.3 من بداية الأوائل
    //   const circleDuration = 0.75; // أقل من buttonDuration

    //   this.section6Timeline.fromTo(".svg-button-wrapper", {
    //     yPercent: 500,
    //     filter: 'blur(10px)',
    //   }, {
    //     yPercent: 0,
    //     filter: 'blur(0px)',
    //     ease: 'none',
    //     duration: buttonDuration
    //   });


    //   this.section6Timeline.fromTo("#svgBorderRect", {
    //     strokeDasharray: 500,
    //     strokeDashoffset: 500,
    //   }, {
    //     strokeDashoffset: 250,
    //     ease: 'none',
    //     duration: buttonDuration
    //   }, `<`);

    //   this.section6Timeline.fromTo("#CircleButton", {
    //     opacity: 0,
    //     clipPath: 'inset(0 100% 0 0)',
    //   }, {
    //     opacity: 1,
    //     clipPath: "inset(0 0% 0 0)",
    //     ease: 'none',
    //     duration: circleDuration
    //   }, `<+${circleStartOffset}`);

    //   this.section6Timeline.fromTo("#svgBorderRect", {
    //     strokeDashoffset: 250,
    //   }, {
    //     strokeDashoffset: 0,
    //     ease: 'none',
    //     duration: 2
    //   }, '>');

    //   this.section6Timeline.fromTo("#section6Text", {
    //     opacity: 0,
    //     clipPath: 'inset(0 100% 0 0)',
    //   }, {
    //     opacity: 1,
    //     clipPath: "inset(0 0% 0 0)",
    //     ease: 'none',
    //     duration: 0.8
    //   }, '<1');
    //   // this.section6Timeline.set("#section6TextSvg", { yPercent: 0 })
    //   this.section6Timeline.fromTo(".svg-button-wrapper,#section6Text", {
    //     yPercent: 0
    //   }, {
    //     yPercent: -700,
    //     filter: 'blur(10px)',
    //     ease: 'none',
    //   }, '>');

    //   ////////////////////////

    //   this.section6Timeline.set('#logoText', { autoAlpha: 0 })
    //   this.section6Timeline.fromTo('.scroll-bg-section', {
    //     autoAlpha: 0
    //   }, {
    //     autoAlpha: 1,
    //     onStart: () => {
    //       this.show = 1
    //       this.DivisionId = 1
    //     },
    //     onReverseComplete: () => {
    //       this.show = 0
    //     }
    //   }, '>-0.2');
    //   this.section6Timeline.fromTo('.scroll-bg-section-text', {
    //     yPercent: 0
    //   }, {
    //     yPercent: -153,
    //   }, '<');

    //   this.section6Timeline.fromTo('#logoText', {

    //     autoAlpha: 0
    //   }, {

    //     autoAlpha: 1
    //   }, '<+0.3');
    //   this.section6Timeline.fromTo('#logoText', {

    //     filter: 'blur(10px)',
    //   }, {

    //     filter: 'blur(0px)',

    //   }, '<+0.01');
    //   this.section6Timeline.fromTo('.scroll-bg-section-text', {
    //     yPercent: -153,
    //     opacity: 1
    //   }, {
    //     yPercent: -350,
    //     opacity: 0.2,
    //     duration: finalTextScrollDuration
    //   }, '>+0.8');



    //   this.section6Timeline.fromTo('.scroll-bg-section1', {
    //     autoAlpha: 0
    //   }, {
    //     autoAlpha: 1,
    //     duration: 0.7
    //   }, '>-0.67');
    //   this.section6Timeline.fromTo('.scroll-bg-section-text1', {
    //     yPercent: 0
    //   }, {
    //     yPercent: -180,
    //   }, '<');

    //   this.section6Timeline.fromTo('#logoText1', {

    //     autoAlpha: 0
    //   }, {

    //     autoAlpha: 1
    //   }, '<+0.3');
    //   this.section6Timeline.fromTo('#logoText1', {

    //     filter: 'blur(10px)',
    //   }, {

    //     filter: 'blur(0px)',

    //   }, '<+0.01');
    //   this.section6Timeline.fromTo('.scroll-bg-section-text1', {
    //     yPercent: -180,
    //     opacity: 1
    //   }, {
    //     yPercent: -350,
    //     opacity: 0.2,
    //     duration: finalTextScrollDuration
    //   }, '>+0.8');


    //   this.section6Timeline.fromTo('.scroll-bg-section2', {
    //     autoAlpha: 0
    //   }, {
    //     autoAlpha: 1,
    //     duration: 0.7
    //   }, '>-0.67');
    //   this.section6Timeline.fromTo('.scroll-bg-section-text2', {
    //     yPercent: 0
    //   }, {
    //     yPercent: -180,
    //   }, '<');

    //   this.section6Timeline.fromTo('#logoText2', {

    //     autoAlpha: 0
    //   }, {

    //     autoAlpha: 1
    //   }, '<+0.3');
    //   this.section6Timeline.fromTo('#logoText2', {

    //     filter: 'blur(10px)',
    //   }, {

    //     filter: 'blur(0px)',

    //   }, '<+0.01');
    //   this.section6Timeline.fromTo('.scroll-bg-section-text2', {
    //     yPercent: -180,
    //     opacity: 1
    //   }, {
    //     yPercent: -350,
    //     opacity: 0.2,
    //     duration: finalTextScrollDuration
    //   }, '>+0.8');


    //   this.section6Timeline.fromTo(`.scroll-bg-section3`, {
    //     autoAlpha: 0
    //   }, {
    //     autoAlpha: 1,
    //     duration: 0.7
    //   }, '>-0.67');
    //   this.section6Timeline.fromTo(`.scroll-bg-section-text3`, {
    //     yPercent: 0
    //   }, {
    //     yPercent: -165,
    //   }, '<');

    //   this.section6Timeline.fromTo(`#logoText3`, {

    //     autoAlpha: 0
    //   }, {

    //     autoAlpha: 1
    //   }, '<+0.3');
    //   this.section6Timeline.fromTo(`#logoText3`, {

    //     filter: 'blur(10px)',
    //   }, {

    //     filter: 'blur(0px)',

    //   }, '<+0.01');
    //   this.section6Timeline.fromTo(`.scroll-bg-section-text3`, {
    //     yPercent: -165,
    //     opacity: 1
    //   }, {
    //     yPercent: -350,
    //     opacity: 0.2,
    //     duration: finalTextScrollDuration
    //   }, '>+0.8');

    // })
    // mm.add("(min-width: 1550px)", () => {
    //   this.section6Timeline = gsap.timeline({
    //     id: 'section6TL',
    //     scrollTrigger: {
    //       id: 'section6Trigger',
    //       trigger: '#section6',
    //       start: 'top top',
    //       end: '+=8400 bottom',
    //       // end: () => `+=${this.section6Timeline.duration() * 1000}`,
    //       scrub: true,
    //       pin: true,
    //       // markers: true,
    //       pinType: 'transform',
    //       scroller: "#smooth-wrapper",
    //     }
    //   });
    //   //secondery TimeLine 

    //   ScrollTrigger.create({
    //     trigger: '.scroll-bg-section',
    //     // start: '300% 50%',
    //     // end: '400% 20%',
    //     start: '250% 50%',
    //     end: '1230% 20%',

    //     // markers: true,
    //   });


    //   const buttonDuration = 1.5;
    //   const borderStartDuration = buttonDuration; // هيكمل لاحقًا
    //   const circleStartOffset = 0.15; // بعد 0.3 من بداية الأوائل
    //   const circleDuration = 0.75; // أقل من buttonDuration

    //   this.section6Timeline.fromTo(".svg-button-wrapper", {
    //     yPercent: 500,
    //     filter: 'blur(10px)',
    //   }, {
    //     yPercent: 0,
    //     filter: 'blur(0px)',
    //     ease: 'none',
    //     duration: buttonDuration
    //   });


    //   this.section6Timeline.fromTo("#svgBorderRect", {
    //     strokeDasharray: 500,
    //     strokeDashoffset: 500,
    //   }, {
    //     strokeDashoffset: 250,
    //     ease: 'none',
    //     duration: buttonDuration
    //   }, `<`);

    //   this.section6Timeline.fromTo("#CircleButton", {
    //     opacity: 0,
    //     clipPath: 'inset(0 100% 0 0)',
    //   }, {
    //     opacity: 1,
    //     clipPath: "inset(0 0% 0 0)",
    //     ease: 'none',
    //     duration: circleDuration
    //   }, `<+${circleStartOffset}`);

    //   this.section6Timeline.fromTo("#svgBorderRect", {
    //     strokeDashoffset: 250,
    //   }, {
    //     strokeDashoffset: 0,
    //     ease: 'none',
    //     duration: 2
    //   }, '>');

    //   this.section6Timeline.fromTo("#section6Text", {
    //     opacity: 0,
    //     clipPath: 'inset(0 100% 0 0)',
    //   }, {
    //     opacity: 1,
    //     clipPath: "inset(0 0% 0 0)",
    //     ease: 'none',
    //     duration: 0.8
    //   }, '<1');
    //   // this.section6Timeline.set("#section6TextSvg", { yPercent: 0 })
    //   this.section6Timeline.fromTo(".svg-button-wrapper,#section6Text", {
    //     yPercent: 0
    //   }, {
    //     yPercent: -700,
    //     filter: 'blur(10px)',
    //     ease: 'none',
    //   }, '>');

    //   ////////////////////////

    //   this.section6Timeline.set('#logoText', { autoAlpha: 0 })
    //   this.section6Timeline.fromTo('.scroll-bg-section', {
    //     autoAlpha: 0
    //   }, {
    //     autoAlpha: 1,
    //     onStart: () => {
    //       this.show = 1
    //       this.DivisionId = 1
    //     },
    //     onReverseComplete: () => {
    //       this.show = 0
    //     }
    //   }, '>-0.2');
    //   this.section6Timeline.fromTo('.scroll-bg-section-text', {
    //     yPercent: 0
    //   }, {
    //     yPercent: -216,
    //   }, '<');

    //   this.section6Timeline.fromTo('#logoText', {

    //     autoAlpha: 0
    //   }, {

    //     autoAlpha: 1
    //   }, '<+0.3');
    //   this.section6Timeline.fromTo('#logoText', {

    //     filter: 'blur(10px)',
    //   }, {

    //     filter: 'blur(0px)',

    //   }, '<+0.01');
    //   this.section6Timeline.fromTo('.scroll-bg-section-text', {
    //     yPercent: -216,
    //     opacity: 1
    //   }, {
    //     yPercent: -400,
    //     opacity: 0.2,
    //     duration: finalTextScrollDuration
    //   }, '>+0.8');



    //   this.section6Timeline.fromTo('.scroll-bg-section1', {
    //     autoAlpha: 0
    //   }, {
    //     autoAlpha: 1,
    //     duration: 0.7
    //   }, '>-0.67');
    //   this.section6Timeline.fromTo('.scroll-bg-section-text1', {
    //     yPercent: 0
    //   }, {
    //     yPercent: -180,
    //   }, '<');

    //   this.section6Timeline.fromTo('#logoText1', {

    //     autoAlpha: 0
    //   }, {

    //     autoAlpha: 1
    //   }, '<+0.3');
    //   this.section6Timeline.fromTo('#logoText1', {

    //     filter: 'blur(10px)',
    //   }, {

    //     filter: 'blur(0px)',

    //   }, '<+0.01');
    //   this.section6Timeline.fromTo('.scroll-bg-section-text1', {
    //     yPercent: -180,
    //     opacity: 1
    //   }, {
    //     yPercent: -450,
    //     opacity: 0.2,
    //     duration: finalTextScrollDuration
    //   }, '>+0.8');


    //   this.section6Timeline.fromTo('.scroll-bg-section2', {
    //     autoAlpha: 0
    //   }, {
    //     autoAlpha: 1,
    //     duration: 0.7
    //   }, '>-0.67');
    //   this.section6Timeline.fromTo('.scroll-bg-section-text2', {
    //     yPercent: 0
    //   }, {
    //     yPercent: -180,
    //   }, '<');

    //   this.section6Timeline.fromTo('#logoText2', {

    //     autoAlpha: 0
    //   }, {

    //     autoAlpha: 1
    //   }, '<+0.3');
    //   this.section6Timeline.fromTo('#logoText2', {

    //     filter: 'blur(10px)',
    //   }, {

    //     filter: 'blur(0px)',

    //   }, '<+0.01');
    //   this.section6Timeline.fromTo('.scroll-bg-section-text2', {
    //     yPercent: -180,
    //     opacity: 1
    //   }, {
    //     yPercent: -450,
    //     opacity: 0.2,
    //     duration: finalTextScrollDuration
    //   }, '>+0.8');


    //   this.section6Timeline.fromTo(`.scroll-bg-section3`, {
    //     autoAlpha: 0
    //   }, {
    //     autoAlpha: 1,
    //     duration: 0.7
    //   }, '>-0.67');
    //   this.section6Timeline.fromTo(`.scroll-bg-section-text3`, {
    //     yPercent: 0
    //   }, {
    //     yPercent: -165,
    //   }, '<');

    //   this.section6Timeline.fromTo(`#logoText3`, {

    //     autoAlpha: 0
    //   }, {

    //     autoAlpha: 1
    //   }, '<+0.3');
    //   this.section6Timeline.fromTo(`#logoText3`, {

    //     filter: 'blur(10px)',
    //   }, {

    //     filter: 'blur(0px)',

    //   }, '<+0.01');
    //   this.section6Timeline.fromTo(`.scroll-bg-section-text3`, {
    //     yPercent: -165,
    //     opacity: 1
    //   }, {
    //     yPercent: -450,
    //     opacity: 0.2,
    //     duration: finalTextScrollDuration
    //   }, '>+0.8');
    // });

  }



}
