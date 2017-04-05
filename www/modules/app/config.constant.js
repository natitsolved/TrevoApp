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
        'chat': ['modules/chat/ChatCtrl.js', 'modules/chat/ModalCtrl.js'],
        'chatbot': ['modules/chatbot/ChatbotCtrl.js'],
        'usersListing': ['modules/users/UserCtrl.js'],
        'forgotPass': ['modules/forgot-password/ForgotPswdCtrl.js'],
        'welcome': ['modules/app/AppCtrl.js'],
        
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
    ]
});



