<img width="425" height="200" src="https://raw.githubusercontent.com/voltace/browser-cookies/master/browser-cookies.png"/>

# browser-cookies
**Tiny cookies library for the browser**

[![NPM Version][npm-version-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-url]
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
Or [run the unit tests][ref-unittests] for your current browser right now.

### Installation
Using NPM  
`npm install browser-cookies`

Using Bower  
`bower install browser-cookies`

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
API contents:
- method [cookies.set(`name`, `value` [, `options`])](#cookies-set)
- method [cookies.get(`name`)](#cookies-get)
- method [cookies.set(`name`, [, `options`])](#cookies-erase)
- property [cookies.defaults](#cookies-defaults)

<hr/>
<a name="cookies-set" href="#cookies-set">**cookies.set(** `name`, `value` [, `options`] **)**</a>  
Method to save a cookie.

| argument      | type   | description
|---------------|--------|------------
| **`name`**    | string | the name of the cookie to save.
| **`value`**   | string | the value to save.
| **`options`** | object | may contain any of the properties specified in [options](#options) below. If an option is not specified, the value configured in [`cookies.defaults`](#cookies-defaults) will be used.


<hr/>
<a name="cookies-get" href="#cookies-get">**cookies.get(** `name` **)**</a>  
Method that returns a cookie value, or **null** if the cookie is not found.

| argument      | type   | description
|---------------|--------|------------
| **`name`**    | string | the name of the cookie to retrieve.


<hr/>
<a name="cookies-erase" href="#cookies-erase">**cookies.erase(** `name` [, `options`] **)**</a>  
Method to remove a cookie.

| argument      | type   | description
|---------------|--------|------------
| **`name`**    | string | the name of the cookie to remove.
| **`options`** | object | may contain the `domain` and `path` properties specified in [options](#options) below. If an option is not specified, the value configured in [`cookies.defaults`](#cookies-defaults) will be used.


<hr/>
<a name="cookies-defaults" href="#cookies-defaults">**cookies.defaults**</a>  
This object may be used to change the default value of each option specified in [options](#options) below.


### Options
Options may be set globally using [`cookies.defaults`](#cookies-defaults) or passed as function argument, see the [Examples](#examples) section below and the [API](#api) reference above for details.

| Name       | Type                       | Default | Description
|------------|----------------------------|---------|--------
| `expires`  | `Number`, `Date`, `String` | `0`     | Configure when the cookie expires by using one of the following types as value:<ul><li>A `Number` of days until the cookie expires. If set to `0` the cookie will expire at the end of the session.</li><li>A `Date` object such as `new Date(2018, 3, 27)`.</li><li>A `String` in a format recognized by [Date.parse()][ref-date-parse].</li></ul>
| `domain`   | `String`                   | `""`    | The [domain][ref-cookie-domain] from where the cookie is readable.<ul><li>If set to `""` the current domain will be used.</li></ul>
| `path`     | `String`                   | `"/"`   | The path from where the cookie is readable.<ul><li>The default value of `"/"` allows the cookie to be readable from all paths.</li><li>If set to `""` the cookie will only be readable from the current browser path.</li><li>Note that cookies don't support relative paths such as `"../../some/path"` so paths must be absolute like `"/some/path"`.</li></ul>
| `secure`   | `Boolean`                  | `false` | If true the cookie will only be transmitted over secure protocols like https.
| `httponly` | `Boolean`                  | `false` | If true the cookie may only be read by the web server.<ul><li> This option may be set to [prevent malicious scripts from accessing cookies][ref-httponly], not all browsers support this feature yet.</li></ul>

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
  - Extend test cases to verify proper cookie name encoding/decoding (stubbed and non-stubbed).
  - More bad weather scenarios.
  - Mobile browser testing (Disabled automated testing for mobile browsers because the results varied per run).
  - Manually verify support on old browsers that that still need to be supported (i.e. IE6)?
- Distribution:
  - Generate build (development build + minified version) for use without a loader.
- Cross browser consistency:
  - When a domain is not specified most browsers only allow an exact domain match, but [IE sends cookies to all subdomains][ref-ie-cookies]. Perhaps save cookies to all subdomains by default for consistent behavior amongst all browsers? Would need to investigate whether something like window.location.hostname is cross-browser supported though. Or check how other cookie libs solved this. But first of all need to decide on the desired behavior.

### Development
This design goal is to provide to smallest possible size (when minified and gzipped) for the given API, while remaining compliant to RFC6265 and providing cross-browser compatibility and consistency.

Development setup (requires [node][ref-node-download] and [git][ref-git-setup] to be installed):  
```python
git clone https://github.com/voltace/browser-cookies.git
cd browser-cookies
npm install         # Install dev dependencies
npm run test:local  # Run unit tests locally (takes ~5 seconds)
npm run build       # Create minified version
```

Feel free to add an issue on GitHub for any questions, bug or feature request you may have.

### License
Public Domain ([UNLICENSE][ref-licence])

<!--- References -->
[ref-cookie-domain]: https://stackoverflow.com/questions/1062963/how-do-browser-cookie-domains-work
[ref-date-parse]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse
[ref-httponly]: http://blog.codinghorror.com/protecting-your-cookies-httponly/
[ref-ie-cookies]: http://erik.io/blog/2014/03/04/definitive-guide-to-cookie-domains/
[ref-node-download]: https://nodejs.org/download/
[ref-git-setup]: https://help.github.com/articles/set-up-git/
[ref-licence]: http://choosealicense.com/licenses/#unlicense
[ref-unittests]: https://rawgit.com/voltace/browser-cookies/master/test/index.html

<!--- Shields -->
[npm-url]: https://npmjs.org/package/browser-cookies
[npm-version-image]: https://img.shields.io/npm/v/browser-cookies.svg
[npm-downloads-image]: https://img.shields.io/npm/dm/browser-cookies.svg

[travis-url]: https://travis-ci.org/voltace/browser-cookies
[travis-image]: https://img.shields.io/travis/voltace/browser-cookies.svg

[coveralls-url]: https://coveralls.io/r/voltace/browser-cookies
[coveralls-image]: https://img.shields.io/coveralls/voltace/browser-cookies/master.svg

[david-url]: https://david-dm.org/voltace/browser-cookies#info=devDependencies
[david-image]: https://img.shields.io/david/dev/voltace/browser-cookies.svg

[saucelabs-url]: https://saucelabs.com/u/browser-cookies
[saucelabs-image]: https://saucelabs.com/browser-matrix/browser-cookies.svg
