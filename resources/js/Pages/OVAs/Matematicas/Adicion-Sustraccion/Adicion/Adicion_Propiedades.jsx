import { useState, useEffect } from "react";
import OvaLayout from "../Layouts/Ova";

const BASE = "/OVAs/Matematicas/Adicion-Sustraccion";

const IMG = {
  letrero:     `${BASE}/images/signboard/sign_addition_properties.png`,
  modalBg:     `${BASE}/images/modals/modal_bg.png`,
  modalClose:  `${BASE}/images/modals/modal_close.png`,
  modalReturn: `${BASE}/images/modals/modal_return.png`,
};

const REPASEMOS_SRC = `${BASE}/repasemos/adicionysuspropiedades/adicionysuspropiedades.html`;
const CONOCE_VIDEO  = "https://www.youtube-nocookie.com/embed/_OSb080GzXE?rel=0&showinfo=0";
const APRENDE_SRC   = `${BASE}/juegos/adicionysuspropiedades/menu.html`;
const EVALUEMOS_SRC = `${BASE}/evaluemos/adicionysuspropiedades/adicionysuspropiedades.html`;

// Overlay compartido para los modales de esta OVA
const overlayStyle = {
  position:       "fixed",
  inset:          0,
  zIndex:         99999,
  display:        "flex",
  alignItems:     "center",
  justifyContent: "center",
  background:     "rgba(0,0,0,0.45)",
  overflow:       "auto",
  padding:        "1% 0",
};

// ─── Modal "Aprende más" ──────────────────────────────────────────────────────
// .divmodal: top 6%, left 5%, width 94%, height 95%
// #contentframe: height 120%
function ModalAprende({ open, onClose }) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    if (open) setSrc(APRENDE_SRC);
    else setSrc("");
  }, [open]);

  if (!open) return null;

  return (
    <div style={overlayStyle}>
      <div style={{ position: "relative", width: "78%", maxWidth: 900, flexShrink: 0 }}>

        <img src={IMG.modalBg} alt="" draggable={false}
          style={{ width: "100%", display: "block", pointerEvents: "none" }} />

        {/* .iconocerrar */}
        <img id="cerrarmodal" src={IMG.modalClose} alt="Cerrar" draggable={false}
          onClick={onClose}
          style={{ position: "absolute", top: "7%", right: "4%", width: "4%", cursor: "pointer", zIndex: 10000 }} />

        {/* .iconoregresar: top 8%, left 2%, width 4% */}
        <img id="regresarmenu" src={IMG.modalReturn} alt="Menú" title="Menú" draggable={false}
          onClick={() => { setSrc(""); setTimeout(() => setSrc(APRENDE_SRC), 50); }}
          style={{ position: "absolute", top: "8%", left: "2%", width: "4%", cursor: "pointer", zIndex: 10000 }} />

        {/* .divmodal: top 6%, left 5%, width 94%, height 95% */}
        <div style={{ position: "absolute", top: "6%", left: "5%", width: "94%", height: "95%", overflow: "hidden" }}>
          <iframe id="contentframe" src={src} allowtransparency="true"
            style={{ border: "none", padding: 0, margin: 0, height: "120%", width: "100%", background: "transparent" }}
            title="Aprende más — Adición y sus propiedades" />
        </div>
      </div>
    </div>
  );
}

// ─── Modal "Evaluemos" ────────────────────────────────────────────────────────
// .divmodalRepasemos: top 8%, left 7%, width 97%, height 95%
// #contentframeEvaluemos: height 93%
function ModalEvaluemos({ open, onClose }) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    if (open) setSrc(EVALUEMOS_SRC);
    else setSrc("");
  }, [open]);

  if (!open) return null;

  return (
    <div style={overlayStyle}>
      <div style={{ position: "relative", width: "78%", maxWidth: 900, flexShrink: 0 }}>

        <img src={IMG.modalBg} alt="" draggable={false}
          style={{ width: "100%", display: "block", pointerEvents: "none" }} />

        {/* .iconocerrar */}
        <img id="cerrarmodalevaluemos" src={IMG.modalClose} alt="Cerrar" draggable={false}
          onClick={onClose}
          style={{ position: "absolute", top: "7%", right: "4%", width: "4%", cursor: "pointer", zIndex: 10000 }} />

        {/* .divmodalRepasemos */}
        <div style={{ position: "absolute", top: "8%", left: "7%", width: "97%", height: "95%", overflow: "hidden" }}>
          <iframe id="contentframeEvaluemos" src={src} allowtransparency="true"
            style={{ border: "none", padding: 0, margin: 0, height: "93%", width: "100%", background: "transparent" }}
            title="Evaluemos — Adición y sus propiedades" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function AdicionPropiedades() {
  return (
    <OvaLayout
      metaTitle="La adición y sus propiedades"
      guiaTema="OVAs/Matematicas/Adicion-Sustraccion/guias/adicionysuspropiedades.pdf"
      repasemosSrc={REPASEMOS_SRC}
      conoceVideoSrc={CONOCE_VIDEO}
      letrero={
        <img id="canvas_btn_act1" className="letreroContenido"
          src={IMG.letrero} alt="La adición y sus propiedades" draggable={false} />
      }
      renderAprende={(open, onClose) => <ModalAprende open={open} onClose={onClose} />}
      renderEvaluemos={(open, onClose) => <ModalEvaluemos open={open} onClose={onClose} />}
    />
  );
}
