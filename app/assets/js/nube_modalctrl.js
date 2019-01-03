var app = angular.module('TaxisFast')


// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

.controller('ModalnubeCtrl', function ($uibModalInstance, $scope, elemento, ConexionServ, toastr) {

  $scope.elemento = elemento;

  $scope.ok = function () {
    console.log(elemento)


   
      $scope.datos_eliminados = false;
    
      promesas = [];
      
      prom = ConexionServ.query('DROP TABLE taxis')
      prom.then(function(result){
        console.log('Eliminado taxis');
      });
      promesas.push(prom);
      prom = ConexionServ.query('DROP TABLE taxistas').then(function(result){
        console.log('Eliminado taxistas');
      });
      promesas.push(prom);
      prom = ConexionServ.query('DROP TABLE carreras').then(function(result){
        console.log('Eliminado carreras');
      });
      promesas.push(prom);
      prom = ConexionServ.query('DROP TABLE users').then(function(result){
        console.log('Eliminado users');
      });
      promesas.push(prom);
      
			Promise.all(promesas).then(function(result){
				$scope.datos_eliminados = true;
				toastr.success('Tablas borradas.');
			})
      
      $uibModalInstance.dismiss('cancel');
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
