describe('form element', function () {
    var scope, $compile;
    var element, user, age, sampleData, templateCache, state;
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
        beforeEach(module('template/standardForm/standardForm.html'));

    });
    beforeEach(angular.mock.module('cgForm.schemaFactory'));
    beforeEach(module(function ($provide) {

        var mockFactory = {
            get: function (name) {
                if(name==='user.basicInf'){
                    return sampleData;
                }

            }
        };
        $provide.value('SchemaFactory', mockFactory);

    }));
    beforeEach(module('cgForm.formElement'));
    beforeEach(module('cgForm.standardForm'));


    beforeEach(inject(function ($rootScope, _$compile_, _$templateCache_, _$state_) {

        scope = $rootScope;
        $compile = _$compile_;
        templateCache = _$templateCache_;
        state = _$state_;
        sampleData = {
            onSave: '',
            properties: [
                {
                    name: 'datastore',
                    value: 'user',
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

        scope.serviceBaseUrl = fakeServer;

        scope.data = sampleData;
        element = angular.element('<standard-form options="data"></standard-form>');
        compileDigest(scope, element);
        expect(element.find('div.controls input').length).toBe(5);//All Input fields
        expect(element.find('div.controls input:text').length).toBe(2); // all text fields including fields with display none
        expect(element.find('div.controls input:radio').length).toBe(3); //all radio entry fields


    });

    it('should render all form controls', function () {

        scope.serviceBaseUrl = fakeServer;
        state.current = {name: 'user.basicInf'};
        element = angular.element('<standard-form></standard-form>');
        compileDigest(scope, element);
        expect(element.find('div.controls input').length).toBe(5);//All Input fields
        expect(element.find('div.controls input:text').length).toBe(2); // all text fields
        expect(element.find('div.controls input:radio').length).toBe(3); //all radio entry fields


    });


});