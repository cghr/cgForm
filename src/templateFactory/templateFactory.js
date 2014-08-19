angular.module('cgForm.templateFactory', [])
    .factory('TemplateFactory', function TemplateFactory($http, $templateCache) {




        function getTemplate(templateName) {

            var template = 'template/formElement/' + templateName + '.html'
            return $http.get(template, {cache: $templateCache})
        }

        return { get: getTemplate }

    });