app.controller('SpellCheckCtrl', function ($scope, $stateParams, ionicMaterialInk, $ionicPopup, $timeout, authService, $state, $window, $rootScope, $cordovaSQLite, $ionicLoading) {
    //ionic.material.ink.displayEffect();
    ionicMaterialInk.displayEffect();

    // Toggle Code Wrapper
    var code = document.getElementsByClassName('code-wrapper');
    for (var i = 0; i < code.length; i++) {
        code[i].addEventListener('click', function () {
            this.classList.toggle('active');
        });
    }

    $scope.userInfo = JSON.parse($window.localStorage["userInfo"]);
    var db = $scope.db = $cordovaSQLite.openDB({ name: "my.db", location: "default" });
    if ($window.localStorage["userDetails"]) {
        var userDetails = JSON.parse($window.localStorage["userDetails"]);
        $scope.recieverId = userDetails.userId;
    }
    $scope.takeToChat = function () {
        if ($rootScope.isSpellCheckFromChat && $rootScope.isSpellCheckFromChat == true) {
            $state.go('chat');
        }
    }

    $scope.showHelp = function () {
        $scope.IsShowHelp = true;
        if ($rootScope.array_of_suggestions.length == 0) {
            var alertPopup = $ionicPopup.alert({
                title: 'Info',
                template: 'Sorry !!! No Suggestions available.'
            });
        }
    }
    $scope.edit = function () {
        $scope.incorrectTextArray = $rootScope.messageToChangeSpell.split(" ");
        $scope.IsShowEdit = false;
        $scope.correctSpellingText = $rootScope.messageToChangeSpell;
        $scope.isShowCorrect = true;
    }
    $scope.reset = function () {
        $scope.incorrectTextArray = $rootScope.messageToChangeSpell.split(" ");
        $scope.correctSpellingText = $rootScope.messageToChangeSpell;
        $scope.isShowCorrect = true;
        $scope.isShowImg = false;
        var incorrectElement = angular.element(document.querySelector('#content'))[0];
        var correctElement = angular.element(document.querySelector('#correctContent'))[0];
        incorrectElement.innerHTML = $rootScope.messageToChangeSpell;
        incorrectElement.style.color = "black";
        incorrectElement.style.textDecoration = "none";
        correctElement.value = $rootScope.messageToChangeSpell;
        correctElement.style.color = "black";
        angular.element(document.querySelector('#appendedId'))[0].innerHTML = '';
        $rootScope.btnText = "OK";
        $scope.IsShowHelp = false;
    }


    $scope.sendChatAfterSpellCheck = function () {
        $ionicLoading.show({
            template: 'Loading...'
        });
        var Id;
        var lengthOfArray;
        var myElement1 = angular.element(document.querySelector('#correctContent'));;
        if ($rootScope.btnText && $rootScope.btnText == "OK") {
            $scope.correctSpellingText = myElement1[0].value;
            $scope.correctedTextArray = myElement1[0].value.split(" ");
            if ($scope.correctedTextArray.toString() == $scope.incorrectTextArray.toString())
            { }
            else {
                $scope.isShowCorrect = false;
                if ($scope.correctedTextArray.length == $scope.incorrectTextArray.length) {
                    lengthOfArray = $scope.correctedTextArray.length;
                }
                else {
                    lengthOfArray = $scope.correctedTextArray.length > $scope.incorrectTextArray.length ? $scope.correctedTextArray : $scope.incorrectTextArray.length;
                }

                var lengthOfArray = $scope.correctedTextArray.length;
                var html;
                var correctHtml;
                for (var i = 0; i < lengthOfArray; i++) {
                    if ($scope.correctedTextArray[i] != $scope.incorrectTextArray[i]) {
                        if ($scope.incorrectTextArray[i]) {
                            var redText = '<span style="color:red;text-decoration:line-through;">' + $scope.incorrectTextArray[i] + '</span>';
                            if (html) {
                                html = html + " " + redText;
                            }
                            else {
                                html = redText;
                            }
                        }
                        var greenText = '<span style="color:green;">' + $scope.correctedTextArray[i] + '</span>';
                        if (correctHtml) {
                            correctHtml = correctHtml + " " + greenText;
                        }
                        else {
                            correctHtml = greenText;
                        }
                    }
                    else {
                        if (html) {
                            html = html + " " + $scope.correctedTextArray[i];

                        }
                        else {
                            html = $scope.correctedTextArray[i];
                        }
                        if (correctHtml) {
                            correctHtml = correctHtml + " " + $scope.correctedTextArray[i];
                        }
                        else {
                            correctHtml = $scope.correctedTextArray[i];
                        }
                    }
                }
                angular.element(document.querySelector('#content'))[0].innerHTML = html;
                angular.element(document.querySelector('#appendedId'))[0].innerHTML = correctHtml;

            }
            $scope.isShowImg = true;
            $rootScope.btnText = "Send";
            $ionicLoading.hide();
        }
        else if ($rootScope.btnText && $rootScope.btnText == "Send") {
            if ($rootScope.isSpellCheckFromChat && $rootScope.isSpellCheckFromChat == true) {
                var notElement = angular.element(document.querySelector('#notes'));
                var notes = notElement[0].value;
                var query = "INSERT INTO ChatTable (senderId, reciverId,message,IsSender,imagePath,videoPath,IsCorrected,CorrectedText,IncorrectText,Notes,IsFavourite,TranslatedText) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
                $cordovaSQLite.execute($scope.db, query, [$scope.userInfo.userId, $scope.recieverId, undefined, 1, undefined, undefined, 1, $scope.correctSpellingText, $scope.messageToChangeSpell, notes, 0, undefined]).then(function (res) {
                    var data = { senderId: $scope.userInfo.userId, recieverId: $scope.recieverId, message: $scope.correctSpellingText, image: undefined, video: undefined, IncorrectText: $scope.messageToChangeSpell, Notes: notes };
                    data = JSON.stringify(data);
                    console.log(data);
                    $rootScope.socket.emit('chat_send', data);
                    $ionicLoading.hide();
                    $state.go('chat', {}, { reload: true });
                }, function (err) {
                    $ionicLoading.hide();
                    console.error(err);

                });
            }
            else if ($rootScope.isSpellCheckFromChat == false) {
                $ionicLoading.hide();
                $rootScope.spellCheckForPrctcObj = { InputText: $scope.messageToChangeSpell, OutputText: $scope.correctSpellingText };
                $state.go('practice', {}, { reload: true });
            }

        }

    }



    $scope.showRight = function (id, item) {
        $ionicLoading.show({
            template: 'Loading...'
        });
        $scope.IsShowEdit = false;
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
        $rootScope.btnText = "Send";
        $ionicLoading.hide();

    }
});