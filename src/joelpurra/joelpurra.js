angular.module('cgForm.joelpurra', [])
    .factory('JoelPurra', function ($window) {

        if (!$window.JoelPurra)
            throw 'plusAsTab library not available'

        $window.JoelPurra.PlusAsTab.setOptions({key: 13})
        
        return $window.JoelPurra;
    });
