// dots.js
// A library for making svg coloured dots

console.log("dots!");

// Moments

function standardDeviation(values){
  var avg = average(values);
  
  var squareDiffs = values.map(function(value){
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });
  
  var avgSquareDiff = average(squareDiffs);
 
  var stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
}
 
function average(data){
  var sum = data.reduce(function(sum, value){
    return sum + value;
  }, 0);
 
  var avg = sum / data.length;
  return avg;
}

// utility stuff

// Eventually going to break the colour stuff out into
// a submodule called PaletteKnife

// Uniform random integer from a to be
function randint(a, b) {
    return Math.round( Math.random() * (b - a) + a );
}

// Mock-standard-normally distributed random number
function stdnorm(n) {
    var n = typeof n !== 'undefined' ? n : 20;

    // take n random numbers from U(-0.5,0.5), scaled by _/n/12 to have SD 1
    var arr = Array(n + 1).join(0).split("");
    arr = arr.map( function(){
        return  ( ( Math.random() - 0.5) / Math.sqrt(n / 12)); 
    });

    // Return the mean. By CLF, this function's output is standard normal
    return (arr.reduce(function(a, b) {return a + b}));
}

// Mock normally-distributed random number
function randnorm(mu, theta) {
    return ( stdnorm() * theta ) + mu;
}

// Replacing Color object with tinycolor.js

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
        var re = RegExp('^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$', 'i');
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
        var parsed_hex = parseHex(components);
        if (parsed_hex) {
            this.r = parsed_hex[0];
            this.g = parsed_hex[1];
            this.b = parsed_hex[2];
        } else {
            invalid("unparseable string");
        }
    } else if (typeof components === []) { // Parse array input
        if (areNums(components) && isRgb(components)) {
            this.r = components[0];
            this.g = components[1];
            this.b = components[2];
        } else {
            invalid("Unparseable array");
        }
    } else if (typeof components === typeof 1) { // Parse numeric input
        if (areNums(arguments) && isRgb(arguments)) {
            this.r = arguments[0];
            this.g = arguments[1];
            this.b = arguments[2];
        } else {
            invalid("unparseable positional values");
        }
    } else if (typeof components === 'undefined') { // Parse undefined input
        this.randomise();
    } else {
        invalid('Unparseable input');
    }
   
    this.available = true;
    // Aaaaand we're instantiated.

    // Fake assertion on RGB values
    if ( !this.r || !this.g || !this.b ) {

    }

    this.toHex = function() {
        return "#" + dectohex(this.r) + dectohex(this.g) + dectohex(this.b);
    }

    this.toRgb = function() {
        return [ this.r, this.g, this.b ];
    }

    
}




// Representation methods
// Mixing methods

Color.prototype.mix = function(mixer, proportion) {
    // proportion is the ratio of the mixer color to the original color
    var prop = typeof proportion !== 'undefined' ? proportion : 1;
    if (mixer.hasOwnProperty('r') &&
        mixer.hasOwnProperty('g') &&
        mixer.hasOwnProperty('b')) {
        // Euclidean equidistant centroid, scaled proportionally
        return new Color(
            Math.round ( ( this.r + ( mixer.r * prop ) ) / 2 ),
            Math.round ( ( this.g + ( mixer.g * prop ) ) / 2 ),
            Math.round ( ( this.b + ( mixer.b * prop ) ) / 2 ) 
        );
    }
}

// Produce a pastel shade of this colour
Color.prototype.pastel = function() {
    return this.mix(new Color('#ffffff'));
}




// Control object
// Binds to an svg element

function Dotbox(element, defaults) {

    if (typeof element === 'object') {
        this.element = element;
    } else if (typeof element === typeof "") {
        this.element = document.getElementById(element);
    } else {
        throw "invalid element";
    }

    this.width = Math.round(this.element.getBoundingClientRect().width);
    this.height = Math.round(this.element.getBoundingClientRect().height);

    var self = this;
    // defaults specifies a n object of default attributes for dots
    var defaults = typeof defaults !== 'undefined' ? defaults : {
       "cx"     : function(){ return randnorm(self.width/2, self.width/8) },
       "cy"     : function(){ return randnorm(self.height/2, self.height/8) },
       "r"      : 3,
       "stroke-width" : 0,
       "fill"   : function(){ return tinycolor.random().toHexString() }
    }

    this.makeDot = function(params, func) {
        var ns = this.element.getAttribute('xmlns');
        var params = typeof params !== 'undefined' ? params : defaults;
        var dot = document.createElementNS(ns, 'circle');
        for (var key in params) {
            var value;
            if (typeof params[key] === 'function') {
                value = params[key]();
            } else {
                value = params[key];
            }
            dot.setAttribute(key, value);
        }
        if (typeof func === 'function') { func(dot); }
        this.element.appendChild(dot);
    }

    this.getDot = function(id) {
        return document.getElementById(id);
    }

}
