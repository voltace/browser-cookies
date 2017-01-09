// Fully stubbed test suite (document.cookie and Date object)
describe("Stubbed Test Suite", function() {
  beforeEach(function() {
    var self = this;

    // Create document.cookie stub
    function documentCookieStub() {
      this.cookie = '';
    }
    this.docStub = new documentCookieStub();

    // Create Date stub
    this.dateStub = function(string) {
      // Create a date in UTC time (to prevent time zone dependent test results)
      if (string !== undefined) {
        var d = new Date(string);
        this.date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds()));
      } else {
        this.date = new Date(Date.UTC(2030, 11, 20, 23, 15, 30, 0)); // 2030-12-20 23:15:30
      }

      // Proxy the Date function
      this.getTime = function() {
        return this.date.getTime();
      };
      this.setTime = function(milliseconds) {
        return this.date.setTime(milliseconds);
      };
      this.toUTCString = function() {
        function pad(n) {
          return n < 10 ? '0' + n : n;
        }

        var date    = this.date;
        var weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        var month   = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        return weekday[date.getUTCDay()] + ', ' +
        pad(date.getUTCDate()) + ' ' + month[date.getUTCMonth()] + ' ' + date.getUTCFullYear() + ' '  +
        pad(date.getUTCHours()) + ':'  + pad(date.getUTCMinutes()) +  ':' + pad(date.getUTCSeconds()) + ' GMT';
      };
    };

    // Create instance of browser-cookies with 'document' and 'Date' stubbed
    this.browsercookies = {};
    requireCookies(this.docStub, this.dateStub, this.browsercookies);
  });

  afterEach(function() {
    //
  });

  it("Get/set/erase basics", function() {
    // Test set
    this.browsercookies.set('banana', 'yellow');
    expect(this.docStub.cookie).toBe('banana=yellow;path=/');

    // Test get
    this.browsercookies.set('banana', 'yellow');
    expect(this.docStub.cookie).toBe('banana=yellow;path=/');

    // Test erase
    this.browsercookies.erase('banana');
    expect(this.docStub.cookie).toBe('banana=;expires=Thu, 19 Dec 2030 23:15:30 GMT;path=/');
  });

  it("Set a cookie using all possible options", function() {
    // Set all options
    var options = {
      expires: 4,
      domain: 'www.test.com',
      path: '/some/path',
      secure: true,
      httponly: true
    };
    this.browsercookies.set('banana', 'yellow', options);

    // All options should have been applied
    expect(this.docStub.cookie).toBe('banana=yellow;expires=Tue, 24 Dec 2030 23:15:30 GMT;domain=www.test.com;path=/some/path;secure;httponly');

    // Original options structure not modified
    expect(options).toEqual({
      expires: 4,
      domain: 'www.test.com',
      path: '/some/path',
      secure: true,
      httponly: true
    });
  });

  it("Set all possible defaults", function() {
    // Set new defaults
    this.browsercookies.defaults = {
      expires: 7,
      domain: 'www.test.com',
      path: '/some/path',
      secure: true,
      httponly: true
    };

    // Set cookie, all default options should be applies
    this.browsercookies.set('banana', 'yellow');
    expect(this.docStub.cookie).toBe('banana=yellow;expires=Fri, 27 Dec 2030 23:15:30 GMT;domain=www.test.com;path=/some/path;secure;httponly');

    // The defaults should not have been modified
    expect(this.browsercookies.defaults).toEqual({
      expires: 7,
      domain: 'www.test.com',
      path: '/some/path',
      secure: true,
      httponly: true
    });
  });

  it("Set empty cookie", function() {
    this.browsercookies.set('banana', '');
    expect(this.docStub.cookie).toBe('banana=;path=/');
  });

  it("Set cookie using using no global defaults at all", function() {
    this.browsercookies.defaults = {};
    this.browsercookies.set('banana', 'yellow');
    expect(this.docStub.cookie).toBe('banana=yellow;path=/');
  });

  it("Set expires option", function() {
    // Set cookie with custom expiration time
    this.browsercookies.set('banana', 'yellow', {expires: 30});
    expect(this.docStub.cookie).toBe('banana=yellow;expires=Sun, 19 Jan 2031 23:15:30 GMT;path=/');

    // Set a default expiration time
    this.browsercookies.defaults.expires = 7;
    this.browsercookies.set('banana', 'yellow');
    expect(this.docStub.cookie).toBe('banana=yellow;expires=Fri, 27 Dec 2030 23:15:30 GMT;path=/');

    // Override the default expiration time using the function option
    this.browsercookies.set('banana', 'yellow', {expires: 14});
    expect(this.docStub.cookie).toBe('banana=yellow;expires=Fri, 03 Jan 2031 23:15:30 GMT;path=/');
  });

  it("Verify erase options are applied", function() {
    // Erase cookie with all available options
    this.browsercookies.erase('banana', {domain: 'example.org', path: '/a/path'});
    expect(this.docStub.cookie).toBe('banana=;expires=Thu, 19 Dec 2030 23:15:30 GMT;domain=example.org;path=/a/path');

    // Erase cookie with only the path set
    this.browsercookies.erase('banana', {path: '/a/path'});
    expect(this.docStub.cookie).toBe('banana=;expires=Thu, 19 Dec 2030 23:15:30 GMT;path=/a/path');

    // Erase cookie with only the domain set
    this.browsercookies.erase('banana', {domain: 'example.org'});
    expect(this.docStub.cookie).toBe('banana=;expires=Thu, 19 Dec 2030 23:15:30 GMT;domain=example.org;path=/');

  });

  it("Verify erase doesn't apply default configuration", function() {
    // Set some defaults
    this.browsercookies.defaults = {
      expires: 7,
      domain: 'default.example.org',
      path: '/default/path',
      secure: true,
      httponly: true
    };

    // Erase cookie should apply the domain and path specified in the defaults  above
    this.browsercookies.erase('banana');
    expect(this.docStub.cookie).toBe('banana=;expires=Thu, 19 Dec 2030 23:15:30 GMT;domain=default.example.org;path=/default/path');

    // Erase cookie with specified domain and path overrules the defaults
    this.browsercookies.erase('banana', {domain: 'other.example.org', path: '/other/path'});
    expect(this.docStub.cookie).toBe('banana=;expires=Thu, 19 Dec 2030 23:15:30 GMT;domain=other.example.org;path=/other/path');

    // All options besides domain and path should be ignored
    this.browsercookies.erase('banana', {domain: 'other.example.org', path: '/other/path', expires: 100, secure: true, httponly: true});
    expect(this.docStub.cookie).toBe('banana=;expires=Thu, 19 Dec 2030 23:15:30 GMT;domain=other.example.org;path=/other/path');
  });


  it("Verify all allowed formats for the 'expires' option", function() {
    // Verify usage of Date() format
    this.browsercookies.set('banana', 'yellow', {expires: new Date(2030, 11, 20)});
    expect(this.docStub.cookie.replace('GMT', 'UTC'))
    .toBe(('banana=yellow;expires=' + new Date(2030, 11, 20).toUTCString().replace('GMT', 'UTC') + ';path=/'));

    // Verify usage of integer format (days till expiration)
    this.browsercookies.set('banana', 'yellow', {expires: 5});
    expect(this.docStub.cookie).toBe('banana=yellow;expires=Wed, 25 Dec 2030 23:15:30 GMT;path=/');

    // Verify usage of float format (set to one and a half day)
    this.browsercookies.set('banana', 'yellow', {expires: 1.5});
    expect(this.docStub.cookie).toBe('banana=yellow;expires=Sun, 22 Dec 2030 11:15:30 GMT;path=/');

    // Verify usage of string format (in a format recognized by Date.parse() )
    this.browsercookies.set('banana', 'yellow', {expires: '01/08/2031'});
    var expectedDate = (new this.dateStub('01/08/2031')).toUTCString();
    expect(this.docStub.cookie).toBe('banana=yellow;expires=' + expectedDate + ';path=/');

    // Verify date may be set to unix epoch
    this.browsercookies.set('banana', 'yellow', {expires: new Date(0)});
    expectedDate = (new this.dateStub(0)).toUTCString();
    expect(this.docStub.cookie).toBe('banana=yellow;expires=' + expectedDate + ';path=/');
  });

  it("Verify unsupported formats for the 'expires' option are ignored", function() {
    this.browsercookies.set('banana', 'yellow', {expires: 'anInvalidDateString'});
    expect(this.docStub.cookie).toBe('banana=yellow;path=/');

    this.browsercookies.set('banana', 'yellow', {expires: ['an', 'array']});
    expect(this.docStub.cookie).toBe('banana=yellow;path=/');

    this.browsercookies.set('banana', 'yellow', {expires: NaN});
    expect(this.docStub.cookie).toBe('banana=yellow;path=/');

    this.browsercookies.set('banana', 'yellow', {expires: null});
    expect(this.docStub.cookie).toBe('banana=yellow;path=/');
  });

  it("Set domain option", function() {
    // Set cookie with custom domain
    this.browsercookies.set('banana', 'yellow', {domain: 'www.test.com'});
    expect(this.docStub.cookie).toBe('banana=yellow;domain=www.test.com;path=/');

    // Set a default domain
    this.browsercookies.defaults.domain = 'default.domain.com';
    this.browsercookies.set('banana', 'yellow');
    expect(this.docStub.cookie).toBe('banana=yellow;domain=default.domain.com;path=/');

    // Override the default domain using the function option
    this.browsercookies.set('banana', 'yellow', {domain: 'override.domain.com'});
    expect(this.docStub.cookie).toBe('banana=yellow;domain=override.domain.com;path=/');
  });

  it("Set path option", function() {
    // Path defaults to '/'
    this.browsercookies.set('banana', 'yellow');
    expect(this.docStub.cookie).toBe('banana=yellow;path=/');

    // Set cookie with custom path
    this.browsercookies.set('banana', 'yellow', {path: '/some/path'});
    expect(this.docStub.cookie).toBe('banana=yellow;path=/some/path');

    // Set cookie with an empty path (the browser will use the current path)
    this.browsercookies.set('banana', 'yellow', {path: ''});
    expect(this.docStub.cookie).toBe('banana=yellow');

    // Change the default path
    this.browsercookies.defaults.path = '/a/default/path';
    this.browsercookies.set('banana', 'yellow');
    expect(this.docStub.cookie).toBe('banana=yellow;path=/a/default/path');

    // Override the default path using the function option
    this.browsercookies.set('banana', 'yellow', {path: '/override/path'});
    expect(this.docStub.cookie).toBe('banana=yellow;path=/override/path');

    // Default path may set set to ''
    this.browsercookies.defaults.path = '';
    this.browsercookies.set('banana', 'yellow');
    expect(this.docStub.cookie).toBe('banana=yellow');
  });

  it("Set secure option", function() {
    // Set cookie with the secure option
    this.browsercookies.set('banana', 'yellow', {secure: true});
    expect(this.docStub.cookie).toBe('banana=yellow;path=/;secure');

    // Set cookie without the secure option
    this.browsercookies.set('banana', 'yellow', {secure: false});
    expect(this.docStub.cookie).toBe('banana=yellow;path=/');

    // Change the default to true
    this.browsercookies.defaults.secure = true;
    this.browsercookies.set('banana', 'yellow');
    expect(this.docStub.cookie).toBe('banana=yellow;path=/;secure');

    // Override the default to false using the function option
    this.browsercookies.set('banana', 'yellow', {secure: false});
    expect(this.docStub.cookie).toBe('banana=yellow;path=/');

    // Change the default to false
    this.browsercookies.defaults.secure = false;
    this.browsercookies.set('banana', 'yellow');
    expect(this.docStub.cookie).toBe('banana=yellow;path=/');

    // Override the default to true using the function option
    this.browsercookies.set('banana', 'yellow', {secure: true});
    expect(this.docStub.cookie).toBe('banana=yellow;path=/;secure');
  });

  it("Set httponly option", function() {
    // Set cookie with the httponly option
    this.browsercookies.set('banana', 'yellow', {httponly: true});
    expect(this.docStub.cookie).toBe('banana=yellow;path=/;httponly');

    // Set cookie without the httponly option
    this.browsercookies.set('banana', 'yellow', {httponly: false});
    expect(this.docStub.cookie).toBe('banana=yellow;path=/');

    // Change the default to true
    this.browsercookies.defaults.httponly = true;
    this.browsercookies.set('banana', 'yellow');
    expect(this.docStub.cookie).toBe('banana=yellow;path=/;httponly');

    // Override the default to false using the function option
    this.browsercookies.set('banana', 'yellow', {httponly: false});
    expect(this.docStub.cookie).toBe('banana=yellow;path=/');

    // Change the default to false
    this.browsercookies.defaults.httponly = false;
    this.browsercookies.set('banana', 'yellow');
    expect(this.docStub.cookie).toBe('banana=yellow;path=/');

    // Override the default to true using the function option
    this.browsercookies.set('banana', 'yellow', {httponly: true});
    expect(this.docStub.cookie).toBe('banana=yellow;path=/;httponly');
  });

  it("Verify cookie name encoding", function() {
    // Should apply URI encoding
    this.browsercookies.set('báñâñâ', 'yellow');
    expect(this.docStub.cookie).toBe('b%C3%A1%C3%B1%C3%A2%C3%B1%C3%A2=yellow;path=/');

    // rfc6265 specifies a cookie name is of the `token` type as defined in rfc2616:
    //   token          = 1*<any CHAR except CTLs or separators>
    //   separators     = "(" | ")" | "<" | ">" | "@"
    //                  | "," | ";" | ":" | "\" | <">
    //                  | "/" | "[" | "]" | "?" | "="
    //                  | "{" | "}" | SP | HT
    //
    //  Note that a CHAR is defined as any US-ASCII character (octets 0 - 127)
    var separators = {
      '('  : '%28',
      ')'  : '%29',
      '<'  : '%3C',
      '>'  : '%3E',
      '@'  : '%40',
      ','  : '%2C',
      ';'  : '%3B',
      ':'  : '%3A',
      '\\' : '%5C',
      '\"' : '%22',
      '/'  : '%2F',
      '['  : '%5B',
      ']'  : '%5D',
      '?'  : '%3F',
      '='  : '%3D',
      '{'  : '%7B',
      '}'  : '%7D',
      ' '  : '%20',
      '\t' : '%09'
    };

    // Check whether all separators are encoded
    for (var separator in separators) {
      this.browsercookies.set('cookie' + separator, 'value');
      expect(this.docStub.cookie).toBe('cookie' + separators[separator] + '=value;path=/');
    }

    // Check whether CTLs are encoded
    this.browsercookies.set('\x10', 'value'); expect(this.docStub.cookie).toBe('%10=value;path=/');
    this.browsercookies.set('\x7F', 'value'); expect(this.docStub.cookie).toBe('%7F=value;path=/');

    // The '%' sign should be encoded as it's used as prefix for percentage encoding
    this.browsercookies.set('%', 'value'); expect(this.docStub.cookie).toBe('%25=value;path=/');

    // Check whether all US-ASCII CHARS except for separators and CTLs are encoded
    for (var i = 0; i < 256; i++) {
      var ascii = String.fromCharCode(i);

      // Skip CTLs, the % sign and separators
      if (i < 32 || i >= 127 || ascii == '%' || separators.hasOwnProperty(ascii)) {
        continue;
      }

      this.browsercookies.set('cookie' + ascii, 'value');
      expect(this.docStub.cookie).toBe('cookie' + ascii + '=value;path=/');
    }
  });

  it("Verify cookie name decoding", function() {
    this.docStub.cookie = 'b%C3%A1%C3%B1%C3%A2%C3%B1%C3%A2=yellow';
    expect(this.browsercookies.get('báñâñâ')).toBe('yellow');
  });

  it("Verify cookie name parsing using whitespace", function() {
    // Without whitespace
    this.docStub.cookie = 'a=1;b=2;c=3';
    expect(this.browsercookies.get('a')).toBe('1');
    expect(this.browsercookies.get('b')).toBe('2');
    expect(this.browsercookies.get('c')).toBe('3');

    // With leading whitespace
    this.docStub.cookie = 'a=1; b=2;c=3';
    expect(this.browsercookies.get('a')).toBe('1');
    expect(this.browsercookies.get('b')).toBe('2');
    expect(this.browsercookies.get('c')).toBe('3');
  });

  it("Verify cookie value encoding", function() {
    // Should apply URI encoding
    this.browsercookies.set('banana', '¿yéllów?');
    expect(this.docStub.cookie).toBe('banana=%C2%BFy%C3%A9ll%C3%B3w?;path=/');

    // Should not modify the original value
    var value = '¿yéllów?';
    this.browsercookies.set('banana', value);
    expect(this.docStub.cookie).toBe('banana=%C2%BFy%C3%A9ll%C3%B3w?;path=/');
    expect(value).toBe('¿yéllów?');

    // RFC 6265 (http://tools.ietf.org/html/rfc6265) is the 'real world' cookies specification.
    // The specification allows the following subset of ASCII characters to be unescaped:
    //     hex    : dec   : ASCII
    //     0x21   : 33    : !
    this.browsercookies.set('a', '!'); expect(this.docStub.cookie).toBe('a=!;path=/');
    //     0x23-2B: 35-43 : #$%&'()*+    (note that % should be encoded because it's the prefix for percent encoding)
    this.browsercookies.set('b', '#$%&\'()*+'); expect(this.docStub.cookie).toBe('b=#$%25&\'()*+;path=/');
    //     0x2D-3A: 45-58 : -./0123456789:
    this.browsercookies.set('c', '-./0123456789:'); expect(this.docStub.cookie).toBe('c=-./0123456789:;path=/');
    //     0x3C-5B: 60-91 : <=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[
    this.browsercookies.set('d', '<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ['); expect(this.docStub.cookie).toBe('d=<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[;path=/');
    //     0x5D-7E: 93-126: ]^_`abcdefghijklmnopqrstuvwxyz{|}~
    this.browsercookies.set('e', ']^_`abcdefghijklmnopqrstuvwxyz{|}~'); expect(this.docStub.cookie).toBe('e=]^_`abcdefghijklmnopqrstuvwxyz{|}~;path=/');

    // Now check the inverse of above: whether remaining character ranges are percent encoded (they should be)
    this.browsercookies.set('f_CTL',        '\x10'); expect(this.docStub.cookie).toBe('f_CTL=%10;path=/');
    this.browsercookies.set('f_whitespace', ' '   ); expect(this.docStub.cookie).toBe('f_whitespace=%20;path=/');
    this.browsercookies.set('f_DQUOTE',     '"'   ); expect(this.docStub.cookie).toBe('f_DQUOTE=%22;path=/');
    this.browsercookies.set('f_comma',      ','   ); expect(this.docStub.cookie).toBe('f_comma=%2C;path=/');
    this.browsercookies.set('f_semicolon',  ';'   ); expect(this.docStub.cookie).toBe('f_semicolon=%3B;path=/');
    this.browsercookies.set('f_backslash',  '\\'  ); expect(this.docStub.cookie).toBe('f_backslash=%5C;path=/');
    this.browsercookies.set('f_CTL2',       '\x7F'); expect(this.docStub.cookie).toBe('f_CTL2=%7F;path=/');
  });

  it("Verify retrieval of all cookies", function() {
    // @TODO this is a silly test because the document stub is broken
    this.browsercookies.set('a', '1');
    var all = this.browsercookies.all();
    expect(all.a).toBe('1');
  });

  describe("Verify compatibility with PHP server side", function() {
    it("Using PHP setcookie() - doesn't encode the plus sign properly", function() {
      // PHP output was generated using PHP 5.5
      // http://php.net/manual/en/function.setcookie.php

      // <?php setcookie('banana', '¿yéllów?'); ?>
      this.docStub.cookie = 'banana=%C2%BFy%C3%A9ll%C3%B3w%3F';
      expect(this.browsercookies.get('banana')).toBe('¿yéllów?');

      // <?php setcookie('a', '!#$%&\'()*+-./0123456789:'); ?>
      this.docStub.cookie = 'a=%21%23%24%25%26%27%28%29%2A%2B-.%2F0123456789%3A';
      expect(this.browsercookies.get('a')).toBe('!#$%&\'()*+-./0123456789:');

      // <?php setcookie('b', '<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ['); ?>
      this.docStub.cookie = 'b=%3C%3D%3E%3F%40ABCDEFGHIJKLMNOPQRSTUVWXYZ%5B';
      expect(this.browsercookies.get('b')).toBe('<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[');

      // <?php setcookie('c', ']^_`abcdefghijklmnopqrstuvwxyz{|}~'); ?>
      this.docStub.cookie = 'c=%5D%5E_%60abcdefghijklmnopqrstuvwxyz%7B%7C%7D%7E';
      expect(this.browsercookies.get('c')).toBe(']^_`abcdefghijklmnopqrstuvwxyz{|}~');

      // <?php setcookie('f', "\x10"); ?>
      this.docStub.cookie = 'f=%10';
      expect(this.browsercookies.get('f')).toBe('\x10');

      // <?php setcookie('f', " "); ?>
      this.docStub.cookie = 'f=+';
      expect(this.browsercookies.get('f')).toBe('+'); // Note: should have been ' ' instead of '+'

      // <?php setcookie('f', '"'); ?>
      this.docStub.cookie = 'f=%22';
      expect(this.browsercookies.get('f')).toBe('"');

      // <?php setcookie('f', ","); ?>
      this.docStub.cookie = 'f=%2C';
      expect(this.browsercookies.get('f')).toBe(',');

      // <?php setcookie('f', ";"); ?>
      this.docStub.cookie = 'f=%3B';
      expect(this.browsercookies.get('f')).toBe(';');

      // <?php setcookie('f', "\\"); ?>
      this.docStub.cookie = 'f=%5C';
      expect(this.browsercookies.get('f')).toBe('\\');

      // <?php setcookie('f', "\x7F"); ?>
      this.docStub.cookie = 'f=%7F';
      expect(this.browsercookies.get('f')).toBe('\x7F');

      // PHP cookie array notation
      // <?php setcookie('cookie[one]', "1"); ?>
      // <?php setcookie('cookie[two]', "2"); ?>
      this.docStub.cookie = 'cookie[one]=1; cookie[two]=2';
      expect(this.browsercookies.get('cookie[one]')).toBe('1');
      expect(this.browsercookies.get('cookie[two]')).toBe('2');

      // PHP will overwrite existing cookies (which is the correct behavior)
      // <?php setcookie('c', "1"); ?>
      // <?php setcookie('c', "2"); ?>
      this.docStub.cookie = 'c=2';
      expect(this.browsercookies.get('c')).toBe('2');
    });

    it("Using PHP setrawcookie() and rawurlencode", function() {
      // PHP output was generated using PHP 5.5
      // http://php.net/manual/en/function.setcookie.php
      // http://php.net/manual/en/function.rawurlencode.php

      // <?php setrawcookie('banana', rawurlencode('¿yéllów?')); ?>
      this.docStub.cookie = 'banana=%C2%BFy%C3%A9ll%C3%B3w%3F';
      expect(this.browsercookies.get('banana')).toBe('¿yéllów?');

      // <?php setrawcookie('a', rawurlencode('!#$%&\'()*+-./0123456789:')); ?>
      this.docStub.cookie = 'a=%21%23%24%25%26%27%28%29%2A%2B-.%2F0123456789%3A';
      expect(this.browsercookies.get('a')).toBe('!#$%&\'()*+-./0123456789:');

      // <?php setrawcookie('b', rawurlencode('<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[')); ?>
      this.docStub.cookie = 'b=%3C%3D%3E%3F%40ABCDEFGHIJKLMNOPQRSTUVWXYZ%5B';
      expect(this.browsercookies.get('b')).toBe('<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[');

      // <?php setrawcookie('c', rawurlencode(']^_`abcdefghijklmnopqrstuvwxyz{|}~')); ?>
      this.docStub.cookie = 'c=%5D%5E_%60abcdefghijklmnopqrstuvwxyz%7B%7C%7D~';
      expect(this.browsercookies.get('c')).toBe(']^_`abcdefghijklmnopqrstuvwxyz{|}~');

      // <?php setrawcookie('f', rawurlencode("\x10")); ?>
      this.docStub.cookie = 'f=%10';
      expect(this.browsercookies.get('f')).toBe('\x10');

      // <?php setrawcookie('f', rawurlencode(' ')); ?>
      this.docStub.cookie = 'f=%20';
      expect(this.browsercookies.get('f')).toBe(' ');

      // <?php setrawcookie('f', rawurlencode('"')); ?>
      this.docStub.cookie = 'f=%22';
      expect(this.browsercookies.get('f')).toBe('"');

      // <?php setrawcookie('f', rawurlencode(',')); ?>
      this.docStub.cookie = 'f=%2C';
      expect(this.browsercookies.get('f')).toBe(',');

      // <?php setrawcookie('f', rawurlencode(';')); ?>
      this.docStub.cookie = 'f=%3B';
      expect(this.browsercookies.get('f')).toBe(';');

      // <?php setrawcookie('f', rawurlencode("\\")); ?>
      this.docStub.cookie = 'f=%5C';
      expect(this.browsercookies.get('f')).toBe('\\');

      // <?php setrawcookie('f', rawurlencode("\x7F")); ?>
      this.docStub.cookie = 'f=%7F';
      expect(this.browsercookies.get('f')).toBe('\x7F');

      // PHP cookie array notation
      // <?php setrawcookie('cookie[one]', rawurlencode("1")); ?>
      // <?php setrawcookie('cookie[two]', rawurlencode("2")); ?>
      this.docStub.cookie = 'cookie[one]=1; cookie[two]=2';
      expect(this.browsercookies.get('cookie[one]')).toBe('1');
      expect(this.browsercookies.get('cookie[two]')).toBe('2');

      // PHP will overwrite existing cookies (which is the correct behavior)
      // <?php setrawcookie('c', rawurlencode('1')); ?>
      // <?php setrawcookie('c', rawurlencode('2')); ?>
      this.docStub.cookie = 'c=2';
      expect(this.browsercookies.get('c')).toBe('2');
    });
  });
});





// Test cases to be executed using an actual browser
describe("Browser-based Test Suite", function() {
  beforeEach(function() {
    // Create non stubbed instance of browser-cookies
    this.browsercookies = {};
    requireCookies(document, Date, this.browsercookies);
  });

  afterEach(function() {
    // Remove 'banana' cookies
    var cookies = ['banana', 'b%C3%A1%C3%B1%C3%A2%C3%B1%C3%A2', 'a', 'b', 'c', 'd', 'e', 'f'];
    for (var i = 0; i < cookies.length; i++) {
      document.cookie = cookies[i] + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
    }
  });

  it("Get/set/erase basics", function() {
    // Test get (when no cookie has been set)
    expect(this.browsercookies.get('banana')).toBe(null);

    // Test set
    this.browsercookies.set('banana', 'yellow');
    expect(this.browsercookies.get('banana')).toBe('yellow');

    // Test erase
    this.browsercookies.erase('banana');
    expect(this.browsercookies.get('banana')).toBe(null);
  });

  it("Get/set/erase cookie using expire option", function() {
    // Test get (when no cookie has been set)
    expect(this.browsercookies.get('banana')).toBe(null);

    // Test set with the expires option set
    this.browsercookies.set('banana', 'yellow', {expires: 100});
    expect(this.browsercookies.get('banana')).toBe('yellow');

    // Test erase
    this.browsercookies.erase('banana');
    expect(this.browsercookies.get('banana')).toBe(null);
  });

  it("Set cookie using all possible options", function() {
    this.browsercookies.set('banana', 'yellow', {
      expires: 30,
      domain: 'www.test.com',
      path: '/some/path',
      secure: true,
      httponly: true
    });
    // Note that the cookie won't be set because the domain/path/secure options are
    // not correct for the PhantomJS session
    expect(this.browsercookies.get('banana')).toBe(null);
  });

  it("Set empty cookie", function() {
    this.browsercookies.set('banana', '');
    expect(this.browsercookies.get('banana')).toBe('');
  });

  it("Erase non-existing cookie", function() {
    // Shouldn't raise any error
    expect(this.browsercookies.erase('orange')).toBe(undefined);
  });

  it("Verify cookie name encoding and decoding", function() {
    this.browsercookies.set('báñâñâ', 'yellow');
    expect(this.browsercookies.get('báñâñâ')).toBe('yellow');

    // Check whether all US-ASCII CHARS are identical before encoding and after decoding
    for (var i = 0; i < 256; i++) {
      var name = 'cookie' + String.fromCharCode(i);

      // Set cookie
      this.browsercookies.set(name, 'value');

      // Get cookie
      expect(this.browsercookies.get(name)).toBe('value');

      // Erase cookie
      this.browsercookies.erase(name);
      expect(this.browsercookies.get(name)).toBe(null);
    }
  });

  it("Verify cookie value encoding and decoding", function() {
    // Should apply URI encoding
    this.browsercookies.set('banana', '¿yéllów?');
    expect(this.browsercookies.get('banana')).toBe('¿yéllów?');

    // Should not modify the original value
    var value = '¿yéllów?';
    this.browsercookies.set('banana', value);
    expect(this.browsercookies.get('banana')).toBe('¿yéllów?');
    expect(value).toBe('¿yéllów?');

    // Check whether all characters allowed to be escaped by rfc6265 are identical before encoding and after decoding
    this.browsercookies.set('a', '!');                                  expect(this.browsercookies.get('a')).toBe('!');
    this.browsercookies.set('b', '#$%&\'()*+');                         expect(this.browsercookies.get('b')).toBe('#$%&\'()*+');
    this.browsercookies.set('c', '-./0123456789:');                     expect(this.browsercookies.get('c')).toBe('-./0123456789:');
    this.browsercookies.set('d', '<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[');   expect(this.browsercookies.get('d')).toBe('<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[');
    this.browsercookies.set('e', ']^_`abcdefghijklmnopqrstuvwxyz{|}~'); expect(this.browsercookies.get('e')).toBe(']^_`abcdefghijklmnopqrstuvwxyz{|}~');

    // Check whether all characters that must be escaped by rfc6265 are identical before encoding and after decoding
    this.browsercookies.set('f', '\x10'); expect(this.browsercookies.get('f')).toBe('\x10');
    this.browsercookies.set('f', ' '   ); expect(this.browsercookies.get('f')).toBe(' '   );
    this.browsercookies.set('f', '"'   ); expect(this.browsercookies.get('f')).toBe('"'   );
    this.browsercookies.set('f', ','   ); expect(this.browsercookies.get('f')).toBe(','   );
    this.browsercookies.set('f', ';'   ); expect(this.browsercookies.get('f')).toBe(';'   );
    this.browsercookies.set('f', '\\'  ); expect(this.browsercookies.get('f')).toBe('\\'  );
    this.browsercookies.set('f', '\x7F'); expect(this.browsercookies.get('f')).toBe('\x7F');
  });

  it("Verify retrieval of multiple cookies", function() {
    this.browsercookies.set('a', '1');
    this.browsercookies.set('b', '2');
    this.browsercookies.set('c', '3');
    expect(this.browsercookies.get('a')).toBe('1');
    expect(this.browsercookies.get('b')).toBe('2');
    expect(this.browsercookies.get('c')).toBe('3');
  });

  it("Verify retrieval of multiple cookies using separators in the value", function() {
    this.browsercookies.set('a', '=1=');
    this.browsercookies.set('b', ':2:');
    this.browsercookies.set('c', ';3;');
    expect(this.browsercookies.get('a')).toBe('=1=');
    expect(this.browsercookies.get('b')).toBe(':2:');
    expect(this.browsercookies.get('c')).toBe(';3;');
  });
});
