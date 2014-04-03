 angular.module('cgForm.scrollTop', ['jQuery'])
    .directive('scrollTop', function ($timeout,jQuery) {

        return {
            link: function (scope, elm) {

                /* Scroll to the newly added element */
                $timeout(function () {
                    jQuery('body, html').animate({ scrollTop: jQuery(elm).offset().top }, 100);
                }, 0);
            }
        };


    });


