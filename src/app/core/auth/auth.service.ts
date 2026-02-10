import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token$ = new BehaviorSubject<string | null>(null);
  private role$ = new BehaviorSubject<string | null>(null);
  private isBrowser: boolean;

  // Observables (public)
  isAuthenticated$ = this.token$.asObservable();
  roleObs$ = this.role$.asObservable();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    // ✅ أول ما نكون في Browser اعمل sync مرة
    if (this.isBrowser) {
      this.syncFromStorage();
    }
  }

  syncFromStorage() {
    // ✅ حماية SSR
    if (!this.isBrowser) return;

    this.token$.next(localStorage.getItem('token'));
    this.role$.next(localStorage.getItem('role'));
  }

  logout() {
    // ✅ حماية SSR
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    }

    // ✅ صفّر الحالة فورًا
    this.token$.next(null);
    this.role$.next(null);
  }

  // (اختياري) Helpers لو تحب تستخدمهم مباشرة
  get token(): string | null {
    return this.token$.value;
  }

  get role(): string | null {
    return this.role$.value;
  }

  get isAuthenticated(): boolean {
    return !!this.token$.value;
  }
}
