app.controller('AppCtrl', function ($scope, $stateParams, ionicMaterialInk, $ionicPopup, $timeout, $state) {
    //ionic.material.ink.displayEffect();
    ionicMaterialInk.displayEffect();

    // Toggle Code Wrapper
    var code = document.getElementsByClassName('code-wrapper');
    for (var i = 0; i < code.length; i++) {
        code[i].addEventListener('click', function () {
            this.classList.toggle('active');
        });
    }
    


    $scope.goToSignUp = function ()
    {
        $state.go('signup', {}, { reload: true });
    }

    $scope.goToSignIn = function ()
    {
        $state.go('signin', {}, { reload: true });
    }


    
});