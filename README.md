[![Build Status][travis-image]][travis-url]
[![Coveralls Status][coveralls-image]][coveralls-url]
[![Dev Dependencies Status][david-image]][david-url]

# browser-cookies
Tiny cookies library for the browser - **under development**

### Features:
  - Clean and easy to use API
  - Small footprint (minified and gzipped ~ 0.5kB)
  - No dependencies
  - RFC6265 compliant
  - Cross browser support
  - Unit tests
  - Supports CommonJS (e.g. Browserify)

### Browser compatibility
Cross browser support is verified on real browsers using automated testing:  
[![Sauce Test Status][saucelabs-image]][saucelabs-url]

### Installation
```javascript
// TODO - probably add to NPM
```

### Usage
```javascript
var cookies = require('browser-cookies');

cookies.set('firstName', 'Lisa');
cookies.set('firstName', 'Lisa', {expires: 365}); // Expires after 1 year
cookies.set('firstName', 'Lisa', {secure: true, domain: 'www.example.org'});

cookies.get('firstName'); // Returns cookie value (or null)

cookies.erase('firstName'); // Removes cookie
```
[More examples](#examples)

### API
method **cookies.set(** name, value [, options] **)**
> Saves a cookie
>- **name**: (string) the name of the cookie to save
>- **value**: (string) the value to save
>- **options**: (object) may contain any of the properties specified in [options](#options) further below. Any unspecified option will use the value configured in **cookies.defaults**.

method **cookies.get(** name **)**
> Returns cookie value, or null if the cookie is not found
> - **name**: (string) the name of the cookie to retrieve

method **cookies.erase(** name [, options] **)**
> Removes a cookie
> - **name**: (string) the name of the cookie to remove
> - **options**: (object) may contain the **domain** and **path** properties specified in [options](#options) further below. Any unspecified option will use the value configured in **cookies.defaults**.

property **cookies.defaults**
> Contains the default configuration for all cookie options specified in [options](#options) further below. May change properties in this object to change the global default.

### Options
Options may be set globally using **cookies.defaults** or passed as function argument, see [API](API) above for details.

| Name     | Type           | Default | Description
|----------|----------------|---------|--------
| expires  | Number or Date | 0       | Number of days until the cookie expires, the cookie will expire at the end of the session if set to 0. Alternatively a [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) object may be passed (e.g: new Date(2018, 3, 27)).
| domain   | String         | ""      | The [domain](http://stackoverflow.com/questions/1062963/how-do-browser-cookie-domains-work) from where the cookie is readable, if not specified the current domain will be used.
| path     | String         | "/"     | The path from where the cookie is readable, the default value of "/" allows the cookie to be readable from each path. Note that the path must be absolute, relative paths are not allowed.
| secure   | Boolean        | false   | If true the cookie will only be transmitted over secure protocols like https.
| httponly | Boolean        | false   | If true the cookie may only be read by the web server. This option may be set to [prevent malicious scripts from accessing cookies](http://blog.codinghorror.com/protecting-your-cookies-httponly/), though not all browsers support this feature yet.

### Examples
Count the number of a visits to a page  
```javascript
var cookies = require('browser-cookies');

// Fetch the number of visits to this page
var visits = cookies.get('count', {expires: 365});
console.log("You've been here " + parseInt(visits) + " times before!");

// Increment the visits counter and store as cookie
cookies.set('count', parseInt(visits) + 1);
```

Any type of string can be stored, an example using JSON:  
```javascript
var cookies = require('browser-cookies');

// Store JSON data
var user = {firstName: 'Sofia', lastName: 'Dueñas'};
cookies.set('user', JSON.stringify(user))

// Retrieve JSON data
var userString = cookies.get('user');
var userObject = JSON.parse(userString);
alert('Hi ' + userObject.firstName);
```

Configure defaults shared by all cookies:  
```javascript
var cookies = require('browser-cookies');

// Override defaults
cookies.defaults.secure = true;
cookies.defaults.expires = 7;

// This cookie will have the 'secure' option enabled and will expire after 7 days
cookies.set('FirstName', 'John')

// This cookie will have the 'secure' option enabled and will expire after 30 days
cookies.set('LastName', 'Smith', {expires: 30})
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
  - Create builds for other loaders (including for those not using a loader)?
  - Add to NPM (and Bower?)
- Cross browser issues:
  - [IE sends cookies to all domains](http://erik.io/blog/2014/03/04/definitive-guide-to-cookie-domains/), perhaps save cookies to all subdomains by default for consistent behavior amongst all browsers? Would need to investigate whether something like window.location.hostname is cross-browser supported though.

### Development
This design goal is to provide to smallest possible size (when minified and gzipped) for the given API, while remaining compliant to RFC6265 and providing cross-browser compatibility and consistency.

License
----
Public domain (UNLICENCE)

[travis-url]: https://travis-ci.org/voltace/browser-cookies
[travis-image]: http://img.shields.io/travis/voltace/browser-cookies.svg

[coveralls-url]: https://coveralls.io/r/voltace/browser-cookies
[coveralls-image]: http://img.shields.io/coveralls/voltace/browser-cookies/master.svg

[david-url]: https://david-dm.org/voltace/browser-cookies#info=devDependencies
[david-image]: https://img.shields.io/david/dev/voltace/browser-cookies.svg

[saucelabs-url]: https://saucelabs.com/u/browser-cookies
[saucelabs-image]: https://saucelabs.com/browser-matrix/browser-cookies.svg
