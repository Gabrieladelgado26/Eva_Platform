// ─────────────────────────────────────────────────────────────────────────────
// Menu.jsx  —  OVA Ciencias Sociales › Patrimonio Cultural
// Menú principal con los 3 ejes temáticos:
//   1. Patrimonio Cultural  → /ovas/ciencias-sociales/patrimonio-cultural/patrimoniocultural
//   2. Gastronomía          → /ovas/ciencias-sociales/patrimonio-cultural/gastronomia
//   3. Turismo              → /ovas/ciencias-sociales/patrimonio-cultural/turismo
//
// FUERA de .Skin2: .licenciamenu y .verintro (igual que Español › Cuento)
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { Head, router } from '@inertiajs/react';

const BASE   = '/OVAs/Ciencias-Sociales/Patrimonio-Cultural';
const SHARED = '/OVAs/Shared';
const HAND   = "url('/OVAs/Shared/hand.cur'), pointer";

const IMG = {
    iconLicense:   `${SHARED}/images/branding/icon_license.png`,
    bgPreview:     `${BASE}/images/backgrounds/bg_alt_preview.png`,
    btnIntro:      `${BASE}/images/buttons/btn_intro.png`,
    btnIntroHover: `${BASE}/images/buttons/btn_intro_hover.png`,

    // Letreros — normal + hover
    sign1:         `${BASE}/images/signboard/sign_home_patrimonio.png`,
    sign1H:        `${BASE}/images/signboard/sign_home_patrimonio_hover.png`,
    sign2:         `${BASE}/images/signboard/sign_home_gastronomia.png`,
    sign2H:        `${BASE}/images/signboard/sign_home_gastronomia_hover.png`,
    sign3:         `${BASE}/images/signboard/sign_home_turismo.png`,
    sign3H:        `${BASE}/images/signboard/sign_home_turismo_hover.png`,
};

const SND = {
    introPlay: `${BASE}/sounds/navigation/nav_inicio.mp3`,
    nav1:      `${BASE}/sounds/navigation/nav_eje_tematico_1.mp3`,
    nav2:      `${BASE}/sounds/navigation/nav_eje_tematico_2.mp3`,
    nav3:      `${BASE}/sounds/navigation/nav_eje_tematico_3.mp3`,
};

function Letrero({ normal, hover, alt, className, sound, dest }) {
    const [isHover, setIsHover] = useState(false);

    const go = (e) => { e?.preventDefault(); router.visit(dest); };

    return (
        <a href="#" onClick={go}
           onMouseEnter={() => { setIsHover(true); new Audio(sound).play().catch(() => {}); }}
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
        new Audio(SND.introPlay).play().catch(() => {});
        router.visit('/ovas/ciencias-sociales/patrimonio-cultural/inicio');
    };

    return (
        <>
            <Head title="Investic – Patrimonio Cultural" />

            {/* FUERA de .Skin2 — igual que Español Cuento */}

            {/* Licencia — bottom-right */}
            <img className="licenciamenu" src={IMG.iconLicense} alt="Licencia" draggable={false} />

            {/* Botón "Ver introducción" — bottom-left */}
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

            <div className="Skin2">
                <div className="divmenusoloimagen">
                    <Letrero
                        normal={IMG.sign1} hover={IMG.sign1H}
                        alt="Patrimonio Cultural" className="letrero1"
                        sound={SND.nav1}
                        dest="/ovas/ciencias-sociales/patrimonio-cultural/patrimoniocultural"
                    />
                    <Letrero
                        normal={IMG.sign2} hover={IMG.sign2H}
                        alt="Gastronomía" className="letrero2"
                        sound={SND.nav2}
                        dest="/ovas/ciencias-sociales/patrimonio-cultural/gastronomia"
                    />
                    <Letrero
                        normal={IMG.sign3} hover={IMG.sign3H}
                        alt="Turismo" className="letrero3"
                        sound={SND.nav3}
                        dest="/ovas/ciencias-sociales/patrimonio-cultural/turismo"
                    />
                </div>

                {/* Imagen de fondo del menú */}
                <img src={IMG.bgPreview} alt="" style={{ width: '100%' }} draggable={false} />
            </div>
        </>
    );
}
