angular.module('lodeditApp').filter('translFilter', function() {
  return function(lang,prop) {
    var filtered = lang.slice(0);
    for (var i = 0; i < prop.prop_obj[0].value.length; i++) {
            if(prop.prop_obj[0].value[i].lang){
              for (var j = 0; j < filtered.length; j++) {
                if(filtered[j].tag==prop.prop_obj[0].value[i].lang){
                  filtered.splice(j,1);
                }
              }
            }
          }
    return filtered;
  }
});