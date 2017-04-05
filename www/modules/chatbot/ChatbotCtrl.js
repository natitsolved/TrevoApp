app.controller('ChatbotCtrl', function ($scope, $stateParams, ionicMaterialInk, $ionicPopup, $timeout, authService, $state, $window,$rootScope, $ionicLoading, $http, Upload) {
    //ionic.material.ink.displayEffect();
    ionicMaterialInk.displayEffect();

   
    // Toggle Code Wrapper
    var code = document.getElementsByClassName('code-wrapper');
    for (var i = 0; i < code.length; i++) {
        code[i].addEventListener('click', function () {
            this.classList.toggle('active');
        });
    }
  
    if ($scope.ChatList == undefined)
    {
        $scope.ChatList = [];
    }
    $scope.userInfo = JSON.parse($window.localStorage["userInfo"]);
    console.log($scope.userInfo);
    

   
    $scope.isdiplay = false;
  
   

    

    $scope.send_chat = function (data) {
        $scope.isdiplay = false;
        console.log($scope.userInfo);
        var reciverId = $scope.recieverId;
        var pushData = { message: $scope.data, IsSender: 1 };
        $scope.ChatList.push(pushData);
        //var query = "INSERT INTO ChatTable (senderId, reciverId,message,IsSender,imagePath,videoPath) VALUES (?,?,?,?,?,?)";
        //$cordovaSQLite.execute($scope.db, query, [$scope.userInfo.userId, reciverId, $scope.data, 1, undefined, undefined]).then(function (res) {
        //    var message = "INSERT ID -> " + res.insertId;
        //    console.log(message);
        //    //alert(message);
        //    $scope.data = '';
        //}, function (err) {
        //    console.error(err);
        //    //alert(err);
        //});
        authService.sendMsg(pushData.message).then(function (data) {
            var pushData = { message: data, IsSender: 0 };
            $scope.ChatList.push(pushData);
            $scope.data = '';

        }, function (error) {

            console.log(error);
        })

    }


    $scope.takebotToUserListing = function () {
        $state.go('userListing', {}, { reload: true });
    }
   
   
   
});