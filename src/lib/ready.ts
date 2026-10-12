type Listener = () => void;

let ready = false;
const listeners = new Set<Listener>();

export function markReady() {
  if (ready) return;
  ready = true;
  listeners.forEach((listener) => listener());
  listeners.clear();
}

export function onReady(listener: Listener) {
  if (ready) {
    listener();
    return () => undefined;
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
