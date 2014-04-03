angular.module('cgForm.templateFactory', [])
	.factory('TemplateFactory', function($http, $templateCache) {

		return {
			get: function(template) {
				return $http.get('template/formElement/' + template + '.html', {
					cache: $templateCache
				});
			}
		};

	});