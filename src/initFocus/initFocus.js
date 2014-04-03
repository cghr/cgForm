angular.module('cgForm.initFocus', [])
    .directive('initFocus', function ($timeout) {

        return {
            link: function (scope, elm) {

                $timeout(function () {
                    elm.focus();
                }, 0);
            }
        };


    });

