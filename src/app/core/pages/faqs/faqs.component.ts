// import { CommonModule, isPlatformBrowser } from '@angular/common';
// import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
// import { ChangeDetectorRef, Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';
// import { AccordionComponent } from "../../shared/accordion/accordion.component";
// import { TranslatePipe } from '@ngx-translate/core';
// import { SectionsRegistryService } from '../../shared/services/sections-registry.service';
// import { NavbarThemeService } from '../../components/navbar/navbar-theme.service';
// import { BehaviorSubject } from 'rxjs';
// import { TranslateService } from '@ngx-translate/core';
// import gsap from 'gsap';
// import ScrollTrigger from 'gsap/ScrollTrigger';
// import ScrollToPlugin from 'gsap/ScrollToPlugin';
// import { FaqsService } from './Faqs-service';
// import { DialogButton, MessegeDialogComponent } from "../../shared/messege-dialog/messege-dialog.component";
// import { SafeHtml } from '@angular/platform-browser';
// gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
// type FaqItem = { id: number; question: string; answer: string; startOpen?: boolean };


// @Component({
//   selector: 'app-faqs',
//   standalone: true,
//   imports: [CommonModule, AccordionComponent, TranslatePipe, ReactiveFormsModule, MessegeDialogComponent],
//   templateUrl: './faqs.component.html',
//   styleUrl: './faqs.component.scss',
// })
// export class FAQSComponent {
//   FAQS: FaqItem[] = [
//     // { question: "FAQS.Q1.T1", answer: 'FAQS.Q1.A1', startOpen: true },
//     // { question: "FAQS.Q2.T1", answer: 'FAQS.Q2.A1', startOpen: false },
//     // { question: "FAQS.Q3.T1", answer: 'FAQS.Q3.A1', startOpen: false },
//     // { question: "FAQS.Q4.T1", answer: 'FAQS.Q4.A1', startOpen: false },
//     // { question: "FAQS.Q5.T1", answer: 'FAQS.Q5.A1', startOpen: false },
//     // { question: "FAQS.Q6.T1", answer: 'FAQS.Q6.A1', startOpen: false },
//     // { question: "FAQS.Q7.T1", answer: 'FAQS.Q7.A1', startOpen: false },
//     // { question: "FAQS.Q8.T1", answer: 'FAQS.Q8.A1', startOpen: false },
//     // { question: "FAQS.Q9.T1", answer: 'FAQS.Q9.A1', startOpen: false },
//     // { question: "FAQS.Q10.T1", answer: 'FAQS.Q10.A1', startOpen: false },
//     // { question: "FAQS.Q11.T1", answer: 'FAQS.Q11.A1', startOpen: false },
//     // { question: "FAQS.Q12.T1", answer: 'FAQS.Q12.A1', startOpen: false },
//     // { question: "FAQS.Q13.T1", answer: 'FAQS.Q13.A1', startOpen: false },
//     // { question: "FAQS.Q14.T1", answer: 'FAQS.Q14.A1', startOpen: false },
//     // { question: "FAQS.Q15.T1", answer: 'FAQS.Q15.A1', startOpen: false },
//   ];


//   private visibilitySubject = new BehaviorSubject<'visible' | 'invisible'>('visible');
//   visibility$ = this.visibilitySubject.asObservable();
//   visibilityState: 'visible' | 'invisible' = 'visible';

//   faqForm: FormGroup;
//   lang: string;
//   menuOpen = false;
//   isBrowser: boolean;

//   isAuthenticated = false;
//   hasrole = false;
//   role: any;
//   EditFAQ: any;
//   dialogOpen = false;
//   blog: any;
//   blogHtml: SafeHtml = '';
//   dialogVariant: 'success' | 'error' = 'success';
//   dialogTitle = '';
//   dialogMessage = '';
//   dialogButtons: DialogButton[] = [];
//   constructor(
//     @Inject(PLATFORM_ID) private platformId: Object,
//     private ngZone: NgZone,
//     private cdr: ChangeDetectorRef,
//     private navTheme: NavbarThemeService,
//     private sectionsRegistry: SectionsRegistryService,
//     private fb: FormBuilder,
//     private faqsService: FaqsService, private translate: TranslateService
//   ) {
//     this.isBrowser = isPlatformBrowser(this.platformId);
//     this.faqForm = this.fb.group({
//       faqs: this.fb.array([])
//     });
//     this.lang = this.translate.currentLang || this.translate.defaultLang || 'ar';
//     this.loadFaqs();
//   }
//   ngOnInit(): void {
//     if (!this.isBrowser) return;
//     this.isAuthenticated = this.faqsService.isAuthenticated();
//     this.role = localStorage.getItem('role')
//     this.hasrole = this.role ? true : false;
//     this.ngZone.runOutsideAngular(() => {
//       // setTimeout(() => {
//       this.navTheme.setColor('var(--primary)');
//       this.navTheme.setBg('var(--white)');

//       // }, 150);
//     });
//   }


//   ngOnDestroy(): void {
//     this.sectionsRegistry.clear();
//     this.sectionsRegistry.disable();

//     if (this.isBrowser) {
//       ScrollTrigger.getAll().forEach(t => t.kill());
//     }
//   }
//   get faqs() {
//     return this.faqForm.get('faqs') as FormArray;
//   }

//   addFaq() {
//     const faqGroup = this.fb.group({
//       question: ['', Validators.required],
//       answer: ['', Validators.required],
//       englishAnswer: ['', Validators.required],
//       englishQuestion: ['', Validators.required],
//     });
//     this.faqs.push(faqGroup);
//   }
//   onSubmit() {
//     console.log(this.faqForm.value.faqs[0]);
//     this.faqsService.AddFAQS(this.faqForm.value.faqs[0]).subscribe((res) => {
//       this.loadFaqs();
//     })
//   }
//   onDeleteFaq(id: number) {
//     this.faqsService.DeleteFAQ(id).subscribe({
//       next: (res: any) => {
//         this.dialogVariant = 'success';
//         this.dialogTitle = 'Success';
//         this.dialogMessage = 'FAQ deleted successfully';
//         this.dialogButtons = [
//           { id: 'cancel', text: 'Cancel', style: 'outline' },
//           { id: 'retry', text: 'Try again', style: 'danger' },
//         ];
//         this.dialogOpen = true;
//         this.loadFaqs();
//       },
//       error: (err: any) => {
//         console.log(err);
//         this.dialogVariant = 'error';
//         this.dialogTitle = 'Error';
//         this.dialogMessage = err?.error?.message;
//         this.dialogButtons = [
//           { id: 'cancel', text: 'Cancel', style: 'outline' },
//           { id: 'retry', text: 'Try again', style: 'danger' },
//         ];
//         this.dialogOpen = true;
//         this.loadingFaqs = false;
//       },
//     })
//     // console.log('Deleted accordion id:', id);

//   }
//   onEditFaq(id: number) {
//     // console.log(this.FAQS.find((faq: any) => faq.id === id));
//     this.faqsService.GetAllFAQS().subscribe((res: any) => {
//       const list = res?.data ?? [];
//       this.FAQS = list.map((faq: any) => ({
//         id: faq.id,
//         question: this.lang === 'ar' ? faq.question : faq.englishQuestion,
//         answer: this.lang === 'ar' ? faq.answer : faq.englishAnswer,
//         englishAnswer: faq.englishAnswer,
//         englishQuestion: faq.englishQuestion,
//       }));
//       this.EditFAQ = this.FAQS.find((faq: any) => faq.id === id)
//       this.faqForm.patchValue({
//         question: this.EditFAQ.question,
//         answer: this.EditFAQ.answer,
//         englishAnswer: this.EditFAQ.englishAnswer,
//         englishQuestion: this.EditFAQ.englishQuestion,
//       })
//       console.log(this.faqForm.value);

//     })
//     // this.faqsService.UpdateFAQ(id, this.FAQS.find((faq: any) => faq.id === id)).subscribe({
//     //   next: (res: any) => {
//     //     console.log(res);
//     //     // console.log(this.FAQS.find((faq: any) => faq.id === id));

//     //   },
//     //   // next: (res: any) => {
//     //   //   this.dialogVariant = 'success';
//     //   //   this.dialogTitle = 'Success';
//     //   //   this.dialogMessage = 'FAQ deleted successfully';
//     //   //   this.dialogButtons = [
//     //   //     { id: 'cancel', text: 'Cancel', style: 'outline' },
//     //   //     { id: 'retry', text: 'Try again', style: 'danger' },
//     //   //   ];
//     //   //   this.dialogOpen = true;
//     //   //   this.loadFaqs();
//     //   // },
//     //   // error: (err: any) => {
//     //   //   console.log(err);
//     //   //   this.dialogVariant = 'error';
//     //   //   this.dialogTitle = 'Error';
//     //   //   this.dialogMessage = err?.error?.message;
//     //   //   this.dialogButtons = [
//     //   //     { id: 'cancel', text: 'Cancel', style: 'outline' },
//     //   //     { id: 'retry', text: 'Try again', style: 'danger' },
//     //   //   ];
//     //   //   this.dialogOpen = true;
//     //   //   this.loadingFaqs = false;
//     //   // },
//     // })
//     // console.log('Deleted accordion id:', id);
//     // console.log(id);
//     // this.
//   }
//   removeFaq(index: number) {
//     this.faqs.removeAt(index);
//   }
//   // loadFaqs() {

//   //   this.faqsService.GetAllFAQS().subscribe((res: any) => {
//   //     const list = res?.data ?? [];

//   //     this.FAQS = list.map((faq: any) => ({
//   //       id: faq.id,
//   //       question: this.lang === 'ar' ? faq.question : faq.englishQuestion,
//   //       answer: this.lang === 'ar' ? faq.answer : faq.englishAnswer,
//   //       startOpen: false,
//   //     }));
//   //   });
//   // }
//   loadingFaqs = true;

//   loadFaqs() {
//     this.loadingFaqs = true;

//     this.faqsService.GetAllFAQS().subscribe({
//       next: (res: any) => {
//         const list = res?.data ?? [];
//         this.FAQS = list.map((faq: any) => ({
//           id: faq.id,
//           // question: faq.question,
//           // answer: faq.answer,
//           question: this.lang === 'ar' ? faq.question : faq.englishQuestion,
//           answer: this.lang === 'ar' ? faq.answer : faq.englishAnswer,
//           startOpen: false,
//         }));
//         this.loadingFaqs = false;
//       },
//       error: (err: any) => {
//         // console.log(err);
//         // this.dialogVariant = 'error';
//         // this.dialogTitle = '';
//         // this.dialogMessage = err?.message;
//         // this.dialogButtons = [
//         //   { id: 'cancel', text: 'Cancel', style: 'outline' },
//         //   { id: 'retry', text: 'Try again', style: 'danger' },
//         // ];
//         // this.dialogOpen = true;
//         // this.loadingFaqs = false;
//       },
//     });
//   }
//   onDialogAction(id: string) {
//     if (id === 'show all') {
//       this.dialogOpen = false;
//     }
//     if (id === 'show edited blog') {
//       this.dialogOpen = false;
//       // this.router.navigate(['/blogs/BlogVeiw', this.blogsService.spacesToHyphen(this.blogForm.value.englishUrl ?? '')]);
//     }
//     if (id === 'retry') {
//       this.dialogOpen = false;
//       // ✅ optional: retry submit or reload
//     }
//     if (id === 'cancel') {
//       this.dialogOpen = false;
//     }
//   }
// }
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ChangeDetectorRef, Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { AccordionComponent } from "../../shared/accordion/accordion.component";
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { SectionsRegistryService } from '../../shared/services/sections-registry.service';
import { NavbarThemeService } from '../../components/navbar/navbar-theme.service';
import { BehaviorSubject } from 'rxjs';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import { FaqsService } from './Faqs-service';
import { DialogButton, MessegeDialogComponent } from "../../shared/messege-dialog/messege-dialog.component";
import { SafeHtml } from '@angular/platform-browser';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

type FaqItem = {
  id: number;

  // ✅ دول للعرض حسب اللغة (accordion)
  question: string;
  answer: string;
  startOpen?: boolean;

  // ✅ دول للتخزين الدائم (عشان edit يشتغل صح)
  arQuestion?: string;
  arAnswer?: string;
  englishQuestion?: string;
  englishAnswer?: string;
};

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [CommonModule, AccordionComponent, TranslatePipe, ReactiveFormsModule, MessegeDialogComponent],
  templateUrl: './faqs.component.html',
  styleUrl: './faqs.component.scss',
})
export class FAQSComponent {
  FAQS: FaqItem[] = [];

  private visibilitySubject = new BehaviorSubject<'visible' | 'invisible'>('visible');
  visibility$ = this.visibilitySubject.asObservable();
  visibilityState: 'visible' | 'invisible' = 'visible';

  faqForm: FormGroup;
  lang: string;
  menuOpen = false;
  isBrowser: boolean;

  isAuthenticated = false;
  hasrole = false;
  role: any;
  EditFAQ: any;
  dialogOpen = false;
  blog: any;
  blogHtml: SafeHtml = '';
  dialogVariant: 'success' | 'error' = 'success';
  dialogTitle = '';
  dialogMessage = '';
  dialogButtons: DialogButton[] = [];

  loadingFaqs = true;

  // ✅ NEW: inline edit
  editingId: number | null = null;
  editForm: FormGroup;
  enableActions: boolean = false
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private navTheme: NavbarThemeService,
    private sectionsRegistry: SectionsRegistryService,
    private fb: FormBuilder,
    private faqsService: FaqsService,
    private translate: TranslateService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    // ✅ add form (زي ما هو عندك)
    this.faqForm = this.fb.group({
      faqs: this.fb.array([])
    });

    // ✅ NEW: edit form (inline)
    this.editForm = this.fb.group({
      question: ['', Validators.required],
      answer: ['', Validators.required],
      englishAnswer: ['', Validators.required],
      englishQuestion: ['', Validators.required],
    });

    this.lang = this.translate.currentLang || this.translate.defaultLang || 'ar';
    if (!this.isBrowser) return;

    this.isAuthenticated = this.faqsService.isAuthenticated();
    this.role = localStorage.getItem('role');
    this.hasrole = this.role ? true : false;
    this.enableActions = this.hasrole && this.isAuthenticated
    this.loadFaqs();
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    this.ngZone.runOutsideAngular(() => {
      this.navTheme.setColor('var(--primary)');
      this.navTheme.setBg('var(--white)');
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

  removeFaq(index: number) {
    this.faqs.removeAt(index);
  }

  onSubmit() {
    console.log(this.faqForm.value.faqs[0]);
    this.faqsService.AddFAQS(this.faqForm.value.faqs[0]).subscribe(() => {
      this.loadFaqs();
    });
  }

  onDeleteFaq(id: number) {
    this.faqsService.DeleteFAQ(id).subscribe({
      next: () => {
        this.dialogVariant = 'success';
        this.dialogTitle = 'Success';
        this.dialogMessage = 'FAQ deleted successfully';
        this.dialogButtons = [
          { id: 'cancel', text: 'Cancel', style: 'outline' },
          { id: 'retry', text: 'Try again', style: 'danger' },
        ];
        this.dialogOpen = true;

        // ✅ لو كنت بتعدل نفس العنصر واتمسح
        if (this.editingId === id) {
          this.cancelEdit();
        }

        this.loadFaqs();
      },
      error: (err: any) => {
        console.log(err);
        this.dialogVariant = 'error';
        this.dialogTitle = 'Error';
        this.dialogMessage = err?.error?.message;
        this.dialogButtons = [
          { id: 'cancel', text: 'Cancel', style: 'outline' },
          { id: 'retry', text: 'Try again', style: 'danger' },
        ];
        this.dialogOpen = true;
        this.loadingFaqs = false;
      },
    });
  }

  // ✅ NEW: لما تدوس edit على accordion
  onEditFaq(id: number) {
    const item = this.FAQS.find((f: any) => f.id === id);
    if (!item) return;
    this.startEdit(item);
  }

  // ✅ NEW: فتح inline edit لنفس شكل الفورم
  startEdit(faq: any) {
    this.editingId = faq.id;

    this.editForm.patchValue({
      question: faq.arQuestion ?? faq.question ?? '',
      answer: faq.arAnswer ?? faq.answer ?? '',
      englishQuestion: faq.englishQuestion ?? '',
      englishAnswer: faq.englishAnswer ?? '',
    });

    // لو تحب تعمل scroll للـ item وهو بيتعدل:
    // setTimeout(() => document.getElementById(`faq-edit-${faq.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 0);
  }

  // ✅ NEW: إلغاء
  cancelEdit() {
    this.editingId = null;
    this.editForm.reset();
  }

  // ✅ NEW: حفظ
  saveEdit() {
    if (this.editingId == null) return;

    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    const payload = this.editForm.value;

    this.faqsService.UpdateFAQ(this.editingId, payload).subscribe({
      next: () => {
        this.dialogVariant = 'success';
        this.dialogTitle = 'Success';
        this.dialogMessage = 'FAQ updated successfully';
        this.dialogButtons = [{ id: 'cancel', text: 'OK', style: 'outline' }];
        this.dialogOpen = true;

        this.editingId = null;
        this.editForm.reset();
        this.loadFaqs();
      },
      error: (err: any) => {
        this.dialogVariant = 'error';
        this.dialogTitle = 'Error';
        this.dialogMessage = err?.error?.message || 'Update failed';
        this.dialogButtons = [
          { id: 'cancel', text: 'Cancel', style: 'outline' },
          { id: 'retry', text: 'Try again', style: 'danger' },
        ];
        this.dialogOpen = true;
      },
    });
  }

  loadFaqs() {
    this.loadingFaqs = true;

    this.faqsService.GetAllFAQS().subscribe({
      next: (res: any) => {
        const list = res?.data ?? [];

        this.FAQS = list.map((faq: any) => ({
          id: faq.id,

          // ✅ نخزن الاتنين عشان edit يشتغل في كل الحالات
          arQuestion: faq.question,
          arAnswer: faq.answer,
          englishQuestion: faq.englishQuestion,
          englishAnswer: faq.englishAnswer,

          // ✅ دول للعرض حسب اللغة
          question: this.lang === 'ar' ? faq.question : faq.englishQuestion,
          answer: this.lang === 'ar' ? faq.answer : faq.englishAnswer,

          startOpen: false,
        }));

        // ✅ لو كنت بتعدل عنصر واتعمل reload والداتا لسه موجودة: حافظ على edit mode
        if (this.editingId != null) {
          const stillExists = this.FAQS.some(x => x.id === this.editingId);
          if (!stillExists) this.cancelEdit();
        }

        this.loadingFaqs = false;
      },
      error: () => {
        this.loadingFaqs = false;
      },
    });
  }

  onDialogAction(id: string) {
    if (id === 'show all') {
      this.dialogOpen = false;
    }
    if (id === 'show edited blog') {
      this.dialogOpen = false;
    }
    if (id === 'retry') {
      this.dialogOpen = false;
    }
    if (id === 'cancel') {
      this.dialogOpen = false;
    }
  }
}
