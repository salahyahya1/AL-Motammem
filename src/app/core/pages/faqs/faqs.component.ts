// import { CommonModule, isPlatformBrowser } from '@angular/common';
// import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
// import { ChangeDetectorRef, Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';
// import { AccordionComponent } from "../../shared/accordion/accordion.component";
// import { TranslatePipe, TranslateService } from '@ngx-translate/core';
// import { SectionsRegistryService } from '../../shared/services/sections-registry.service';
// import { NavbarThemeService } from '../../components/navbar/navbar-theme.service';
// import { BehaviorSubject } from 'rxjs';
// import gsap from 'gsap';
// import ScrollTrigger from 'gsap/ScrollTrigger';
// import ScrollToPlugin from 'gsap/ScrollToPlugin';
// import { FaqsService } from './Faqs-service';
// import { DialogButton, MessegeDialogComponent } from "../../shared/messege-dialog/messege-dialog.component";
// import { SafeHtml } from '@angular/platform-browser';

// gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// type FaqItem = {
//   id: number;

//   // ✅ دول للعرض حسب اللغة (accordion)
//   question: string;
//   answer: string;
//   startOpen?: boolean;

//   // ✅ دول للتخزين الدائم (عشان edit يشتغل صح)
//   arQuestion?: string;
//   arAnswer?: string;
//   englishQuestion?: string;
//   englishAnswer?: string;
// };

// @Component({
//   selector: 'app-faqs',
//   standalone: true,
//   imports: [CommonModule, AccordionComponent, TranslatePipe, ReactiveFormsModule, MessegeDialogComponent],
//   templateUrl: './faqs.component.html',
//   styleUrl: './faqs.component.scss',
// })
// export class FAQSComponent {
//   FAQS: FaqItem[] = [];

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
//   dialogVariant: 'success' | 'error' | 'warning' = 'success';
//   dialogTitle = '';
//   dialogMessage = '';
//   dialogButtons: DialogButton[] = [];

//   loadingFaqs = true;

//   // ✅ NEW: inline edit
//   editingId: number | null = null;
//   deletingId!: number;
//   editForm: FormGroup;
//   enableActions: boolean = false
//   constructor(
//     @Inject(PLATFORM_ID) private platformId: Object,
//     private ngZone: NgZone,
//     private cdr: ChangeDetectorRef,
//     private navTheme: NavbarThemeService,
//     private sectionsRegistry: SectionsRegistryService,
//     private fb: FormBuilder,
//     private faqsService: FaqsService,
//     private translate: TranslateService
//   ) {
//     this.isBrowser = isPlatformBrowser(this.platformId);

//     // ✅ add form (زي ما هو عندك)
//     this.faqForm = this.fb.group({
//       faqs: this.fb.array([])
//     });

//     // ✅ NEW: edit form (inline)
//     this.editForm = this.fb.group({
//       question: ['', Validators.required],
//       answer: ['', Validators.required],
//       englishAnswer: ['', Validators.required],
//       englishQuestion: ['', Validators.required],
//     });

//     this.lang = this.translate.currentLang || this.translate.defaultLang || 'ar';
//     if (this.isBrowser) {
//       this.isAuthenticated = this.faqsService.isAuthenticated();
//       this.role = localStorage.getItem('role');
//       this.hasrole = !!this.role;
//       this.enableActions = this.hasrole && this.isAuthenticated;
//     }
//     this.loadFaqs();
//   }

//   ngOnInit(): void {
//     if (!this.isBrowser) return;

//     this.ngZone.runOutsideAngular(() => {
//       this.navTheme.setColor('var(--primary)');
//       this.navTheme.setBg('var(--white)');
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

//   removeFaq(index: number) {
//     this.faqs.removeAt(index);
//   }

//   onSubmit() {
//     console.log(this.faqForm.value);
//     if (this.faqForm.value.faqs.length === 0) return;
//     for (let index = 0; index < this.faqForm.value.faqs.length; index++) {
//       const element = this.faqForm.value.faqs[index];
//       this.faqsService.AddFAQS(element).subscribe(() => {
//         this.loadFaqs();
//       });
//     }
//     // لحد مالباك يحل مشكله الاراي او اوبكتس
//     // this.faqsService.AddFAQS(this.faqForm.value.faqs).subscribe(() => {
//     //   this.loadFaqs();
//     // });
//   }
//   checkbeforeDelete(id: number) {
//     this.dialogVariant = 'warning';
//     this.dialogTitle = '';
//     this.dialogMessage = 'Are you sure you want to delete this FAQ?';
//     this.dialogButtons = [
//       { id: 'cancel', text: 'Cancel', style: 'outline' },
//       { id: 'show all', text: 'ok', style: 'primary' },
//     ];
//     this.dialogOpen = true;
//     this.deletingId = id;
//     // افتكر صلح مكان الدايلوج 
//   }
//   onDeleteFaq(id: number) {
//     this.faqsService.DeleteFAQ(id).subscribe({
//       next: () => {
//         this.dialogVariant = 'success';
//         this.dialogTitle = 'Success';
//         this.dialogMessage = 'FAQ deleted successfully';
//         this.dialogButtons = [
//           { id: 'cancel', text: 'Cancel', style: 'outline' },
//           { id: 'sureOfDelete', text: 'ok', style: 'primary' },
//         ];
//         this.dialogOpen = true;

//         // ✅ لو كنت بتعدل نفس العنصر واتمسح
//         if (this.editingId === id) {
//           this.cancelEdit();
//         }

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
//     });
//   }

//   // ✅ NEW: لما تدوس edit على accordion
//   onEditFaq(id: number) {
//     const item = this.FAQS.find((f: any) => f.id === id);
//     if (!item) return;
//     this.startEdit(item);
//   }

//   // ✅ NEW: فتح inline edit لنفس شكل الفورم
//   startEdit(faq: any) {
//     this.editingId = faq.id;

//     this.editForm.patchValue({
//       question: faq.arQuestion ?? faq.question ?? '',
//       answer: faq.arAnswer ?? faq.answer ?? '',
//       englishQuestion: faq.englishQuestion ?? '',
//       englishAnswer: faq.englishAnswer ?? '',
//     });

//     // لو تحب تعمل scroll للـ item وهو بيتعدل:
//     // setTimeout(() => document.getElementById(`faq-edit-${faq.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 0);
//   }

//   // ✅ NEW: إلغاء
//   cancelEdit() {
//     this.editingId = null;
//     this.editForm.reset();
//   }

//   // ✅ NEW: حفظ
//   saveEdit() {
//     if (this.editingId == null) return;

//     if (this.editForm.invalid) {
//       this.editForm.markAllAsTouched();
//       return;
//     }

//     const payload = this.editForm.value;

//     this.faqsService.UpdateFAQ(this.editingId, payload).subscribe({
//       next: () => {
//         this.dialogVariant = 'success';
//         this.dialogTitle = 'Success';
//         this.dialogMessage = 'FAQ updated successfully';
//         this.dialogButtons = [{ id: 'cancel', text: 'OK', style: 'outline' }];
//         this.dialogOpen = true;

//         this.editingId = null;
//         this.editForm.reset();
//         this.loadFaqs();
//       },
//       error: (err: any) => {
//         this.dialogVariant = 'error';
//         this.dialogTitle = 'Error';
//         this.dialogMessage = err?.error?.message || 'Update failed';
//         this.dialogButtons = [
//           { id: 'cancel', text: 'Cancel', style: 'outline' },
//           { id: 'retry', text: 'Try again', style: 'danger' },
//         ];
//         this.dialogOpen = true;
//       },
//     });
//   }

//   loadFaqs() {
//     this.loadingFaqs = true;

//     this.faqsService.GetAllFAQS().subscribe({
//       next: (res: any) => {
//         const list = res?.data ?? [];

//         this.FAQS = list.map((faq: any) => ({
//           id: faq.id,

//           // ✅ نخزن الاتنين عشان edit يشتغل في كل الحالات
//           arQuestion: faq.question,
//           arAnswer: faq.answer,
//           englishQuestion: faq.englishQuestion,
//           englishAnswer: faq.englishAnswer,

//           // ✅ دول للعرض حسب اللغة
//           question: this.lang === 'ar' ? faq.question : faq.englishQuestion,
//           answer: this.lang === 'ar' ? faq.answer : faq.englishAnswer,

//           startOpen: false,
//         }));

//         // ✅ لو كنت بتعدل عنصر واتعمل reload والداتا لسه موجودة: حافظ على edit mode
//         if (this.editingId != null) {
//           const stillExists = this.FAQS.some(x => x.id === this.editingId);
//           if (!stillExists) this.cancelEdit();
//         }

//         this.loadingFaqs = false;
//       },
//       error: () => {
//         this.loadingFaqs = false;
//       },
//     });
//   }

//   onDialogAction(id: string) {
//     if (id === 'show all') {
//       this.dialogOpen = false;
//     }
//     if (id === 'show edited blog') {
//       this.dialogOpen = false;
//     }
//     if (id === 'retry') {
//       this.dialogOpen = false;
//     }
//     if (id === 'cancel') {
//       this.dialogOpen = false;
//     }
//     if (id === 'sureOfDelete') {
//       this.dialogOpen = false;
//       this.onDeleteFaq(this.deletingId);
//     }
//   }
// }
// import { CommonModule, isPlatformBrowser } from '@angular/common';
// import {
//   ReactiveFormsModule,
//   FormBuilder,
//   FormGroup,
//   FormArray,
//   Validators
// } from '@angular/forms';
// import {
//   ChangeDetectorRef,
//   Component,
//   Inject,
//   NgZone,
//   PLATFORM_ID
// } from '@angular/core';
// import { AccordionComponent } from "../../shared/accordion/accordion.component";
// import { TranslatePipe, TranslateService } from '@ngx-translate/core';
// import { SectionsRegistryService } from '../../shared/services/sections-registry.service';
// import { NavbarThemeService } from '../../components/navbar/navbar-theme.service';
// import { BehaviorSubject } from 'rxjs';
// import gsap from 'gsap';
// import ScrollTrigger from 'gsap/ScrollTrigger';
// import ScrollToPlugin from 'gsap/ScrollToPlugin';
// import { FaqsService } from './Faqs-service';
// import {
//   DialogButton,
//   MessegeDialogComponent
// } from "../../shared/messege-dialog/messege-dialog.component";
// import { SafeHtml } from '@angular/platform-browser';
// import { TransferState, makeStateKey } from '@angular/core';

// gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// type FaqItem = {
//   id: number;

//   // ✅ دول للعرض حسب اللغة (accordion)
//   question: string;
//   answer: string;
//   startOpen?: boolean;

//   // ✅ دول للتخزين الدائم (عشان edit يشتغل صح)
//   arQuestion?: string;
//   arAnswer?: string;
//   englishQuestion?: string;
//   englishAnswer?: string;
// };

// const FAQS_GENERAL_KEY = makeStateKey<FaqItem[]>('faqs_general_v1');

// @Component({
//   selector: 'app-faqs',
//   standalone: true,
//   imports: [CommonModule, AccordionComponent, TranslatePipe, ReactiveFormsModule, MessegeDialogComponent],
//   templateUrl: './faqs.component.html',
//   styleUrl: './faqs.component.scss',
// })
// export class FAQSComponent {
//   FAQS: FaqItem[] = [];

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

//   dialogVariant: 'success' | 'error' | 'warning' = 'success';
//   dialogTitle = '';
//   dialogMessage = '';
//   dialogButtons: DialogButton[] = [];

//   loadingFaqs = true;

//   // ✅ NEW: inline edit
//   editingId: number | null = null;
//   deletingId!: number;
//   editForm: FormGroup;
//   enableActions: boolean = false;

//   // ✅ SEO (FAQ Schema)
//   faqSchemaJson = '';

//   constructor(
//     @Inject(PLATFORM_ID) private platformId: Object,
//     private ngZone: NgZone,
//     private cdr: ChangeDetectorRef,
//     private navTheme: NavbarThemeService,
//     private sectionsRegistry: SectionsRegistryService,
//     private fb: FormBuilder,
//     private faqsService: FaqsService,
//     private translate: TranslateService,
//     private transferState: TransferState
//   ) {
//     this.isBrowser = isPlatformBrowser(this.platformId);

//     // ✅ add form (زي ما هو عندك)
//     this.faqForm = this.fb.group({
//       faqs: this.fb.array([])
//     });

//     // ✅ edit form (inline)
//     this.editForm = this.fb.group({
//       question: ['', Validators.required],
//       answer: ['', Validators.required],
//       englishAnswer: ['', Validators.required],
//       englishQuestion: ['', Validators.required],
//     });

//     this.lang = this.translate.currentLang || this.translate.defaultLang || 'ar';

//     // ✅ browser-only (localStorage / role)
//     if (this.isBrowser) {
//       this.isAuthenticated = this.faqsService.isAuthenticated();
//       this.role = localStorage.getItem('role');
//       this.hasrole = !!this.role;
//       this.enableActions = this.hasrole && this.isAuthenticated;
//     }

//     // ✅ IMPORTANT: load on server + browser
//     this.loadFaqs();
//   }

//   ngOnInit(): void {
//     if (!this.isBrowser) return;

//     this.ngZone.runOutsideAngular(() => {
//       this.navTheme.setColor('var(--primary)');
//       this.navTheme.setBg('var(--white)');
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

//   removeFaq(index: number) {
//     this.faqs.removeAt(index);
//   }

//   onSubmit() {
//     if (this.faqForm.value.faqs.length === 0) return;

//     for (let index = 0; index < this.faqForm.value.faqs.length; index++) {
//       const element = this.faqForm.value.faqs[index];
//       this.faqsService.AddFAQS(element).subscribe(() => {
//         this.loadFaqs();
//       });
//     }
//   }

//   checkbeforeDelete(id: number) {
//     this.dialogVariant = 'warning';
//     this.dialogTitle = '';
//     this.dialogMessage = 'Are you sure you want to delete this FAQ?';
//     this.dialogButtons = [
//       { id: 'cancel', text: 'Cancel', style: 'outline' },
//     { id: 'sureOfDelete', text: 'ok', style: 'primary' },
//     ];
//     this.dialogOpen = true;
//     this.deletingId = id;
//   }

//   onDeleteFaq(id: number) {
//     this.faqsService.DeleteFAQ(id).subscribe({
//       next: () => {
//         this.dialogVariant = 'success';
//         this.dialogTitle = 'Success';
//         this.dialogMessage = 'FAQ deleted successfully';
//         this.dialogButtons = [
//           // { id: 'cancel', text: 'Cancel', style: 'outline' },
//           { id: 'show all', text: 'ok', style: 'primary' },
//         ];
//         this.dialogOpen = true;

//         if (this.editingId === id) {
//           this.cancelEdit();
//         }

//         this.transferState.remove(FAQS_GENERAL_KEY);
//         this.loadFaqs(true); 
//       },
//       error: (err: any) => {
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
//     });
//   }

//   onEditFaq(id: number) {
//     const item = this.FAQS.find((f: any) => f.id === id);
//     if (!item) return;
//     this.startEdit(item);
//   }

//   startEdit(faq: any) {
//     this.editingId = faq.id;

//     this.editForm.patchValue({
//       question: faq.arQuestion ?? faq.question ?? '',
//       answer: faq.arAnswer ?? faq.answer ?? '',
//       englishQuestion: faq.englishQuestion ?? '',
//       englishAnswer: faq.englishAnswer ?? '',
//     });
//   }

//   cancelEdit() {
//     this.editingId = null;
//     this.editForm.reset();
//   }

//   saveEdit() {
//     if (this.editingId == null) return;

//     if (this.editForm.invalid) {
//       this.editForm.markAllAsTouched();
//       return;
//     }

//     const payload = this.editForm.value;

//     this.faqsService.UpdateFAQ(this.editingId, payload).subscribe({
//       next: () => {
//         this.dialogVariant = 'success';
//         this.dialogTitle = 'Success';
//         this.dialogMessage = 'FAQ updated successfully';
//         this.dialogButtons = [{ id: 'cancel', text: 'OK', style: 'outline' }];
//         this.dialogOpen = true;

//         this.editingId = null;
//         this.editForm.reset();
//         this.transferState.remove(FAQS_GENERAL_KEY);
//         this.loadFaqs(true);
//       },
//       error: (err: any) => {
//         this.dialogVariant = 'error';
//         this.dialogTitle = 'Error';
//         this.dialogMessage = err?.error?.message || 'Update failed';
//         this.dialogButtons = [
//           { id: 'cancel', text: 'Cancel', style: 'outline' },
//           { id: 'retry', text: 'Try again', style: 'danger' },
//         ];
//         this.dialogOpen = true;
//       },
//     });
//   }

//   loadFaqs(forceNetwork: boolean = false) {
//     // ✅ 1) استخدم TransferState مرة واحدة فقط (عند الهيدرشن)
//     if (!forceNetwork) {
//       const cached = this.transferState.get(FAQS_GENERAL_KEY, null as any);
//       if (cached && Array.isArray(cached) && cached.length) {
//         this.FAQS = cached;
//         this.loadingFaqs = false;
  
//         // ✅ مهم جدًا: امسحها بعد الاستخدام عشان متفضلش ماسكة القديم
//         this.transferState.remove(FAQS_GENERAL_KEY);
  
//         this.updateFaqSchema();
//         return;
//       }
//     }
  
//     this.loadingFaqs = true;
  
//     this.faqsService.GetAllFAQS().subscribe({
//       next: (res: any) => {
//         const list = res?.data ?? [];
  
//         this.FAQS = list.map((faq: any) => ({
//           id: faq.id,
  
//           arQuestion: faq.question,
//           arAnswer: faq.answer,
//           englishQuestion: faq.englishQuestion,
//           englishAnswer: faq.englishAnswer,
  
//           question: this.lang === 'ar' ? faq.question : faq.englishQuestion,
//           answer: this.lang === 'ar' ? faq.answer : faq.englishAnswer,
  
//           startOpen: false,
//         }));
  
//         // ✅ 2) خزن في TransferState على السيرفر فقط
//         if (!this.isBrowser) {
//           this.transferState.set(FAQS_GENERAL_KEY, this.FAQS);
//         }
  
//         // ✅ لو كنت بتعدل item واتمسح من السيرفر
//         if (this.editingId != null) {
//           const stillExists = this.FAQS.some(x => x.id === this.editingId);
//           if (!stillExists) this.cancelEdit();
//         }
  
//         this.loadingFaqs = false;
//         this.updateFaqSchema();
//       },
//       error: () => {
//         this.loadingFaqs = false;
//       },
//     });
//   }
  

//   // ✅ SEO: Generate FAQPage JSON-LD
//   private updateFaqSchema() {
//     if (!this.FAQS || this.FAQS.length === 0) {
//       this.faqSchemaJson = '';
//       return;
//     }

//     // Schema لازم يكون نص plain (بدون HTML tags)
//     const mainEntity = this.FAQS.map(f => ({
//       "@type": "Question",
//       "name": (f.question || '').toString(),
//       "acceptedAnswer": {
//         "@type": "Answer",
//         "text": (f.answer || '').toString()
//       }
//     }));

//     this.faqSchemaJson = JSON.stringify({
//       "@context": "https://schema.org",
//       "@type": "FAQPage",
//       "mainEntity": mainEntity
//     });
//   }

//   onDialogAction(id: string) {
//     if (id === 'show all') {
//       this.dialogOpen = false;
//     }
//     if (id === 'show edited blog') {
//       this.dialogOpen = false;
//     }
//     if (id === 'retry') {
//       this.dialogOpen = false;
//     }
//     if (id === 'cancel') {
//       this.dialogOpen = false;
//     }
//     if (id === 'sureOfDelete') {
//       this.dialogOpen = false;
//       this.onDeleteFaq(this.deletingId);
//     }
//   }
// }
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators
} from '@angular/forms';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  NgZone,
  PLATFORM_ID
} from '@angular/core';
import { AccordionComponent } from "../../shared/accordion/accordion.component";
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { SectionsRegistryService } from '../../shared/services/sections-registry.service';
import { NavbarThemeService } from '../../components/navbar/navbar-theme.service';
import { BehaviorSubject } from 'rxjs';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import { FaqsService } from './Faqs-service';
import {
  DialogButton,
  MessegeDialogComponent
} from "../../shared/messege-dialog/messege-dialog.component";
import { SafeHtml } from '@angular/platform-browser';
import { TransferState, makeStateKey } from '@angular/core';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

type FaqItem = {
  id: number;

  // ✅ للعرض حسب اللغة
  question: string;
  answer: string;
  startOpen?: boolean;

  // ✅ للتخزين الدائم (للـ edit)
  arQuestion?: string;
  arAnswer?: string;
  englishQuestion?: string;
  englishAnswer?: string;
};

const FAQS_GENERAL_KEY = makeStateKey<FaqItem[]>('faqs_general_v1');

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [
    CommonModule,
    AccordionComponent,
    TranslatePipe,
    ReactiveFormsModule,
    MessegeDialogComponent
  ],
  templateUrl: './faqs.component.html',
  styleUrl: './faqs.component.scss',
})
export class FAQSComponent {
  FAQS: FaqItem[] = [];

  private visibilitySubject = new BehaviorSubject<'visible' | 'invisible'>('visible');
  visibility$ = this.visibilitySubject.asObservable();
  visibilityState: 'visible' | 'invisible' = 'visible';

  faqForm: FormGroup;
  editForm: FormGroup;

  lang: string;
  menuOpen = false;
  isBrowser: boolean;

  isAuthenticated = false;
  hasrole = false;
  role: any;
  enableActions: boolean = false;

  dialogOpen = false;
  blog: any;
  blogHtml: SafeHtml = '';

  dialogVariant: 'success' | 'error' | 'warning' = 'success';
  dialogTitle = '';
  dialogMessage = '';
  dialogButtons: DialogButton[] = [];

  loadingFaqs = true;

  // ✅ inline edit
  editingId: number | null = null;
  deletingId!: number;

  // ✅ SEO (FAQ Schema)
  faqSchemaJson = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private navTheme: NavbarThemeService,
    private sectionsRegistry: SectionsRegistryService,
    private fb: FormBuilder,
    private faqsService: FaqsService,
    private translate: TranslateService,
    private transferState: TransferState
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    // ✅ add form
    this.faqForm = this.fb.group({
      faqs: this.fb.array([])
    });

    // ✅ edit form (inline)
    this.editForm = this.fb.group({
      question: ['', Validators.required],
      answer: ['', Validators.required],
      englishAnswer: ['', Validators.required],
      englishQuestion: ['', Validators.required],
    });

    this.lang = this.translate.currentLang || this.translate.defaultLang || 'ar';

    // ✅ browser-only (localStorage / role)
    if (this.isBrowser) {
      this.isAuthenticated = this.faqsService.isAuthenticated();
      this.role = localStorage.getItem('role');
      this.hasrole = !!this.role;
      this.enableActions = this.hasrole && this.isAuthenticated;
    }

    // ✅ load on server + browser
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
    if (this.faqForm.value.faqs.length === 0) return;

    for (let index = 0; index < this.faqForm.value.faqs.length; index++) {
      const element = this.faqForm.value.faqs[index];
      this.faqsService.AddFAQS(element).subscribe(() => {
        // بعد الإضافة نجيب من الشبكة
          this.faqForm.reset();
          this.faqs.clear();
        this.transferState.remove(FAQS_GENERAL_KEY);
        this.loadFaqs(true);
      });
    }
  }

  // ===================== DELETE =====================

  checkbeforeDelete(id: number) {
    this.dialogVariant = 'warning';
    this.dialogTitle = '';
    this.dialogMessage = 'Are you sure you want to delete this FAQ?';
    this.dialogButtons = [
      { id: 'cancel', text: 'Cancel', style: 'outline' },
      { id: 'sureOfDelete', text: 'ok', style: 'primary' },
    ];
    this.dialogOpen = true;
    this.deletingId = id;
  }

  private onDeleteFaq(id: number) {
    this.faqsService.DeleteFAQ(id).subscribe({
      next: () => {
        // ✅ لو كنت بتعدل نفس العنصر واتمسح
        if (this.editingId === id) {
          this.cancelEdit();
        }

        this.dialogVariant = 'success';
        this.dialogTitle = 'Success';
        this.dialogMessage = 'FAQ deleted successfully';
        this.dialogButtons = [
          { id: 'cancel', text: 'OK', style: 'outline' }
        ];
        this.dialogOpen = true;

        // ✅ force network + remove transfer cache
        this.transferState.remove(FAQS_GENERAL_KEY);
        this.loadFaqs(true);
      },
      error: (err: any) => {
        this.dialogVariant = 'error';
        this.dialogTitle = 'Error';
        this.dialogMessage = err?.error?.message || 'Delete failed';
        this.dialogButtons = [
          { id: 'cancel', text: 'Cancel', style: 'outline' },
          { id: 'retryDelete', text: 'Try again', style: 'danger' },
        ];
        this.dialogOpen = true;
        this.loadingFaqs = false;
      },
    });
  }

  // ===================== EDIT =====================

  onEditFaq(id: number) {
    const item = this.FAQS.find((f: any) => f.id === id);
    if (!item) return;
    this.startEdit(item);
  }

  startEdit(faq: any) {
    this.editingId = faq.id;

    this.editForm.patchValue({
      question: faq.arQuestion ?? faq.question ?? '',
      answer: faq.arAnswer ?? faq.answer ?? '',
      englishQuestion: faq.englishQuestion ?? '',
      englishAnswer: faq.englishAnswer ?? '',
    });
  }

  cancelEdit() {
    this.editingId = null;
    this.editForm.reset();
  }

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

        // ✅ force network + remove transfer cache
        this.transferState.remove(FAQS_GENERAL_KEY);
        this.loadFaqs(true);
      },
      error: (err: any) => {
        this.dialogVariant = 'error';
        this.dialogTitle = 'Error';
        this.dialogMessage = err?.error?.message || 'Update failed';
        this.dialogButtons = [
          { id: 'cancel', text: 'Cancel', style: 'outline' },
          { id: 'retryEdit', text: 'Try again', style: 'danger' },
        ];
        this.dialogOpen = true;
      },
    });
  }

  // ===================== LOAD =====================

  loadFaqs(forceNetwork: boolean = false) {
    // ✅ 1) استخدم TransferState مرة واحدة فقط (عند الهيدرشن)
    if (!forceNetwork) {
      const cached = this.transferState.get(FAQS_GENERAL_KEY, null as any);
      if (cached && Array.isArray(cached) && cached.length) {
        this.FAQS = cached;
        this.loadingFaqs = false;

        // ✅ امسحها بعد الاستخدام
        this.transferState.remove(FAQS_GENERAL_KEY);

        this.updateFaqSchema();
        return;
      }
    }

    this.loadingFaqs = true;

    this.faqsService.GetAllFAQS().subscribe({
      next: (res: any) => {
        const list = res?.data ?? [];

        this.FAQS = list.map((faq: any) => ({
          id: faq.id,

          arQuestion: faq.question,
          arAnswer: faq.answer,
          englishQuestion: faq.englishQuestion,
          englishAnswer: faq.englishAnswer,

          question: this.lang === 'ar' ? faq.question : faq.englishQuestion,
          answer: this.lang === 'ar' ? faq.answer : faq.englishAnswer,

          startOpen: false,
        }));

        // ✅ 2) خزن في TransferState على السيرفر فقط
        if (!this.isBrowser) {
          this.transferState.set(FAQS_GENERAL_KEY, this.FAQS);
        }

        // ✅ لو كنت بتعدل item واتمسح من السيرفر
        if (this.editingId != null) {
          const stillExists = this.FAQS.some(x => x.id === this.editingId);
          if (!stillExists) this.cancelEdit();
        }

        this.loadingFaqs = false;
        this.updateFaqSchema();
      },
      error: () => {
        this.loadingFaqs = false;
      },
    });
  }

  // ===================== SEO =====================

  private updateFaqSchema() {
    if (!this.FAQS || this.FAQS.length === 0) {
      this.faqSchemaJson = '';
      return;
    }

    const mainEntity = this.FAQS.map(f => ({
      "@type": "Question",
      "name": (f.question || '').toString(),
      "acceptedAnswer": {
        "@type": "Answer",
        "text": (f.answer || '').toString()
      }
    }));

    this.faqSchemaJson = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": mainEntity
    });
  }

  // ===================== DIALOG =====================

  onDialogAction(id: string) {
    if (id === 'cancel') {
      this.dialogOpen = false;
      return;
    }

    if (id === 'sureOfDelete') {
      this.dialogOpen = false;
      this.onDeleteFaq(this.deletingId);
      return;
    }

    if (id === 'retryDelete') {
      this.dialogOpen = false;
      this.onDeleteFaq(this.deletingId);
      return;
    }

    if (id === 'retryEdit') {
      this.dialogOpen = false;
      // مفيش payload محفوظ، المستخدم هيضغط Save تاني
      return;
    }
  }
}

