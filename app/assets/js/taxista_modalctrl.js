var app = angular.module('TaxisFast')


// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

.controller('ModaltaxistaCtrl', function ($uibModalInstance, $scope, elemento, ConexionServ, toastr) {

  $scope.elemento = elemento;

  $scope.ok = function () {

    if (elemento.id == null) {
      consulta = 'DELETE FROM taxistas Where rowid=?'
      ConexionServ.query(consulta, [elemento.rowid]).then(function(result){
        console.log('se elimino el elemento', result);
          
           $uibModalInstance.close('nasdaa');
          toastr.success('Taxista Eliminado');
          console.log('dato eliminado en la compu')
      }, function(tx){
        console.log('error', tx);
      });
    } else {
        consulta = 'UPDATE taxistas SET eliminado ="1"  Where rowid=?'
      ConexionServ.query(consulta, [elemento.rowid]).then(function(result){
        console.log('se elimino el elemento en', result);
          
           $uibModalInstance.close('nasdaa');
          toastr.success('Taxista Eliminado');
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
