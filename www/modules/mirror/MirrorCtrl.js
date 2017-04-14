app.controller('MirrorCtrl', function ($scope, momentService, ionicMaterialInk, $ionicPopup, $rootScope, $state, $window) {
    ionicMaterialInk.displayEffect();
    // Toggle Code Wrapper
    var code = document.getElementsByClassName('code-wrapper');
    for (var i = 0; i < code.length; i++) {
        code[i].addEventListener('click', function () {
            this.classList.toggle('active');
        });
    }
    $scope.getAllMoments = function ()
    {
        momentService.getAllMoments().then(function (data) {
            $scope.momentsList = data;
        }, function (err) {
            var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: 'There is some error. Please try again later.'
            });
        });
    }


    $scope.takeToAddMomentPage = function (id)
    {
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


    $scope.getAllMoments();


    $scope.takeToDiscover = function ()
    {
        $state.go('discover', {}, { reload: true });
    }
   

    $scope.PostMoment = function (data, files)
    {
        if (data || files)
        {
            if ($window.localStorage["userInfo"])
            {
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
        else
        {
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
});