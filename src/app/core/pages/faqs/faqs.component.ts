import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ChangeDetectorRef, Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { AccordionComponent } from "../../shared/accordion/accordion.component";
import { TranslatePipe } from '@ngx-translate/core';
import { SectionsRegistryService } from '../../shared/services/sections-registry.service';
import { NavbarThemeService } from '../../components/navbar/navbar-theme.service';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import { FaqsService } from './Faqs-service';
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
type FaqItem = { id: number; question: string; answer: string; startOpen?: boolean };


@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [CommonModule, AccordionComponent, TranslatePipe, ReactiveFormsModule],
  templateUrl: './faqs.component.html',
  styleUrl: './faqs.component.scss',
})
export class FAQSComponent {
  FAQS: FaqItem[] = [
    // { question: "FAQS.Q1.T1", answer: 'FAQS.Q1.A1', startOpen: true },
    // { question: "FAQS.Q2.T1", answer: 'FAQS.Q2.A1', startOpen: false },
    // { question: "FAQS.Q3.T1", answer: 'FAQS.Q3.A1', startOpen: false },
    // { question: "FAQS.Q4.T1", answer: 'FAQS.Q4.A1', startOpen: false },
    // { question: "FAQS.Q5.T1", answer: 'FAQS.Q5.A1', startOpen: false },
    // { question: "FAQS.Q6.T1", answer: 'FAQS.Q6.A1', startOpen: false },
    // { question: "FAQS.Q7.T1", answer: 'FAQS.Q7.A1', startOpen: false },
    // { question: "FAQS.Q8.T1", answer: 'FAQS.Q8.A1', startOpen: false },
    // { question: "FAQS.Q9.T1", answer: 'FAQS.Q9.A1', startOpen: false },
    // { question: "FAQS.Q10.T1", answer: 'FAQS.Q10.A1', startOpen: false },
    // { question: "FAQS.Q11.T1", answer: 'FAQS.Q11.A1', startOpen: false },
    // { question: "FAQS.Q12.T1", answer: 'FAQS.Q12.A1', startOpen: false },
    // { question: "FAQS.Q13.T1", answer: 'FAQS.Q13.A1', startOpen: false },
    // { question: "FAQS.Q14.T1", answer: 'FAQS.Q14.A1', startOpen: false },
    // { question: "FAQS.Q15.T1", answer: 'FAQS.Q15.A1', startOpen: false },
  ];


  private visibilitySubject = new BehaviorSubject<'visible' | 'invisible'>('visible');
  visibility$ = this.visibilitySubject.asObservable();
  visibilityState: 'visible' | 'invisible' = 'visible';

  faqForm: FormGroup;
  lang: string;
  menuOpen = false;
  isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private navTheme: NavbarThemeService,
    private sectionsRegistry: SectionsRegistryService,
    private fb: FormBuilder,
    private faqsService: FaqsService, private translate: TranslateService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.faqForm = this.fb.group({
      faqs: this.fb.array([])
    });
    this.lang = this.translate.currentLang || this.translate.defaultLang || 'ar';
    this.loadFaqs();
  }
  ngOnInit(): void {
    if (!this.isBrowser) return;

    this.ngZone.runOutsideAngular(() => {
      // setTimeout(() => {
      this.navTheme.setColor('var(--primary)');

      // }, 150);
    });
  }


  ngOnDestroy(): void {
    this.sectionsRegistry.clear();
    this.sectionsRegistry.disable();

    if (this.isBrowser) {
      ScrollTrigger.getAll().forEach(t => t.kill());
    }
  }
  get faqs() {
    return this.faqForm.get('faqs') as FormArray;
  }

  addFaq() {
    const faqGroup = this.fb.group({
      question: ['', Validators.required],
      answer: ['', Validators.required],
      englishAnswer: ['', Validators.required],
      englishQuestion: ['', Validators.required],
    });
    this.faqs.push(faqGroup);
  }
  onSubmit() {
    console.log(this.faqForm.value.faqs[0]);
    this.faqsService.AddFAQS(this.faqForm.value.faqs[0]).subscribe((res) => {
      this.loadFaqs();
    })
  }
  onDeleteFaq(id: number) {
    this.faqsService.DeleteFAQ(id).subscribe((res) => {
      this.loadFaqs();
    })
    // console.log('Deleted accordion id:', id);

  }
  removeFaq(index: number) {
    this.faqs.removeAt(index);
  }
  // loadFaqs() {

  //   this.faqsService.GetAllFAQS().subscribe((res: any) => {
  //     const list = res?.data ?? [];

  //     this.FAQS = list.map((faq: any) => ({
  //       id: faq.id,
  //       question: this.lang === 'ar' ? faq.question : faq.englishQuestion,
  //       answer: this.lang === 'ar' ? faq.answer : faq.englishAnswer,
  //       startOpen: false,
  //     }));
  //   });
  // }
  loadingFaqs = true;

  loadFaqs() {
    this.loadingFaqs = true;

    this.faqsService.GetAllFAQS().subscribe({
      next: (res: any) => {
        const list = res?.data ?? [];
        this.FAQS = list.map((faq: any) => ({
          id: faq.id,
          question: faq.question,
          answer: faq.answer,
          startOpen: false,
        }));
        this.loadingFaqs = false;
      },
      error: () => {
        this.loadingFaqs = false;
      },
    });
  }

}
