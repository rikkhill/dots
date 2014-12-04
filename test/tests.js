// Tests for dots.js

QUnit.test( "OK test", function( assert ) {
    assert.ok( 1 == 1, "True is true");
});

QUnit.test( "Random Normal Distribution", function( assert ) {

    var i, one_sd = 0.0, two_sd = 0.0, three_sd = 0.0, nums = [];

    var mean = 0;
    var sd = 1;

    for (i in Array(10000).join(0).split("")) {
        nums.push( stdnorm() );
    }

    for (i in nums) {
        if( Math.abs( nums[i] - mean ) < (1 * sd) ) { one_sd++; }
        else if ( Math.abs( nums[i] - mean ) < (2 * sd) ) { two_sd++; }
        else if ( Math.abs( nums[i] - mean ) < (3 * sd) ) { three_sd++; }
    }

    ok(true, one_sd/10000);
    console.log("1sd", one_sd/10000)
    ok(true, two_sd/10000);
    console.log("2sd", two_sd/10000);
    ok(true, three_sd/10000);
    console.log("3sd", three_sd/10000);

});
