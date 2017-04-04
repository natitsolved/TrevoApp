app.controller('ForgotPswdCtrl', function ($scope, $stateParams, ionicMaterialInk, $ionicPopup, $timeout, authService, $state, $window, $rootScope) {
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

    $scope.forgotpassword = function (email)
    {
        authService.sendForgotpassword(email).then(function (res) {
            var alertPopup = $ionicPopup.alert({
                title: 'Password changed',
                template: 'Please check your mail for your new password and sign in again.'
            });
            alertPopup.then(function (res) {
                $state.go('signin', {}, { reload: true });
            });
        }, function (err) {
            var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: err.Message
            });
        });
    }
});