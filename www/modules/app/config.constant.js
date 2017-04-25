// Ionic Starter App
var app = angular.module('starter');
app.constant('JS_REQUIRES', {
    //*** Scripts
    scripts: {
        //******frontend style******//
        'frontend': ['css/style.css'],
        //*** Controllers
        'login': ['modules/login/SigninCtrl.js', 'js/services/authService.js'],
        'signup': ['modules/register/RegisterCtrl.js', 'js/services/authService.js', 'modules/external-register/ExternalRegisterCtrl.js'],
        'chat': ['modules/chat/ChatCtrl.js', 'modules/chat/ModalCtrl.js', 'js/services/momentService.js'],
        'chatbot': ['modules/chatbot/ChatbotCtrl.js'],
        'usersListing': ['modules/users/UserCtrl.js'],
        'forgotPass': ['modules/forgot-password/ForgotPswdCtrl.js'],
        'welcome': ['modules/app/AppCtrl.js'],
        'discover': ['modules/mirror/MirrorCtrl.js', 'js/services/momentService.js'],
        'profile': ['modules/profile/ProfileCtrl.js', 'js/services/momentService.js', 'js/services/profileService.js', 'modules/publicProfile/publicProfileCtrl.js'],
        'search': ['modules/search/SearchCtrl.js', 'js/services/momentService.js', 'modules/advanced-search/advancedSearchCtrl.js', 'js/services/authService.js'],
        //*** Services

    },
    modules: [
       {
           name: 'ds.clock',
           files: ['js/dependency/angular-clock.js']
       },
       {
           name: 'ngFileUpload',
           files: ['js/dependency/ng-file-upload-shim.min.js', 'js/dependency/ng-file-upload.min.js']
       },
       {
           name: 'angularUtils.directives.dirPagination',
           files: ['lib/pagination/dirPagination.js']
       },
       {
           name: '720kb.datepicker',
           files: ['js/datepicker/angular-datepicker.min.css', 'js/datepicker/angular-datepicker.min.js']
       },
       {
           name: 'angularjs-dropdown-multiselect',
           files: ['js/angularjs-dropdown-multiselect.min.js']
       }
    ]
});



