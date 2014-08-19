describe('Service: FormService', function () {


    var currentLocation = '/user/1';

    // load the service's module
    beforeEach(module('cgForm.formService'));
    beforeEach(module('cgForm.formConfig'));


    // instantiate service
    var formService, http, location, httpBackend;


    beforeEach(inject(function (_FormService_, _$http_, _$location_, _$httpBackend_) {
        formService = _FormService_;
        http = _$http_;
        location = _$location_;
        location.url(currentLocation);
        httpBackend = _$httpBackend_;
    }));

    it('should  get Data ', function () {

        var mockResp = {id: 1, username: 'user1', roles: 'user'};
        httpBackend.whenGET('api/data/dataAccessService/user/1').respond(mockResp);
        formService.getResource('user').then(function (resp) {

            expect(resp.data).toEqual(mockResp);
        });
        httpBackend.flush();
    });


})
;
