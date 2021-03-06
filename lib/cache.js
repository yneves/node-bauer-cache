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
var mkdirp = require("mkdirp");
var factory = require("bauer-factory");

// - -------------------------------------------------------------------- - //

var Cache = factory.createClass({
  
  // new Cache(options Object) :Cache
  constructor: {
    o: function(options) {
      if (factory.isDefined(options.file)) {
        this.setFile(options.file);
      }
      if (factory.isDefined(options.mkdir)) {
        this.setMakeDir(options.mkdir);
      }
      if (factory.isDefined(options.expires)) {
        this.setExpiration(options.expires);
      }
      if (factory.isDefined(options.json)) {
        this.setJSON(options.json);
      }
    }
  },
  
  setMakeDir: {
    
    // .setMakeDir(mkdir Boolean) :void
    b: function(mkdir) {
      this.mkdir = mkdir;
    }
  },
  
  // .getMakeDir() :Boolean
  getMakeDir: function() {
    return !!this.mkdir;
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
      var filename = options.ext ? options.name + "." + options.ext : options.name;
      this.file = path.resolve(options.dir,filename);
    },
    
    // .setFile(file String) :void
    s: function(file) {
      this.file = path.resolve(file);
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
      if (suffix === "y") {
        multiplier = 365 * 24 * 60 * 60 * 1000;
      } else if (suffix === "w") {
        multiplier = 7 * 24 * 60 * 60 * 1000;
      } else if (suffix === "d") {
        multiplier = 24 * 60 * 60 * 1000;
      } else if (suffix === "h") {
        multiplier = 60 * 60 * 1000;
      } else if (suffix === "m") {
        multiplier = 60 * 1000;
      } else if (suffix === "s") {
        multiplier = 1000;
      }
      this.expires = period * multiplier;
    }
  },
  
  // .getExpiration() :Number
  getExpiration: function() {
    return this.expires;
  },
  
  read: {
    
    // .read() :Readable
    0: function() {
      var file = this.getFile();
      return fs.createReadStream(file);
    },
    
    // .read(callback Function) :void
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
    
    // .write() :Writable
    0: function() {
      var file = this.getFile();
      return fs.createWriteStream(file);
    },
    
    // .write(object Array, callback Function) :void
    af: function(object,callback) {
      var error;
      var content;
      try {
        content = JSON.stringify(object,null,4);
      } catch(e) {
        error = e;
      }
      if (error) {
        callback(error);
      } else {
        this.write(content,callback);
      }
    },
    
    // .write(object Object, callback Function) :void
    of: function(object,callback) {
      var error;
      var content;
      try {
        content = JSON.stringify(object,null,4);
      } catch(e) {
        error = e;
      }
      if (error) {
        callback(error);
      } else {
        this.write(content,callback);
      }
    },
    
    // .write(content String, callback Function) :void
    sf: function(content,callback) {
      var file = this.getFile();
      if (this.getMakeDir()) {
        var dir = path.dirname(file);
        fs.exists(dir,function(exists) {
          if (exists) {
            this._write(file,content,callback);
          } else {
            mkdirp(dir,function(error) {
              if (error) {
                callback(error);
              } else {
                this._write(file,content,callback);
              }
            }.bind(this));
          }
        }.bind(this));
      } else {
        this._write(file,content,callback);
      }
    }
  },
  
  _write: function(file,content,callback) {
    fs.writeFile(file,content,function(error) {
      if (error) {
        callback(error);
      } else {
        callback(null);
      }
    });
  },
  
  remove: {
    
    // .remove(callback Function) :void
    f: function(callback) {
      var file = this.getFile();
      fs.unlink(file,function(error) {
        if (error) {
          callback(error);
        } else {
          callback(null);
        }
      });
    }
  },
  
  exists: {
    
    // .exists(callback Function) :void
    f: function(callback) {
      var file = this.getFile();
      fs.exists(file,function(exists) {
        callback(null,exists);
      });
    }
  },
  
  expired: {
    
    // .expired(callback Function) :void
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
      }.bind(this));
    }
  },
  
  validate: {
    
    // .validate(callback Function) :void
    f: function(callback) {
      if (this.file) {
        this.exists(function(error,exists) {
          if (error) {
             callback(error);
          } else if (exists) {
            this.expired(function(error,expired) {
              if (error) {
                callback(error);
              } else if (expired) {
                callback(null,false);
              } else {
                callback(null,true);
              }
            });
          } else {
            callback(null,false);
          }
        }.bind(this));
      } else {
        callback(new Error("missing filename"));
      }
    }
  }
  
});

// - -------------------------------------------------------------------- - //

module.exports = Cache;

// - -------------------------------------------------------------------- - //
