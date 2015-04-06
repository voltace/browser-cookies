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

Additional options may be passed when setting a cookie:  
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

### Options
Options may be passed as optional argument to cookies.set(name, value [], options]) method. Defaults may be set in the property cookies.defaults.

| Name     | Type           | Default | Description
|----------|----------------|---------|--------
| expires  | Number or Date | 0       | Number of days until the cookie expires, the cookie will expire at the end of the session if set to 0. Alternatively a [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) object may be passed (e.g: new Date(2018, 3, 27)).
| domain   | String         | ""      | The domain from where the cookie is readable, if not specified the current domain will be used.
| path     | String         | "/"     | The path from where the cookie is readable, the default value of "/" allows the cookie to be readable from each path. Note that the path must be absolute, relative paths are not allowed.
| secure   | Boolean        | false   | If true the cookie will only be transmitted over secure protocols like https.
| httponly | Boolean        | false   | If true the cookie may only be read by the webserver. This option may be set to [prevent malicious scripts from accessing cookies](http://blog.codinghorror.com/protecting-your-cookies-httponly/), though not all browsers support this feature yet.

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
- Cross browser issues:
  - [IE sends cookies to all domains](http://erik.io/blog/2014/03/04/definitive-guide-to-cookie-domains/), perhaps make this the default for consistent behavior amongst all browsers? Would need to investigate whether something like

### Development
This design goal is to provide to smallest possible size (when minified and gzipped) for the given API, while remaining compliant to RFC6265 and providing cross-browser compatibility and consistency.

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
