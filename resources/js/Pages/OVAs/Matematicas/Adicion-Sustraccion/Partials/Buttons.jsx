// ─────────────────────────────────────────────────────────────────────────────
// Buttons.jsx
// Equivale a: partials/buttons.blade.php
//
// Renderiza los 4 botones de unidad: Repasemos, Evaluemos, Aprende más, Conoce.
// Reemplaza el data-toggle/data-target de Bootstrap por callbacks de React.
// Incluye el hook useAudioHover (reproducción de audio al pasar el cursor)
// y los tooltips animados.
//
// Props:
//   onRepasemos  — función que abre el modal Repasemos
//   onEvaluemos  — función que abre el modal Evaluemos
//   onAprende    — función que abre el modal Aprende más
//   onConoce     — función que abre el modal Conoce
//   audioRefs    — { aprende, repasemos, evaluemos, conoce } (React refs)
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useEffect } from "react";

const BASE = "OVAs/Matematicas/Adicion-Sustraccion";
const IMG = {
  unitRepasemos: `${BASE}/images/units/unit_repasemos.png`,
  unitEvaluemos: `${BASE}/images/units/unit_evaluemos.png`,
  unitAprende:   `${BASE}/images/units/unit_aprende_mas.png`,
  unitConoce:    `${BASE}/images/units/unit_conoce.png`,
  ttRepasemos:   `${BASE}/images/tooltips/tooltip_repasemos.png`,
  ttEvaluemos:   `${BASE}/images/tooltips/tooltip_evaluemos.png`,
  ttAprende:     `${BASE}/images/tooltips/tooltip_aprende_mas.png`,
};

// ─── Hook: reproduce audio y muestra tooltip al hacer hover ──────────────────
function useAudioHover(ref, audioRef, tooltipRef = null) {
  useEffect(() => {
    const el    = ref.current;
    const audio = audioRef.current;
    if (!el || !audio) return;

    function enter() {
      audio.currentTime = 0;
      audio.play().catch(() => {});
      if (tooltipRef?.current) tooltipRef.current.style.display = "block";
    }
    function leave() {
      audio.pause();
      if (tooltipRef?.current) tooltipRef.current.style.display = "none";
    }

    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
    };
  }, [ref, audioRef, tooltipRef]);
}

// ─────────────────────────────────────────────────────────────────────────────
export default function OvaButtons({ onRepasemos, onEvaluemos, onAprende, onConoce, audioRefs }) {
  // Refs para los elementos que disparan el hover de audio
  const refLibros        = useRef(null);
  const refRegistradora  = useRef(null);
  const refHelado        = useRef(null);
  const refLetreroConoce = useRef(null);

  // Refs para los tooltips
  const refTooltipRepasemos = useRef(null);
  const refTooltipEvaluemos = useRef(null);
  const refTooltipAprende   = useRef(null);

  useAudioHover(refLibros,        audioRefs.repasemos, refTooltipRepasemos);
  useAudioHover(refRegistradora,  audioRefs.evaluemos, refTooltipEvaluemos);
  useAudioHover(refHelado,        audioRefs.aprende,   refTooltipAprende);
  useAudioHover(refLetreroConoce, audioRefs.conoce);

  return (
    <>
      {/* ── Repasemos ───────────────────────────────────────────────────── */}
      <a id="repasemosIF" href="#" onClick={(e) => { e.preventDefault(); onRepasemos(); }}>
        <img
          ref={refLibros}
          className="libros"
          src={IMG.unitRepasemos}
          alt="Repasemos"
          draggable={false}
        />
        <div ref={refTooltipRepasemos} className="info" style={{ width: 30, height: 50, display: "none" }}>
          <img className="repasemos" src={IMG.ttRepasemos} alt="" draggable={false} />
        </div>
      </a>

      {/* ── Evaluemos ───────────────────────────────────────────────────── */}
      <a href="#" onClick={(e) => { e.preventDefault(); onEvaluemos(); }}>
        <img
          ref={refRegistradora}
          className="registradora"
          src={IMG.unitEvaluemos}
          alt="Evaluemos"
          draggable={false}
        />
        <div ref={refTooltipEvaluemos} className="evaluemos" style={{ width: 30, height: 50, display: "none" }}>
          <img className="evaluemos" src={IMG.ttEvaluemos} alt="" draggable={false} />
        </div>
      </a>

      {/* ── Aprende más ─────────────────────────────────────────────────── */}
      <a href="#" onClick={(e) => { e.preventDefault(); onAprende(); }}>
        <img
          ref={refHelado}
          className="helado"
          src={IMG.unitAprende}
          alt="Aprende más"
          draggable={false}
        />
        <div ref={refTooltipAprende} className="aprendemas" style={{ width: 30, height: 50, display: "none" }}>
          <img className="aprendemas" src={IMG.ttAprende} alt="" draggable={false} />
        </div>
      </a>

      {/* ── Conoce el OVA ───────────────────────────────────────────────── */}
      <a id="conoceOva" href="#" onClick={(e) => { e.preventDefault(); onConoce(); }}>
        <img
          ref={refLetreroConoce}
          className="letreroconoce"
          src={IMG.unitConoce}
          alt="Conoce"
          draggable={false}
        />
        <div className="letreroconoce" style={{ width: 30, height: 50 }} />
      </a>
    </>
  );
}
