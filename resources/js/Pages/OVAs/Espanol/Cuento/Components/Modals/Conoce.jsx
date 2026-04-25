// ─────────────────────────────────────────────────────────────────────────────
// Components/Modals/Conoce.jsx  —  OVA Español › El Cuento
//
// Modal "Conoce el OVA": reproduce un video de YouTube en un iframe.
// Limpia el src al cerrar para detener la reproducción.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { OvaModal } from '../../Layouts/Ova';

const BASE          = '/OVAs/Espanol/Cuento';
const DEFAULT_VIDEO = 'https://www.youtube-nocookie.com/embed/pd100ARogHU?rel=0&showinfo=0';

export default function ModalConoce({ open, onClose, videoSrc: externalVideoSrc }) {
    const [videoSrc, setVideoSrc] = useState('');

    useEffect(() => {
        if (open) setVideoSrc(externalVideoSrc || DEFAULT_VIDEO);
        else      setVideoSrc('');
    }, [open, externalVideoSrc]);

    return (
        <OvaModal
            open={open}
            onClose={onClose}
            frameImg={`${BASE}/images/modals/modal_bg.png`}
            closeId="cerrarmodalconoce"
            modalClass="modalConoce"
            contentClass="divmodalConoce"
        >
            <img
                className="iconoyoutube"
                src={`${BASE}/images/branding/youtube.png`}
                alt="YouTube"
                draggable={false}
            />
            <iframe
                id="contentVideoConoce"
                src={videoSrc}
                allowtransparency="true"
                allowFullScreen
                title="Conoce el OVA – El Cuento"
                className="videomodal"
                style={{
                    border: 'none',
                    height: '84%', width: '82%',
                    marginLeft: '-1%', marginTop: '-1%',
                }}
            />
        </OvaModal>
    );
}
