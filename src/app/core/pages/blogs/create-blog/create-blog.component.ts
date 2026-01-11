// import { AfterViewInit, Component, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
// import { CommonModule, isPlatformBrowser } from '@angular/common';
// import { ReactiveFormsModule, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { firstValueFrom } from 'rxjs';
// import { BlogsService } from '../services/blogs-service';

// type UploadImageResponse = {
//     success: boolean;
//     imageUrl: string; // "/uploads/....jpg"
// };

// @Component({
//     selector: 'app-create-blog',
//     standalone: true,
//     imports: [CommonModule, ReactiveFormsModule],
//     templateUrl: './create-blog.component.html',
//     styleUrl: './create-blog.component.scss'
// })
// export class CreateBlogComponent implements AfterViewInit, OnDestroy {
//     blogForm!: FormGroup;

//     private editor: any = null;
//     private isBrowser: boolean;

//     // main image file
//     private mainImageFile: File | null = null;

//     isSubmitting = false;

//     // خليها ثابتة عندك (انت بالفعل استخدمتها للصور داخل المقال)
//     private readonly SERVER_ORIGIN = 'https://almotammem-server.onrender.com';

//     constructor(
//         private fb: FormBuilder,
//         private blogsService: BlogsService,
//         @Inject(PLATFORM_ID) platformId: object
//     ) {
//         this.isBrowser = isPlatformBrowser(platformId);
//         this.initForm();
//     }

//     async ngAfterViewInit() {
//         if (!this.isBrowser) return;
//         await this.initEditor();
//     }

//     private initForm() {
//         this.blogForm = this.fb.group({
//             title: ['', Validators.required],
//             metaTitle: [''],
//             url: [''],
//             category: ['general'],
//             faqs: this.fb.array([]),
//         });

//         this.addFaq();
//     }

//     get faqs() {
//         return this.blogForm.get('faqs') as FormArray;
//     }

//     addFaq() {
//         this.faqs.push(
//             this.fb.group({
//                 question: [''],
//                 englishQuestion: [''],
//                 answer: [''],
//                 englishAnswer: ['']
//             })
//         );
//     }

//     removeFaq(index: number) {
//         this.faqs.removeAt(index);
//     }

//     onMainImageChange(e: Event) {
//         const input = e.target as HTMLInputElement;
//         this.mainImageFile = input.files?.[0] ?? null;
//     }

//     private absoluteUrl(pathOrUrl: string) {
//         if (!pathOrUrl) return pathOrUrl;
//         if (pathOrUrl.startsWith('http')) return pathOrUrl;
//         return `${this.SERVER_ORIGIN}${pathOrUrl}`;
//     }

//     private async initEditor() {
//         const holderEl = document.getElementById('editorjs-container');
//         if (!holderEl) return;

//         const [
//             { default: EditorJS },
//             { default: Header },
//             { default: List },
//             { default: Paragraph },
//             { default: Checklist },
//             { default: Quote },
//             { default: Table },
//             { default: Delimiter },
//             { default: Code },
//             { default: Warning },
//             { default: Marker },
//             { default: InlineCode },
//             { default: Embed },
//             { default: ImageTool }
//         ] = await Promise.all([
//             import('@editorjs/editorjs'),
//             import('@editorjs/header'),
//             import('@editorjs/list'),
//             import('@editorjs/paragraph'),
//             import('@editorjs/checklist'),
//             import('@editorjs/quote'),
//             import('@editorjs/table'),
//             import('@editorjs/delimiter'),
//             import('@editorjs/code'),
//             import('@editorjs/warning'),
//             import('@editorjs/marker'),
//             import('@editorjs/inline-code'),
//             import('@editorjs/embed'),
//             import('@editorjs/image')
//         ]);

//         const tools: Record<string, any> = {
//             paragraph: { class: Paragraph, inlineToolbar: ['bold', 'italic', 'marker', 'link'] },
//             header: { class: Header, inlineToolbar: ['bold', 'italic', 'marker', 'link'] },
//             list: { class: List, inlineToolbar: true },
//             checklist: { class: Checklist, inlineToolbar: true },
//             quote: { class: Quote, inlineToolbar: true },
//             table: { class: Table, inlineToolbar: true },
//             delimiter: Delimiter,
//             code: Code,
//             warning: { class: Warning, inlineToolbar: true },
//             marker: Marker,
//             inlineCode: InlineCode,
//             embed: {
//                 class: Embed,
//                 config: { services: { youtube: true, instagram: true, twitter: true, facebook: true } }
//             },

//             // ✅ صور داخل المقال: نستخدم upload-image الحالي
//             image: {
//                 class: ImageTool,
//                 config: {
//                     captionPlaceholder: 'وصف للصورة...',
//                     uploader: {
//                         uploadByFile: async (file: File) => {
//                             const fd = new FormData();
//                             fd.append('image', file);

//                             const resp = await firstValueFrom(
//                                 this.blogsService.UploadImage(fd)
//                             ) as UploadImageResponse;

//                             if (!resp?.success || !resp?.imageUrl) {
//                                 throw new Error('UploadImage: invalid response');
//                             }

//                             const url = this.absoluteUrl(resp.imageUrl);

//                             return {
//                                 success: 1,
//                                 file: { url }
//                             };
//                         }
//                     }
//                 }
//             }
//         };

//         this.editor = new (EditorJS as any)({
//             holder: 'editorjs-container',
//             autofocus: true,
//             placeholder: 'ابدأ بكتابة محتوى المقال هنا...',
//             inlineToolbar: true,
//             tools: tools as any
//         });
//     }

//     async onSubmit() {
//         if (!this.isBrowser || !this.editor) return;
//         if (this.isSubmitting) return;

//         this.isSubmitting = true;

//         try {
//             await this.editor.isReady;
//             const savedData = await this.editor.save();

//             const title = this.blogForm.value.title ?? '';
//             const metaTitle = this.blogForm.value.metaTitle ?? '';
//             const url = this.blogForm.value.url ?? '';
//             const category = this.blogForm.value.category ?? 'general';
//             const faqs = this.blogForm.value.faqs ?? [];

//             const formData = new FormData();

//             // ✅ نفس شكل الباك المتوقع (بس multipart)
//             formData.append('title', title);
//             formData.append('metaTitle', metaTitle);
//             formData.append('url', url);
//             formData.append('category', category);

//             // الباك متوقع faqs array -> هنبعته JSON string
//             formData.append('faqs', JSON.stringify(faqs));

//             // body string
//             formData.append('body', JSON.stringify(savedData));

//             // ✅ سيب mainImage File زي ما هو
//             if (this.mainImageFile) {
//                 formData.append('mainImage', this.mainImageFile);
//             }

//             const addResp = await firstValueFrom(this.blogsService.AddBlog(formData));
//             console.log('AddBlog response:', addResp);
//         } catch (err) {
//             console.error(err);
//         } finally {
//             this.isSubmitting = false;
//         }
//     }


//     ngOnDestroy() {
//         if (this.isBrowser && this.editor) {
//             this.editor.destroy();
//             this.editor = null;
//         }
//     }
// }
///////////////////////////

import { AfterViewInit, Component, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { BlogsService } from '../services/blogs-service';
import { DialogButton, MessegeDialogComponent } from "../../../shared/messege-dialog/messege-dialog.component";
import { SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

type UploadImageResponse = {
    success: boolean;
    imageUrl: string; // "/uploads/....jpg"
};

@Component({
    selector: 'app-create-blog',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MessegeDialogComponent],
    templateUrl: './create-blog.component.html',
    styleUrl: './create-blog.component.scss'
})
export class CreateBlogComponent implements AfterViewInit, OnDestroy {
    blogForm!: FormGroup;

    private editor: any = null;
    private isBrowser: boolean;

    mainImageFile: File | null = null;


    mainImagePreviewUrl: string | null = null;


    isSubmitting = false;


    // ✅ loading / error like view
    loading = true;
    errorMsg = '';

    // dialog
    dialogOpen = false;
    blog: any;
    blogHtml: SafeHtml = '';
    dialogVariant: 'success' | 'error' = 'success';
    dialogTitle = '';
    dialogMessage = '';
    dialogButtons: DialogButton[] = [];

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

    onDialogAction(id: string) {
        if (id === 'show all') {
            this.dialogOpen = false;
            this.router.navigate(['/blogs']);
        }
        if (id === 'show edited blog') {
            this.dialogOpen = false;
            this.router.navigate(['/blogs/BlogVeiw', this.blogsService.spacesToHyphen(this.blogForm.value.englishUrl ?? '')]);
        }
        if (id === 'retry') {
            this.dialogOpen = false;
            // ✅ optional: retry submit or reload
        }
        if (id === 'cancel') {
            this.dialogOpen = false;
        }
    }


    // لو السيرفر بيرجع "/uploads/.." وعايز تخليها absolute داخل editor preview
    private readonly SERVER_ORIGIN = 'https://almotammem.com';

    constructor(
        private fb: FormBuilder,
        private blogsService: BlogsService,
        @Inject(PLATFORM_ID) platformId: object,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
        this.initForm();
    }

    async ngAfterViewInit(): Promise<void> {
        if (!this.isBrowser) return;
        await this.initEditor();
    }

    private initForm(): void {
        this.blogForm = this.fb.group({
            title: ['', Validators.required],
            metaTitle: [''],
            metaDescription: [''],
            category: ['general'],

            arabicUrl: ['', Validators.required],
            englishUrl: ['', Validators.required],

            altText: [''],

            faqs: this.fb.array([]),
        });

        // FAQ واحدة افتراضيًا
        this.addFaq();
    }

    get faqs(): FormArray {
        return this.blogForm.get('faqs') as FormArray;
    }

    addFaq(): void {
        this.faqs.push(
            this.fb.group({
                question: [''],
                englishQuestion: [''],
                answer: [''],
                englishAnswer: ['']
            })
        );
    }

    removeFaq(index: number): void {
        this.faqs.removeAt(index);
    }

    // onMainImageChange(e: Event): void {
    //     const input = e.target as HTMLInputElement;
    //     this.mainImageFile = input.files?.[0] ?? null;
    // }
    onMainImageChange(e: Event): void {
        const input = e.target as HTMLInputElement;
        const file = input.files?.[0] ?? null;

        // خزّن الملف
        this.mainImageFile = file;

        // نظّف القديم
        if (this.mainImagePreviewUrl) {
            URL.revokeObjectURL(this.mainImagePreviewUrl);
            this.mainImagePreviewUrl = null;
        }

        // اعمل preview
        if (file) {
            this.mainImagePreviewUrl = URL.createObjectURL(file);
        }
    }

    private absoluteUrl(pathOrUrl: string): string {
        if (!pathOrUrl) return pathOrUrl;
        if (pathOrUrl.startsWith('http')) return pathOrUrl;
        return `${this.SERVER_ORIGIN}${pathOrUrl}`;
    }

    // ✅ عشان ما يطلعش [object Object] في اللست وقت العرض لاحقًا
    private normalizeListBlocks(savedData: any): any {
        const blocks = Array.isArray(savedData?.blocks) ? savedData.blocks : [];

        const normalizeItem = (it: any): any => {
            if (typeof it === 'string') return it;

            const content = it?.content ?? it?.text ?? '';
            const nestedItems = Array.isArray(it?.items) ? it.items.map(normalizeItem) : undefined;

            if (nestedItems && nestedItems.length) {
                return { content, items: nestedItems };
            }

            return content;
        };

        for (const b of blocks) {
            if (b?.type === 'list' && Array.isArray(b?.data?.items)) {
                b.data.items = b.data.items.map(normalizeItem);
            }
        }

        return savedData;
    }

    // ✅ يقلّل احتمالات "Block paragraph skipped because saved data is invalid"
    private sanitizeEditorData(savedData: any): any {
        const blocks = Array.isArray(savedData?.blocks) ? savedData.blocks : [];

        savedData.blocks = blocks
            .filter((b: any) => b && b.type && b.data != null)
            .map((b: any) => {
                if (b.type === 'paragraph') {
                    const text = b?.data?.text;
                    return { ...b, data: { text: typeof text === 'string' ? text : '' } };
                }
                if (b.type === 'header') {
                    const text = b?.data?.text;
                    const level = b?.data?.level;
                    return {
                        ...b,
                        data: {
                            text: typeof text === 'string' ? text : '',
                            level: typeof level === 'number' ? level : 2
                        }
                    };
                }
                return b;
            })
            .filter((b: any) => b.type !== 'paragraph' || (b.data?.text?.trim?.() ?? '') !== '');

        savedData.time = savedData?.time ?? Date.now();
        savedData.version = savedData?.version ?? '2.0.0';

        return this.normalizeListBlocks(savedData);
    }

    private async initEditor(): Promise<void> {
        const holderEl = document.getElementById('editorjs-container');
        if (!holderEl) return;

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
            embed: {
                class: Embed,
                config: { services: { youtube: true, instagram: true, twitter: true, facebook: true } }
            },

            // ✅ رفع صور EditorJS باستخدام endpoint بتاعك في BlogsService.UploadImage
            image: {
                class: ImageTool,
                config: {
                    captionPlaceholder: 'وصف للصورة...',
                    uploader: {
                        uploadByFile: async (file: File) => {
                            const fd = new FormData();
                            // لازم key = image (حسب السيرفر بتاعك)
                            fd.append('image', file);

                            const resp = await firstValueFrom(this.blogsService.UploadImage(fd)) as UploadImageResponse;

                            if (!resp?.success || !resp?.imageUrl) {
                                throw new Error('UploadImage: invalid response');
                            }

                            return {
                                success: 1,
                                file: { url: this.absoluteUrl(resp.imageUrl) }
                            };
                        }
                    }
                }
            }
        };

        this.editor = new (EditorJS as any)({
            holder: 'editorjs-container',
            autofocus: true,
            placeholder: 'ابدأ بكتابة محتوى المقال هنا...',
            inlineToolbar: true,
            tools: tools as any
        });
    }

    async onSubmit(): Promise<void> {
        if (!this.isBrowser || !this.editor) return;
        if (this.isSubmitting) return;

        if (this.blogForm.invalid) {
            this.blogForm.markAllAsTouched();
            return;
        }

        this.isSubmitting = true;

        try {
            await this.editor.isReady;

            // 1) save editor content
            let savedData = await this.editor.save();
            savedData = this.sanitizeEditorData(savedData);

            // 2) build FormData (multipart/form-data) exactly as backend expects
            const title = String(this.blogForm.value.title ?? '').trim();
            const metaTitle = String(this.blogForm.value.metaTitle ?? '').trim();
            const metaDescription = String(this.blogForm.value.metaDescription ?? '').trim();
            const englishUrl = String(this.blogForm.value.englishUrl ?? '').trim();
            const arabicUrl = String(this.blogForm.value.arabicUrl ?? '').trim();
            const category = String(this.blogForm.value.category ?? 'general').trim();
            const faqs = this.blogForm.value.faqs ?? [];

            // slug required
            if (!englishUrl) {
                console.warn('Slug (url) is empty.');
                return;
            }

            const fd = new FormData();
            fd.append('title', title);
            fd.append('metaTitle', metaTitle);
            fd.append('metaDescription', metaDescription);
            fd.append('englishURL', englishUrl);
            fd.append('url', arabicUrl);
            fd.append('category', category);

            // IMPORTANT: faqs as JSON string
            fd.append('faqs', JSON.stringify(faqs));

            // IMPORTANT: body as JSON string
            fd.append('body', JSON.stringify(savedData));

            // IMPORTANT: mainImage file under key "mainImage" (multer.single("mainImage"))
            if (this.mainImageFile) {
                fd.append('mainImage', this.mainImageFile);
            }

            // 3) call your service (it already uses base url interceptor)
            this.blogsService.AddBlog(fd).subscribe({
                next: (resp) => {
                    console.log('✅ AddBlog response:', resp);
                    this.openSuccess();
                },
                error: (err) => {
                    console.error('❌ AddBlog error:', err);
                    this.openFail();
                }
            });

        } catch (err) {
            console.error('❌ AddBlog error:', err);
        } finally {
            this.isSubmitting = false;
        }
    }

    ngOnDestroy(): void {
        if (this.isBrowser && this.editor) {
            this.editor.destroy();
            this.editor = null;
        }
    }
}
