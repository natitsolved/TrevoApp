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

   
    $scope.advancedSearch = function (selectedCountry, selectedCity, selectedNatLanguage, selectedLearnLanguage, selectedLangLevel)
    {
        if (!selectedLangLevel && !selectedCountry && !selectedCity && !selectedNatLanguage && !selectedLearnLanguage) {
            var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: "Atleast one field is required to search."
            });
        }
        else {
            var item = { nationalityId: selectedCountry, address: selectedCity, natLangId: selectedNatLanguage, learningLangId: selectedLearnLanguage, langLevelId: selectedLangLevel };
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

    
});