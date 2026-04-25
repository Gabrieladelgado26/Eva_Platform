// ─────────────────────────────────────────────────────────────────────────────
// Index.jsx  —  OVA Español › El Cuento
// Equivale a: index.php (intro video)
//
// Comportamiento idéntico al original:
//   • El video se reproduce automáticamente (muted para cumplir policy)
//   • Primer clic → activa sonido + oculta indicador
//   • Botón .saltaranimacion: visible durante el video
//   • Botón .irmenu (btn_menu): oculto con display:none !important
//     → aparece al terminar el video (o tras 51 s, igual que el original)
//   • Al hacer clic en cualquiera de los dos → navega al menú
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useRef, useState } from 'react';
import { Head, router } from '@inertiajs/react';

const BASE = '/OVAs/Espanol/Cuento';

const OVAIndex = () => {
    const videoRef   = useRef(null);
    const saltarRef  = useRef(null); // img .saltaranimacion
    const irmenuRef  = useRef(null); // img .irmenu
    const [showHint, setShowHint] = useState(true);
    const [skipHover, setSkipHover] = useState(false);
    const [menuHover, setMenuHover] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        video.muted = true;

        // Reproducir inmediatamente (muted)
        video.play().catch(() => {});

        // Primer clic → activar sonido + ocultar indicador de clic
        const unmuteOnClick = () => {
            video.muted = false;
            setShowHint(false);
            document.removeEventListener('click', unmuteOnClick);
        };
        document.addEventListener('click', unmuteOnClick);

        // Muestra .irmenu y oculta .saltaranimacion
        // igual que el setTimeout del original y al terminar el video
        const showMenuButton = () => {
            if (saltarRef.current) {
                saltarRef.current.style.setProperty('display', 'none', 'important');
            }
            if (irmenuRef.current) {
                irmenuRef.current.style.setProperty('display', 'table', 'important');
            }
        };

        // Timeout original: 51 segundos
        const timeout = setTimeout(showMenuButton, 51000);
        video.addEventListener('ended', showMenuButton);

        return () => {
            clearTimeout(timeout);
            video.removeEventListener('ended', showMenuButton);
            document.removeEventListener('click', unmuteOnClick);
        };
    }, []);

    const goToMenu = (e) => {
        e?.preventDefault();
        router.visit('/ovas/espanol/cuento/menu');
    };

    return (
        <>
            <Head title="Investic – OVA El Cuento" />

            {/* Indicador centrado: clic para activar sonido (fixed, sobre todo) */}
            {showHint && (
                <div style={{
                    position: 'fixed', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 9000, pointerEvents: 'none',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: '14px',
                    animation: 'ovaFadePulse 2s ease-in-out infinite',
                }}>
                    <style>{`
                        @keyframes ovaFadePulse {
                            0%, 100% { opacity: 1; }
                            50% { opacity: 0.45; }
                        }
                        @keyframes ovaRipple {
                            0%   { transform: scale(0.5); opacity: 0.8; }
                            100% { transform: scale(2.4); opacity: 0; }
                        }
                        @keyframes ovaHandBounce {
                            0%, 100% { transform: translateY(0); }
                            40%       { transform: translateY(-12px); }
                            60%       { transform: translateY(-6px); }
                        }
                    `}</style>
                    <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                        <div style={{ position:'absolute', inset:0, borderRadius:'50%',
                            background:'rgba(255,255,255,0.15)', backdropFilter:'blur(6px)' }} />
                        <span style={{ position:'absolute', inset:0, borderRadius:'50%',
                            border:'2.5px solid rgba(255,255,255,0.7)',
                            animation:'ovaRipple 1.6s ease-out infinite' }} />
                        <span style={{ position:'absolute', inset:0, borderRadius:'50%',
                            border:'2px solid rgba(255,255,255,0.45)',
                            animation:'ovaRipple 1.6s ease-out infinite 0.6s' }} />
                        <span style={{ position:'absolute', inset:0, display:'flex',
                            alignItems:'center', justifyContent:'center',
                            animation:'ovaHandBounce 1.1s ease-in-out infinite' }}>
                            <svg width="34" height="34" viewBox="0 0 24 24" fill="white">
                                <path d="M9 11.24V7.5C9 6.12 10.12 5 11.5 5S14 6.12 14 7.5v3.74
                                    c1.21-.81 2-2.18 2-3.74C16 5.01 13.99 3 11.5 3S7 5.01 7 7.5
                                    c0 1.56.79 2.93 2 3.74zM18.84 15.87l-4.54-2.26
                                    c-.17-.07-.35-.11-.54-.11H13v-6c0-.83-.67-1.5-1.5-1.5
                                    S10 6.67 10 7.5v10.74l-3.43-.72c-.08-.01-.15-.03-.24-.03
                                    -.31 0-.59.13-.79.33l-.79.8 4.94 4.94c.27.27.65.44 1.06.44
                                    h6.79c.75 0 1.33-.55 1.44-1.28l.75-5.27
                                    c.01-.07.02-.14.02-.2 0-.62-.38-1.16-.91-1.38z"/>
                            </svg>
                        </span>
                    </div>
                    <span style={{
                        background:'rgba(0,0,0,0.55)', color:'#fff',
                        fontSize:'14px', fontWeight:700,
                        padding:'7px 20px', borderRadius:'20px',
                        fontFamily:'Chewy, sans-serif',
                        boxShadow:'0 4px 14px rgba(0,0,0,0.3)',
                        cursor: "url('OVAs/Shared/hand.cur'), auto",
                    }}>
                        Haz clic para activar el sonido
                    </span>
                </div>
            )}

            {/* Misma estructura HTML que index.php original */}
            <div id="todosonido" />
            <div id="skin" style={{ backgroundColor: '#FEFEB6' }} />

            <div className="Skin2">
                {/* Botón saltar (.saltaranimacion) — visible inicialmente */}
                <a href="#"
                   onClick={goToMenu}
                   onMouseEnter={() => {
                       setSkipHover(true);
                       new Audio(`${BASE}/sounds/intro/intro_skip.mp3`).play().catch(() => {});
                   }}
                   onMouseLeave={() => setSkipHover(false)}
                >
                    <img
                        ref={saltarRef}
                        className="saltaranimacion cambiarImagen"
                        src={skipHover
                            ? `${BASE}/images/buttons/btn_skip_hover.png`
                            : `${BASE}/images/buttons/btn_skip.png`}
                        alt="Saltar animación"
                        draggable={false}
                    />
                </a>

                {/* Botón ir al menú (.irmenu) — oculto hasta que termina el video */}
                <a href="#"
                   onClick={goToMenu}
                   onMouseEnter={() => {
                       setMenuHover(true);
                       new Audio(`${BASE}/sounds/navigation/nav_go_menu.mp3`).play().catch(() => {});
                   }}
                   onMouseLeave={() => setMenuHover(false)}
                >
                    <img
                        ref={irmenuRef}
                        className="irmenu cambiarImagen"
                        src={menuHover
                            ? `${BASE}/images/buttons/btn_menu_hover.png`
                            : `${BASE}/images/buttons/btn_menu.png`}
                        alt="Ir al menú"
                        draggable={false}
                    />
                </a>

                {/* Video de introducción */}
                <video
                    ref={videoRef}
                    className="video"
                    id="intro"
                    playsInline
                    muted
                >
                    <source src={`${BASE}/media/mot1.mp4`} type="video/mp4" />
                </video>

                <div id="tiempo" />
            </div>
        </>
    );
};

export default OVAIndex;
