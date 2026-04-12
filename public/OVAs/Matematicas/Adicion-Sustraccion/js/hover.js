$(document).ready(function () {

    function hoverSwap(selector, img1, img2) {
        $(selector)
            .on("mouseenter", function () {
                $(this).attr(
                    "src",
                    $(this).attr("src").replace(img1, img2)
                );
            })
            .on("mouseleave", function () {
                $(this).attr(
                    "src",
                    $(this).attr("src").replace(img2, img1)
                );
            });
    }

    hoverSwap(".tutorial", "menu_tutorial.png", "menu_tutorial_hover.png");
    hoverSwap(".inicio", "menu_home.png", "menu_home_hover.png");
    hoverSwap(".compartir", "menu_share.png", "menu_share_hover.png");
    hoverSwap(".profe", "menu_teacher_guide.png", "menu_teacher_guide_hover.png");

});