import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const WIN_KEY = '__APP_PROGRAMMATIC_SCROLL__';
const EVENT_START = 'app-programmatic-scroll-start';
const EVENT_END = 'app-programmatic-scroll-end';

@Injectable({ providedIn: 'root' })
export class ProgrammaticScrollService {
  private readonly activeTokens = new Set<number>();
  private tokenSeq = 0;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  isActive(): boolean {
    if (!this.isBrowser) return false;
    return this.activeTokens.size > 0;
  }

  /**
   * Start programmatic scroll lock. Returns a token that must be passed to end().
   * Reference-counted: multiple start() calls require matching end() calls; active tokens tracked in a Set.
   */
  start(reason?: string): number {
    if (!this.isBrowser) return 0;
    this.tokenSeq++;
    const token = this.tokenSeq;
    this.activeTokens.add(token);
    (window as any)[WIN_KEY] = this.activeTokens.size > 0;
    window.dispatchEvent(
      new CustomEvent(EVENT_START, { detail: { token, reason } })
    );
    return token;
  }

  /**
   * End programmatic scroll lock. Pass the token from start().
   * Only removes if token exists in active set; ignores unknown tokens; prevents double-end.
   * When no tokens remain, the lock is cleared.
   */
  end(token?: number): void {
    if (!this.isBrowser) return;
    if (token == null) return;
    if (!this.activeTokens.has(token)) return;
    this.activeTokens.delete(token);
    if (this.activeTokens.size === 0) {
      (window as any)[WIN_KEY] = false;
      window.dispatchEvent(
        new CustomEvent(EVENT_END, { detail: { token } })
      );
    }
  }

  /**
   * Attach end(token) to tween's onComplete, onInterrupt, onKill so the lock is released.
   * Returns the same tween for chaining.
   */
  wrapTween(tween: any, token: number): any {
    if (!tween || token == null) return tween;
  
    const chain = (evt: 'onComplete' | 'onInterrupt' | 'onKill') => {
      if (typeof tween.eventCallback !== 'function') return;
  
      const prev = tween.eventCallback(evt); // gets existing callback (if any)
      const next = () => {
        try {
          if (typeof prev === 'function') prev();
        } finally {
          this.end(token);
        }
      };
  
      (tween as any).eventCallback(evt, next);
    };
  
    chain('onComplete');
    chain('onInterrupt');
    chain('onKill');
  
    return tween;
  }
  

  /**
   * End the lock when scroll position is stable (N consecutive RAF frames within tolerance)
   * or after maxMs, whichever comes first. Calls onSettled then end(token) exactly once.
   * SSR-safe: no-op when not in browser.
   */
  endWhenSettle(
    token: number,
    getScrollPosition: () => number,
    maxMs: number = 2000,
    stableFrames: number = 4,
    tolerancePx: number = 2,
    onSettled?: () => void
  ): void {
    if (!this.isBrowser || token == null) return;
    if (!this.activeTokens.has(token)) return;

    const startedAt = performance.now();
    let lastPos = getScrollPosition();
    let stableCount = 0;
    let ended = false;

    const doEnd = () => {
      if (ended) return;
      ended = true;
      onSettled?.();
      this.end(token);
    };

    const tick = () => {
      if (ended) return;
      if (!this.activeTokens.has(token)) return;
      const now = performance.now();
      if (now - startedAt >= maxMs) {
        doEnd();
        return;
      }
      const pos = getScrollPosition();
      if (Math.abs(pos - lastPos) <= tolerancePx) {
        stableCount++;
        if (stableCount >= stableFrames) {
          doEnd();
          return;
        }
      } else {
        lastPos = pos;
        stableCount = 0;
      }
      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }
}
