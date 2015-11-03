define(["src/GameBoard", "src/StatManager", "src/Tetramino", "src/Block", "src/Randomizer"], function(GameBoard, StatManager, Tetramino, Block, Randomizer) {
    var FRAMES_PER_LVL = [59, 49, 45, 41, 37, 33, 28, 22, 17, 11, 10, 9, 8, 7, 6, 6, 5, 5, 4, 4, 3],
    TOP_LVL = FRAMES_PER_LVL.length-1;

    function getFrame(lvl) {
        if (lvl <= TOP_LVL) {
            return FRAMES_PER_LVL[lvl];
        } else {
            return FRAMES_PER_LVL[TOP_LVL]
        }
    }

    var Tetris = Class.extend({
        init: function(cols, rows) {
            this.cols = cols;
            this.rows = rows;

            this.gameBoard = new GameBoard();
            this.stat = new StatManager();
            this.random = new Randomizer();

            this.reset(0);
        },
        reset: function(startlvl) {
            this.stat.reset(startlvl || 0);
            this.currentTetramino = null;
            this.gameOver = false;
            this.frames = 1;

            this.blockControl = [];
            for (var i = 0; i < this.cols; i++) {
                this.blockControl[i] = [];
                for (var j = 0; j < this.rows; j++) {
                    this.blockControl[i][j] = new Block(Block.NONE);
                }
            }

            this.nextBlock = [];
            for (var i = 0; i < 5; i++) {
                this.nextBlock[i] = [];
                for (var j = 0; j < 5; j++) {
                    this.nextBlock[i][j] = new Block();
                }
            }

            this.random.initialize();

            this.next = new Tetramino(this.random.nextID());
            this.next.x = this.next.y = 1;
            this.next.setTo(this.nextBlock);

            this.setNextTetramino();
        },

        update: function(input) {
            this.currentTetramino.setTo(this.blockControl, Block.NONE);
            // this.currentTetramino.setShadow(this.blockControl);

            if (input.pressed("up")) {
                this.moveRotate();
            }
            if (input.pressed("down")) {
                this.stat.score += 1;
                this.moveDown();
            }
            if (input.pressed("left")) {
                this.moveLeft();
            }
            if (input.pressed("right")) {
                this.moveRight();
            }
            if (input.pressed("space")) {
                this.hardDrop();
            }

            if (this.frames++ % getFrame(this.stat.lvl) === 0) {
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
                        this.gameBoard.drawBlock(ctx, b.id, i, j);
                    }
                    if (b.shadow) {
                        this.gameBoard.drawBlock(ctx, b.id, i, j, true);
                        this.blockControls[i][j].setType(Block.NONE);
                    }
                }
            }
            for (var i = 0; i < 5; i++) {
                for (var j = 0; j < 5; j++) {
                    var b = this.nextBlock[i][j];
                    if (b.solid) {
                        this.gameBoard.drawNext(ctx, b.id, i, j);
                    }
                }
            }
        },

        setNextTetramino: function() {
            if (this.currentTetramino && this.currentTetramino.y == 0) {
                this.gameOver = true;
            }

            this.currentTetramino = new Tetramino(this.next.ID, 3, 0);
            this.stat.incTetramino(this.currentTetramino.ID);

            this.next.setTo(this.nextBlock, Block.NONE);
            this.next = new Tetramino(this.random.nextID(), 1, 1);
            this.next.setTo(this.nextBlock);
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
                this.checkRows();
                this.setNextTetramino();
            }
        },

        hardDrop: function() {
            var bc = this.blockControl,
                ct = this.currentTetramino;
                move = true;

            while (move) {
                if (ct.check(bc, 0 , 1)) {
                    ct.y += 1;
                    this.stat.score += 2;
                } else {
                    move = false;
                    ct.setTo(bc);
                    this.checkRows();
                    this.setNextTetramino();
                }
            }
        },

        checkRows: function() {
            var full, removed = 0;

            for (var i = this.rows-1; i >= 0; i--) {
                full = true;
                for (var j = 0; j < this.cols; j++) {
                    if (!this.blockControl[j][i].solid) {
                        full = false;
                        break;
                    }
                }

                if (full) {
                    this.removeRow(i);
                    removed++;
                    this.stat.lines++;
                    i++;
                }
            }
            if(removed > 0) {
                this.stat.addScore(removed);
                this.stat.checkLvlUp();
            }
        },

        removeRow: function(row) {
            var bc = this.blockControl;
            for (var i = row; i > 0; i--) {
                for (var j = 0; j < this.cols; j++) {
                    bc[j][i].setType(bc[j][i - 1].id);
                }
            }
        }
    });

    return Tetris;
});
