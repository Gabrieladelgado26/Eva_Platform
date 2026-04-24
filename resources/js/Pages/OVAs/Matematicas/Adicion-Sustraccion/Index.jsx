import React, { useEffect, useRef, useState } from 'react';
import { Head, router } from '@inertiajs/react';

const HAND = "url('/OVAs/Matematicas/Adicion-Sustraccion/images/hand.cur'), pointer";
const SND  = { skip: '/OVAs/Matematicas/Adicion-Sustraccion/sounds/intro/intro_skip.mp3' };

/* ── Icono SVG de mano apuntando (sin emojis) ──────────────────────────────── */
const HandIcon = () => (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="white"
         xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }}>
        {/*  Material "touch_app" path  */}
        <path d="M9 11.24V7.5C9 6.12 10.12 5 11.5 5S14 6.12 14 7.5v3.74c1.21-.81 2-2.18
                 2-3.74C16 5.01 13.99 3 11.5 3S7 5.01 7 7.5c0 1.56.79 2.93 2 3.74z
                 M18.84 15.87l-4.54-2.26c-.17-.07-.35-.11-.54-.11H13v-6c0-.83-.67-1.5-1.5-1.5
                 S10 6.67 10 7.5v10.74l-3.43-.72c-.08-.01-.15-.03-.24-.03-.31
                 0-.59.13-.79.33l-.79.8 4.94 4.94c.27.27.65.44 1.06.44h6.79
                 c.75 0 1.33-.55 1.44-1.28l.75-5.27c.01-.07.02-.14.02-.2
                 0-.62-.38-1.16-.91-1.38z"/>
    </svg>
);

const OVAIndex = () => {
    const videoRef            = useRef(null);
    const [skipHover,         setSkipHover]   = useState(false);
    const [showHint,          setShowHint]    = useState(true);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        video.muted = true;

        // Esperar 2 s antes de reproducir → el usuario tiene tiempo de hacer clic
        const startTimer = setTimeout(() => {
            video.play().catch(() => {});
        }, 2000);

        // Primer clic en cualquier parte → activar sonido + ocultar indicador
        const unmuteOnClick = () => {
            video.muted = false;
            setShowHint(false);
            document.removeEventListener('click', unmuteOnClick);
        };
        document.addEventListener('click', unmuteOnClick);

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
            clearTimeout(startTimer);
            video.removeEventListener('ended', handleEnd);
            document.removeEventListener('click', unmuteOnClick);
        };
    }, []);

    const goToMenu = () => router.visit('/ovas/matematicas/adicion-sustraccion/menu');

    const handleSkipEnter = () => {
        setSkipHover(true);
        new Audio(SND.skip).play().catch(() => {});
    };

    return (
        <>
            <Head title="Investic - OVA" />

            <style>{`
                @keyframes ovaHandBounce {
                    0%, 100% { transform: translateY(0);     }
                    40%       { transform: translateY(-14px); }
                    60%       { transform: translateY(-7px);  }
                }
                @keyframes ovaFadePulse {
                    0%, 100% { opacity: 1;    }
                    50%       { opacity: 0.5;  }
                }
                @keyframes ovaRipple {
                    0%   { transform: scale(0.5); opacity: 0.8; }
                    100% { transform: scale(2.4); opacity: 0;   }
                }
                @keyframes ovaHintIn {
                    from { opacity: 0; transform: translate(-50%, -44%) scale(0.88); }
                    to   { opacity: 1; transform: translate(-50%, -50%) scale(1);    }
                }
            `}</style>

            {/* ── Video de introducción (sin autoPlay — se lanza tras 2 s) ──── */}
            <video
                ref={videoRef}
                playsInline
                muted
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

            {/* ── Indicador centrado: haz clic para sonido ─────────────────── */}
            {showHint && (
                <div
                    onClick={() => {}}          /* el clic real lo captura document */
                    style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 5000,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '18px',
                        cursor: HAND,
                        animation: 'ovaHintIn 0.4s cubic-bezier(0.34,1.4,0.64,1) both, ovaFadePulse 2s ease-in-out 0.4s infinite',
                    }}
                >
                    {/* Círculo con ripples + icono de mano */}
                    <div style={{ position: 'relative', width: '90px', height: '90px' }}>
                        {/* Fondo translúcido del círculo */}
                        <div style={{
                            position: 'absolute', inset: 0,
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.18)',
                            backdropFilter: 'blur(6px)',
                        }} />
                        {/* Ripple 1 */}
                        <span style={{
                            position: 'absolute', inset: 0,
                            borderRadius: '50%',
                            border: '2.5px solid rgba(255,255,255,0.75)',
                            animation: 'ovaRipple 1.6s ease-out infinite',
                        }} />
                        {/* Ripple 2 — desfasado */}
                        <span style={{
                            position: 'absolute', inset: 0,
                            borderRadius: '50%',
                            border: '2px solid rgba(255,255,255,0.5)',
                            animation: 'ovaRipple 1.6s ease-out infinite 0.6s',
                        }} />
                        {/* Icono SVG de mano */}
                        <span style={{
                            position: 'absolute', inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            animation: 'ovaHandBounce 1.1s ease-in-out infinite',
                        }}>
                            <HandIcon />
                        </span>
                    </div>

                    {/* Etiqueta */}
                    <span style={{
                        background: 'rgba(0,0,0,0.58)',
                        color: '#fff',
                        fontSize: '15px',
                        fontWeight: 700,
                        padding: '8px 22px',
                        borderRadius: '24px',
                        whiteSpace: 'nowrap',
                        backdropFilter: 'blur(8px)',
                        fontFamily: 'Chewy, sans-serif',
                        letterSpacing: '0.5px',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                    }}>
                        Haz clic para activar el sonido
                    </span>
                </div>
            )}

            {/* ── Botón: Saltar animación ───────────────────────────────────── */}
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
        </>
    );
};

export default OVAIndex;