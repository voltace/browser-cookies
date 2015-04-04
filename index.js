exports.defaults = {};

exports.set = function(name, value, options) {
  options = options || {};

  // Apply default values for unspecified options
  var expires = options.expires || exports.defaults.expires;
  var domain = options.domain || exports.defaults.domain;
  var path = options.path || exports.defaults.path || '/';
  var secure = options.secure != undefined ? options.secure : exports.defaults.secure;
  var httponly = options.httponly != undefined ? options.httponly : exports.defaults.httponly;

  // Determine cookie expiration date
  // If succesful the result will be a valid Date, otherwise it will be an invalid Date or empty string
  var expDate = expires == undefined ? '' :
    // in case expires is an integer, it (should) specify the amount of seconds till the cookie expires
    typeof expires == 'number' ? new Date(new Date().getTime() + (expires * 1e3)) :
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
  var crumble = name + '=';
  var cookies = document.cookie.split(';');

  // Iterate all cookies
  for(var i = 0; i < cookies.length; i++) {
    // Remove leading white space from the cookie
    var cookie = cookies[i].replace(/^\s\s*/, '');

    // Check if the name of this cookie matches the requested name
    if (!cookie.indexOf(crumble)) {
      return decodeURIComponent(cookie.substring(crumble.length, cookie.length));
    }
  }

  return null;
};

exports.erase = function(name) {
  exports.set(name, '', {expires : -1e5});
};
