angular.module('cgForm.formConfig', ['cgForm.lodash'])
    .factory('FormConfig', function () {


        return {
            submitUrl: 'api/data/dataStoreService/',
            resourceBaseUrl: 'api/data/dataAccessService/',
            lookupBaseUrl: 'api/LookupService/',
            crossFlowBaseUrl: 'api/CrossFlowService',
            crossCheckBaseUrl: 'api/CrossCheckService',
            dynamicDropdownBaseUrl: 'api/dynamicDropdownService',
            submitLabel: 'Save',
            style: 'well'
        }


    })
