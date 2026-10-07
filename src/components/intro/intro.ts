/**
 * Coordinates the page intro with the preloader: anything that animates on
 * load (header, hero, travelling machine) waits until the preloader hands over.
 * The preloader root carries `data-preloader="running"` from the server render,
 * so waiters registered before its own effect runs still see it.
 */
const waiters = new Set<(waited: boolean) => void>();

const running = () => typeof document !== "undefined" && !!document.querySelector("[data-preloader='running']");

/** Calls `cb` once the preloader has finished (`waited` = true), or right away when there is none. */
export function whenIntroDone(cb: (waited: boolean) => void) {
  if (!running()) {
    cb(false);
    return () => {};
  }
  waiters.add(cb);
  return () => {
    waiters.delete(cb);
  };
}

export function finishIntro() {
  const list = [...waiters];
  waiters.clear();
  // Run outside the caller's GSAP context: called from the preloader's timeline,
  // the waiters' animations would otherwise be adopted by it and reverted when
  // the homepage unmounts (e.g. the header vanishing on the way to /contact).
  queueMicrotask(() => list.forEach((cb) => cb(true)));
}
