'use strict';

angular.module('lodeditApp')
    .directive('floatCheck', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {
            var maxLength=100;
            var flags = attr.intFlags || '';
            var regex = new RegExp('^([-+]?[0-9]+(\.[0-9]+)?([eE][-+]?[0-9]+)?|INF|-INF|NaN)$', flags);            
            ctrl.$parsers.unshift(function(value) {
                var valid = regex.test(value);
                if (valid) {
                    if (value.indexOf('.')!=-1) {
                        var before=value.substring(0,value.indexOf('.'));
                        var after=value.substring(value.indexOf('.')+1);
                        if(before.length>maxLength || after.length>maxLength){
                            valid=false;
                        }
                    }else{
                        if(value.length>maxLength){
                            valid=false;
                        }
                    }
                };
                ctrl.$setValidity('floatCheck', valid);
                return valid ? value : undefined;
            });
        }
    };
});