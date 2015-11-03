define(["src/GameBoard", "src/StatManager", "src/Tetramino", "src/Block"], function(GameBoard, StatManager, Tetramino, Block) {
    var Tetris = Class.extend({
        init: function(cols, rows) {
            this.cols = cols;
            this.rows = rows;

            this.gameBoard = new GameBoard();
            this.stat = new StatManager();

            this.blockControl = [];

            this.reset();
        },
        reset: function() {
            this.frames = 1;

            this.blockControl = [];
            for (var i = 0; i < this.cols; i++) {
                this.blockControl[i] = [];
                for (var j = 0; j < this.rows; j++) {
                    this.blockControl[i][j] = new Block(Block.NONE);
                }
            }

            this.setNextTetramino();
        },

        update: function(input) {
            this.currentTetramino.setTo(this.blockControl, Block.NONE);

            if (input.pressed("up")) {
                this.moveRotate();
            }
            if (input.pressed("down")) {
                this.moveDown();
            }
            if (input.pressed("left")) {
                this.moveLeft();
            }
            if (input.pressed("right")) {
                this.moveRight();
            }

            if (this.frames++ % 20 === 0) {
                this.moveDown();
            }

            this.currentTetramino.setTo(this.blockControl);
        },
        draw: function(ctx) {
            this.gameBoard.draw(ctx, this.stat);

            for (var i = 0; i < this.cols; i++) {
                for (var j = 0; j < this.rows; j++) {
                    var b = this.blockControl[i][j];
                    if (b.solid) {
                        this.gameBoard.drawBlock(ctx, b, i, j);
                    }
                }
            }
        },

        setNextTetramino: function() {
            this.currentTetramino = new Tetramino(Tetramino.Z);
            this.currentTetramino.x = 3;
            this.currentTetramino.y = 0;
            this.stat.incTetramino(this.currentTetramino.ID);
        },

        moveLeft: function() {
            var bc = this.blockControl,
                ct = this.currentTetramino;

            if (ct.check(bc, -1 , 0)) {
                ct.x -= 1;
            }
        },

        moveRight: function() {
            var bc = this.blockControl,
                ct = this.currentTetramino;

            if (ct.check(bc, 1 , 0)) {
                ct.x += 1;
            }
        },

        moveRotate: function(dr) {
            dr = dr || 1;
            var bc = this.blockControl,
                ct = this.currentTetramino;

            if (ct.check(bc, 0 , 0, dr)) {
                ct.rotation = ct.getRotation(dr);
            }
        },

        moveDown: function() {
            var bc = this.blockControl,
                ct = this.currentTetramino;

            if (ct.check(bc, 0 , 1)) {
                ct.y += 1;
            } else {
                ct.setTo(bc);
                this.setNextTetramino();
            }
        }
    });

    return Tetris;
});
