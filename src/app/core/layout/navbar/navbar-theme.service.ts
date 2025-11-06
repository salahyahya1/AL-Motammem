import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NavbarThemeService {
    private _color$ = new BehaviorSubject<string>('var(--primary)');
    color$ = this._color$.asObservable();

    setColor(c: string) { this._color$.next(c); }
    getSnapshot() { return this._color$.getValue(); }
}
