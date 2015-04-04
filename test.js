// Fully stubbed test suite (document.cookie and Date object)
describe("Stubbed Test Suite", function() {
  beforeEach(function() {
    var self = this;

    // Define document.cookie stub
    this.cookie = '';
    this.documentCookieStub = {
      val : '',
      get cookie () {
        return self.cookie;
      },
      set cookie(val) {
        self.cookie = val;
      }
    };
    var dateStub = function(string) {
      this.date = string !== undefined ? new Date(string) : new Date(2030, 12, 31, 23, 59, 59, 1234);
      this.getTime = function() {
        return this.date.getTime();
      };
      this.setTime = function(milliseconds) {
        return this.date.setTime(milliseconds);
      };
      this.toUTCString = function() {
        return this.date.toUTCString();
      };
    };

    // Create instance of tinycookies with 'document' and 'Date' stubbed
    this.tinycookies = {};
    requireTinyCookies(this.documentCookieStub, dateStub, this.tinycookies);
  });

  afterEach(function() {
    //
  });

  it("Get/set/erase basics", function() {
    // Test set
    this.tinycookies.set('banana', 'yellow');
    expect(this.cookie).toBe('banana=yellow;path=/');

    // Test get
    this.tinycookies.set('banana', 'yellow');
    expect(this.cookie).toBe('banana=yellow;path=/');

    // Test erase
    this.tinycookies.erase('banana');
    expect(this.cookie).toBe('banana=;expires=Thu, 30 Jan 2031 19:13:20 GMT;path=/');
  });

  it("Set a cookie using all possible options", function() {
    // Set all options
    var options = {
      expires: 4400,
      domain: 'www.test.com',
      path: '/some/path',
      secure: true,
      httponly: true
    };
    this.tinycookies.set('banana', 'yellow', options);

    // All options should have been applied
    expect(this.cookie).toBe('banana=yellow;expires=Sat, 01 Feb 2031 00:13:20 GMT;domain=www.test.com;path=/some/path;secure;httponly');

    // Original options structure not modified
    expect(options).toEqual({
      expires: 4400,
      domain: 'www.test.com',
      path: '/some/path',
      secure: true,
      httponly: true
    });
  });

  it("Set all possible defaults", function() {
    // Set new defaults
    this.tinycookies.defaults = {
      expires: 3600,
      domain: 'www.test.com',
      path: '/some/path',
      secure: true,
      httponly: true
    };

    // Set cookie, all default options should be applies
    this.tinycookies.set('banana', 'yellow');
    expect(this.cookie).toBe('banana=yellow;expires=Sat, 01 Feb 2031 00:00:00 GMT;domain=www.test.com;path=/some/path;secure;httponly');

    // The defaults should not have been modified
    expect(this.tinycookies.defaults).toEqual({
      expires: 3600,
      domain: 'www.test.com',
      path: '/some/path',
      secure: true,
      httponly: true
    });
  });

  it("Using no defaults at all", function() {
    this.tinycookies.defaults = {};
    this.tinycookies.set('banana', 'yellow');
    expect(this.cookie).toBe('banana=yellow;path=/');
  });

  it("Set expires option", function() {
    // Set cookie with custom expiration time
    this.tinycookies.set('banana', 'yellow', {expires: 3600});
    expect(this.cookie).toBe('banana=yellow;expires=Sat, 01 Feb 2031 00:00:00 GMT;path=/');

    // Set a default expiration time
    this.tinycookies.defaults.expires = 1800;
    this.tinycookies.set('banana', 'yellow');
    expect(this.cookie).toBe('banana=yellow;expires=Fri, 31 Jan 2031 23:30:00 GMT;path=/');

    // Override the default expiration time using the function option
    this.tinycookies.set('banana', 'yellow', {expires: 7200});
    expect(this.cookie).toBe('banana=yellow;expires=Sat, 01 Feb 2031 01:00:00 GMT;path=/');
  });

  it("Verify all allowed formats for the 'expires' option", function() {
    // Verify usage of Date() format
    this.tinycookies.set('banana', 'yellow', {expires: new Date(2030, 12, 20)});
    expect(this.cookie).toBe('banana=yellow;expires=Sun, 19 Jan 2031 23:00:00 GMT;path=/');

    // Verify usage of integer format (seconds till expiration)
    this.tinycookies.set('banana', 'yellow', {expires: 12345});
    expect(this.cookie).toBe('banana=yellow;expires=Sat, 01 Feb 2031 02:25:45 GMT;path=/');

    // Verify usage of string format (in a format recognized by Date.parse() )
    this.tinycookies.set('banana', 'yellow', {expires: '01/08/2031'});
    expect(this.cookie).toBe('banana=yellow;expires=Tue, 07 Jan 2031 23:00:00 GMT;path=/');
  });

  it("Verify unsupported formats for the 'expires' option are ignored", function() {
    this.tinycookies.set('banana', 'yellow', {expires: 'anInvalidDateString'});
    expect(this.cookie).toBe('banana=yellow;path=/');

    this.tinycookies.set('banana', 'yellow', {expires: ['an', 'array']});
    expect(this.cookie).toBe('banana=yellow;path=/');

    this.tinycookies.set('banana', 'yellow', {expires: NaN});
    expect(this.cookie).toBe('banana=yellow;path=/');

    this.tinycookies.set('banana', 'yellow', {expires: null});
    expect(this.cookie).toBe('banana=yellow;path=/');
  });

  it("Set domain option", function() {
    // Set cookie with custom domain
    this.tinycookies.set('banana', 'yellow', {domain: 'www.test.com'});
    expect(this.cookie).toBe('banana=yellow;domain=www.test.com;path=/');

    // Set a default domain
    this.tinycookies.defaults.domain = 'default.domain.com';
    this.tinycookies.set('banana', 'yellow');
    expect(this.cookie).toBe('banana=yellow;domain=default.domain.com;path=/');

    // Override the default domain using the function option
    this.tinycookies.set('banana', 'yellow', {domain: 'override.domain.com'});
    expect(this.cookie).toBe('banana=yellow;domain=override.domain.com;path=/');
  });

  it("Set path option", function() {
    // Path defaults to '/'
    this.tinycookies.set('banana', 'yellow');
    expect(this.cookie).toBe('banana=yellow;path=/');

    // Set cookie with custom path
    this.tinycookies.set('banana', 'yellow', {path: '/some/path'});
    expect(this.cookie).toBe('banana=yellow;path=/some/path');

    // Change the default path
    this.tinycookies.defaults.path = '/a/default/path';
    this.tinycookies.set('banana', 'yellow');
    expect(this.cookie).toBe('banana=yellow;path=/a/default/path');

    // Override the default path using the function option
    this.tinycookies.set('banana', 'yellow', {path: '/override/path'});
    expect(this.cookie).toBe('banana=yellow;path=/override/path');
  });

  it("Set secure option", function() {
    // Set cookie with the secure option
    this.tinycookies.set('banana', 'yellow', {secure: true});
    expect(this.cookie).toBe('banana=yellow;path=/;secure');

    // Set cookie without the secure option
    this.tinycookies.set('banana', 'yellow', {secure: false});
    expect(this.cookie).toBe('banana=yellow;path=/');

    // Change the default to true
    this.tinycookies.defaults.secure = true;
    this.tinycookies.set('banana', 'yellow');
    expect(this.cookie).toBe('banana=yellow;path=/;secure');

    // Override the default to false using the function option
    this.tinycookies.set('banana', 'yellow', {secure: false});
    expect(this.cookie).toBe('banana=yellow;path=/');

    // Change the default to false
    this.tinycookies.defaults.secure = false;
    this.tinycookies.set('banana', 'yellow');
    expect(this.cookie).toBe('banana=yellow;path=/');

    // Override the default to true using the function option
    this.tinycookies.set('banana', 'yellow', {secure: true});
    expect(this.cookie).toBe('banana=yellow;path=/;secure');
  });

  it("Set httponly option", function() {
    // Set cookie with the httponly option
    this.tinycookies.set('banana', 'yellow', {httponly: true});
    expect(this.cookie).toBe('banana=yellow;path=/;httponly');

    // Set cookie without the httponly option
    this.tinycookies.set('banana', 'yellow', {httponly: false});
    expect(this.cookie).toBe('banana=yellow;path=/');

    // Change the default to true
    this.tinycookies.defaults.httponly = true;
    this.tinycookies.set('banana', 'yellow');
    expect(this.cookie).toBe('banana=yellow;path=/;httponly');

    // Override the default to false using the function option
    this.tinycookies.set('banana', 'yellow', {httponly: false});
    expect(this.cookie).toBe('banana=yellow;path=/');

    // Change the default to false
    this.tinycookies.defaults.httponly = false;
    this.tinycookies.set('banana', 'yellow');
    expect(this.cookie).toBe('banana=yellow;path=/');

    // Override the default to true using the function option
    this.tinycookies.set('banana', 'yellow', {httponly: true});
    expect(this.cookie).toBe('banana=yellow;path=/;httponly');
  });

  it("Verify cookie name encoding", function() {
    // Should apply URI encoding
    this.tinycookies.set('báñâñâ', 'yellow');
    expect(this.cookie).toBe('b%C3%A1%C3%B1%C3%A2%C3%B1%C3%A2=yellow;path=/');
  });

  it("Verify cookie value encoding", function() {
    // Should apply URI encoding
    this.tinycookies.set('banana', '¿yéllów?');
    expect(this.cookie).toBe('banana=%C2%BFy%C3%A9ll%C3%B3w?;path=/');

    // Should not modify the original value
    var value = '¿yéllów?';
    this.tinycookies.set('banana', value);
    expect(this.cookie).toBe('banana=%C2%BFy%C3%A9ll%C3%B3w?;path=/');
    expect(value).toBe('¿yéllów?');

    // RFC 6265 (http://tools.ietf.org/html/rfc6265) is the 'real world' cookies specification.
    // The specification allows the following subset of ASCII characters to be unescaped:
    //     hex    : dec   : ASCII
    //     0x21   : 33    : !
    this.tinycookies.set('a', '!'); expect(this.cookie).toBe('a=!;path=/');
    //     0x23-2B: 35-43 : #$%&'()*+    (note that % should be encoded because it's the prefix for percent encoding)
    this.tinycookies.set('b', '#$%&\'()*+'); expect(this.cookie).toBe('b=#$%25&\'()*+;path=/');
    //     0x2D-3A: 45-58 : -./0123456789:
    this.tinycookies.set('c', '-./0123456789:'); expect(this.cookie).toBe('c=-./0123456789:;path=/');
    //     0x3C-5B: 60-91 : <=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[
    this.tinycookies.set('d', '<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ['); expect(this.cookie).toBe('d=<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[;path=/');
    //     0x5D-7E: 93-126: ]^_`abcdefghijklmnopqrstuvwxyz{|}~
    this.tinycookies.set('e', ']^_`abcdefghijklmnopqrstuvwxyz{|}~'); expect(this.cookie).toBe('e=]^_`abcdefghijklmnopqrstuvwxyz{|}~;path=/');

    // Now check the inverse of above: whether remaining character ranges are percent encoded (they should be)
    this.tinycookies.set('f_CTL',        '\x10'); expect(this.cookie).toBe('f_CTL=%10;path=/');
    this.tinycookies.set('f_whitespace', ' '   ); expect(this.cookie).toBe('f_whitespace=%20;path=/');
    this.tinycookies.set('f_DQUOTE',     '"'   ); expect(this.cookie).toBe('f_DQUOTE=%22;path=/');
    this.tinycookies.set('f_comma',      ','   ); expect(this.cookie).toBe('f_comma=%2C;path=/');
    this.tinycookies.set('f_semicolon',  ';'   ); expect(this.cookie).toBe('f_semicolon=%3B;path=/');
    this.tinycookies.set('f_backslash',  '\\'  ); expect(this.cookie).toBe('f_backslash=%5C;path=/');
    this.tinycookies.set('f_CTL2',       '\x7F'); expect(this.cookie).toBe('f_CTL2=%7F;path=/');
  });
});





// Basic regression test cases to be executed using an actual browser (PhantomJS)
describe("Browser-based test suite", function() {
  beforeEach(function() {
    // Create non stubbed instance of tinycookies
    this.tinycookies = {};
    requireTinyCookies(document, Date, this.tinycookies);
  });

  afterEach(function() {
    // Remove 'banana' cookie
    document.cookie = 'banana=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  });

  it("Get/set/erase basics", function() {
    // Test get (when no cookie has been set)
    expect(this.tinycookies.get('banana')).toBe(null);

    // Test set
    this.tinycookies.set('banana', 'yellow');
    expect(this.tinycookies.get('banana')).toBe('yellow');

    // Test erase
    this.tinycookies.erase('banana');
    expect(this.tinycookies.get('banana')).toBe(null);
  });

  it("Get/set/erase cookie using expire option", function() {
    // Test get (when no cookie has been set)
    expect(this.tinycookies.get('banana')).toBe(null);

    // Test set with the expires option set
    this.tinycookies.set('banana', 'yellow', {expires: 100});
    expect(this.tinycookies.get('banana')).toBe('yellow');

    // Test erase
    this.tinycookies.erase('banana');
    expect(this.tinycookies.get('banana')).toBe(null);
  });

  it("Set cookie using all possible options", function() {
    this.tinycookies.set('banana', 'yellow', {
      expires: 3600,
      domain: 'www.test.com',
      path: '/some/path',
      secure: true,
      httponly: true
    });
    // Note that the cookie won't be set because the domain/path/secure options are
    // not correct for the PhantomJS session
    expect(this.tinycookies.get('banana')).toBe(null);
  });

  it("Erase non-existing cookie", function() {
    // Shouldn't raise any error
    this.tinycookies.erase('orange');
  });
});
