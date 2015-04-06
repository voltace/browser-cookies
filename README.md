[![Build Status][travis-image]][travis-url]
[![Coveralls Status][coveralls-image]][coveralls-url]
[![Dev Dependencies Status][david-image]][david-url]

# tiny-cookies
CommonJS cookies library for the browser - **under development**

### Features:
  - Clean and easy to use API
  - Small footprint (minified and gzipped ~ 0.5kB)
  - No dependencies
  - RFC6265 compliant
  - Extensive unit test coverage

### Browser compatability
A fully automated process verifies cross browser support:  
[![Sauce Test Status][saucelabs-image]][saucelabs-url]

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
  - Extend sauce labs browser test suit to verify a wide range of browsers and platforms
    - Internet Explorer 6+
    - Chrome x+
    - Firefox x+
    - Safari 6+
    - Opera 10+
    - Android x+
    - iOS x+
- Distribution:
  - Generate downloadable minified file for CommonJS
  - Create builds for other loaders (including for not using a loader)
  - Add to NPM and/or Bower
- Documentation
  - Add API reference
  - Add examples (basics, setting defaults, using JSON)
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

[saucelabs-url]: https://saucelabs.com/u/tiny-cookies
[saucelabs-image]: https://saucelabs.com/browser-matrix/tiny-cookies.svg
