  var amdAvailable = typeof define === 'function' && define.amd;

  if(amdAvailable) define([ 'knockout' ], initialise);

  if('undefined' !== typeof ko) initialise(ko);
  else if (!amdAvailable) throw 'Unable to find knockout';
})();
