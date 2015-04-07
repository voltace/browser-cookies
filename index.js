exports.defaults = {};

exports.set = function(name, value, options) {
  // Retrieve options and defaults
  var opts = options || {};
  var defaults = exports.defaults;

  // Apply default value for unspecified options
  var expires  = opts.expires || defaults.expires;
  var domain   = opts.domain  || defaults.domain;
  var path     = opts.path    || defaults.path || '/';
  var secure   = opts.secure   != undefined ? opts.secure   : defaults.secure;
  var httponly = opts.httponly != undefined ? opts.httponly : defaults.httponly;

  // Determine cookie expiration date
  // If succesful the result will be a valid Date, otherwise it will be an invalid Date or empty string
  var expDate = expires == undefined ? '' :
  // in case expires is an integer, it (should) specify the amount in days till the cookie expires
  typeof expires == 'number' ? new Date(new Date().getTime() + (expires * 864e5)) :
  // in case expires is (probably) a Date object
  expires.getTime ? expires :
  // in case expires is not in any of the above formats, try parsing as a format recognized by Date.parse()
  new Date(expires);

  // Set cookie
  document.cookie = encodeURIComponent(name) + '=' +                          // Encode cookie name
  value.replace(/[^#\$&\+/:<-\[\]-}]/g, encodeURIComponent) +                 // Encode cookie value (RFC6265)
  (expDate && expDate.getTime() ? ';expires=' + expDate.toUTCString() : '') + // Add expiration date
  (domain ? ';domain=' + domain : '') +                                       // Add domain
  ';path=' + path  +                                                          // Add path
  (secure ? ';secure' : '') +                                                 // Add secure option
  (httponly ? ';httponly' : '');                                              // Add httponly option
};

exports.get = function(name) {
  var cookies = document.cookie.split(';');

  // Iterate all cookies
  for(var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];

    // Determine separator index ("name=value")
    var separatorIndex = cookie.indexOf('=');

    // If a separator index is found, Decode the cookie name and compare to the requested cookie name
    // FIXME remove leading and trailing whitespace? something like .replace(/^\s\s*|\s\s+$/, '')
    if (separatorIndex != -1 && decodeURIComponent(cookie.substring(0, separatorIndex)) == name) {
      return decodeURIComponent(cookie.substring(separatorIndex + 1, cookie.length));
    }
  }

  return null;
};

exports.erase = function(name, options) {
  exports.set(name, '', {
    expires:  -1,
    domain:   options && options.domain,
    path:     options && options.path,
    secure:   false,
    httponly: false}
  );
};
