// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','ngCordova','ui.router'])

.run(function($ionicPlatform,$timeout, $state, $cordovaMedia, $cordovaSQLite) {
  $ionicPlatform.ready(function() {

      //var db = $cordovaSQLite.openDB({ name: "my.db" });

      // for opening a background db:
      //var db = $cordovaSQLite.openDB({ name: "my.db", bgType: 1 });

      var d = new Date();
      d.setHours(22,30,00);

      cordova.plugins.notification.local.schedule({
        id: 1,
        title: 'Recordatorio',
        text: 'Tenés un nuevo Recordatorio.',
        at: d,
        led: 'FF0000'
      }); 

      cordova.plugins.notification.local.on("click", function (notification) {
        joinMeeting(notification.data.meetingId);
      });

      cordova.plugins.notification.local.on("trigger", function (notification) {     
          $timeout(function() {
              var media = new Media("file:///android_asset/www/alarmas/tono1.mp3", onSuccess, onError);
              //alert("post1");
              media.play();
              media.setVolume('5.0');
              setTimeout(function() {
              media.stop();
          }, 10000);

          function onSuccess() {
              console.log("playAudio():Audio Success");
          }
          function onError(error) {
              alert('Codigo: ' + error.code + '\n' + 'Mensaje: ' + error.message + '\n');
          }
          $state.go('posponer');
          
          });
      });

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
      // org.apache.cordova.statusbar required
        StatusBar.styleLightContent();
      }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    cache: false,
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'CtrlSetting'
      }
    }
  })

  .state('tab.chats', {
      cache: false,
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'Posponer'
        }
      }
    })

  .state('tab.account', {
    cache: false,
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'CtrlSetting'
      }
    }
  })

  .state('posponer', {
            url: '/posponer',
            templateUrl: 'templates/modal-posponer.html',
            controller: 'Posponer'  
        });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});
