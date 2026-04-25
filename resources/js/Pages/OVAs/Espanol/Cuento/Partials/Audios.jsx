// ─────────────────────────────────────────────────────────────────────────────
// Partials/Audios.jsx  —  OVA Español › El Cuento
//
// Monta los 4 elementos <audio> ocultos que se reproducen al hacer hover
// sobre los botones de unidad.
//
// Uso en el componente padre:
//   const audioRefs = {
//     repasemos: useRef(null),
//     evaluemos: useRef(null),
//     aprende:   useRef(null),
//     conoce:    useRef(null),
//   };
//   <OvaAudios audioRefs={audioRefs} />
// ─────────────────────────────────────────────────────────────────────────────

const BASE = '/OVAs/Espanol/Cuento';
const SND = {
    repasemos: `${BASE}/sounds/unit/unit_repasemos.mp3`,
    evaluemos: `${BASE}/sounds/unit/unit_evaluemos.mp3`,
    aprende:   `${BASE}/sounds/unit/unit_aprende_mas.mp3`,
    conoce:    `${BASE}/sounds/unit/unit_conoce.mp3`,
};

export default function OvaAudios({ audioRefs }) {
    return (
        <>
            <audio ref={audioRefs.repasemos} preload="auto" src={SND.repasemos} />
            <audio ref={audioRefs.evaluemos} preload="auto" src={SND.evaluemos} />
            <audio ref={audioRefs.aprende}   preload="auto" src={SND.aprende}   />
            <audio ref={audioRefs.conoce}    preload="auto" src={SND.conoce}    />
        </>
    );
}
