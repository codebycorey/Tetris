define(function() {
    var Randomizer = Class.extend({

        init: function() {
            this.IDs = "LITSZOJ".split("");
            this.SID = this.IDs.indexOf("S");
            this.ZID = this.IDs.indexOf("Z");
            this.size = this.IDs.length;
            this.initialize();
        },

        initialize: function() {
            this.index = 0;
            this.bag = new Array(this.size);

            for (var i = 0; i < this.size; i++) {
                this.bag[i] = i;
            }

            do {
                this.shuffle();
            } while (this.bag[0] === this.SID || this.bag[0] === this.ZID)
        },

        shuffle: function() {
            var array = array || this.bag,
                counter = array.length,
                temp,
                index;

            while (counter > 0) {
                index = Math.round(Math.random() * --counter);
                temp = array[counter];
                array[counter] = array[index];
                array[index] = temp;
            }
            return array;
        },

        nextInt: function() {
            var i = this.bag[this.index];
            this.index++;
            if (this.index >= this.size) {
                this.index = 0;
                this.shuffle();
            }
            return i;
        },

        nextID: function() {
            return this.IDs[this.nextInt()];
        }

    });

    return Randomizer;
});
