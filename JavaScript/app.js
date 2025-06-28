Louder.define("App", ["exports", "UI", "Game"], function (exports, UI, Game) {
    Object.assign(exports, {
        init: function () {
            UI.init();
            Game.init();
        }
    });
});