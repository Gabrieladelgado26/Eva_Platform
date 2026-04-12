import { useState, useEffect } from "react";

const BASE = "/OVAs/Matematicas/Adicion-Sustraccion";
const IMG_BG      = `${BASE}/images/modals/modal_bg.png`;
const IMG_CLOSE   = `${BASE}/images/modals/modal_close.png`;
const IMG_YOUTUBE = `${BASE}/images/branding/youtube.png`;
const DEFAULT_VIDEO = "https://www.youtube-nocookie.com/embed/mxdFrYz6Ino?rel=0&showinfo=0";

export default function ModalConoce({ open, onClose, videoSrc: externalSrc }) {
  const [frameSrc, setFrameSrc] = useState("");

  useEffect(() => {
    if (open) document.body.classList.add("modal-open");
    else      document.body.classList.remove("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, [open]);

  useEffect(() => {
    if (open) setFrameSrc(externalSrc || DEFAULT_VIDEO);
    else setFrameSrc("");
  }, [open, externalSrc]);

  if (!open) return null;

  return (
    <>
      <div className="modal-backdrop in" onClick={onClose} style={{ zIndex: 1040 }} />
      <div
        className="modal in modalConoce"
        tabIndex="-1" id="modalconoce" role="dialog"
        aria-labelledby="myLargeModalLabel" data-keyboard="false" data-backdrop="static"
        style={{ display: "block", overflowY: "auto", zIndex: 1050 }}
      >
        <div className="modal-dialog modal-lg" style={{ marginTop: "2%", marginLeft: "12%", width: "78%" }}>
          <div className="modal-content" style={{ backgroundColor: "transparent" }}>
            <img className="modalImagen" src={IMG_BG} alt="" draggable={false} />
            <img id="cerrarmodalconoce" className="iconocerrar" src={IMG_CLOSE}
              alt="Cerrar" draggable={false} onClick={onClose} />
            <img className="iconoyoutube" src={IMG_YOUTUBE} alt="YouTube" draggable={false} />
            <div className="divmodalConoce">
              <div className="container-fluid">
                <iframe id="contentVideoConoce" src={frameSrc}
                  width="80%" height="80%" frameBorder="0" allowFullScreen
                  title="Conoce el OVA" style={{ border: "none" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
