app.controller('UserCtrl', function ($scope, $stateParams, ionicMaterialInk, $ionicPopup, $timeout, authService, $state, $window, $rootScope) {
    //ionic.material.ink.displayEffect();
    ionicMaterialInk.displayEffect();

    // Toggle Code Wrapper
    var code = document.getElementsByClassName('code-wrapper');
    for (var i = 0; i < code.length; i++) {
        code[i].addEventListener('click', function () {
            this.classList.toggle('active');
        });
    }
    if ($window.localStorage["userInfo"]) {
        $scope.userInfo = JSON.parse($window.localStorage["userInfo"]);
    }
    $scope.getUserListing = function () {
        $rootScope.socket.emit('get_connected_users');
        $rootScope.socket.on('sent_connected_users', function (res) {
            console.log(res);
            res = res.toString();
            authService.getAllUserswithCountry().then(function (data) {
                $scope.userList = [];
                var obj = '';
                for (var i = 0; i < data.length; i++) {
                    if (data[i].User_Id != $scope.userInfo.userId) {
                        if (res.includes(data[i].User_Id)) {
                            obj = { User_Id: data[i].User_Id, Name: data[i].Name, ImagePath: data[i].ImagePath, Icon_Path: data[i].Icon_Path, NativeAbbrv: data[i].NativeAbbrv, LearningAbbrv: data[i].LearningAbbrv, IsOnline: true }
                        }
                        else {
                            obj = { User_Id: data[i].User_Id, Name: data[i].Name, ImagePath: data[i].ImagePath, Icon_Path: data[i].Icon_Path, NativeAbbrv: data[i].NativeAbbrv, LearningAbbrv: data[i].LearningAbbrv, IsOnline: false }
                        }
                        $scope.userList.push(obj);
                    }
                }
            }, function (err) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: 'There is some error. Please try again later.'
                });
            });
        });
    };
   
    if ($window.localStorage["userInfo"]) {
        $scope.userInfo = JSON.parse($window.localStorage["userInfo"]);
        $rootScope.socket = io('http://166.62.40.135:8095', { query: "userId=" + $scope.userInfo.userId });
        console.log($rootScope.socket);
    }
    

    $scope.getUserListing();
    $scope.goToChat = function (userId,name,imagePath)
    {
        var userDetails = { userId: userId, name: name, imagePath, imagePath };
        $window.localStorage["userDetails"] = JSON.stringify(userDetails);
        $state.go('chat', {}, { reload: true });
    }

    $scope.logOut = function () {
        authService.logout();
        $state.go('signin', {}, { reload: true });
    }

    $scope.goToChatbot = function () {
        //var userDetails = { userId: userId, name: name, imagePath, imagePath };
        //$window.localStorage["userDetails"] = JSON.stringify(userDetails);
        $state.go('chatbot', {}, { reload: true });
    }
   
    $scope.doRefresh = function () {
        $scope.getUserListing();
        $scope.$broadcast('scroll.refreshComplete');
    }
});