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
            .state('spellCheck', {
                url: '/spellCheck',
                templateUrl: 'modules/spell-check/spellChecker.html',
                resolve: loadSequence('spellCheck'),
                controller: 'SpellCheckCtrl'

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
            .state('changePass', {
                url: '/changePass',
                templateUrl: 'modules/change-password/change-password.html',
                resolve: loadSequence('changePass'),
                controller: 'ChangePasswordCtrl'
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
            .state('externalsignupnext', {
                url: '/externalsignupnext',
                templateUrl: 'modules/external-register/external_sign_up_2.html',
                resolve: loadSequence('signup', '720kb.datepicker'),
                controller: 'ExternalRegisterCtrl'
            })
            .state('discover', {
                url: '/discover',
                templateUrl: 'modules/mirror/mirror.html',
                resolve: loadSequence('discover'),
                controller: 'MirrorCtrl'
            })
            .state('discoverList', {
                url: '/discoverList',
                templateUrl: 'modules/mirror/mirrorListByParent.html',
                resolve: loadSequence('discover'),
                controller: 'MirrorCtrl'
            })
            .state('discoverListByLang', {
                url: '/discoverListByLang',
                templateUrl: 'modules/mirror/mirrorListByNativeLearnLang.html',
                resolve: loadSequence('discover'),
                controller: 'MirrorCtrl'
            })
            .state('profile', {
                url: '/profile',
                templateUrl: 'modules/profile/profile.html',
                resolve: loadSequence('profile'),
                controller: 'ProfileCtrl'
            })
            .state('blockedUserList', {
                url: '/blockedUserList',
                templateUrl: 'modules/profile/BlockedUserList.html',
                resolve: loadSequence('profile'),
                controller: 'ProfileCtrl'
            })
            .state('newDiscover', {
                url: '/newDiscover',
                templateUrl: 'modules/profile/NewDiscover.html',
                resolve: loadSequence('profile'),
                controller: 'ProfileCtrl'
            })
            .state('userUpdate', {
                url: '/userUpdate',
                templateUrl: 'modules/profile/userUpdate.html',
                resolve: loadSequence('profile'),
                controller: 'ProfileCtrl'
            })
            .state('hobbies', {
                url: '/hobbies',
                templateUrl: 'modules/profile/hobbies.html',
                resolve: loadSequence('profile'),
                controller: 'ProfileCtrl'
            })
            .state('publicProfile', {
                url: '/publicProfile',
                templateUrl: 'modules/publicProfile/publicProfile.html',
                resolve: loadSequence('profile'),
                controller: 'publicProfileCtrl'
            })
            .state('search', {
                url: '/search',
                templateUrl: 'modules/search/search.html',
                resolve: loadSequence('search'),
                controller: 'SearchCtrl'
            })
            .state('advancedSearch', {
                url: '/advancedSearch',
                templateUrl: 'modules/advanced-search/advancedSearch.html',
                resolve: loadSequence('search'),
                controller: 'advancedSearchCtrl'
            })
            .state('advancedSearchUserListing', {
                url: '/advancedSearchUserListing',
                templateUrl: 'modules/advanced-search/advancedSearchUserListing.html',
                resolve: loadSequence('search'),
                controller: 'advancedSearchCtrl'
            })
            .state('transliteration', {
                url: '/transliteration',
                templateUrl: 'modules/profile/UserTranslitertionList.html',
                resolve: loadSequence('profile'),
                controller: 'ProfileCtrl'
            })
            .state('practice', {
                url: '/practice',
                templateUrl: 'modules/practice/Practice.html',
                resolve: loadSequence('practice'),
                controller: 'PracticeCtrl'
            })
            .state('deck', {
                url: '/deck',
                templateUrl: 'modules/practice/Deck.html',
                resolve: loadSequence('practice'),
                controller: 'PracticeCtrl'
            })
            .state('practiceSession', {
                url: '/practiceSession',
                templateUrl: 'modules/PracticeSession/PracticeSession.html',
                resolve: loadSequence('practiceSession'),
                controller: 'PracticeSessionCtrl'
            })
            .state('favorite', {
                url: '/favorite',
                templateUrl: 'modules/favourites/favorite.html',
                resolve: loadSequence('favorite'),
                controller: 'FavoriteCtrl'
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
