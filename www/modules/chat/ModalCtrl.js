app.controller('ModalCtrl', function ($scope, $stateParams, ionicMaterialInk, $ionicPopup, $timeout, authService, $state, $window, $rootScope, $http, momentService) {
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
        if ($window.localStorage["translateInfo"] != undefined) {
            var translateInfo = JSON.parse($window.localStorage["translateInfo"]);
            var userDetails = JSON.parse($window.localStorage["userInfo"]);
            var item = { User_Id: userDetails.userId, IsTranslate: 1, Details: translateInfo.text };
            momentService.insertTransliterationDetails(item).then(function (data) {
                var sourceEn = translateInfo.sourceEn.toUpperCase();
                var targetEn = translateInfo.targetEn;
                 $scope.nativeLanguage = sourceEn;
                  $scope.changeLanguage = targetEn;
                var text = translateInfo.text;
                $scope.toTranslateText = text;
                // $scope.message = "dhfgshjdf";
                var urlToHit = 'https://translation.googleapis.com/language/translate/v2?key=' + $rootScope.googleTranslateApiKey + '&source=' + sourceEn + '&target=' + targetEn + '&q=' + text;
                $http({
                    url: urlToHit,
                }).then(function (data) {

                    console.log(data.data.data.translations[0].translatedText);
                    $scope.message = data.data.data.translations[0].translatedText;
                    $window.localStorage["translateInfo"] = undefined;

                }, function (error) { 
                    $scope.message=translateInfo.text;
                    console.log(error.data.error.message);
                });
            }, function (error) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: error.Message
                });
            });
        }
    }

    $scope.init();



    $scope.goToChat = function () {
        if ($rootScope.fromPage) {
            if ($rootScope.fromPage == 'chat') {
                $state.go('chat');
            }
            else if ($rootScope.fromPage == 'chatBot') {
                $state.go('chatbot');
            }
        }
    }

    $scope.SendChat = function (message) {
        $window.localStorage["messageToSend"] = message;
        if ($rootScope.fromPage) {
            if ($rootScope.fromPage == 'chat') {
                $state.go('chat', {}, { reload: true });
            }
            else if ($rootScope.fromPage == 'chatBot') {
                $state.go('chatbot', {}, { reload: true });
            }
        }

    }



    $scope.changeTranslation = function (changeLanguage) {
        if ($window.localStorage["userInfo"]) {
            console.log($scope.toTranslateText);
            var userDetails = JSON.parse($window.localStorage["userInfo"]);
            var item = { User_Id: userDetails.userId, IsTranslate: 1, Details: changeLanguage };
            momentService.insertTransliterationDetails(item).then(function (data) {
                console.log(changeLanguage);
                console.log($scope.toTranslateText);
                 var myElement = angular.element(document.querySelector('#inputTextContent'));
                var text = myElement[0].value;
                $scope.toTranslateText=text;
                var urlToHitForDetection = 'https://translation.googleapis.com/language/translate/v2/detect?key=' + $rootScope.googleTranslateApiKey + '&q=' + text;
                $http({
                    url: urlToHitForDetection
                }).then(function (data) {
                    var sourceEn = data.data.data.detections[0][0].language;
                    var target = changeLanguage;
                    var urlToHit = 'https://translation.googleapis.com/language/translate/v2?key=' + $rootScope.googleTranslateApiKey + '&source=' + sourceEn + '&target=' + target + '&q=' + text;
                    $http({
                        url: urlToHit,
                    }).then(function (data) {

                        console.log(data.data.data.translations[0].translatedText);
                        $scope.message = data.data.data.translations[0].translatedText;
                        $window.localStorage["translateInfo"] = undefined;

                    }, function (error) {
                         $scope.message=text;
                        console.log(error.data.error.message);
                    });
                }, function (error1) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Error',
                        template: error1.Message
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

    $scope.changeTranslationDirectly = function (changeLanguage, toTranslateText) {
        if (changeLanguage && toTranslateText) {
            $scope.toTranslateText = toTranslateText;
            $scope.changeTranslation(changeLanguage);
        }
    }

});