var canvas, content, input;
(function() {
    canvas = (function() {
        var c = {},

            frame = document.getElementsByTagName("canvas")[0],
            fctx = frame.getContext("2d"),
            view = document.createElement("canvas"),
            ctx = view.getContext("2d"),
            fw, fh, vw, vh, scale = 1;

        c.frame = frame;
        c.view = view;
        c.ctx = ctx;

        c.flip = function() {
            fctx.clearRect(0, 0, fw, fh);
            fctx.drawImage(this.view, 0, 0, fw, fh);

            this.ctx.clearRect(0, 0, vw, vh);
        };

        Object.defineProperty(c, "width", {
            set: function(w) {
                this.view.width = w;
                this.scale = scale;
            },
            get: function() {
                return vw;
            }
        });
        Object.defineProperty(c, "height", {
            set: function(h) {
                this.view.height = h;
                this.scale = scale;
            },
            get: function() {
                return vh;
            }
        });
        Object.defineProperty(c, "scale", {
            set: function(s) {
                scale = s;
                vw = this.view.width;
                vh = this.view.height;
                fw = this.frame.width = vw * s;
                fh = this.frame.height = vh * s;

                fctx.imageSmoothingEnabled = false;
                ["o", "ms", "moz", "webkit"].forEach(function(v) {
                    fctx[v + "imageSmoothingEnabled"] = false;
                });
            },
            get: function() {
                return scale;
            }
        });

        c.scale = scale;
        return c;
    })();

    content = (function() {
        var c = {},
            files = {},
            filecount = 0,
            loadcount = 0;

        c.get = function(name) {
            return files[name];
        };

        c.progress = function() {
            return loadcount/filecount;
        };

        c.load = function(name, src) {
            src = src || name;

            filecount++;
            switch(src.split(".").pop()) {
                case "png":
                case "gif":
                case "jpg":
                    var img = new Image();
                    img.onload = function() {
                        loadcount++;
                    };
                    img.src = src;
                    files[name] = img;
                    break;

                case "ogg":
                case "mp3":
                case "wav":
                    break;

                case "json":
                case "tmx":
                    break;
            }
        };

        return c;
    })();

    input = (function() {
        var i = {},

            bindings = {},
            pressed = {},
            down = {},
            released = [],

            mouse = {x: 0, y: 0};

        var Buttons = {
            LEFT: -1,
            MIDDLE: -2,
            RIGHT: -3
        };

        var Keys = {
            SPACE: 32,
            LEFT_ARROW: 37,
            UP_ARROW: 38,
            RIGHT_ARROW: 39,
            DOWN_ARROW: 40,
        };

        for (var ch = 65; ch <= 90; ch++) {
            Keys[String.fromCharCode(ch)] = ch;
        }
        i.Buttons = Buttons;
        i.Keys = Keys;

        i.bindKey = function(action, keys) {
            if (typeof keys === "number") {
                bindings[keys] = action;
            }
            for (var i = 0; i < keys.length; i++) {
                bindings[keys[i]] = action;
            }
        };

        function getCode(e) {
            var t = e.type;
            if (t === "keydown" || t === "keyup") {
                return e.keyCode;
            } else if (t === "mousedown" || t === "mouseup") {
                switch (e.button) {
                    case 0:
                        return Buttons.LEFT;
                    case 1:
                        return Buttons.MIDDLE;
                    case 2:
                        return Buttons.RIGHT;
                }
            }
        }

        function ondown(e) {
            var action = bindings[getCode(e)];
            if (!action) return;
            pressed[action] = !down[action];
            down[action] = true;
            e.preventDefault();
        }

        function onup(e) {
            var action = bindings[getCode(e)];
            if (!action) return;
            released.push(action);
            e.preventDefault();
        }

        function oncontext(e) {
            if (bindings[Buttons.RIGHT]) {
                e.preventDefault();
            }
        }

        function onmove(e) {
            var el = e.target;
                ox = 0;
                oy = 0;
            do {
                ox += el.offsetLeft;
                oy += el.offsetTop;
            } while (el == el.parentOffset);

            mouse.x = e.clientX - ox;
            mouse.y = e.clientY - oy;

            e.preventDefault();
        }

        i.clearPressed = function() {
            for (var i = 0; i < released.length; i++) {
                down[released[i]] = false;
            }
            pressed = {};
            released = [];
        };

        i.pressed = function(action) {
            return pressed[action];
        };

        i.down = function(action) {
                return down[action];
        };

        i.released = function(action) {
            return released.indexOf(action) >= 0;
        };

        canvas.frame.onmousedown = ondown;
        canvas.frame.onmouseup = onup;
        canvas.frame.onmousemove = onmove;
        canvas.frame.oncontextmenu = oncontext;

        document.onkeydown = ondown;
        document.onkeyup = onup;
        document.onmouseup = onup;

        return i;
    })();
})();
