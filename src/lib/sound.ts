export type SoundUrls = {
  hover?: string;
  click?: string;
};

export type SoundConfig = {
  enabled: boolean;
  volume: number;
  urls: SoundUrls;
};

const defaultConfig: SoundConfig = {
  enabled: false,
  volume: 0.25,
  urls: {},
};

let config: SoundConfig = { ...defaultConfig };

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return null;
    audioCtx = new Ctx();
  }
  return audioCtx;
}

function beep(freq: number, duration = 0.04): void {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  gain.gain.value = config.volume * 0.08;
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

async function playUrl(url: string): Promise<void> {
  try {
    const audio = new Audio(url);
    audio.volume = Math.min(1, Math.max(0, config.volume));
    await audio.play();
  } catch {
    /* ignore — optional UX */
  }
}

export function configureSound(partial: Partial<SoundConfig> & { urls?: Partial<SoundUrls> }): void {
  config = {
    ...config,
    ...partial,
    urls: { ...config.urls, ...partial.urls },
  };
}

export function getSoundConfig(): Readonly<SoundConfig> {
  return config;
}

export async function playHoverSound(): Promise<void> {
  if (!config.enabled) return;
  if (config.urls.hover) {
    await playUrl(config.urls.hover);
    return;
  }
  void getCtx()?.resume();
  beep(880, 0.03);
}

export async function playClickSound(): Promise<void> {
  if (!config.enabled) return;
  if (config.urls.click) {
    await playUrl(config.urls.click);
    return;
  }
  void getCtx()?.resume();
  beep(440, 0.05);
}

/**
 * Delegated bindings: elements with `data-sf-sound-hover` / `data-sf-sound-click`.
 * Call once after navigation (e.g. from a layout script).
 */
export function bindDelegatedSound(root: ParentNode = document): () => void {
  const onEnter = (e: Event) => {
    const t = (e.target as HTMLElement | null)?.closest?.("[data-sf-sound-hover]");
    if (t) void playHoverSound();
  };
  const onClick = (e: Event) => {
    const t = (e.target as HTMLElement | null)?.closest?.("[data-sf-sound-click]");
    if (t) void playClickSound();
  };
  root.addEventListener("pointerenter", onEnter, true);
  root.addEventListener("click", onClick, true);
  return () => {
    root.removeEventListener("pointerenter", onEnter, true);
    root.removeEventListener("click", onClick, true);
  };
}
