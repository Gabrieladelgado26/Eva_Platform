// ─────────────────────────────────────────────────────────────────────────────
// Partials/Buttons.jsx  —  OVA Español › El Cuento
//
// Los 4 botones de unidad: Repasemos (.reloj), Evaluemos (.pily),
// Aprende más (.ivy), Conoce (.beto).
// Clases CSS definidas en stylegeneral.css del OVA.
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useEffect } from 'react';

const BASE = '/OVAs/Espanol/Cuento';
const IMG = {
    unitRepasemos: `${BASE}/images/units/unit_repasemos.gif`,
    unitEvaluemos: `${BASE}/images/units/unit_evaluemos.gif`,
    unitAprende:   `${BASE}/images/units/unit_aprende_mas.gif`,
    unitConoce:    `${BASE}/images/units/unit_conoce.gif`,
    ttRepasemos:   `${BASE}/images/tooltips/tooltip_repasemos.png`,
    ttEvaluemos:   `${BASE}/images/tooltips/tooltip_evaluemos.png`,
    ttAprende:     `${BASE}/images/tooltips/tooltip_aprende_mas.png`,
};

function useAudioHover(ref, audioRef, tooltipRef = null) {
    useEffect(() => {
        const el    = ref.current;
        const audio = audioRef.current;
        if (!el || !audio) return;

        function enter() {
            audio.currentTime = 0;
            audio.play().catch(() => {});
            if (tooltipRef?.current) tooltipRef.current.style.display = 'block';
        }
        function leave() {
            audio.pause();
            if (tooltipRef?.current) tooltipRef.current.style.display = 'none';
        }

        el.addEventListener('mouseenter', enter);
        el.addEventListener('mouseleave', leave);
        return () => {
            el.removeEventListener('mouseenter', enter);
            el.removeEventListener('mouseleave', leave);
        };
    }, [ref, audioRef, tooltipRef]);
}

export default function OvaButtons({ onRepasemos, onEvaluemos, onAprende, onConoce, audioRefs }) {
    const refReloj = useRef(null);
    const refPily  = useRef(null);
    const refIvy   = useRef(null);
    const refBeto  = useRef(null);

    const refTtRepasemos = useRef(null);
    const refTtEvaluemos = useRef(null);
    const refTtAprende   = useRef(null);

    useAudioHover(refReloj, audioRefs.repasemos, refTtRepasemos);
    useAudioHover(refPily,  audioRefs.evaluemos, refTtEvaluemos);
    useAudioHover(refIvy,   audioRefs.aprende,   refTtAprende);
    useAudioHover(refBeto,  audioRefs.conoce);

    return (
        <>
            {/* Repasemos — .reloj */}
            <a id="repasemosIF" href="#" onClick={(e) => { e.preventDefault(); onRepasemos(); }}>
                <img ref={refReloj} className="reloj" src={IMG.unitRepasemos}
                     alt="Repasemos" draggable={false} />
                <div ref={refTtRepasemos} className="info" style={{ display: 'none' }}>
                    <img className="repasemos" src={IMG.ttRepasemos} alt="" draggable={false} />
                </div>
            </a>

            {/* Evaluemos — .pily */}
            <a href="#" onClick={(e) => { e.preventDefault(); onEvaluemos(); }}>
                <img ref={refPily} className="pily" src={IMG.unitEvaluemos}
                     alt="Evaluemos" draggable={false} />
                <div ref={refTtEvaluemos} className="evaluemos" style={{ display: 'none' }}>
                    <img className="evaluemos" src={IMG.ttEvaluemos} alt="" draggable={false} />
                </div>
            </a>

            {/* Aprende más — .ivy */}
            <a href="#" onClick={(e) => { e.preventDefault(); onAprende(); }}>
                <img ref={refIvy} className="ivy" src={IMG.unitAprende}
                     alt="Aprende más" draggable={false} />
                <div ref={refTtAprende} className="aprendemas" style={{ display: 'none' }}>
                    <img className="aprendemas" src={IMG.ttAprende} alt="" draggable={false} />
                </div>
            </a>

            {/* Conoce — .beto */}
            <a id="conoceOva" href="#" onClick={(e) => { e.preventDefault(); onConoce(); }}>
                <img ref={refBeto} className="beto" src={IMG.unitConoce}
                     alt="Conoce el OVA" draggable={false} />
                <div className="conoce" style={{ display: 'none' }} />
            </a>
        </>
    );
}
