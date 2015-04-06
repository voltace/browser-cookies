[![Build Status][travis-image]][travis-url]
[![Coveralls Status][coveralls-image]][coveralls-url]
[![Dev Dependencies Status][david-image]][david-url]

# tiny-cookies
Cookies library for the browser - **under development**

### Features:
  - Clean and easy to use API
  - Small footprint (minified and gzipped ~ 0.5kB)
  - No dependencies
  - RFC6265 compliant
  - Cross browser support
  - Unit tests
  - Supports CommonJS (e.g. Browserify)

### Browser compatability
Cross browser support is verified on real browsers using automated testing:  
[![Sauce Test Status][saucelabs-image]][saucelabs-url]

### Installation
```javascript
// TODO
```

### Examples
Count the number of a visits to a page
```javascript
var cookies = require('tiny-cookies');

// Fetch the number of visits to this page
var visits = cookies.get('visits-counter');
console.log("You've been here " + parseInt(visits) + " times before!");

// Increment the visits counter and store as cookie
cookies.set('visits-counter', parseInt(visits) + 1);
```

Any type of string can be stored, an example using JSON:  
```javascript
var cookies = require('tiny-cookies');
// Store JSON data
var user = {firstName: 'Sofia', lastName: 'Dueñas'};
cookies.set('user', JSON.stringify(user))

// Retrieve JSON data
var userString = cookies.get('user');
var userObject = JSON.parse(userString);
alert('Hi ' + userObject.firstName);
```

Additional options may be specified:  
```javascript
var cookies = require('tiny-cookies');

// Set cookie to expire after 1 year (by default it expires at the end of the browser session)
cookies.set('FirstName', 'John', {expires: 365})

// Limit cookie a specific domain, and enable the 'secure' and 'httponly' option
cookies.set('LastName', 'Smith', {domain: 'www.example.org', secure: true, httponly: true});
```

Default values may be set for each option:  
```javascript
var cookies = require('tiny-cookies');

// Set global defaults
cookies.defaults.secure = true;
cookies.defaults.expires = 7;

// This cookie will have to 'secure' option enabled and will expire after 7 days
cookies.set('FirstName', 'John')

// This cookie will have to 'secure' option enabled and will expire after 30 days
cookies.set('LastName', 'Smith', {expires: 30})
```

### API
```javascript
// TODO
```

### Todo's
- Testing:
  - Add additional tests cases to verify proper encoding/decoding
  - Add additional bad weather scenarios
  - Extend sauce labs browser test suite to verify a wide range of browsers and platforms
    - Internet Explorer 6+
    - Chrome x+
    - Firefox x+
    - Safari 6+
    - Opera 10+
    - Android x+
    - iOS x+
- Distribution:
  - Generate downloadable minified file for CommonJS?
  - Create builds for other loaders (including for not using a loader)?
  - Add to NPM and/or Bower
- Documentation
  - Add API reference

### Development
This design goal is to provide to smallest possible size (when minified and gzipped) for the given API, while remaining compliant to RFC6265 and cross-browser compatible.

Creating issues on GitHub is encouraged!


License
----
Public domain (UNLICENCE)

[travis-url]: https://travis-ci.org/voltace/tiny-cookies
[travis-image]: http://img.shields.io/travis/voltace/tiny-cookies.svg

[coveralls-url]: https://coveralls.io/r/voltace/tiny-cookies
[coveralls-image]: http://img.shields.io/coveralls/voltace/tiny-cookies/master.svg

[david-url]: https://david-dm.org/voltace/tiny-cookies#info=devDependencies
[david-image]: https://img.shields.io/david/dev/voltace/tiny-cookies.svg

[saucelabs-url]: https://saucelabs.com/u/tiny-cookies
[saucelabs-image]: https://saucelabs.com/browser-matrix/tiny-cookies.svg
