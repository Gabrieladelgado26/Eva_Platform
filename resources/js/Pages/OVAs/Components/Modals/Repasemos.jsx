import { useState, useEffect } from "react";

const BASE = "/OVAs/Matematicas/Adicion-Sustraccion";
const IMG_BG    = `${BASE}/images/modals/modal_bg.png`;
const IMG_CLOSE = `${BASE}/images/modals/modal_close.png`;

export default function ModalRepasemos({ open, onClose, src: externalSrc }) {
  const [frameSrc, setFrameSrc] = useState("");

  useEffect(() => {
    if (open) document.body.classList.add("modal-open");
    else      document.body.classList.remove("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, [open]);

  useEffect(() => {
    if (open && externalSrc) setFrameSrc(externalSrc);
    else if (!open) setFrameSrc("");
  }, [open, externalSrc]);

  if (!open) return null;

  return (
    <>
      <div className="modal-backdrop in" onClick={onClose} style={{ zIndex: 1040 }} />
      <div
        className="modal in modalRepasemos"
        tabIndex="-1" id="modalrepasemos" role="dialog"
        aria-labelledby="myLargeModalLabel" data-keyboard="false" data-backdrop="static"
        style={{ display: "block", overflowY: "auto", zIndex: 1050 }}
      >
        <div className="modal-dialog modal-lg" style={{ marginTop: "2%", marginLeft: "12%", width: "78%" }}>
          <div className="modal-content" style={{ backgroundColor: "transparent" }}>
            <img className="modalImagen" src={IMG_BG} alt="" draggable={false} />
            <img id="cerrarmodalrepasemos" className="iconocerrar" src={IMG_CLOSE}
              alt="Cerrar" draggable={false} onClick={onClose} />
            <div className="divmodalRepasemos">
              <div className="container-fluid">
                <iframe id="contentframeRepasemos" src={frameSrc} allowtransparency="true"
                  style={{ width: "100%", height: "93%", border: "none", background: "transparent" }}
                  title="Repasemos" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
