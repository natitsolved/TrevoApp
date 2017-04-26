app.controller('ChangePasswordCtrl', function ($scope, ionicMaterialInk, $ionicPopup, $state, $window, profileService, authService) {


    //ionic.material.ink.displayEffect();
    ionicMaterialInk.displayEffect();

    // Toggle Code Wrapper
    var code = document.getElementsByClassName('code-wrapper');
    for (var i = 0; i < code.length; i++) {
        code[i].addEventListener('click', function () {
            this.classList.toggle('active');
        });
    }

    $scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;



    $scope.takeToProfile = function ()
    {
        $state.go('profile', {}, { reload: true });
    }

    $scope.changePassword = function (data)
    {
        var item = { Email: data.email, OldPassword: data.oldPwd, NewPassword: data.newPwd };
        profileService.changePassword(item).then(function (success) {
            authService.logout();
            $state.go('signin', {}, { reload: true });
        }, function (error) {
            var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: error.Message
            });
        });
    }
});