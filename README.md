# bauer-cache
Disk-cache library.

## Installation

```
npm install bauer-cache
```

## Usage

```js
var Cache = require("bauer-cache");

var myCache = new Cache({
  file: {
    dir: "./cache",
    name: "filename",
    ext: "json"
  },
  expires: "1d",
  json: true
});

myCache.validate(function(error,isValid) {
  
  if (isValid) {
    
    myCache.read(function(error,data) {
      
    });
    
  } else {
    
    myCache.write({ hello: "world" },function(error) {
      
    });
    
  }
});
```

## API Summary

  * `Cache`
    * `new Cache(options Object) :Cache`
    * `.setJSON(json Boolean) :void`
    * `.isJSON() :Boolean`
    * `.parseJSON(content String, callback Function) :void`
    * `.setFile(options Object) :void`
    * `.setFile(file String) :void`
    * `.getFile() :String`
    * `.setExpiration(time Number) :void`
    * `.setExpiration(expires String) :void`
    * `.getExpiration() :Number`
    * `.read() :Readable`
    * `.read(callback Function) :void`
    * `.write() :Writable`
    * `.write(object Array, callback Function) :void`
    * `.write(object Object, callback Function) :void`
    * `.write(content String, callback Function) :void`
    * `.remove(callback Function) :void`
    * `.exists(callback Function) :void`
    * `.expired(callback Function) :void`
    * `.validate(callback Function) :void`


# License
[MIT](./LICENSE)
