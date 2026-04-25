// ─────────────────────────────────────────────────────────────────────────────
// Components/Modals/Repasemos.jsx  —  OVA Español › El Cuento
//
// Modal "Repasemos": carga en un iframe la actividad de repaso.
// Limpia el src al cerrar para detener el contenido.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { OvaModal } from '../../Layouts/Ova';

const BASE = '/OVAs/Espanol/Cuento';

export default function ModalRepasemos({ open, onClose, src: externalSrc }) {
    const [src, setSrc] = useState('');

    useEffect(() => {
        if (open && externalSrc) setSrc(externalSrc);
        else if (!open)          setSrc('');
    }, [open, externalSrc]);

    return (
        <OvaModal
            open={open}
            onClose={onClose}
            frameImg={`${BASE}/images/modals/modal_bg.png`}
            closeId="cerrarmodalrepasemos"
            modalClass="modalRepasemos"
            contentClass="divmodalRepasemos"
        >
            <iframe
                id="contentframeRepasemos"
                src={src}
                allowtransparency="true"
                style={{
                    width: '100%', height: '93%',
                    border: 'none', background: 'transparent',
                }}
                title="Repasemos"
            />
        </OvaModal>
    );
}
