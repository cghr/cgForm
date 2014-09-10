describe('form config', function () {
    var scope, $compile;
    var element, formConfig;

    beforeEach(module('cgForm.formConfig'));


    beforeEach(inject(function ($rootScope, _$compile_, _FormConfig_) {

        scope = $rootScope;
        $compile = _$compile_;
        formConfig = _FormConfig_;

    }));


    it('should return a default config with a given serviceBaseUrl', function () {

        var expectedConfig = {
            submitUrl: 'api/data/dataStoreService/',
            resourceBaseUrl: 'api/data/dataAccessService/',
            lookupBaseUrl: 'api/LookupService/',
            crossFlowBaseUrl: 'api/CrossFlowService',
            crossCheckBaseUrl: 'api/CrossCheckService',
            dynamicDropdownBaseUrl: 'api/dynamicDropdownService',
            submitLabel: 'Save',
            style: 'well'
        };

        expect(formConfig).toEqual(expectedConfig);

    });


});