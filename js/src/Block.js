define(function() {
    var DrawIDs = {
        NONE: 0,
        I: 1,
        Z: 2,
        J: 3,
        L: 4,
        S: 5,
        O: 6,
        T: 7
    };

    var Block = Class.extend({
        init: function(id) {
            this.setType(id || "none");
        },

        setType: function(id, shadow) {
            this.id = typeof id === "number" ? id : DrawIDs[id.toUpperCase()];
            this.solid = this.id !== DrawIDs.NONE;
            if (shadow) {
                this.solid = false;
            }

            this.shadow = shadow || false;
        }
    });

    for (var id in DrawIDs) {
        Block[id] = DrawIDs[id];
    }

    return Block;
});
