import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FaqAccordionRegistryService {
  private map = new Map<string, () => void>();

  register(fragmentId: string, openFn: () => void): void {
    this.map.set(fragmentId, openFn);
  }

  unregister(fragmentId: string): void {
    this.map.delete(fragmentId);
  }

  open(fragmentId: string): void {
    this.map.get(fragmentId)?.();
  }
}
