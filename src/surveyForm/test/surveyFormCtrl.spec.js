describe('survey form controller', function () {
    var scope, $compile, surveyCtrl, elem,timeout;
    var element;

    beforeEach(module('cgForm.surveyForm'));


    beforeEach(inject(function ($controller, $rootScope) {

        scope = $rootScope;
        elem = {
            data: function (name) {
                return {validate: function () {
                    return true;
                }};
            }
        };
        surveyCtrl = $controller('surveyFormCtrl', {$scope: scope, $element: elem});

    }));
    it('should create a controller', function () {

        expect(surveyCtrl).toBeDefined();

    });
    it('should  handle the flow', function () {

        scope.schema = {
            onSave: '',
            properties: [
                {
                    name: 'datastore',
                    value: 'user',
                    type: 'hidden',
                    flow: ''
                },
                {
                    name: 'id',
                    value: '$stateParams.id',
                    type: 'hidden',
                    flow: ''
                },
                {
                    name: 'name',
                    type: 'text',
                    valdn: 'required',
                    flow: ''

                },
                {
                    name: 'age',
                    type: 'radio',
                    valdn: 'required',
                    flow: '',
                    items: [
                        {text: 'Years', value: 'Y'},
                        {text: 'Months', value: 'M'},
                        {text: 'Days', value: 'D'}
                    ]
                },
                {
                    name: 'smoke',
                    type: 'radio',
                    valdn: 'required',
                    flow: '',
                    items: [
                        {text: 'Yes', value: 'Yes'},
                        {text: 'NO', value: 'No'}
                    ]
                },
                {
                    name: 'cigarettes',
                    type: 'text',
                    valdn: 'required',
                    flow: 'data.smoke=="Yes"',
                    items: [
                        {text: 'Yes', value: 'Yes'},
                        {text: 'NO', value: 'No'}
                    ]
                },
                {
                    name: 'freqCigarettes',
                    type: 'text',
                    valdn: 'required',
                    flow: 'data.cigarettes=="Yes"'
                },
                {
                    name: 'city',
                    type: 'text',
                    valdn: 'required',
                    flow: ''
                }
            ]
        };

        scope.flow = {properties: []};
        for (var i = 0; i <= 2; i++) {
            scope.flow.properties.push(scope.schema.properties[i]);
        }

        scope.data = {};
        scope.flowSeq = 2;
        scope.flowIndex = 2;

        scope.showNext();
        expect(scope.flow.properties.length).toBe(4);


        scope.showNext();
        expect(scope.flow.properties.length).toBe(5);
        expect((scope.flow.properties[4]).name).toBe('smoke');
        scope.data.smoke='Yes';

        scope.showNext();
        expect(scope.flow.properties.length).toBe(6);
        expect((scope.flow.properties[5]).name).toBe('cigarettes');
        scope.data.cigarettes='Yes';

        scope.showNext();
        expect(scope.flow.properties.length).toBe(7);
        expect((scope.flow.properties[6]).name).toBe('freqCigarettes');
        scope.data.freqCigarettes=10;
        expect(scope.data).toEqual({smoke:'Yes',cigarettes:'Yes',freqCigarettes:10});



        //Navigate Back and test Jump Flow logic
        scope.jumpFlow('smoke');
        expect(scope.flow.properties.length).toBe(5);
        scope.data.smoke='No';

        scope.showNext();
        expect(scope.flow.properties.length).toBe(6);
        expect((scope.flow.properties[5]).name).toBe('city');
        expect(scope.data).toEqual({smoke:'No'});

    });


});
