import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RemiveRoleAriaService {
 cleanA11y(element: HTMLElement, split: any) {
  const attrs = ['role', 'aria-label', 'aria-hidden'];

  attrs.forEach(attr => element.removeAttribute(attr));

  if (split?.words) {
    (split.words as HTMLElement[]).forEach(wordEl => {
      attrs.forEach(attr => wordEl.removeAttribute(attr));
    });
  }
}
}