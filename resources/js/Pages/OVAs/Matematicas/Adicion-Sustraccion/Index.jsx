import React, { useEffect, useState, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';

const OVAIndex = () => {
    const [introHover, setIntroHover] = useState(false);
    const [skipHover, setSkipHover] = useState(false);
    const videoRef = useRef(null);
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        // Inicializar Adobe Edge (tu código existente)
        const initializeAdobeEdge = () => {
            if (window.AdobeEdge && window.AdobeEdge.loadComposition) {
                window.AdobeEdge.loadComposition(
                    "Menuprincipalovas5",
                    "EDGE-16317474",
                    {
                        scaleToFit: "width",
                        centerStage: "horizontal",
                        minW: "0px",
                        maxW: "undefined",
                        width: "1920px",
                        height: "1080px",
                    },
                    {
                        style: {
                            "${symbolSelector}": {
                                isStage: "true",
                                rect: ["undefined", "undefined", "1920px", "1080px"],
                                fill: ["rgba(255,255,255,1)"],
                            },
                        },
                    },
                    {
                        style: {
                            "${symbolSelector}": {
                                isStage: "true",
                                rect: ["undefined", "undefined", "1920px", "1080px"],
                                fill: ["rgba(255,255,255,1)"],
                            },
                        },
                        dom: [
                            {
                                rect: ["0", "0", "1920px", "1080px", "auto", "auto"],
                                id: "Poster",
                                fill: [
                                    "rgba(0,0,0,0)",
                                    "/OVAs/Matematicas/Adicion-Sustraccion/images/backgrounds/bg_main_poster.png",
                                    "0px",
                                    "0px",
                                ],
                                type: "image",
                                tag: "img",
                            },
                        ],
                    }
                );
                console.log('Adobe Edge cargado correctamente');
            } else {
                console.log('Esperando a Adobe Edge...');
                setTimeout(initializeAdobeEdge, 500);
            }
        };

        const loadAdobeEdge = () => {
            if (typeof window.AdobeEdge !== 'undefined' && window.AdobeEdge.loadComposition) {
                initializeAdobeEdge();
            } else {
                const edgeScript = document.createElement('script');
                edgeScript.src = '/OVAs/Matematicas/Adicion-Sustraccion/js/edge.6.0.0.min.js';
                edgeScript.onload = () => {
                    setTimeout(initializeAdobeEdge, 500);
                };
                edgeScript.onerror = () => {
                    console.error('Error cargando Adobe Edge');
                };
                document.body.appendChild(edgeScript);
            }
        };

        if (typeof window.$ === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js';
            script.onload = () => {
                console.log('jQuery cargado');
                loadAdobeEdge();
            };
            script.onerror = () => {
                console.error('Error cargando jQuery');
                loadAdobeEdge();
            };
            document.body.appendChild(script);
        } else {
            loadAdobeEdge();
        }

        // SOLUCIÓN: Video silencioso que activa sonido automáticamente
        const videoElement = videoRef.current;
        if (!videoElement) return;

        // Función para activar el sonido después de que el video comience a reproducirse
        const enableSound = () => {
            if (videoElement) {
                videoElement.muted = false;
                console.log('Sonido activado automáticamente');
            }
        };

        // Función para manejar el fin del video
        const handleVideoEnd = () => {
            if (!isRedirecting) {
                setIsRedirecting(true);
                console.log('Video terminado, redirigiendo...');
                setTimeout(() => {
                    window.location.href = '/ovas/matematicas/adicion-sustraccion/menu';
                }, 500);
            }
        };

        // Configurar el video
        videoElement.loop = false;
        videoElement.muted = true; // Inicia silencioso
        
        // Intentar reproducir
        const playPromise = videoElement.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('Video iniciado silenciosamente');
                // Activar sonido después de 100ms
                setTimeout(enableSound, 100);
            }).catch(error => {
                console.log('Error al reproducir:', error);
                // Fallback: mostrar mensaje sutil
                const message = document.createElement('div');
                message.textContent = 'Haz clic en cualquier lugar para iniciar el video';
                message.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: rgba(0,0,0,0.7);
                    color: white;
                    padding: 10px;
                    border-radius: 5px;
                    z-index: 10000;
                    font-size: 12px;
                `;
                document.body.appendChild(message);
                setTimeout(() => message.remove(), 3000);
            });
        }

        videoElement.addEventListener('ended', handleVideoEnd);

        return () => {
            videoElement.removeEventListener('ended', handleVideoEnd);
        };
    }, [isRedirecting]);

    const handleIntroMouseOver = () => {
        setIntroHover(true);
        const audio = new Audio('/OVAs/Matematicas/Adicion-Sustraccion/sounds/intro/intro_play.mp3');
        audio.play().catch(e => console.log('Error playing sound:', e));
    };

    const handleIntroMouseOut = () => {
        setIntroHover(false);
    };

    const handleSkipMouseOver = () => {
        setSkipHover(true);
    };

    const handleSkipMouseOut = () => {
        setSkipHover(false);
    };

    const handleRedirect = () => {
        if (!isRedirecting) {
            setIsRedirecting(true);
            window.location.href = '/ovas/matematicas/adicion-sustraccion/menu';
        }
    };

    return (
        <>
            <Head title="Investic - OVA" />
            
            <video 
                ref={videoRef}
                autoPlay 
                loop={false}
                muted={true}  // Importante: inicia muteado
                playsInline
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: -1
                }}
            >
                <source src="/OVAs/Matematicas/Adicion-Sustraccion/media/Introduccioninicio3.mp4" type="video/mp4" />
                Tu navegador no soporta videos HTML5.
            </video>
            
            <div id="todosonido"></div>

            <Link
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    handleRedirect();
                }}
                style={{
                    position: 'absolute',
                    zIndex: 5000,
                    width: '16%',
                    top: '88%',
                    right: '81%',
                    cursor: 'pointer'
                }}
            >
                <img
                    src={skipHover 
                        ? "/OVAs/Matematicas/Adicion-Sustraccion/images/buttons/btn_skip_hover.png"
                        : "/OVAs/Matematicas/Adicion-Sustraccion/images/buttons/btn_skip.png"
                    }
                    alt="Saltar animación"
                    style={{
                        width: '100%',
                        cursor: 'pointer'
                    }}
                    onMouseEnter={handleSkipMouseOver}
                    onMouseLeave={handleSkipMouseOut}
                />
            </Link>

            <Link
                href="/inicio"
                style={{
                    position: 'absolute',
                    zIndex: 5000,
                    width: '14%',
                    top: '2%',
                    left: '1%',
                    cursor: 'pointer'
                }}
                onMouseEnter={handleIntroMouseOver}
                onMouseLeave={handleIntroMouseOut}
            />

            <div id="Stage" className="EDGE-16317474" style={{ position: 'relative', zIndex: 1 }}></div>
        </>
    );
};

export default OVAIndex;