import { useState, useEffect } from "react";
import OvaLayout, { OvaModal } from "../Layouts/Ova";

const BASE = "/OVAs/Matematicas/Adicion-Sustraccion";

const IMG = {
  letrero:     `${BASE}/images/signboard/sign_addition_2_digits.png`,
  modalBg:     `${BASE}/images/modals/modal_bg.png`,
  modalClose:  `${BASE}/images/modals/modal_close.png`,
  modalReturn: `${BASE}/images/modals/modal_return.png`,
};

const REPASEMOS_SRC = `${BASE}/repasemos/adiciondenumerosdedoscifras/adiciondenumerosdedoscifras.html`;
const APRENDE_SRC   = `${BASE}/juegos/adiciondenumerosdedoscifras/menu.html`;
const EVALUEMOS_SRC = `${BASE}/evaluemos/adicionnumerodedoscifras/adicionnumerodedoscifras.html`;

// ─── Modal "Aprende más" ──────────────────────────────────────────────────────
function ModalAprende({ open, onClose }) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    if (open) setSrc(APRENDE_SRC);
    else setSrc("");
  }, [open]);

  if (!open) return null;

  return (
    <OvaModal contentStyle={{ height: "99%" }}
      open={open}
      onClose={onClose}
      frameImg={IMG.modalBg}
      closeId="cerrarmodal"
      modalClass="modalAprende"
      contentClass="divmodal"
      extraChildren={
        <img
          id="regresarmenu"
          className="iconoregresar"
          src={IMG.modalReturn}
          alt="Menú"
          title="Menú"
          draggable={false}
          onClick={() => { setSrc(""); setTimeout(() => setSrc(APRENDE_SRC), 50); }}
          style={{ cursor: "pointer" }}
        />
      }
    >
      <iframe
        id="contentframe"
        src={src}
        className="frame1"
        allowtransparency="true"
        style={{ border: "none", background: "transparent" }}
        title="Aprende más — Adición de números de dos cifras"
      />
    </OvaModal>
  );
}

// ─── Modal "Evaluemos" ────────────────────────────────────────────────────────
function ModalEvaluemos({ open, onClose }) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    if (open) setSrc(EVALUEMOS_SRC);
    else setSrc("");
  }, [open]);

  if (!open) return null;

  return (
    <OvaModal
      open={open}
      onClose={onClose}
      frameImg={IMG.modalBg}
      closeId="cerrarmodalevaluemos"
      modalClass="modalEvaluemos"
      contentClass="divmodalRepasemos"
    >
      <iframe
        id="contentframeEvaluemos"
        src={src}
        allowtransparency="true"
        style={{ border: "none", background: "transparent" }}
        title="Evaluemos — Sustracción de números hasta el 19"
      />
    </OvaModal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function AdicionDosCifras() {
  return (
    <OvaLayout
      metaTitle="Adición de números de dos cifras"
      metaDescription="Adición de números de dos cifras"
      guiaTema="OVAs/Matematicas/Adicion-Sustraccion/guias/adiciondoscifras.pdf"
      repasemosSrc={REPASEMOS_SRC}
      letrero={
        <img
          id="canvas_btn_act1"
          className="letreroContenido"
          src={IMG.letrero}
          alt="Adición de números de dos cifras"
          draggable={false}
        />
      }
      renderAprende={(open, onClose) => <ModalAprende open={open} onClose={onClose} />}
      renderEvaluemos={(open, onClose) => <ModalEvaluemos open={open} onClose={onClose} />}
    />
  );
}
