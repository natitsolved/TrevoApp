var app = angular.module('starter');
app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$ocLazyLoadProvider', 'JS_REQUIRES',
function ($stateProvider, $urlRouterProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $ocLazyLoadProvider, jsRequires, $authProvider, $locationProvider) {

    app.controller = $controllerProvider.register;
    app.directive = $compileProvider.directive;
    app.filter = $filterProvider.register;
    app.factory = $provide.factory;
    app.service = $provide.service;
    app.constant = $provide.constant;
    app.value = $provide.value;

    // LAZY MODULES
    $ocLazyLoadProvider.config({
        debug: false,
        events: true,
        modules: jsRequires.modules
    });

    $stateProvider

       .state('signin', {
           url: '/signin',
           templateUrl: 'modules/login/sign_in.html',
           resolve: loadSequence('login'),
           controller: 'SigninCtrl'

       })


    .state('signup', {
        url: '/signup',
        templateUrl: 'modules/register/sign_up.html',
        resolve: loadSequence('signup', '720kb.datepicker'),
        controller: 'RegisterCtrl'

    })
        .state('signupnext', {
            url: '/signupnext',
            templateUrl: 'modules/register/sign_up_2.html',
            resolve: loadSequence('signup', '720kb.datepicker'),
            controller: 'RegisterCtrl'

        })

     .state('chat', {
         url: '/chat',
         templateUrl: 'modules/chat/chat.html',
         resolve: loadSequence('chat'),
         controller: 'ChatCtrl'

     })

        .state('chatbot', {
            url: '/chatbot',
            templateUrl: 'modules/chatbot/chatbot.html',
            resolve: loadSequence('chatbot'),
            controller: 'ChatbotCtrl'

        })

    .state('chatTranslate', {
        url: '/translate',
        templateUrl: 'modules/chat/modal.html',
        resolve: loadSequence('chat'),
        controller: 'ModalCtrl'
    })
    .state('userListing', {
        url: '/userList',
        templateUrl: 'modules/users/userListing.html',
        resolve: loadSequence('usersListing'),
        controller: 'UserCtrl'
    })
     .state('forgotPass', {
         url: '/forgotPass',
         templateUrl: 'modules/forgot-password/forgot_password.html',
         resolve: loadSequence('forgotPass'),
         controller: 'ForgotPswdCtrl'
     })
        .state('afterSplash', {
            url: '/welcome',
            templateUrl: 'modules/app/after-splash.html',
            resolve: loadSequence('welcome'),
            controller: 'AppCtrl'
        })
     .state('externalsignup', {
         url: '/externalsignup',
         templateUrl: 'modules/external-register/external_sign_up.html',
         resolve: loadSequence('signup', '720kb.datepicker'),
         controller: 'ExternalRegisterCtrl'
     })

    ;

    $urlRouterProvider.otherwise('welcome');
    function loadSequence() {
        var _args = arguments;
        return {
            deps: ['$ocLazyLoad', '$q',
			function ($ocLL, $q) {
			    var promise = $q.when(1);
			    for (var i = 0, len = _args.length; i < len; i++) {
			        promise = promiseThen(_args[i]);
			    }
			    return promise;

			    function promiseThen(_arg) {
			        if (typeof _arg == 'function')
			            return promise.then(_arg);
			        else
			            return promise.then(function () {
			                var nowLoad = requiredData(_arg);
			                if (!nowLoad)
			                    return $.error('Route resolve: Bad resource name [' + _arg + ']');
			                return $ocLL.load(nowLoad);
			            });
			    }

			    function requiredData(name) {
			        if (jsRequires.modules)
			            for (var m in jsRequires.modules)
			                if (jsRequires.modules[m].name && jsRequires.modules[m].name === name)
			                    return jsRequires.modules[m];
			        return jsRequires.scripts && jsRequires.scripts[name];
			    }
			}]
        };
    }

}]);
