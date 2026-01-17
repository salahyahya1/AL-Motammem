// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';

// @Injectable({ providedIn: 'root' })
// export class NavbarThemeService {
//     private _color$ = new BehaviorSubject<string>('var(--primary)');
//     color$ = this._color$.asObservable();

//     setColor(c: string) { this._color$.next(c); }
//     getSnapshot() { return this._color$.getValue(); }
// }
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type NavTheme = { text: string; bg: string };

@Injectable({ providedIn: 'root' })
export class NavbarThemeService {
    private _theme$ = new BehaviorSubject<NavTheme>({
        text: 'var(--primary)',
        bg: 'var(--white)',
    });
    theme$ = this._theme$.asObservable();

    // ✅ compatibility (لو صفحات قديمة بتستدعي setColor)
    setColor(text: string) {
        const cur = this._theme$.getValue();
        this._theme$.next({ ...cur, text });
    }

    setBg(bg: string) {
        const cur = this._theme$.getValue();
        this._theme$.next({ ...cur, bg });
    }

    // ✅ الأفضل: ابعت الاتنين مع بعض
    setTheme(text: string, bg: string) {
        this._theme$.next({ text, bg });
    }

    getSnapshot(): NavTheme {
        return this._theme$.getValue();
    }
}
