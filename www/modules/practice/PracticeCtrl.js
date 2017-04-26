app.controller('PracticeCtrl', function ($scope, $state, $window,$ionicLoading,momentService,$rootScope,$http) {


$scope.IsReadOnly=true;
$scope.dictionary = new Typo("en_US", false, false, { dictionaryPath: "js/dictionaries" });

$scope.userInfo=JSON.parse($window.localStorage["userInfo"]);
$scope.speakText=function(value)
{
console.log(value);
    $ionicLoading.show({
            template: 'Loading...'
        });
         $scope.isShowSuggestion=false;
        var Id = "inputContent";
        var myElement1 = angular.element(document.querySelector('#' + Id));
        myElement1[0].style.color = "black";
        myElement1[0].style.textDecoration = "none";
        Id = "correctContent";
        myElement1 = angular.element(document.querySelector('#' + Id));
        myElement1[0].style.color = "black";
         var item = { User_Id: $scope.userInfo.userId, IsTTS: 1, Details: value };
          momentService.insertTransliterationDetails(item).then(function (data) {
            window.TTS.speak({
                text: value,
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


$scope.translateText=function(value)
{
     $ionicLoading.show({
            template: 'Loading...'
        });
         $scope.isShowSuggestion=false;
        var Id = "inputContent";
        var myElement1 = angular.element(document.querySelector('#' + Id));
        myElement1[0].style.color = "black";
        myElement1[0].style.textDecoration = "none";
         Id = "correctContent";
        myElement1 = angular.element(document.querySelector('#' + Id));
        myElement1[0].style.color = "black";
        var item = { User_Id: $scope.userInfo.userId, IsTranslate: 1, Details: value };
            momentService.insertTransliterationDetails(item).then(function (data) {
                var targetEn = $scope.userInfo.nativeLang;
                if (targetEn) {
                    var sourceEn = "en";
                    var urlToHit = 'https://translation.googleapis.com/language/translate/v2?key=' + $rootScope.googleTranslateApiKey + '&source=' + sourceEn + '&target=' + targetEn + '&q=' + value;
                    $http({
                        url: urlToHit,
                    }).then(function (data) {
                        $scope.outputText=data.data.data.translations[0].translatedText;
                        $ionicLoading.hide();
                    }, function (error) {
                       $ionicLoading.hide();
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



$scope.spellCorrection=function(value)
{
$ionicLoading.show({
            template: 'Loading...'
        });
var message = value; 
        var item = { User_Id: $scope.userInfo.userId, IsSpellCheck: 1, Details: value };
        momentService.insertTransliterationDetails(item).then(function (data) {
          $scope.isShowSuggestion=true;
            $scope.array_of_suggestions = $scope.dictionary.suggest(message);
            $ionicLoading.hide();
        }, function (error) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: error.Message
            });
        });
}

$scope.showRight = function (id, item) {
        $ionicLoading.show({
            template: 'Loading...'
        });
        var Id = "rightDiv_" + id;
        console.log(Id);
        var allElements = angular.element(document.querySelectorAll('[id^="rightDiv_"]'));
        for (var i = 0; i < allElements.length; i++) {
            allElements[i].innerHTML = '';
        }
        var myElement = angular.element(document.querySelector('#' + Id));
        console.log(myElement);
        if (myElement[0].innerHTML) {
            myElement[0].innerHTML = '';
        }
        else {
            myElement[0].innerHTML = '<img src="img/ok.png" style="border:none !important;width:12px;float:right;"/>';
        }
        Id = "inputContent";
        var myElement1 = angular.element(document.querySelector('#' + Id));
        myElement1[0].style.color = "red";
        myElement1[0].style.textDecoration = "line-through";
        Id = "correctContent";
        myElement1 = angular.element(document.querySelector('#' + Id));
        myElement1[0].style.color = "green";
        $scope.outputText = item;
        $scope.isShowImg = true;
        if ($scope.isShowCorrect == false) {
            $scope.isShowCorrect = true;
        }
        else {
            $scope.isShowCorrect = true;
        }
        $ionicLoading.hide();

    }
    

    $scope.takeToProfile=function()
    {
$state.go('profile',{},{reload:true});

    }

    $scope.reset=function()
    {
        $state.go('practice',{},{reload:true});
    }
});