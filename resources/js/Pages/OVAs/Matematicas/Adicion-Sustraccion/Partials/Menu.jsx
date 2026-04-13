// ─────────────────────────────────────────────────────────────────────────────
// Menu.jsx
// Equivale a: partials/menu.blade.php
//
// Menú lateral con 4 acciones: Inicio, Tutorial (slider), Guía del tema, Guía docente.
// Reemplaza el id="tutorial" + jQuery por un callback onTutorial de React.
// Reemplaza la directiva @if ($guiaTema) por una prop opcional.
//
// Props:
//   guiaTema    — string | null  (e.g. "guias/adicionysuspropiedades.pdf")
//   onTutorial  — función que abre el ModalSlider (tutorial)
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";

const BASE = "/OVAs/Matematicas/Adicion-Sustraccion";
const IMG = {
  menuHome:          `${BASE}/images/menu/menu_home.png`,
  menuHomeHover:     `${BASE}/images/menu/menu_home_hover.png`,
  menuTutorial:      `${BASE}/images/menu/menu_tutorial.png`,
  menuTutorialHover: `${BASE}/images/menu/menu_tutorial_hover.png`,
  menuShare:         `${BASE}/images/menu/menu_share.png`,
  menuShareHover:    `${BASE}/images/menu/menu_share_hover.png`,
  menuTeacher:       `${BASE}/images/menu/menu_teacher_guide.png`,
  menuTeacherHover:  `${BASE}/images/menu/menu_teacher_guide_hover.png`,
};

// ─── Imagen con efecto hover (intercambio de src) ─────────────────────────────
function HoverImg({ src, hoverSrc, alt = "", className = "", style = {}, title = "", onClick }) {
  const [active, setActive] = useState(false);
  return (
    <img
      src={active ? hoverSrc : src}
      alt={alt}
      className={className}
      style={style}
      title={title}
      onClick={onClick}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      draggable={false}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function OvaMenu({ guiaTema = null, onTutorial }) {
  return (
    <>
      {/* ── Inicio ──────────────────────────────────────────────────────── */}
      <a href="menu">
        <HoverImg
          src={IMG.menuHome}
          hoverSrc={IMG.menuHomeHover}
          className="inicio"
          title="Inicio"
          alt="Inicio"
        />
      </a>

      {/* ── Tutorial (abre ModalSlider) ──────────────────────────────────── */}
      <HoverImg
        src={IMG.menuTutorial}
        hoverSrc={IMG.menuTutorialHover}
        className="tutorial"
        title="Tutorial"
        alt="Tutorial"
        style={{ cursor: "pointer" }}
        onClick={onTutorial}
      />

      {/* ── Guía del tema (condicional, equiv. a @if ($guiaTema)) ────────── */}
      {guiaTema && (
        <a href={`/OVAs/Matematicas/Adicion-Sustraccion/guias/${guiaTema}`} target="_blank" rel="noreferrer">
          <HoverImg
            src={IMG.menuShare}
            hoverSrc={IMG.menuShareHover}
            className="compartir"
            title="Guía del tema"
            alt="Guía del tema"
          />
        </a>
      )}

      {/* ── Guía docente ─────────────────────────────────────────────────── */}
      <a href="/OVAs/Matematicas/Adicion-Sustraccion/guias/guiadocente.pdf" target="_blank" rel="noreferrer">
        <HoverImg
          src={IMG.menuTeacher}
          hoverSrc={IMG.menuTeacherHover}
          className="profe"
          title="Guía docente"
          alt="Guía docente"
        />
      </a>
    </>
  );
}
