// ─────────────────────────────────────────────────────────────────────────────
// Slider.jsx  —  réplica exacta de components/ovas/slider.blade.php
//
// FlexSlider original: animation:'fade', controlsContainer:'.flexslider'
// Navegación: flechas .flex-direction-nav (botones verdes con sprite ui_arrows.png)
// Control nav (.flex-control-paging): display:none en el CSS original → no se muestra
// Sonido: img.sonidoslider con position:fixed, top:9px (via CSS de stylemedicion.css)
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useEffect } from "react";

const BASE = "/OVAs";

const SLIDES = [
  {
    key:       "conoce",
    img:       `${BASE}/Shared/slider/slide_modal_conoce.png`,
    soundIcon: `${BASE}/Matematicas/Adicion-Sustraccion/images/sound/sound_icon.png`,
    audio:     `${BASE}/Matematicas/Adicion-Sustraccion/sounds/tutorial/tutorial_conoce.mp3`,
    alt:       "Conoce el OVA",
  },
  {
    key:       "aprende",
    img:       `${BASE}/Shared/slider/slide_modal_aprende_mas.png`,
    soundIcon: `${BASE}/Matematicas/Adicion-Sustraccion/images/sound/sound_icon.png`,
    audio:     `${BASE}/Matematicas/Adicion-Sustraccion/sounds/tutorial/tutorial_aprende_mas.mp3`,
    alt:       "Aprende más",
  },
  {
    key:       "repasemos",
    img:       `${BASE}/Shared/slider/slide_modal_repasemos.png`,
    soundIcon: `${BASE}/Matematicas/Adicion-Sustraccion/images/sound/sound_icon.png`,
    audio:     `${BASE}/Matematicas/Adicion-Sustraccion/sounds/tutorial/tutorial_repasemos.mp3`,
    alt:       "Repasemos",
  },
  {
    key:       "evaluemos",
    img:       `${BASE}/Shared/slider/slide_modal_evaluemos.png`,
    soundIcon: `${BASE}/Matematicas/Adicion-Sustraccion/images/sound/sound_icon.png`,
    audio:     `${BASE}/Matematicas/Adicion-Sustraccion/sounds/tutorial/tutorial_evaluemos.mp3`,
    alt:       "Evaluemos",
  },
];

export default function Slider() {
  const [current, setCurrent] = useState(0);
  const audioRefs = useRef(SLIDES.map(() => null));

  // ── Reset del contexto iframe ─────────────────────────────────────────────
  useEffect(() => {
    const b = document.body;
    const h = document.documentElement;
    const prevBM = b.style.margin;
    const prevBP = b.style.padding;
    const prevBG = b.style.background;
    const prevBO = b.style.overflow;
    const prevHO = h.style.overflow;

    b.style.margin     = "0";
    b.style.padding    = "0";
    b.style.background = "transparent";
    b.style.overflow   = "hidden";
    h.style.overflow   = "hidden";

    const app = document.getElementById("app");
    let prevAP = "", prevAM = "";
    if (app) {
      prevAP = app.style.padding;
      prevAM = app.style.margin;
      app.style.padding = "0";
      app.style.margin  = "0";
    }

    return () => {
      b.style.margin     = prevBM;
      b.style.padding    = prevBP;
      b.style.background = prevBG;
      b.style.overflow   = prevBO;
      h.style.overflow   = prevHO;
      if (app) { app.style.padding = prevAP; app.style.margin = prevAM; }
    };
  }, []);

  // ── CSS global — replica slider.css + partes relevantes de stylemedicion.css
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "slider-styles";
    style.textContent = `
      html, body, #app {
        margin: 0 !important;
        padding: 0 !important;
        background: transparent !important;
        overflow: hidden !important;
      }

      /* .flex-container */
      .flex-container {
        min-width: 150px;
        max-width: 960px;
      }

      /* .flexslider */
      .flexslider {
        position: relative;
        zoom: 1;
        padding: 10px;
        border-radius: 3px;
        overflow: hidden;
        margin: 0;
      }

      /* Slides wrapper */
      .flexslider .slides {
        zoom: 1;
        position: relative;
      }

      /* Imagen de cada slide */
      .flexslider .slides img.slide-img {
        width: 100%;
        display: block;
        border: none;
        outline: none;
        border-radius: 2px;
      }

      /* ── Flechas de navegación — .flex-direction-nav ── */
      .flex-direction-nav a {
        display: block;
        position: absolute;
        margin: -17px 0 0 0;
        width: 35px;
        height: 35px;
        top: 50%;
        cursor: pointer;
        text-indent: -9999px;
        z-index: 9999;
        background-color: #8BC34A;
      }

      /* Sprite de flecha — ui_arrows.png (18x13) */
      .flex-direction-nav a:before {
        display: block;
        position: absolute;
        content: '';
        width: 9px;
        height: 13px;
        top: 11px;
        left: 11px;
        background: url("/OVAs/Matematicas/Adicion-Sustraccion/images/interface/ui_arrows.png") no-repeat;
      }

      .flex-direction-nav .flex-next {
        right: -5px;
        border-radius: 3px 0 0 3px;
      }
      .flex-direction-nav .flex-prev {
        left: -5px;
        border-radius: 0 3px 3px 0;
      }

      /* Flecha derecha: mitad derecha del sprite (x offset -9px) */
      .flex-direction-nav .flex-next:before {
        background-position: -9px 0;
        left: 15px;
      }
      /* Flecha izquierda: mitad izquierda del sprite */
      .flex-direction-nav .flex-prev:before {
        background-position: 0 0;
      }

      /* Triángulo decorativo inferior de cada flecha */
      .flex-direction-nav a:after {
        display: block;
        position: absolute;
        content: '';
        width: 0;
        height: 0;
        top: 35px;
      }
      .flex-direction-nav .flex-next:after {
        right: 0;
        border-bottom: 5px solid transparent;
        border-left: 5px solid #31611e;
      }
      .flex-direction-nav .flex-prev:after {
        left: 0;
        border-bottom: 5px solid transparent;
        border-right: 5px solid #31611e;
      }

      /* ── Control nav (puntos) — display:none igual que el CSS original ── */
      .flex-control-nav {
        display: none !important;
      }

      /* ── Ícono de sonido — .sonidoslider de stylemedicion.css ── */
      .sonidoslider {
        width: 7% !important;
        position: fixed;
        top: 9px;
        left: 0;
        cursor: pointer;
        animation: 1s milatido infinite;
        z-index: 10;
      }

      /* ── Animación latido ── */
      @keyframes milatido {
        from { transform: none; }
        50%  { transform: scale(1.2); }
        to   { transform: none; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      const el = document.getElementById("slider-styles");
      if (el) document.head.removeChild(el);
    };
  }, []);

  function pauseAll() {
    audioRefs.current.forEach((a) => {
      if (a) { a.pause(); a.currentTime = 0; }
    });
  }

  function playAudio(index) {
    pauseAll();
    const audio = audioRefs.current[index];
    if (audio) audio.play().catch(() => {});
  }

  function goTo(index) {
    pauseAll();
    setCurrent(index);
  }

  function goPrev() { goTo((current - 1 + SLIDES.length) % SLIDES.length); }
  function goNext() { goTo((current + 1) % SLIDES.length); }

  return (
    <div className="flex-container">

      {/* Audios ocultos */}
      {SLIDES.map((slide, i) => (
        <audio
          key={slide.key}
          ref={(el) => { audioRefs.current[i] = el; }}
          src={slide.audio}
          preload="auto"
        />
      ))}

      <div className="flexslider">
        <div className="slides" style={{ position: "relative" }}>

          {/*
            Imagen fantasma del slide 0 — fija la altura del contenedor
            en el flujo normal (igual que FlexSlider con position:relative)
          */}
          <img
            src={SLIDES[0].img}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="slide-img"
            style={{ visibility: "hidden", pointerEvents: "none" }}
          />

          {/* Slides reales apilados absolutamente — transición fade con opacity */}
          {SLIDES.map((slide, i) => (
            <div
              key={slide.key}
              style={{
                position:      "absolute",
                top:           0,
                left:          0,
                width:         "100%",
                height:        "100%",
                opacity:       i === current ? 1 : 0,
                transition:    "opacity 0.6s ease",
                pointerEvents: i === current ? "auto" : "none",
              }}
            >
              <img
                src={slide.img}
                alt={slide.alt}
                draggable={false}
                className="slide-img"
              />
            </div>
          ))}

          {/*
            Ícono de sonido — .sonidoslider: position:fixed, top:9px, width:7%
            Es un único elemento fijo visible siempre (igual que el blade original,
            donde cada <li> tiene su propio icono pero todos apuntan al mismo
            comportamiento: reproduce el audio del slide actual)
          */}
          <img
            src={SLIDES[current].soundIcon}
            alt="Sonido"
            title="Escuchar"
            draggable={false}
            className="sonidoslider"
            onClick={() => playAudio(current)}
          />

        </div>

        {/* ── Flechas de navegación — .flex-direction-nav ── */}
        <ul className="flex-direction-nav">
          <li>
            <a
              className="flex-prev"
              href="#"
              onClick={(e) => { e.preventDefault(); goPrev(); }}
              aria-label="Anterior"
            >
              Anterior
            </a>
          </li>
          <li>
            <a
              className="flex-next"
              href="#"
              onClick={(e) => { e.preventDefault(); goNext(); }}
              aria-label="Siguiente"
            >
              Siguiente
            </a>
          </li>
        </ul>

      </div>
    </div>
  );
}
