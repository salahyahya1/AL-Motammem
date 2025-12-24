import { AfterViewInit, Component, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BlogsService } from '../services/blogs-service';

type UploadImageResponse = {
  success: boolean;
  imageUrl: string;
};

@Component({
  selector: 'app-edit-blog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-blog.component.html',
  styleUrl: './edit-blog.component.scss'
})
export class EditBlogComponent implements AfterViewInit, OnDestroy {
  blogForm!: FormGroup;

  private editor: any = null;
  private isBrowser: boolean;

  private urlParam = '';
  private loadedBlog: any = null;

  // main image
  private mainImageFile: File | null = null;
  mainImageObjectUrl: string | null = null; // للعرض

  isSubmitting = false;

  private readonly SERVER_ORIGIN = 'https://almotammem-server.onrender.com';

  constructor(
    private fb: FormBuilder,
    private blogsService: BlogsService,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.initForm();
  }

  async ngAfterViewInit() {
    if (!this.isBrowser) return;

    this.urlParam = (this.route.snapshot.paramMap.get('url') ?? '').trim();
    if (!this.urlParam) return;

    // 1) Load data first (localStorage -> api)
    await this.loadBlogForEdit(this.urlParam);

    // 2) Init Editor with loaded data
    await this.initEditor(this.loadedBlog?.body);

    // 3) Patch form fields
    this.patchFormFromLoaded(this.loadedBlog);
  }

  private initForm() {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      metaTitle: [''],
      url: [''],
      category: ['general'],
      faqs: this.fb.array([]),
    });
  }

  get faqs() {
    return this.blogForm.get('faqs') as FormArray;
  }

  addFaq(initial?: any) {
    this.faqs.push(
      this.fb.group({
        question: [initial?.question ?? ''],
        englishQuestion: [initial?.englishQuestion ?? ''],
        answer: [initial?.answer ?? ''],
        englishAnswer: [initial?.englishAnswer ?? '']
      })
    );
  }

  removeFaq(index: number) {
    this.faqs.removeAt(index);
  }

  onMainImageChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.mainImageFile = file;

    if (this.isBrowser) {
      if (this.mainImageObjectUrl) URL.revokeObjectURL(this.mainImageObjectUrl);
      this.mainImageObjectUrl = file ? URL.createObjectURL(file) : null;
    }
  }

  private absoluteUrl(pathOrUrl: string) {
    if (!pathOrUrl) return pathOrUrl;
    if (pathOrUrl.startsWith('http')) return pathOrUrl;
    return `${this.SERVER_ORIGIN}${pathOrUrl}`;
  }

  // ============= Load Blog (localStorage first, then API) =============
  private async loadBlogForEdit(url: string) {
    // try local draft
    if (this.isBrowser) {
      const key = `blog:draft:${url}`;
      const raw = localStorage.getItem(key);
      if (raw) {
        this.loadedBlog = JSON.parse(raw);
        return;
      }
    }

    // fallback api
    const res: any = await firstValueFrom(this.blogsService.getBlogByName(url));
    this.loadedBlog = res?.data ?? null;
  }

  // ============= Patch form with loaded data =============
  private patchFormFromLoaded(blog: any) {
    if (!blog) return;

    this.blogForm.patchValue({
      title: blog.title ?? '',
      metaTitle: blog.metaTitle ?? '',
      url: blog.url ?? this.urlParam,
      category: blog.category ?? 'general',
    });

    // faqs
    this.faqs.clear();
    const arr = Array.isArray(blog.faqs) ? blog.faqs : [];
    if (arr.length) arr.forEach((f: any) => this.addFaq(f));
    else this.addFaq();

    // mainImage preview (لو جاي url من الباك أو objectUrl من draft)
    const img = blog.mainImage ?? '';
    if (img) {
      this.mainImageObjectUrl = img.startsWith('blob:') ? img : this.absoluteUrl(img);
    }
  }

  // ============= Parse EditorJS JSON safely =============
  private parseEditorBody(body: any) {
    if (!body) return undefined;
    if (typeof body === 'object') return body;

    try {
      return JSON.parse(body);
    } catch {
      // لو body نص قديم
      return {
        time: Date.now(),
        blocks: [{ type: 'paragraph', data: { text: String(body) } }],
        version: '2.0.0'
      };
    }
  }

  // ============= Editor init (with data) =============
  private async initEditor(body: any) {
    const holderEl = document.getElementById('editorjs-container');
    if (!holderEl) return;

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
      embed: {
        class: Embed,
        config: { services: { youtube: true, instagram: true, twitter: true, facebook: true } }
      },
      image: {
        class: ImageTool,
        config: {
          captionPlaceholder: 'وصف للصورة...',
          uploader: {
            uploadByFile: async (file: File) => {
              const fd = new FormData();
              fd.append('image', file);

              const resp = await firstValueFrom(this.blogsService.UploadImage(fd)) as UploadImageResponse;
              if (!resp?.success || !resp?.imageUrl) throw new Error('UploadImage: invalid response');

              return { success: 1, file: { url: this.absoluteUrl(resp.imageUrl) } };
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
      tools: tools as any,
      data: initialData // ✅ دي أهم نقطة في الإيديت
    });
  }

  // ============= Save draft (local) / update later =============
  async onSubmit() {
    if (!this.isBrowser || !this.editor) return;
    if (this.isSubmitting) return;

    this.isSubmitting = true;

    try {
      await this.editor.isReady;
      const savedData = await this.editor.save();

      const slug = (this.blogForm.value.url ?? this.urlParam ?? '').trim();
      if (!slug) return;

      const draft = {
        // لو عندك id من الباك خليه يتخزن هنا
        id: this.loadedBlog?.id ?? null,

        title: this.blogForm.value.title ?? '',
        metaTitle: this.blogForm.value.metaTitle ?? '',
        metaDescription: this.loadedBlog?.metaDescription ?? '',
        url: slug,
        category: this.blogForm.value.category ?? 'general',
        faqs: this.blogForm.value.faqs ?? [],

        // body string زي الباك
        body: JSON.stringify(savedData),

        // mainImage: لو اختار ملف جديد نخزن preview فقط دلوقتي
        mainImage: this.mainImageObjectUrl ?? (this.loadedBlog?.mainImage ?? ''),

        __source: 'localStorage'
      };

      // ✅ حفظ Draft (للتجربة)
      const key = `blog:draft:${slug}`;
      localStorage.setItem(key, JSON.stringify(draft));
      console.log('Saved edited draft:', key, draft);

      // =============================
      // لما الباك يظبط فورم داتا:
      // - تبعت UpdateBlog بدل حفظ local
      // =============================
      // مثال:
      // const formData = new FormData();
      // formData.append('title', draft.title);
      // formData.append('metaTitle', draft.metaTitle);
      // formData.append('url', draft.url);
      // formData.append('category', draft.category);
      // formData.append('faqs', JSON.stringify(draft.faqs));
      // formData.append('body', draft.body);
      // if (this.mainImageFile) formData.append('mainImage', this.mainImageFile);
      // await firstValueFrom(this.blogsService.UpdateBlog(draft.id, formData));

    } catch (err) {
      console.error(err);
    } finally {
      this.isSubmitting = false;
    }
  }

  ngOnDestroy() {
    if (this.isBrowser && this.editor) {
      this.editor.destroy();
      this.editor = null;
    }
    if (this.isBrowser && this.mainImageObjectUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(this.mainImageObjectUrl);
      this.mainImageObjectUrl = null;
    }
  }
}
