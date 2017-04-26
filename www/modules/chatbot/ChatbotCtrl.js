app.controller('ChatbotCtrl', function ($scope, $stateParams, ionicMaterialInk, $ionicPopup, $timeout, authService, $state, $window, $rootScope, $ionicLoading, $http, Upload, momentService) {
    //ionic.material.ink.displayEffect();
    ionicMaterialInk.displayEffect();

   
    // Toggle Code Wrapper
    var code = document.getElementsByClassName('code-wrapper');
    for (var i = 0; i < code.length; i++) {
        code[i].addEventListener('click', function () {
            this.classList.toggle('active');
        });
    }
    $scope.show = true;
    if ($scope.ChatBotList == undefined)
    {
        $scope.ChatBotList = [];
    }
    $scope.userInfo = JSON.parse($window.localStorage["userInfo"]);
    console.log($scope.userInfo);
    $scope.dictionary = new Typo("en_US", false, false, { dictionaryPath: "js/dictionaries" });

   
    $scope.isdiplay = false;
  
   
     
    $scope.hideCard = function () {
        $scope.show = true;
    }

   
    $scope.send_chat = function (data) {
        $scope.isdiplay = false;
        console.log($scope.userInfo);
        var reciverId = $scope.recieverId;
        var pushData = { message: $scope.data, IsSender: 1 };
        $scope.ChatBotList.push(pushData);
        authService.sendMsg(pushData.message).then(function (data) {
            var pushData = { message: data, IsSender: 0 };
            $scope.ChatBotList.push(pushData);
            $scope.data = '';

        }, function (error) {

            console.log(error);
        })

    }


    $scope.takebotToUserListing = function () {
        $state.go('userListing', {}, { reload: true });
    }
   
    $scope.alerts = function (id, message, isSender, messageId) {
        $scope.transaltionObj = { id: id, message: message, isSender: isSender, messageID: messageId };
        $scope.show = false;
    }

    $scope.speakText = function () {
        $ionicLoading.show({
            template: 'Loading...'
        });
        var message = $scope.transaltionObj.message;
        var item = { User_Id: $scope.userInfo.userId, IsTTS: 1, Details: message };
        momentService.insertTransliterationDetails(item).then(function (data) {
            window.TTS.speak({
                text: message,
                locale: 'en-GB',
                rate: 1.5
            }, function () {
                $scope.show = true;
                $ionicLoading.hide();
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            }, function () {
                $ionicLoading.hide();
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            });
        }, function (error) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: error.Message
            });
        });


    }
    $scope.tranlateToNativeLang = function () {
        console.log($scope.transaltionObj);
        $scope.show = true;
        if ($window.localStorage["userInfo"]) {
            var item = { User_Id: $scope.userInfo.userId, IsTranslate: 1, Details: $scope.transaltionObj.message };
            momentService.insertTransliterationDetails(item).then(function (data) {
                var element;
                var isSender = $scope.transaltionObj.isSender;
                if (isSender == 1) {
                    if ($scope.hideShowLoader == undefined) {
                        $scope.hideShowLoader = [];
                    }
                    $scope.hideShowLoader[$scope.transaltionObj.id] = true;
                }
                else {
                    if ($scope.rcvrHideShowLoader == undefined) {
                        $scope.rcvrHideShowLoader = [];
                    }
                    $scope.rcvrHideShowLoader[$scope.transaltionObj.id] = true;
                }
                var userDetails = JSON.parse($window.localStorage["userInfo"]);
                var targetEn = userDetails.nativeLang;
                if (targetEn) {
                    var sourceEn = "en";
                    if (isSender == 1)
                        element = "translatedText_" + $scope.transaltionObj.id;
                    else
                        element = "rcvrTranslatedText_" + $scope.transaltionObj.id;
                    var myElement = angular.element(document.querySelector('#' + element));
                    var urlToHit = 'https://translation.googleapis.com/language/translate/v2?key=' + $rootScope.googleTranslateApiKey + '&source=' + sourceEn + '&target=' + targetEn + '&q=' + $scope.transaltionObj.message;
                    $http({
                        url: urlToHit,
                    }).then(function (data) {
                        myElement[0].innerHTML = data.data.data.translations[0].translatedText;
                        if (isSender == 1) {
                            $scope.hideShowLoader[$scope.transaltionObj.id] = false;
                        }
                        else {
                            $scope.rcvrHideShowLoader[$scope.transaltionObj.id] = false;
                        }
                    }, function (error) {
                        if (isSender == 1) {
                            $scope.hideShowLoader[$scope.transaltionObj.id] = false;
                        }
                        else {
                            $scope.rcvrHideShowLoader[$scope.transaltionObj.id] = false;
                        }
                        var alertPopup = $ionicPopup.alert({
                            title: 'Incorect',
                            template: error.data.error.message
                        });
                    });
                }
            }, function (error) {
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: error.Message
                });
            });


        }

    }
});