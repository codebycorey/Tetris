define(["src/Numfont"], function(Numfont) {
    var GameBoard = Class.extend({

        init: function() {
            this.back = content.get("back");
            this.blocks = content.get("blocks");
            var num = content.get("numbers");
            this.font = {
                gray  : new Numfont(num,  0, 9),
                cyan  : new Numfont(num,  9, 9),
                red   : new Numfont(num, 18, 9),
                blue  : new Numfont(num, 27, 9),
                orange: new Numfont(num, 36, 9),
                green : new Numfont(num, 45, 9),
                yellow: new Numfont(num, 54, 9),
                purple: new Numfont(num, 63, 9)
            };
        },

        draw: function(ctx, stat) {
            var tetris = stat.tetraminos;

            ctx.drawImage(this.back, 0 ,0);

            this.font.gray.draw(ctx, stat.lvl, 113, 16, 5);
            this.font.gray.draw(ctx, stat.lines, 113, 34, 5);
            this.font.gray.draw(ctx, stat.score, 78, 52, 10);

            this.font.orange.draw(ctx, tetris.L, 432, 52, 5);
            this.font.cyan.draw  (ctx, tetris.I, 432, 76, 5);
            this.font.purple.draw(ctx, tetris.T, 432, 100, 5);
            this.font.green.draw (ctx, tetris.S, 432, 124, 5);
            this.font.red.draw   (ctx, tetris.Z, 432, 148, 5);
            this.font.yellow.draw(ctx, tetris.O, 432, 172, 5);
            this.font.blue.draw  (ctx, tetris.J, 432, 196, 5);

            this.font.gray.draw(ctx, tetris.tot, 425, 221, 6);
        },

        drawBlock : function(ctx, id, x, y, shadow) {
            if (shadow) {
                x = 180 + x*12;
                y = 4 + y*12;
                ctx.drawImage(this.blocks, id*12, 13, 13, 13, x, y, 13, 13);
            } else {
                x = 179 + x*12;
                y = 3 + y*12;
                ctx.drawImage(this.blocks, id*12, 0, 13, 13, x, y, 13, 13);
            }
        },

        drawNext: function(ctx, id, x, y) {
            x = 99 + x*12;
            y = 197 + y*12;
            ctx.drawImage(this.blocks, id*12, 0, 13, 13, x, y, 13, 13);
        }

    });

    return GameBoard;
});
