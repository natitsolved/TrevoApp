angular.module('starter')
.service('momentService', function ($q, $http, $window, $rootScope, $ionicLoading, $httpParamSerializer, Upload) {
   

   
    var getAllMoments = function () {
        return $q(function (resolve, reject) {
            $ionicLoading.show({
                template: 'Loading...'
            });
            $http({
                method: 'GET',
                url: $rootScope.serviceurl + "GetAllMomentsWithLanguage",
                headers: { 'Content-Type': 'application/json' }
            }).success(function (response) {
                console.log(response);
                    $ionicLoading.hide();
                    resolve(response);
            }).error(function (error) {
                $ionicLoading.hide();
                reject(error);
            });
        });
    };


    var getAllMomentListByParentId = function (id) {
        return $q(function (resolve, reject) {
            $ionicLoading.show({
                template: 'Loading...'
            });
            $http({
                method: 'POST',
                url: $rootScope.serviceurl + "GetAllMomentsLIstByParentId",
                data:{Id:id},
                headers: { 'Content-Type': 'application/json' }
            }).success(function (response) {
                console.log(response);
                $ionicLoading.hide();
                resolve(response);
            }).error(function (error) {
                $ionicLoading.hide();
                reject(error);
            });
        });
    };

    var saveMoments = function (item) {
        return $q(function (resolve, reject) {
            $ionicLoading.show({
                template: 'Loading...'
            });
            Upload.upload({
                method: 'POST',
                url: $rootScope.serviceurl + "InsertMomentsDetails",
                data: item
            }).success(function (response) {
                console.log(response);
                $ionicLoading.hide();
                resolve(response);
            }).error(function (error) {
                $ionicLoading.hide();
                reject(error);
            });
        });
    };

    var markMomentAsFavourite = function (item) {
        return $q(function (resolve, reject) {
            $ionicLoading.show({
                template: 'Loading...'
            });
            $http({
                method: 'POST',
                url: $rootScope.serviceurl + "InsertFavouriteDetails",
                data: item,
                headers: { 'Content-Type': 'application/json' }
            }).success(function (response) {
                console.log(response);
                $ionicLoading.hide();
                resolve(response);
            }).error(function (error) {
                $ionicLoading.hide();
                reject(error);
            });
        });
    };
    var removeMomentAsFavourite = function (userId, momentId) {
        return $q(function (resolve, reject) {
            $ionicLoading.show({
                template: 'Loading...'
            });
            $http({
                method: 'POST',
                url: $rootScope.serviceurl + "RemoveFavByUserAndMomentId",
                data: { Id: userId, ScheduleId :momentId},
                headers: { 'Content-Type': 'application/json' }
            }).success(function (response) {
                console.log(response);
                $ionicLoading.hide();
                resolve(response);
            }).error(function (error) {
                $ionicLoading.hide();
                reject(error);
            });
        });
    };
    return {
        getAllMoments: getAllMoments,
        getAllMomentListByParentId: getAllMomentListByParentId,
        saveMoments: saveMoments,
        markMomentAsFavourite: markMomentAsFavourite,
        removeMomentAsFavourite: removeMomentAsFavourite
    };
})





