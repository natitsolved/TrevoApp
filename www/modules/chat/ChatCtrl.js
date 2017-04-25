app.controller('ChatCtrl', function ($scope, $stateParams, ionicMaterialInk, $ionicPopup, $timeout, authService, $state, $window, $cordovaSQLite, $cordovaCamera, $cordovaFile, $cordovaFileTransfer, $rootScope, $ionicLoading, $http, Upload, momentService) {
    //ionic.material.ink.displayEffect();
    ionicMaterialInk.displayEffect();


    // Toggle Code Wrapper
    var code = document.getElementsByClassName('code-wrapper');
    for (var i = 0; i < code.length; i++) {
        code[i].addEventListener('click', function () {
            this.classList.toggle('active');
        });
    }
    $scope.show = true;
    $scope.sendChatAfterTranslation = function () {
        $scope.data = $window.localStorage["messageToSend"];
        $window.localStorage["messageToSend"] = '';
    }
    $scope.dictionary = new Typo("en_US", false, false, { dictionaryPath: "js/dictionaries" });
    if ($window.localStorage["userDetails"] != '') {
        var userDetails = JSON.parse($window.localStorage["userDetails"]);
        $scope.recieverId = userDetails.userId;
        $scope.recieverName = userDetails.name;
        $scope.recieverImage = userDetails.imagePath;
    }

    if ($rootScope.ChatList == undefined) {
        $rootScope.ChatList = [];
    }
    $scope.userInfo = JSON.parse($window.localStorage["userInfo"]);
    console.log($scope.userInfo);



    $scope.isdiplay = false;
    var db = $scope.db = $cordovaSQLite.openDB({ name: "my.db", location: "default" });

    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS ChatTable (id integer primary key, senderId integer, reciverId integer,message text,IsSender integer,imagePath text,videoPath text, IsCorrected integer, CorrectedText text,IncorrectText text,Notes text,IsFavourite integer)");

    if ($window.localStorage["messageToSend"] != '') {
        $scope.sendChatAfterTranslation();
    }

    if ($scope.userInfo) {
        $rootScope.socket = io('http://166.62.40.135:8095', { query: "userId=" + $scope.userInfo.userId });
        console.log($rootScope.socket);
        if ($scope.recieverId) {
            $rootScope.socket.emit('get_connected_users');
            $rootScope.socket.on('sent_connected_users', function (res) {
                console.log(res);
                res = res.toString();
                if (res.includes($scope.recieverId)) {
                    $scope.IsOnline = true;
                }
                else {
                    $scope.IsOnline = false;
                }
            });
        }
    }

   
    $rootScope.ChatList = [];
    $ionicLoading.show({
        template: 'Loading...'
    });
    var query = "SELECT * FROM ChatTable where senderId=? and reciverId=? or senderId=? and reciverId=? order by id asc;";
    $cordovaSQLite.execute(db, query, [$scope.userInfo.userId, $scope.recieverId, $scope.recieverId, $scope.userInfo.userId]).then(function (data) {
        if ($scope.senderFav == undefined) {
            $scope.senderFav = [];
        }
        for (var i = 0; i < data.rows.length; i++) {
            if (data.rows.item(i).IsCorrected == 1) {
                var obj = { message: '', IsSender: data.rows.item(i).IsSender, imgURI: data.rows.item(i).imagePath == null ? undefined : data.rows.item(i).imagePath, videoURI: data.rows.item(i).videoPath == null ? undefined : data.rows.item(i).videoPath, IncorrectText: data.rows.item(i).IncorrectText, CorrectedText: data.rows.item(i).CorrectedText, inCorrectedPngSrc: "img/incorrect.png", correctedPngSrc: "img/ok.png", notes: data.rows.item(i).Notes == '' ? undefined : data.rows.item(i).Notes,id: data.rows.item(i).id };
                $rootScope.ChatList.push(obj);
            }
            else {
                var obj = { message: data.rows.item(i).message == null ? undefined : data.rows.item(i).message, IsSender: data.rows.item(i).IsSender, imgURI: data.rows.item(i).imagePath == null ? undefined : data.rows.item(i).imagePath, videoURI: data.rows.item(i).videoPath == null ? undefined : data.rows.item(i).videoPath,isFavourite:data.rows.item(i).IsFavourite,id: data.rows.item(i).id};
                $rootScope.ChatList.push(obj);
                if (obj.isFavourite == 1)
                {
                    $scope.senderFav[obj.id] = true;
                }
            }
        }
        $ionicLoading.hide();
    }, function (err) {
        console.error(JSON.stringify(err));
    });



    $scope.send_chat = function (data) {
        $scope.isdiplay = false;
        if ($scope.data != "") {
            console.log($scope.userInfo);
            var data = '';
            var reciverId = $scope.recieverId;

            data = { senderId: $scope.userInfo.userId, recieverId: reciverId, message: $scope.data, image: undefined, video: undefined };
            data = JSON.stringify(data);
            console.log(data);
            $rootScope.socket.emit('chat_send', data);
            var query = "INSERT INTO ChatTable (senderId, reciverId,message,IsSender,imagePath,videoPath,IsCorrected,CorrectedText,IncorrectText,Notes,IsFavourite) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
            $cordovaSQLite.execute($scope.db, query, [$scope.userInfo.userId, reciverId, $scope.data, 1, undefined, undefined, 0, undefined, undefined, undefined, 0]).then(function (res) {
                var message = "INSERT ID -> " + res.insertId;
                console.log(message);
                var pushData = { message: $scope.data, IsSender: 1, imgURI: undefined, videoURI: undefined, id: res.insertId };
                $rootScope.ChatList.push(pushData);
                $scope.data = '';
            }, function (err) {
                console.error(err);
                //alert(err);
            });
        }
        else {
            var alertPopup = $ionicPopup.alert({
                title: 'Incorect',
                template: 'Please type your message first to send it.'
            });
        }

    }

    $rootScope.socket.on('chat_rcv', function (data) {
        $scope.show = true;
        console.log("chat recieved" + data);
        console.log($scope.userInfo);
        data = JSON.parse(data);
        if (data.recieverId == $scope.userInfo.userId) {
            var query = "INSERT INTO ChatTable (senderId, reciverId,message,IsSender,imagePath,videoPath,IsCorrected,CorrectedText,IncorrectText,Notes,IsFavourite) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
            $cordovaSQLite.execute($scope.db, query, [data.senderId, $scope.userInfo.userId, data.message, 0, data.image, data.video, 0, undefined, undefined, undefined, 0]).then(function (res) {
                var message = "INSERT ID -> " + res.insertId;
                console.log(message);
                var url = data.video;
                if ($scope.recieverId == data.senderId) {
                    var pushData = { message: data.message == null ? undefined : data.message, IsSender: 0, imgURI: data.image == null ? undefined : data.image, videoURI: data.video == null ? undefined : data.video, id: res.insertId };
                    $rootScope.ChatList.push(pushData);
                }
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
                    var pushData = { message: undefined, IsSender: 1, imgURI: imageData, videoURI: undefined };
                    $rootScope.ChatList.push(pushData);
                    var data = '';
                    var reciverId = $scope.recieverId;
                    var query = "INSERT INTO ChatTable (senderId, reciverId,message,IsSender,imagePath,videoPath,IsCorrected,CorrectedText,IncorrectText,Notes,IsFavourite) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
                    $cordovaSQLite.execute($scope.db, query, [$scope.userInfo.userId, reciverId, undefined, 1, url, undefined, 0, undefined, undefined, undefined, 0]).then(function (res) {
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
            currentName = currentName.split('.')[0] + "." + extension;
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
                    var pushData = { message: undefined, IsSender: 1, imgURI: url, videoURI: undefined };
                    $rootScope.ChatList.push(pushData);
                    var data = '';
                    var reciverId = $scope.recieverId;
                    var query = "INSERT INTO ChatTable (senderId, reciverId,message,IsSender,imagePath,videoPath,IsCorrected,CorrectedText,IncorrectText,Notes,IsFavourite) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
                    $cordovaSQLite.execute($scope.db, query, [$scope.userInfo.userId, reciverId, undefined, 1, url, undefined, 0, undefined, undefined, undefined, 0]).then(function (res) {
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

    $scope.showModal = function (id) {
        var allElements = angular.element(document.querySelectorAll('[id^="modalWithOptions"]'));
        console.log(allElements);
        var Id = "modalWithOptions_" + id;
        console.log(Id);
        var myElement = angular.element(document.querySelector('#' + Id));
        console.log(myElement);
        for (var i = 0; i < allElements.length; i++) {
            if (allElements[i].id != myElement[0].id)
                allElements[i].style.display = "none";
        }
        if (myElement[0].style.display == "block") {
            myElement[0].style.display = "none";
        }
        else {
            myElement[0].style.display = "block"
        }
    }




    $scope.takeToTranslatePage = function (msg) {
        if (msg == '' || msg == undefined) {
            var alertPopup = $ionicPopup.alert({
                title: 'Incorect',
                template: 'Please type your message first to translate.'
            });
        }
        else {
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
        console.log(file);
        Upload.upload({
            url: $rootScope.serviceurl + "UploadFile",
            data: { file: file }
        }).then(function (resp) {
            console.log('Success ');
            var url = resp.data;
            var pushData = { message: undefined, IsSender: 1, imgURI: undefined, videoURI: url };
            $rootScope.ChatList.push(pushData);

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

            var query = "INSERT INTO ChatTable (senderId, reciverId,message,IsSender,imagePath,videoPath,IsCorrected,CorrectedText,IncorrectText,Notes,IsFavourite) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
            $cordovaSQLite.execute($scope.db, query, [$scope.userInfo.userId, reciverId, undefined, 1, url, undefined, 0, undefined, undefined, undefined, 0]).then(function (res) {
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

        }, function (resp) {
            $ionicLoading.hide();
            console.log('Error status: ');
        });

    };

    $scope.showsearch = function () {
        $scope.isdiplay = !$scope.isdiplay;
    }


    $scope.takeToUserListing = function () {
        $state.go('userListing', {}, { reload: true });
    }



    $scope.tranlateToNativeLang = function () {
        console.log($scope.transaltionObj);
        $scope.show = true;
        if ($window.localStorage["userInfo"]) {
            var item = { User_Id: $scope.userInfo.userId, IsTranslate: 1 };
            momentService.insertTransliterationDetails(item).then(function (data) {
                var element;
                //var spinnerId = "spinner_" + $scope.transaltionObj.id;
                //var spinnerElement = angular.element(document.querySelector('#' + spinnerId));
                //spinnerElement[0].style.display = "block";
                var isSender = $scope.transaltionObj.isSender;
                if (isSender == 1) {
                    if ($scope.hideShowLoader == undefined) {
                        $scope.hideShowLoader = [];
                    }
                    $scope.hideShowLoader[$scope.transaltionObj.id] = true;
                }
                else {
                    if ($scope.rcvrHideShowLoader == undefined) {
                        $scope.rcvrHideShowLoader = [];
                    }
                    $scope.rcvrHideShowLoader[$scope.transaltionObj.id] = true;
                }
                var userDetails = JSON.parse($window.localStorage["userInfo"]);
                var targetEn = userDetails.nativeLang;
                if (targetEn) {
                    var sourceEn = "en";
                    if (isSender == 1)
                        element = "translatedText_" + $scope.transaltionObj.id;
                    else
                        element = "rcvrTranslatedText_" + $scope.transaltionObj.id;
                    var myElement = angular.element(document.querySelector('#' + element));
                    var urlToHit = 'https://translation.googleapis.com/language/translate/v2?key=' + $rootScope.googleTranslateApiKey + '&source=' + sourceEn + '&target=' + targetEn + '&q=' + $scope.transaltionObj.message;
                    $http({
                        url: urlToHit,
                    }).then(function (data) {
                        myElement[0].innerHTML = data.data.data.translations[0].translatedText;
                        //spinnerElement[0].style.display = "none";
                        if (isSender == 1) {
                            $scope.hideShowLoader[$scope.transaltionObj.id] = false;
                        }
                        else {
                            $scope.rcvrHideShowLoader[$scope.transaltionObj.id] = false;
                        }
                    }, function (error) {
                        //spinnerElement[0].style.display = "none";
                        if (isSender == 1) {
                            $scope.hideShowLoader[$scope.transaltionObj.id] = false;
                        }
                        else {
                            $scope.rcvrHideShowLoader[$scope.transaltionObj.id] = false;
                        }
                        var alertPopup = $ionicPopup.alert({
                            title: 'Incorect',
                            template: error.data.error.message
                        });
                    });
                }
            }, function (error) {
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: error.Message
                });
            });
           

        }

    }

    $scope.hideModal = function (id) {
        var Id = "modalWithOptions_" + id;
        var myElement1 = angular.element(document.querySelector('#' + Id));
        myElement1[0].style.display = "none";
    }
    $scope.hideCard = function () {
        $scope.show = true;
    }
    $scope.alerts = function (id, message, isSender, messageId) {
        $scope.transaltionObj = { id: id, message: message, isSender: isSender, messageID: messageId };
        $scope.show = false;
    }


    $scope.speakText = function () {
        $ionicLoading.show({
            template: 'Loading...'
        });
        var item = { User_Id: $scope.userInfo.userId, IsTTS: 1 };
        momentService.insertTransliterationDetails(item).then(function (data) {
            var message = $scope.transaltionObj.message;
            window.TTS.speak({
                text: message,
                locale: 'en-GB',
                rate: 1.5
            }, function () {
                $scope.show = true;
                $ionicLoading.hide();
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            }, function () {
                $ionicLoading.hide();
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            });
        }, function (error) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: error.Message
            });
        });
       

    }

    $scope.copyText = function () {
        $scope.show = true;
        $rootScope.coipedMessage = $scope.transaltionObj.message;
        var alertPopup = $ionicPopup.alert({
            title: 'Success',
            template: "Copied"
        });
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


    $scope.checkSpelling = function () {
        $scope.show = true;
        $ionicLoading.show({
            template: 'Loading...'
        });
        var item = { User_Id: $scope.userInfo.userId, IsSpellCheck: 1 };
        momentService.insertTransliterationDetails(item).then(function (data) {
            var message = $scope.transaltionObj.message;
            $rootScope.messageToChangeSpell = message;
            $rootScope.array_of_suggestions = $scope.dictionary.suggest(message);
            console.log($rootScope.array_of_suggestions);
            $ionicLoading.hide();
            $state.go('spellCheck', {}, { reload: true });
        }, function (error) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: error.Message
            });
        });
        
    }

    $scope.showRight = function (id, item) {
        $ionicLoading.show({
            template: 'Loading...'
        });
        var Id = "rightDiv_" + id;
        console.log(Id);
        var allElements = angular.element(document.querySelectorAll('[id^="rightDiv_"]'));
        for (var i = 0; i < allElements.length; i++) {
            allElements[i].innerHTML = '';
        }
        var myElement = angular.element(document.querySelector('#' + Id));
        console.log(myElement);
        if (myElement[0].innerHTML) {
            myElement[0].innerHTML = '';
        }
        else {
            myElement[0].innerHTML = '<img src="img/ok.png" style="border:none !important;width:12px;float:right;"/>';
        }
        Id = "content";
        var myElement1 = angular.element(document.querySelector('#' + Id));
        myElement1[0].style.color = "red";
        myElement1[0].style.textDecoration = "line-through";
        Id = "correctContent";
        myElement1 = angular.element(document.querySelector('#' + Id));
        myElement1[0].style.color = "green";
        $scope.correctSpellingText = item;
        $scope.isShowImg = true;
        if ($scope.isShowCorrect == false) {
            $scope.isShowCorrect = true;
        }
        else {
            $scope.isShowCorrect = true;
        }
        $ionicLoading.hide();

    }
    $scope.takeToChat = function () {
        $state.go('chat');
    }

    $scope.sendChatAfterSpellCheck = function () {
        $ionicLoading.show({
            template: 'Loading...'
        });
        var myElement1 = angular.element(document.querySelector('#notes'));
        var notes = myElement1[0].value;
        var query = "INSERT INTO ChatTable (senderId, reciverId,message,IsSender,imagePath,videoPath,IsCorrected,CorrectedText,IncorrectText,Notes,IsFavourite) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
        $cordovaSQLite.execute($scope.db, query, [$scope.userInfo.userId, $scope.recieverId, undefined, 1, undefined, undefined, 1, $scope.correctSpellingText, $scope.messageToChangeSpell, notes, 0]).then(function (res) {
            $ionicLoading.hide();
            $state.go('chat', {}, { reload: true });
        }, function (err) {
            $ionicLoading.hide();
            console.error(err);

        });

    }


    $scope.markAsFav = function () {
        $ionicLoading.show({
            template: 'Loading....'
        });

        var message = $scope.transaltionObj.message;
        var isSender = $scope.transaltionObj.isSender;
        var item = { Message: message, FavouriteUserId: $scope.userInfo.userId, IsSender: 0, SenderRecieverId: 0, MomentId: 0 };
        momentService.markMomentAsFavourite(item).then(function (data) {
            var query = "Update ChatTable set IsFavourite= ? Where id=?";
            $cordovaSQLite.execute($scope.db, query, [1, $scope.transaltionObj.messageID]).then(function (res) {
                var message = "INSERT ID -> " + res.insertId;
                console.log(message);
                if (isSender == 1) {
                    if ($scope.senderFav == undefined) {
                        $scope.senderFav = [];
                    }
                    $scope.senderFav[$scope.transaltionObj.messageID] = true;
                }
                $scope.show = true;
                $ionicLoading.hide();
            }, function (err) {
                console.error(err);
                //alert(err);
            });

        }, function (error) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: 'There is some error. Please try again later.'
            });

        });
       
       
    }


    $scope.goToUserProfile = function (userId) {
        var obj = JSON.stringify({ userId: userId });
        $window.localStorage["userProfile"] = obj;

        $state.go('publicProfile', {}, { reload: true });
    }
});