// ─────────────────────────────────────────────────────────────────────────────
// SeresNaturalesYArtificiales.jsx  —  OVA Ciencias Naturales › Seres Vivos
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import OvaLayout, { OvaModal } from './Layouts/Ova';

const BASE = '/OVAs/Ciencias-Naturales/Seres-Vivos';

const REPASEMOS_SRC  = `${BASE}/repasemos/repasemosnaturalesartifialesfosiles/repasemosnaturalesartifialesfosiles.html`;
const CONOCE_VIDEO   = 'https://www.youtube-nocookie.com/embed/CpXqeZPzrSQ?rel=0&showinfo=0';
const APRENDE_SRC    = `${BASE}/juegos/seresnaturalesyartificiales/menu.html`;
const EVALUEMOS_SRC  = `${BASE}/evaluemos/evaluemosseresnaturales/evaluemosseresnaturales.html`;

const IMG = {
    modalBg:     `${BASE}/images/modals/modal_bg.png`,
    modalReturn: `${BASE}/images/modals/modal_prev.png`,
    signTema:    `${BASE}/images/signboard/sign_seres_naturales.png`,
};

function ModalAprende({ open, onClose, bgRef }) {
    const [src, setSrc] = useState('');
    useEffect(() => {
        if (open) { setSrc(APRENDE_SRC); if (bgRef?.current) bgRef.current.volume = 0.12; }
        else      { setSrc('');         if (bgRef?.current) bgRef.current.volume = 0.6;  }
    }, [open]);
    if (!open) return null;
    const reload = () => { setSrc(''); setTimeout(() => setSrc(APRENDE_SRC), 50); };
    return (
        <OvaModal open={open} onClose={onClose}
            frameImg={IMG.modalBg} closeId="cerrarmodal"
            modalClass="modalAprende" contentClass="divmodal"
            extraChildren={
                <img id="regresarmenu" className="iconoregresar" src={IMG.modalReturn}
                    alt="Menú" title="Menú" draggable={false} onClick={reload} style={{ cursor: 'pointer' }} />
            }
        >
            <iframe id="contentframe" src={src} className="frame1" allowtransparency="true"
                style={{ border: 'none', background: 'transparent' }} title="Aprende más – Seres Naturales y Artificiales" />
        </OvaModal>
    );
}

function ModalEvaluemos({ open, onClose, bgRef }) {
    const [src, setSrc] = useState('');
    useEffect(() => {
        if (open) { setSrc(EVALUEMOS_SRC); if (bgRef?.current) bgRef.current.volume = 0.12; }
        else      { setSrc('');            if (bgRef?.current) bgRef.current.volume = 0.6;  }
    }, [open]);
    if (!open) return null;
    return (
        <OvaModal open={open} onClose={onClose}
            frameImg={IMG.modalBg} closeId="cerrarmodalevaluemos"
            modalClass="modalEvaluemos" contentClass="divmodalevaluemos"
        >
            <iframe id="contentframeevaluemos" src={src} allowtransparency="true"
                style={{ width: '100%', height: '93%', border: 'none', background: 'transparent' }} title="Evaluemos – Seres Naturales y Artificiales" />
        </OvaModal>
    );
}

export default function SeresNaturalesYArtificiales() {
    return (
        <>
            <Head title="Investic – Seres Naturales y Artificiales" />
            <OvaLayout
                metaTitle="Investic – Seres Naturales y Artificiales"
                letrero={<img className="titulocontenido" src={IMG.signTema} alt="Seres Naturales y Artificiales" draggable={false} />}
                repasemosSrc={REPASEMOS_SRC}
                conoceVideoSrc={CONOCE_VIDEO}
                renderAprende={   (open, onClose, bgRef) => <ModalAprende   open={open} onClose={onClose} bgRef={bgRef} /> }
                renderEvaluemos={ (open, onClose, bgRef) => <ModalEvaluemos open={open} onClose={onClose} bgRef={bgRef} /> }
            />
        </>
    );
}
