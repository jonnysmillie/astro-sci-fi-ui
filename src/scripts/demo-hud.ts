import { bindDelegatedSound, configureSound } from "../lib/sound";

const root = document.documentElement;
const storageKey = "sf-theme";

function applyTheme(id: string): void {
  if (id === "default") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", id);
  localStorage.setItem(storageKey, id);
}

const stored = localStorage.getItem(storageKey);
if (stored) applyTheme(stored);

document.querySelectorAll("[data-theme-choice]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const id =
      btn instanceof HTMLElement ? (btn.dataset.themeChoice ?? "default") : "default";
    applyTheme(id);
  });
});

const soundToggle = document.getElementById("sf-sound-toggle");
if (soundToggle instanceof HTMLInputElement) {
  soundToggle.addEventListener("change", () => {
    configureSound({ enabled: soundToggle.checked });
  });
}

bindDelegatedSound();

const hint = document.getElementById("sf-reduced-motion-hint");
if (hint && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  hint.textContent = "Reduced motion: on";
}
