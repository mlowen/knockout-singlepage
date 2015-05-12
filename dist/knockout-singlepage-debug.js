(function() {

var KnockoutSinglePageRouter;

KnockoutSinglePageRouter = (function() {
  KnockoutSinglePageRouter.prototype.errorMessages = {
    invalidRoute: 'Invalid route',
    invalidRouteName: 'Route has no name',
    invalidRouteUrl: 'Route has an invalid URL',
    routesWithDuplicateName: 'Multiple routes added with the same name',
    routesWithDuplicateUrl: 'Multiple routes added with the same URL'
  };

  function KnockoutSinglePageRouter(routes) {
    var existing, i, j, len, len1, name, paramRegex, parameters, r, ref, regex, route, url;
    this.current = ko.observable(null);
    this.routes = [];
    for (i = 0, len = routes.length; i < len; i++) {
      r = routes[i];
      if (!r) {
        throw this.errorMessages.invalidRoute;
      }
      if (!r.name) {
        throw this.errorMessages.invalidRouteName;
      }
      if (!r.url) {
        throw this.errorMessages.invalidRouteUrl;
      }
      paramRegex = /:([a-z][a-z0-9]+)/ig;
      url = (r.url[0] === '/' ? r.url : '/' + r.url).trim();
      regex = '^' + (url.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')) + '\\/?$';
      parameters = r.url.match(paramRegex);
      name = r.name.trim();
      if (!name) {
        throw this.errorMessages.invalidRouteName;
      }
      if (!url) {
        throw this.errorMessages.invalidRouteUrl;
      }
      if (r.component) {
        ko.components.register(name, r.component);
      }
      route = {
        component: name,
        parameters: parameters ? parameters.map(function(item) {
          return item.slice(1);
        }) : [],
        regex: new RegExp(regex, 'i')
      };
      ref = this.routes;
      for (j = 0, len1 = ref.length; j < len1; j++) {
        existing = ref[j];
        if (existing.component === route.component) {
          throw this.errorMessages.routesWithDuplicateName;
        }
        if (existing.regex.toString() === route.regex.toString()) {
          throw this.errorMessages.routesWithDuplicateUrl;
        }
      }
      this.routes.push(route);
    }
  }

  KnockoutSinglePageRouter.prototype.go = function(url) {
    return this.current((this.routes.filter(function(r) {
      return r.regex.test(url);
    }))[0]);
  };

  return KnockoutSinglePageRouter;

})();

var initialise;

initialise = function(ko) {
  var KnockoutSinglePageExtension;
  KnockoutSinglePageExtension = (function() {
    function KnockoutSinglePageExtension() {
      this.router = null;
      this.baseUrl = location.protocol + '//' + location.host;
    }

    KnockoutSinglePageExtension.prototype.init = function(routes, element) {
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
          if (e.target.tagName.toLowerCase() === 'a' && e.target.href.slice(0, _this.baseUrl.length) === _this.baseUrl) {
            _this.go(e.target.href.slice(_this.baseUrl.length));
            e.stopPropagation();
            return e.preventDefault();
          }
        };
      })(this), false);
      return ko.applyBindings(this.router);
    };

    KnockoutSinglePageExtension.prototype.go = function(url) {
      if (!this.router) {
        throw 'Router has not been initialised';
      }
      history.pushState(null, null, url);
      return this.router.go(url);
    };

    return KnockoutSinglePageExtension;

  })();
  if (!ko.singlePage) {
    return ko.singlePage = new KnockoutSinglePageExtension();
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
