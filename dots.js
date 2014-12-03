// dots.js
// A library for making svg coloured dots

console.log("dots!");

// utility stuff

// Random integer from a to be
function randint(a, b) {
    return Math.round( Math.random() * (b - a) + a );
}

// Colour Object
function Color(components) {

    // Some hairy functions required to instantiate the object. Bear with me...

    // Internally, we work with RGB
    this.r = null;
    this.g = null;
    this.b = null;

    this.available = false;

    var self = this;

    // Color-parsing private methods
    var parseHex = function(hexstring) {
        var re = RegExp('#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})', 'i');
        var colmatch = hexstring.match(re);
        if (colmatch !== null) {
            return ([   parseInt(colmatch[1],16),
                        parseInt(colmatch[2],16),
                        parseInt(colmatch[3],16) ]);
        } else {
            return false;
        }
    }

    var isRgb = function(color_array) {
        for (var i in color_array) {
            if (color_array[i] < 0 || color_array[i] > 255) {
                return false;
            }
            return true;
        }
    }

    var areNums = function(nums) {
        for (var i in nums) {
            if (isNaN(parseFloat(nums[i]) || !isFinite(nums[i]))) {
                return false;
            }
        }
        return true;
    }

    var dectohex = function(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;                
    }

    var invalid = function(s) {
        throw "invalid color argument " + s;
    }

    this.randomise = function() {
        this.r = randint(0,255);
        this.g = randint(0,255);
        this.b = randint(0,255);
    }

    // Better ways of validating the colour input

    if (typeof components === typeof '') { // Parse string input
        console.log("string");
        var parsed_hex = parseHex(components);
        if (parsed_hex) {
            this.r = parsed_hex[0];
            this.g = parsed_hex[1];
            this.b = parsed_hex[2];
        }
    } else if (typeof components === []) { // Parse array input
        if (areNums(components) && isRgb(components)) {
            this.r = components[0];
            this.g = components[1];
            this.b = components[2];
        } else {
            invalid("rgb array");
        }
    } else if (typeof components === typeof 1) { // Parse numeric input
        if (areNums(arguments) && isRgb(arguments)) {
            this.r = arguments[0];
            this.g = arguments[1];
            this.b = arguments[2];
        } else {
            invalid("rgb values");
        }
    } else if (typeof components === 'undefined') { // Parse undefined input
        this.randomise();
    } else {
        invalid("generally");
    }
   
    this.available = true;
    // Aaaaand we're instantiated.


    this.toHex = function() {
        return "#" + dectohex(this.r) + dectohex(this.g) + dectohex(this.b);
    }

    this.toRgb = function() {
        return [ this.r, this.g, this.b ];
    }
}




// Representation methods
// Mixing methods

Color.prototype.mix = function() {
    
}




// Control object
// Binds to an svg element

function Dotbox(element, defaults) {

    this.element = element;
    this.width = this.element.offsetWidth;
    this.height = this.element.offsetHeight;


    this.defaults = typeof defaults !== 'undefined' ? defaults : {
       "cx" : randint(),
    }

    this.makeDot = function(params) {
        
    }

}


// dot object

function Dot(x, y, radius, color, parent) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.parent = parent;

    this.element = document.createElement('circle');
    this.element.setAttribute('cx', this.x);

    this.place = function() {
    }

}
