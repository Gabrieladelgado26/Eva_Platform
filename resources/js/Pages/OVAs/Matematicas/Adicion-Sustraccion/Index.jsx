import React, { useEffect, useRef, useState } from 'react';
import { Head, router } from '@inertiajs/react';

const HAND = "url('/OVAs/Matematicas/Adicion-Sustraccion/images/hand.cur'), pointer";
const SND  = { skip: '/OVAs/Matematicas/Adicion-Sustraccion/sounds/intro/intro_skip.mp3' };

const OVAIndex = () => {
    const videoRef          = useRef(null);
    const [started,         setStarted]   = useState(false);
    const [skipHover,       setSkipHover] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Al terminar el video → ir al menú
        let redirecting = false;
        const handleEnd = () => {
            if (!redirecting) {
                redirecting = true;
                router.visit('/ovas/matematicas/adicion-sustraccion/menu');
            }
        };
        video.addEventListener('ended', handleEnd);

        return () => {
            video.removeEventListener('ended', handleEnd);
        };
    }, []);

    const handlePlay = () => {
        const video = videoRef.current;
        if (!video) return;
        video.muted = false;
        video.play().catch(() => {});
        setStarted(true);
    };

    const goToMenu = () => router.visit('/ovas/matematicas/adicion-sustraccion/menu');

    const handleSkipEnter = () => {
        setSkipHover(true);
        new Audio(SND.skip).play().catch(() => {});
    };

    return (
        <>
            <Head title="Investic - OVA" />

            <style>{`
                @keyframes ovaRipple {
                    0%   { transform: scale(0.5); opacity: 0.8; }
                    100% { transform: scale(2.4); opacity: 0;   }
                }
                @keyframes ovaFadePulse {
                    0%, 100% { opacity: 1;   }
                    50%       { opacity: 0.6; }
                }
            `}</style>

            {/* ── Video de introducción ─────────────────────────────────────── */}
            <video
                ref={videoRef}
                playsInline
                style={{
                    position: 'fixed',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 0,
                }}
            >
                <source src="/OVAs/Matematicas/Adicion-Sustraccion/media/Introduccioninicio3.mp4" type="video/mp4" />
            </video>

            {/* ── Botón de reproducción (visible antes de iniciar) ─────────── */}
            {!started && (
                <div
                    onClick={handlePlay}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 5000,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '20px',
                        cursor: HAND,
                        background: 'rgba(0,0,0,0.25)',
                    }}
                >
                    {/* Círculo play con ripples */}
                    <div style={{ position: 'relative', width: '96px', height: '96px' }}>
                        {/* Ripple 1 */}
                        <span style={{
                            position: 'absolute', inset: 0,
                            borderRadius: '50%',
                            border: '2.5px solid rgba(255,255,255,0.7)',
                            animation: 'ovaRipple 1.6s ease-out infinite',
                        }} />
                        {/* Ripple 2 desfasado */}
                        <span style={{
                            position: 'absolute', inset: 0,
                            borderRadius: '50%',
                            border: '2px solid rgba(255,255,255,0.45)',
                            animation: 'ovaRipple 1.6s ease-out infinite 0.55s',
                        }} />
                        {/* Fondo del botón */}
                        <span style={{
                            position: 'absolute', inset: 0,
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(4px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            {/* Triángulo play */}
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="white">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        </span>
                    </div>

                    {/* Etiqueta */}
                    <span style={{
                        background: 'rgba(0,0,0,0.55)',
                        color: '#fff',
                        fontSize: '15px',
                        fontWeight: 700,
                        padding: '8px 24px',
                        borderRadius: '24px',
                        whiteSpace: 'nowrap',
                        fontFamily: 'Chewy, sans-serif',
                        letterSpacing: '0.5px',
                        animation: 'ovaFadePulse 2s ease-in-out infinite',
                    }}>
                        ¡Toca para comenzar!
                    </span>
                </div>
            )}

            {/* ── Botón: Saltar animación (solo tras iniciar) ───────────────── */}
            {started && (
                <button
                    onClick={goToMenu}
                    onMouseEnter={handleSkipEnter}
                    onMouseLeave={() => setSkipHover(false)}
                    style={{
                        position: 'fixed',
                        zIndex: 5000,
                        width: '16%',
                        top: '88%',
                        left: '3%',
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: HAND,
                    }}
                >
                    <img
                        src={skipHover
                            ? '/OVAs/Matematicas/Adicion-Sustraccion/images/buttons/btn_skip_hover.png'
                            : '/OVAs/Matematicas/Adicion-Sustraccion/images/buttons/btn_skip.png'
                        }
                        alt="Saltar animación"
                        style={{ width: '100%', display: 'block' }}
                    />
                </button>
            )}
        </>
    );
};

export default OVAIndex;