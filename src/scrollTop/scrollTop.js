angular.module('cgForm.scrollTop', ['cgForm.jQuery'])
    .directive('scrollTop', function ($timeout, jQuery) {

        function postLink(scope, elm, attrs) {


            if (attrs.scrollTop == 'false')
                return false;

            function scrollTop() {
                jQuery('body, html').animate({ scrollTop: jQuery(elm).offset().top }, 100);
            }

            /* Scroll to the newly added element */
            $timeout(scrollTop, 0);
        }

        return {
            link: postLink
        };


    });


