// dots.js
// A library for making svg coloured dots

console.log("dots!");

// utility stuff

// Random integer from a to be
function randint(a, b) {
    return Math.round( Math.random() * (b - a) + a );
}

// Colour Object
function Color() {
    // Color-parsing private methods
    var parseHex = function(hexstring) {
        var re = RegExp('#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})', 'i');
        var components = hexstring.match(re);
        console.log(components);
        
    }

    var dectohex = function(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;                
    }

    var hextodec = function(c) {

    }

    parseHex(arguments[0]);

    // Representation methods
    this.toHex = function() {
    }
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
