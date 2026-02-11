# Global Change Report — Bulletproof Search Navigation vs GSAP Snap

## 1) Summary

- **Single programmatic-scroll lock:** `ProgrammaticScrollService` is the only source of truth for "programmatic scroll in progress" (reference-counted `start()`/`end()`). All scroll-to-fragment, scroll-to-position, and section/snap scrolls are wrapped with it so snap logic can skip while a programmatic scroll is active.
- **Single navigation coordinator:** `SearchNavigationCoordinatorService` owns pending target (route + fragment), retry/backoff until the element exists (max ~3s), and delegates scroll execution to smoother (desktop) or window (mobile). Layout is the only place that calls `flushPendingScroll()`; Navbar and SearchResults only call `requestNavigation()`.
- **FAQ accordion:** `FaqAccordionRegistryService` lets FAQ accordions register by `fragmentId`; the coordinator calls `open(fragment)` after scrolling to a `faq-*` target so the accordion opens and content is visible.
- **Snap guard everywhere:** Home, About, Solutions, and Products check `programmaticScroll.isActive()` at snap entry (doSnap / doSnapMobileStable / doSnapMobile / performSnap) and skip when true. Their own snap scrolls (smoother.scrollTo / gsap.to window or scrollEl) are wrapped with `start()`/`end()` so the lock is held during snap animation.
- **Section indicator:** Programmatic scroll from the section-indicator dots is wrapped with `ProgrammaticScrollService.start()` before and `end()` in onComplete/onInterrupt.
- **No global ScrollTrigger kill:** No `ScrollTrigger.getAll().forEach(t => t.kill())`. Listeners are cleaned in `ngOnDestroy` per component.
- **SSR-safe:** All new logic is gated with `isPlatformBrowser` or runs only after browser checks; no `window`/DOM in constructors.

---

## 2) Files Changed

| File | Change |
|------|--------|
| **NEW** `src/app/core/services/programmatic-scroll.service.ts` | Reference-counted lock: `start(reason?): number`, `end(token?)`, `isActive()`, `wrapTween(tween, token)`. SSR-safe. |
| **NEW** `src/app/core/services/search-navigation-coordinator.service.ts` | `requestNavigation({ route, fragment, source })`, `setPendingFromFragment(fragment)`, `getPendingFragment()`, `flushPendingScroll(smoother, navOffsetPx)` with retry/backoff [0,50,120,250,450,800,1200] ms, max 3s. Desktop: smoother only; mobile: window only. Opens FAQ via `FaqAccordionRegistryService` when fragment starts with `faq-`. |
| **NEW** `src/app/core/services/faq-accordion-registry.service.ts` | `register(fragmentId, openFn)`, `unregister(fragmentId)`, `open(fragmentId)`. |
| **MODIFY** `src/app/core/layout/layout/layout.component.ts` | Injects `SearchNavigationCoordinatorService` and `ProgrammaticScrollService`. Scroll subscription and initial load use `searchNav.getPendingFragment()` and `searchNav.flushPendingScroll(this.smoother, NAV_OFFSET_PX)` only. `performSimpleScrollY` wrapped with `programmaticScroll.start()`/`end()`. Removed direct `scrollToFragment`, retry loop, and lock helpers. HostListener `app-scroll-to-section` calls `setPendingFromFragment` + `flushPendingScroll`. |
| **MODIFY** `src/app/core/components/navbar/navbar.component.ts` | Injects `SearchNavigationCoordinatorService`. `navigateToResult` calls `searchNav.requestNavigation({ route, fragment, source: 'navbar' })` only; no localStorage/event set. |
| **MODIFY** `src/app/core/pages/search/search-results.component.ts` | Injects `SearchNavigationCoordinatorService`. `handleResultClick` calls `searchNav.requestNavigation({ route, fragment, source: 'search-results' })` only. |
| **MODIFY** `src/app/core/pages/home/home.component.ts` | Injects `ProgrammaticScrollService`. `performSnap` guards with `programmaticScroll.isActive()`; snap tween wrapped with `start()`/`end()` in onComplete/onInterrupt/onKill. Removed `programmaticLock`; kept programmatic-scroll event listeners only to kill in-progress snap tween. |
| **MODIFY** `src/app/core/pages/about/about.component.ts` | Injects `ProgrammaticScrollService`. `doSnap` and `doSnapMobileStable` guard with `programmaticScroll.isActive()`. Desktop `doSnap` wraps `smoother.scrollTo` with start/setTimeout end. `snapToMobile` wraps `gsap.to(window, scrollTo)` with start/end in onComplete/onInterrupt. Removed `programmaticLock` from listeners. |
| **MODIFY** `src/app/core/components/section-indicator/section-indicator.component.ts` | Injects `ProgrammaticScrollService`. `_scrollToSection` calls `programmaticScroll.start()` before scroll; desktop and mobile tweens call `programmaticScroll.end(token)` in onComplete/onInterrupt and use `wrapTween`. |
| **MODIFY** `src/app/core/pages/solutions/solutions.component.ts` | Injects `ProgrammaticScrollService`. `doSnap` and `doSnapMobile` guard with `programmaticScroll.isActive()`. Each `smoother.scrollTo` in doSnap wrapped with start/setTimeout end. `performSnap` (mobile) wraps gsap tween with start/end. |
| **MODIFY** `src/app/core/pages/products/products.component.ts` | Injects `ProgrammaticScrollService`. `doSnap` and `doSnapMobile` guard with `programmaticScroll.isActive()`. Desktop doSnap wraps `smoother.scrollTo` with start/setTimeout end. Mobile performSnap wraps gsap tween with start/end. |
| **MODIFY** `src/app/core/shared/accordion/accordion.component.ts` | Optional `@Input() fragmentId`. Registers with `FaqAccordionRegistryService` in ngOnInit (calls `open()`); unregisters in ngOnDestroy. |
| **MODIFY** `src/app/core/pages/faqs/faqs.component.html` | Added `[fragmentId]="'faq-' + FAQ.id"` on `app-accordion` in view mode. |

---

## 3) Scroll Authority Diagram (text)

```
┌─────────────────────────────────────────────────────────────────────┐
│  LAYOUT (Shell) — ONLY coordinator for route → scroll timing        │
│  - Subscribes to router.events (Scroll)                              │
│  - If searchNav.getPendingFragment(): flushPendingScroll(smoother)   │
│  - Else e.position → performSimpleScrollY (wrapped with prog.start/end) │
│  - Else → scroll to top (wrapped)                                    │
│  - HostListener app-scroll-to-section: setPendingFromFragment + flush│
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  SearchNavigationCoordinatorService                                  │
│  - requestNavigation(): set pending, localStorage, dispatch event,   │
│    router.navigateByUrl(route)                                       │
│  - flushPendingScroll(smoother, navOffset): get pending fragment,    │
│    retry until element (max 3s), programmaticScroll.start(),          │
│    desktop: smoother.scrollTo(el, true, offset) only                │
│    mobile: window.scrollTo({ top, behavior: 'smooth' }) only         │
│    then done(): clearPending, faqRegistry.open(faq-*), refresh, end()│
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  ProgrammaticScrollService (single source of truth for “in progress”) │
│  - start(reason?): number  → refCount++, dispatch start event        │
│  - end(token?)            → refCount--, if 0 dispatch end event      │
│  - isActive()              → read __APP_PROGRAMMATIC_SCROLL__       │
│  - wrapTween(tween, token) → attach end() to onComplete/onInterrupt  │
└─────────────────────────────────────────────────────────────────────┘
         │
         ├── Home performSnap: if isActive() return; else start → snap tween → end
         ├── About doSnap / snapToMobile: if isActive() return; wrap snap scroll
         ├── Solutions / Products doSnap & doSnapMobile: guard + wrap snap scroll
         └── Section-indicator _scrollToSection: start → tween → end
```

---

## 4) Snap Guard Coverage

| Page | Snap entry | Guard? | Before | After |
|------|------------|--------|--------|-------|
| Home (desktop) | `performSnap(smoother)` | Yes `programmaticScroll.isActive()` | Could snap during search scroll → loop | Skips when lock active; own snap wrapped with start/end |
| About (desktop) | `doSnap()` | Yes | Same | Same; smoother.scrollTo wrapped |
| About (mobile) | `doSnapMobileStable()` | Yes | Same | Same; snapToMobile gsap wrapped |
| Solutions (desktop) | `doSnap()` | Yes | No guard | Skips when isActive(); each smoother.scrollTo wrapped |
| Solutions (mobile) | `doSnapMobile()` / `performSnap()` | Yes | No guard | Skips when isActive(); gsap tween wrapped |
| Products (desktop) | `doSnap()` | Yes | No guard | Skips when isActive(); smoother.scrollTo wrapped |
| Products (mobile) | `doSnapMobile()` / `performSnap()` | Yes | No guard | Skips when isActive(); gsap tween wrapped |
| Section-indicator | `_scrollToSection` | N/A (not snap) | — | Programmatic scroll wrapped with start/end |

---

## 5) Programmatic Scroll Coverage

| Location | Scroll method | Wrapped? | End strategy |
|----------|----------------|----------|--------------|
| Layout (coordinator) | `flushPendingScroll` → smoother.scrollTo(el, true, offset) or window.scrollTo | Yes | Coordinator calls programmaticScroll.start() before, end(token) in done() (after tween/settle or timeout) |
| Layout | performSimpleScrollY | Yes | start() before, end(token) in setTimeout(50) |
| Home | performSnap → smoother.scrollTop / gsap.to(proxy) | Yes | start('home-snap') before tween; end in onComplete/onInterrupt/onKill |
| About | doSnap → smoother.scrollTo(target, true) | Yes | start before, setTimeout(450) end |
| About | snapToMobile → gsap.to(window, scrollTo) | Yes | start before; end in onComplete/onInterrupt |
| Section-indicator | smoother.scrollTop + gsap.to(smoother, scrollTop) or window | Yes | start at beginning; end in tween onComplete/onInterrupt + wrapTween |
| Solutions | doSnap → smoother.scrollTo (multiple branches) | Yes | start + setTimeout end per branch |
| Solutions | performSnap (mobile) → gsap.to(scrollEl, scrollTo) | Yes | start before; end in onComplete/onInterrupt |
| Products | doSnap → smoother.scrollTo(targetPosition, true) | Yes | start + setTimeout(450) end |
| Products | performSnap (mobile) → gsap.to(scrollEl, scrollTo) | Yes | start before; end in onComplete/onInterrupt |

---

## 6) Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Lock left on after scroll failure or throw | Coordinator calls end(token) on timeout; Section-indicator and snap paths call end in onInterrupt/onKill/setTimeout. |
| Multiple overlapping programmatic scrolls | Reference-counted lock; multiple start/end pairs allowed; lock clears when refCount reaches 0. |
| Snap runs during search/section scroll | All snap entry points check `programmaticScroll.isActive()` and return. |
| SSR | ProgrammaticScrollService and coordinator guard with `isPlatformBrowser`; no window in constructors. |
| Global ScrollTrigger kill | Not used; only component-owned listeners/timers removed in ngOnDestroy. |
| Duplicate scroll logic | Layout is the only place that runs flushPendingScroll; Navbar/SearchResults only requestNavigation. |
| FAQ target not open | Coordinator calls `faqRegistry.open(fragment)` when fragment.startsWith('faq-') in done(). |

---

## 7) Manual Test Checklist (≤15 items)

**Desktop**

1. Search result → Home section: lands on section, no jitter/snap loop.
2. Search result → About section: navigates then scrolls to section.
3. Search result → Solutions section: navigates then scrolls to section.
4. Search result → Products section: navigates then scrolls to section.
5. Search result → FAQ item: scrolls to item and accordion opens.
6. After search scroll completes, normal wheel/touch snap works on Home/About.
7. Section-indicator click: scrolls to section without snap fight.
8. Back/forward: position restores; no stuck lock; scroll ownership stable.

**Mobile**

9. Search result → Home section: scrolls to section (window), no jitter.
10. Search result → About/Solutions/Products section: scrolls to section.
11. Search result → FAQ item: scrolls and accordion opens.
12. Footer reachable on all pages.
13. Normal scroll/snap on About/Solutions/Products when not from search.

**General**

14. Same-page search result (e.g. already on Home): app-scroll-to-section triggers flushPendingScroll; scrolls correctly.
15. No console errors; no ScrollTrigger.getAll().kill(); listeners cleaned on route leave.
