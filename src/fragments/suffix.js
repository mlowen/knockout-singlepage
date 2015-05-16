  var amdAvailable = typeof define === 'function' && define.amd;

  if(amdAvailble) define([ 'knockout' ], initialise);

  if(ko) initialise(ko);
  else if (!amdAvailble) throw 'Unable to find knockout';
})();
