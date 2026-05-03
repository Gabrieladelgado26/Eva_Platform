// ─────────────────────────────────────────────────────────────────────────────
// Layouts/Ova.jsx  —  OVA Ciencias Naturales › Seres Vivos
//
// Layout principal. Equivale al body de los temas (seresvivoseinertes.php, etc.).
// Incluye: fondo, unidades, menú lateral, modales comunes,
// música de fondo + botón .btnpausaplay, efectos de naturaleza.
//
// Diferencias vs Español:
//   • Botones de unidad: .jabali (repasemos), .perro (evaluemos),
//                        .mono (aprende más), .pili (conoce)
//   • Efectos: mariposas (.gifconoce/.gifaprendemas/.gifrepasemos/.gifevaluemos)
//              + hierva, planta, arbol, rama (natureza)
//   • La sign del tema (titulocontenido) se pasa como prop 'letrero'
//   • Slider src → /ovas/ciencias-naturales/seres-vivos/slider
//   • Home → /ovas/ciencias-naturales/seres-vivos/menu
//   • Aprende usa modal_prev.png como botón "regresar" (igual al original PHP)
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react';

const BASE   = '/OVAs/Ciencias-Naturales/Seres-Vivos';
const SHARED = '/OVAs/Shared';

const IMG = {
    bgSecondary:       `${BASE}/images/backgrounds/bg_secondary.png`,
    iconLicense:       `${SHARED}/images/branding/icon_license.png`,
    iconYoutube:       `${SHARED}/images/branding/youtube.png`,
    butterflies:       `${BASE}/images/effects/effect_butterflies.gif`,

    // Naturaleza
    hierva:            `${BASE}/images/effects/effect_grass.png`,
    planta:            `${BASE}/images/effects/effect_branches.png`,
    arbol:             `${BASE}/images/effects/effect_tree.png`,
    rama:              `${BASE}/images/effects/effect_branch.png`,

    // Unidades — gif normal + png hover
    unitRepasemos:     `${BASE}/images/units/unit_repasemos.gif`,
    unitRepasemosH:    `${BASE}/images/units/unit_repasemos_hover.png`,
    unitEvaluemos:     `${BASE}/images/units/unit_evaluemos.gif`,
    unitEvaluemosH:    `${BASE}/images/units/unit_evaluemos_hover.png`,
    unitAprende:       `${BASE}/images/units/unit_aprende_mas.gif`,
    unitAprendeH:      `${BASE}/images/units/unit_aprende_mas_hover.png`,
    unitConoce:        `${BASE}/images/units/unit_conoce.gif`,
    unitConoceH:       `${BASE}/images/units/unit_conoce_hover.png`,

    // Tooltips
    ttRepasemos:       `${BASE}/images/tooltips/tooltip_repasemos.png`,
    ttEvaluemos:       `${BASE}/images/tooltips/tooltip_evaluemos.png`,
    ttAprende:         `${BASE}/images/tooltips/tooltip_aprende_mas.png`,
    ttConoce:          `${BASE}/images/tooltips/tooltip_conoce.png`,

    // Modales
    modalFrame:        `${BASE}/images/modals/modal_frame.png`,
    modalBg:           `${BASE}/images/modals/modal_bg.png`,
    modalClose:        `${BASE}/images/modals/modal_close.png`,
    modalReturn:       `${BASE}/images/modals/modal_prev.png`,

    // Menú lateral
    menuHome:          `${BASE}/images/menu/menu_home.png`,
    menuHomeHover:     `${BASE}/images/menu/menu_home_hover.png`,
    menuTutorial:      `${BASE}/images/menu/menu_tutorial.png`,
    menuTutorialHover: `${BASE}/images/menu/menu_tutorial_hover.png`,
    menuTeacher:       `${BASE}/images/menu/menu_teacher_guide.png`,
    menuTeacherHover:  `${BASE}/images/menu/menu_teacher_guide_hover.png`,
    soundPlay:         `${BASE}/images/menu/menu_sound_play.png`,
    soundMute:         `${BASE}/images/menu/menu_sound_mute.png`,
    menuStack:         `${BASE}/images/menu/menu_stack.png`,
};

const SND = {
    bgMusic:   `${BASE}/sounds/system/background_music.mp3`,
    repasemos: `${SHARED}/sounds/unit/unit_repasemos.mp3`,
    evaluemos: `${SHARED}/sounds/unit/unit_evaluemos.mp3`,
    aprende:   `${SHARED}/sounds/unit/unit_aprende_mas.mp3`,
    conoce:    `${SHARED}/sounds/unit/unit_conoce.mp3`,
};

// ─── Hook: resize responsivo ──────────────────────────────────────────────────
function useResizeOVA(baseWidth = 750) {
    useEffect(() => {
        function resize() {
            const w = window.innerWidth;
            document.body.style.zoom = w <= baseWidth ? String(w / baseWidth) : '1';
        }
        resize();
        window.addEventListener('resize', resize);
        return () => {
            window.removeEventListener('resize', resize);
            document.body.style.zoom = '1';
        };
    }, [baseWidth]);
}

// ─── HoverImg ─────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// OvaModal — marco visual reutilizable
// ─────────────────────────────────────────────────────────────────────────────
export function OvaModal({
    open, onClose,
    frameImg, closeId,
    modalClass, contentClass,
    extraChildren, children,
    contentStyle = {},
}) {
    useEffect(() => {
        if (open) document.body.classList.add('modal-open');
        else      document.body.classList.remove('modal-open');
        return () => document.body.classList.remove('modal-open');
    }, [open]);

    if (!open) return null;

    return (
        <>
            <div className="modal-backdrop in" onClick={onClose} style={{ zIndex: 1040 }} />
            <div
                className={`modal in ${modalClass || ''}`}
                tabIndex="-1" role="dialog"
                style={{ display: 'block', overflowY: 'auto', zIndex: 1050 }}
            >
                <div
                    className="modal-dialog modal-lg"
                    style={{ marginTop: '2%', marginLeft: '12%', width: '78%' }}
                >
                    <div className="modal-content" style={{ backgroundColor: 'transparent' }}>
                        <img className="modalImagen" src={frameImg} alt="" draggable={false} />
                        <img
                            id={closeId}
                            className="iconocerrar"
                            src={IMG.modalClose}
                            alt="Cerrar"
                            draggable={false}
                            onClick={onClose}
                        />
                        {extraChildren}
                        <div className={contentClass} style={contentStyle}>
                            <div className="container-fluid" style={{ height: '100%', padding: 0 }}>
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// ─── Modal Slider ─────────────────────────────────────────────────────────────
// NOTA: CN stylegeneral.css no tiene .divmodalSlider — usa .divmodalRepasemos
// (igual que el PHP original seresvivoseinertes.php que usa class="divmodalRepasemos")
function ModalSlider({ open, onClose, bgRef }) {
    const [src, setSrc] = useState('');
    useEffect(() => {
        if (open) { setSrc('/ovas/ciencias-naturales/seres-vivos/slider'); duckVolume(bgRef); }
        else      { setSrc(''); restoreVolume(bgRef); }
    }, [open]);

    return (
        <OvaModal open={open} onClose={onClose}
            frameImg={IMG.modalFrame} closeId="cerrarmodalslider"
            modalClass="modalslider" contentClass="divmodalRepasemos"
        >
            <iframe id="contentslider" src={src} allowtransparency="true"
                style={{ border: 'none', background: 'transparent' }} title="Tutorial" />
        </OvaModal>
    );
}

// ─── Volume duck helpers ──────────────────────────────────────────────────────
const VOLUME_NORMAL = 0.6;
const VOLUME_DUCK   = 0.12;

function duckVolume(bgRef)    { if (bgRef?.current) bgRef.current.volume = VOLUME_DUCK; }
function restoreVolume(bgRef) { if (bgRef?.current) bgRef.current.volume = VOLUME_NORMAL; }

// ─── Modal Conoce ─────────────────────────────────────────────────────────────
function ModalConoce({ open, onClose, videoSrc: externalVideoSrc, bgRef }) {
    const [videoSrc, setVideoSrc] = useState('');

    useEffect(() => {
        if (open) { setVideoSrc(externalVideoSrc || ''); duckVolume(bgRef); }
        else      { setVideoSrc(''); restoreVolume(bgRef); }
    }, [open, externalVideoSrc]);

    return (
        <OvaModal open={open} onClose={onClose}
            frameImg={IMG.modalBg} closeId="cerrarmodalconoce"
            modalClass="modalConoce" contentClass="divmodalConoce"
        >
            <img className="iconoyoutube" src={IMG.iconYoutube} alt="YouTube" draggable={false} />
            <iframe id="contentVideoConoce" src={videoSrc} allowtransparency="true" allowFullScreen
                title="Conoce el OVA" className="videomodal"
                style={{ border: 'none', height: '84%', width: '82%', marginLeft: '-1%', marginTop: '-1%' }}
            />
        </OvaModal>
    );
}

// ─── Modal Repasemos ──────────────────────────────────────────────────────────
function ModalRepasemos({ open, onClose, src: externalSrc, bgRef }) {
    const [src, setSrc] = useState('');
    useEffect(() => {
        if (open && externalSrc) { setSrc(externalSrc); duckVolume(bgRef); }
        else if (!open)          { setSrc(''); restoreVolume(bgRef); }
    }, [open, externalSrc]);

    return (
        <OvaModal open={open} onClose={onClose}
            frameImg={IMG.modalBg} closeId="cerrarmodalrepasemos"
            modalClass="modalRepasemos" contentClass="divmodalRepasemos"
        >
            <iframe id="contentframeRepasemos" src={src} allowtransparency="true"
                style={{ width: '100%', height: '93%', border: 'none', background: 'transparent' }}
                title="Repasemos"
            />
        </OvaModal>
    );
}

// ─── Botones de unidad (con hover gif→png y tooltips) ─────────────────────────
// CN usa: .jabali (repasemos), .perro (evaluemos), .mono (aprende), .pili (conoce)
// Comportamiento igual al original generales.js (.cambiarImagengif):
//   mouseover → duck BG a 0.1, reproducir sonido de unidad
//   mouseout  → detener sonido (pause + reset), restaurar volumen BG
function OvaButtons({ onRepasemos, onEvaluemos, onAprende, onConoce, audioRefs, bgRef }) {
    const [jabaliHover, setJabaliHover] = useState(false);
    const [perroHover,  setPerroHover]  = useState(false);
    const [monoHover,   setMonoHover]   = useState(false);
    const [piliHover,   setPiliHover]   = useState(false);

    const [ttJabali, setTtJabali] = useState(false);
    const [ttPerro,  setTtPerro]  = useState(false);
    const [ttMono,   setTtMono]   = useState(false);
    const [ttPili,   setTtPili]   = useState(false);

    const playAudio = (ref) => {
        if (!ref?.current) return;
        ref.current.currentTime = 0;
        ref.current.play().catch(() => {});
        // Duck BG music igual que el original: vid.volume = 0.1
        if (bgRef?.current) bgRef.current.volume = 0.1;
    };
    const pauseAudio = (ref) => {
        if (!ref?.current) return;
        ref.current.pause();
        ref.current.currentTime = 0;
        // Restaurar BG music igual que el original: vid.volume = 1.0 → usamos VOLUME_NORMAL
        if (bgRef?.current) bgRef.current.volume = VOLUME_NORMAL;
    };

    return (
        <>
            {/* ── Repasemos (.jabali) ──────────────────────────────────── */}
            <a id="repasemosIF" href="#" onClick={(e) => { e.preventDefault(); onRepasemos(); }}>
                <img
                    className="jabali"
                    src={jabaliHover ? IMG.unitRepasemosH : IMG.unitRepasemos}
                    alt="Repasemos" draggable={false}
                    onMouseEnter={() => { setJabaliHover(true); setTtJabali(true); playAudio(audioRefs.repasemos); }}
                    onMouseLeave={() => { setJabaliHover(false); setTtJabali(false); pauseAudio(audioRefs.repasemos); }}
                />
                <div className="info" style={{ display: ttJabali ? 'block' : 'none' }}>
                    <img className="repasemos" src={IMG.ttRepasemos} alt="" draggable={false} />
                </div>
            </a>

            {/* ── Evaluemos (.perro) ───────────────────────────────────── */}
            <a href="#" onClick={(e) => { e.preventDefault(); onEvaluemos(); }}>
                <img
                    className="perro"
                    src={perroHover ? IMG.unitEvaluemosH : IMG.unitEvaluemos}
                    alt="Evaluemos" draggable={false}
                    onMouseEnter={() => { setPerroHover(true); setTtPerro(true); playAudio(audioRefs.evaluemos); }}
                    onMouseLeave={() => { setPerroHover(false); setTtPerro(false); pauseAudio(audioRefs.evaluemos); }}
                />
                <div className="evaluemos" style={{ display: ttPerro ? 'block' : 'none' }}>
                    <img className="evaluemos" src={IMG.ttEvaluemos} alt="" draggable={false} />
                </div>
            </a>

            {/* ── Aprende más (.mono) ──────────────────────────────────── */}
            <a href="#" onClick={(e) => { e.preventDefault(); onAprende(); }}>
                <img
                    className="mono"
                    src={monoHover ? IMG.unitAprendeH : IMG.unitAprende}
                    alt="Aprende más" draggable={false}
                    onMouseEnter={() => { setMonoHover(true); setTtMono(true); playAudio(audioRefs.aprende); }}
                    onMouseLeave={() => { setMonoHover(false); setTtMono(false); pauseAudio(audioRefs.aprende); }}
                />
                <div className="aprendemas" style={{ display: ttMono ? 'block' : 'none' }}>
                    <img className="aprendemas" src={IMG.ttAprende} alt="" draggable={false} />
                </div>
            </a>

            {/* ── Conoce (.pili) ───────────────────────────────────────── */}
            <a id="conoceOva" href="#" onClick={(e) => { e.preventDefault(); onConoce(); }}>
                <img
                    className="pili"
                    src={piliHover ? IMG.unitConoceH : IMG.unitConoce}
                    alt="Conoce el OVA" draggable={false}
                    onMouseEnter={() => { setPiliHover(true); setTtPili(true); playAudio(audioRefs.conoce); }}
                    onMouseLeave={() => { setPiliHover(false); setTtPili(false); pauseAudio(audioRefs.conoce); }}
                />
                <div className="conoce" style={{ display: ttPili ? 'block' : 'none', width: 30, height: 50 }}>
                    <img
                        id="canvas_btn_act1"
                        className="conoce"
                        src={IMG.ttConoce}
                        alt=""
                        draggable={false}
                        style={{ display: ttPili ? 'block' : 'none' }}
                    />
                </div>
            </a>
        </>
    );
}

// ─── Efectos de naturaleza + mariposas ───────────────────────────────────────
function OvaNatureEffects() {
    return (
        <>
            {/* Elementos de fondo natureza */}
            <img className="hierva" src={IMG.hierva} alt="" draggable={false} />
            <img className="planta" src={IMG.planta} alt="" draggable={false} />
            <img className="arbol"  src={IMG.arbol}  alt="" draggable={false} />
            <img className="rama"   src={IMG.rama}   alt="" draggable={false} />

            {/* Mariposas animadas (equivale a libros en Español) */}
            <img className="gifconoce"     src={IMG.butterflies} alt="" draggable={false} />
            <img className="gifaprendemas" src={IMG.butterflies} alt="" draggable={false} />
            <img className="gifrepasemos"  src={IMG.butterflies} alt="" draggable={false} />
            <img className="gifevaluemos"  src={IMG.butterflies} alt="" draggable={false} />
        </>
    );
}

// ─── Menú lateral ─────────────────────────────────────────────────────────────
function OvaMenu({ onTutorial, isMuted, onToggleSound }) {
    return (
        <>
            <a href="/ovas/ciencias-naturales/seres-vivos/menu">
                <HoverImg src={IMG.menuHome} hoverSrc={IMG.menuHomeHover}
                    className="inicio" title="Menú principal" alt="Inicio" />
            </a>

            <HoverImg src={IMG.menuTutorial} hoverSrc={IMG.menuTutorialHover}
                className="tutorial" title="Tutorial" alt="Tutorial"
                style={{ cursor: 'pointer' }} onClick={onTutorial} />

            {/* Botón de sonido */}
            <img
                id="btnpausaplay"
                className="btnpausaplay"
                src={isMuted ? IMG.soundMute : IMG.soundPlay}
                title={isMuted ? 'Activar sonido' : 'Silenciar'}
                alt="Sonido"
                draggable={false}
                onClick={onToggleSound}
                style={{ cursor: 'pointer' }}
            />

            <a href={`${BASE}/guias/guiadocente.pdf`} target="_blank" rel="noreferrer">
                <HoverImg src={IMG.menuTeacher} hoverSrc={IMG.menuTeacherHover}
                    className="profe" title="Guía docente" alt="Guía docente" />
            </a>
        </>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL: OvaLayout
// ─────────────────────────────────────────────────────────────────────────────
export default function OvaLayout({
    children,
    letrero         = null,
    repasemosSrc    = '',
    conoceVideoSrc  = '',
    renderAprende   = null,
    renderEvaluemos = null,
    metaTitle       = 'Investic',
}) {
    useResizeOVA(750);

    const audioRefs = {
        repasemos: useRef(null),
        evaluemos: useRef(null),
        aprende:   useRef(null),
        conoce:    useRef(null),
    };

    const bgMusicRef = useRef(null);
    const [isMuted, setIsMuted] = useState(false);

    const [sliderOpen,    setSliderOpen]    = useState(false);
    const [repasemosOpen, setRepasemosOpen] = useState(false);
    const [conoceOpen,    setConoceOpen]    = useState(false);
    const [evaluemosOpen, setEvaluemosOpen] = useState(false);
    const [aprendeOpen,   setAprendeOpen]   = useState(false);

    useEffect(() => {
        const bg = bgMusicRef.current;
        if (bg) {
            bg.loop = true;
            bg.volume = 0.6;
            bg.play().catch(() => {});
        }
        const timer = setTimeout(() => setSliderOpen(true), 1000);
        return () => {
            clearTimeout(timer);
            if (bg) bg.pause();
        };
    }, []);

    useEffect(() => {
        document.title = metaTitle || 'Investic';
    }, [metaTitle]);

    const handleToggleSound = () => {
        const bg = bgMusicRef.current;
        if (!bg) return;
        if (isMuted) {
            bg.play().catch(() => {});
            setIsMuted(false);
        } else {
            bg.pause();
            setIsMuted(true);
        }
    };

    return (
        <>
            {/* Música de fondo */}
            <audio ref={bgMusicRef} src={SND.bgMusic} preload="auto" />

            {/* Audios de unidad */}
            <audio ref={audioRefs.repasemos} preload="auto" src={SND.repasemos} />
            <audio ref={audioRefs.evaluemos} preload="auto" src={SND.evaluemos} />
            <audio ref={audioRefs.aprende}   preload="auto" src={SND.aprende}   />
            <audio ref={audioRefs.conoce}    preload="auto" src={SND.conoce}    />

            <span id="enlace_home" />
            <div id="skin" style={{ backgroundColor: '#FEFEB6' }} />

            <div className="Skin2">
                {/* Fondo principal */}
                <img className="Skin2"    src={IMG.bgSecondary} alt="" draggable={false} />
                {/* Licencia */}
                <img className="licencia" src={IMG.iconLicense} alt="" draggable={false} />

                {/* Título del tema (letrero de la sign del tema — prop) */}
                {letrero}

                {/* Decoración tubo */}
                <img className="tubo" src={IMG.menuStack} alt="" draggable={false} />

                {/* Efectos de naturaleza + mariposas */}
                <OvaNatureEffects />

                {/* Botones de unidad */}
                <OvaButtons
                    onRepasemos={() => setRepasemosOpen(true)}
                    onEvaluemos={() => setEvaluemosOpen(true)}
                    onAprende={  () => setAprendeOpen(true)}
                    onConoce={   () => setConoceOpen(true)}
                    audioRefs={audioRefs}
                    bgRef={bgMusicRef}
                />

                {/* Menú lateral */}
                <OvaMenu
                    onTutorial={() => setSliderOpen(true)}
                    isMuted={isMuted}
                    onToggleSound={handleToggleSound}
                />
            </div>

            {/* Modales comunes */}
            <ModalSlider    open={sliderOpen}    onClose={() => setSliderOpen(false)}    bgRef={bgMusicRef} />
            <ModalRepasemos open={repasemosOpen} onClose={() => setRepasemosOpen(false)} src={repasemosSrc} bgRef={bgMusicRef} />
            <ModalConoce    open={conoceOpen}    onClose={() => setConoceOpen(false)}    videoSrc={conoceVideoSrc} bgRef={bgMusicRef} />

            {/* Modales del tema (inyectados desde la página) — duck/restore gestionado dentro de cada modal */}
            {renderAprende   && renderAprende(aprendeOpen,     () => { setAprendeOpen(false);   restoreVolume(bgMusicRef); }, bgMusicRef)}
            {renderEvaluemos && renderEvaluemos(evaluemosOpen, () => { setEvaluemosOpen(false); restoreVolume(bgMusicRef); }, bgMusicRef)}

            {children}
        </>
    );
}
