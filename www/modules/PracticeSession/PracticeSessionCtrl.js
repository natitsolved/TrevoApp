app.controller('PracticeSessionCtrl', function ($scope, $state, $window,$ionicLoading,momentService,$rootScope,$http,$cordovaSQLite,$ionicPopup) {




$scope.init=function()
{
    if($rootScope.selectedDeckForPractice)
    {
          $ionicLoading.show({
            template: 'Loading...'
        });
$scope.show=true;
$scope.optionShow=true;
 var db = $scope.db = $cordovaSQLite.openDB({ name: "my.db", location: "default" });

    
 var query = "Select * from  CardDetails where DeckName=?";
    $cordovaSQLite.execute(db, query, [$rootScope.selectedDeckForPractice]).then(function (data) {
        for (var i = 0; i < data.rows.length; i++) {
            $scope.cardDetails=data.rows.item(i);
            break;
        }
        $ionicLoading.hide();
    }, function (err) {
        $ionicLoading.hide();
        console.error(JSON.stringify(err));
    });
}

  
}


$scope.init();
$scope.userInfo=JSON.parse($window.localStorage["userInfo"]);



$scope.showAnswer=function()
{
    if($scope.cardDetails)
    {
       if($scope.cardDetails.IsManual==1)
       {
           $scope.IsShowCorrectedText=true;
              var Id = "inputPracticeContent";
        var myElement1 = angular.element(document.querySelector('#' + Id));
        myElement1[0].style.color = "black";
        myElement1[0].style.textDecoration = "none";
        Id = "correctPracticeContent";
        myElement1 = angular.element(document.querySelector('#' + Id));
        myElement1[0].style.color = "black";
               $scope.OutText=$scope.cardDetails.CorrectedText;
       }
       else
       {
if($scope.cardDetails.IsTTS==1)
        {
            $scope.IsShowCorrectedText=false;
             var Id = "inputPracticeContent";
        var myElement1 = angular.element(document.querySelector('#' + Id));
        myElement1[0].style.color = "black";
        myElement1[0].style.textDecoration = "none";
             window.TTS.speak({
                text: $scope.cardDetails.MainText,
                locale: 'en-GB',
                rate: 1.5
            }, function () {
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            }, function () {
                $ionicLoading.hide();
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            });
        }
        else if($scope.cardDetails.IsSpellCheck==1 || $scope.cardDetails.IsTranslate==1)
        {
          $scope.IsShowCorrectedText=true;
          if($scope.cardDetails.IsSpellCheck==1)
          {
              var Id = "inputPracticeContent";
        var myElement1 = angular.element(document.querySelector('#' + Id));
        myElement1[0].style.color = "red";
        myElement1[0].style.textDecoration = "line-through";
        Id = "correctPracticeContent";
        myElement1 = angular.element(document.querySelector('#' + Id));
        myElement1[0].style.color = "green";
              $scope.OutText=$scope.cardDetails.CorrectedText;
          }
           else if($scope.cardDetails.IsTranslate==1)
           {
               var Id = "inputPracticeContent";
        var myElement1 = angular.element(document.querySelector('#' + Id));
        myElement1[0].style.color = "black";
        myElement1[0].style.textDecoration = "none";
        Id = "correctPracticeContent";
        myElement1 = angular.element(document.querySelector('#' + Id));
        myElement1[0].style.color = "black";
               $scope.OutText=$scope.cardDetails.TranslatedText;
           }
        }
       }
        
        if($scope.cardDetails.CardId==1)
        {
            var id=$scope.cardDetails.CardId+1;
            var sql="Select * from  CardDetails where CardId=?";
                 $cordovaSQLite.execute($scope.db, sql, [id]).then(function (data) {
                     if(data.rows.length==0)
                     {
                         $scope.IsShowNext=false;
                     }
                     else
                     {
                         $scope.IsShowNext=true;
                     }
        // for (var i = 0; i < data.rows.length; i++) {
        //     $scope.cardDetails=data.rows.item(i);
            
        // }
        $ionicLoading.hide();
        
    }, function (err) {
        $ionicLoading.hide();
        console.error(JSON.stringify(err));
    });
        }
        
    }
}


    

    $scope.takeToDeck=function()
    {
$state.go('deck',{},{reload:true});

    }


    $scope.showNext=function()
    {
        $scope.IsShowCorrectedText=false;
        $ionicLoading.show({
            template: 'Loading...'
        });
        var Id = "inputPracticeContent";
        var myElement1 = angular.element(document.querySelector('#' + Id));
        myElement1[0].style.color = "black";
        myElement1[0].style.textDecoration = "none";
        $scope.IsShowPrevious=true;
        var id=$scope.cardDetails.CardId+1;
                var sql="Select * from  CardDetails where CardId=?";
                 $cordovaSQLite.execute($scope.db, sql, [id]).then(function (data) {
        for (var i = 0; i < data.rows.length; i++) {
            $scope.cardDetails=data.rows.item(i);
            
        }
        id=id+1
 $cordovaSQLite.execute($scope.db, sql, [id]).then(function (data) {
        
        if(data.rows.length==0)
        {
            $scope.IsShowNext=false;
        }
        else if(data.rows.length>0)
        {
            $scope.IsShowNext=true;
        }
        $ionicLoading.hide();
    }, function (err) {
        $ionicLoading.hide();
        console.error(JSON.stringify(err));
    });
        
    }, function (err) {
        $ionicLoading.hide();
        console.error(JSON.stringify(err));
    });
    }


$scope.showPrevious=function()
{
     $scope.IsShowCorrectedText=false;
     $ionicLoading.show({
            template: 'Loading...'
        });
    $scope.IsShowNext=true;
    var Id = "inputPracticeContent";
        var myElement1 = angular.element(document.querySelector('#' + Id));
        myElement1[0].style.color = "black";
        myElement1[0].style.textDecoration = "none";
    if($scope.cardDetails)
    {
            var id=$scope.cardDetails.CardId-1;
                var sql="Select * from  CardDetails where CardId=?";
                 $cordovaSQLite.execute($scope.db, sql, [id]).then(function (data) {
                     if(id==1)
                     {
                         $scope.IsShowPrevious=false;
                     }
                     else
                     {
                         $scope.IsShowPrevious=true;
                     }
        for (var i = 0; i < data.rows.length; i++) {
            $scope.cardDetails=data.rows.item(i);
            
        }
       $ionicLoading.hide();
        
    }, function (err) {
       $ionicLoading.hide();
        console.error(JSON.stringify(err));
    });
    }
}

});