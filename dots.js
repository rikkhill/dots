// dots.js
// A library for making svg coloured dots


// Moments
function mean(values){
  return values.reduce(function(a, b){ return a + b; }, 0) / values.length;
}

function sd(values){
  var avg = mean(values);
  var squareDiffs = values.map(function(value){
    return Math.pow( value - avg, 2 );
  });
  
  return Math.sqrt(mean(squareDiffs));
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

// Take a map of functions and proportions and return a function that
// returns the result of those functions in those proportions
function discreteDistribution(params) {
    var total = 0;
    var function_map = {};

    for (var i in params) {
        total += params[i].prop;
        function_map[total] = params[i].func;
    }

    return function() { 
        var num = Math.random() * total;
        for (var i in function_map) {
            if (num < i) {
                return function_map[i]();
                break;
            }
        }
    }
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
        //var params = typeof params !== 'undefined' ? params : defaults;
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
        // Add default values if they're not there
        for (var key in defaults) {
            if(!params.hasOwnProperty(key)) {
                var value;
                if (typeof defaults[key] === 'function') {
                    value = defaults[key]();
                } else {
                    value = defaults[key];
                }
                dot.setAttribute(key, value);
            }
        }

        if (typeof func === 'function') { func(dot); }
        this.element.appendChild(dot);
    }

    this.getDot = function(id) {
        return document.getElementById(id);
    }
}
