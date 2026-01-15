import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type SectionItem = { id: string; labelKey?: string; targetId?: string; wholeSectionId?: string };

@Injectable({ providedIn: 'root' })
export class SectionsRegistryService {
    private _sections$ = new BehaviorSubject<SectionItem[]>([]);
    sections$ = this._sections$.asObservable();

    private _enabled$ = new BehaviorSubject<boolean>(false);
    enabled$ = this._enabled$.asObservable();

    // Force-load support for @defer navigation
    private _forceLoadIds = signal(new Set<string>());
    forceLoadIds = this._forceLoadIds.asReadonly();

    requestForceLoad(id: string) {
        const next = new Set(this._forceLoadIds());
        next.add(id);
        this._forceLoadIds.set(next);
    }

    set(sections: SectionItem[]) {
        this._sections$.next(sections ?? []);
    }

    clear() {
        this._sections$.next([]);
        this._forceLoadIds.set(new Set());
    }

    enable() { this._enabled$.next(true); }
    disable() { this._enabled$.next(false); }
}
