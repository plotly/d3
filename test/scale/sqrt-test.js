var vows = require("vows"),
    load = require("../load"),
    assert = require("../assert");

var suite = vows.describe("d3.scale.sqrt");

suite.addBatch({
  "sqrt": {
    topic: load("scale/sqrt", "interpolate/hsl"), // beware instanceof d3_Color

    "domain": {
      "defaults to [0, 1]": function(d3) {
        var x = d3.scale.sqrt();
        assert.deepEqual(x.domain(), [0, 1]);
        assert.inDelta(x(0.5), 0.7071068, 1e-6);
      },
      "coerces domain to numbers": function(d3) {
        var x = d3.scale.sqrt().domain([new Date(1990, 0, 1), new Date(1991, 0, 1)]);
        assert.equal(typeof x.domain()[0], "number");
        assert.equal(typeof x.domain()[1], "number");
        assert.inDelta(x(new Date(1989, 09, 20)), -0.2, 1e-2);
        assert.inDelta(x(new Date(1990, 00, 01)), 0, 1e-2);
        assert.inDelta(x(new Date(1990, 02, 15)), 0.2, 1e-2);
        assert.inDelta(x(new Date(1990, 04, 27)), 0.4, 1e-2);
        assert.inDelta(x(new Date(1991, 00, 01)), 1, 1e-2);
        assert.inDelta(x(new Date(1991, 02, 15)), 1.2, 1e-2);
        var x = d3.scale.sqrt().domain(["0", "1"]);
        assert.equal(typeof x.domain()[0], "number");
        assert.equal(typeof x.domain()[1], "number");
        assert.inDelta(x(0.5), 0.7071068, 1e-6);
        var x = d3.scale.sqrt().domain([new Number(0), new Number(1)]);
        assert.equal(typeof x.domain()[0], "number");
        assert.equal(typeof x.domain()[1], "number");
        assert.inDelta(x(0.5), 0.7071068, 1e-6);
      },
      "can specify a polypower domain and range": function(d3) {
        var x = d3.scale.sqrt().domain([-10, 0, 100]).range(["red", "white", "green"]);
        assert.equal(x(-5), "#ff4b4b");
        assert.equal(x(50), "#4ba54b");
        assert.equal(x(75), "#229122");
      },
      "preserves specified domain exactly, with no floating point error": function(d3) {
        var x = d3.scale.sqrt().domain([0, 5]);
        assert.deepEqual(x.domain(), [0, 5]);
      }
    },

    "range": {
      "defaults to [0, 1]": function(d3) {
        var x = d3.scale.sqrt();
        assert.deepEqual(x.range(), [0, 1]);
        assert.inDelta(x.invert(0.5), 0.25, 1e-6);
      },
      "does not coerce range to numbers": function(d3) {
        var x = d3.scale.sqrt().range(["0", "2"]);
        assert.equal(typeof x.range()[0], "string");
        assert.equal(typeof x.range()[1], "string");
      },
      "coerces range value to number on invert": function(d3) {
        var x = d3.scale.sqrt().range(["0", "2"]);
        assert.inDelta(x.invert("1"), 0.25, 1e-6);
        var x = d3.scale.sqrt().range([new Date(1990, 0, 1), new Date(1991, 0, 1)]);
        assert.inDelta(x.invert(new Date(1990, 6, 2, 13)), 0.25, 1e-6);
        var x = d3.scale.sqrt().range(["#000", "#fff"]);
        assert.isNaN(x.invert("#999"));
      },
      "can specify range values as colors": function(d3) {
        var x = d3.scale.sqrt().range(["red", "blue"]);
        assert.equal(x(0.25), "#800080");
        var x = d3.scale.sqrt().range(["#ff0000", "#0000ff"]);
        assert.equal(x(0.25), "#800080");
        var x = d3.scale.sqrt().range(["#f00", "#00f"]);
        assert.equal(x(0.25), "#800080");
        var x = d3.scale.sqrt().range([d3.rgb(255,0,0), d3.hsl(240,1,0.5)]);
        assert.equal(x(0.25), "#800080");
        var x = d3.scale.sqrt().range(["hsl(0,100%,50%)", "hsl(240,100%,50%)"]);
        assert.equal(x(0.25), "#800080");
      },
      "can specify range values as arrays or objects": function(d3) {
        var x = d3.scale.sqrt().range([{color: "red"}, {color: "blue"}]);
        assert.deepEqual(x(0.25), {color: "#800080"});
        var x = d3.scale.sqrt().range([["red"], ["blue"]]);
        assert.deepEqual(x(0.25), ["#800080"]);
      }
    },

    "exponent": {
      "defaults to 0.5": function(d3) {
        var x = d3.scale.sqrt();
        assert.equal(x.exponent(), 0.5);
      },
      "observes the specified exponent": function(d3) {
        var x = d3.scale.sqrt().exponent(0.5).domain([1, 2]);
        assert.inDelta(x(1), 0, 1e-6);
        assert.inDelta(x(1.5), 0.5425821, 1e-6);
        assert.inDelta(x(2), 1, 1e-6);
        var x = d3.scale.sqrt().exponent(2).domain([1, 2]);
        assert.inDelta(x(1), 0, 1e-6);
        assert.inDelta(x(1.5), 0.41666667, 1e-6);
        assert.inDelta(x(2), 1, 1e-6);
        var x = d3.scale.sqrt().exponent(-1).domain([1, 2]);
        assert.inDelta(x(1), 0, 1e-6);
        assert.inDelta(x(1.5), 0.6666667, 1e-6);
        assert.inDelta(x(2), 1, 1e-6);
      }
    },

    "interpolate": {
      "defaults to d3.interpolate": function(d3) {
        var x = d3.scale.sqrt().range(["red", "blue"]);
        assert.equal(x.interpolate(), d3.interpolate);
        assert.equal(x(0.5), "#4b00b4");
      },
      "can specify a custom interpolator": function(d3) {
        var x = d3.scale.sqrt().range(["red", "blue"]).interpolate(d3.interpolateHsl);
        assert.equal(x(0.25), "#ff00ff");
      }
    },

    "clamp": {
      "defaults to false": function(d3) {
        var x = d3.scale.sqrt();
        assert.isFalse(x.clamp());
        assert.inDelta(x(-0.5), -0.7071068, 1e-6);
        assert.inDelta(x(1.5), 1.22474487, 1e-6);
      },
      "can clamp to the domain": function(d3) {
        var x = d3.scale.sqrt().clamp(true);
        assert.inDelta(x(-0.5), 0, 1e-6);
        assert.inDelta(x(0.25), 0.5, 1e-6);
        assert.inDelta(x(1.5), 1, 1e-6);
        var x = d3.scale.sqrt().domain([1, 0]).clamp(true);
        assert.inDelta(x(-0.5), 1, 1e-6);
        assert.inDelta(x(0.25), 0.5, 1e-6);
        assert.inDelta(x(1.5), 0, 1e-6);
      }
    },

    "maps a number to a number": function(d3) {
      var x = d3.scale.sqrt().domain([1, 2]);
      assert.inDelta(x(0.5), -0.7071068, 1e-6);
      assert.inDelta(x(1), 0, 1e-6);
      assert.inDelta(x(1.5), 0.5425821, 1e-6);
      assert.inDelta(x(2), 1, 1e-6);
      assert.inDelta(x(2.5), 1.4029932, 1e-6);
    },

    "ticks": {
      "can generate ticks of varying degree": function(d3) {
        var x = d3.scale.sqrt();
        assert.deepEqual(x.ticks(1).map(x.tickFormat(1)), [0, 1]);
        assert.deepEqual(x.ticks(2).map(x.tickFormat(2)), [0, 0.5, 1]);
        assert.deepEqual(x.ticks(5).map(x.tickFormat(5)), [0, 0.2, 0.4, 0.6, 0.8, 1]);
        assert.deepEqual(x.ticks(10).map(x.tickFormat(10)), [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]);
        var x = d3.scale.sqrt().domain([1, 0]);
        assert.deepEqual(x.ticks(1).map(x.tickFormat(1)), [0, 1]);
        assert.deepEqual(x.ticks(2).map(x.tickFormat(2)), [0, 0.5, 1]);
        assert.deepEqual(x.ticks(5).map(x.tickFormat(5)), [0, 0.2, 0.4, 0.6, 0.8, 1]);
        assert.deepEqual(x.ticks(10).map(x.tickFormat(10)), [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]);
      }
    },

    "tickFormat": {
      "if count is not specified, defaults to 10": function(d3) {
        var x = d3.scale.sqrt();
        assert.strictEqual(x.tickFormat()(Math.PI), "3.1");
        assert.strictEqual(x.tickFormat(1)(Math.PI), "3");
        assert.strictEqual(x.tickFormat(10)(Math.PI), "3.1");
        assert.strictEqual(x.tickFormat(100)(Math.PI), "3.14");
      }
    },

    "nice": {
      "preserves specified domain exactly, with no floating point error": function(d3) {
        var x = d3.scale.sqrt().domain([0, 5]).nice();
        assert.deepEqual(x.domain(), [0, 5]);
      }
    },

    "copy": {
      "changes to the domain are isolated": function(d3) {
        var x = d3.scale.sqrt(), y = x.copy();
        x.domain([1, 2]);
        assert.deepEqual(y.domain(), [0, 1]);
        assert.equal(x(1), 0);
        assert.equal(y(1), 1);
        y.domain([2, 3]);
        assert.equal(x(2), 1);
        assert.equal(y(2), 0);
        assert.inDelta(x.domain(), [1, 2], 1e-6);
        assert.inDelta(y.domain(), [2, 3], 1e-6);
      },
      "changes to the range are isolated": function(d3) {
        var x = d3.scale.sqrt(), y = x.copy();
        x.range([1, 2]);
        assert.equal(x.invert(1), 0);
        assert.equal(y.invert(1), 1);
        assert.deepEqual(y.range(), [0, 1]);
        y.range([2, 3]);
        assert.equal(x.invert(2), 1);
        assert.equal(y.invert(2), 0);
        assert.deepEqual(x.range(), [1, 2]);
        assert.deepEqual(y.range(), [2, 3]);
      },
      "changes to the exponent are isolated": function(d3) {
        var x = d3.scale.sqrt().exponent(2), y = x.copy();
        x.exponent(0.5);
        assert.inDelta(x(0.5), Math.SQRT1_2, 1e-6);
        assert.inDelta(y(0.5), 0.25, 1e-6);
        assert.equal(x.exponent(), 0.5);
        assert.equal(y.exponent(), 2);
        y.exponent(3);
        assert.inDelta(x(0.5), Math.SQRT1_2, 1e-6);
        assert.inDelta(y(0.5), 0.125, 1e-6);
        assert.equal(x.exponent(), 0.5);
        assert.equal(y.exponent(), 3);
      },
      "changes to the interpolator are isolated": function(d3) {
        var x = d3.scale.sqrt().range(["red", "blue"]), y = x.copy();
        x.interpolate(d3.interpolateHsl);
        assert.equal(x(0.5), "#9500ff");
        assert.equal(y(0.5), "#4b00b4");
        assert.equal(y.interpolate(), d3.interpolate);
      },
      "changes to clamping are isolated": function(d3) {
        var x = d3.scale.sqrt().clamp(true), y = x.copy();
        x.clamp(false);
        assert.equal(x(2), Math.SQRT2);
        assert.equal(y(2), 1);
        assert.isTrue(y.clamp());
        y.clamp(false);
        assert.equal(x(2), Math.SQRT2);
        assert.equal(y(2), Math.SQRT2);
        assert.isFalse(x.clamp());
      }
    }
  }
});

suite.export(module);
