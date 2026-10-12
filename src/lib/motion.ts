export const MOTION_STORAGE_KEY = "formax-motion";
export const PRELOAD_STORAGE_KEY = "formax-preloaded";

export function readMotionPreference() {
  if (typeof window === "undefined") return true;
  try {
    const stored = localStorage.getItem(MOTION_STORAGE_KEY);
    if (stored === "on") return true;
    if (stored === "off") return false;
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return true;
  }
}

export function motionIsEnabled() {
  if (typeof document === "undefined") return true;
  return document.documentElement.dataset.motion !== "off";
}

export function syncMotionDataset(enabled = readMotionPreference()) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.motion = enabled ? "on" : "off";
  const fine = window.matchMedia("(pointer: fine)").matches;
  if (!enabled || !fine) delete document.documentElement.dataset.cursor;
}

export function subscribeMotion(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  const onChange = () => {
    syncMotionDataset();
    onStoreChange();
  };
  media.addEventListener("change", onChange);
  window.addEventListener("formax-motion", onChange);
  return () => {
    media.removeEventListener("change", onChange);
    window.removeEventListener("formax-motion", onChange);
  };
}

export function getMotionSnapshot() {
  return readMotionPreference();
}

export function getMotionServerSnapshot() {
  return true;
}

export function setMotionPreference(enabled: boolean) {
  localStorage.setItem(MOTION_STORAGE_KEY, enabled ? "on" : "off");
  syncMotionDataset(enabled);
  window.dispatchEvent(new Event("formax-motion"));
}

export function subscribePreload(onStoreChange: () => void) {
  window.addEventListener("formax-preload", onStoreChange);
  return () => window.removeEventListener("formax-preload", onStoreChange);
}

export function getPreloadSnapshot() {
  return document.documentElement.dataset.preloaded === "1";
}

export function getPreloadServerSnapshot() {
  return false;
}

export function finishPreload() {
  try {
    sessionStorage.setItem(PRELOAD_STORAGE_KEY, "1");
  } catch {
    /* ignore private browsing */
  }
  document.documentElement.dataset.preloaded = "1";
  window.dispatchEvent(new Event("formax-preload"));
}

export const bootScript = `(function(){try{var seen=sessionStorage.getItem("${PRELOAD_STORAGE_KEY}")==="1";var stored=localStorage.getItem("${MOTION_STORAGE_KEY}");var reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;var motion=stored==="on"?true:stored==="off"?false:!reduce;var root=document.documentElement;root.dataset.motion=motion?"on":"off";if(seen||!motion)root.dataset.preloaded="1";}catch(e){}})();`;
