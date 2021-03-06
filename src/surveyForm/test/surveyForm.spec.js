describe('form element', function () {
    var scope, $compile;
    var element, user, age, sampleData, templateCache, state, timeout, location, httpBackend;
    var currentLocation = '/user/1/basicInf';
    var fakeServer = 'http://fakeServer/';
    var controls = [
        'checkbox',
        'control-group',
        'control-group-heading',
        'dropdown',
        'text_select',
        'gps',
        //'heading',
        'hidden',
        'password',
        'radio',
        'radio-inline',
        'readonly',
        'suggest',
        'text',
        'textarea'
    ];
    angular.forEach(controls, function (control) {
        beforeEach(module('template/formElement/' + control + '.html'));

    });
    angular.forEach(controls, function (control) {
        beforeEach(module('template/surveyForm/surveyForm.html'));

    });
    beforeEach(angular.mock.module('cgForm.schemaFactory'));
    beforeEach(module(function ($provide) {

        var mockFactory = {
            get: function (name) {
                if (name === 'user.basicInf') {
                    return sampleData;
                }

            }
        };
        $provide.value('SchemaFactory', mockFactory);

    }));

    beforeEach(module('cgForm.formElement'));
    beforeEach(module('cgForm.surveyForm'));


    beforeEach(inject(function ($rootScope, _$compile_, _$templateCache_, _$state_, _$timeout_, _$location_, _$httpBackend_) {

        scope = $rootScope;
        $compile = _$compile_;
        location = _$location_;
        location.url(currentLocation);
        templateCache = _$templateCache_;
        state = _$state_;
        timeout = _$timeout_;
        httpBackend = _$httpBackend_;
        sampleData = {
            onSave: '',
            properties: [
                {
                    name: 'datastore',
                    value: 'user',
                    type: 'hidden'
                },
                {
                    name: 'id',
                    value: '$stateParams.id',
                    type: 'hidden'
                },
                {
                    name: 'username',
                    type: 'text',
                    valdn: 'required'

                },
                {
                    name: 'age',
                    type: 'radio',
                    valdn: 'required',
                    items: [
                        {text: 'Years', value: 'Y'},
                        {text: 'Months', value: 'M'},
                        {text: 'Days', value: 'D'}
                    ]
                }

            ]
        };


    }));
    function compileDigest($scope, $elem) {


        $compile($elem)($scope);
        $scope.$digest();

    }


    it('should render all form controls', function () {

        var mockResp = {id: 1, username: 'user1', roles: 'user'};
        httpBackend.whenGET('api/data/dataAccessService/user/1').respond(mockResp);
        scope.serviceBaseUrl = fakeServer;

        scope.data = sampleData;
        element = angular.element('<survey-form options="data"></survey-form>');
        compileDigest(scope, element);
        //timeout.flush(0);
        expect(element.find('div.controls input').length).toBe(3);//All Input fields
        httpBackend.flush();


    });

    xit('should render all form controls', function () {

        scope.serviceBaseUrl = fakeServer;
        state.current = {name: 'user.basicInf'};
        element = angular.element('<survery-form></survery-form>');
        compileDigest(scope, element);
        expect(element.find('div.controls input').length).toBe(3);//All Input fields
    });


});