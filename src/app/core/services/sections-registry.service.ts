import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type SectionItem = { id: string; label?: string; targetId?: string; wholeSectionId?: string };

@Injectable({ providedIn: 'root' })
export class SectionsRegistryService {
    private _sections$ = new BehaviorSubject<SectionItem[]>([]);
    sections$ = this._sections$.asObservable();

    // ✅ سويتش للظهور/الإخفاء
    private _enabled$ = new BehaviorSubject<boolean>(false);
    enabled$ = this._enabled$.asObservable();

    set(sections: SectionItem[]) {
        this._sections$.next(sections ?? []);
        // مفيش تمكين تلقائي — انت بتقرر من الصفحة enable/disable
    }

    clear() { this._sections$.next([]); }

    enable() { this._enabled$.next(true); }
    disable() { this._enabled$.next(false); }
}
