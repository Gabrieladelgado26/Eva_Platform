// ─────────────────────────────────────────────────────────────────────────────
// Cuento/Cuento.jsx  —  OVA Español › El Cuento
//
// Página principal de contenido. Equivale a elcuento.php.
// Usa OvaLayout (Layouts/Ova.jsx) que ya incluye:
//   - Fondo, botones de unidad, menú lateral
//   - Modales: Slider (tutorial), Conoce (YouTube), Repasemos
//
// Este archivo define los modales propios del tema:
//   - Aprende más  → juegos/cuento/menu.html
//   - Evaluemos    → evaluemos/evaluemoscuento/evaluemoscuento.html
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { Head }               from '@inertiajs/react';
import OvaLayout, { OvaModal } from '../Layouts/Ova';

const BASE = '/OVAs/Espanol/Cuento';

const REPASEMOS_SRC = `${BASE}/repasemos/repasemoscuento/repasemoscuento.html`;
const CONOCE_VIDEO  = 'https://www.youtube-nocookie.com/embed/pd100ARogHU?rel=0&showinfo=0';
const APRENDE_SRC   = `${BASE}/juegos/cuento/menu.html`;
const EVALUEMOS_SRC = `${BASE}/evaluemos/evaluemoscuento/evaluemoscuento.html`;

const IMG = {
    modalBg:     `${BASE}/images/modals/modal_bg.png`,
    modalReturn: `${BASE}/images/modals/modal_return.png`,
};

// ─── Modal "Aprende más" ───────────────────────────────────────────────────
function ModalAprende({ open, onClose }) {
    const [src, setSrc] = useState('');

    useEffect(() => {
        if (open) setSrc(APRENDE_SRC);
        else      setSrc('');
    }, [open]);

    if (!open) return null;

    const reloadAprende = () => {
        setSrc('');
        setTimeout(() => setSrc(APRENDE_SRC), 50);
    };

    return (
        <OvaModal
            open={open}
            onClose={onClose}
            frameImg={IMG.modalBg}
            closeId="cerrarmodal"
            modalClass="modalAprende"
            contentClass="divmodal"
            contentStyle={{ height: '99%' }}
            extraChildren={
                <img
                    id="regresarmenu"
                    className="iconoregresar"
                    src={IMG.modalReturn}
                    alt="Menú"
                    title="Menú"
                    draggable={false}
                    onClick={reloadAprende}
                    style={{ cursor: 'pointer' }}
                />
            }
        >
            <iframe
                id="contentframe"
                src={src}
                className="frame1"
                allowtransparency="true"
                style={{ border: 'none', background: 'transparent' }}
                title="Aprende más – El Cuento"
            />
        </OvaModal>
    );
}

// ─── Modal "Evaluemos" ─────────────────────────────────────────────────────
function ModalEvaluemos({ open, onClose }) {
    const [src, setSrc] = useState('');

    useEffect(() => {
        if (open) setSrc(EVALUEMOS_SRC);
        else      setSrc('');
    }, [open]);

    if (!open) return null;

    return (
        <OvaModal
            open={open}
            onClose={onClose}
            frameImg={IMG.modalBg}
            closeId="cerrarmodalevaluemos"
            modalClass="modalEvaluemos"
            contentClass="divmodalevaluemos"
        >
            <iframe
                id="contentframeEvaluemos"
                src={src}
                allowtransparency="true"
                style={{
                    width: '100%', height: '93%',
                    border: 'none', background: 'transparent',
                }}
                title="Evaluemos – El Cuento"
            />
        </OvaModal>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Cuento() {
    return (
        <>
            <Head title="Investic – El Cuento" />

            <OvaLayout
                metaTitle="Investic – El Cuento"
                repasemosSrc={REPASEMOS_SRC}
                conoceVideoSrc={CONOCE_VIDEO}
                renderAprende={   (open, onClose) => <ModalAprende   open={open} onClose={onClose} /> }
                renderEvaluemos={ (open, onClose) => <ModalEvaluemos open={open} onClose={onClose} /> }
            />
        </>
    );
}
