/**
 * Abre un modal y asigna src a un iframe o video
 * @param {string} modalClass - clase del modal
 * @param {string} target - selector iframe / video
 * @param {string} src - url a cargar
 */
function openModal(modalClass, target = null, src = null) {
    $(modalClass).modal('show');

    if (target && src) {
        $(target).attr('src', src);
    }
}

/**
 * Cierra un modal y limpia su contenido
 * @param {string} modalClass - clase del modal
 * @param {string} target - selector iframe / video
 */
function closeModal(modalClass, target = null) {
    $(modalClass).modal('hide');

    if (target) {
        $(target).attr('src', '');
    }
}

/* Modal inicial */

$(function () {
    setTimeout(() => {
        openModal('.modalslider', '#contentslider', 'slider');
    }, 1000);
});

/* Botones cerrar */

$("#cerrarmodalslider").on('click', function () {
    closeModal('.modalslider', '#contentslider');
});

$("#cerrarmodal").on('click', function () {
    closeModal('.modalAprende', '#contentframe');
});

$("#cerrarmodalrepasemos").on('click', function () {
    closeModal('.modalRepasemos', '#contentframeRepasemos');
});

$("#cerrarmodalevaluemos").on('click', function () {
    closeModal('.modalEvaluemos', '#contentframeEvaluemos');
});

$("#cerrarmodalconoce").on('click', function () {
    closeModal('.modalConoce', '#contentVideoConoce');
});