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
    this.browsercookies.set('banana', 'yellow', {expires: new Date(2030, 12, 20)});
    expect(this.docStub.cookie).toBe('banana=yellow;expires=' + new Date(2030, 12, 20).toUTCString() + ';path=/');

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
  });

  it("Verify cookie name decoding", function() {
    this.docStub.cookie = 'b%C3%A1%C3%B1%C3%A2%C3%B1%C3%A2=yellow;path=/';
    expect(this.browsercookies.get('báñâñâ')).toBe('yellow');
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
});





// Basic regression test cases to be executed using an actual browser (PhantomJS)
describe("Browser-based Test Suite", function() {
  beforeEach(function() {
    // Create non stubbed instance of browser-cookies
    this.browsercookies = {};
    requireCookies(document, Date, this.browsercookies);
  });

  afterEach(function() {
    // Remove 'banana' cookies
    document.cookie = 'banana=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
    document.cookie = 'b%C3%A1%C3%B1%C3%A2%C3%B1%C3%A2=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
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

  it("Erase non-existing cookie", function() {
    // Shouldn't raise any error
    expect(this.browsercookies.erase('orange')).toBe(undefined);
  });

  it("Verify cookie name encoding and decoding", function() {
    this.browsercookies.set('báñâñâ', 'yellow');
    expect(this.browsercookies.get('báñâñâ')).toBe('yellow');

    // FIXME check all allowed characters according to the 'token' spec in:
    // http://tools.ietf.org/html/rfc2616#section-2.2

    // FIXME leading and trailing spaces should also be removed?
  });
});
