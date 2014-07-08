angular.module('cgForm.formElement', ['cgForm.templateFactory', 'cgForm.initFocus', 'cgForm.scrollTop', 'cgForm.ngEnter', 'cgForm.myFocus'])
    .directive('formElement', function ($http, $compile, $templateCache, TemplateFactory) {

        var linkFn = function (scope, element, attrs) {
            /* Evaluate data supplied in attrs */
            scope.config = scope.$eval(attrs.config);
            attrs.$observe('config', function () {
                scope.config = scope.$eval(attrs.config);
            });

            /* Create a templateUrl from config.type */
            var isHeading = (scope.config.type === 'heading');
            var controlGroup = isHeading ? 'control-group-heading' : 'control-group';

            /* Get the control group template first and insert the input widget template */
            TemplateFactory.get(controlGroup).then(function (response) {
                element.html(response.data);
                $compile(element)(scope);

                if (isHeading) {
                    return;
                }
                TemplateFactory.get(scope.config.type).then(function (response) {
                    element.find('div.controls').html(response.data);
                    $compile(element)(scope);

                });
            });

        }

        return {
            replace: true,
            restrict: 'E',
            template: '<div></div>',
            scope: true, // A new scope which inherits from parent scope
            link: linkFn
        };
    });