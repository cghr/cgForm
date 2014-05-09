
angular.module('cgForm.plusAsTab', [])
    .factory('JoelPurra', function ($window) {

        if (!$window.JoelPurra){
            throw new Error('Plus As Tab library not available');
        }


        $window.JoelPurra.PlusAsTab.setOptions({ key: 13 });
        return $window.JoelPurra;
    });

