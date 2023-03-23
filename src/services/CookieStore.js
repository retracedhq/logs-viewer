export const CookieStore = {
  getItem: function (sKey) {
    if (!sKey || !this.hasOwnProperty(sKey)) {
      return null;
    }
    var re = new RegExp(
      "(?:^|.*;\\s*)" +
        encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") +
        "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"
    );
    return decodeURIComponent(document.cookie.replace(re, "$1"));
  },
  key: function (nKeyId) {
    return decodeURIComponent(
      document.cookie.replace(/\s*=(?:.(?!;))*$/, "").split(/\s*=(?:[^;](?!;))*[^;]?;\s*/)[nKeyId]
    );
  },
  setItem: function (sKey, sValue) {
    if (!sKey) {
      return;
    }
    document.cookie =
      encodeURIComponent(sKey) +
      "=" +
      encodeURIComponent(sValue) +
      "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
    this.length = document.cookie.match(/=/g).length;
  },
  length: 0,
  removeItem: function (sKey) {
    if (!sKey || !this.hasOwnProperty(sKey)) {
      return;
    }
    document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    this.length = this.length - 1;
  },
  /* jshint -W001 */
  hasOwnProperty: function (sKey) {
    /* jshint +W001 */
    var re = new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=");
    return re.test(document.cookie);
  },
};
