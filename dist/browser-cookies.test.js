function requireCookies(document, Date, exports) { exports.defaults = {};

exports.set = function(name, value, options) {
  // Retrieve options and defaults
  var opts = options || {};
  var defaults = exports.defaults;

  // Apply default value for unspecified options
  var expires  = opts.expires  || defaults.expires;
  var domain   = opts.domain   || defaults.domain;
  var path     = opts.path     !== undefined ? opts.path     : (defaults.path !== undefined ? defaults.path : '/');
  var secure   = opts.secure   !== undefined ? opts.secure   : defaults.secure;
  var httponly = opts.httponly !== undefined ? opts.httponly : defaults.httponly;

  // Determine cookie expiration date
  // If succesful the result will be a valid Date, otherwise it will be an invalid Date or false(ish)
  var expDate = expires ? new Date(
      // in case expires is an integer, it should specify the number of days till the cookie expires
      typeof expires === 'number' ? new Date().getTime() + (expires * 864e5) :
      // else expires should be either a Date object or in a format recognized by Date.parse()
      expires
  ) : '';

  // Set cookie
  document.cookie = name.replace(/[^+#$&^`|]/g, encodeURIComponent)                // Encode cookie name
  .replace('(', '%28')
  .replace(')', '%29') +
  '=' + value.replace(/[^+#$&/:<-\[\]-}]/g, encodeURIComponent) +                  // Encode cookie value (RFC6265)
  (expDate && expDate.getTime() >= 0 ? ';expires=' + expDate.toUTCString() : '') + // Add expiration date
  (domain   ? ';domain=' + domain : '') +                                          // Add domain
  (path     ? ';path='   + path   : '') +                                          // Add path
  (secure   ? ';secure'           : '') +                                          // Add secure option
  (httponly ? ';httponly'         : '');                                           // Add httponly option
};

exports.get = function(name) {
  var cookies = document.cookie.split(';');

  // Iterate all cookies
  for(var i = 0; i < cookies.length; i++) {
    var c = parseCookie(cookies[i]);

    // If name matches, return value
    if (c[0] === name) {
      return c[1];
    }
  }

  return null;
};

exports.erase = function(name, options) {
  exports.set(name, '', {
    expires:  -1,
    domain:   options && options.domain,
    path:     options && options.path,
    secure:   0,
    httponly: 0}
  );
};

exports.all = function() {
  var cookies = document.cookie.split(';');
  var all = {};
  for(var i = 0; i < cookies.length; i++) {
    var c = parseCookie(cookies[i]);
    all[c[0]] = c[1];
  }
  return all;
};

function parseCookie(cookie) {
  // Determine separator index ("name=value")
  var separatorIndex = cookie.indexOf('=');
  
  // IE<11 emits the equal sign when the cookie value is empty
  separatorIndex = separatorIndex < 0 ? cookie.length : separatorIndex;
  
  var cookieName = decodeURIComponent(cookie.substring(0, separatorIndex).replace(/^\s+|\s+$/g, ''));
  var cookieValue = decodeURIComponent(cookie.substring(separatorIndex + 1, cookie.length));

  return [cookieName, cookieValue];
}
 }