import { useState, useEffect } from "react";
import OvaLayout, { OvaModal } from "../Layouts/Ova";

const BASE = "/OVAs/Matematicas/Adicion-Sustraccion";

const IMG = {
  letrero:     `${BASE}/images/signboard/sign_addition_up_to_19.png`,
  modalBg:     `${BASE}/images/modals/modal_bg.png`,
  modalClose:  `${BASE}/images/modals/modal_close.png`,
  modalReturn: `${BASE}/images/modals/modal_return.png`,
};

const REPASEMOS_SRC = `${BASE}/repasemos/adiciondenumeroshastael19/adiciondenumeroshastael19.html`;
const CONOCE_VIDEO  = "https://www.youtube-nocookie.com/embed/amPz_Z8_imY?rel=0&amp;showinfo=0";
const APRENDE_SRC   = `${BASE}/juegos/adiciondenumeroshastael19/menu.html`;
const EVALUEMOS_SRC = `${BASE}/evaluemos/adiciondenumeroshastael19/adiciondenumeroshastael19.html`;

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
        title="Aprende más — Adición de números hasta el 19"
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
        title="Evaluemos — Adición de números hasta el 19"
      />
    </OvaModal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function AdicionHasta19() {
  return (
    <OvaLayout
      metaTitle="Adición de números hasta el 19"
      metaDescription="Adición de números hasta el 19"
      guiaTema="OVAs/Matematicas/Adicion-Sustraccion/guias/adicionnumeros19.pdf"
      repasemosSrc={REPASEMOS_SRC}
      conoceVideoSrc={CONOCE_VIDEO}
      letrero={
        <img
          id="canvas_btn_act1"
          className="letreroContenido"
          src={IMG.letrero}
          alt="Adición de números hasta el 19"
          draggable={false}
        />
      }
      renderAprende={(open, onClose) => <ModalAprende open={open} onClose={onClose} />}
      renderEvaluemos={(open, onClose) => <ModalEvaluemos open={open} onClose={onClose} />}
    />
  );
}
