define(function() {
    var ShapeDef = {
        L: "111 100 000",
        I: "0000 1111 0000 0000",
        T: "111 010 000",
        S: "011 110 000",
        Z: "110 011 000",
        O: "110 110 000",
        J: "111 001 000",
    }

    var IDs = [];
    for (var sd in ShapeDef) {
        ShapeDef[sd] = ShapeDef[sd].replace(/\s+/g, "");
        IDs.push(sd);
    }

    var Tetramino = Class.extend({

        init: function(id, x, y) {
            this.shapes = [];
            this.rotation = 0;
            this.ID = id.toUpperCase();

            this.x = x || 0;
            this.y = y || 0;

            var shape = ShapeDef[this.ID];

            var s = [],
                n = Math.sqrt(shape.length);

            for (var i = 0; i < n; i++) {
                s[i] = [];
                for (var j = 0; j < n; j++) {
                    s[i][j] = parseInt(shape[j + i*n]);
                }
            }
            this.shapes.push(s);

            var r = 3, t;
            while (this.ID !== "O" && r-- !== 0) {
                t = [];
                for (var i = 0; i < n; i++) {
                    t[i] = [];
                    for (var j = 0; j < n; j++) {
                        t[i][j] = s[n - j - 1][i];
                    }
                }
                s = t.slice(0);
                this.shapes.push(s);
            }
        },

        setTo: function(control, id) {
            id = id != null ? id : this.ID;
            var shape = this.shapes[this.rotation];

            for (var i = 0; i < shape.length; i++) {
                for (var j = 0; j < shape.length; j++) {
                    if (shape[j][i]) {
                        control[this.x+i][this.y+j].setType(id);
                    }
                }
            }
        },

        toString: function() {
            var str = "";

            for (var i = 0; i < this.shapes.length; i++) {
                str += "\n";
                var s = this.shapes[i];
                for (var j = 0; j < s.length; j++) {
                    for (var k = 0; k < s[j].length; k++) {
                        str += s[j][k] ? "#" : ".";
                    }
                    str += "\n";

                }
            }

            return str;
        }
    });

    for (var i = 0; i < IDs.length; i++) {
        Tetramino[IDs[i]] = IDs[i];
    }

    return Tetramino;
});
