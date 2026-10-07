"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { finishIntro } from "./intro";
import { CLIPS, EMBER_GRADIENT, EMBER_RECTS, FRAMES, PIECES, PIVOT } from "./preloader-shapes";

gsap.registerPlugin(useGSAP);

/** Figma frame the preloader is drawn in; the svg viewBox fits it to the screen. */
const W = 1920;
const H = 1020;

/** Plays on the first page load only; later client-side visits go straight to the ember. */
let played = false;

/** Flat, tweenable pose: group pivot/scale/rotation, 3 × piece [tx, ty, s], ember rect, frame clip. */
type Pose = Record<string, number>;

/** No clipping while the mark turns and assembles (Default's frame is a different, rotated box). */
const NO_CLIP = [-1e4, -1e4, 3e4, 3e4] as const;

function pose(i: 0 | 1 | 2 | 3, ember?: readonly number[]): Pose {
  const f = FRAMES[i];
  const [ex, ey, ew, eh, er] = ember ?? EMBER_RECTS[i as 0 | 1 | 2];
  const [cx, cy, cw, ch] = i < 2 ? NO_CLIP : CLIPS[i - 1];
  const p: Pose = { x: f.x, y: f.y, s: f.s, r: f.r, ex, ey, ew, eh, er, eo: i === 3 ? 1 : 0, cx, cy, cw, ch };
  f.pieces.forEach(([tx, ty, s], n) => Object.assign(p, { [`t${n}x`]: tx, [`t${n}y`]: ty, [`t${n}s`]: s }));
  return p;
}

const groupTransform = (p: Pose) =>
  `translate(${p.x} ${p.y}) rotate(${p.r}) scale(${p.s}) translate(${-PIVOT[0]} ${-PIVOT[1]})`;
const pieceTransform = (p: Pose, n: number) => `translate(${p[`t${n}x`]} ${p[`t${n}y`]}) scale(${p[`t${n}s`]})`;

const START = pose(0);

/** Fits the 1920×1020 frame to the screen: cover on wide screens, keep the mark in view on narrow ones. */
function fitViewBox(vw: number, vh: number) {
  if (!vw || !vh) return { x: 0, y: 0, w: W, h: H };
  const k = Math.min(Math.max(vw / W, vh / H), vw / 1000);
  const w = vw / k;
  const h = vh / k;
  return { x: W / 2 - w / 2, y: H / 2 - h / 2, w, h };
}

/** Nav keys that would scroll the page while the preloader runs. */
const SCROLL_KEYS = new Set([" ", "PageUp", "PageDown", "Home", "End", "ArrowUp", "ArrowDown"]);

/**
 * Figma 495:14202, Default → Variant2 → Variant3 → Variant4: the exploded mark
 * turns and assembles into the logo, bursts apart, then the camera dives
 * through its centre where the ember grows to fill the screen. That ember
 * stays behind as the hero's background.
 */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const group = useRef<SVGGElement>(null);
  const ember = useRef<SVGRectElement>(null);
  const clip = useRef<SVGRectElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      const svgEl = svg.current;
      const g = group.current;
      const rect = ember.current;
      const clipRect = clip.current;
      if (!el || !svgEl || !g || !rect || !clipRect) return;
      const paths = Array.from(g.querySelectorAll<SVGPathElement>("path"));

      let finished = false;
      let unlock = () => {};
      const finish = () => {
        if (finished) return;
        finished = true;
        played = true;
        gsap.set("[data-a='preloader-ember']", { autoAlpha: 1 });
        svgEl.style.display = "none";
        el.dataset.preloader = "done";
        unlock();
        finishIntro();
      };

      if (played || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        finish();
        return;
      }

      // Hold the page at the top until the hero takes over.
      const prevRestoration = history.scrollRestoration;
      history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
      const block = (e: Event) => e.preventDefault();
      const blockKeys = (e: KeyboardEvent) => SCROLL_KEYS.has(e.key) && e.preventDefault();
      window.addEventListener("wheel", block, { passive: false });
      window.addEventListener("touchmove", block, { passive: false });
      window.addEventListener("keydown", blockKeys);
      unlock = () => {
        window.removeEventListener("wheel", block);
        window.removeEventListener("touchmove", block);
        window.removeEventListener("keydown", blockKeys);
        history.scrollRestoration = prevRestoration;
      };

      const vb = fitViewBox(svgEl.clientWidth || window.innerWidth, svgEl.clientHeight || window.innerHeight);
      svgEl.setAttribute("viewBox", `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);

      // Variant4: the ember rect exactly covers the screen, so it matches the hero's CSS ember.
      const end = FRAMES[3];
      const toLocal = (v: number, origin: number, pivot: number) => (v - origin) / end.s + pivot;
      const ex0 = toLocal(vb.x, end.x, PIVOT[0]);
      const ey0 = toLocal(vb.y, end.y, PIVOT[1]);
      const emberEnd = [ex0, ey0, toLocal(vb.x + vb.w, end.x, PIVOT[0]) - ex0, toLocal(vb.y + vb.h, end.y, PIVOT[1]) - ey0, 0];

      const st = { ...START };
      const render = () => {
        g.setAttribute("transform", groupTransform(st));
        paths.forEach((path, n) => path.setAttribute("transform", pieceTransform(st, n)));
        rect.setAttribute("x", String(st.ex));
        rect.setAttribute("y", String(st.ey));
        rect.setAttribute("width", String(st.ew));
        rect.setAttribute("height", String(st.eh));
        rect.setAttribute("rx", String(st.er));
        rect.setAttribute("opacity", String(st.eo));
        clipRect.setAttribute("x", String(st.cx));
        clipRect.setAttribute("y", String(st.cy));
        clipRect.setAttribute("width", String(st.cw));
        clipRect.setAttribute("height", String(st.ch));
      };

      const tl = gsap.timeline({ delay: 0.4, onUpdate: render });
      tl.to(st, { ...pose(1), duration: 1.1, ease: "power3.inOut" })
        // Hold on the assembled logo until the page has loaded.
        .call(
          () => {
            if (document.readyState === "complete") return;
            tl.pause();
            window.addEventListener("load", () => tl.resume(), { once: true });
          },
          undefined,
          "+=0.35",
        )
        // From here the variant frames clip: start on Variant2's (fully around the logo).
        .set(st, { cx: CLIPS[0][0], cy: CLIPS[0][1], cw: CLIPS[0][2], ch: CLIPS[0][3] })
        .to(st, { ...pose(2), duration: 0.8, ease: "power2.inOut" })
        .to(st, { ...pose(3, emberEnd), duration: 1, ease: "power3.in" })
        .call(finish);

      return () => {
        unlock();
        // Unmounted mid-intro (not a StrictMode re-run): release anything waiting on it.
        setTimeout(() => {
          if (!finished && !document.querySelector("[data-preloader='running']")) finishIntro();
        }, 0);
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} data-preloader="running" aria-hidden className="absolute inset-0">
      <div data-a="preloader-ember" className="bg-ember-preloader invisible absolute inset-0" />
      <svg ref={svg} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
        <defs>
          <radialGradient
            id="preloader-ember"
            gradientUnits="objectBoundingBox"
            cx="0"
            cy="0"
            r="1"
            gradientTransform={`translate(${EMBER_GRADIENT.cx} ${EMBER_GRADIENT.cy}) scale(${EMBER_GRADIENT.rx} ${EMBER_GRADIENT.ry})`}
          >
            <stop stopColor="#CF5826" />
            <stop offset="1" stopColor="#762700" />
          </radialGradient>
          <clipPath id="preloader-clip" clipPathUnits="userSpaceOnUse">
            <rect ref={clip} x={START.cx} y={START.cy} width={START.cw} height={START.ch} />
          </clipPath>
        </defs>
        <g clipPath="url(#preloader-clip)">
          <g ref={group} transform={groupTransform(START)}>
            {PIECES.map((piece, n) => (
              <path key={n} d={piece.d} fill={piece.fill} transform={pieceTransform(START, n)} />
            ))}
            <rect
              ref={ember}
              x={START.ex}
              y={START.ey}
              width={START.ew}
              height={START.eh}
              rx={START.er}
              opacity={0}
              fill="url(#preloader-ember)"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
