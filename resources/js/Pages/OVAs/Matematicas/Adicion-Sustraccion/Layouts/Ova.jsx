import { useState, useEffect, useRef } from "react";

const BASE = "/OVAs/Matematicas/Adicion-Sustraccion";

const IMG = {
  bgSecondary:   `${BASE}/images/backgrounds/bg_secondary.png`,
  bgTraffic:     `${BASE}/images/backgrounds/bg_traffic_animation.gif`,
  iconLicense:   `${BASE}/images/branding/icon_license.png`,

  unitRepasemos: `${BASE}/images/units/unit_repasemos.png`,
  unitEvaluemos: `${BASE}/images/units/unit_evaluemos.png`,
  unitAprende:   `${BASE}/images/units/unit_aprende_mas.png`,
  unitConoce:    `${BASE}/images/units/unit_conoce.png`,

  ttRepasemos:   `${BASE}/images/tooltips/tooltip_repasemos.png`,
  ttEvaluemos:   `${BASE}/images/tooltips/tooltip_evaluemos.png`,
  ttAprende:     `${BASE}/images/tooltips/tooltip_aprende_mas.png`,

  stars:         `${BASE}/images/effects/effect_stars.gif`,

  modalFrame:    `${BASE}/images/modals/modal_frame.png`,
  modalBg:       `${BASE}/images/modals/modal_bg.png`,
  modalClose:    `${BASE}/images/modals/modal_close.png`,
  iconYoutube:   `${BASE}/images/branding/youtube.png`,

  menuHome:          `${BASE}/images/menu/menu_home.png`,
  menuHomeHover:     `${BASE}/images/menu/menu_home_hover.png`,
  menuTutorial:      `${BASE}/images/menu/menu_tutorial.png`,
  menuTutorialHover: `${BASE}/images/menu/menu_tutorial_hover.png`,
  menuShare:         `${BASE}/images/menu/menu_share.png`,
  menuShareHover:    `${BASE}/images/menu/menu_share_hover.png`,
  menuTeacher:       `${BASE}/images/menu/menu_teacher_guide.png`,
  menuTeacherHover:  `${BASE}/images/menu/menu_teacher_guide_hover.png`,
};

const SND = {
  aprende:   `${BASE}/sounds/unit/unit_aprende_mas.mp3`,
  repasemos: `${BASE}/sounds/unit/unit_repasemos.mp3`,
  evaluemos: `${BASE}/sounds/unit/unit_evaluemos.mp3`,
  conoce:    `${BASE}/sounds/unit/unit_conoce.mp3`,
};

// ─── Hook: resize OVA ────────────────────────────────────────────────────────
function useResizeOVA(baseWidth = 750) {
  useEffect(() => {
    function resize() {
      const w = window.innerWidth;
      document.body.style.zoom = w <= baseWidth ? String(w / baseWidth) : "1";
    }
    resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      document.body.style.zoom = "1";
    };
  }, [baseWidth]);
}

// ─── Hook: audio en hover ────────────────────────────────────────────────────
function useAudioHover(ref, audioRef, tooltipRef = null) {
  useEffect(() => {
    const el = ref.current;
    const audio = audioRef.current;
    if (!el || !audio) return;

    function enter() {
      audio.currentTime = 0;
      audio.play().catch(() => {});
      if (tooltipRef?.current) tooltipRef.current.style.display = "block";
    }
    function leave() {
      audio.pause();
      if (tooltipRef?.current) tooltipRef.current.style.display = "none";
    }

    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
    };
  }, [ref, audioRef, tooltipRef]);
}

// ─── HoverImg ─────────────────────────────────────────────────────────────────
function HoverImg({ src, hoverSrc, alt = "", className = "", style = {}, title = "", onClick }) {
  const [active, setActive] = useState(false);
  return (
    <img
      src={active ? hoverSrc : src}
      alt={alt}
      className={className}
      style={style}
      title={title}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onClick={onClick}
      draggable={false}
    />
  );
}

// ─── Modal genérico ───────────────────────────────────────────────────────────
export function OvaModal({ open, onClose, frameImg, children, closeId, modalClass, contentClass, extraChildren }) {
  // Agregar modal-open al body al abrir (igual que Bootstrap+jQuery),
  // quitarlo al cerrar para restaurar el scroll normal.
  useEffect(() => {
    if (open) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop — .modal-backdrop.in */}
      <div
        className="modal-backdrop in"
        onClick={onClose}
        style={{ zIndex: 1040 }}
      />

      {/* .modal con display:block y overflow-y:auto (Bootstrap lo activa via .modal-open) */}
      <div
        className={`modal in ${modalClass || ""}`}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="myLargeModalLabel"
        data-keyboard="false"
        data-backdrop="static"
        style={{ display: "block", overflowY: "auto", zIndex: 1050 }}
      >
        {/* Mismo style inline del blade: margin-top:2%, margin-left:12%, width:78% */}
        <div
          className="modal-dialog modal-lg"
          style={{ marginTop: "2%", marginLeft: "12%", width: "78%" }}
        >
          <div className="modal-content" style={{ backgroundColor: "transparent" }}>

            {/* .modalImagen — width:100% via CSS, define el alto del contenedor */}
            <img
              className="modalImagen"
              src={frameImg}
              alt=""
              draggable={false}
            />

            {/* .iconocerrar — top:7%, right:4%, width:4% via CSS */}
            <img
              id={closeId}
              className="iconocerrar"
              src={IMG.modalClose}
              alt="Cerrar"
              draggable={false}
              onClick={onClose}
            />

            {/* Elementos extra: iconoregresar, iconoyoutube, etc. */}
            {extraChildren}

            {/* Contenedor del iframe con la clase correcta según el modal */}
            <div className={contentClass}>
              <div className="container-fluid" style={{ height: "100%" }}>
                {children}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

// ─── Modal Slider ─────────────────────────────────────────────────────────────
function ModalSlider({ open, onClose }) {
  const [src, setSrc] = useState("");
  useEffect(() => { if (open) setSrc("/ova/slider"); else setSrc(""); }, [open]);

  return (
    <OvaModal open={open} onClose={onClose}
      frameImg={IMG.modalFrame} closeId="cerrarmodalslider"
      modalClass="modalslider" contentClass="divmodalRepasemos">
      <iframe id="contentslider" src={src} allowtransparency="true"
        style={{ border: "none", background: "transparent" }}
        title="Slider" />
    </OvaModal>
  );
}

// ─── Modal Repasemos ──────────────────────────────────────────────────────────
function ModalRepasemos({ open, onClose, src: externalSrc }) {
  const [src, setSrc] = useState("");
  useEffect(() => {
    if (open && externalSrc) setSrc(externalSrc);
    else if (!open) setSrc("");
  }, [open, externalSrc]);

  return (
    <OvaModal open={open} onClose={onClose}
      frameImg={IMG.modalBg} closeId="cerrarmodalrepasemos"
      modalClass="modalRepasemos" contentClass="divmodalRepasemos">
      <iframe id="contentframeRepasemos" src={src} allowtransparency="true"
        style={{ width: "100%", height: "93%", border: "none", background: "transparent" }}
        title="Repasemos" />
    </OvaModal>
  );
}

// ─── Modal Conoce ─────────────────────────────────────────────────────────────
function ModalConoce({ open, onClose, videoSrc: externalVideoSrc }) {
  const defaultVideo = "https://www.youtube-nocookie.com/embed/mxdFrYz6Ino?rel=0&showinfo=0";
  const [videoSrc, setVideoSrc] = useState("");
  useEffect(() => {
    if (open) setVideoSrc(externalVideoSrc || defaultVideo);
    else setVideoSrc("");
  }, [open, externalVideoSrc]);

  return (
    <OvaModal open={open} onClose={onClose}
      frameImg={IMG.modalBg} closeId="cerrarmodalconoce"
      modalClass="modalConoce" contentClass="divmodalConoce">
      <img className="iconoyoutube" src={IMG.iconYoutube} alt="YouTube" draggable={false} />
      <iframe
        id="contentVideoConoce"
        src={videoSrc}
        allowtransparency="true"
        allowFullScreen
        title="Conoce el OVA"
        className="videomodal"
        style={{ border: "none", height: "84%", width: "82%", marginLeft: "-1%", marginTop: "-1%" }}
      />
    </OvaModal>
  );
}

// ─── Partial: Audios ──────────────────────────────────────────────────────────
function OvaAudios({ audioRefs }) {
  return (
    <>
      <audio ref={audioRefs.aprende}   preload="auto" src={SND.aprende}   />
      <audio ref={audioRefs.repasemos} preload="auto" src={SND.repasemos} />
      <audio ref={audioRefs.evaluemos} preload="auto" src={SND.evaluemos} />
      <audio ref={audioRefs.conoce}    preload="auto" src={SND.conoce}    />
    </>
  );
}

// ─── Partial: Estrellas ───────────────────────────────────────────────────────
function OvaStars() {
  return (
    <>
      <img className="estrellasconoce"     src={IMG.stars} alt="" draggable={false} />
      <img className="estrellasaprendemas" src={IMG.stars} alt="" draggable={false} />
      <img className="estrellasrepasemos"  src={IMG.stars} alt="" draggable={false} />
      <img className="estrellasevaluemos"  src={IMG.stars} alt="" draggable={false} />
    </>
  );
}

// ─── Partial: Botones ─────────────────────────────────────────────────────────
function OvaButtons({ onRepasemos, onEvaluemos, onAprende, onConoce, audioRefs }) {
  const refLibros        = useRef(null);
  const refRegistradora  = useRef(null);
  const refHelado        = useRef(null);
  const refLetreroConoce = useRef(null);

  const refTooltipInfo      = useRef(null);
  const refTooltipEvaluemos = useRef(null);
  const refTooltipAprende   = useRef(null);

  useAudioHover(refLibros,        audioRefs.repasemos, refTooltipInfo);
  useAudioHover(refRegistradora,  audioRefs.evaluemos, refTooltipEvaluemos);
  useAudioHover(refHelado,        audioRefs.aprende,   refTooltipAprende);
  useAudioHover(refLetreroConoce, audioRefs.conoce);

  return (
    <>
      <a id="repasemosIF" href="#" onClick={(e) => { e.preventDefault(); onRepasemos(); }}>
        <img ref={refLibros} className="libros"
          src={IMG.unitRepasemos} alt="Repasemos" draggable={false} />
        <div ref={refTooltipInfo} className="info" style={{ width: 30, height: 50, display: "none" }}>
          <img className="repasemos" src={IMG.ttRepasemos} alt="" draggable={false} />
        </div>
      </a>

      <a href="#" onClick={(e) => { e.preventDefault(); onEvaluemos(); }}>
        <img ref={refRegistradora} className="registradora"
          src={IMG.unitEvaluemos} alt="Evaluemos" draggable={false} />
        <div ref={refTooltipEvaluemos} className="evaluemos" style={{ width: 30, height: 50, display: "none" }}>
          <img className="evaluemos" src={IMG.ttEvaluemos} alt="" draggable={false} />
        </div>
      </a>

      <a href="#" onClick={(e) => { e.preventDefault(); onAprende(); }}>
        <img ref={refHelado} className="helado"
          src={IMG.unitAprende} alt="Aprende más" draggable={false} />
        <div ref={refTooltipAprende} className="aprendemas" style={{ width: 30, height: 50, display: "none" }}>
          <img className="aprendemas" src={IMG.ttAprende} alt="" draggable={false} />
        </div>
      </a>

      <a id="conoceOva" href="#" onClick={(e) => { e.preventDefault(); onConoce(); }}>
        <img ref={refLetreroConoce} className="letreroconoce"
          src={IMG.unitConoce} alt="Conoce" draggable={false} />
        <div className="letreroconoce" style={{ width: 30, height: 50 }}></div>
      </a>
    </>
  );
}

// ─── Partial: Menú lateral ────────────────────────────────────────────────────
function OvaMenu({ guiaTema, onTutorial }) {
  return (
    <>
      <a href="menu">
        <HoverImg src={IMG.menuHome} hoverSrc={IMG.menuHomeHover}
          className="inicio" title="Inicio" alt="Inicio" />
      </a>
      <HoverImg src={IMG.menuTutorial} hoverSrc={IMG.menuTutorialHover}
        className="tutorial" title="Tutorial" alt="Tutorial" style={{ cursor: "pointer" }}
        onClick={onTutorial} />
      {guiaTema && (
        <a href={`/${guiaTema}`} target="_blank" rel="noreferrer">
          <HoverImg src={IMG.menuShare} hoverSrc={IMG.menuShareHover}
            className="compartir" title="Guía del tema" alt="Guía del tema" />
        </a>
      )}
      <a href="/OVAs/Matematicas/Adicion-Sustraccion/guias/guiadocente.pdf" target="_blank" rel="noreferrer">
        <HoverImg src={IMG.menuTeacher} hoverSrc={IMG.menuTeacherHover}
          className="profe" title="Guía docente" alt="Guía docente" />
      </a>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL: OvaLayout
// ─────────────────────────────────────────────────────────────────────────────
export default function OvaLayout({
  children,
  letrero,
  guiaTema = null,
  metaTitle = "Investic",
  metaDescription = "",
  repasemosSrc = "",
  conoceVideoSrc = "",
  renderAprende   = null,
  renderEvaluemos = null,
}) {
  useResizeOVA(750);

  const audioRefs = {
    aprende:   useRef(null),
    repasemos: useRef(null),
    evaluemos: useRef(null),
    conoce:    useRef(null),
  };

  const [sliderOpen,    setSliderOpen]    = useState(false);
  const [repasemosOpen, setRepasemosOpen] = useState(false);
  const [conoceOpen,    setConoceOpen]    = useState(false);
  const [evaluemosOpen, setEvaluemosOpen] = useState(false);
  const [aprendeOpen,   setAprendeOpen]   = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSliderOpen(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.title = metaTitle || "Investic";
  }, [metaTitle]);

  return (
    <>
      <span id="enlace_home" />
      <div id="skin" style={{ backgroundColor: "#FEFEB6" }} />

      <div className="Skin2">
        <img className="Skin2"    src={IMG.bgSecondary} alt="" draggable={false} />
        <img className="trafico"  src={IMG.bgTraffic}   alt="" draggable={false} />
        <img className="licencia" src={IMG.iconLicense} alt="" draggable={false} />

        {letrero}

        <OvaButtons
          onRepasemos={() => setRepasemosOpen(true)}
          onEvaluemos={() => setEvaluemosOpen(true)}
          onAprende={  () => setAprendeOpen(true)}
          onConoce={   () => setConoceOpen(true)}
          audioRefs={audioRefs}
        />

        <OvaAudios audioRefs={audioRefs} />
        <OvaStars />
        <OvaMenu guiaTema={guiaTema} onTutorial={() => setSliderOpen(true)} />
      </div>

      <ModalSlider    open={sliderOpen}    onClose={() => setSliderOpen(false)} />
      <ModalRepasemos open={repasemosOpen} onClose={() => setRepasemosOpen(false)} src={repasemosSrc} />
      <ModalConoce    open={conoceOpen}    onClose={() => setConoceOpen(false)}    videoSrc={conoceVideoSrc} />

      {renderAprende   && renderAprende(aprendeOpen,   () => setAprendeOpen(false))}
      {renderEvaluemos && renderEvaluemos(evaluemosOpen, () => setEvaluemosOpen(false))}

      {children}
    </>
  );
}
