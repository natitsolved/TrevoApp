app.controller('SigninCtrl', function ($scope, $stateParams, ionicMaterialInk, $ionicPopup, $timeout, authService, $state) {
    //ionic.material.ink.displayEffect();
    ionicMaterialInk.displayEffect();
   
    // Toggle Code Wrapper
    var code = document.getElementsByClassName('code-wrapper');
    for (var i = 0; i < code.length; i++) {
        code[i].addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }
    $scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;
    //$scope.showPopup = function() {
    //    var alertPopup = $ionicPopup.alert({
    //        title: 'Wrong User name or password',
    //        template: 'Please check or create an account'
    //    });

    //    $timeout(function() {
    //        //ionic.material.ink.displayEffect();
    //        ionicMaterialInk.displayEffect();
    //    }, 0);
    //};


  
    $scope.login = function (user) {
        authService.login(user.email,user.pwd).then(function (authenticated) {
            $state.go('userListing', {}, { reload: true });
        }, function (err) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login Failed',
                template: 'Please give your credentials'
            });
        });
    };
    $scope.goToSignUp = function () {
        $state.go('signup', {}, {reload:true});
    }


    $scope.goToForgotPass = function ()
    {
        $state.go('forgotPass', {}, { reload: true });
    }
});