(function() {

var KnockoutRouterCore;

KnockoutRouterCore = (function() {
  function KnockoutRouterCore(routes) {
    this.routes = routes.map(function(route) {
      var regex, url;
      if (route.component) {
        ko.components.register(route.name, route.component);
      }
      url = route.url[0] === '/' ? route.url.slice(1) : route.url;
      regex = '^\\/?' + (url.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')) + '\\/?(\\?.*)?$';
      return {
        component: route.name,
        regex: new RegExp(regex, 'i')
      };
    });
  }

  return KnockoutRouterCore;

})();

var initialise;

initialise = function(ko) {
  var KnockoutRouterExtension;
  KnockoutRouterExtension = (function() {
    function KnockoutRouterExtension() {
      this.router = null;
      this.baseUrl = location.protocol + '//' + location.host;
    }

    KnockoutRouterExtension.prototype.init = function(element, routes) {
      if (this.router) {
        throw 'Router has already been initialised';
      }
      this.router = new Router(routes);
      this.router.go(location.pathname);
      if (!element) {
        element = document.body;
      }
      element.setAttribute('data-bind', 'component: current');
      document.body.addEventListener('click', (function(_this) {
        return function(e) {
          e.stopPropagation();
          if (e.target.tagName.toLowerCase() === 'a' && e.target.href.slice(0, _this.baseUrl.length) === _this.baseUrl) {
            _this.go(e.target.href.slice(_this.baseUrl.length));
            return e.preventDefault();
          }
        };
      })(this), false);
      return ko.applyBindings(this.router);
    };

    KnockoutRouterExtension.prototype.go = function(url) {
      if (!this.router) {
        throw 'Router has not been initialised';
      }
      history.pushState(null, null, url);
      return this.router.go(url);
    };

    return KnockoutRouterExtension;

  })();
  if (!ko.router) {
    return ko.router = new KnockoutRouterExtension();
  }
};

  if(typeof define === 'function' && define.amd) {
    define([ 'knockout' ], initialise);
  } else if(!ko) {
    throw 'Unable to find knockout';
  } else {
    initialise(ko);
  }
})();
