// import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { FormDialogService } from '../services/form-dialog.service';
// import { Observable } from 'rxjs';
// import emailjs from '@emailjs/browser';
// import { HttpClient } from '@angular/common/http';
// @Component({
//   selector: 'app-form-dialog',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './form-dialog.component.html',
//   styleUrl: './form-dialog.component.scss'
// })
// export class FormDialogComponent {
//   form: FormGroup;
//   visible$!: Observable<boolean>;
//   showSuccess = false;
//   isSubmitting = false;
//   errorMessage = '';


//   constructor(
//     private fb: FormBuilder,
//     private formDialogService: FormDialogService,
//     private http: HttpClient
//   ) {
//     this.form = this.fb.group({
//       fullName: ['', Validators.required],
//       phone: ['', Validators.required],
//       email: ['', [Validators.required, Validators.email]],
//       message: ['', [Validators.required]]
//     });
//     this.visible$ = this.formDialogService.visible$;
//   }

//   closeDialog() {
//     this.showSuccess = false;
//     this.form.reset();
//     this.formDialogService.close();
//   }

//   onBackdropClick(event: MouseEvent) {
//     const target = event.target as HTMLElement;
//     if (target.id === 'dialog-backdrop') {
//       this.closeDialog();
//     }
//   }

//   onSubmit() {
//     if (!this.form.valid) {
//       this.form.markAllAsTouched();
//       return;
//     }
//     this.http.post('/api/contact-us', this.form.value).subscribe({
//       next: () => {
//         this.isSubmitting = false;
//         this.showSuccess = true;
//         this.form.reset();
//         setTimeout(() => {
//           this.closeDialog();
//         }, 2500);
//       },
//       error: () => {
//         this.isSubmitting = false;
//         this.errorMessage = 'حصل خطأ أثناء إرسال طلبك، حاول مرة أخرى لاحقاً.';
//       }
//     })
//     // this.isSubmitting = true;
//     // this.errorMessage = '';

//     // const { fullName, phone, email, message } = this.form.value;

//     // console.log(fullName, phone, email, message);

//     // this.isSubmitting = false;
//     // this.showSuccess = true;
//     // this.form.reset();
//     // setTimeout(() => {
//     //   this.closeDialog();
//     // }, 2500);
//   }
// }
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormDialogService } from '../services/form-dialog.service';
import { Observable, finalize } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './form-dialog.component.html',
  styleUrl: './form-dialog.component.scss'
})
export class FormDialogComponent {
  form: FormGroup;
  visible$!: Observable<boolean>;
  showSuccess = false;
  isSubmitting = false;
  errorMessage = '';
  lang!: string;
  constructor(
    private fb: FormBuilder,
    private formDialogService: FormDialogService,
    private http: HttpClient,
    public languageService: LanguageService
  ) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      // ✅ اختياري فعلاً (زي ما مكتوب في الـ UI)
      message: ['']
    });
    this.lang = this.languageService.currentLang
    this.visible$ = this.formDialogService.visible$;
  }

  closeDialog() {
    this.showSuccess = false;
    this.isSubmitting = false;
    this.errorMessage = '';
    this.form.reset();
    this.formDialogService.close();
  }

  onBackdropClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.id === 'dialog-backdrop') {
      this.closeDialog();
    }
  }

  // ✅ Helper للـ HTML
  isInvalid(controlName: string): boolean {
    const c = this.form.get(controlName);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  onSubmit() {
    if (this.isSubmitting) return;

    this.errorMessage = '';

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    // ✅ payload صريح وواضح (وبيضمن إن الرسالة مش undefined)
    const payload = {
      fullName: (this.form.value.fullName ?? '').trim(),
      phone: (this.form.value.phone ?? '').trim(),
      email: (this.form.value.email ?? '').trim(),
      message: (this.form.value.message ?? '').trim()
    };

    this.http.post('/api/contact-us', payload)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          this.showSuccess = true;
          this.form.reset();
          setTimeout(() => this.closeDialog(), 2500);
        },
        error: () => {
          this.errorMessage = 'حصل خطأ أثناء إرسال طلبك، حاول مرة أخرى لاحقاً.';
        }
      });
  }
}
