// ─────────────────────────────────────────────────────────────────────────────
// Layouts/Ova.jsx  —  OVA Español › El Cuento
//
// Layout principal. Equivale al body de elcuento.php.
// Incluye: fondo, unidades, menú lateral, modales comunes,
// música de fondo + botón .btnpausaplay, efectos de libros.
//
// Cambia vs el original PHP:
//   • Hover gif→png manejado en React (no jQuery .cambiarImagengif)
//   • Tooltips manejados con estado React
//   • Música de fondo con <audio> React
//   • Modales sin Bootstrap jQuery
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react';

const BASE = '/OVAs/Espanol/Cuento';

const IMG = {
    bgSecondary:       `${BASE}/images/backgrounds/bg_secondary.png`,
    mapEffect:         `${BASE}/images/effects/effect_map.gif`,
    iconLicense:       `${BASE}/images/branding/icon_license.png`,
    books:             `${BASE}/images/effects/effect_books.gif`,

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
    modalReturn:       `${BASE}/images/modals/modal_return.png`,
    iconYoutube:       `${BASE}/images/branding/youtube.png`,

    // Menú lateral
    menuHome:          `${BASE}/images/menu/menu_home.png`,
    menuHomeHover:     `${BASE}/images/menu/menu_home_hover.png`,
    menuTutorial:      `${BASE}/images/menu/menu_tutorial.png`,
    menuTutorialHover: `${BASE}/images/menu/menu_tutorial_hover.png`,
    menuTeacher:       `${BASE}/images/menu/menu_teacher_guide.png`,
    menuTeacherHover:  `${BASE}/images/menu/menu_teacher_guide_hover.png`,
    soundPlay:         `${BASE}/images/menu/menu_sound_play.png`,
    soundMute:         `${BASE}/images/menu/menu_sound_mute.png`,

    // Decoración
    signCuento:        `${BASE}/images/signboard/sign_cuento.png`,
    menuStack:         `${BASE}/images/menu/menu_stack.png`,
};

const SND = {
    bgMusic:   `${BASE}/sounds/system/background_music.mp3`,
    repasemos: `${BASE}/sounds/unit/unit_repasemos.mp3`,
    evaluemos: `${BASE}/sounds/unit/unit_evaluemos.mp3`,
    aprende:   `${BASE}/sounds/unit/unit_aprende_mas.mp3`,
    conoce:    `${BASE}/sounds/unit/unit_conoce.mp3`,
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
                            <div className="container-fluid" style={{ height: '100%' }}>
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
function ModalSlider({ open, onClose }) {
    const [src, setSrc] = useState('');
    useEffect(() => {
        if (open) setSrc('/ovas/espanol/cuento/slider');
        else      setSrc('');
    }, [open]);

    return (
        <OvaModal open={open} onClose={onClose}
            frameImg={IMG.modalFrame} closeId="cerrarmodalslider"
            modalClass="modalslider" contentClass="divmodalSlider"
        >
            <iframe id="contentslider" src={src} allowtransparency="true"
                style={{ border: 'none', background: 'transparent' }} title="Tutorial" />
        </OvaModal>
    );
}

// ─── Modal Conoce ─────────────────────────────────────────────────────────────
function ModalConoce({ open, onClose, videoSrc: externalVideoSrc }) {
    const defaultVideo = 'https://www.youtube-nocookie.com/embed/pd100ARogHU?rel=0&showinfo=0';
    const [videoSrc, setVideoSrc] = useState('');

    useEffect(() => {
        if (open) setVideoSrc(externalVideoSrc || defaultVideo);
        else      setVideoSrc('');
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
function ModalRepasemos({ open, onClose, src: externalSrc }) {
    const [src, setSrc] = useState('');
    useEffect(() => {
        if (open && externalSrc) setSrc(externalSrc);
        else if (!open)          setSrc('');
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
function OvaButtons({ onRepasemos, onEvaluemos, onAprende, onConoce, audioRefs }) {
    // Estado hover para imagen gif→png
    const [relojHover, setRelojHover] = useState(false);
    const [pilyHover,  setPilyHover]  = useState(false);
    const [ivyHover,   setIvyHover]   = useState(false);
    const [betoHover,  setBetoHover]  = useState(false);

    // Estado para mostrar tooltips
    const [ttReloj, setTtReloj] = useState(false);
    const [ttPily,  setTtPily]  = useState(false);
    const [ttIvy,   setTtIvy]   = useState(false);
    const [ttBeto,  setTtBeto]  = useState(false);

    const playAudio = (ref) => {
        if (!ref?.current) return;
        ref.current.currentTime = 0;
        ref.current.play().catch(() => {});
    };
    const pauseAudio = (ref) => {
        if (!ref?.current) return;
        ref.current.pause();
    };

    return (
        <>
            {/* ── Repasemos (.reloj) ─────────────────────────────────────── */}
            <a id="repasemosIF" href="#" onClick={(e) => { e.preventDefault(); onRepasemos(); }}>
                <img
                    className="reloj"
                    src={relojHover ? IMG.unitRepasemosH : IMG.unitRepasemos}
                    alt="Repasemos" draggable={false}
                    onMouseEnter={() => { setRelojHover(true); setTtReloj(true); playAudio(audioRefs.repasemos); }}
                    onMouseLeave={() => { setRelojHover(false); setTtReloj(false); pauseAudio(audioRefs.repasemos); }}
                />
                {/* Tooltip */}
                <div className="info" style={{ display: ttReloj ? 'block' : 'none' }}>
                    <img className="repasemos" src={IMG.ttRepasemos} alt="" draggable={false} />
                </div>
            </a>

            {/* ── Evaluemos (.pily) ─────────────────────────────────────── */}
            <a href="#" onClick={(e) => { e.preventDefault(); onEvaluemos(); }}>
                <img
                    className="pily"
                    src={pilyHover ? IMG.unitEvaluemosH : IMG.unitEvaluemos}
                    alt="Evaluemos" draggable={false}
                    onMouseEnter={() => { setPilyHover(true); setTtPily(true); playAudio(audioRefs.evaluemos); }}
                    onMouseLeave={() => { setPilyHover(false); setTtPily(false); pauseAudio(audioRefs.evaluemos); }}
                />
                <div className="evaluemos" style={{ display: ttPily ? 'block' : 'none' }}>
                    <img className="evaluemos" src={IMG.ttEvaluemos} alt="" draggable={false} />
                </div>
            </a>

            {/* ── Aprende más (.ivy) ────────────────────────────────────── */}
            <a href="#" onClick={(e) => { e.preventDefault(); onAprende(); }}>
                <img
                    className="ivy"
                    src={ivyHover ? IMG.unitAprendeH : IMG.unitAprende}
                    alt="Aprende más" draggable={false}
                    onMouseEnter={() => { setIvyHover(true); setTtIvy(true); playAudio(audioRefs.aprende); }}
                    onMouseLeave={() => { setIvyHover(false); setTtIvy(false); pauseAudio(audioRefs.aprende); }}
                />
                <div className="aprendemas" style={{ display: ttIvy ? 'block' : 'none' }}>
                    <img className="aprendemas" src={IMG.ttAprende} alt="" draggable={false} />
                </div>
            </a>

            {/* ── Conoce (.beto) ────────────────────────────────────────── */}
            <a id="conoceOva" href="#" onClick={(e) => { e.preventDefault(); onConoce(); }}>
                <img
                    className="beto"
                    src={betoHover ? IMG.unitConoceH : IMG.unitConoce}
                    alt="Conoce el OVA" draggable={false}
                    onMouseEnter={() => { setBetoHover(true); setTtBeto(true); playAudio(audioRefs.conoce); }}
                    onMouseLeave={() => { setBetoHover(false); setTtBeto(false); pauseAudio(audioRefs.conoce); }}
                />
                {/* Tooltip de conoce — div.conoce con img.conoce dentro */}
                <div className="conoce" style={{ display: ttBeto ? 'block' : 'none', width: 30, height: 50 }}>
                    <img
                        id="canvas_btn_act1"
                        className="conoce"
                        src={IMG.ttConoce}
                        alt=""
                        draggable={false}
                        style={{ display: ttBeto ? 'block' : 'none' }}
                    />
                </div>
            </a>
        </>
    );
}

// ─── Efectos libros ───────────────────────────────────────────────────────────
function OvaBooks() {
    return (
        <>
            <img className="gifconoce"     src={IMG.books} alt="" draggable={false} />
            <img className="gifaprendemas" src={IMG.books} alt="" draggable={false} />
            <img className="gifrepasemos"  src={IMG.books} alt="" draggable={false} />
            <img className="gifevaluemos"  src={IMG.books} alt="" draggable={false} />
        </>
    );
}

// ─── Menú lateral ─────────────────────────────────────────────────────────────
function OvaMenu({ onTutorial, isMuted, onToggleSound }) {
    return (
        <>
            <a href="/ovas/espanol/cuento/menu">
                <HoverImg src={IMG.menuHome} hoverSrc={IMG.menuHomeHover}
                    className="inicio" title="Menú principal" alt="Inicio" />
            </a>

            <HoverImg src={IMG.menuTutorial} hoverSrc={IMG.menuTutorialHover}
                className="tutorial" title="Tutorial" alt="Tutorial"
                style={{ cursor: 'pointer' }} onClick={onTutorial} />

            {/* Botón de sonido (fondo musical) — equivale a #btnpausaplay */}
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

    // Audios de unidad
    const audioRefs = {
        repasemos: useRef(null),
        evaluemos: useRef(null),
        aprende:   useRef(null),
        conoce:    useRef(null),
    };

    // Música de fondo (channel 1)
    const bgMusicRef  = useRef(null);
    const [isMuted, setIsMuted] = useState(false);

    // Estado de modales
    const [sliderOpen,    setSliderOpen]    = useState(false);
    const [repasemosOpen, setRepasemosOpen] = useState(false);
    const [conoceOpen,    setConoceOpen]    = useState(false);
    const [evaluemosOpen, setEvaluemosOpen] = useState(false);
    const [aprendeOpen,   setAprendeOpen]   = useState(false);

    // Iniciar música de fondo y abrir slider tutorial al cargar
    useEffect(() => {
        const bg = bgMusicRef.current;
        if (bg) {
            bg.loop = true;
            bg.volume = 0.6;
            bg.play().catch(() => {}); // puede fallar sin interacción previa
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
                {/* Mapa */}
                <img className="mapa"     src={IMG.mapEffect}   alt="" draggable={false} />
                {/* Licencia */}
                <img className="licencia" src={IMG.iconLicense} alt="" draggable={false} />

                {/* Título del tema */}
                <img className="titulocontenido" src={IMG.signCuento} alt="El Cuento" draggable={false} />
                {/* Decoración tubo */}
                <img className="tubo" src={IMG.menuStack} alt="" draggable={false} />

                {/* Letrero personalizado (prop) */}
                {letrero}

                {/* Botones de unidad */}
                <OvaButtons
                    onRepasemos={() => setRepasemosOpen(true)}
                    onEvaluemos={() => setEvaluemosOpen(true)}
                    onAprende={  () => setAprendeOpen(true)}
                    onConoce={   () => setConoceOpen(true)}
                    audioRefs={audioRefs}
                />

                {/* Efectos de libros */}
                <OvaBooks />

                {/* Menú lateral (con botón de sonido) */}
                <OvaMenu
                    onTutorial={() => setSliderOpen(true)}
                    isMuted={isMuted}
                    onToggleSound={handleToggleSound}
                />
            </div>

            {/* Modales comunes */}
            <ModalSlider    open={sliderOpen}    onClose={() => setSliderOpen(false)} />
            <ModalRepasemos open={repasemosOpen} onClose={() => setRepasemosOpen(false)} src={repasemosSrc} />
            <ModalConoce    open={conoceOpen}    onClose={() => setConoceOpen(false)}    videoSrc={conoceVideoSrc} />

            {/* Modales del tema (inyectados desde la página) */}
            {renderAprende   && renderAprende(aprendeOpen,   () => setAprendeOpen(false))}
            {renderEvaluemos && renderEvaluemos(evaluemosOpen, () => setEvaluemosOpen(false))}

            {children}
        </>
    );
}
