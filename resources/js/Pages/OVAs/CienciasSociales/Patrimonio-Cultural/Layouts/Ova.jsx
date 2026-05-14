// ─────────────────────────────────────────────────────────────────────────────
// Layouts/Ova.jsx  —  OVA Ciencias Sociales › Patrimonio Cultural
//
// Layout principal. Equivale al body de los temas:
//   patrimoniocultural.php / gastronomia.php / turismo.php
//
// Diferencias vs CN Seres Vivos:
//   • Botones de unidad: .personaje (repasemos), .vender (evaluemos),
//                        .carroza (aprende más), .volcan (conoce)
//   • Efecto: .panel (effect_panel.png)
//   • GIFs decorativos: todos usan effect_mask_3.gif
//   • La sign del tema (titulocontenido) se pasa como prop 'letrero'
//   • Slider → /ovas/ciencias-sociales/patrimonio-cultural/slider
//   • Home  → /ovas/ciencias-sociales/patrimonio-cultural/menu
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react';
import OvaButtons from '../Partials/Buttons';

const BASE   = '/OVAs/Ciencias-Sociales/Patrimonio-Cultural';
const SHARED = '/OVAs/Shared';

const IMG = {
    bgSecondary:       `${BASE}/images/backgrounds/bg_secondary.png`,
    iconLicense:       `${SHARED}/images/branding/icon_license.png`,
    iconYoutube:       `${SHARED}/images/branding/youtube.png`,
    effectPanel:       `${BASE}/images/effects/effect_panel.png`,
    effectMask:        `${BASE}/images/effects/effect_mask_3.gif`,

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

// ─── Volume helpers ───────────────────────────────────────────────────────────
const VOLUME_NORMAL = 0.6;
const VOLUME_DUCK   = 0.12;

function duckVolume(bgRef)    { if (bgRef?.current) bgRef.current.volume = VOLUME_DUCK; }
function restoreVolume(bgRef) { if (bgRef?.current) bgRef.current.volume = VOLUME_NORMAL; }

// ─── Modal Slider ─────────────────────────────────────────────────────────────
function ModalSlider({ open, onClose, bgRef }) {
    const [src, setSrc] = useState('');
    useEffect(() => {
        if (open) { setSrc('/ovas/ciencias-sociales/patrimonio-cultural/slider'); duckVolume(bgRef); }
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

// ─── Efectos decorativos ──────────────────────────────────────────────────────
function OvaEffects() {
    return (
        <>
            <img className="panel"       src={IMG.effectPanel} alt="" draggable={false} />
            <img className="gifconoce"   src={IMG.effectMask}  alt="" draggable={false} />
            <img className="gifaprendemas" src={IMG.effectMask} alt="" draggable={false} />
            <img className="gifrepasemos"  src={IMG.effectMask} alt="" draggable={false} />
            <img className="gifevaluemos"  src={IMG.effectMask} alt="" draggable={false} />
        </>
    );
}

// ─── Menú lateral ─────────────────────────────────────────────────────────────
function OvaMenu({ onTutorial, isMuted, onToggleSound }) {
    return (
        <>
            <a href="/ovas/ciencias-sociales/patrimonio-cultural/menu">
                <HoverImg src={IMG.menuHome} hoverSrc={IMG.menuHomeHover}
                    className="inicio" title="Menú principal" alt="Inicio" />
            </a>

            <HoverImg src={IMG.menuTutorial} hoverSrc={IMG.menuTutorialHover}
                className="tutorial" title="Tutorial" alt="Tutorial"
                style={{ cursor: 'pointer' }} onClick={onTutorial} />

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
            bg.loop   = true;
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

            <a id="enlace_home" href="#" />
            <div id="skin" style={{ backgroundColor: '#FEFEB6' }} />

            <div className="Skin2">
                <img className="Skin2"    src={IMG.bgSecondary} alt="" draggable={false} />
                <img className="licencia" src={IMG.iconLicense} alt="" draggable={false} />

                {/* Título del tema */}
                {letrero}

                <img className="tubo" src={IMG.menuStack} alt="" draggable={false} />

                {/* Efectos decorativos */}
                <OvaEffects />

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

            {/* Modales del tema */}
            {renderAprende   && renderAprende(aprendeOpen,     () => { setAprendeOpen(false);   restoreVolume(bgMusicRef); }, bgMusicRef)}
            {renderEvaluemos && renderEvaluemos(evaluemosOpen, () => { setEvaluemosOpen(false); restoreVolume(bgMusicRef); }, bgMusicRef)}

            {children}
        </>
    );
}
