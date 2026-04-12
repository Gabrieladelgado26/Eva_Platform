/**
 * Ajusta el zoom del OVA en pantallas pequeñas
 * Mantiene la proporción del diseño original (750px)
 */
function resizeOVA() {
    const baseWidth = 750;
    const windowWidth = $(window).width();

    if (windowWidth <= baseWidth) {
        const scale = windowWidth / baseWidth;
        $("body").css("zoom", scale);
    } else {
        $("body").css("zoom", 1);
    }
}

$(document).ready(resizeOVA);
$(window).on('resize', resizeOVA);/**
 * Ajusta el zoom del OVA en pantallas pequeñas
 * Mantiene la proporción del diseño original (750px)
 */
function resizeOVA() {
    const baseWidth = 750;
    const windowWidth = $(window).width();

    if (windowWidth <= baseWidth) {
        const scale = windowWidth / baseWidth;
        $("body").css("zoom", scale);
    } else {
        $("body").css("zoom", 1);
    }
}

$(document).ready(resizeOVA);
$(window).on('resize', resizeOVA);