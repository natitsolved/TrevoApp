app.controller('MenuCtrl', function ($scope, authService, $state) {

    $scope.takeToMoments = function () {
        $state.go('discover', {}, { reload: true });
    }

    $scope.logOut = function () {
        authService.logout();
        $state.go('signin', {}, { reload: true });
    }


    $scope.takeToUserListing = function ()
    {
        $state.go('userListing', {}, { reload: true });
    }

    $scope.takeToProfile = function ()
    {
        $state.go('profile', {}, { reload: true });
    }

    $scope.takeToSearch = function ()
    {
        $state.go('search', {}, { reload: true });
    }
});