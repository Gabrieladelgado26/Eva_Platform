// ─────────────────────────────────────────────────────────────────────────────
// Components/Modals/Slider.jsx  —  OVA Español › El Cuento
//
// Modal del tutorial (slider). Abre un iframe apuntando a la ruta del slider.
// Se importa en Layouts/Ova.jsx.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { OvaModal } from '../../Layouts/Ova';

const BASE = '/OVAs/Espanol/Cuento';

export default function ModalSlider({ open, onClose }) {
    const [src, setSrc] = useState('');

    useEffect(() => {
        if (open) setSrc('/ovas/espanol/cuento/slider');
        else      setSrc('');
    }, [open]);

    return (
        <OvaModal
            open={open}
            onClose={onClose}
            frameImg={`${BASE}/images/modals/modal_frame.png`}
            closeId="cerrarmodalslider"
            modalClass="modalslider"
            contentClass="divmodalSlider"
        >
            <iframe
                id="contentslider"
                src={src}
                allowtransparency="true"
                style={{ border: 'none', background: 'transparent' }}
                title="Tutorial"
            />
        </OvaModal>
    );
}
