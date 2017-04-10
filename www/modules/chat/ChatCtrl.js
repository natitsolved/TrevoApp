app.controller('ChatCtrl', function ($scope, $stateParams, ionicMaterialInk, $ionicPopup, $timeout, authService, $state, $window, $cordovaSQLite, $cordovaCamera, $cordovaFile, $cordovaFileTransfer, $rootScope, $ionicLoading, $http, Upload) {
    //ionic.material.ink.displayEffect();
    ionicMaterialInk.displayEffect();

   
    // Toggle Code Wrapper
    var code = document.getElementsByClassName('code-wrapper');
    for (var i = 0; i < code.length; i++) {
        code[i].addEventListener('click', function () {
            this.classList.toggle('active');
        });
    }
    $scope.sendChatAfterTranslation = function () {
        $scope.data = $window.localStorage["messageToSend"];
        $window.localStorage["messageToSend"] = '';
    }

    if ($window.localStorage["userDetails"] != '')
    {
        var userDetails = JSON.parse($window.localStorage["userDetails"]);
        $scope.recieverId = userDetails.userId;
        $scope.recieverName = userDetails.name;
        $scope.recieverImage = userDetails.imagePath;
    }

    if ($scope.RecieverChatList == undefined) {
        $scope.RecieverChatList = [];
    }
    if ($scope.SenderChatList == undefined) {
        $scope.SenderChatList = [];
    }
    if ($scope.ChatList == undefined)
    {
        $scope.ChatList = [];
    }
    $scope.userInfo = JSON.parse($window.localStorage["userInfo"]);
    console.log($scope.userInfo);
    

   
    $scope.isdiplay = false;
    var db = $scope.db = $cordovaSQLite.openDB({ name: "my.db", location: "default" });

    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS ChatTable (id integer primary key, senderId integer, reciverId integer,message text,IsSender integer,imagePath text,videoPath text)");

    if ($window.localStorage["messageToSend"] != '')
    {
        $scope.sendChatAfterTranslation();
    }
   

    var query = "SELECT * FROM ChatTable where senderId=? and reciverId=?";
    $cordovaSQLite.execute(db, query, [$scope.userInfo.userId, $scope.recieverId]).then(function (data) {
        for (var i = 0; i <data.rows.length; i++) {
            var obj = { message: data.rows.item(i).message == null ? undefined : data.rows.item(i).message, IsSender: data.rows.item(i).IsSender, imgURI: data.rows.item(i).imagePath == null ? undefined : data.rows.item(i).imagePath, videoURI: data.rows.item(i).videoPath == null ? undefined : data.rows.item(i).videoPath }
            $scope.ChatList.push(obj);
        }
        query = "SELECT * FROM ChatTable where senderId=? and reciverId=?";
        $cordovaSQLite.execute(db, query, [$scope.recieverId, $scope.userInfo.userId]).then(function (res) {
            for (var i = 0; i < res.rows.length; i++) {
                var obj = { message: res.rows.item(i).message == null ? undefined : res.rows.item(i).message, IsSender: res.rows.item(i).IsSender, imgURI: res.rows.item(i).imagePath == null ? undefined : res.rows.item(i).imagePath, videoURI: res.rows.item(i).videoPath == null ? undefined : res.rows.item(i).videoPath }
                $scope.ChatList.push(obj);
            }
        }, function (err) {
            console.error(JSON.stringify(err));
        });
    }, function (err) {
        console.error(JSON.stringify(err));
    });

    $scope.send_chat = function (data) {
        $scope.isdiplay = false;
        console.log($scope.userInfo);
        var data = '';
        var reciverId = $scope.recieverId;
        //if (userInfo.userId == 42) {
        //    reciverId = 41;
        //    data = { senderId: userInfo.userId, recieverId: reciverId, message: $scope.data, image: undefined ,video:undefined};
        //}
        //else {
        //    reciverId = 42;
        //    data = { senderId: userInfo.userId, recieverId: reciverId, message: $scope.data, image: undefined, video: undefined };
        //}
        data = { senderId: $scope.userInfo.userId, recieverId: reciverId, message: $scope.data, image: undefined, video: undefined };
        data = JSON.stringify(data);
        console.log(data);
        $rootScope.socket.emit('chat_send', data);
        var pushData = { message: $scope.data, IsSender: 1, imgURI: undefined, videoURI: undefined };

        $scope.SenderChatList.push(pushData);
        console.log($scope.SenderChatList);
        $scope.ChatList.push(pushData);
        var query = "INSERT INTO ChatTable (senderId, reciverId,message,IsSender,imagePath,videoPath) VALUES (?,?,?,?,?,?)";
        $cordovaSQLite.execute($scope.db, query, [$scope.userInfo.userId, reciverId, $scope.data, 1, undefined, undefined]).then(function (res) {
            var message = "INSERT ID -> " + res.insertId;
            console.log(message);
            //alert(message);
            $scope.data = '';
        }, function (err) {
            console.error(err);
            //alert(err);
        });
    }

    $rootScope.socket.on('chat_rcv', function (data) {
        console.log("chat recieved" + data);
        console.log($scope.userInfo);
        data = JSON.parse(data);
        if (data.recieverId == $scope.userInfo.userId)
        {
            var query = "INSERT INTO ChatTable (senderId, reciverId,message,IsSender,imagePath,videoPath) VALUES (?,?,?,?,?,?)";
            $cordovaSQLite.execute($scope.db, query, [data.senderId, $scope.userInfo.userId, data.message, 0, data.image, data.video]).then(function (res) {
                var message = "INSERT ID -> " + res.insertId;
                console.log(message);
                var url = data.video;
                var pushData = { message: data.message, IsSender: 0, imgURI: data.image, videoURI: data.video };
                $scope.RecieverChatList.push(pushData);
                $scope.ChatList.push(pushData);
                console.log($scope.RecieverChatList);
                $scope.data = '';
                if (url != undefined) {
                    var recieverVideo = document.getElementById('recieverVideo');
                    var video = document.createElement('video');
                    video.src = url;
                    video.autoPlay = true;
                    video.setAttribute("width", "152px");
                    video.controls = "controls";
                    recieverVideo.appendChild(video);
                    setTimeout(function () {
                        video.pause();

                        video.src = url;

                        video.load();
                        video.play();
                    }, 3000);
                }

            }, function (err) {
                console.error(err);
                alert(err);
            });
        }
        
    });


    $scope.openCamera = function () {
        $scope.isdiplay = false;
        var options = {
            quality: 75,
            destinationType: Camera.DestinationType.FILE_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 300,
            targetHeight: 300,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function (imageData) {
            //debugger;
            $ionicLoading.show({
                template: 'Loading...'
            });
            //saving the file to local folder
            var currentName = imageData.replace(/^.*[\\\/]/, '');
            //Create a new name for the photo
            var d = new Date(),
            n = d.getTime(),
            newFileName = n + ".jpg";
            var namePath = imageData.substr(0, imageData.lastIndexOf('/') + 1);
            // Move the file to permanent storage
            $cordovaFile.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(function (success) {
                $scope.image = newFileName;
                var url = $rootScope.serviceurl + "UploadFile";
                // File for Upload
                var targetPath = $scope.pathForImage($scope.image);

                // File name only
                var filename = newFileName;
                var options = {
                    fileKey: "file",
                    fileName: filename,
                    chunkedMode: false,
                    mimeType: "multipart/form-data",
                    params: { 'fileName': filename }
                };
                $cordovaFileTransfer.upload(url, targetPath, options).then(function (result) {
                    console.log(success);
                    var url = JSON.parse(result.response);
                    url = url.replace(/['"]+/g, '');
                    console.log(url);
                    var pushData = { message: undefined, IsSender: 1, imgURI: imageData ,videoURI:undefined};
                    $scope.SenderChatList.push(pushData);
                    $scope.ChatList.push(pushData);
                    var data = '';
                    var reciverId = $scope.recieverId;
                    //if (userInfo.userId == 42) {
                    //    reciverId = 41;
                    //    data = { senderId: userInfo.userId, recieverId: reciverId, message: undefined, image: url,video:undefined };
                    //}
                    //else {
                    //    reciverId = 42;
                    //    data = { senderId: userInfo.userId, recieverId: reciverId, message: undefined, image: url,video:undefined };
                    //}
                   
                    var query = "INSERT INTO ChatTable (senderId, reciverId,message,IsSender,imagePath,videoPath) VALUES (?,?,?,?,?,?)";
                    $cordovaSQLite.execute($scope.db, query, [$scope.userInfo.userId, reciverId, undefined, 1, url, undefined]).then(function (res) {
                        var message = "INSERT ID -> " + res.insertId;
                        console.log(message);
                        data = { senderId: $scope.userInfo.userId, recieverId: reciverId, message: undefined, image: url, video: undefined };
                        data = JSON.stringify(data);
                        console.log(data);
                        $rootScope.socket.emit('chat_send', data);
                        $ionicLoading.hide();
                    }, function (err) {
                        $ionicLoading.hide();
                        console.error(err);
                        //alert(err);
                    });
                    
                }, function (error) {
                    $ionicLoading.hide();
                    console.log(error);
                    //alert('error in uploading');
                });
            }, function (error) {
                $ionicLoading.hide();
                alert('Error', error.exception);
            });



        }, function (err) {
            $ionicLoading.hide();
            console.log(err);
        });
    }

    $scope.chooseFile = function () {
        $scope.isdiplay = false;
        var options = {
            quality: 75,
            destinationType: Camera.DestinationType.FILE_URL,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: false,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 300,
            targetHeight: 300,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };
        //$cordovaCamera.getPicture(options).then(function (imageData) {
        //    var pushData = { message: undefined, IsSender: 1, imgURI: undefined, videoURI:imageData };
        //    $scope.SenderChatList.push(pushData);
        //}, function (err) {
        //    console.log(err);
        //});

        $cordovaCamera.getPicture(options).then(function (imageData) {
            $ionicLoading.show({
                template: 'Loading...'
            });

            var newFileName = '';
            //saving the file to local folder
            var currentName = imageData.replace(/^.*[\\\/]/, '');
            //Create a new name for the photo
            var d = new Date(),
            n = d.getTime();
            var extension = currentName.split('.')[1].split('?')[0];
            currentName = currentName.split('.')[0]+"."+extension;
                newFileName = n + ".jpg";
            var namePath = imageData.substr(0, imageData.lastIndexOf('/') + 1);
            // Move the file to permanent storage
            $cordovaFile.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(function (success) {
                $scope.image = newFileName;
                var url = $rootScope.serviceurl + "UploadFile";
                // File for Upload
                var targetPath = $scope.pathForImage($scope.image);

                // File name only
                var filename = newFileName;
                var options = {
                        fileKey: "file",
                        fileName: filename,
                        chunkedMode: false,
                        mimeType: "multipart/form-data",
                        params: { 'fileName': filename }
                    };
                $cordovaFileTransfer.upload(url, targetPath, options).then(function (result) {
                    console.log(success);
                    var url = JSON.parse(result.response);
                    url = url.replace(/['"]+/g, '');
                    console.log(url);
                    var pushData = { message: undefined, IsSender: 1, imgURI: url,videoURI:undefined };
                    $scope.SenderChatList.push(pushData);
                    $scope.ChatList.push(pushData);
                    var data = '';
                    var reciverId = $scope.recieverId;
                    //if (userInfo.userId == 42) {
                    //    reciverId = 41;
                    //    data = { senderId: userInfo.userId, recieverId: reciverId, message: undefined, image: url ,video:undefined};
                    //}
                    //else {
                    //    reciverId = 42;
                    //    data = { senderId: userInfo.userId, recieverId: reciverId, message: undefined, image: url ,video:undefined};
                    //}
                    var query = "INSERT INTO ChatTable (senderId, reciverId,message,IsSender,imagePath,videoPath) VALUES (?,?,?,?,?,?)";
                    $cordovaSQLite.execute($scope.db, query, [$scope.userInfo.userId, reciverId, undefined, 1, url, undefined]).then(function (res) {
                        var message = "INSERT ID -> " + res.insertId;
                        console.log(message);
                        data = { senderId: $scope.userInfo.userId, recieverId: reciverId, message: undefined, image: url, video: undefined };
                        data = JSON.stringify(data);
                        console.log(data);
                        $rootScope.socket.emit('chat_send', data);
                        $ionicLoading.hide();
                    }, function (err) {
                        $ionicLoading.hide();
                        console.error(err);
                        //alert(err);
                    });
                    //data = { senderId: userInfo.userId, recieverId: reciverId, message: undefined, image: url, video: undefined };
                    //data = JSON.stringify(data);
                    //console.log(data);
                    //socket.emit('chat_send', data);
                    //$ionicLoading.hide();
                }, function (error) {
                    $ionicLoading.hide();
                    console.log(error);
                    //alert('error in uploading');
                });
            }, function (error) {
                $ionicLoading.hide();
                alert('Error', error.exception);
            });



        }, function (err) {
            console.log(err);
        });
    }

   
    
    $scope.pathForImage = function (image) {
        if (image === null) {
            return '';
        } else {
            return cordova.file.dataDirectory + image;
        }
    };

    $scope.itemOnLongPress = function () {
        console.log('Long press');
    }

    $scope.itemOnTouchEnd = function () {
        console.log('Touch end');
    }

    $scope.takeToTranslatePage = function (msg)
    {
        if (msg == '' || msg == undefined)
        {
            var alertPopup = $ionicPopup.alert({
                title: 'Incorect',
                template: 'Please type your message first to translate.'
            });
        }
        else
        {
            var translateInfo = { text: msg, sourceEn: 'en', targetEn: 'fr' };
            $window.localStorage["translateInfo"] = JSON.stringify(translateInfo);
            $state.go('chatTranslate');
        }
    }
   
    $scope.uploadFile = function () {
        $scope.isdiplay = false;
        $ionicLoading.show({
            template: 'Loading...'
        });
        var file = $scope.files;
        Upload.upload({
            url: $rootScope.serviceurl+"UploadFile",
            data: { file: file}
        }).then(function (resp) {
            console.log('Success ');
            var url = resp.data;
            var pushData = { message: undefined, IsSender: 1, imgURI: undefined, videoURI: url };
            $scope.SenderChatList.push(pushData);
            $scope.ChatList.push(pushData);
            //var video = document.getElementById('video');
            //var source = document.createElement('source');

            //source.setAttribute('src', url);

            //video.appendChild(source);
            //video.play();

            //setTimeout(function () {
            //    video.pause();

            //    source.setAttribute('src', url);

            //    video.load();
            //    video.play();
            //}, 3000);
            var senderVideo = document.getElementById('senderVideo');
            var video = document.createElement('video');
            video.src = url;
            video.autoPlay = true;
            video.setAttribute("width", "152px");
            video.controls = "controls";
            senderVideo.appendChild(video);
            setTimeout(function () {
                video.pause();

                video.src = url;

                video.load();
                video.play();
            }, 3000);
            var data = '';
            var reciverId = $scope.recieverId;
            //if (userInfo.userId == 42) {
            //    reciverId = 41;
            //    data = { senderId: userInfo.userId, recieverId: reciverId, message: undefined, image: undefined, video :url};
            //}
            //else {
            //    reciverId = 42;
            //    data = { senderId: userInfo.userId, recieverId: reciverId, message: undefined, image: undefined, video:url };
            //}
            var query = "INSERT INTO ChatTable (senderId, reciverId,message,IsSender,imagePath,videoPath) VALUES (?,?,?,?,?,?)";
            $cordovaSQLite.execute($scope.db, query, [$scope.userInfo.userId, reciverId, undefined, 1, url, undefined]).then(function (res) {
                var message = "INSERT ID -> " + res.insertId;
                console.log(message);
                data = { senderId: $scope.userInfo.userId, recieverId: reciverId, message: undefined, image: undefined, video: url };
                data = JSON.stringify(data);
                console.log(data);
                $rootScope.socket.emit('chat_send', data);
                $ionicLoading.hide();
            }, function (err) {
                $ionicLoading.hide();
                console.error(err);
                //alert(err);
            });
            //data = { senderId: userInfo.userId, recieverId: reciverId, message: undefined, image: undefined, video: url };
            //data = JSON.stringify(data);
            //console.log(data);
            //socket.emit('chat_send', data);
            //$ionicLoading.hide();
        }, function (resp) {
            $ionicLoading.hide();
            console.log('Error status: ');
        });

    };

    $scope.showsearch = function () {
        $scope.isdiplay = !$scope.isdiplay;
    }

   
    $scope.takeToUserListing = function ()
    {
        $state.go('userListing', {}, { reload: true });
    }
   
   
});