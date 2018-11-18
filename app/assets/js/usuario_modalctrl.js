var app = angular.module('TaxisFast')


// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

.controller('ModalInstanceCtrl', function ($uibModalInstance, $scope, elemento, ConexionServ, toastr) {

  $scope.elemento = elemento;

  $scope.ok = function () {

    if (elemento.id == null) {
      consulta = 'DELETE FROM users Where rowid=?'
      ConexionServ.query(consulta, [elemento.rowid]).then(function(result){
        console.log('se elimino el elemento', result);
          
           $uibModalInstance.close('nasdaa');
          toastr.success('Usuario Eliminado');
          console.log('dato eliminado en la compu')
      }, function(tx){
        console.log('error', tx);
      });
    } else {
        consulta = 'UPDATE users SET eliminado ="1"  Where rowid=?'
      ConexionServ.query(consulta, [elemento.rowid]).then(function(result){
        console.log('se elimino el elemento en', result);
          
           $uibModalInstance.close('nasdaa');
          toastr.success('Usuario Eliminado');
          console.log('dato eliminado en la nube')
      }, function(tx){
        console.log('error', tx);
      });
    } 

   
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
