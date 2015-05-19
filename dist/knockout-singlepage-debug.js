(function() {

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
      element.setAttribute('data-bind', 'component: { name: current().compoent, params: { params: current().parameters, hash: current().hash, query: current().query } }');
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

  var amdAvailable = typeof define === 'function' && define.amd;

  if(amdAvailble) define([ 'knockout' ], initialise);

  if(ko) initialise(ko);
  else if (!amdAvailble) throw 'Unable to find knockout';
})();
