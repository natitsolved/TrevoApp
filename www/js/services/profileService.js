angular.module('starter')
.service('profileService', function ($q, $http, $window, $rootScope, $ionicLoading, $httpParamSerializer,Upload) {



   

    var updateUserSelfIntroduction = function (item) {
        return $q(function (resolve, reject) {
            $ionicLoading.show({
                template: 'Loading...'
            });
            var encodedString = { Id: item.userId, Content: item.content };
            $http({
                method: 'POST',
                url: $rootScope.serviceurl + "UpdateUserSelfIntroduction",
                data: encodedString
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

    var updateUserName = function (item) {
        return $q(function (resolve, reject) {
            $ionicLoading.show({
                template: 'Loading...'
            });
            var encodedString = { Id: item.userId, Content: item.content };
            $http({
                method: 'POST',
                url: $rootScope.serviceurl + "UpdateUserName",
                data: encodedString
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

    var updateUserAddress = function (item) {
        return $q(function (resolve, reject) {
            $ionicLoading.show({
                template: 'Loading...'
            });
            var encodedString = { Id: item.userId, Content: item.content };
            $http({
                method: 'POST',
                url: $rootScope.serviceurl + "UpdateUserAddress",
                data: encodedString
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

    var getUserDetailsById = function (id) {
        return $q(function (resolve, reject) {
            $ionicLoading.show({
                template: 'Loading...'
            });
            $http({
                method: 'POST',
                url: $rootScope.serviceurl + "GetUserDetailsById",
                data: { Id: id },
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

    var getAllHobbies = function (id) {
        return $q(function (resolve, reject) {
            $ionicLoading.show({
                template: 'Loading...'
            });
            $http({
                method: 'GET',
                url: $rootScope.serviceurl + "GetAllHobbies",
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
    var saveProfilePicture = function (item) {
        return $q(function (resolve, reject) {
            $ionicLoading.show({
                template: 'Loading...'
            });
            Upload.upload({
                method: 'POST',
                url: $rootScope.serviceurl + "UploadUserProfileImage",
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

    var saveUserHobbies = function (item) {
        return $q(function (resolve, reject) {
            $ionicLoading.show({
                template: 'Loading...'
            });
            $http({
                method: 'POST',
                url: $rootScope.serviceurl + "InsertUserHobbies",
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
    var getMomentsListByUserId = function (id) {
        return $q(function (resolve, reject) {
            $ionicLoading.show({
                template: 'Loading...'
            });
            $http({
                method: 'POST',
                url: $rootScope.serviceurl + "GetMomentsListByUserId",
                data: {Id:id}
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

    var saveUserFollowDetails = function (item) {
        return $q(function (resolve, reject) {
            $ionicLoading.show({
                template: 'Loading...'
            });
            $http({
                method: 'POST',
                url: $rootScope.serviceurl + "InsertUserFollowDetails",
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
    var removeUserFollowDetails = function (item) {
        return $q(function (resolve, reject) {
            $ionicLoading.show({
                template: 'Loading...'
            });
            $http({
                method: 'POST',
                url: $rootScope.serviceurl + "RemoveUserFollowDetails",
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
    var checkIfUserFollowsTheUser = function (item) {
        return $q(function (resolve, reject) {
            $ionicLoading.show({
                template: 'Loading...'
            });
            $http({
                method: 'POST',
                url: $rootScope.serviceurl + "CheckIfTheUserIsFollowingAnotherUser",
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
    var getUserFollowerFollowingList = function (item) {
        return $q(function (resolve, reject) {
            $ionicLoading.show({
                template: 'Loading...'
            });
            $http({
                method: 'POST',
                url: $rootScope.serviceurl + "GetUserFollowerFollowingList",
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

    var blockUser = function (blockingUserId,blockedUserId) {
        return $q(function (resolve, reject) {
            $ionicLoading.show({
                template: 'Loading...'
            });
            $http({
                method: 'POST',
                url: $rootScope.serviceurl + "InsertBlockDetails",
                data: { Id: blockingUserId, ScheduleId: blockedUserId }
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
    var unBlockUser = function (blockingUserId, blockedUserId) {
        return $q(function (resolve, reject) {
            $ionicLoading.show({
                template: 'Loading...'
            });
            $http({
                method: 'POST',
                url: $rootScope.serviceurl + "DeleteBlockDetails",
                data: { Id: blockingUserId, ScheduleId: blockedUserId }
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
    var getBlockedUserListByUserId = function (blockingUserId) {
        return $q(function (resolve, reject) {
            $ionicLoading.show({
                template: 'Loading...'
            });
            $http({
                method: 'POST',
                url: $rootScope.serviceurl + "GetBlockedUserListByUserId",
                data: { Id: blockingUserId }
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
        updateUserSelfIntroduction: updateUserSelfIntroduction,
        updateUserName: updateUserName,
        getUserDetailsById: getUserDetailsById,
        updateUserAddress: updateUserAddress,
        saveProfilePicture: saveProfilePicture,
        getAllHobbies: getAllHobbies,
        saveUserHobbies: saveUserHobbies,
        getMomentsListByUserId: getMomentsListByUserId,
        saveUserFollowDetails: saveUserFollowDetails,
        removeUserFollowDetails: removeUserFollowDetails,
        checkIfUserFollowsTheUser: checkIfUserFollowsTheUser,
        getUserFollowerFollowingList: getUserFollowerFollowingList,
        blockUser: blockUser,
        getBlockedUserListByUserId: getBlockedUserListByUserId,
        unBlockUser: unBlockUser
    };
})





