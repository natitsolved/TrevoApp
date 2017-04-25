app.controller('advancedSearchCtrl', function ($scope, ionicMaterialInk, $ionicPopup, $state, momentService, $window, $rootScope, $timeout, $ionicLoading, authService) {


    //ionic.material.ink.displayEffect();
    ionicMaterialInk.displayEffect();

    // Toggle Code Wrapper
    var code = document.getElementsByClassName('code-wrapper');
    for (var i = 0; i < code.length; i++) {
        code[i].addEventListener('click', function () {
            this.classList.toggle('active');
        });
    }

   
    $scope.getCountryList = function ()
    {
        momentService.getAllCountry().then(function (data) {
            $scope.countryList = data;
        }, function (error) {
            var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: error.Message
            });
        });
    }


    $scope.getLanguageList = function ()
    {
        momentService.getAllLanguages().then(function (data) {
            $scope.languageList = data;
        }, function (error) {
            var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: error.Message
            });
        })
    }
    $scope.getCountryList();
    $scope.getLanguageList();
    if ($window.localStorage["userInfo"])
    {
        $scope.userInfo = JSON.parse($window.localStorage["userInfo"]);
    }
    $scope.takeToSearch = function ()
    {
        $state.go('search', {}, { relload: true });
    }

    $scope.langLevelList = [];
    $scope.langLevelList.push({ LevelId: 1, LevelName: "Beginner" });
    $scope.langLevelList.push({ LevelId: 3, LevelName: "Intermediate" });
    $scope.langLevelList.push({ LevelId: 4, LevelName: "Professional" });
    $scope.advancedSearch = function (selectedCountry, selectedCity, selectedNatLanguage, selectedLearnLanguage, selectedLangLevel)
    {
        var langLevelIds;
        var allElements = angular.element(document.querySelectorAll('[id^="rightDiv"]'));
        for (var i = 0; i < allElements.length; i++) {
            if (allElements[i].innerHTML) {
                if (langLevelIds) {
                    langLevelIds = langLevelIds + "," + allElements[i].id.split('_')[1];
                }
                else {
                    langLevelIds = allElements[i].id.split('_')[1];
                }
            }
        }

        if (!langLevelIds && !selectedCountry && !selectedCity && !selectedNatLanguage && !selectedLearnLanguage) {
            var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: "Atleast one field is required to search."
            });
        }
        else {
            var item = { nationalityId: selectedCountry, address: selectedCity, natLangId: selectedNatLanguage, learningLangId: selectedLearnLanguage, langLevelId: langLevelIds };
            authService.getAllUsersForAdvancedSearch(item).then(function (data) {
                $rootScope.advancedUserList = data;
                $state.go('advancedSearchUserListing', {}, { reload: true });
            }, function (error) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: error.Message
                });
            });
        }
    }

    $scope.showRight = function (id) {
        var Id = "rightDiv_" + id;
        console.log(Id);
        var myElement = angular.element(document.querySelector('#' + Id));
        console.log(myElement);
        var allElements = angular.element(document.querySelectorAll('[id^="rightDiv"]'));
        for (var i = 0; i < allElements.length; i++)
        {
            if (allElements[i].id != myElement[0].id)
            allElements[i].innerHTML = '';
        }
        if (myElement[0].innerHTML) {
            myElement[0].innerHTML = '';
        }
        else {
            myElement[0].innerHTML = '<img src="img/emblem_ok.png" style="border:none !important;width:12px;float:right;"/>';
        }

    }
});