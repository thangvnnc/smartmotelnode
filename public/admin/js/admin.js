$(document).ready(function () {
    $(".nav-menu").on("click", "li", function () {
        $(".nav-menu").find(".active").removeClass("active");
        $(this).addClass("active");
        $(".nav-item-content").hide(100);
        let attr = $(this).attr("focus");
        $("." +attr).show(100);
    });
});