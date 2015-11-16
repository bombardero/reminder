angular.module('starter.controllers', ['ngCordova',])

.factory("servtStilo", function () {
    var getTema = function(){
      return miTema;
    }

    var setTema = function(c){
      miTema = c;
    }

    var r = {
            getTema: function(){return getTema;},
            setTema: function(){return setTema;}
        };

    return r;
})


 
.controller('CtrlSetting', function($scope, $cordovaMedia, $ionicPopover, $cordovaVibration, $cordovaFile, $ionicPlatform, $ionicModal, servtStilo, $cordovaSQLite, $timeout) {

    $scope.tema = servtStilo;
    //generacion de DB
    function insertDB(tx) {
        //alert("insertDB");
        tx.executeSql('DROP TABLE IF EXISTS SETTING');
        tx.executeSql('CREATE TABLE IF NOT EXISTS SETTING (id unique, alarma, tema, vibracion)');
        tx.executeSql('INSERT INTO SETTING (id, alarma, tema, vibracion) VALUES (1, "/android_asset/www/alarmas/tono1.mp3", "fondo0", "no")');
    }

    function updateAlarm(tx, src) {
        tx.executeSql('UPDATE SETTING SET alarma = (?)',[src]);
    }

    function updateTema(tx, src) {
        tx.executeSql('UPDATE SETTING SET tema = (?)',[src]);
    }

    function updateVibrador(tx, src) {
        tx.executeSql('UPDATE SETTING SET vibracion = (?)',[src]);
    } 
    
    // Query the database
    function queryDB(tx) {
        tx.executeSql('SELECT * FROM SETTING', [], querySuccess, errorCB);
    }
    
    // Query the database
    function queryStyle(tx) {
        tx.executeSql('SELECT * FROM SETTING', [], successStyle, errorCB);
    }

    function successStyle(tx, results) {
         // alert("successStyle");
          var len = results.rows.length;
          //alert(len);
          for (var i=0; i<len; i++){
                var tema = 'file:///android_asset/www/' + results.rows.item(i).tema;
                $scope.data = {};
                //$timeout(function() {
                      $scope.data.image = tema;
                      $scope.data.style = {
                            'background-image': 'url(' + tema +')'     
                      }
                //  }, 0.01);
                 //alert(JSON.stringify(" tema2 =  " + results.rows.item(i).tema));
          }
          $scope.$apply();

    }
    // Query the success callback
    function querySuccess(tx, results) {
          var len = results.rows.length;
          for (var i=0; i<len; i++){
              //alert(JSON.stringify(" Alarma =  " + results.rows.item(i).alarma  + " tema =  " + results.rows.item(i).tema + " Vibracion =  " + results.rows.item(i).vibracion));
              if (results.rows.item(i).alarma == "/android_asset/www/alarmas/tono1.mp3" ) {
                  $scope.settingAlarma = {
                      alarma0: true,
                      alarma1: false
                  };
              };
              if (results.rows.item(i).alarma == "/android_asset/www/alarmas/tono2.mp3" ) {   
                  $scope.settingAlarma = {
                      alarma0: false,
                      alarma1: true
                  };
              };
              if (results.rows.item(i).vibracion == "no" ) {
                  $scope.settingVibracion = {
                      vibracion: false
                  };
              };
              if (results.rows.item(i).vibracion == "si" ) {
                  $scope.settingVibracion = {
                      vibracion: true
                  };
              };
              if (results.rows.item(i).tema == 'fondo0' ) {
                  $scope.settingTema = {
                      tema0: true,
                      tema1: false,
                      tema2: false
                  };
              };
              if (results.rows.item(i).tema == 'fondo1' ) {
                  $scope.settingTema = {
                      tema0: false,
                      tema1: true,
                      tema2: false
                  };
              };
              if (results.rows.item(i).tema == 'fondo2' ) {
                  $scope.settingTema = {
                      tema0: false,
                      tema1: false,
                      tema2: true
                  };
              };
          }
          $scope.$apply();
    }
    // Transaction error callback
    //
    function errorCB(err) {
        alert(JSON.stringify("Error processing SQL: "+err.code));
    }
    // Transaction success callback
    //
    function successCB() {
        var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
        db.transaction(queryDB, errorCB);
    }
    // funcionalidad de menu
    $ionicPopover.fromTemplateUrl('templates/setting.html', {
          scope: $scope
    }).then(function(popover) {
          $scope.popover = popover;
    });
  
    $scope.openPopover = function($event) {
            var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
            db.transaction(insertDB, errorCB, successCB);
            $scope.popover.show($event);
    };

    $scope.closePopover = function() {
          $scope.popover.hide();
    };

    var myAudio;

    $scope.play = function (src) {
          if(window.Media) {
              if(myAudio) myAudio.stop();
              myAudio = new Media(src, onSuccess, onError);
              myAudio.play();
          }
          var alarma = src;
          var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
          db.transaction(function(tx){ updateAlarm(tx, src) } , errorCB, successCB);
    };
      
    function onSuccess() {
          console.log("playAudio():Audio Success");
    }
    function onError(error) {
          alert('Codigo: ' + error.code + '\n' + 'Mensaje: ' + error.message + '\n');
    }

      $scope.vibrate = function () {
        $cordovaVibration.vibrate([1000, 1000, 1000, 1000, 1000]);
        var src = 'si';
        var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
        db.transaction(function(tx){ updateVibrador(tx, src) }, errorCB, successCB);
      };
      //teclado para setting hora activity
      $ionicModal.fromTemplateUrl('my-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
      });
      $scope.openModal = function() {
        $scope.modal.show();
      };
      $scope.closeModal = function() {
        $scope.modal.hide();
      };

      $scope.add = function(value) {
        
        if($scope.expression === "" || $scope.expression === undefined) {
            $scope.expression = value;
            $scope.$watch;
        } else {
            $scope.expression = $scope.expression + "" + value;
        }
        
        if(value === "b") {
          $scope.expression = $scope.expression.replace(/\s+/g,'');
          //-->2 por que 1 es la b y el otro el ultimo caracter
          $scope.expression = $scope.expression.substring(0, $scope.expression.length-2);
        }

        var aux = $scope.expression.substr(0,1);
          
        if (aux < 1) {
            $scope.expression2 = " ";
            $scope.expression3 = " ";
        } else{
            $scope.expression2 = "desact";
            $scope.expression3 = "activate";
        };
      }
      
      //setting theme
$scope.setTema = function(c){
    if( c == 'fondo0' ) {
          servtStilo.miTema = 'fondo0';
                        src = 'fondo0';
    };
    if( c == 'fondo1' ) {
          servtStilo.miTema = 'fondo1';
                        src = 'fondo1';
    };
    if( c == 'fondo2' ){
          servtStilo.miTema = 'fondo2';
                        src = 'fondo2';
    };        
    var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(function(tx){ updateTema(tx, src) } , errorCB, successCB);
      }
var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
db.transaction(queryStyle, errorCB, successStyle);
})

.controller('Posponer', function($scope, $ionicModal, $cordovaMedia, servtStilo, $cordovaSQLite, $timeout) {
    
    $scope.tema = servtStilo;
    //alert("paso");
    var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(queryStyle, errorCB, successStyle);
    //alert("volvio");

    $ionicModal.fromTemplateUrl('modal-posponer.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
      });
      $scope.openModal = function() {
        $scope.modal.show();
      };
      $scope.closeModal = function() {
        $scope.modal.hide();
      };

      var myAudio;
      $scope.reproduciractivity = function(id) {

        //traer src con id desde sqlite
        if(window.Media) {
              if(myAudio) myAudio.stop();
              myAudio = new Media(src, onSuccess, onError);
              myAudio.play();
        }
      };

       // Query the database
    function queryStyle(tx) {
        tx.executeSql('SELECT * FROM SETTING', [], successStyle, errorCB);
    }

    function successStyle(tx, results) {
        //  alert("successStyle");
          var len = results.rows.length;
        //  alert(len);
          for (var i=0; i<len; i++){
                var tema = 'file:///android_asset/www/' + results.rows.item(i).tema;
                $scope.data = {};
                $timeout(function() {
                      //alert("paso timeout");
                      //alert(tema);
                      $scope.data.image = tema;
                      $scope.data.style = {
                            'background-image': 'url(' + tema +')'     
                      }
                  }, 1)
                  //console.log($scope.data);
          //        alert(JSON.stringify(" tema2 =  " + results.rows.item(i).tema));
          }
          $scope.$apply();
    }
    function errorCB(err) {
        alert(JSON.stringify("Error processing SQL: "+err.code));
    }

     
});



    





