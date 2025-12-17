import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VedioPlayerServiceForIosService {

  constructor() { }
    private pendingVideos = new Set<HTMLVideoElement>();
private unlockCleanup?: () => void;

 requestPlay(video: HTMLVideoElement) {
  if (!video) return;

  video.muted = true;
  video.setAttribute('muted', '');
  (video as any).playsInline = true;
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');

  const p = video.play();
  p?.catch((err: any) => {
    // Safari: play لازم user gesture
    if (err?.name === 'NotAllowedError' || String(err?.message || '').includes('user gesture')) {
      this.pendingVideos.add(video);
      this.installUnlockOnce();
    }
  });
}

private installUnlockOnce() {
  if (this.unlockCleanup) return;

  const unlock = () => {
    // بعد أول تفاعل: شغّل الفيديوهات اللي اتمنعت
    this.pendingVideos.forEach(v => v.play().catch(() => {}));
    this.pendingVideos.clear();
    cleanup();
  };

  const cleanup = () => {
    window.removeEventListener('pointerdown', unlock);
    window.removeEventListener('touchstart', unlock);
    window.removeEventListener('keydown', unlock);
    this.unlockCleanup = undefined;
  };

  window.addEventListener('pointerdown', unlock, { once: true });
  window.addEventListener('touchstart', unlock, { once: true, passive: true } as any);
  window.addEventListener('keydown', unlock, { once: true });

  this.unlockCleanup = cleanup;
}
}
