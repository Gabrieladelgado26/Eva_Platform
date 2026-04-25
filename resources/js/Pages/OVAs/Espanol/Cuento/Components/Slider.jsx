// ─────────────────────────────────────────────────────────────────────────────
// Components/Slider.jsx  —  OVA Español › El Cuento
//
// Página del tutorial (slider) renderizada en un iframe dentro del modal.
// Ruta: /ovas/espanol/cuento/slider  (rootView: slider-espanol)
//
// Usa FlexSlider con las imágenes y audios propios del OVA de Español.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from 'react';

const BASE = '/OVAs/Espanol/Cuento';

export default function Slider() {
    useEffect(() => {
        // Neutralizar padding que Inertia agrega al #app
        const app = document.getElementById('app');
        if (app) { app.style.padding = '0'; app.style.margin = '0'; }

        function loadScript(src, onload) {
            const s = document.createElement('script');
            s.src = src;
            s.onload = onload;
            document.body.appendChild(s);
            return s;
        }

        let jqScript, fsScript;

        // 1. Cargar jQuery del OVA
        jqScript = loadScript(
            `${BASE}/js/jquery-1.10.2.min.js`,
            () => {
                // 2. Cargar FlexSlider
                fsScript = loadScript(
                    `${BASE}/js/slider/jquery.flexslider-min.js`,
                    () => {
                        // 3. Inicializar FlexSlider
                        window.$('.flexslider').flexslider({
                            animation: 'fade',
                            controlsContainer: '.flexslider',
                        });

                        // Función para detener todos los audios
                        function pausar() {
                            window.$('audio').trigger('pause');
                            window.$('audio').prop('currentTime', 0);
                        }

                        // Botones de audio para cada slide
                        [1, 2, 3, 4].forEach((n) => {
                            window.$(`.repro_audio${n}`).on('click', function () {
                                pausar();
                                window.$(`#audio${n}`).get(0).play();
                            });
                        });
                    }
                );
            }
        );

        return () => {
            if (jqScript) jqScript.remove();
            if (fsScript) fsScript.remove();
            if (app) { app.style.padding = ''; app.style.margin = ''; }
        };
    }, []);

    return (
        <div className="flex-container">
            <div className="flexslider">
                <ul className="slides">

                    {/* Slide 1: Conoce el OVA */}
                    <li>
                        <a href="#">
                            <img src={`${BASE}/images/slider/slide_modal_conoce.png`}
                                 alt="Conoce el OVA" />
                            <img src={`${BASE}/images/modals/modal_audio.png`}
                                 className="sonidoslider repro_audio1" alt="" draggable={false} />
                            <audio id="audio1" src={`${BASE}/sounds/tutorial/tutorial_conoce.mp3`} />
                        </a>
                    </li>

                    {/* Slide 2: Aprende más */}
                    <li>
                        <img src={`${BASE}/images/modals/modal_audio.png`}
                             className="sonidoslider repro_audio2" alt="" draggable={false} />
                        <img src={`${BASE}/images/slider/slide_modal_aprende_mas.png`}
                             alt="Aprende más" />
                        <audio id="audio2" src={`${BASE}/sounds/tutorial/tutorial_aprende_mas.mp3`} />
                    </li>

                    {/* Slide 3: Repasemos */}
                    <li>
                        <img src={`${BASE}/images/modals/modal_audio.png`}
                             className="sonidoslider repro_audio3" alt="" draggable={false} />
                        <img src={`${BASE}/images/slider/slide_modal_repasemos.png`}
                             alt="Repasemos" />
                        <audio id="audio3" src={`${BASE}/sounds/tutorial/tutorial_repasemos.mp3`} />
                    </li>

                    {/* Slide 4: Evaluemos */}
                    <li>
                        <img src={`${BASE}/images/modals/modal_audio.png`}
                             className="sonidoslider repro_audio4" alt="" draggable={false} />
                        <img src={`${BASE}/images/slider/slide_modal_evaluemos.png`}
                             alt="Evaluemos" />
                        <audio id="audio4" src={`${BASE}/sounds/tutorial/tutorial_evaluemos.mp3`} />
                    </li>

                </ul>
            </div>
        </div>
    );
}
