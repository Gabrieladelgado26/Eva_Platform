// ─────────────────────────────────────────────────────────────────────────────
// Menu.jsx  —  OVA Español › El Cuento
// Equivale a: mprincovas.blade.php
//
// IMPORTANTE: .licenciamenu y .verintro van FUERA del div.Skin2
// (igual que en el blade original), para que su position:absolute sea
// relativa al viewport y no al contenedor .Skin2.
//
// .verintro tiene inline style igual al original:
//   z-index:5000; position:absolute; width:14%; left:2%; bottom:5%
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { Head, router } from '@inertiajs/react';

const BASE = '/OVAs/Espanol/Cuento';
const HAND = "url('/OVAs/Shared/hand.cur'), pointer";

const IMG = {
    iconLicense:     `${BASE}/images/branding/icon_license.png`,
    btnIntro:        `${BASE}/images/buttons/btn_intro.png`,
    btnIntroHover:   `${BASE}/images/buttons/btn_intro_hover.png`,
    signCuento:      `${BASE}/images/signboard/sign_home_cuento.png`,
    signCuentoHover: `${BASE}/images/signboard/sign_home_cuento_hover.png`,
    bgPreview:       `${BASE}/images/backgrounds/bg_preview_alt.png`,
};

const SND = {
    introPlay:  `${BASE}/sounds/intro/intro_play.mp3`,
    navEjeTema: `${BASE}/sounds/navigation/nav_eje_tematico.mp3`,
};

export default function MenuPrincipal() {
    const [introHover, setIntroHover]   = useState(false);
    const [signHover,  setSignHover]    = useState(false);

    const goToIntro = (e) => {
        e?.preventDefault();
        new Audio(SND.introPlay).play().catch(() => {});
        router.visit('/ovas/espanol/cuento/inicio');
    };

    const goToCuento = (e) => {
        e?.preventDefault();
        new Audio(SND.navEjeTema).play().catch(() => {});
        router.visit('/ovas/espanol/cuento/cuento');
    };

    return (
        <>
            <Head title="Investic – El Cuento" />

            {/*
             * FUERA de .Skin2 — igual que en el blade original
             * donde .licenciamenu y .verintro son hijos directos del <body>
             */}

            {/* Licencia — bottom-right fijo */}
            <img
                className="licenciamenu"
                src={IMG.iconLicense}
                alt="Licencia"
                draggable={false}
            />

            {/* Botón "Ver introducción" — bottom-left, inline style igual al original */}
            <a
                href="#"
                onClick={goToIntro}
                onMouseEnter={() => setIntroHover(true)}
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
                        left: '2%',
                        bottom: '5%',
                        cursor: HAND,
                    }}
                />
            </a>

            <div id="todosonido" />
            <div id="skin" style={{ backgroundColor: '#FEFEB6' }} />

            {/* .Skin2 — fondo + letrero */}
            <div className="Skin2">

                {/* Letrero/signo de El Cuento */}
                <div className="divmenusoloimagen">
                    <a
                        href="#"
                        onClick={goToCuento}
                        onMouseEnter={() => setSignHover(true)}
                        onMouseLeave={() => setSignHover(false)}
                    >
                        <img
                            src={signHover ? IMG.signCuentoHover : IMG.signCuento}
                            className="letrero1 cambiarImagen"
                            alt="El Cuento"
                            draggable={false}
                        />
                    </a>
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
