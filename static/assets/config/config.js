// GLOBAL configrations
var CONF = {
    ensureLastSlash: function(url) {
        if (!url || !url.charAt) {
            return url;
        }

        if (url.charAt(url.length - 1) != '/') {
            url += '/';
        }

        return url;
    },

    clearLastSlash: function(url) {
        if (!url || !url.charAt) {
            return url;
        }

        if (url.charAt(url.length - 1) == '/') {
            url = url.substring(0, url.length - 1);
        }

        return url;
    }
}

// configrations
CONF.baseUrl = 'http://192.168.1.88:8002/';
CONF.serverBaseUrl = 'http://192.168.1.88:8002/';
CONF.apiUrl = 'http://api.agrisz.org/';
CONF.mapUrl = 'http://map.agrisz.com/geoserver/map/wms';

// check surfix
CONF.serverBaseUrl = CONF.ensureLastSlash(CONF.serverBaseUrl);
CONF.apiUrl = CONF.ensureLastSlash(CONF.apiUrl);

// make up html pages' full url by name
CONF.htmlFileUrl = function(name) {
    return "views/" + name + '.html';
};
