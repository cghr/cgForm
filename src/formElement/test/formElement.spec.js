describe('form element', function () {
    var scope, $compile;
    var element, user, age;

    beforeEach(module('cgForm.formElement'));

    var controls = [
        'checkbox',
        'control-group',
        'control-group-heading',
        'dropdown',
        'text_select',
        'gps',
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


    beforeEach(inject(function ($rootScope, _$compile_) {

        scope = $rootScope;
        $compile = _$compile_;

        element = angular.element('<form-element config="dataConfig"></form-element>');
        user = {
            name: 'username',
            type: 'text',
            valdn: 'required'

        };
        age = {
            name: 'age',
            valdn: 'required',
            items: [
                {text: 'Years', value: 'Y'},
                {text: 'Months', value: 'M'},
                {text: 'Days', value: 'D'}
            ]
        };

    }));
    function compileDigest($scope, $elem) {

        $compile($elem)($scope);
        $scope.$digest();

    }


    it('text:should render a text input', function () {

        user.type = 'text';
        scope.dataConfig = user;
        compileDigest(scope, element);
        expect(element.find('div.controls input:text').length).toBe(1);
    });
    it('textarea:should render a textarea input', function () {

        user.type = 'textarea';
        scope.dataConfig = user;
        compileDigest(scope, element);
        expect(element.find('div.controls textarea').length).toBe(1);
    });

    it('hidden:should render a hidden input', function () {

        user.type = 'hidden';
        scope.dataConfig = user;
        compileDigest(scope, element);
        expect(element.find('div.controls input:hidden').length).toBe(1);
    });
    it('readonly:should render a hidden readonly', function () {

        user.type = 'readonly';
        scope.dataConfig = user;
        compileDigest(scope, element);
        expect(element.find('div.controls input:text').attr('readonly')).toBe('readonly');
    });

    it('password:should render a password input', function () {

        user.type = 'password';
        scope.dataConfig = user;
        compileDigest(scope, element);
        expect(element.find('div.controls input:password').length).toBe(1);
    });
    it('dropdown:should render a dropdown input', function () {

        age.type = 'dropdown';
        scope.dataConfig = age;
        compileDigest(scope, element);
        expect(element.find('div.controls select').length).toBe(1);
        expect(element.find('div.controls select').children().length).toBe(4);//Angular adds an extra ?undefined? option
    });

    it('duration:should render a text field and select field for text_select type', function () {
        age.type = 'text_select';
        scope.dataConfig = age;
        compileDigest(scope, element);
        expect(element.find('div.controls input:text').length).toBe(1);
        expect(element.find('div.controls select').length).toBe(1);
        expect(element.find('div.controls select').children().length).toBe(4);//Angular adds an extra ?undefined? option

    });

    it('Gps:should render two input field for latitude and longitude', function () {
        scope.dataConfig = {
            name: 'gps',
            type: 'gps'
        };
        compileDigest(scope, element);
        expect(element.find('div.controls input:text').length).toBe(2);
        expect(element.find('div.controls a').html()).toBe('Get GPS');

    });
    it('Heading:should render a heading', function () {
        scope.dataConfig = {
            name: 'heading',
            type: 'heading',
            label: 'Sample Heading'
        };
        compileDigest(scope, element);
        var label = angular.element(element.find('div.control-label').children()[0]);
        expect(label.text()).toBe(scope.dataConfig.label);

    });
    it('radio:should render a radio group', function () {

        age.type = 'radio';
        scope.dataConfig = age;
        compileDigest(scope, element);
        expect(element.find('div.controls input:radio').length).toBe(3);

    });
    it('radio-inline:should render a radio group', function () {

        age.type = 'radio-inline';
        scope.dataConfig = age;
        compileDigest(scope, element);
        expect(element.find('div.controls input:radio').length).toBe(3);

    });
    it('checkbox:should render a checkbox group', function () {

        age.type = 'checkbox';
        scope.dataConfig = age;
        compileDigest(scope, element);
        expect(element.find('div.controls input:checkbox').length).toBe(3);
        expect(element.find('div.controls input:checkbox').attr('name')).toBe(scope.dataConfig.name + '[]');

    });


});