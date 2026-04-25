// ─────────────────────────────────────────────────────────────────────────────
// Partials/Stars.jsx  —  OVA Español › El Cuento
//
// En este OVA el efecto decorativo son libros animados (effect_books.gif)
// posicionados sobre cada botón de unidad.
// Las posiciones las controla stylegeneral.css con las clases .gifXxx.
// ─────────────────────────────────────────────────────────────────────────────

const BASE = '/OVAs/Espanol/Cuento';
const IMG_BOOKS = `${BASE}/images/effects/effect_books.gif`;

export default function OvaBooks() {
    return (
        <>
            <img className="gifconoce"     src={IMG_BOOKS} alt="" draggable={false} />
            <img className="gifaprendemas" src={IMG_BOOKS} alt="" draggable={false} />
            <img className="gifrepasemos"  src={IMG_BOOKS} alt="" draggable={false} />
            <img className="gifevaluemos"  src={IMG_BOOKS} alt="" draggable={false} />
        </>
    );
}
