// Tests for dots.js

// Custom assert for checking if values fall within error margins
QUnit.assert.closeEnough = function(value, expected, margin, message) {
    var diff = Math.abs(value - expected);
    this.push(diff < margin, value, expected, message);
}

function sampleDistribution (func, mean, sd, iterations) {
    var i, one_sd = 0.0, two_sd = 0.0, three_sd = 0.0, nums = [];
    var iterations = iterations;
    var mean = mean;
    var sd = sd;

    for (i in Array(iterations).join(0).split("")) {
        nums.push( func() );
    }

    for (i in nums) {
        if( Math.abs( nums[i] - mean ) < (1 * sd) ) { one_sd++; }
        if ( Math.abs( nums[i] - mean ) < (2 * sd) ) { two_sd++; }
        if ( Math.abs( nums[i] - mean ) < (3 * sd) ) { three_sd++; }
    }

    return {
        mean    : average(nums),
        sd      : standardDeviation(nums),
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
