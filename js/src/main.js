requirejs.config({
    baseUrl: "js",

    paths: {
        src: "./src"
    }
});

require(["src/Game"], function(Game) {
    var App = Game.extend({
        init: function() {
            canvas.width = 480;
            canvas.height = 272;
            canvas.scale = 2;

            content.load("back", "res/back.png");
            content.load("blocks", "res/blocks.png")
            content.load("numbers.png", "res/numbers.png")
        },

        tick: function() {
            console.log("test");
            if (content.progress() === 1) {
                canvas.ctx.drawImage(content.get("back"), 0, 0);
            }
        }
    });

    (function() {
        var game = new App();
        game.run();

        window.onblur = game.stop.bind(game);
        window.onfocus = game.run.bind(game);
    })();
})
