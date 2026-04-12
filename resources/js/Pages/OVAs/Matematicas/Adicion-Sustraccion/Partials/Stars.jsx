// ─────────────────────────────────────────────────────────────────────────────
// Stars.jsx
// Equivale a: partials/stars.blade.php
//
// Renderiza las 4 imágenes de estrellas animadas posicionadas sobre cada
// botón de unidad (conoce, aprende, repasemos, evaluemos).
// Sus posiciones las controla stylemedicion.css (clases .estrellasXxx).
// ─────────────────────────────────────────────────────────────────────────────

const BASE = "/OVAs/Matematicas/Adicion-Sustraccion";
const IMG_STARS = `${BASE}/images/effects/effect_stars.gif`;

export default function OvaStars() {
  return (
    <>
      <img className="estrellasconoce"     src={IMG_STARS} alt="" draggable={false} />
      <img className="estrellasaprendemas" src={IMG_STARS} alt="" draggable={false} />
      <img className="estrellasrepasemos"  src={IMG_STARS} alt="" draggable={false} />
      <img className="estrellasevaluemos"  src={IMG_STARS} alt="" draggable={false} />
    </>
  );
}
