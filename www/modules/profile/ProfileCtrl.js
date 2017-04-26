app.controller('ProfileCtrl', function ($scope, ionicMaterialInk, $ionicPopup, $state, momentService, $window, profileService, $rootScope, $timeout,$ionicLoading) {


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
        if ($window.localStorage["userInfo"]) {
            $scope.userInfo = JSON.parse($window.localStorage["userInfo"]);
            $scope.userId = $scope.userInfo.userId;
            profileService.getUserDetailsById($scope.userId).then(function (data) {
                $scope.userDetails = data;
                $scope.selfIntro = data.Self_Introduction;
                var item = { Id: $scope.userId, ScheduleId: 1 };
                profileService.getUserFollowerFollowingList(item).then(function (data) {
                    item = { Id: $scope.userId, ScheduleId: 0 };
                    $scope.followersCount = data.length;
                    profileService.getUserFollowerFollowingList(item).then(function (data1) {
                        $scope.followingCount = data1.length;
                    }, function (err2) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Error',
                            template: err2.Message
                        });
                    });
                }, function (err1) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Error',
                        template: err1.Message
                    });
                });
            }, function (error) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: error.Message
                });
            });
        }
    }

    $scope.addNewDiscover = function () {
        $state.go('newDiscover', {}, { reload: true });
    }

    $scope.takeToProfile = function () {
        $state.go('profile', {}, { reload: true });
    }


    $scope.PostMoment = function (data, files) {
        if (data || files) {
            if ($window.localStorage["userInfo"]) {
                var userDetails = JSON.parse($window.localStorage["userInfo"]);
                var obj = { userId: userDetails.userId, parentId: 0, text: data, file: files };

                momentService.saveMoments(obj).then(function (data) {
                    $state.go('profile', {}, { reload: true });
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

    $scope.takeToUpdatePage = function (isSelfIntro, content) {
        $rootScope.isSelfIntro = isSelfIntro;
        $rootScope.content = content;
        $state.go('userUpdate', {}, { reload: true });
    }
    if ($rootScope.isSelfIntro == 'selfintro') {
        $scope.label = "Self Introduction";
    }
    else if ($rootScope.isSelfIntro == 'name') {
        $scope.label = "Name";
    }
    else {
        $scope.label = "Address";
    }

    $scope.init();


    $scope.goToUserProfile = function (userId) {
        var obj = JSON.stringify({ userId: userId });
        $window.localStorage["userProfile"] = obj;

        $state.go('publicProfile', {}, { reload: true });
    }
    $scope.updateUserInfo = function () {

      var Id = "content";
        console.log(Id);
        var myElement = angular.element(document.querySelector('#' + Id));
        console.log(myElement);
        var contentValue=myElement[0].value;
        if ($scope.userInfo)
        { }
        else
        {
            $scope.userInfo = JSON.parse($window.localStorage["userInfo"]);
        }
        if ($rootScope.isSelfIntro == 'name') {
            if (!contentValue) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: "Name can not be blank."
                });
            }
            else {
                var obj = { userId: $scope.userInfo.userId, content: contentValue };
                profileService.updateUserName(obj).then(function (data) {
                    $state.go('profile', {}, { reload: true });
                }, function (error) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Error',
                        template: error.Message
                    });
                });
            }
        }
        else if ($rootScope.isSelfIntro == 'selfintro') {
            var obj = { userId: $scope.userInfo.userId, content: contentValue };
            profileService.updateUserSelfIntroduction(obj).then(function (data) {
                $state.go('profile', {}, { reload: true });
            }, function (error) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: error.Message
                });
            });
        }
        else {

            var obj = { userId: $scope.userInfo.userId, content: contentValue };
            profileService.updateUserAddress(obj).then(function (data) {
                $state.go('profile', {}, { reload: true });
            }, function (error) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: error.Message
                });
            });
        }


    }


    $scope.takeFromCamera = function (files) {
        console.log(files);
        if (files) {
            var obj = { userId: $scope.userId, file: files };
            profileService.saveProfilePicture(obj).then(function (data) {
                $state.go('profile', {}, { reload: true });
            }, function (error) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: error.Message
                });
            });
        }
    }


    $scope.showPopup = function (type, count)
    {
     
        var confirmPopup = $ionicPopup.show({
            title: type+" Count. ",
            template:count ,
            buttons: [ {
                text: 'Ok',
                type: 'button-royal',
            }]
        });
    }

    $scope.updateHobbies = function () {
        profileService.getAllHobbies().then(function (data) {
            console.log($scope.userDetails.UserHobbies)
            $rootScope.hobbiesList = data;
            $ionicLoading.show({
                template: 'Loading...'
            });
            $timeout(markUserHobbies, 2000);
        }, function (error) {
            var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: error.Message
            });
        });
        $state.go('hobbies', {}, { reload: true });
    }

    $scope.showRight = function (id) {
        var Id = "rightDiv_" + id;
        console.log(Id);
        var myElement = angular.element(document.querySelector('#' + Id));
        console.log(myElement);
        if (myElement[0].innerHTML) {
            myElement[0].innerHTML = '';
        }
        else {
            myElement[0].innerHTML = '<img src="img/emblem_ok.png" style="border:none !important;width:12px;float:right;"/>';
        }

    }



    $scope.updateUserHobbies = function () {
        var userDetails = JSON.parse($window.localStorage["userInfo"]);
        var allElements = angular.element(document.querySelectorAll('[id^="rightDiv"]'));
        console.log(allElements);
        var hobbiesId;
        for (var i = 0; i < allElements.length; i++) {
            if (allElements[i].innerHTML) {
                if (hobbiesId) {
                    hobbiesId = hobbiesId + "," + allElements[i].id.split('_')[1];
                }
                else {
                    hobbiesId = allElements[i].id.split('_')[1];
                }
            }
        }
        var obj = { ScheduleId: hobbiesId, Id: userDetails.userId };
        profileService.saveUserHobbies(obj).then(function (data) {
            $state.go('profile', {}, { reload: true });
        }, function (error) {
            var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: error.Message
            });
        });

    }

    function markUserHobbies()
    {
         $ionicLoading.hide();
        if ($scope.userDetails.UserHobbies) {
            for (var i = 0; i < $rootScope.hobbiesList.length; i++) {
                if ($scope.userDetails.UserHobbies.includes($rootScope.hobbiesList[i].Name)) {
                    var Id = "rightDiv_" + $rootScope.hobbiesList[i].HobbiesId;
                    console.log(Id);
                    var myElement = angular.element(document.querySelector('#' + Id));
                    console.log(myElement);

                    myElement[0].innerHTML = '<img src="img/emblem_ok.png" style="border:none !important;width:12px;float:right;"/>';
                }
            }
        }
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

    $scope.doRefresh = function () {
        $scope.init();
        $scope.$broadcast('scroll.refreshComplete');
    }



    $scope.showBlockedUsers = function (userId)
    {
        profileService.getBlockedUserListByUserId(userId).then(function (data) {
            $rootScope.blockedUserList = data;
            $state.go('blockedUserList', {}, { reload: true });
        }, function (error) {
            var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: error.Message
            });
        });
    }


    $scope.unBlockUser = function (userID)
    {
        var confirmPopup = $ionicPopup.show({
            title: 'Unblock User?',
            template: 'Are you sure you want to unblock this user?',
            buttons: [{
                text: 'Cancel',
                type: 'button-royal button-outline',
            }, {
                text: 'Ok',
                type: 'button-royal',
                onTap: function () {
                    profileService.unBlockUser($scope.userInfo.userId,userID).then(function (data) {
                        $scope.showBlockedUsers($scope.userInfo.userId);
                    }, function (error) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Error',
                            template: error.Message
                        });
                    });
                }
            }]
        });
    }



    $scope.getTransliterationDetails = function (type)
    {
        var item;
        if (type == 'translate')
        {
            item = { IsTTS: 0, IsSpellCheck: 0, IsTranslate: 1, IsFavourite: 0, User_Id: $scope.userDetails.User_Id };

        }
        else if (type == 'spellCheck')
        {
            item = { IsTTS: 0, IsSpellCheck: 1, IsTranslate: 0, IsFavourite: 0, User_Id: $scope.userDetails.User_Id };
        }

        else if (type == 'fav') {
            item = { IsTTS: 0, IsSpellCheck: 0, IsTranslate: 0, IsFavourite: 1, User_Id: $scope.userDetails.User_Id };
        }
        else if (type == 'tts') {
            item = { IsTTS: 1, IsSpellCheck: 0, IsTranslate: 0, IsFavourite: 0, User_Id: $scope.userDetails.User_Id };
        }
        profileService.getTransliterationListByUserId(item).then(function (data) {
            $rootScope.transliterationList = data;

            $state.go('transliteration', {}, { reload: true });
        }, function (error) {
            var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: error.Message
            });
        });
    }
});