// import { AfterViewInit, Component, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
// import { CommonModule, isPlatformBrowser } from '@angular/common';
// import { ReactiveFormsModule, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import { firstValueFrom } from 'rxjs';
// import { BlogsService } from '../services/blogs-service';
// import { DialogButton, MessegeDialogComponent } from "../../../shared/messege-dialog/messege-dialog.component";
// import { SafeHtml } from '@angular/platform-browser';

// type UploadImageResponse = {
//   success: boolean;
//   imageUrl: string;
// };

// @Component({
//   selector: 'app-edit-blog',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, MessegeDialogComponent],
//   templateUrl: './edit-blog.component.html',
//   styleUrl: './edit-blog.component.scss'
// })
// export class EditBlogComponent implements AfterViewInit, OnDestroy {
//   blogForm!: FormGroup;

//   // ✅ loading / error like view
//   loading = true;
//   errorMsg = '';

//   // dialog
//   dialogOpen = false;
//   blog: any;
//   blogHtml: SafeHtml = '';
//   dialogVariant: 'success' | 'error' = 'success';
//   dialogTitle = '';
//   dialogMessage = '';
//   dialogButtons: DialogButton[] = [];

//   openSuccess() {
//     this.dialogVariant = 'success';
//     this.dialogTitle = 'تم حفظ التعديلات علي المقال بنجاح ';
//     this.dialogMessage = '';
//     this.dialogButtons = [
//       { id: 'show all', text: 'عرض كل المقالات', style: 'primary' },
//       { id: 'show edited blog', text: 'عرض المقاله بعد التعديل', style: 'outline' }
//     ];
//     this.dialogOpen = true;
//   }

//   openFail() {
//     this.dialogVariant = 'error';
//     this.dialogTitle = 'تعذر حفظ التعديلات';
//     this.dialogMessage = 'حاول مرة أخرى أو تواصل مع الدعم.';
//     this.dialogButtons = [
//       { id: 'cancel', text: 'Cancel', style: 'outline' },
//       { id: 'retry', text: 'Try again', style: 'danger' },
//     ];
//     this.dialogOpen = true;
//   }

//   onDialogAction(id: string) {
//     if (id === 'show all') {
//       this.dialogOpen = false;
//       this.router.navigate(['/blogs']);
//     }
//     if (id === 'show edited blog') {
//       this.dialogOpen = false;
//       this.router.navigate(['/blogs/blog', this.routeUrlParam]);
//     }
//     if (id === 'retry') {
//       this.dialogOpen = false;
//       // ✅ optional: retry submit or reload
//     }
//     if (id === 'cancel') {
//       this.dialogOpen = false;
//     }
//   }

//   private editor: any = null;
//   private isBrowser: boolean;

//   private routeUrlParam = '';
//   private loadedBlog: any = null;

//   // main image
//   private mainImageFile: File | null = null;
//   mainImageObjectUrl: string | null = null;

//   isSubmitting = false;
//   private readonly SERVER_ORIGIN = 'https://almotammem-server.onrender.com';

//   constructor(
//     private fb: FormBuilder,
//     private blogsService: BlogsService,
//     private route: ActivatedRoute,
//     private router: Router,
//     @Inject(PLATFORM_ID) platformId: object
//   ) {
//     this.isBrowser = isPlatformBrowser(platformId);
//     this.initForm();
//   }

//   async ngAfterViewInit(): Promise<void> {
//     if (!this.isBrowser) return;

//     this.loading = true;
//     this.errorMsg = '';

//     try {
//       this.routeUrlParam = (this.route.snapshot.paramMap.get('url') ?? '').trim();
//       if (!this.routeUrlParam) {
//         this.errorMsg = 'الرابط غير صحيح';
//         return;
//       }

//       // 1) load blog (draft -> api)
//       await this.loadBlogForEdit(this.routeUrlParam);

//       if (!this.loadedBlog) {
//         this.errorMsg = 'تعذر تحميل المقال';
//         return;
//       }

//       // keep for template if needed
//       this.blog = this.loadedBlog;

//       // 2) patch
//       this.patchFormFromLoaded(this.loadedBlog);

//       // 3) init editor
//       await this.initEditor(this.loadedBlog?.body);

//     } catch (e) {
//       console.error(e);
//       this.errorMsg = 'تعذر تحميل المقال';
//     } finally {
//       this.loading = false;
//     }
//   }

//   private initForm(): void {
//     this.blogForm = this.fb.group({
//       title: ['', Validators.required],
//       metaTitle: [''],
//       metaDescription: [''],
//       category: ['general'],

//       arabicUrl: ['', Validators.required],
//       englishUrl: [''],

//       altText: [''],

//       faqs: this.fb.array([]),
//     });
//   }

//   get faqs(): FormArray {
//     return this.blogForm.get('faqs') as FormArray;
//   }

//   addFaq(initial?: any): void {
//     this.faqs.push(
//       this.fb.group({
//         question: [initial?.question ?? ''],
//         englishQuestion: [initial?.englishQuestion ?? ''],
//         answer: [initial?.answer ?? ''],
//         englishAnswer: [initial?.englishAnswer ?? '']
//       })
//     );
//   }

//   removeFaq(index: number): void {
//     this.faqs.removeAt(index);
//   }

//   onMainImageChange(e: Event): void {
//     const input = e.target as HTMLInputElement;
//     const file = input.files?.[0] ?? null;
//     this.mainImageFile = file;

//     if (this.isBrowser) {
//       if (this.mainImageObjectUrl?.startsWith('blob:')) {
//         URL.revokeObjectURL(this.mainImageObjectUrl);
//       }
//       this.mainImageObjectUrl = file ? URL.createObjectURL(file) : null;
//     }
//   }

//   private absoluteUrl(pathOrUrl: string): string {
//     if (!pathOrUrl) return pathOrUrl;
//     if (pathOrUrl.startsWith('http')) return pathOrUrl;
//     return `${this.SERVER_ORIGIN}${pathOrUrl}`;
//   }

//   private async loadBlogForEdit(urlFromRoute: string): Promise<void> {
//     // local draft
//     if (this.isBrowser) {
//       const key = `blog:draft:${urlFromRoute}`;
//       const raw = localStorage.getItem(key);
//       if (raw) {
//         this.loadedBlog = JSON.parse(raw);
//         return;
//       }
//     }

//     // api
//     const res: any = await firstValueFrom(this.blogsService.getBlogByName(urlFromRoute));
//     this.loadedBlog = res?.data ?? null;
//   }

//   private patchFormFromLoaded(blog: any): void {
//     if (!blog) return;

//     this.blogForm.patchValue({
//       title: blog.title ?? '',
//       metaDescription: blog.metaDescription ?? '',
//       metaTitle: blog.metaTitle ?? '',
//       category: blog.category ?? 'general',
//       altText: blog.altText ?? '',
//       arabicUrl: blog.url ?? this.routeUrlParam,
//       englishUrl: blog.englishURL ?? '',
//     });

//     this.faqs.clear();
//     const arr = Array.isArray(blog.faqs) ? blog.faqs : [];
//     if (arr.length) arr.forEach((f: any) => this.addFaq(f));
//     else this.addFaq();

//     const img = blog.mainImage ?? '';
//     if (img) this.mainImageObjectUrl = img.startsWith('blob:') ? img : this.absoluteUrl(img);
//     else this.mainImageObjectUrl = null;
//   }

//   private parseEditorBody(body: any): any {
//     if (!body) return undefined;

//     if (typeof body === 'object') return body;

//     try {
//       const parsed = JSON.parse(body);
//       if (parsed?.blocks && Array.isArray(parsed.blocks)) return parsed;

//       return {
//         time: Date.now(),
//         blocks: [{ type: 'paragraph', data: { text: this.objectToText(parsed) } }],
//         version: '2.0.0'
//       };
//     } catch {
//       return {
//         time: Date.now(),
//         blocks: [{ type: 'paragraph', data: { text: String(body) } }],
//         version: '2.0.0'
//       };
//     }
//   }

//   private objectToText(obj: any): string {
//     if (!obj || typeof obj !== 'object') return String(obj ?? '');
//     return Object.entries(obj).map(([k, v]) => `${k}: ${String(v)}`).join('<br/>');
//   }

//   private async uploadEditorImage(file: File) {
//     const fd = new FormData();
//     fd.append('image', file);

//     const resp = await firstValueFrom(this.blogsService.UploadImage(fd)) as UploadImageResponse;
//     if (!resp?.success || !resp?.imageUrl) throw new Error('UploadImage: invalid response');

//     return { success: 1, file: { url: this.absoluteUrl(resp.imageUrl) } };
//   }

//   private async initEditor(body: any): Promise<void> {
//     const holderEl = document.getElementById('editorjs-container');
//     if (!holderEl) return;

//     const initialData = this.parseEditorBody(body);

//     const [
//       { default: EditorJS },
//       { default: Header },
//       { default: List },
//       { default: Paragraph },
//       { default: Checklist },
//       { default: Quote },
//       { default: Table },
//       { default: Delimiter },
//       { default: Code },
//       { default: Warning },
//       { default: Marker },
//       { default: InlineCode },
//       { default: Embed },
//       { default: ImageTool }
//     ] = await Promise.all([
//       import('@editorjs/editorjs'),
//       import('@editorjs/header'),
//       import('@editorjs/list'),
//       import('@editorjs/paragraph'),
//       import('@editorjs/checklist'),
//       import('@editorjs/quote'),
//       import('@editorjs/table'),
//       import('@editorjs/delimiter'),
//       import('@editorjs/code'),
//       import('@editorjs/warning'),
//       import('@editorjs/marker'),
//       import('@editorjs/inline-code'),
//       import('@editorjs/embed'),
//       import('@editorjs/image')
//     ]);

//     const tools: Record<string, any> = {
//       paragraph: { class: Paragraph, inlineToolbar: ['bold', 'italic', 'marker', 'link'] },
//       header: { class: Header, inlineToolbar: ['bold', 'italic', 'marker', 'link'] },
//       list: { class: List, inlineToolbar: true },
//       checklist: { class: Checklist, inlineToolbar: true },
//       quote: { class: Quote, inlineToolbar: true },
//       table: { class: Table, inlineToolbar: true },
//       delimiter: Delimiter,
//       code: Code,
//       warning: { class: Warning, inlineToolbar: true },
//       marker: Marker,
//       inlineCode: InlineCode,
//       embed: { class: Embed, config: { services: { youtube: true, instagram: true, twitter: true, facebook: true } } },
//       image: {
//         class: ImageTool,
//         config: {
//           captionPlaceholder: 'وصف للصورة...',
//           uploader: { uploadByFile: (file: File) => this.uploadEditorImage(file) }
//         }
//       }
//     };

//     if (this.editor) {
//       try { this.editor.destroy(); } catch { }
//       this.editor = null;
//     }

//     this.editor = new (EditorJS as any)({
//       holder: 'editorjs-container',
//       autofocus: true,
//       placeholder: 'ابدأ بكتابة محتوى المقال هنا...',
//       inlineToolbar: true,
//       tools: tools as any,
//       data: initialData
//     });

//     // ✅ optional: لو تحب تتأكد انه جهز قبل ما نشيل loading
//     await this.editor.isReady;
//   }

//   async onSubmit(): Promise<void> {
//     if (!this.isBrowser || !this.editor) return;
//     if (this.isSubmitting) return;

//     if (this.blogForm.invalid) {
//       this.blogForm.markAllAsTouched();
//       return;
//     }

//     this.isSubmitting = true;

//     try {
//       await this.editor.isReady;
//       const savedData = await this.editor.save();

//       const id = this.loadedBlog?.id ?? null;

//       const arabicUrl = String(this.blogForm.value.arabicUrl ?? '').trim();
//       const englishUrl = String(this.blogForm.value.englishUrl ?? '').trim();

//       const payload = {
//         id,
//         title: this.blogForm.value.title ?? '',
//         metaTitle: this.blogForm.value.metaTitle ?? '',
//         metaDescription: this.loadedBlog?.metaDescription ?? '',
//         category: this.blogForm.value.category ?? 'general',
//         url: arabicUrl,
//         englishURL: englishUrl,
//         faqs: this.blogForm.value.faqs ?? [],
//         body: JSON.stringify(savedData),
//         mainImage: this.mainImageObjectUrl ?? (this.loadedBlog?.mainImage ?? ''),
//         altText: this.blogForm.value.altText ?? '',
//         __source: 'localStorage'
//       };

//       const fd = new FormData();
//       fd.append('title', payload.title);
//       fd.append('metaTitle', payload.metaTitle);
//       fd.append('metaDescription', payload.metaDescription ?? '');
//       fd.append('category', payload.category);
//       fd.append('url', payload.url);
//       fd.append('englishURL', payload.englishURL ?? '');
//       fd.append('faqs', JSON.stringify(payload.faqs));
//       fd.append('body', payload.body);
//       if (this.mainImageFile) fd.append('mainImage', this.mainImageFile);

//       this.blogsService.UpdateBlog(payload.id, fd).subscribe({
//         next: () => this.openSuccess(),
//         error: () => this.openFail()
//       });

//     } catch (err) {
//       console.error(err);
//       this.openFail();
//     } finally {
//       this.isSubmitting = false;
//     }
//   }

//   ngOnDestroy(): void {
//     if (this.isBrowser && this.editor) {
//       this.editor.destroy();
//       this.editor = null;
//     }
//     if (this.isBrowser && this.mainImageObjectUrl?.startsWith('blob:')) {
//       URL.revokeObjectURL(this.mainImageObjectUrl);
//       this.mainImageObjectUrl = null;
//     }
//   }
// }
import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BlogsService } from '../services/blogs-service';
import { DialogButton, MessegeDialogComponent } from "../../../shared/messege-dialog/messege-dialog.component";
import { SafeHtml } from '@angular/platform-browser';

type UploadImageResponse = {
  success: boolean;
  imageUrl: string; // "/uploads/....jpg"
};

@Component({
  selector: 'app-edit-blog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MessegeDialogComponent],
  templateUrl: './edit-blog.component.html',
  styleUrl: './edit-blog.component.scss'
})
export class EditBlogComponent implements OnInit, AfterViewInit, OnDestroy {
  blogForm!: FormGroup;

  // ✅ loading / error like view
  loading = true;
  errorMsg = '';

  // dialog
  dialogOpen = false;
  blog: any;
  blogHtml: SafeHtml = '' as any;
  dialogVariant: 'success' | 'error' = 'success';
  dialogTitle = '';
  dialogMessage = '';
  dialogButtons: DialogButton[] = [];

  private editor: any = null;
  private isBrowser: boolean;

  private routeUrlParam = '';
  private loadedBlog: any = null;

  // main image
  private mainImageFile: File | null = null;
  mainImageObjectUrl: string | null = null;

  isSubmitting = false;
  private readonly SERVER_ORIGIN = 'https://almotammem-server.onrender.com';

  // ✅ flags عشان نضمن إن (الداتا + الـ DOM) جاهزين قبل initEditor
  private viewReady = false;
  private dataReady = false;
  private editorInited = false;

  constructor(
    private fb: FormBuilder,
    private blogsService: BlogsService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.initForm();
  }

  // ================= Dialog helpers =================
  openSuccess() {
    this.dialogVariant = 'success';
    this.dialogTitle = 'تم حفظ التعديلات علي المقال بنجاح ';
    this.dialogMessage = '';
    this.dialogButtons = [
      { id: 'show all', text: 'عرض كل المقالات', style: 'primary' },
      { id: 'show edited blog', text: 'عرض المقاله بعد التعديل', style: 'outline' }
    ];
    this.dialogOpen = true;
  }

  openFail() {
    this.dialogVariant = 'error';
    this.dialogTitle = 'تعذر حفظ التعديلات';
    this.dialogMessage = 'حاول مرة أخرى أو تواصل مع الدعم.';
    this.dialogButtons = [
      { id: 'cancel', text: 'Cancel', style: 'outline' },
      { id: 'retry', text: 'Try again', style: 'danger' },
    ];
    this.dialogOpen = true;
  }



  // ================= Lifecycle =================
  ngOnInit(): void {
    if (!this.isBrowser) return;

    this.routeUrlParam = (this.route.snapshot.paramMap.get('url') ?? '').trim();
    if (!this.routeUrlParam) {
      this.loading = false;
      this.errorMsg = 'الرابط غير صحيح';
      return;
    }

    this.fetchAndPrepare();
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.viewReady = true;
    this.tryInitEditor();
  }

  private async fetchAndPrepare() {
    this.loading = true;
    this.errorMsg = '';

    try {
      await this.loadBlogForEdit(this.routeUrlParam);

      if (!this.loadedBlog) {
        this.errorMsg = 'تعذر تحميل المقال';
        return;
      }

      this.blog = this.loadedBlog;

      // patch form + main image preview
      this.patchFormFromLoaded(this.loadedBlog);

      // ✅ خلّصنا الداتا
      this.dataReady = true;

      // ✅ خلى الـ template يرندر @else if(blog)
      this.loading = false;
      this.cdr.detectChanges();

      // حاول init editor بعد ما الدوم يظهر
      this.tryInitEditor();

    } catch (e) {
      console.error(e);
      this.errorMsg = 'تعذر تحميل المقال';
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  private tryInitEditor() {
    if (!this.isBrowser) return;
    if (this.editorInited) return;
    if (!this.viewReady || !this.dataReady) return;

    // ✅ مهم: نخلي Angular يرندر الكونتينر قبل ما نمسكه
    this.cdr.detectChanges();

    setTimeout(async () => {
      if (this.editorInited) return;
      await this.initEditor(this.loadedBlog?.body);
      this.editorInited = true;
    }, 0);
  }

  // ================= Form =================
  private initForm(): void {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      metaTitle: [''],
      metaDescription: [''],
      category: ['general'],

      arabicUrl: ['', Validators.required],
      englishUrl: [''],

      altText: [''],

      faqs: this.fb.array([]),
    });
  }

  get faqs(): FormArray {
    return this.blogForm.get('faqs') as FormArray;
  }

  addFaq(initial?: any): void {
    this.faqs.push(
      this.fb.group({
        question: [initial?.question ?? ''],
        englishQuestion: [initial?.englishQuestion ?? ''],
        answer: [initial?.answer ?? ''],
        englishAnswer: [initial?.englishAnswer ?? '']
      })
    );
  }

  removeFaq(index: number): void {
    this.faqs.removeAt(index);
  }

  onMainImageChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.mainImageFile = file;

    if (this.isBrowser) {
      if (this.mainImageObjectUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(this.mainImageObjectUrl);
      }
      this.mainImageObjectUrl = file ? URL.createObjectURL(file) : null;
    }
  }

  private absoluteUrl(pathOrUrl: string): string {
    if (!pathOrUrl) return pathOrUrl;
    if (pathOrUrl.startsWith('http')) return pathOrUrl;
    return `${this.SERVER_ORIGIN}${pathOrUrl}`;
  }

  // ================= Load blog =================
  private async loadBlogForEdit(urlFromRoute: string): Promise<void> {
    // local draft
    if (this.isBrowser) {
      const key = `blog:draft:${urlFromRoute}`;
      const raw = localStorage.getItem(key);
      if (raw) {
        this.loadedBlog = JSON.parse(raw);
        return;
      }
    }

    // api
    const res: any = await firstValueFrom(this.blogsService.getBlogByName(urlFromRoute));
    this.loadedBlog = res?.data ?? null;
  }

  private patchFormFromLoaded(blog: any): void {
    if (!blog) return;

    this.blogForm.patchValue({
      title: blog.title ?? '',
      metaDescription: blog.metaDescription ?? '',
      metaTitle: blog.metaTitle ?? '',
      category: blog.category ?? 'general',
      altText: blog.altText ?? '',

      arabicUrl: blog.url ?? this.routeUrlParam,
      englishUrl: blog.englishURL ?? '',
    });

    this.faqs.clear();
    const arr = Array.isArray(blog.faqs) ? blog.faqs : [];
    if (arr.length) arr.forEach((f: any) => this.addFaq(f));
    else this.addFaq();

    const img = blog.mainImage ?? '';
    if (img) this.mainImageObjectUrl = img.startsWith('blob:') ? img : this.absoluteUrl(img);
    else this.mainImageObjectUrl = null;
  }

  // ================= Editor parsing =================
  private parseEditorBody(body: any): any {
    if (!body) return undefined;
    if (typeof body === 'object') return body;

    try {
      const parsed = JSON.parse(body);

      // ✅ ده EditorJS
      if (parsed?.blocks && Array.isArray(parsed.blocks)) return parsed;

      // ✅ ده object عادي -> حوله لـ paragraph
      return {
        time: Date.now(),
        blocks: [{ type: 'paragraph', data: { text: this.objectToText(parsed) } }],
        version: '2.0.0'
      };
    } catch {
      // ✅ نص عادي
      return {
        time: Date.now(),
        blocks: [{ type: 'paragraph', data: { text: String(body) } }],
        version: '2.0.0'
      };
    }
  }

  private objectToText(obj: any): string {
    if (!obj || typeof obj !== 'object') return String(obj ?? '');
    return Object.entries(obj).map(([k, v]) => `${k}: ${String(v)}`).join('<br/>');
  }

  private async uploadEditorImage(file: File) {
    const fd = new FormData();
    fd.append('image', file);

    const resp = await firstValueFrom(this.blogsService.UploadImage(fd)) as UploadImageResponse;
    if (!resp?.success || !resp?.imageUrl) throw new Error('UploadImage: invalid response');

    return { success: 1, file: { url: this.absoluteUrl(resp.imageUrl) } };
  }

  // ================= Editor init =================
  private async initEditor(body: any): Promise<void> {
    const holderEl = document.getElementById('editorjs-container');
    if (!holderEl) {
      console.warn('editorjs-container not found (DOM not ready yet)');
      return;
    }

    const initialData = this.parseEditorBody(body);

    const [
      { default: EditorJS },
      { default: Header },
      { default: List },
      { default: Paragraph },
      { default: Checklist },
      { default: Quote },
      { default: Table },
      { default: Delimiter },
      { default: Code },
      { default: Warning },
      { default: Marker },
      { default: InlineCode },
      { default: Embed },
      { default: ImageTool }
    ] = await Promise.all([
      import('@editorjs/editorjs'),
      import('@editorjs/header'),
      import('@editorjs/list'),
      import('@editorjs/paragraph'),
      import('@editorjs/checklist'),
      import('@editorjs/quote'),
      import('@editorjs/table'),
      import('@editorjs/delimiter'),
      import('@editorjs/code'),
      import('@editorjs/warning'),
      import('@editorjs/marker'),
      import('@editorjs/inline-code'),
      import('@editorjs/embed'),
      import('@editorjs/image')
    ]);

    const tools: Record<string, any> = {
      paragraph: { class: Paragraph, inlineToolbar: ['bold', 'italic', 'marker', 'link'] },
      header: { class: Header, inlineToolbar: ['bold', 'italic', 'marker', 'link'] },
      list: { class: List, inlineToolbar: true },
      checklist: { class: Checklist, inlineToolbar: true },
      quote: { class: Quote, inlineToolbar: true },
      table: { class: Table, inlineToolbar: true },
      delimiter: Delimiter,
      code: Code,
      warning: { class: Warning, inlineToolbar: true },
      marker: Marker,
      inlineCode: InlineCode,
      embed: { class: Embed, config: { services: { youtube: true, instagram: true, twitter: true, facebook: true } } },
      image: {
        class: ImageTool,
        config: {
          captionPlaceholder: 'وصف للصورة...',
          uploader: { uploadByFile: (file: File) => this.uploadEditorImage(file) }
        }
      }
    };

    if (this.editor) {
      try { this.editor.destroy(); } catch { }
      this.editor = null;
    }

    this.editor = new (EditorJS as any)({
      holder: 'editorjs-container',
      autofocus: true,
      placeholder: 'ابدأ بكتابة محتوى المقال هنا...',
      inlineToolbar: true,
      tools: tools as any,
      data: initialData // ✅ هنا بيتم تحميل الداتا القديمة
    });

    await this.editor.isReady;
  }

  // ================= Submit =================
  async onSubmit(): Promise<void> {
    if (!this.isBrowser || !this.editor) return;
    if (this.isSubmitting) return;

    if (this.blogForm.invalid) {
      this.blogForm.markAllAsTouched();
      return;
    }

    const id = this.loadedBlog?.id;
    if (!id) {
      console.error('UpdateBlog requires id, but it is missing.');
      this.openFail();
      return;
    }

    this.isSubmitting = true;

    try {
      await this.editor.isReady;
      const savedData = await this.editor.save();

      const arabicUrl = String(this.blogForm.value.arabicUrl ?? '').trim();
      const englishUrl = String(this.blogForm.value.englishUrl ?? '').trim();

      const fd = new FormData();
      fd.append('title', this.blogForm.value.title ?? '');
      fd.append('metaTitle', this.blogForm.value.metaTitle ?? '');
      fd.append('metaDescription', this.blogForm.value.metaDescription ?? '');
      fd.append('altText', this.blogForm.value.altText ?? '');
      fd.append('category', this.blogForm.value.category ?? 'general');

      fd.append('url', arabicUrl);
      fd.append('englishURL', englishUrl);

      fd.append('faqs', JSON.stringify(this.blogForm.value.faqs ?? []));
      fd.append('body', JSON.stringify(savedData));
      if (this.mainImageFile) fd.append('mainImage', this.mainImageFile);

      this.blogsService.UpdateBlog(id, fd).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.routeUrlParam = englishUrl;
          this.openSuccess();
        },
        error: (e) => {
          console.error(e);
          this.isSubmitting = false;
          this.openFail();
        }
      });

    } catch (err) {
      console.error(err);
      this.isSubmitting = false;
      this.openFail();
    }
  }
  onDialogAction(id: string) {
    if (id === 'show all') {
      this.dialogOpen = false;
      this.router.navigate(['/blogs']);
    }
    if (id === 'show edited blog') {
      this.dialogOpen = false;

      this.router.navigate(['/blogs/blog', this.routeUrlParam]);
    }
    if (id === 'retry') {
      this.dialogOpen = false;
      // optional
    }
    if (id === 'cancel') {
      this.dialogOpen = false;
    }
  }
  ngOnDestroy(): void {
    if (this.isBrowser && this.editor) {
      this.editor.destroy();
      this.editor = null;
    }
    if (this.isBrowser && this.mainImageObjectUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(this.mainImageObjectUrl);
      this.mainImageObjectUrl = null;
    }
  }
  BackToSource() {
    if (!this.isBrowser) return;
    const source = sessionStorage.getItem('source');
    if (source === 'blogs') {
      sessionStorage.removeItem('source');
      this.router.navigate(['/blogs']);
    }
    if (source === 'ViewBlog') {
      sessionStorage.removeItem('source');
      this.router.navigate(['/blogs/blog', this.routeUrlParam]);
    }
  }
}
