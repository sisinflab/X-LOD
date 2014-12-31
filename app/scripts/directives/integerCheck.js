'use strict';

angular.module('lodeditApp')
    .directive('integerCheck', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        
        link: function(scope, elem, attr, ctrl) {
            var maxLength=100;
            var flags = attr.intFlags || '';
            var regex = new RegExp('^[-+]?[0-9]+$', flags);            
                        
             ctrl.$parsers.unshift(function(value) {
                 var valid = regex.test(value);
                ctrl.$setValidity('integerCheck', valid);
                return valid ? value : undefined;
            });
        }
    };
});