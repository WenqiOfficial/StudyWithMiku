$("#start").click(function(){ap.play();});
$("#bt_start a").click(function(a) {
    $("#scene_top").stop().fadeOut(200, "linear"), $("#scene_loading").stop().fadeIn(200, "linear"), 2 == C ? t() : ((new aidn.WebAudio).load(""), P.init(n, e)), a.preventDefault()
});
$("#bt_about a").click(function(a) {
    $("#about").stop().fadeIn(200, "linear"), $("#about_cover").stop().fadeIn(200, "linear"), a.preventDefault()
});
$("#bt_close,#about_cover").click(function() {
    $("#about").stop().fadeOut(200, "linear"), $("#about_cover").stop().fadeOut(200, "linear")
});
