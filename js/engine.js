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
        }

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

                fctx["imageSmoothingEnabled"] = false;
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
        }

        c.progress = function() {
            return loadcount/filecount;
        }

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
                    }
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
        }

        return c;
    })();
})();
