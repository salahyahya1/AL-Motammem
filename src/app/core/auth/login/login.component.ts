import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';

type LoginResponse = {
  role?: string;
  token?: string;
  user?: { role?: string };
};

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private isBrowser: boolean;

  loading = false;
  errorMsg = '';
  showPassword = false; // ✅ جديد
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  submit() {
    this.errorMsg = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log(this.form.value);

    this.loading = true;

    const payload = {
      email: (this.form.value.email || '').trim(),
      password: this.form.value.password,
    };

    this.http
      .post<LoginResponse>('api/auth/login', payload)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => {
          if (this.isBrowser) {
            const role = res.role ?? res.user?.role ?? '';
            if (role) localStorage.setItem('role', role);
            if (res.token) localStorage.setItem('token', res.token);
          }
          this.router.navigateByUrl('/blogs');
        },
        error: (err: HttpErrorResponse) => {
          this.errorMsg =
            (err.error as any)?.message ||
            'فشل تسجيل الدخول. تأكد من البيانات وحاول مرة أخرى.';
        },
      });
  }

  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }
}
