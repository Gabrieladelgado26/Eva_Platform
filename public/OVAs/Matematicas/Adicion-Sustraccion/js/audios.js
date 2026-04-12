/**
 * Manejo de audios por hover
 */

function playAudioOnHover(trigger, audioId, tooltip = null) {
    const audio = document.getElementById(audioId);

    if (!audio) return;

    $(trigger)
        .on("mouseenter", function () {
            audio.currentTime = 0;
            audio.play();

            if (tooltip) {
                $(tooltip).show();
            }
        })
        .on("mouseleave", function () {
            audio.pause();

            if (tooltip) {
                $(tooltip).hide();
            }
        });
}

/* Repasemos */
playAudioOnHover(
    ".libros",
    "resource_audio_repasemos",
    ".info"
);

/* Evaluemos */
playAudioOnHover(
    ".registradora",
    "resource_audio_evaluacion",
    ".evaluemos"
);

/* Aprende más */
playAudioOnHover(
    ".helado",
    "resource_audio",
    ".aprendemas"
);

/* Conoce */
playAudioOnHover(
    ".letreroconoce",
    "resource_audio_conoce"
);