app.controller('FavoriteCtrl', function ($scope, $state, $window, $ionicLoading, momentService, $rootScope, $ionicPopup, ionicMaterialInk, $cordovaSQLite) {

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
        var db = $scope.db = $cordovaSQLite.openDB({ name: "my.db", location: "default" });
        $scope.show = true;
        if ($window.localStorage["userInfo"]) {
            $scope.userInfo = JSON.parse($window.localStorage["userInfo"]);

            momentService.getFavoritesListByUserId($scope.userInfo.userId).then(function (data) {
                $scope.favoritesList = [];
                for (var i = 0; i < data.length; i++) {
                    var obj;
                    if (data[i].MomentId == 0) {
                        if (data[i].IsCorrected == 0) {
                            obj = { SenderRecieverName: data[i].SenderRecieverName, ImagePath: data[i].ImagePath, Icon_Path: data[i].Icon_Path, FavouritesId: data[i].FavouritesId, AddedDate: data[i].AddedDate, Message: data[i].Message == null ? undefined : data[i].Message, CorrectedText: data[i].CorrectedText == null ? undefined : data[i].CorrectedText, IncorrectedText: data[i].IncorrectedText == null ? undefined : data[i].IncorrectedText, LocalMessageId: data[i].LocalMessageId };
                        }
                        else if (data[i].IsCorrected == 1) {
                            obj = { SenderRecieverName: data[i].SenderRecieverName, ImagePath: data[i].ImagePath, Icon_Path: data[i].Icon_Path, FavouritesId: data[i].FavouritesId, AddedDate: data[i].AddedDate, Message: data[i].Message == null ? undefined : data[i].Message, CorrectedText: data[i].CorrectedText == null ? undefined : data[i].CorrectedText, IncorrectedText: data[i].IncorrectedText == null ? undefined : data[i].IncorrectedText, inCorrectedPngSrc: "img/incorrect.png", correctedPngSrc: "img/ok.png", LocalMessageId: data[i].LocalMessageId };
                        }
                        $scope.favoritesList.push(obj);
                    }
                }
            }, function (error) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: error.Message
                });
            });
        }
    }

    $scope.init();
    $scope.takeToProfile = function () {
        $state.go('profile');
    }


    $scope.hideCard = function () {
        $scope.show = true;
    }
    $scope.alerts = function (id, message, localMessageId) {
        $scope.alertsObj = { Id: id, Message: message, LocalMessageId: localMessageId };
        $scope.show = false;
    }

    $scope.copyText = function () {
        $scope.show = true;
        $rootScope.coipedMessage = $scope.alertsObj.Message;
        var alertPopup = $ionicPopup.alert({
            title: 'Success',
            template: "Copied"
        });
    }


    $scope.delete = function () {

        var confirmPopup = $ionicPopup.show({
            title: 'Delete from favorite?',
            template: 'Are you sure you want to delete this record?',
            buttons: [{
                text: 'Cancel',
                type: 'button-royal button-outline',
            }, {
                text: 'Ok',
                type: 'button-royal',
                onTap: function () {
                    $ionicLoading.show({
                        template: 'Loading...'
                    });
                    var query = "Update ChatTable set IsFavourite= ? Where id=?";
                    $cordovaSQLite.execute($scope.db, query, [0, $scope.alertsObj.LocalMessageId]).then(function (res) {
                        momentService.deleteFavoritesById($scope.alertsObj.Id).then(function (data) {
                            $ionicLoading.hide();
                            $scope.init();
                        }, function (error) {
                            $ionicLoading.hide();
                            var alertPopup = $ionicPopup.alert({
                                title: 'Error',
                                template: error.Message
                            });
                        });
                    }, function (err) {
                        $ionicLoading.hide();
                        console.error(err);
                        //alert(err);
                    });

                }
            }]
        });
    }





});