'use strict';

angular.module('lodeditApp')
    .directive('gmonthCheck', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {
            var flags = attr.booleanFlags || '';
            var regex = new RegExp('^--[0-1][0-9]--$', flags);            
            ctrl.$parsers.unshift(function(value) {
                var valid = regex.test(value);
                if (value.substring(2,4)>12) {
                    valid=false;
                };
                ctrl.$setValidity('gmonthCheck', valid);
                return valid ? value : undefined;
            });
        }
    };
});