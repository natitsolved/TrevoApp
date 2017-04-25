var app = angular.module('starter');

app.run(function ($ionicPlatform) {

    

    $ionicPlatform.ready(function () {

        //setTimeout(function () {
        //    navigator.splashscreen.hide();
        //}, 300);

        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(false);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });


});






app.run(['$rootScope', '$state', '$stateParams', '$ionicPlatform', '$ionicPopup', '$state', '$window',
    function ($rootScope, $state, $stateParams, $ionicPlatform, $ionicPopup, $state, $window) {
        // Attach Fastclick for eliminating the 300ms delay between a physical tap and the firing of a click event on mobile browsers
        // FastClick.attach(document.body);

        // Set some reference to access them from any scope
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        // GLOBAL APP SCOPE

        $rootScope.serviceurl = "http://166.62.40.135:8094/";

        $rootScope.googleTranslateApiKey = 'AIzaSyCKHfDvsb99AxdT_sWV8u04Co7uwwvYevw';


      
        $ionicPlatform.ready(function () {


            // listen for Online event
            var isOnline = true;
            $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
                if (isOnline) return;

                isOnline = true;

                console.log('We Are Online');
            });

            $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
                if (!isOnline) return;

                isOnline = false;

                /* $ionicPopup.confirm({
                                title: "The internet is disconnected on your device.",
                                content: "Are Sure "
                              });  */
                var alertconnectivityPopup = $ionicPopup.alert({
                    title: "Internet Disconnected",
                    content: "The internet is disconnected on your device."
                });

                alertconnectivityPopup.then(function (res) {
                    ionic.Platform.exitApp(); // stops the app
                });
            });
            if ($window.localStorage["userInfo"]) {
                $window.localStorage["activeFooter"] = "user";
                $state.go('userListing', {}, { reload: true });
            }
            else {
                $state.go('afterSplash', {}, { reload: true });
            }
           
        });
        
        //disabling the back button of the phone.
      
        $ionicPlatform.registerBackButtonAction(function (event) {
            event.preventDefault();
        }, 100);





    }]);

app.filter('htmlToPlaintext', function () {
    return function (text) {
        return text ? String(text).replace(/<[^>]+>/gm, '') : '';
    };
}
);

app.
  filter('removecharacter', function () {
      return function (text) {
          return text ? String(text).replace(/\(([^)]+)\)/g, '') : '';
      };
  }
);

app.filter('ampersand', function () {
    return function (input) {
        return input ? input.replace(/&amp;/, '&') : '';
    }
});

app.filter('cut', function () {
    return function (value, wordwise, max, tail) {
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
                //Also remove . and , so its gives a cleaner result.
                if (value.charAt(lastspace - 1) == '.' || value.charAt(lastspace - 1) == ',') {
                    lastspace = lastspace - 1;
                }
                value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' �');
    };
});
app.directive('onLongPress', function ($timeout) {
    return {
        restrict: 'A',
        link: function ($scope, $elm, $attrs) {
            $elm.bind('touchstart', function (evt) {
                // Locally scoped variable that will keep track of the long press
                $scope.longPress = true;

                // We'll set a timeout for 600 ms for a long press
                $timeout(function () {
                    if ($scope.longPress) {
                        // If the touchend event hasn't fired,
                        // apply the function given in on the element's on-long-press attribute
                        $scope.$apply(function () {
                            $scope.$eval($attrs.onLongPress)
                        });
                    }
                }, 600);
            });

            $elm.bind('touchend', function (evt) {
                // Prevent the onLongPress event from firing
                $scope.longPress = false;
                // If there is an on-touch-end function attached to this element, apply it
                if ($attrs.onTouchEnd) {
                    $scope.$apply(function () {
                        $scope.$eval($attrs.onTouchEnd)
                    });
                }
            });
        }
    };
})


/*
app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    var push = new Ionic.Push({
      "debug": true
    });
 
    push.register(function(token) {
      console.log("My Device token:",token.token);
      push.saveToken(token);  // persist the token in the Ionic Platform
    });
  });
});  */