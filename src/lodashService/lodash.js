
angular.module('lodash',[])
    .factory('_', function ($window) {

        if (!$window._){
            throw new Error('Lodash library not available');
        }


        return $window._;
    });
