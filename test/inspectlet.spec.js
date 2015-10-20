describe('inspectlet', function () {
    beforeEach(module('inspectlet'));

    var $rootScope, config, resourceLoader, inspectletRunner, $timeout, $window, $location, fetchAccountMetadata;

    beforeEach(inject(function (_$rootScope_, _config_, _resourceLoader_, _inspectletRunner_, _$timeout_, _$window_, _$location_, _fetchAccountMetadata_) {
        $rootScope = _$rootScope_;
        config = _config_;
        resourceLoader = _resourceLoader_;
        inspectletRunner = _inspectletRunner_;
        $timeout = _$timeout_;
        $window = _$window_;
        $location = _$location_;
        fetchAccountMetadata = _fetchAccountMetadata_;

        config.namespace = 'namespace';
        config.inspectletSiteId = 1234;
    }));

    describe('when not on binarta.com host', function () {
        beforeEach(function () {
            inspectletRunner.run();
        });

        it('inspectlet id is not set', function () {
            expect($window.__insp).toBeUndefined();
        });
    });

    describe('when on binarta.com host', function () {
        beforeEach(function () {
            $location.host = function () {
                return 'test.app.binarta.com';
            };

            $window.__insp = undefined;
            inspectletRunner.run();
        });

        describe('after timeout', function () {
            beforeEach(function () {
                $window.__inspld = undefined;
                $timeout.flush();
            });

            it('set inspectlet flag', function () {
                expect($window.__inspld).toEqual(1);
            });

            it('inspectlet id is set', function () {
                expect($window.__insp).toContain(['wid', 1234]);
            });

            it('script is loaded', function () {
                expect(resourceLoader.addScript).toHaveBeenCalledWith('https://cdn.inspectlet.com/inspectlet.js');
            });

            describe('and user is signed in', function () {
                beforeEach(function () {
                    fetchAccountMetadata.calls[0].args[0].ok({email: 'test@email.com'});
                });

                it('associate user with session', function () {
                    expect($window.__insp).toContain(['identify', 'test@email.com']);
                });
            });
        });
    });
});