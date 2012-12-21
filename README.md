flog
====

flog is a light-weight configurable front-end logger that is compatible with
CJS, AMD and script loading. It can be used with node.js as well, but there are
probably more complete solutions such as [Winston](https://npmjs.org/package/winston);
Tested in IE8, IE9, IE10, Chrome, Firefox, Safari, Opera

## install
`npm install flog` or download `flog.js`

## loading
flog can be loaded as: 
- CJS module, which is useful if you use [browserify](https://npmjs.org/package/browserify)
or [webmake](https://npmjs.org/package/webmake) or are using flog with [node.js](http://nodejs.org).
- AMD module with all AMD compatible loaders
- simple script tag adding `flog` to the global namespace

```javascript
// CJS
flog = require('flog');

// AMD
require(['flog'], function (flog) {
})

// script
flog
```

### setting the log level
By default, flog is set to be silent and doesn't output anything. To enable 
logging, you need to set the level:

```javascript
flog.setLevel('info');
```

Possible values include:
- `debug`
- `info`
- `warn`
- `error`
- `quiet`
- `all` - alias for `debug`
- `silent` - alias for `quiet`

### creating an instance
you can use the default flog object but you can also get instances set to
different logging levels:

```javascript
myFlog = flog.create();
myFlog.setLevel('error');
myFlog.info('Hello'); // doesn't output anything
myFlog.warn('Hello'); // doesn't output anything
myFlog.error('Hello'); // 'Hello'
```

### logging methods
- `flog.log()`
- `flog.info()`
- `flog.warn()`
- `flog.error()`
