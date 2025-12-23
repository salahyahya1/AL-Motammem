// import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
// import { CommonModule, isPlatformBrowser } from '@angular/common';
// import {
//   ReactiveFormsModule,
//   FormBuilder,
//   FormGroup,
//   FormArray,
//   Validators
// } from '@angular/forms';

// @Component({
//   selector: 'app-create-blog',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './create-blog.component.html'
// })
// export class CreateBlogComponent implements OnInit, OnDestroy {
//   blogForm!: FormGroup;

//   // نخليه any عشان منستوردش EditorJS type فوق (SSR)
//   private editor: any = null;

//   private isBrowser: boolean;

//   constructor(
//     private fb: FormBuilder,
//     @Inject(PLATFORM_ID) platformId: object
//   ) {
//     this.isBrowser = isPlatformBrowser(platformId);
//     this.initForm();
//   }

//   ngOnInit() {
//     // مهم: متعملش initEditor على السيرفر
//     if (this.isBrowser) {
//       this.initEditor();
//     }
//   }

//   initForm() {
//     this.blogForm = this.fb.group({
//       title: ['', Validators.required],
//       metaTitle: [''],
//       url: [''],
//       mainImage: [''],
//       body: [''], // سيتم ملؤه من Editor.js عند الحفظ
//       category: ['Design'],
//       faqs: this.fb.array([])
//     });

//     this.addFaq();
//   }

//   get faqs() {
//     return this.blogForm.get('faqs') as FormArray;
//   }

//   addFaq() {
//     const faqGroup = this.fb.group({
//       question: [''],
//       englishQuestion: [''],
//       answer: [''],
//       englishAnswer: ['']
//     });
//     this.faqs.push(faqGroup);
//   }

//   removeFaq(index: number) {
//     this.faqs.removeAt(index);
//   }

//   private async initEditor() {
//     // Dynamic import (Browser only)
//     const [{ default: EditorJS }, { default: Header }, { default: List }] =
//       await Promise.all([
//         import('@editorjs/editorjs'),
//         import('@editorjs/header'),
//         import('@editorjs/list')
//       ]);

//     this.editor = new EditorJS({
//       holder: 'editorjs-container',
//       tools: {
//         header: {
//           class: Header as any,
//           inlineToolbar: ['link']
//         },
//         list: {
//           class: List as any,
//           inlineToolbar: true
//         }
//       },
//       placeholder: 'ابدأ بكتابة محتوى المقال هنا...'
//     });
//   }

//   async onSubmit() {
//     // لو SSR أو editor لسه متعملش init
//     if (!this.isBrowser || !this.editor) {
//       console.warn('Editor is not available (SSR or not initialized).');
//       return;
//     }

//     const savedData = await this.editor.save();

//     this.blogForm.patchValue({
//       body: JSON.stringify(savedData)
//     });

//     console.log('Final Payload for Backend:', this.blogForm.value);
//   }

//   ngOnDestroy() {
//     // destroy على المتصفح بس
//     if (this.isBrowser && this.editor) {
//       this.editor.destroy();
//       this.editor = null;
//     }
//   }
// }
