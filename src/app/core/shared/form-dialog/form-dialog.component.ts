import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormDialogService } from '../services/form-dialog.service';
import { Observable } from 'rxjs';

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
  constructor(
    private fb: FormBuilder,
    private formDialogService: FormDialogService
  ) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['']
    });
    this.visible$ = this.formDialogService.visible$;
  }

  closeDialog() {
    this.formDialogService.close();
  }

  onBackdropClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.id === 'dialog-backdrop') {
      this.closeDialog();
    }
  }

  onSubmit() {
    if (this.form.valid) {
      console.log('Form data => ', this.form.value); // 👈 هنا بنطبع الداتا
      this.closeDialog();
    } else {
      this.form.markAllAsTouched();
    }
  }
}
