// ─────────────────────────────────────────────────────────────────────────────
// Index.jsx  —  OVA Español › El Cuento
// Equivale a: index.php (intro video)
//
// Comportamiento: botón Reproducir → video inicia con sonido al primer clic.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useRef, useState } from 'react';
import { Head, router } from '@inertiajs/react';

const BASE   = '/OVAs/Espanol/Cuento';
const SHARED = '/OVAs/Shared';
const HAND   = "url('/OVAs/Shared/hand.cur'), pointer";

const OVAIndex = () => {
    const videoRef  = useRef(null);
    const saltarRef = useRef(null);
    const irmenuRef = useRef(null);
    const [started,   setStarted]   = useState(false);
    const [skipHover, setSkipHover] = useState(false);
    const [menuHover, setMenuHover] = useState(false);

    useEffect(() => {
        if (!started) return;

        const video = videoRef.current;
        if (!video) return;

        video.muted = false;
        video.play().catch(() => {});

        const showMenuButton = () => {
            if (saltarRef.current)
                saltarRef.current.style.setProperty('display', 'none', 'important');
            if (irmenuRef.current)
                irmenuRef.current.style.setProperty('display', 'table', 'important');
        };

        const timeout = setTimeout(showMenuButton, 51000);
        video.addEventListener('ended', showMenuButton);

        return () => {
            clearTimeout(timeout);
            video.removeEventListener('ended', showMenuButton);
        };
    }, [started]);

    const handlePlay = (e) => {
        e?.preventDefault();
        setStarted(true);
    };

    const goToMenu = (e) => {
        e?.preventDefault();
        router.visit('/ovas/espanol/cuento/menu');
    };

    return (
        <>
            <Head title="Investic – OVA El Cuento" />

            {!started && (
                <div
                    onClick={handlePlay}
                    style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        zIndex: 9000,
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        gap: '16px', cursor: HAND,
                        background: 'rgba(0,0,0,0.18)',
                    }}
                >
                    <style>{`
                        @keyframes ovaRipple {
                            0%   { transform: scale(0.5); opacity: 0.9; }
                            100% { transform: scale(2.6); opacity: 0; }
                        }
                    `}</style>
                    <div style={{ position: 'relative', width: '90px', height: '90px' }}>
                        <span style={{
                            position: 'absolute', inset: 0, borderRadius: '50%',
                            border: '3px solid rgba(255,255,255,0.75)',
                            animation: 'ovaRipple 1.8s ease-out infinite',
                        }} />
                        <span style={{
                            position: 'absolute', inset: 0, borderRadius: '50%',
                            border: '2px solid rgba(255,255,255,0.4)',
                            animation: 'ovaRipple 1.8s ease-out infinite 0.7s',
                        }} />
                        <div style={{
                            position: 'absolute', inset: 0, borderRadius: '50%',
                            background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(6px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        </div>
                    </div>
                    <span style={{
                        background: 'rgba(0,0,0,0.55)', color: '#fff',
                        fontSize: '15px', fontWeight: 700,
                        padding: '8px 22px', borderRadius: '20px',
                        fontFamily: 'Chewy, sans-serif',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                    }}>
                        Reproducir
                    </span>
                </div>
            )}

            <div id="todosonido" />
            <div id="skin" style={{ backgroundColor: '#FEFEB6' }} />

            <div className="Skin2">
                {started && (
                    <a href="#" onClick={goToMenu}
                       onMouseEnter={() => { setSkipHover(true); new Audio(`${BASE}/sounds/intro/intro_skip.mp3`).play().catch(() => {}); }}
                       onMouseLeave={() => setSkipHover(false)}
                    >
                        <img ref={saltarRef}
                            className="saltaranimacion cambiarImagen"
                            src={skipHover
                                ? `${BASE}/images/buttons/btn_skip_hover.png`
                                : `${BASE}/images/buttons/btn_skip.png`}
                            alt="Saltar animación" draggable={false}
                        />
                    </a>
                )}

                <a href="#" onClick={goToMenu}
                   onMouseEnter={() => { setMenuHover(true); new Audio(`${BASE}/sounds/navigation/nav_go_menu.mp3`).play().catch(() => {}); }}
                   onMouseLeave={() => setMenuHover(false)}
                >
                    <img ref={irmenuRef}
                        className="irmenu cambiarImagen"
                        src={menuHover
                            ? `${BASE}/images/buttons/btn_menu_hover.png`
                            : `${BASE}/images/buttons/btn_menu.png`}
                        alt="Ir al menú" draggable={false}
                    />
                </a>

                <video ref={videoRef} className="video" id="intro" playsInline>
                    <source src={`${BASE}/media/mot1.mp4`} type="video/mp4" />
                </video>

                <div id="tiempo" />
            </div>
        </>
    );
};

export default OVAIndex;
