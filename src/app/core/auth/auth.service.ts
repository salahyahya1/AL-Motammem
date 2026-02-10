import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token$ = new BehaviorSubject<string | null>(null);
  private role$ = new BehaviorSubject<string | null>(null);
  private isBrowser: boolean;

  // ✅ boolean حقيقي
  readonly authenticated$ = this.token$.pipe(
    map(token => !!token),
    distinctUntilChanged()
  );

  // ✅ role زي ما هي
  readonly roleObs$ = this.role$.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) this.syncFromStorage();
  }

  syncFromStorage() {
    if (!this.isBrowser) return;
    this.token$.next(localStorage.getItem('token'));
    this.role$.next(localStorage.getItem('role'));
  }

  logout() {
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    }
    this.token$.next(null);
    this.role$.next(null);
  }

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
