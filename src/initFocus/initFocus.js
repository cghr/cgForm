angular.module('cgForm.initFocus', [])
    .directive('initFocus', function ($timeout) {

        return {
            link: function (scope, elm, attrs) {

                if (attrs.initFocus == 'false') {
                    return false;
                }
                $timeout(function () {
                    elm.focus();
                }, 0);
            }
        };


    });