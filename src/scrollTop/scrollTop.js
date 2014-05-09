 angular.module('cgForm.scrollTop', ['cgForm.jQuery'])
    .directive('scrollTop', function ($timeout,jQuery) {

        return {
            link: function (scope, elm,attrs) {


                if(attrs.scrollTop == 'false'){
                    return false;
                }

                /* Scroll to the newly added element */
                $timeout(function () {
                    jQuery('body, html').animate({ scrollTop: jQuery(elm).offset().top }, 100);
                }, 0);
            }
        };


    });


