// ─────────────────────────────────────────────────────────────────────────────
// Partials/Buttons.jsx  —  OVA Ciencias Sociales › Patrimonio Cultural
//
// Los 4 botones de unidad: Repasemos (.personaje), Evaluemos (.vender),
// Aprende más (.carroza), Conoce (.volcan).
// Clases CSS definidas en stylegeneral.css del OVA.
//
// Comportamiento igual al original generales.js (.cambiarImagengif):
//   mouseover → duck BG a 0.1, reproducir sonido de unidad
//   mouseout  → detener sonido (pause + reset), restaurar volumen BG
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';

const BASE = '/OVAs/Ciencias-Sociales/Patrimonio-Cultural';

const IMG = {
    unitRepasemos:  `${BASE}/images/units/unit_repasemos.gif`,
    unitRepasemosH: `${BASE}/images/units/unit_repasemos_hover.png`,
    unitEvaluemos:  `${BASE}/images/units/unit_evaluemos.gif`,
    unitEvaluemosH: `${BASE}/images/units/unit_evaluemos_hover.png`,
    unitAprende:    `${BASE}/images/units/unit_aprende_mas.gif`,
    unitAprendeH:   `${BASE}/images/units/unit_aprende_mas_hover.png`,
    unitConoce:     `${BASE}/images/units/unit_conoce.gif`,
    unitConoceH:    `${BASE}/images/units/unit_conoce_hover.png`,
    ttRepasemos:    `${BASE}/images/tooltips/tooltip_repasemos.png`,
    ttEvaluemos:    `${BASE}/images/tooltips/tooltip_evaluemos.png`,
    ttAprende:      `${BASE}/images/tooltips/tooltip_aprende_mas.png`,
    ttConoce:       `${BASE}/images/tooltips/tooltip_conoce.png`,
};

const VOLUME_NORMAL = 0.6;

export default function OvaButtons({ onRepasemos, onEvaluemos, onAprende, onConoce, audioRefs, bgRef }) {
    const [personajeHover, setPersonajeHover] = useState(false);
    const [venderHover,    setVenderHover]    = useState(false);
    const [carrozaHover,   setCarrozaHover]   = useState(false);
    const [volcanHover,    setVolcanHover]    = useState(false);

    const [ttPersonaje, setTtPersonaje] = useState(false);
    const [ttVender,    setTtVender]    = useState(false);
    const [ttCarroza,   setTtCarroza]   = useState(false);
    const [ttVolcan,    setTtVolcan]    = useState(false);

    const playAudio = (ref) => {
        if (!ref?.current) return;
        ref.current.currentTime = 0;
        ref.current.play().catch(() => {});
        if (bgRef?.current) bgRef.current.volume = 0.1;
    };
    const pauseAudio = (ref) => {
        if (!ref?.current) return;
        ref.current.pause();
        ref.current.currentTime = 0;
        if (bgRef?.current) bgRef.current.volume = VOLUME_NORMAL;
    };

    return (
        <>
            {/* ── Repasemos (.personaje) ──────────────────────────────────── */}
            <a id="repasemosIF" href="#" onClick={(e) => { e.preventDefault(); onRepasemos(); }}>
                <img
                    className="personaje cambiarImagengif"
                    src={personajeHover ? IMG.unitRepasemosH : IMG.unitRepasemos}
                    alt="Repasemos" draggable={false}
                    onMouseEnter={() => { setPersonajeHover(true); setTtPersonaje(true); playAudio(audioRefs.repasemos); }}
                    onMouseLeave={() => { setPersonajeHover(false); setTtPersonaje(false); pauseAudio(audioRefs.repasemos); }}
                />
                <div className="info" style={{ display: ttPersonaje ? 'block' : 'none', width: 30, height: 50 }}>
                    <img className="repasemos" src={IMG.ttRepasemos} alt="" draggable={false} />
                </div>
            </a>

            {/* ── Evaluemos (.vender) ─────────────────────────────────────── */}
            <a href="#" onClick={(e) => { e.preventDefault(); onEvaluemos(); }}>
                <img
                    className="vender cambiarImagengif"
                    src={venderHover ? IMG.unitEvaluemosH : IMG.unitEvaluemos}
                    alt="Evaluemos" draggable={false}
                    onMouseEnter={() => { setVenderHover(true); setTtVender(true); playAudio(audioRefs.evaluemos); }}
                    onMouseLeave={() => { setVenderHover(false); setTtVender(false); pauseAudio(audioRefs.evaluemos); }}
                />
                <div className="evaluemos" style={{ display: ttVender ? 'block' : 'none', width: 30, height: 50 }}>
                    <img className="evaluemos" src={IMG.ttEvaluemos} alt="" draggable={false} />
                </div>
            </a>

            {/* ── Aprende más (.carroza) ──────────────────────────────────── */}
            <a href="#" onClick={(e) => { e.preventDefault(); onAprende(); }}>
                <img
                    className="carroza cambiarImagengif"
                    src={carrozaHover ? IMG.unitAprendeH : IMG.unitAprende}
                    alt="Aprende más" draggable={false}
                    onMouseEnter={() => { setCarrozaHover(true); setTtCarroza(true); playAudio(audioRefs.aprende); }}
                    onMouseLeave={() => { setCarrozaHover(false); setTtCarroza(false); pauseAudio(audioRefs.aprende); }}
                />
                <div className="aprendemas" style={{ display: ttCarroza ? 'block' : 'none', width: 30, height: 50 }}>
                    <img className="aprendemas" src={IMG.ttAprende} alt="" draggable={false} />
                </div>
            </a>

            {/* ── Conoce (.volcan) ────────────────────────────────────────── */}
            <a id="conoceOva" href="#" onClick={(e) => { e.preventDefault(); onConoce(); }}>
                <img
                    className="volcan cambiarImagengif"
                    src={volcanHover ? IMG.unitConoceH : IMG.unitConoce}
                    alt="Conoce el OVA" draggable={false}
                    onMouseEnter={() => { setVolcanHover(true); setTtVolcan(true); playAudio(audioRefs.conoce); }}
                    onMouseLeave={() => { setVolcanHover(false); setTtVolcan(false); pauseAudio(audioRefs.conoce); }}
                />
                <div className="conoce" style={{ display: ttVolcan ? 'block' : 'none', width: 30, height: 50 }}>
                    <img id="canvas_btn_act1" className="conoce" src={IMG.ttConoce} alt="" draggable={false}
                        style={{ display: ttVolcan ? 'block' : 'none' }} />
                </div>
            </a>
        </>
    );
}
