(function () {
    angular.module('inspectlet', ['angularx', 'checkpoint', 'config'])
        .service('inspectletRunner', ['$rootScope', '$location', '$window', '$timeout', 'config', 'resourceLoader', 'fetchAccountMetadata', InspectletRunner])
        .run(['inspectletRunner', function (runner) {
            runner.run();
        }]);

    function InspectletRunner($rootScope, $location, $window, $timeout, config, resourceLoader, fetchAccountMetadata) {
        this.run = function () {
            var host = $location.host();
            var hostToCheck = 'binarta.com';
            var isOnBinartaDomain = host.indexOf(hostToCheck, host.length - hostToCheck.length) != -1;
            if (isOnBinartaDomain && config.inspectletSiteId) $timeout(loadInspectlet, 500);
        };

        function loadInspectlet() {
            if (typeof $window.__inspld == "undefined") {
                $window.__inspld = 1;
                $window.__insp = $window.__insp || [];
                $window.__insp.push(['wid', config.inspectletSiteId]);
                resourceLoader.addScript('https://cdn.inspectlet.com/inspectlet.js');

                fetchAccountMetadata({
                    ok: function (metadata) {
                        $window.__insp.push(['identify', metadata.email]);
                    },
                    scope: $rootScope
                });
            }
        }
    }
})();