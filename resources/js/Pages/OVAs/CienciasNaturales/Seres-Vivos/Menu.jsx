// ─────────────────────────────────────────────────────────────────────────────
// Menu.jsx  —  OVA Ciencias Naturales › Seres Vivos
// Equivale a: mprincovas.blade.php
//
// IMPORTANTE: .licenciamenu y .verintro van FUERA del div.Skin2
// (igual que en el blade original), para que su position:absolute sea
// relativa al viewport y no al contenedor .Skin2.
//
// .verintro tiene inline style igual al original:
//   z-index:5000; position:absolute; width:14%; top:2%; right:2%
// (esquina superior derecha — diferente a Español que va abajo-izquierda)
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { Head, router } from '@inertiajs/react';

const BASE   = '/OVAs/Ciencias-Naturales/Seres-Vivos';
const SHARED = '/OVAs/Shared';
const HAND   = "url('/OVAs/Shared/hand.cur'), pointer";

const IMG = {
    iconLicense:    `${SHARED}/images/branding/icon_license.png`,
    btnIntro:       `${BASE}/images/buttons/btn_intro.png`,
    btnIntroHover:  `${BASE}/images/buttons/btn_intro_hover.png`,
    bgPreview:      `${BASE}/images/backgrounds/bg_preview_alt.png`,

    // Letreros — normal + hover
    sign1:          `${BASE}/images/signboard/sign_home_seres_vivos.png`,
    sign1H:         `${BASE}/images/signboard/sign_home_seres_vivos_hover.png`,
    sign2:          `${BASE}/images/signboard/sign_home_seres_naturales.png`,
    sign2H:         `${BASE}/images/signboard/sign_home_seres_naturales_hover.png`,
    sign3:          `${BASE}/images/signboard/sign_home_ciclo_vida.png`,
    sign3H:         `${BASE}/images/signboard/sign_home_ciclo_vida_hover.png`,
    sign4:          `${BASE}/images/signboard/sign_home_necesidades.png`,
    sign4H:         `${BASE}/images/signboard/sign_home_necesidades_hover.png`,
    sign5:          `${BASE}/images/signboard/sign_home_adaptaciones.png`,
    sign5H:         `${BASE}/images/signboard/sign_home_adaptaciones_hover.png`,
};

const SND = {
    introPlay:  `${SHARED}/sounds/intro/intro_play.mp3`,
    nav1:       `${BASE}/sounds/navigation/nav_eje_tematico_1.mp3`,
    nav2:       `${BASE}/sounds/navigation/nav_eje_tematico_2.mp3`,
    nav3:       `${BASE}/sounds/navigation/nav_eje_tematico_3.mp3`,
    nav4:       `${BASE}/sounds/navigation/nav_eje_tematico_4.mp3`,
    nav5:       `${BASE}/sounds/navigation/nav_eje_tematico_5.mp3`,
};

// Letrero con hover + audio
function Letrero({ normal, hover, alt, className, sound, dest }) {
    const [isHover, setIsHover] = useState(false);

    const go = (e) => {
        e?.preventDefault();
        router.visit(dest);
    };

    const handleMouseEnter = () => {
        setIsHover(true);
        new Audio(sound).play().catch(() => {});
    };

    return (
        <a href="#" onClick={go}
           onMouseEnter={handleMouseEnter}
           onMouseLeave={() => setIsHover(false)}
        >
            <img
                src={isHover ? hover : normal}
                className={`${className} cambiarImagen`}
                alt={alt}
                draggable={false}
                style={{ cursor: HAND }}
            />
        </a>
    );
}

export default function MenuPrincipal() {
    const [introHover, setIntroHover] = useState(false);

    const goToIntro = (e) => {
        e?.preventDefault();
        router.visit('/ovas/ciencias-naturales/seres-vivos/inicio');
    };

    const handleIntroMouseEnter = () => {
        setIntroHover(true);
        new Audio(SND.introPlay).play().catch(() => {});
    };

    return (
        <>
            <Head title="Investic – Seres Vivos" />

            {/*
             * FUERA de .Skin2 — igual que en el blade original
             */}

            {/* Licencia */}
            <img
                className="licenciamenu"
                src={IMG.iconLicense}
                alt="Licencia"
                draggable={false}
            />

            {/* Botón "Ver introducción" — esquina superior derecha */}
            <a
                href="#"
                onClick={goToIntro}
                onMouseEnter={handleIntroMouseEnter}
                onMouseLeave={() => setIntroHover(false)}
            >
                <img
                    className="verintro cambiarImagen"
                    src={introHover ? IMG.btnIntroHover : IMG.btnIntro}
                    alt="Ver introducción"
                    draggable={false}
                    style={{
                        zIndex: 5000,
                        position: 'absolute',
                        width: '14%',
                        top: '2%',
                        right: '2%',
                        cursor: HAND,
                    }}
                />
            </a>

            <div id="todosonido" />
            <div id="skin" style={{ backgroundColor: '#FEFEB6' }} />

            {/* .Skin2 — fondo + letreros */}
            <div className="Skin2">

                <div className="divmenusoloimagen">
                    <Letrero
                        normal={IMG.sign1} hover={IMG.sign1H}
                        alt="Seres Vivos e Inertes" className="letrero1"
                        sound={SND.nav1}
                        dest="/ovas/ciencias-naturales/seres-vivos/seresvivoseinertes"
                    />
                    <Letrero
                        normal={IMG.sign2} hover={IMG.sign2H}
                        alt="Seres Naturales y Artificiales" className="letrero2"
                        sound={SND.nav2}
                        dest="/ovas/ciencias-naturales/seres-vivos/seresnaturalesartificiales"
                    />
                    <Letrero
                        normal={IMG.sign3} hover={IMG.sign3H}
                        alt="Ciclo de Vida" className="letrero3"
                        sound={SND.nav3}
                        dest="/ovas/ciencias-naturales/seres-vivos/ciclodevida"
                    />
                    <Letrero
                        normal={IMG.sign4} hover={IMG.sign4H}
                        alt="Necesidades de los Seres Vivos" className="letrero4"
                        sound={SND.nav4}
                        dest="/ovas/ciencias-naturales/seres-vivos/necesidades"
                    />
                    <Letrero
                        normal={IMG.sign5} hover={IMG.sign5H}
                        alt="Adaptaciones" className="letrero5"
                        sound={SND.nav5}
                        dest="/ovas/ciencias-naturales/seres-vivos/adaptaciones"
                    />
                </div>

                {/* Imagen de fondo del menú */}
                <img
                    src={IMG.bgPreview}
                    alt=""
                    style={{ width: '100%' }}
                    draggable={false}
                />
            </div>
        </>
    );
}
