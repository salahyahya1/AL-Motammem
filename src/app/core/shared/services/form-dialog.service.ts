import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ScrollLockService } from './scroll-lock.service';

@Injectable({ providedIn: 'root' })
export class FormDialogService {
    private _visible$ = new BehaviorSubject<boolean>(false);
    visible$ = this._visible$.asObservable();
    constructor(private scrollLock: ScrollLockService) { }
    open() {
        if (this._visible$.value) return;
        this._visible$.next(true);
        this.scrollLock.lock();
    }
    close() {
        if (!this._visible$.value) return;
        this._visible$.next(false);
        this.scrollLock.unlock();
    }
}
