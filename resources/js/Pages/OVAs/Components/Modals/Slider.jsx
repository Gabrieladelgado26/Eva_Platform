import { useState, useEffect } from "react";

const BASE = "OVAs/Matematicas/Adicion-Sustraccion/images";
const IMG_FRAME = `${BASE}/modals/modal_frame.png`;
const IMG_CLOSE = `${BASE}/modals/modal_close.png`;

export default function ModalSlider({ open, onClose }) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    if (open) document.body.classList.add("modal-open");
    else      document.body.classList.remove("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, [open]);

  useEffect(() => { if (open) setSrc("slider"); else setSrc(""); }, [open]);

  if (!open) return null;

  return (
    <>
      <div className="modal-backdrop in" onClick={onClose} style={{ zIndex: 1040 }} />
      <div
        className="modal in modalslider"
        tabIndex="-1" id="modalslider" role="dialog"
        aria-labelledby="myLargeModalLabel" data-keyboard="false" data-backdrop="static"
        style={{ display: "block", overflowY: "auto", zIndex: 1050 }}
      >
        <div className="modal-dialog modal-lg" style={{ marginTop: "2%", marginLeft: "12%", width: "78%" }}>
          <div className="modal-content" style={{ backgroundColor: "transparent" }}>
            <img className="modalImagen" src={IMG_FRAME} alt="" draggable={false} />
            <img id="cerrarmodalslider" className="iconocerrar" src={IMG_CLOSE}
              alt="Cerrar" draggable={false} onClick={onClose} />
            <div className="divmodalSlider">
              <div className="container-fluid">
                <iframe id="contentslider" src={src} allowtransparency="true"
                  style={{ width: "100%", height: "93%", border: "none", background: "transparent" }}
                  title="Slider" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
