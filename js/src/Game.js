define(function() {
    var Game = Class.extend({
        tick: function() {
            console.warn("should overrided by childclass!");
        },
        stop: function() {
            if (this.reqframe) {
                window.cancelAnimationFrame(this.reqframe);
            }
            this.reqframe = null;
            this.running = false;
        },
        run: function() {
            if (this.running) return;
            this.running = true;

            var self = this;
            function loop() {
                self.reqframe = window.requestAnimationFrame(loop);
                self.tick();

                canvas.flip();
            }
            this.reqframe = window.requestAnimationFrame(loop);
        }
    });

    return Game;
});
