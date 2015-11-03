define(function() {
    var StatManager = Class.extend({
        init: function() {
            this.reset(0);
        },
        reset: function(startlvl) {
            this.tetraminos = {
                L: 0,
                I: 0,
                T: 0,
                S: 0,
                Z: 0,
                O: 0,
                J: 0,
                tot: 0
            };

            this.firstlvl = false;

            this.startlvl = startlvl || 0;
            this.lvl = this.startlvl;

            this.lines = 0;
            this.score = 0;
        },

        incTetramino: function(id) {
            this.tetraminos[id] += 1;
            this.tetraminos.tot += 1;
        },

        addScore: function(cleared) {
            var p = [0, 40, 100, 300, 1200][cleared || 0];
            this.score += (this.lvl + 1) * p;
        },

        checkLvlUp: function() {
            if (this.firstlvl) {
                if(this.lines >= (this.lvl * 10) + 10) {
                    this.lvl++;
                }
            } else if (this.lines >= (this.startlvl * 10) + 10 || this.lines >= 100) {
                    this.firstlvl = true;
                    this.lvl++;
            }
        },

        toString: function() {
            var s = "";
            s += "level: " + this.lvl + "\n";
            s += "lines: " + this.lines + "\n";
            s += "score: " + this.score;

            return s;
        }
    });

    return StatManager;
});
