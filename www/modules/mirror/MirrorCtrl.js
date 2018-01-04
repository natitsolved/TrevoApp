app.controller('MirrorCtrl', function ($scope, momentService, ionicMaterialInk, $ionicPopup, $rootScope, $state, $window, $timeout, $ionicLoading) {
    ionicMaterialInk.displayEffect();
    // Toggle Code Wrapper
    var code = document.getElementsByClassName('code-wrapper');
    for (var i = 0; i < code.length; i++) {
        code[i].addEventListener('click', function () {
            this.classList.toggle('active');
        });
    }


    function markMomentFav() {
        $ionicLoading.show({
            template: 'Loading...'
        });
        if ($window.localStorage["userInfo"]) {
            var userDetails = JSON.parse($window.localStorage["userInfo"]);
            if (userDetails.favMomentList) {
                for (var i = 0; i < $scope.momentsList.length; i++) {
                    if (userDetails.favMomentList.indexOf($scope.momentsList[i].MomentId) >= 0) {
                        var Id = "heart_" + $scope.momentsList[i].MomentId;
                        var myElement = angular.element(document.querySelector('#' + Id));
                        if (myElement[0]) {
                            myElement[0].style.color = "red";
                        }
                    }
                    else {
                        var Id = "heart_" + $scope.momentsList[i].MomentId;
                        var myElement = angular.element(document.querySelector('#' + Id));
                        if (myElement[0]) {
                            myElement[0].style.color = "grey";
                        }
                    }
                }
            }
        }

        if ($window.localStorage["disCoverActiveMenu"]) {
            var activeValue = $window.localStorage["disCoverActiveMenu"];
            if (activeValue == "classMate") {
                $rootScope.isFollowingActive = false;
                $rootScope.isClassMateActive = true;
            }
            else if (activeValue == "following") {
                $rootScope.isFollowingActive = true;
                $rootScope.isClassMateActive = false;
            }
            $window.localStorage["disCoverActiveMenu"] = '';
        }
        else {
            $rootScope.isFollowingActive = false;
            $rootScope.isClassMateActive = false;
        }

        $ionicLoading.hide();
    }
    $scope.getAllMoments = function () {
          var userDetails = JSON.parse($window.localStorage["userInfo"]);
          var obj={NativeLang:userDetails.nativeLang,LearningLang:userDetails.learningLang};
        momentService.getAllMomentsForExchange(obj).then(function (data) {
            $scope.momentsList = data;
            $timeout(markMomentFav, 2000);
        }, function (err) {
            var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: 'There is some error. Please try again later.'
            });
        });
    }


    $scope.takeToAddMomentPage = function (id) {
        momentService.getAllMomentListByParentId(id).then(function (data) {
            $rootScope.momentsListByParentId = data;
            $rootScope.parentMomentId = id;
            $state.go('discoverList', {}, { reload: true });
        }, function (error) {
            var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: 'There is some error. Please try again later.'
            });
        });
    }


    $scope.markMomentAsFav = function (id, posterUserId) {
        if ($window.localStorage["userInfo"]) {
            $ionicLoading.show({
                template: 'Loading...'
            });
            var userDetails = JSON.parse($window.localStorage["userInfo"]);
            var Id = "heart_" + id;
            var myElement = angular.element(document.querySelector('#' + Id));
            if (myElement[0].style.color == "red") {
                momentService.removeMomentAsFavourite(userDetails.userId, id).then(function (data) {
                    var newMomentList = userDetails.favMomentList;
                    userDetails.favMomentList = [];
                    for (var i = 0; i < newMomentList.length; i++)
                    {
                        if (newMomentList[i] != id)
                        {
                            userDetails.favMomentList.push(newMomentList[i]);
                        }
                    }
                    $window.localStorage["userInfo"] = '';
                    $window.localStorage["userInfo"] = JSON.stringify(userDetails);
                    $ionicLoading.hide();
                    $state.go('discover', {}, { reload: true });

                }, function (error) {
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                        title: 'Error',
                        template: 'There is some error. Please try again later.'
                    });

                });
            }
            else {
                var isSender;
                if (userDetails.userId == posterUserId) {
                    isSender = 1;
                }
                else {
                    isSender = 0;
                }
                var item = { Message: '', FavouriteUserId: userDetails.userId, IsSender: isSender, SenderRecieverId: posterUserId, MomentId: id };
                momentService.markMomentAsFavourite(item).then(function (data) {
                    if(userDetails.favMomentList)
                    {}
                    else
                    {
                        userDetails.favMomentList=[];
                    }
                    userDetails.favMomentList.push(id);
                    $window.localStorage["userInfo"] = '';
                    $window.localStorage["userInfo"] = JSON.stringify(userDetails);
                    $ionicLoading.hide();
                    $state.go('discover', {}, { reload: true });
                }, function (error) {
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                        title: 'Error',
                        template: 'There is some error. Please try again later.'
                    });

                });
            }

        }
    }


    $scope.getAllMoments();


    $scope.takeToDiscover = function () {
        $state.go('discover', {}, { reload: true });
    }


    $scope.PostMoment = function (data, files) {
        if (data || files) {
            if ($window.localStorage["userInfo"]) {
                var userDetails = JSON.parse($window.localStorage["userInfo"]);
                var obj = { userId: userDetails.userId, parentId: $rootScope.parentMomentId, text: data, file: files };

                momentService.saveMoments(obj).then(function (data) {
                    $state.go('discover', {}, { reload: true });
                }, function (error) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Error',
                        template: error
                    });
                });
            }

        }
        else {
            var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: 'Please upload an image or write a message first to post a moment.'
            });
        }
    }


    $scope.doRefresh = function () {
        $scope.getAllMoments();
        $scope.$broadcast('scroll.refreshComplete');
    }

    $scope.showButton = function () {
        $scope.showPasteButton = true;
    }
    $scope.pasteText = function () {

        $scope.showPasteButton = false;
        if ($rootScope.coipedMessage) {
            $scope.data = $rootScope.coipedMessage;
        }
    }

    $scope.goToChatbot = function () {
        $state.go('chatbot', {}, { reload: true });
    }
    $scope.getMomentsByCriteria = function (value) {
        if ($window.localStorage["userInfo"])
        {
            var userDetails = JSON.parse($window.localStorage["userInfo"]);
            momentService.getAllMomentListByCriteria(userDetails.nativeLang, userDetails.learningLang, userDetails.userId, value).then(function (data) {
                $rootScope.mirrorListByLang = data;
                $window.localStorage["disCoverActiveMenu"] = value == true ? "classMate" : "following";
                $state.go('discoverListByLang', {}, { reload: true });
            }, function (error) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: error.Message
                });
            })

        }
    }


    $scope.getDefaultMoments = function ()
    {
        $state.go('discover', {}, { reload: true });
    }

    $scope.doLangListRefresh = function ()
    {
        if ($rootScope.isClassMateActive)
            $scope.getMomentsByCriteria(true);
        else
            $scope.getMomentsByCriteria(false);
        $scope.$broadcast('scroll.refreshComplete');
    }

});
