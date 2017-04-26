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
            profileService.getUserDetailsById(obj.userId).then(function (data) {
                $scope.userProfile = data;
                profileService.getMomentsListByUserId(obj.userId).then(function (data) {
                    $scope.userMomentsList = data;
                    var userDetails=JSON.parse($window.localStorage["userInfo"]);
                    var item = { Id: userDetails.userId, ScheduleId: obj.userId };
                    profileService.checkIfUserFollowsTheUser(item).then(function (data) {
                        if (data.IsSuccess) {
                            $scope.isdiplay = true;
                            $scope.followLabel = "Unfollow";
                        }
                        else {
                            $scope.isdiplay = false;
                            $scope.followLabel = "Follow";
                        }
                       
                    }, function (err1) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Error',
                            template: err1.Message
                        });
                    })
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

    $scope.goToChat = function (userId, name, imagePath) {
        var userDetails = { userId: userId, name: name, imagePath, imagePath };
        $window.localStorage["userDetails"] = JSON.stringify(userDetails);
        $state.go('chat', {}, { reload: true });
    }
   

    $scope.follow = function (userId)
    {
        if ($window.localStorage["userInfo"])
        {
            var userDetails = JSON.parse($window.localStorage["userInfo"]);
            var myElement = angular.element(document.querySelector('#followId'));
            if (myElement[0].className == "icon ion-android-bicycle") {
                var item = { FollowerUserId: userDetails.userId, FollowingUserId: userId };
                profileService.saveUserFollowDetails(item).then(function (data) {
                    $state.go('publicProfile', {}, { reload: true });
                });
            }
            else {
                var item = { FollowerUserId: userDetails.userId, FollowingUserId: userId };
                profileService.removeUserFollowDetails(item).then(function (data) {
                    $state.go('publicProfile', {}, { reload: true });
                });
            }
        }
    }



    $scope.block = function (userID)
    {
        if ($window.localStorage["userInfo"])
        {
             var confirmPopup = $ionicPopup.show({
            title: 'Block User?',
            template: 'Are you sure you want to block this user?',
            buttons: [{
                text: 'Cancel',
                type: 'button-royal button-outline',
            }, {
                text: 'Ok',
                type: 'button-primary',
                onTap: function () {
                    var userDetails = JSON.parse($window.localStorage["userInfo"]);
            profileService.blockUser(userDetails.userId, userID).then(function (data) {
                $state.go('userListing', {}, { reload: true });
            }, function (error) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: error.Message
                });
            });
                }
            }]
        });
           
        }
    }



});