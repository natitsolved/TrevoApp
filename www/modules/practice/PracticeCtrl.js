app.controller('PracticeCtrl', function ($scope, $state, $window, $ionicLoading, momentService, $rootScope, $http, $cordovaSQLite, $ionicPopup) {



    if ($rootScope.isManual && $rootScope.isManual == true) {
        $scope.IsReadOnly = false;
        $scope.isShowOptions = false;
    }
    else {
        $scope.IsReadOnly = true;
        $scope.isShowOptions = true;
    }
    $scope.dictionary = new Typo("en_US", false, false, { dictionaryPath: "js/dictionaries" });
    $scope.deckList = [];

    $scope.init = function () {
        $ionicLoading.show({
            template: 'Loading...'
        });
        $scope.IsShowReset = true;
        $scope.show = true;
        $scope.optionShow = true;
        if ($rootScope.spellCheckForPrctcObj) {
            $scope.inputText = $rootScope.spellCheckForPrctcObj.InputText;
            $scope.IsSpellCheck = 1;
            $scope.IsTranslate = 0;
            $scope.IsTTS = 0
            var myElement1 = angular.element(document.querySelector('#inputContent'));
            myElement1[0].style.color = "red";
            myElement1[0].style.textDecoration = "line-through";
            myElement1 = angular.element(document.querySelector('#correctContent'));
            myElement1[0].style.color = "green";
            //angular.element(document.querySelector('#inputContent')).val($rootScope.spellCheckForPrctcObj.InputText);
            $scope.outputText = $rootScope.spellCheckForPrctcObj.OutputText;
            $rootScope.spellCheckForPrctcObj = '';
        }
        var db = $scope.db = $cordovaSQLite.openDB({ name: "my.db", location: "default" });

        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS DeckTable (Id integer primary key, DeckName Text,UserId integer not null)");
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS CardDetails (CardId integer primary key, DeckName Text,UserId integer not null,IsTTS integer not null, IsSpellCheck integer not null, IsTranslate integer not null, MainText Text ,CorrectedText Text, TranslatedText Text,IsManual integer not null)");

        var query = "Select * from  DeckTable";
        $cordovaSQLite.execute(db, query, []).then(function (data) {
            $scope.deckList = [];
            for (var i = 0; i < data.rows.length; i++) {
                $scope.deckList.push(data.rows.item(i));
            }
            $ionicLoading.hide();
        }, function (err) {
            $ionicLoading.hide();
            console.error(JSON.stringify(err));
        });
    }


    $scope.init();
    $scope.userInfo = JSON.parse($window.localStorage["userInfo"]);

    $scope.speakText = function (value) {
        $scope.IsTTS = 1;
        $scope.IsTranslate = 0;
        $scope.IsSpellCheck = 0;
        console.log(value);
        $ionicLoading.show({
            template: 'Loading...'
        });
        $scope.isShowSuggestion = false;
        var Id = "inputContent";
        var myElement1 = angular.element(document.querySelector('#' + Id));
        myElement1[0].style.color = "black";
        myElement1[0].style.textDecoration = "none";
        Id = "correctContent";
        myElement1 = angular.element(document.querySelector('#' + Id));
        myElement1[0].style.color = "black";
        var item = { User_Id: $scope.userInfo.userId, IsTTS: 1, Details: value };
        momentService.insertTransliterationDetails(item).then(function (data) {
            window.TTS.speak({
                text: value,
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


    $scope.translateText = function (value) {
        $scope.IsTTS = 0;
        $scope.IsTranslate = 1;
        $scope.IsSpellCheck = 0;
        $ionicLoading.show({
            template: 'Loading...'
        });
        $scope.isShowSuggestion = false;
        var Id = "inputContent";
        var myElement1 = angular.element(document.querySelector('#' + Id));
        myElement1[0].style.color = "black";
        myElement1[0].style.textDecoration = "none";
        Id = "correctContent";
        myElement1 = angular.element(document.querySelector('#' + Id));
        myElement1[0].style.color = "black";
        var item = { User_Id: $scope.userInfo.userId, IsTranslate: 1, Details: value };
        momentService.insertTransliterationDetails(item).then(function (data) {
            var targetEn = $scope.userInfo.nativeLang;
            if (targetEn) {
                var urlToHitForDetection = 'https://translation.googleapis.com/language/translate/v2/detect?key=' + $rootScope.googleTranslateApiKey + '&q=' + value;

                $http({
                    url: urlToHitForDetection,
                }).then(function (data) {
                    var sourceEn = data.data.data.detections[0][0].language;
                    var urlToHit = 'https://translation.googleapis.com/language/translate/v2?key=' + $rootScope.googleTranslateApiKey + '&source=' + sourceEn + '&target=' + targetEn + '&q=' + value;
                    $http({
                        url: urlToHit,
                    }).then(function (data) {
                        $scope.outputText = data.data.data.translations[0].translatedText;
                        $ionicLoading.hide();
                    }, function (error) {
                        $ionicLoading.hide();
                        // var alertPopup = $ionicPopup.alert({
                        //     title: 'Incorect',
                        //     template: error.data.error.message
                        // });
                         $scope.outputText=value;
                    });
                }, function (error1) {
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                        title: 'Incorect',
                        template: error1.data.error.message
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



    $scope.spellCorrection = function (value) {
        $scope.IsTTS = 0;
        $scope.IsTranslate = 0;
        $scope.IsSpellCheck = 1;
        $ionicLoading.show({
            template: 'Loading...'
        });
        var message = value;
        var item = { User_Id: $scope.userInfo.userId, IsSpellCheck: 1, Details: value };
        momentService.insertTransliterationDetails(item).then(function (data) {
            $scope.isShowSuggestion = true;
            $rootScope.array_of_suggestions = $scope.dictionary.suggest(message);
            $rootScope.messageToChangeSpell = message;
            $rootScope.IsShowEdit = true;
            $rootScope.btnText = "OK";
            $rootScope.isSpellCheckFromChat = false;
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
        Id = "inputContent";
        var myElement1 = angular.element(document.querySelector('#' + Id));
        myElement1[0].style.color = "red";
        myElement1[0].style.textDecoration = "line-through";
        Id = "correctContent";
        myElement1 = angular.element(document.querySelector('#' + Id));
        myElement1[0].style.color = "green";
        $scope.outputText = item;
        $scope.isShowImg = true;
        if ($scope.isShowCorrect == false) {
            $scope.isShowCorrect = true;
        }
        else {
            $scope.isShowCorrect = true;
        }
        $ionicLoading.hide();

    }


    $scope.takeToProfile = function () {
        $state.go('profile', {}, { reload: true });

    }

    $scope.reset = function () {
        var Id = "inputContent";
        var myElement1 = angular.element(document.querySelector('#' + Id));
        myElement1[0].value = '';
        myElement1[0].style.color = "black";
        myElement1[0].style.textDecoration = "none";
        Id = "correctContent";
        myElement1 = angular.element(document.querySelector('#' + Id));
        myElement1[0].value = '';
        myElement1[0].style.color = "black";
        // $state.go('practice',{},{reload:true});
    }

    $scope.hideCard = function () {
        $scope.show = true;
    }

    $scope.openCard = function () {
        $scope.show = false;
        $scope.optionShow = false;
        $scope.textBoxShow = true;
    }

    $scope.showDeckAdd = function () {
        $scope.optionShow = true;
        $scope.textBoxShow = false;
    }


    $scope.saveDeck = function () {
        if ($scope.deckName) {
            $ionicLoading.show({
                template: 'Loading...'
            });
            var query = "INSERT INTO DeckTable (DeckName,UserId) VALUES (?,?)";
            $cordovaSQLite.execute($scope.db, query, [$scope.deckName, $scope.userInfo.userId]).then(function (data) {
                $ionicLoading.hide();
                $scope.deckName = '';
                $scope.init();
            }, function (err) {
                $ionicLoading.hide();
                console.error(JSON.stringify(err));
            });
        }
        else {
            var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: "Please give a name to save the deck."
            });
        }

    }


    $scope.setTheSelectedDeck = function (item, data) {
        $rootScope.selectedDeck = item.DeckName;
        $scope.IsShowDeleteButton = true;
    }

    $scope.showPractice = function () {
        $scope.show = true;
        if ($rootScope.selectedDeck) {
            $rootScope.isManual = false;
            $state.go('practice', {}, { reload: true });
        }
        else {
            var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: "Please select a deck first to add a card."
            });
        }
    }

    $scope.showPracticeForManual = function () {
        $scope.show = true;
        if ($rootScope.selectedDeck) {
            $rootScope.isManual = true;
            $state.go('practice', {}, { reload: true });
        }
        else {
            var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: "Please select a deck first to add a card."
            });
        }
    }


    $scope.deleteDeck = function () {
        $scope.IsShowDeleteButton = false;
        if ($rootScope.selectedDeck) {
            var query = "Delete FROM DeckTable where DeckName=?;";
            $cordovaSQLite.execute($scope.db, query, [$rootScope.selectedDeck]).then(function (data) {
                $rootScope.selectedDeck = '';
                $scope.init();
            }, function (err) {
                console.error(JSON.stringify(err));
            });
        }
        else {
            var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: "Please select a deck first to delete it."
            });
        }
    }

    $scope.saveCardToDeck = function () {
        var inputText = angular.element(document.querySelector('#inputContent')).val();
        if (inputText) {
            if ($scope.IsTTS == 1 || $scope.IsTranslate == 1 || $scope.IsSpellCheck == 1) {
                $ionicLoading.show({
                    template: 'Loading...'
                });
                var correctedText, translatedText;
                if ($scope.IsTTS == 1) {
                    correctedText = null;
                    translatedText = null;
                }
                else if ($scope.IsTranslate == 1) {
                    correctedText = null;
                    translatedText = $scope.outputText;
                }
                else if ($scope.IsSpellCheck == 1) {
                    correctedText = $scope.outputText;
                    translatedText = null;
                }
                var query = "INSERT INTO CardDetails (DeckName,UserId,IsTTS, IsSpellCheck, IsTranslate, MainText ,CorrectedText, TranslatedText,IsManual) VALUES (?,?,?,?,?,?,?,?,?)";
                $cordovaSQLite.execute($scope.db, query, [$rootScope.selectedDeck, $scope.userInfo.userId, $scope.IsTTS, $scope.IsSpellCheck, $scope.IsTranslate, inputText, correctedText, translatedText, 0]).then(function (data) {
                    $ionicLoading.hide();
                    $scope.deckName = '';
                    $state.go('deck', {}, { reload: true });
                }, function (err) {
                    $ionicLoading.hide();
                    console.error(JSON.stringify(err));
                });
            }
            else {
                if ($rootScope.isManual == false) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Error',
                        template: "Please do any of the operation first to save."
                    });
                }
                else if ($rootScope.isManual && $rootScope.isManual == true) {
                    var outText = angular.element(document.querySelector('#correctContent')).val();
                    var query = "INSERT INTO CardDetails (DeckName,UserId,IsTTS, IsSpellCheck, IsTranslate, MainText ,CorrectedText, TranslatedText,IsManual) VALUES (?,?,?,?,?,?,?,?,?)";
                    $cordovaSQLite.execute($scope.db, query, [$rootScope.selectedDeck, $scope.userInfo.userId, 0, 0, 0, inputText, outText, null, 1]).then(function (data) {
                        $ionicLoading.hide();
                        $scope.deckName = '';
                        $state.go('deck', {}, { reload: true });
                    }, function (err) {
                        $ionicLoading.hide();
                        console.error(JSON.stringify(err));
                    });
                }
            }
        }
        else {
            var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: "Please do any of the operation first to save."
            });
        }


    }


    $scope.takeToPracticeSession = function (name) {
        $rootScope.selectedDeckForPractice = name;
        $state.go('practiceSession', {}, { reload: true });
    }


    $scope.showButton = function (value) {
        if (value == 'button1') {
            $scope.showPasteButton = true;
            $scope.IsShowReset = false;
        }
        else if (value == 'button2') {
            if ($scope.IsReadOnly == false) {
                $scope.showPasteButton2 = true;
                $scope.IsShowReset = true;
            }
        }
    }

    $scope.pasteText = function () {
        $scope.IsShowReset = true;
        if ($rootScope.coipedMessage) {
            if ($scope.showPasteButton == true) {
                $scope.inputText = $rootScope.coipedMessage;
            }
            else if ($scope.showPasteButton2 == true) {
                $scope.outputText = $rootScope.coipedMessage;
            }
        }
        $scope.showPasteButton = false;
        $scope.showPasteButton2 = false;
    }

});