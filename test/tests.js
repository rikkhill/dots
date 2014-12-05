// Tests for dots.js

// Custom assert for checking if values fall within error margins
QUnit.assert.closeEnough = function(value, expected, margin, message) {
    var diff = Math.abs(value - expected);
    this.push(diff < margin, value, expected, message);
}

function sampleDistribution (func, mean_val, sd_val, iterations) {
    var i, one_sd = 0.0, two_sd = 0.0, three_sd = 0.0, nums = [];
    var iterations = iterations;
    var mean_val = mean_val;
    var sd_val = sd_val;

    for (i in Array(iterations).join(0).split("")) {
        nums.push( func() );
    }

    for (i in nums) {
        if( Math.abs( nums[i] - mean_val ) < (1 * sd_val) ) { one_sd++; }
        if ( Math.abs( nums[i] - mean_val ) < (2 * sd_val) ) { two_sd++; }
        if ( Math.abs( nums[i] - mean_val ) < (3 * sd_val) ) { three_sd++; }
    }

    return {
        mean    : mean(nums),
        sd      : sd(nums),
        one_sd  : one_sd / iterations,
        two_sd  : two_sd / iterations,
        three_sd: three_sd / iterations
    }
}

QUnit.module("Probabilistic Unit Tests")
// Test if random standard normal distribution behaves as expected
QUnit.test( "Random Standard Normal Distribution", function( assert ) {

    var func = function(){ return stdnorm(); }
    var sample = sampleDistribution( func, 0, 1, 10000 );
    assert.closeEnough(sample.one_sd, 0.68, 0.02, "First SD ~ 0.68");
    assert.closeEnough(sample.two_sd, 0.95, 0.02, "Second SD ~ 0.95");
    assert.closeEnough(sample.three_sd, 0.997, 0.02, "Third SD ~ 0.997");

    assert.closeEnough(sample.mean, 0.0, 0.06, "Mean ~ 0");
    assert.closeEnough(sample.sd, 1, 6, "Overall SD ~ 1");
});

// Test if random general normal distribution behaves as expected
QUnit.test('Random Parametrised Normal Distribution', function( assert ) {

    var func = function(){ return randnorm(10, 2.5); }

    var sample = sampleDistribution( func, 10, 2.5, 10000 );

    assert.closeEnough(sample.one_sd, 0.68, 0.02, "First SD ~ 0.68");
    assert.closeEnough(sample.two_sd, 0.95, 0.02, "Second SD ~ 0.95");
    assert.closeEnough(sample.three_sd, 0.997, 0.02, "Third SD ~ 0.997");

    assert.closeEnough(sample.mean, 10.0, 0.06, "Mean ~ 0");
    assert.closeEnough(sample.sd, 2.5, 0.06, "Overall SD ~ 1");
});

QUnit.test('Discrete Distribution Function', function (assert) {
    var params = {
        "a" : {
            func    :   function() { return "a" },
            prop    :   10
        },
        "b" : {
            func    :   function() { return "b" },
            prop    :   20
        },
        "c" : {
            func    :   function() { return "c" },
            prop    :   50
        }
    };

    var dist = discreteDistribution(params);
    var results = {};
    var iterations = 1000;

    for (var i in Array(iterations).join(0).split("")) {
        var res = dist();
        if(results.hasOwnProperty(res)) {
            results[res]++;
        } else {
            results[res] = 1;
        }
    }

    assert.closeEnough(results['a']/iterations, (1/8), 0.05, "Test group 'a' has proportions");
    assert.closeEnough(results['b']/iterations, (2/8), 0.05, "Test group 'b' has proportions");
    assert.closeEnough(results['c']/iterations, (5/8), 0.05, "Test group 'c' has proportions");
});
