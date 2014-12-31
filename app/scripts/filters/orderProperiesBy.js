angular.module('lodeditApp').filter('orderProperiesBy', function() {
  return function(items, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      if(a.prop_name==="title" || b.prop_name==="title"){
        return 1;
      } else{
        return -1;
      }
    });
    if(reverse) filtered.reverse();
    return filtered;
  };
});
