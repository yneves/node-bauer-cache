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

# License
[MIT](./LICENSE)
