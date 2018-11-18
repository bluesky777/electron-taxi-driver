var app = angular.module('TaxisFast')


// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

.controller('ModalnubeCtrl', function ($uibModalInstance, $scope, elemento, ConexionServ, toastr) {

  $scope.elemento = elemento;

  $scope.ok = function () {
    console.log(elemento)


     consulta = 'DELETE FROM taxis'
      ConexionServ.query(consulta, []).then(function(result){
        console.log('se elimino el elemento', result);
          

         
          console.log('dato eliminado en la compu')
      }, function(tx){
        console.log('error', tx);
      });

       consulta = 'DELETE FROM taxistas'
      ConexionServ.query(consulta, []).then(function(result){
        console.log('se elimino el elemento', result);
          
      
          console.log('dato eliminado en la compu')
      }, function(tx){
        console.log('error', tx);
      });

       consulta = 'DELETE FROM carreras'
      ConexionServ.query(consulta, []).then(function(result){
        console.log('se elimino el elemento', result);
          
    
         
          console.log('dato eliminado en la compu')
      }, function(tx){
        console.log('error', tx);
      });

       consulta = 'DELETE FROM users'
      ConexionServ.query(consulta, []).then(function(result){
        console.log('se elimino el elemento', result);
      
        
          console.log('dato eliminado en la compu')
          toastr.success('Datos Eliminados')
      }, function(tx){
        console.log('error', tx);
      });

   
       $uibModalInstance.dismiss('cancel');
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
