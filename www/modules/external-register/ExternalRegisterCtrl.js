app.controller('ExternalRegisterCtrl', function ($scope, $stateParams, ionicMaterialInk, $ionicPopup, $timeout, authService, $state, $ionicLoading, $timeout, $window, $cordovaDevice) {
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
        
        if ($scope.user.email && $scope.user.name && $scope.user.dob && $scope.user.user_type)
        {
            var firstencodedString = JSON.stringify({ Email: $scope.user.email, Name: $scope.user.name, Dob: $scope.user.dob, Gender: $scope.user.user_type });
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
            var secondencodedString = JSON.stringify({ Email: $scope.user.email, Name: $scope.user.name, Dob: $scope.user.dob, Gender: $scope.user.user_type });
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