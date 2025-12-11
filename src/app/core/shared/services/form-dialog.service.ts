import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class FormDialogService {
    private _visible$ = new BehaviorSubject<boolean>(false);
    visible$ = this._visible$.asObservable();

    constructor(@Inject(DOCUMENT) private document: Document) { }

    open() {
        this._visible$.next(true);

        // 🔒 قفل سكرول الصفحة
        const body = this.document.body;
        body.style.overflow = 'hidden';
    }

    close() {
        this._visible$.next(false);

        // 🔓 رجّع السكرول لطبيعته
        const body = this.document.body;
        body.style.overflow = '';
    }
}
