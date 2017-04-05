angular.module('starter')
.service('authService', function ($q, $http, $window, $rootScope, $ionicLoading, $httpParamSerializer, $cordovaDevice) {
    var LOCAL_TOKEN_KEY = 'yourTokenKey';
    var username = '';
    var userInfo = '';
    var robchatInfo='';
    var isAuthenticated = false;
    var role = '';
    var authToken;

    function loadUserCredentials() {
        var token = $window.localStorage.getItem(LOCAL_TOKEN_KEY);
        if ($window.localStorage["userInfo"]) {
            userInfo = JSON.parse($window.localStorage["userInfo"]);
        }
        if (token) {
            useCredentials(token);
        }
    }

    function storeUserCredentials(user) {
        $window.localStorage.setItem(LOCAL_TOKEN_KEY, user);
        useCredentials(user);
    }

    function useCredentials(user) {
        username = user.Name;
        isAuthenticated = true;

       
        // Set the token as header for your requests!
        //$http.defaults.headers.common['X-Auth-Token'] = token;
    }

    function destroyUserCredentials() {
        authToken = undefined;
        username = '';
        isAuthenticated = false;
        //$http.defaults.headers.common['X-Auth-Token'] = undefined;
      //  $window.localStorage.removeItem(LOCAL_TOKEN_KEY);
        $window.localStorage["userInfo"] = '';
        userInfo = '';
    }

    function getUserInfo() {
        return userInfo;
    }

    var login = function (email, password) {
        return $q(function (resolve, reject) {
            $ionicLoading.show({
                template: 'Loading...'
            });
            var uuid = $cordovaDevice.getUUID();
            var encodedString = JSON.stringify({ Email: email, Password: password, DeviceId: uuid });
            $http({
                method: 'POST',
                url: $rootScope.serviceurl + "Login",
                data: encodedString,
                headers: { 'Content-Type': 'application/json' }
            }).success(function (response) {
                console.log(response);
                if (response.UserID !== '') {
                    storeUserCredentials(response);
                    userInfo = {
                        userId: response.UserID,
                        emailId: response.Email,
                        name: response.Name,
                        image: response.ImagePath
                    };
                    $window.localStorage["userInfo"] = JSON.stringify(userInfo);
                    $ionicLoading.hide();
                    resolve(response.email);
                } else {
                    $ionicLoading.hide();
                    reject('Login Failed.');
                }
            }).error(function () {
                $ionicLoading.hide();
                reject('Login Failed.');
            });
        });
    };

    
    var externalLogin = function (data) {
        return $q(function (resolve, reject) {
            $ionicLoading.show({
                template: 'Loading...'
            });
            var encodedString = JSON.stringify({ Id: data });
            $http({
                method: 'POST',
                url: $rootScope.serviceurl + "GetUserDetailsByExternalAuthId",
                data: encodedString,
                headers: { 'Content-Type': 'application/json' }
            }).success(function (res) {
                console.log(res);
                if (response.UserID !== '') {
                    storeUserCredentials(response);
                    userInfo = {
                        userId: response.UserID,
                        emailId: response.Email,
                        name: response.Name,
                        image: response.ImagePath
                    };
                    $window.localStorage["userInfo"] = JSON.stringify(userInfo);
                    $ionicLoading.hide();
                    resolve(response.email);
                } else {
                    $ionicLoading.hide();
                    reject('Login Failed.');
                }
            }).error(function (err) {
                $ionicLoading.hide();
                reject(err);
            });
        });
    };

    
    var getAllUserswithCountry = function () {
        return $q(function (resolve, reject) {
            $ionicLoading.show({
                template: 'Loading...'
            });
            $http({
                method: 'GET',
                url: $rootScope.serviceurl + "GetAllUserWithCountryIcon",
                headers: { 'Content-Type': 'application/json' }
            }).success(function (response) {
                console.log(response);
                $ionicLoading.hide();
                resolve(response);
            }).error(function () {
                $ionicLoading.hide();
                reject('Login Failed.');
            });
        });
    };
    var register = function (data) {
        return $q(function (resolve, reject) {
            $ionicLoading.show({
                template: 'Loading...'
            });
            
            //console.log(firstencodedString);
            //var firstencodedString = JSON.stringify({ Email: firstencodedString.Emailn, Password: firstencodedString.Passwordn, Name: firstencodedString.Namen, Dob: firstencodedString.Dobn, Gender: firstencodedString.Gendern, DeviceId: "deviceId", CountryId: $scop.udl.country, NativeLanguageId: $scop.udl.nativeLanguage, LearningLanguageId: $scop.udl.learningLanguage, LanguageLevelId: $scop.udl.languagelevel });
            $http({
                method: 'POST',
                url: $rootScope.serviceurl + "Register",
                data: data,
                headers: { 'Content-Type': 'application/json' }
            }).success(function (response) {
                if (response.UserId !== '') {
                    //storeUserCredentials(response.email);
                    userInfo = {
                        accessId: response.UserId,
                        emailId: response.email,
                        name: response.Email
                    };
                    $window.localStorage["userInfo"] = JSON.stringify(userInfo);
                    $ionicLoading.hide();
                    resolve(response.email);
                } else {
                    $ionicLoading.hide();
                    reject('Registration Failed.');
                }
                //console.log(response); 
            }).error(function (data) {
                $ionicLoading.hide();
                reject(data.Message);
                //console.log('failed...'); 
            });
        });
    };

    var sendMsg = function (data) {
        return $q(function(resolve,reject) {
            $ionicLoading.show({
                template: 'Loading...'
            });
            var obj =JSON.stringify( { message: data });
            $http({
                method: 'POST',
                url: 'http://138.68.12.41:5001/Chatbot',
                data: obj,
                headers: { 'Content-Type': 'application/json' }
            }).success(function (response) {
                if (response.Ack == '1') {
                    robchatInfo = {
                        messagereturn:response.data
                    };
                    $ionicLoading.hide();
                    resolve(response.data);
                } else {
                    $ionicLoading.hide();
                    reject(response);
                }
                //console.log(response); 
            }).error(function (data) {
                $ionicLoading.hide();
                reject(data.Message);
                //console.log('failed...'); 
            });
        });
    };

    var externalRegister = function (data) {
        return $q(function (resolve, reject) {
            $ionicLoading.show({
                template: 'Loading...'
            });

            //console.log(firstencodedString);
            //var firstencodedString = JSON.stringify({ Email: firstencodedString.Emailn, Password: firstencodedString.Passwordn, Name: firstencodedString.Namen, Dob: firstencodedString.Dobn, Gender: firstencodedString.Gendern, DeviceId: "deviceId", CountryId: $scop.udl.country, NativeLanguageId: $scop.udl.nativeLanguage, LearningLanguageId: $scop.udl.learningLanguage, LanguageLevelId: $scop.udl.languagelevel });
            $http({
                method: 'POST',
                url: $rootScope.serviceurl + "ExternalAuthRegister",
                data: data,
                headers: { 'Content-Type': 'application/json' }
            }).success(function (response) {
                if (response.UserId !== '') {
                    //storeUserCredentials(response.email);
                    userInfo = {
                        accessId: response.UserId,
                        emailId: response.email,
                        name: response.Email
                    };
                    $window.localStorage["userInfo"] = JSON.stringify(userInfo);
                    $ionicLoading.hide();
                    resolve(response.email);
                } else {
                    $ionicLoading.hide();
                    reject('Registration Failed.');
                }
                //console.log(response); 
            }).error(function (data) {
                $ionicLoading.hide();
                reject(data.Message);
                //console.log('failed...'); 
            });
        });
    };
    var logout = function () {
        destroyUserCredentials();
    };

    var isAuthorized = function (authorizedRoles) {
        if (!angular.isArray(authorizedRoles)) {
            authorizedRoles = [authorizedRoles];
        }
        return (isAuthenticated && authorizedRoles.indexOf(role) !== -1);
    };

    loadUserCredentials();

    var setUser = function (user_data) {
        window.localStorage.starter_facebook_user = JSON.stringify(user_data);
    };

    var getUser = function () {
        return JSON.parse(window.localStorage.starter_facebook_user || '{}');
    };

    var sendForgotpassword = function (emailid) {
        return $q(function (resolve, reject) {
            $ionicLoading.show({
                template: 'Loading...'
            });
            var encodedString = JSON.stringify({ Email: emailid });
            $http({
                method: 'POST',
                url: $rootScope.serviceurl + "ForgotPassword",
                data: encodedString,
                headers: { 'Content-Type': 'application/json' }
            }).success(function (response) {
                if (response) {
                    $ionicLoading.hide();
                    resolve(response);
                }
                //console.log(response); 
            }).error(function (data) {
                $ionicLoading.hide();
                reject(data);
                //console.log('failed...'); 
            });
        });
    };


    return {
        getUser: getUser,
        setUser: setUser,
        login: login,
        logout: logout,
        isAuthorized: isAuthorized,
        getUserInfo: getUserInfo,
        register: register,
        sendMsg:sendMsg,
        sendForgotpassword: sendForgotpassword,
        externalLogin: externalLogin,
        externalRegister:externalRegister,
        getAllUserswithCountry:getAllUserswithCountry,
        isAuthenticated: function () { return isAuthenticated; },
        checkUniqueValue: function (table, field, value) {
            var encodedString = 'table=' + encodeURIComponent(table) + '&field=' + encodeURIComponent(field) + '&value=' + encodeURIComponent(value);
            var req = {
                method: 'POST',
                url: $rootScope.serviceurl + "checkdata",
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: encodedString
            };
            return $http(req).then(function (res) {
                return res.data.isUnique;
            });
        },
        username: function () { return username; },
        role: function () { return role; }
    };
})



//configurations {
//   all*.exclude group: 'com.android.support', module: 'support-v4'
//}

