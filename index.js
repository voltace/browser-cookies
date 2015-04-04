exports.defaults = {
  path: '/'
};

exports.set = function(name, value, options) {
  options = options || {};

  // Apply default values for unspecified options
  var expires = options.expires || exports.defaults.expires;
  var domain = options.domain || exports.defaults.domain;
  var path = options.path || exports.defaults.path;
  var secure = options.secure != undefined ? options.secure : exports.defaults.secure;

  // Determine expires string
  var date = new Date();
  var expireString = (expires == undefined ? '' : ';expires=' + (
    // if expires is an integer, it (should) specify the amount of seconds till the cookie expires
    typeof expires == 'number' ? (date.setTime(date.getTime() + expires * 1e3) && date) :
    // if expires is a Date object
    expires.toUTCString ? expires :
    // if none of of the above, expires should be in a format recognized by Date.parse()
    new Date(expires)
  ).toUTCString());

  // Set cookie
  document.cookie = encodeURIComponent(name) +
  '=' +
  // Encode cookie value
  encodeURIComponent(value) +
  // Add expires
  expireString +
  // Add domain
  (domain ? ';domain=' + domain : '') +
  // Add path
  ';path=' + path  +
  // Add secure option
  (secure ? ";secure" : "");
};

exports.get = function(name) {
  var crumble = name + '=';
  var cookies = document.cookie.split(';');

  // Iterate all cookies
  for(var i = 0; i < cookies.length; i++) {
    // Remove leading white space from the cookie
    var cookie = cookies[i].replace(/^\s\s*/, '');

    // Check if this cookie name matches the requested name
    if (cookie.indexOf(crumble) == 0) {
      return decodeURIComponent(cookie.substring(crumble.length, cookie.length));
    }
  }

  return null;
};

exports.erase = function(name) {
  exports.set(name, '', {expires : -1e5});
};
