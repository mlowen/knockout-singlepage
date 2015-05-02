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
