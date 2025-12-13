import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormDialogService } from '../services/form-dialog.service';
import { Observable } from 'rxjs';
import emailjs from '@emailjs/browser';
@Component({
  selector: 'app-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-dialog.component.html',
  styleUrl: './form-dialog.component.scss'
})
export class FormDialogComponent {
  form: FormGroup;
  visible$!: Observable<boolean>;
  showSuccess = false;
  isSubmitting = false;
  errorMessage = '';

  private emailJsServiceId = 'service_3zbyxhh';
  private emailJsTemplateId = 'template_ltwzuce';
  private emailJsPublicKey = 'FQwnQAtxvRC8RZnqB';

  constructor(
    private fb: FormBuilder,
    private formDialogService: FormDialogService
  ) {
    this.form = this.fb.group({
      // fullName: ['', Validators.required],
      // phone: ['', Validators.required],
      // email: ['', [Validators.required, Validators.email]],
      // message: ['']
      fullName: [''],
      phone: [''],
      email: [''],
      message: ['']
    });
    this.visible$ = this.formDialogService.visible$;
  }

  closeDialog() {
    this.showSuccess = false;
    this.form.reset();
    this.formDialogService.close();
  }

  onBackdropClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.id === 'dialog-backdrop') {
      this.closeDialog();
    }
  }


  // onSubmit() {
  //   if (!this.form.valid) {
  //     this.form.markAllAsTouched();
  //     return;
  //   }
  //   console.log('Form data => ', this.form.value);
  //   this.showSuccess = true;
  //   this.form.reset();
  //   setTimeout(() => {
  //     this.closeDialog();
  //   }, 2500);
  // }
  onSubmit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const { fullName, phone, email, message } = this.form.value;

    // 👇 هنا بنبعت على EmailJS
    emailjs
      .send(
        this.emailJsServiceId,
        this.emailJsTemplateId,
        {
          fullName,   // لازم نفس أسماء المتغيرات في التمبلت: {{fullName}}
          phone,      // {{phone}}
          email,      // {{email}}
          message     // {{message}}
        },
        this.emailJsPublicKey
      )
      .then(
        () => {
          // ✅ اتبعت بنجاح
          this.isSubmitting = false;
          this.showSuccess = true;
          this.form.reset();

          // نقفل بعد 2.5 ثانية زي ما كنت عامل
          setTimeout(() => {
            this.closeDialog();
          }, 2500);
        },
        (error) => {
          console.error('EmailJS error:', error);
          this.isSubmitting = false;
          this.errorMessage = 'حصل خطأ أثناء إرسال طلبك، حاول مرة أخرى لاحقاً.';
        }
      );
  }
}
