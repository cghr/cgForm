angular.module('cgForm.templateFactory', [])
    .factory('TemplateFactory', function ($http, $templateCache) {

        function getHttpTemplate(template) {

            return $http.get(template, {cache: $templateCache})
        }

        function getTemplate(templateName) {

            var template = 'template/formElement/' + templateName + '.html'
            return getHttpTemplate(template)
        }

        return {
            get: getTemplate
        };

    });