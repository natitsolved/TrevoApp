app.controller('MenuCtrl', function ($scope, authService, $state, $window) {


   
    $scope.init = function ()
    {
        if ($window.localStorage["activeFooter"]) {
            var activeFooter = $window.localStorage["activeFooter"];
            if (activeFooter == "moment") {
                $scope.isMomentActive = true;
                $scope.isUserActive = false;
                $scope.isSearchActive = false;
                $scope.isProfileActive = false;
            }
            else if (activeFooter == "user") {
                $scope.isUserActive = true;
                $scope.isMomentActive = false;
                $scope.isSearchActive = false;
                $scope.isProfileActive = false;
            }
            else if (activeFooter == "search")
            {
                $scope.isUserActive = false;
                $scope.isMomentActive = false;
                $scope.isSearchActive = true;
                $scope.isProfileActive = false;
            }
            else if (activeFooter == "profile")
            {
                $scope.isUserActive = false;
                $scope.isMomentActive = false;
                $scope.isSearchActive = false;
                $scope.isProfileActive = true;
            }
        }
        else {
            $scope.isUserActive = true;
        }
    }
    $scope.takeToMoments = function () {
        $window.localStorage["activeFooter"] = "moment";
        $state.go('discover', {}, { reload: true });
    }

    $scope.logOut = function () {
        authService.logout();
        $state.go('signin', {}, { reload: true });
    }


    $scope.takeToUserListing = function ()
    {
        $window.localStorage["activeFooter"] = "user";
        $state.go('userListing', {}, { reload: true });
    }

    $scope.takeToProfile = function ()
    {
        $window.localStorage["activeFooter"] = "profile";
        $state.go('profile', {}, { reload: true });
    }

    $scope.takeToSearch = function ()
    {
        $window.localStorage["activeFooter"] = "search";
        $state.go('search', {}, { reload: true });
    }
    $scope.init();
});