app.controller('publicProfileCtrl', function ($scope, $stateParams, ionicMaterialInk, $ionicPopup, $timeout, authService, $state, $window, $rootScope, profileService) {
    //ionic.material.ink.displayEffect();
    ionicMaterialInk.displayEffect();

    // Toggle Code Wrapper
    var code = document.getElementsByClassName('code-wrapper');
    for (var i = 0; i < code.length; i++) {
        code[i].addEventListener('click', function () {
            this.classList.toggle('active');
        });
    }
    $scope.init = function () {
        if ($window.localStorage["userProfile"]) {
            var obj = JSON.parse($window.localStorage["userProfile"]);
            $window.localStorage["userProfile"] = '';
            profileService.getUserDetailsById(obj.userId).then(function (data) {
                $scope.userProfile = data;
                profileService.getMomentsListByUserId(obj.userId).then(function (data) {
                    $scope.userMomentsList = data;
                    console.log($scope.userMomentsList);
                }, function (error) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Error',
                        template: error.Message
                    });
                })
            }, function (error) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: error.Message
                });
            });
        }
    }
    
    $scope.init();
    $scope.takeToUserListing = function ()
    {
        $state.go('userListing', {}, { reload: true });
    }


   



});