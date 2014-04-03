describe('form element', function() {
    var scope, $compile;
    var element, user, age, sampleData, templateCache, state;
    var fakeServer = 'http://fakeServer/';
    var controls = [
        'checkbox',
        'control-group',
        'control-group-heading',
        'dropdown',
        'duration',
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
    angular.forEach(controls, function(control) {
        beforeEach(module('template/formElement/' + control + '.html'));

    });
    angular.forEach(controls, function(control) {
        beforeEach(module('template/ffqForm/ffqForm.html'));

    });
    beforeEach(angular.mock.module('cgForm.schemaFactory'));
    beforeEach(module(function($provide) {

        var mockFactory = {
            get: function(name) {
                if (name === 'ffqDetail.bev') {
                    return sampleData;
                }

            }
        };
        $provide.value('SchemaFactory', mockFactory);

    }));
    beforeEach(module('cgForm.formElement'));
    beforeEach(module('cgForm.ffqForm'));


    beforeEach(inject(function($rootScope, _$compile_, _$templateCache_, _$state_) {

        scope = $rootScope;
        $compile = _$compile_;
        templateCache = _$templateCache_;
        state = _$state_;
        sampleData = {
            'onSave': '$state.transitionTo("hc.ffqDetail.cls", $stateParams);',
            'properties': [{
                'id': 'datastore',
                'name': 'datastore',
                'value': 'ffq_bev',
                'type': 'hidden'
            }, {
                'id': 'member_id',
                'name': 'member_id',
                'value': '$stateParams.memberId',
                'type': 'hidden'
            }, {
                'items': [{
                    'text': '',
                    'value': '0'
                }, {
                    'text': '',
                    'value': '1'
                }, {
                    'text': '',
                    'value': '2'
                }, {
                    'text': '',
                    'value': '3'
                }, {
                    'text': '',
                    'value': '4'
                }, {
                    'text': '',
                    'value': '5'
                }, {
                    'text': '',
                    'value': '6'
                }],
                'name': 'milk_cow',
                'label': 'Milk (Cow)',
                'type': 'ffq',
                'valdn': 'required'
            }, {
                'items': [{
                    'text': '',
                    'value': '0'
                }, {
                    'text': '',
                    'value': '1'
                }, {
                    'text': '',
                    'value': '2'
                }, {
                    'text': '',
                    'value': '3'
                }, {
                    'text': '',
                    'value': '4'
                }, {
                    'text': '',
                    'value': '5'
                }, {
                    'text': '',
                    'value': '6'
                }],
                'name': 'milk_buffalo',
                'label': 'Milk (Buffalo)',
                'type': 'ffq',
                'valdn': ''
            }, {
                'items': [{
                    'text': '',
                    'value': '0'
                }, {
                    'text': '',
                    'value': '1'
                }, {
                    'text': '',
                    'value': '2'
                }, {
                    'text': '',
                    'value': '3'
                }, {
                    'text': '',
                    'value': '4'
                }, {
                    'text': '',
                    'value': '5'
                }, {
                    'text': '',
                    'value': '6'
                }],
                'name': 'tea',
                'label': 'Tea',
                'type': 'ffq',
                'valdn': ''
            }]
        };


    }));

    function compileDigest($scope, $elem) {


        $compile($elem)($scope);
        $scope.$digest();

    }


    it('should render all form controls with local config', function() {

        scope.serviceBaseUrl = fakeServer;

        scope.data = sampleData;
        element = angular.element('<ffq-form options="data"></ffq-form>');
        compileDigest(scope, element);
        expect(element.find('table tr').length - 2).toBe(3); //First two rows are headings.
        expect(element.find('input:radio').length).toBe(7 * 3); //7 columns and 3 rows
        expect(element.find('select').length).toBe(3);
        expect(element.find('input:text').length).toBe(3);
    });

    it('should render all form controls with config for a given state', function() {

        scope.serviceBaseUrl = fakeServer;
        state.current = {
            name: 'ffqDetail.bev'
        };
        element = angular.element('<ffq-form></ffq-form>');
        compileDigest(scope, element);
        expect(element.find('table tr').length - 2).toBe(3); //First two rows are headings.
        expect(element.find('input:radio').length).toBe(7 * 3); //7 columns and 3 rows
        expect(element.find('select').length).toBe(3);
        expect(element.find('input:text').length).toBe(3);

    });


});