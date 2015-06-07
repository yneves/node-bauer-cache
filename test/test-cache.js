// - -------------------------------------------------------------------- - //

"use strict";

var fs = require("fs");
var assert = require("assert");
var Cache = require("../");

var options = {
  json: true,
  file: {
    dir: __dirname,
    ext: "json",
    name: "test"
  },
  expires: 900
};

// - -------------------------------------------------------------------- - //

describe("Cache",function() {
  
  afterEach(function(done) {
    fs.unlink(__dirname + "/test.json",function() {
      done();
    });
  });
  
  beforeEach(function(done) {
    fs.unlink(__dirname + "/test.json",function() {
      done();
    });
  });

  it("constructor error",function() {
    assert.throws(function() {
      var cache = new Cache();
    },/signature not found/);
  });
  
  it("constructor",function() {
    var cache = new Cache(options);
    assert.ok(cache instanceof Cache);
  });
  
  it("expiration strings",function() {
    var cache = new Cache(options);
    cache.setExpiration("1m");
    assert.strictEqual(cache.getExpiration(),60 * 1000);
    cache.setExpiration("10d");
    assert.strictEqual(cache.getExpiration(),10 * 24 * 60 * 60 * 1000);
    cache.setExpiration("2w");
    assert.strictEqual(cache.getExpiration(),14 * 24 * 60 * 60 * 1000);
    cache.setExpiration("3h");
    assert.strictEqual(cache.getExpiration(),3 * 60 * 60 * 1000);
  });
  
  it("exists",function(done) {
    var cache = new Cache(options);
    cache.exists(function(error,exists) {
      assert.strictEqual(error,null);
      assert.strictEqual(exists,false);
      done();
    });
  });
  
  it("write",function(done) {
    var cache = new Cache(options);
    cache.write({ test: true },function(error) {
      assert.strictEqual(error,null);
      var data = JSON.parse(fs.readFileSync(__dirname + "/test.json","utf8"));
      assert.deepEqual(data,{ test: true });
      done();
    });
  });
  
  it("read",function(done) {
    var cache = new Cache(options);
    cache.write({ test: true },function(error) {
      assert.strictEqual(error,null);
      cache.read(function(error,data) {
        assert.strictEqual(error,null);
        assert.deepEqual(data,{ test: true });
        done();
      });
    });
  });
  
  it("not expired",function(done) {
    var cache = new Cache(options);
    cache.write({ test: true },function(error) {
      assert.strictEqual(error,null);
      cache.expired(function(error,expired) {
        assert.strictEqual(error,null);
        assert.strictEqual(expired,false);
        done();
      });
    });
  });
  
  it("expired error",function(done) {
    var cache = new Cache(options);
    cache.expired(function(error) {
      assert.strictEqual(error.code,"ENOENT");
      done();
    });
  });
  
  it("expired",function(done) {
    var cache = new Cache(options);
    cache.write({ test: true },function(error) {
      assert.strictEqual(error,null);
      setTimeout(function() {
        cache.expired(function(error,expired) {
          assert.strictEqual(error,null);
          assert.strictEqual(expired,true);
          done();
        });
      },options.expires + 100);
    });
  });
  
});

// - -------------------------------------------------------------------- - //
