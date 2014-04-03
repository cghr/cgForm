angular.module('cgForm.formConfig', [])
    .factory('FormConfig', function ($rootScope) {

        return {
            getConfig: function () {

                if (angular.isUndefined($rootScope.serviceBaseUrl)) {
                    throw new Error('serviceBaseUrl  not found in $rootScope');
                }

                var context = $rootScope.serviceBaseUrl;

                return {
                    submitUrl: context + 'api/data/dataStoreService/',
                    resourceBaseUrl: context + 'api/data/dataAccessService/',
                    lookupBaseUrl: context + 'api/LookupService/',
                    submitLabel: 'Save',
                    style: 'well'
                };
            }
        };
    }
);
