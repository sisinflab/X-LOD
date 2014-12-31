'use strict';

angular.module('lodeditApp')
    .directive('booleanCheck', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {
            var flags = attr.booleanFlags || '';
            var regex = new RegExp('^(true|false|1|0)$', flags);            
            ctrl.$parsers.unshift(function(value) {
                var valid = regex.test(value);
                
                ctrl.$setValidity('booleanCheck', valid);
                return valid ? value : undefined;
            });
        }
    };
});