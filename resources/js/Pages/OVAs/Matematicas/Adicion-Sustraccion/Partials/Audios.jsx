// ─────────────────────────────────────────────────────────────────────────────
// Audios.jsx
// Equivale a: partials/audios.blade.php
//
// Monta los 4 elementos <audio> ocultos que se reproducen al hacer hover
// sobre los botones de unidad. Los refs se crean en el componente padre
// (OvaLayout) y se pasan como prop `audioRefs`.
//
// Uso en el padre:
//   const audioRefs = {
//     aprende:   useRef(null),
//     repasemos: useRef(null),
//     evaluemos: useRef(null),
//     conoce:    useRef(null),
//   };
//   <OvaAudios audioRefs={audioRefs} />
// ─────────────────────────────────────────────────────────────────────────────

const BASE = "/OVAs/Matematicas/Adicion-Sustraccion";
const SND = {
  aprende:   `${BASE}/sounds/unit/unit_aprende_mas.mp3`,
  repasemos: `${BASE}/sounds/unit/unit_repasemos.mp3`,
  evaluemos: `${BASE}/sounds/unit/unit_evaluemos.mp3`,
  conoce:    `${BASE}/sounds/unit/unit_conoce.mp3`,
};

export default function OvaAudios({ audioRefs }) {
  return (
    <>
      <audio ref={audioRefs.aprende}   preload="auto" src={SND.aprende}   />
      <audio ref={audioRefs.repasemos} preload="auto" src={SND.repasemos} />
      <audio ref={audioRefs.evaluemos} preload="auto" src={SND.evaluemos} />
      <audio ref={audioRefs.conoce}    preload="auto" src={SND.conoce}    />
    </>
  );
}
