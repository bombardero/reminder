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

.controller('CtrlSetting', function($scope, $cordovaMedia, $ionicPopover, $cordovaVibration, $cordovaFile, $ionicPlatform, $ionicModal, servtStilo, $cordovaSQLite) {

    $scope.tema = servtStilo;
  
    function insertDB(tx) {   
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
        
        $cordovaVibration.vibrate([1000, 1000, 1000]);
       
        var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
        db.transaction(function(tx){ queryVib(tx) }, errorCB);
      
      };


       function successVib() {
            var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
            db.transaction(queryVib, errorCB);
       }

       function querySuccessVib(tx, results) {
          var len = results.rows.length;
          for (var i=0; i<len; i++){
              //alert(JSON.stringify(" Vibracion =  " + results.rows.item(i).vibracion));
              if (results.rows.item(i).vibracion == "no" ) {
                  var src = "si";
                  var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
                  db.transaction(function(tx){ updateVibrador(tx, src) }, errorCB, successCB);
                  $scope.settingVibracion = {
                      vibracion: true
                  };

              }else{
                  var src = "no";
                  var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
                  db.transaction(function(tx){ updateVibrador(tx, src) }, errorCB, successCB);
                  $scope.settingVibracion = {
                      vibracion: false
                  };

              };
          }
          $scope.$apply();
        }

        function queryVib(tx) {
            tx.executeSql('SELECT * FROM SETTING', [], querySuccessVib, errorCB);
        }
      //teclado para setting hora activity
      $ionicModal.fromTemplateUrl('my-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
      });
      $scope.openModal = function() {
        $scope.classNumber0 = "btn-circle btn-xl";
        $scope.classNumber1 = "btn-circle btn-xl";
        $scope.classNumber2 = "btn-circle btn-xl";
        $scope.classNumber3 = "btn-circle btn-xl";
        $scope.classNumber4 = "btn-circle btn-xl";
        $scope.classNumber5 = "btn-circle btn-xl";
        $scope.classNumber6 = "btn-circle btn-xl";
        $scope.classNumber7 = "btn-circle btn-xl";
        $scope.classNumber8 = "btn-circle btn-xl";
        $scope.classNumber9 = "btn-circle btn-xl";  
        $scope.modal.show();
      };
      $scope.closeModal = function() {
        $scope.modal.hide();
      };

      
      $scope.add = function(value) {

        //alert($scope.expression.substring(3));
         //alert(resultado);

         haurNumber(value);

          if(value === "b") {
                  //alert($scope.expression);
                  calculatePosition($scope.expression);
                  $scope.expression = $scope.expression.replace(/\s+/g,'');
          }
          function calculatePosition(expression){
                //alert(expression);
                if (expression.substring(1) == '-:--' && expression.substring(0) != '-' ) {
                    $scope.expression = '--:--';
                    haurValidate(1 , 0);
                };
                if (expression.substring(2) == ':--' && expression.substring(1) != '-' ) {
                    $scope.expression = $scope.expression.substring(0,1) + '-:--';
                    haurValidate(1, $scope.expression.substring(0,1));

                }else{
                    if (expression.substring(4) == '-' && expression.substring(3,1) != '-') {
                        $scope.expression = $scope.expression.substring(0,2) + ':--';
                        haurValidate(2 ,$scope.expression.substring(3,1));
                    };
                    if (expression.substring(4) != '-') {
                        $scope.expression = $scope.expression.substring(0,4) + '-';
                        haurValidate(1 , 0);
                    };
                }

          }
       
          function haurNumber(value) {
               
              if($scope.expression === "" || $scope.expression === undefined || $scope.expression === '--:--') {
                      haurValidate(1 , value); 
                      armHour(1 , value);

              } else {
                  if ($scope.expression.substring(1) == '-:--' && value  != 'b' )   {
                      haurValidate(2 , value); 
                      armHour(2 , value);
                  }else{
                          if ($scope.expression.substring(2) == ':--' && value  != 'b') {
                              haurValidate(4 , value);
                              armHour(3 , value);
                          }else{ 
                                if ($scope.expression.substring(4) == '-' && value  != 'b') {
                                        armHour(4 , value);
                                };
                          }
                        }; 
              }
           
          }

          function haurValidate(position , value){                    
              if (position == 1) {
                   if (value == 0 ) {
                        $scope.classNumber1 = "btn-circle btn-xl";
                        $scope.classNumber2 = "btn-circle btn-xl";
                        $scope.classNumber3 = "btn-circle btn-xl";
                        $scope.classNumber4 = "btn-circle btn-xl";
                        $scope.classNumber5 = "btn-circle btn-xl";
                        $scope.classNumber6 = "btn-circle btn-xl";
                        $scope.classNumber7 = "btn-circle btn-xl";
                        $scope.classNumber8 = "btn-circle btn-xl";
                        $scope.classNumber9 = "btn-circle btn-xl";

                        $scope.isDisabled1 = false;
                        $scope.isDisabled2 = false;
                        $scope.isDisabled3 = false;
                        $scope.isDisabled4 = false;
                        $scope.isDisabled5 = false;
                        $scope.isDisabled6 = false;
                        $scope.isDisabled7 = false;
                        $scope.isDisabled8 = false;
                        $scope.isDisabled9 = false;

                    }; 
                   if (value == 2 ) {
                        $scope.classNumber1 = "btn-circle btn-xl";
                        $scope.classNumber2 = "btn-circle btn-xl";
                        $scope.classNumber3 = "btn-circle btn-xl";
                        $scope.classNumber4 = "btn-circle desact";
                        $scope.classNumber5 = "btn-circle desact";
                        $scope.classNumber6 = "btn-circle desact";
                        $scope.classNumber7 = "btn-circle desact";
                        $scope.classNumber8 = "btn-circle desact";
                        $scope.classNumber9 = "btn-circle desact";
                        
                        $scope.isDisabled1 = false;
                        $scope.isDisabled2 = false;
                        $scope.isDisabled3 = false;
                        $scope.isDisabled4 = true;
                        $scope.isDisabled5 = true;
                        $scope.isDisabled6 = true;
                        $scope.isDisabled7 = true;
                        $scope.isDisabled8 = true;
                        $scope.isDisabled9 = true;
                    };
                    if (value == 1 ) {
                        $scope.classNumber1 = "btn-circle btn-xl";
                        $scope.classNumber2 = "btn-circle btn-xl";
                        $scope.classNumber3 = "btn-circle btn-xl";
                        $scope.classNumber4 = "btn-circle btn-xl";
                        $scope.classNumber5 = "btn-circle btn-xl";
                        $scope.classNumber6 = "btn-circle btn-xl";
                        $scope.classNumber7 = "btn-circle btn-xl";
                        $scope.classNumber8 = "btn-circle btn-xl";
                        $scope.classNumber9 = "btn-circle btn-xl";

                        $scope.isDisabled1 = false;
                        $scope.isDisabled2 = false;
                        $scope.isDisabled3 = false;
                        $scope.isDisabled4 = false;
                        $scope.isDisabled5 = false;
                        $scope.isDisabled6 = false;
                        $scope.isDisabled7 = false;
                        $scope.isDisabled8 = false;
                        $scope.isDisabled9 = false;
                    }; 
                    if (value > 2 ) {
                        $scope.classNumber1 = "btn-circle btn-xl";
                        $scope.classNumber2 = "btn-circle btn-xl";
                        $scope.classNumber3 = "btn-circle btn-xl";
                        $scope.classNumber4 = "btn-circle btn-xl";
                        $scope.classNumber5 = "btn-circle btn-xl";
                        $scope.classNumber6 = "btn-circle desact";
                        $scope.classNumber7 = "btn-circle desact";
                        $scope.classNumber8 = "btn-circle desact";
                        $scope.classNumber9 = "btn-circle desact";

                        $scope.isDisabled1 = false;
                        $scope.isDisabled2 = false;
                        $scope.isDisabled3 = false;
                        $scope.isDisabled4 = false;
                        $scope.isDisabled5 = false;
                        $scope.isDisabled6 = true;
                        $scope.isDisabled7 = true;
                        $scope.isDisabled8 = true;
                        $scope.isDisabled9 = true;
                    };       
              };
              if (position == 2  ) {
                    $scope.classNumber1 = "btn-circle btn-xl";
                    $scope.classNumber2 = "btn-circle btn-xl";
                    $scope.classNumber3 = "btn-circle btn-xl";
                    $scope.classNumber4 = "btn-circle btn-xl";
                    $scope.classNumber5 = "btn-circle btn-xl";
                    
                    $scope.classNumber6 = "btn-circle desact";
                    $scope.classNumber7 = "btn-circle desact";
                    $scope.classNumber8 = "btn-circle desact";
                    $scope.classNumber9 = "btn-circle desact";

                    $scope.isDisabled1 = false;
                    $scope.isDisabled2 = false;
                    $scope.isDisabled3 = false;
                    $scope.isDisabled4 = false;
                    $scope.isDisabled5 = false;
                    $scope.isDisabled6 = true;
                    $scope.isDisabled7 = true;
                    $scope.isDisabled8 = true;
                    $scope.isDisabled9 = true;
              }
              if (position == 4  ) {
                    $scope.classNumber1 = "btn-circle btn-xl";
                    $scope.classNumber2 = "btn-circle btn-xl";
                    $scope.classNumber3 = "btn-circle btn-xl";
                    $scope.classNumber4 = "btn-circle btn-xl";
                    $scope.classNumber5 = "btn-circle btn-xl";
                    $scope.classNumber6 = "btn-circle btn-xl";
                    $scope.classNumber7 = "btn-circle btn-xl";
                    $scope.classNumber8 = "btn-circle btn-xl";
                    $scope.classNumber9 = "btn-circle btn-xl";

                    $scope.isDisabled0 = false;
                    $scope.isDisabled1 = false;
                    $scope.isDisabled2 = false;
                    $scope.isDisabled3 = false;
                    $scope.isDisabled4 = false;
                    $scope.isDisabled5 = false;
                    $scope.isDisabled6 = false;
                    $scope.isDisabled7 = false;
                    $scope.isDisabled8 = false;
                    $scope.isDisabled9 = false;
              }
          }

          function armHour(position , value){
                if (position == 1  ) {
                    if (value > 2) {
                        $scope.expression = '0' + value + ':--';
                    };
                    if (value < 3 || value == 0) {
                      $scope.expression = value + '-:--';
                    };    
                }
                if (position == 2) {
                    $scope.expression = $scope.expression.substring(0,1);
                    $scope.expression = $scope.expression + "" + value + ':--';
                };

                if (position == 3) {
                   $scope.expression = $scope.expression.substring(0,3);
                   $scope.expression = $scope.expression + "" + value + '-';
                };

                if (position == 4) {
                    $scope.expression = $scope.expression.substring(0,4);
                    $scope.expression = $scope.expression + "" + value;
                };
          }

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
})

.controller('Posponer', function($scope, $ionicModal, $cordovaMedia, servtStilo) {
    
    $scope.tema = servtStilo;

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
});



    





