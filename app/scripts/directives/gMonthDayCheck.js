'use strict';

angular.module('lodeditApp')
    .directive('gmonthDayCheck', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {
            var flags = attr.booleanFlags || '';
            var regex = new RegExp('^--[0-1][0-9]-[0-3][0-9]$', flags);            
            ctrl.$parsers.unshift(function(value) {
                var valid = regex.test(value);
                if (value.substring(2,4)>12 || value.substring(5,7)>31) {
                    valid=false;
                };
                ctrl.$setValidity('gmonthDayCheck', valid);
                return valid ? value : undefined;
            });
        }
    };
});