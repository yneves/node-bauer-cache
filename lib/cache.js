/*!
**  bauer-cache -- Disk-cache library.
**  Copyright (c) 2015 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/node-bauer-cache>
*/
// - -------------------------------------------------------------------- - //

"use strict";

var fs = require("fs");
var path = require("path");
var factory = require("bauer-factory");

// - -------------------------------------------------------------------- - //

var Cache = factory.createClass({
  
  // new Cache(options Object) :Cache
  constructor: {
    o: function(options) {
      if (factory.isDefined(options.file)) {
        this.setFile(options.file);
      }
      if (factory.isDefined(options.expires)) {
        this.setExpiration(options.expires);
      }
      if (factory.isDefined(options.json)) {
        this.setJSON(options.json);
      }
    }
  },
  
  setJSON: {
    
    // .setJSON(json Boolean) :void
    b: function(isJSON) {
      this.json = isJSON;
    }
  },
  
  // .isJSON() :Boolean
  isJSON: function() {
    return this.json;
  },
  
  parseJSON: {
    
    // .parseJSON(content String, callback Function) :void
    sf: function(content,callback) {
      var error;
      var object;
      try {
        object = JSON.parse(content);
      } catch(e) {
        error = e;
      }
      if (error) {
        callback(error);
      } else {
        callback(null,object);
      }
    }
  },
  
  setFile: {
    
    // .setFile(options Object) :void
    o: function(options) {
      if (!factory.isString(options.dir)) {
        throw new Error("invalid directory");
      }
      if (!factory.isString(options.name)) {
        throw new Error("invalid name");
      }
      if (!factory.isString(options.ext)) {
        throw new Error("invalid extension");
      }
      this.file = path.resolve(options.dir,options.name + "." + options.ext);
    },
    
    // .setFile(file String) :void
    s: function() {
      this.file = path.resolve(this.file);
    }
  },
  
  // .getFile() :String
  getFile: function() {
    return this.file;
  },
  
  setExpiration: {
    
    // .setExpiration(time Number) :void
    n: function(time) {
      this.expires = time;
    },
    
    // .setExpiration(expires String) :void
    s: function(expires) {
      var period = parseInt(expires.substr(0,expires.length - 1));
      var suffix = expires.substr(-1,1);
      var multiplier = 0;
      if (suffix == "d") {
        multiplier = 24 * 60 * 60 * 1000;
      } else if (suffix == "w") {
        multiplier = 7 * 24 * 60 * 60 * 1000;
      } else if (suffix == "h") {
        multiplier = 60 * 60 * 1000;
      }
      this.expires = period * multiplier;
    }
  },
  
  // .getExpiration() :Number
  getExpiration: function() {
    return this.expires;
  },
  
  // .read(callback Function) :void
  read: {
    f: function(callback) {
      var file = this.getFile();
      fs.readFile(file,function(error,buffer) {
        if (error) {
          callback(error);
        } else {
          var content = buffer.toString();
          if (this.isJSON()) {
            this.parseJSON(content,callback);
          } else {
            callback(null,content);
          }
        }
      }.bind(this));
    }
  },
  
  write: {
    
    // .write(object Object, callback Function) :void
    of: function(object,callback) {
      var content = JSON.stringify(object,null,4);
      this.write(content,callback);
    },
    
    // .write(content String, callback Function) :void
    sf: function(content,callback) {
      var file = this.getFile();
      fs.writeFile(file,content,function(error) {
        if (error) {
          callback(error);
        } else {
          callback(null);
        }
      });
    }
  },
  
  // .exists(callback Function) :void
  exists: {
    f: function(callback) {
      var file = this.getFile();
      fs.exists(file,function(exists) {
        callback(null,exists);
      });
    }
  },
  
  // .expired(callback Function) :void
  expired: {
    f: function(callback) {
      var file = this.getFile();
      fs.stat(file,function(error,stats) {
        if (error) {
          callback(error);
        } else {
          var now = new Date().getTime();
          var mtime = stats.mtime.getTime();
          var expires = this.getExpiration();
          var expired = mtime < (now - expires);
          callback(null,expired);
        }
      });
    }
  }
  
});

// - -------------------------------------------------------------------- - //

module.exports = Cache;

// - -------------------------------------------------------------------- - //