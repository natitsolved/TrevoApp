app.controller('RegisterCtrl', function ($scope, $stateParams, ionicMaterialInk, $ionicPopup, $timeout, authService, $state, $ionicLoading, $timeout, $window, $cordovaDevice) {
    //ionic.material.ink.displayEffect();
    ionicMaterialInk.displayEffect();

    // Toggle Code Wrapper
    var code = document.getElementsByClassName('code-wrapper');
    for (var i = 0; i < code.length; i++) {
        code[i].addEventListener('click', function () {
            this.classList.toggle('active');
        });
    }
    $scope.isShowText = true;
    $scope.isShowImg = false;
    $scope.isShowNatText = true;
    $scope.isShowAbbrv = false;
    $scope.isShowLearningText = true;
    $scope.isShowLearningAbbrev = false;
    $scope.datafirst = {};
    $scope.data = {};
    $scope.udl = { country: '', nativeLanguage: '', learningLanguage: '', languagelevel: '' };
    var uuid = $cordovaDevice.getUUID();
    $scope.signup = function () {
        if ($scope.udl.country && $scope.udl.nativeLanguage && $scope.udl.learningLanguage && $scope.udl.languagelevel) {
            var firstencodedString = JSON.parse($window.localStorage["firstencodedString"]);
            firstencodedString = JSON.parse(firstencodedString);
            var externalLoginInfo = JSON.parse($window.localStorage["externalLoginInfo"]);
            var data = { Email: firstencodedString.Email, Name: firstencodedString.Name, Dob: firstencodedString.Dob, Gender: firstencodedString.Gender, DeviceId: uuid, CountryId: $scope.udl.country, NativeLanguageId: $scope.udl.nativeLanguage, LearningLanguageId: $scope.udl.learningLanguage, LanguageLevelId: $scope.udl.languagelevel, ExternalAuthType: externalLoginInfo.externalAuthType, ExternalAuthUserId: externalLoginInfo.externalAuthId };
            //var firstencodedString = JSON.stringify({ Email: firstencodedString.Emailn, Password: firstencodedString.Passwordn, Name: firstencodedString.Namen, Dob: firstencodedString.Dobn, Gender: firstencodedString.Gendern, DeviceId: "deviceId", CountryId: $scop.udl.country, NativeLanguageId: $scop.udl.nativeLanguage, LearningLanguageId: $scop.udl.learningLanguage, LanguageLevelId: $scop.udl.languagelevel });
            authService.register(data).then(function (authenticated) {
                //$scope.setCurrentSession(authService.getUserInfo());
                //$scope.setCurrentUsername(authenticated);
                $state.go('userListing', {}, { reload: true });

            }, function (err) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Registration failed!',
                    template: err
                });
            });
        }
        else
        {
            var alertPopup = $ionicPopup.alert({
                title: 'All filelds are mandetory',
                template: 'Some problem occurs'
            });
        }
    };
    $scope.goToWelcome = function () {
        $state.go('afterSplash', {}, { reload: true });
    }
    $scope.goFirstSignUp = function () {
        $state.go('signup');
    }
    $scope.user = { email: '', pwd: '', name: '', dob: '', user_type:'' };
    $scope.gotoNextSignUp = function () {
        $timeout(countUp, 500);
        
        if ($scope.user.email && $scope.user.pwd && $scope.user.name && $scope.user.dob && $scope.user.user_type)
        {
            var firstencodedString = JSON.stringify({ Email: $scope.user.email, Password: $scope.user.pwd, Name: $scope.user.name, Dob: $scope.user.dob, Gender: $scope.user.user_type });
            $window.localStorage["firstencodedString"] = JSON.stringify(firstencodedString);
            $state.go('signupnext');
        }
        else
        {
            var alertPopup = $ionicPopup.alert({
                title: 'All filelds are mandetory',
                template: 'Some problem occurs'
            });
        }
       
    }

    $scope.udl = { country: '', nativeLanguage: '', learningLanguage: '', languagelevel: ''};
    $scope.gotoChat = function () {
        $timeout(countUp, 500);
        
        if ($scope.udl.country && $scope.udl.nativeLanguage && $scope.udl.learningLanguage && $scope.udl.languagelevel) {
            var secondencodedString = JSON.stringify({ Email: $scope.user.email, Password: $scope.user.pwd, Name: $scope.user.name, Dob: $scope.user.dob, Gender: $scope.user.user_type });
            $window.localStorage["firstencodedString"] = JSON.stringify(firstencodedString);
            $state.go('signupnext', {}, { reload: true });
        }
        else {
            var alertPopup = $ionicPopup.alert({
                title: 'All filelds are mandetory',
                template: 'Some problem occurs'
            });
        }

    }
    var countUp = function () {

        console.log($scope.user.email);
    }
 
    $scope.datePickerCallback = function (val) {
        if (!val) {
            console.log('Date not selected');
        } else {
            console.log('Selected date is : ', val);
        }
    };
    var fbLoginSuccess = function (response) {
        if (!response.authResponse) {
            fbLoginError("Cannot find the authResponse");
            return;
        }
      
        //This method is executed when the user press the "Login with facebook" button
       
    }
    var fbLoginError = function (error) {
        console.log('fbLoginError', error);
        $ionicLoading.hide();
    };
    $scope.facebookSignIn = function () {
        alert("hi");
        //console.log('hi');
        facebookConnectPlugin.getLoginStatus(function (success) {


            // Ask the permissions you need. You can learn more about
            // FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
            facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);

        });

    }

    $scope.googleSignIn = function () {
        window.plugins.googleplus.login(
     {
         'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
         'webClientId': '573674606386-inq1ijsa8hbpj2o57fd5slbgu81b6lan.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
         'offline': true, // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
     },
     function (obj) {
         var userId = obj.userId;
         authService.externalLogin(userId).then(function (data) {
             $state.go('userListing', {}, { reload: true });
         }, function (error) {
             $window.localStorage["externalAuthId"] = userId;
             $state.go('')
             console.log(error);
         });
     },
     function (msg) {
         alert('error: ' + msg);
     }
 );
    };



    $scope.getTheFlagIcon = function ()
    {
        $scope.isShowText = false;
        $scope.isShowImg = true;
        if ($scope.udl.country == "1") {
            $scope.imgSrc = "img/india_flag_circle-128.png";
        }
        else if ($scope.udl.country == "2")
        {
            $scope.imgSrc = "img/australia-128.png";
        }
        else if ($scope.udl.country == "3")
        {
            $scope.imgSrc = "img/France Flag.ico";
        }
    }


    $scope.getTheAbbreviation = function ()
    {
        $scope.isShowNatText = false;
        $scope.isShowAbbrv = true;
        if ($scope.udl.nativeLanguage == "1")
        {
            $scope.NatAbbrv = "BN";
        }
        else if ($scope.udl.nativeLanguage == "2") {
            $scope.NatAbbrv = "FR";
        }
        else if ($scope.udl.nativeLanguage == "3") {
            $scope.NatAbbrv = "EN";
        }
    }

    $scope.getTheLearningAbbreviation = function ()
    {
        $scope.isShowLearningText = false;
        $scope.isShowLearningAbbrev = true;
        if ($scope.udl.learningLanguage == "1") {
            $scope.LearningAbbrev = "EN";
        }
        else if ($scope.udl.learningLanguage == "2") {
            $scope.LearningAbbrev = "BN";
        }
        else if ($scope.udl.learningLanguage == "3") {
            $scope.LearningAbbrev = "FR";
        }
    }
});