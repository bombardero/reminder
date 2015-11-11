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


 
.controller('CtrlSetting', function($scope, $cordovaMedia, $ionicPopover, $cordovaVibration, $cordovaFile, $ionicPlatform, $ionicModal, servtStilo) {

      $scope.tema = servtStilo;
    
      $ionicPopover.fromTemplateUrl('templates/my-popover.html', {
          scope: $scope
      }).then(function(popover) {
          $scope.popover = popover;
      });
  
      $scope.openPopover = function($event) {
        $scope.popover.show($event);
      };

      $scope.closePopover = function() {
          $scope.popover.hide();
      };

      var myAudio;

      $scope.play = function (src) {
          alert(src);
          if(window.Media) {
              if(myAudio) myAudio.stop();
              myAudio = new Media(src, onSuccess, onError);
              myAudio.play();
        }
      };
      
      function onSuccess() {
          console.log("playAudio():Audio Success");
      }
      function onError(error) {
          alert('Codigo: ' + error.code + '\n' + 'Mensaje: ' + error.message + '\n');
      }

      $scope.vibrate = function () {
        $cordovaVibration.vibrate([1000, 1000, 1000, 1000, 1000]);
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
              servtStilo.miTema = "../img/verde.png";
          };
          if( c == 'fondo1' ) {
              servtStilo.miTema = "../img/naranja.png";
          };
          if( c == 'fondo2' ){
              servtStilo.miTema = "../img/azul.png";
          };       
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

    
      $scope.updateNotificacion = function(id) {

      };
      
  /*    $scope.play = function (src) {
          var media = new Media(src, onSuccess, onError);
          //alert("post1");
          media.play();
          media.setVolume('5.0');
           // Pause after 10 seconds
          setTimeout(function() {
              media.stop();
          }, 10000);
          //alert("post2");
      };
      
      function onSuccess() {
          console.log("playAudio():Audio Success");
      }
      function onError(error) {
          alert('Codigo: ' + error.code + '\n' + 'Mensaje: ' + error.message + '\n');
      }*/
})



    





