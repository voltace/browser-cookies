[![Build Status][travis-image]][travis-url]
[![Coveralls Status][coveralls-image]][coveralls-url]
[![Dev Dependencies Status][david-image]][david-url]

# tiny-cookies
CommonJS cookies library for the browser - **under development**

### Features:
  - A clean and easy to use API.
  - Small footprint (~0.5kb minified and gzipped)
  - RFC6265 compliant
  - Extensive unit test coverage

### Browser compatability
  - Internet Explorer 6+
  - Chrome 34+
  - Firefox 29+
  - Safari 6+
  - Opera 10+
  - Android
  - iOS

### Usage
```javascript
// TODO
```

### API
```javascript
// TODO
```

### Todo's
 - Testing:
   - Add tests cases to verify cookie decoding (currently only testing encoding)
   - Add additional non-stubbed tests cases to verify proper encoding/decoding
   - Add additional bad weather scenarios
   - Add automated cross-browser test (saucelabs?) to verify browser compatility
     - Verify compatibility for even older browsers manually
 - Distribution:
   - Generate downloadable minified file for CommonJS
   - Create builds for other loaders (including for not using a loader)
   - Add to NPM and/or Bower
 - Documentation
   - Add API reference
   - State features/design goals in this readme.md

License
----
Public domain (UNLICENCE)

[travis-url]: https://travis-ci.org/voltace/tiny-cookies
[travis-image]: http://img.shields.io/travis/voltace/tiny-cookies.svg

[coveralls-url]: https://coveralls.io/r/voltace/tiny-cookies
[coveralls-image]: http://img.shields.io/coveralls/voltace/tiny-cookies/master.svg

[david-url]: https://david-dm.org/voltace/tiny-cookies#info=devDependencies
[david-image]: https://img.shields.io/david/dev/voltace/tiny-cookies.svg
