angular.module('cgForm.formConfig', ['cgForm.lodash'])
    .factory('FormConfig', function ($rootScope, _) {


        function getConfig() {

            if (_.isUndefined($rootScope.serviceBaseUrl))
                throw "serviceBaseUrl  not found in $rootScope"


            var baseUrl = $rootScope.serviceBaseUrl
            return {
                submitUrl: baseUrl + 'api/data/dataStoreService/',
                resourceBaseUrl: baseUrl + 'api/data/dataAccessService/',
                lookupBaseUrl: baseUrl + 'api/LookupService/',
                crossFlowBaseUrl: baseUrl + 'api/CrossFlowService',
                crossCheckBaseUrl: baseUrl + 'api/CrossCheckService',
                submitLabel: 'Save',
                style: 'well'
            };

        }

        return {
            getConfig: getConfig
        };
    }
);
