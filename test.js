// Fully stubbed test suite (document.cookie and Date object) that covers all functionality
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
    var dateStub = function() {
      this.date = new Date(2030, 12, 31, 23, 59, 59, 1234);
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

  it("Basic get/set/erase cookie functionality", function() {
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

  it("Set all possible option", function() {
    this.tinycookies.set('banana', 'yellow', {
      expires: 3600,
      domain: 'www.test.com',
      path: '/some/path',
      secure: true
    });
    expect(this.cookie).toBe('banana=yellow;expires=Sat, 01 Feb 2031 00:00:00 GMT;domain=www.test.com;path=/some/path;secure');
  });

  it("Set expires option", function() {
    this.tinycookies.set('banana', 'yellow', {expires: 3600});
    expect(this.cookie).toBe('banana=yellow;expires=Sat, 01 Feb 2031 00:00:00 GMT;path=/');
  });

  it("Set domain option", function() {
    this.tinycookies.set('banana', 'yellow', {domain: 'www.test.com'});
    expect(this.cookie).toBe('banana=yellow;domain=www.test.com;path=/');
  });

  it("Set path option", function() {
    this.tinycookies.set('banana', 'yellow', {path: '/some/path'});
    expect(this.cookie).toBe('banana=yellow;path=/some/path');
  });

  it("Set secure option", function() {
    this.tinycookies.set('banana', 'yellow', {secure: true});
    expect(this.cookie).toBe('banana=yellow;path=/;secure');
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

  it("Basic get/set/erase cookie functionality", function() {
    // Test get (when no cookie has been set)
    expect(this.tinycookies.get('banana')).toBe(null);

    // Test set
    this.tinycookies.set('banana', 'yellow');
    expect(this.tinycookies.get('banana')).toBe('yellow');

    // Test erase
    this.tinycookies.erase('banana');
    expect(this.tinycookies.get('banana')).toBe(null);
  });

  it("Get/set/erase cookie functionality using expire option", function() {
    // Test get (when no cookie has been set)
    expect(this.tinycookies.get('banana')).toBe(null);

    // Test set with the expires option set
    this.tinycookies.set('banana', 'yellow', {expires: 100});
    expect(this.tinycookies.get('banana')).toBe('yellow');

    // Test erase
    this.tinycookies.erase('banana');
    expect(this.tinycookies.get('banana')).toBe(null);
  });

  it("Set all options", function() {
    this.tinycookies.set('banana', 'yellow', {
      expires: 3600,
      domain: 'www.test.com',
      path: '/some/path',
      secure: true
    });
    // Note that the cookie won't be set because the domain/path/secure options are
    // not correct for the PhantomJS session
    expect(this.tinycookies.get('banana')).toBe(null);
  });

  it("Remove non-existing cookie", function() {
    // Shouldn't raise any error
    this.tinycookies.erase('orange');
  });
});
