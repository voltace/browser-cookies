![browser-cookies][logo-url]
# browser-cookies
**Tiny cookies library for the browser**

[![Build Status][travis-image]][travis-url]
[![Coveralls Status][coveralls-image]][coveralls-url]
[![Dev Dependencies Status][david-image]][david-url]

- [Features](#features)
- [Browser compatibility](#browser-compatibility)
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Options](#options)
- [Examples](#examples)

### Features
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
npm install browser-cookies
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
**cookies.set(** `name`, `value` [, `options`] **)**
> Method to save a cookie  
> - **`name`** (string) the name of the cookie to save  
> - **`value`** (string) the value to save  
> - **`options`** (object) may contain any of the properties specified in [options](#options) below. If an option is not specified, the value configured in `cookies.defaults` will be used.

**cookies.get(** `name` **)**
> Method that returns a cookie value, or **null** if the cookie is not found
> - **`name`** (string) the name of the cookie to retrieve

**cookies.erase(** `name` [, `options`] **)**
> Method to remove a cookie
> - **`name`** (string) the name of the cookie to remove
> - **`options`** (object) may contain the `domain` and `path` properties specified in [options](#options) below. If an option is not specified, the value configured in `cookies.defaults` will be used.

**cookies.defaults**
> This object may be used to change the default value of each option specified in [options](#options) below.

### Options
Options may be set globally using `cookies.defaults` or passed as function argument, see the [Examples](#examples) section below and the [API](#api) reference above for details.

| Name       | Type               | Default | Description
|------------|--------------------|---------|--------
| `expires`  | `Number` or `Date` | `0`     | Number of days until the cookie expires, if set to `0` the cookie will expire at the end of the session. Alternatively a [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) object may be passed such as `new Date(2018, 3, 27)`.
| `domain`   | `String`           | `""`    | The [domain](http://stackoverflow.com/questions/1062963/how-do-browser-cookie-domains-work) from where the cookie is readable. If not specified, the current domain will be used.
| `path`     | `String`           | `"/"`   | The path from where the cookie is readable, the default value of `"/"` allows the cookie to be readable from all paths. If set to `""` the cookie will only be readable from the current browser path. <br/><br/> Note that cookies don't support relative paths such as `../../some/path`, paths must be absolute like `/some/path`.
| `secure`   | `Boolean`          | `false` | If true the cookie will only be transmitted over secure protocols like https.
| `httponly` | `Boolean`          | `false` | If true the cookie may only be read by the web server. <br/><br/>This option may be set to [prevent malicious scripts from accessing cookies](http://blog.codinghorror.com/protecting-your-cookies-httponly/), not all browsers support this feature yet.

### Examples
Count the number of a visits to a page:  
```javascript
var cookies = require('browser-cookies');

// Get cookie value
var visits = cookies.get('count');
console.log("You've been here " + parseInt(visits) + " times before!");

// Increment the counter and set (or update) the cookie
cookies.set('count', parseInt(visits) + 1, {expires: 365});
```

JSON may be saved by converting the JSON object into a string:  
```javascript
var cookies = require('browser-cookies');

// Store JSON data
var user = {firstName: 'Sofia', lastName: 'Dueñas'};
cookies.set('user', JSON.stringify(user))

// Retrieve JSON data
var userString = cookies.get('user');
alert('Hi ' + JSON.parse(userString).firstName);
```

The default value of cookie options may be changed:
```javascript
var cookies = require('browser-cookies');

// Override defaults
cookies.defaults.secure = true;
cookies.defaults.expires = 7;

// 'secure' option enabled and cookie expires in 7 days
cookies.set('FirstName', 'John')

// 'secure' option enabled and cookie expires in 30 days
cookies.set('LastName', 'Smith', {expires: 30})
```

### Todo's
- Additional tests:
  - More test cases to verify proper encoding/decoding (stubbed and non-stubbed).
  - More bad weather scenarios.
  - Mobile browser testing (Disabled automated testing for mobile browsers because the results varied per run).
  - Manually verify support on old browsers that that still need to be supported (i.e. IE6)?
- Distribution:
  - Generate downloadable minified file for CommonJS?
  - Create builds for other loaders (AMD?) and for use without a loader.
- Cross browser consistency:
  - When a domain is not specified most browsers only allow an exact domain match, but [IE sends cookies to all subdomains](http://erik.io/blog/2014/03/04/definitive-guide-to-cookie-domains/). Perhaps save cookies to all subdomains by default for consistent behavior amongst all browsers? Would need to investigate whether something like window.location.hostname is cross-browser supported though. Or check how other cookie libs solved this. But first of all need to decide on the desired behavior.

### Development
This design goal is to provide to smallest possible size (when minified and gzipped) for the given API, while remaining compliant to RFC6265 and providing cross-browser compatibility and consistency.

Development setup (requires [node](https://nodejs.org/download/) and [git](https://help.github.com/articles/set-up-git/) to be installed):  
```python
git clone https://github.com/voltace/browser-cookies.git
cd browser-cookies
npm install         # Install dev dependencies
npm run test:local  # Run unit tests locally (takes ~5 seconds)
npm run build       # Create minified version
```

Feel free to add an issue on GitHub for any questions, bug or feature request you may have.

### License
Public Domain ([UNLICENSE](LICENSE))

[logo-url]: https://raw.githubusercontent.com/voltace/browser-cookies/master/browser-cookies.png

[travis-url]: https://travis-ci.org/voltace/browser-cookies
[travis-image]: http://img.shields.io/travis/voltace/browser-cookies.svg

[coveralls-url]: https://coveralls.io/r/voltace/browser-cookies
[coveralls-image]: http://img.shields.io/coveralls/voltace/browser-cookies/master.svg

[david-url]: https://david-dm.org/voltace/browser-cookies#info=devDependencies
[david-image]: https://img.shields.io/david/dev/voltace/browser-cookies.svg

[saucelabs-url]: https://saucelabs.com/u/browser-cookies
[saucelabs-image]: https://saucelabs.com/browser-matrix/browser-cookies.svg
