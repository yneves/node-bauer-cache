# node-bauer-cache
Disk-cache library.

# Usage

```
npm install bauer-cache
```

```js
var Cache = require("bauer-cache");
```

## new Cache(options Object)

```js
var cache = new Cache({
  json: true,
  file: "./cache.json",
  expires: "1h"
});
```

## .write(content String|Object, callback Function)

```js
cache.write({ key: "value" },function(error) {
  
});
```

## .read(callback Function)

```js
cache.read(function(error,data) {
  
});
```

## .exists(callback Function)

```js
cache.exists(function(error,exists) {
  if (exists) {
    
  }
});
```

## .expired(callback Function)

```js
cache.expired(function(error,expired) {
  if (expired) {
    
  }
});
```

# License
[MIT](./LICENSE)
