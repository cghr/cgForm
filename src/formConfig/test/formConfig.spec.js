describe('form config', function () {
    var scope, $compile;
    var element, formConfig;

    beforeEach(module('cgForm.formConfig'));


    beforeEach(inject(function ($rootScope, _$compile_, _FormConfig_) {

        scope = $rootScope;
        $compile = _$compile_;
        formConfig = _FormConfig_;

    }));


    it('should throw an error if $rootScope has no serviceBaseUrl', function () {

        expect(function () {
            formConfig.getConfig();
        }).toThrow('serviceBaseUrl  not found in $rootScope');

    });

    it('should return a default config with a given serviceBaseUrl', function () {

        scope.serviceBaseUrl = 'http://fakeServer/';
        var expectedConfig = {
            submitUrl: 'http://fakeServer/api/data/dataStoreService/',
            resourceBaseUrl: 'http://fakeServer/api/data/dataAccessService/',
            lookupBaseUrl: 'http://fakeServer/api/LookupService/',
            submitLabel: 'Save',
            style: 'well'
        };

        expect(formConfig.getConfig()).toEqual(expectedConfig);

    });


});