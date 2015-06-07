// - -------------------------------------------------------------------- - //

"use strict";

var assert = require("assert");
var Cache = require("../");

// - -------------------------------------------------------------------- - //

describe("Cache",function() {

  it("constructor error",function() {
    assert.throws(function() {
      var cache = new Cache();
    },/signature not found/);
  });
  
  it("constructor",function() {
    var cache = new Cache({
      json: true,
      file: {
        dir: __dirname + "/cache",
        ext: "json",
        name: "test"
      },
      expires: 100
    });
    assert.ok(cache instanceof Cache);
  });
  
});

// - -------------------------------------------------------------------- - //
