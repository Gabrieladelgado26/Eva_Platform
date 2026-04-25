// ─────────────────────────────────────────────────────────────────────────────
// Partials/Menu.jsx  —  OVA Español › El Cuento
//
// Menú lateral del OVA: Inicio, Tutorial (slider), Guía docente.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';

const BASE = '/OVAs/Espanol/Cuento';
const IMG = {
    menuHome:          `${BASE}/images/menu/menu_home.png`,
    menuHomeHover:     `${BASE}/images/menu/menu_home_hover.png`,
    menuTutorial:      `${BASE}/images/menu/menu_tutorial.png`,
    menuTutorialHover: `${BASE}/images/menu/menu_tutorial_hover.png`,
    menuTeacher:       `${BASE}/images/menu/menu_teacher_guide.png`,
    menuTeacherHover:  `${BASE}/images/menu/menu_teacher_guide_hover.png`,
};

function HoverImg({ src, hoverSrc, alt = '', className = '', style = {}, title = '', onClick }) {
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

export default function OvaMenu({ onTutorial }) {
    return (
        <>
            {/* Inicio → menú principal */}
            <a href="/ovas/espanol/cuento/menu">
                <HoverImg
                    src={IMG.menuHome} hoverSrc={IMG.menuHomeHover}
                    className="inicio" title="Menú principal" alt="Inicio"
                />
            </a>

            {/* Tutorial → abre el slider */}
            <HoverImg
                src={IMG.menuTutorial} hoverSrc={IMG.menuTutorialHover}
                className="tutorial" title="Tutorial" alt="Tutorial"
                style={{ cursor: 'pointer' }}
                onClick={onTutorial}
            />

            {/* Guía docente */}
            <a href={`${BASE}/guias/guiadocente.pdf`} target="_blank" rel="noreferrer">
                <HoverImg
                    src={IMG.menuTeacher} hoverSrc={IMG.menuTeacherHover}
                    className="profe" title="Guía docente" alt="Guía docente"
                />
            </a>
        </>
    );
}
