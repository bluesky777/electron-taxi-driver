var app = angular.module('TaxisFast');

app.controller('taxisCtrl', function($scope, $http, $filter, ConexionServ, $location, $anchorScroll, $uibModal){

ConexionServ.createTables();

	$scope.ocultarboton = true;
$scope.ver = false;
$scope.ver2 = false;

	$scope.CREARTAXI = function(taxi_nuevo){
		console.log(taxi_nuevo);

		if (taxi_nuevo.modelos == undefined) {
			alert('Debe poner modelos');
			return;
		}

		if (taxi_nuevo.placas == undefined) {
			alert('Debe poner placas');
			return;
		}
	
		if (taxi_nuevo.Soat == undefined) {
			alert('Debe poner Soat');
			return;
		}
		if (taxi_nuevo.Seguro == undefined) {
			alert('Debe poner Seguro');
			return;
		}
	

		consulta = 'INSERT INTO taxis (modelo, numero, placa, taxista_id, propietario, Soat, Seguro) VALUES(?, ?, ?, ?, ?, ?, ?)'
		ConexionServ.query(consulta, [taxi_nuevo.modelos, taxi_nuevo.numero, taxi_nuevo.placas, taxi_nuevo.taxista_id, taxi_nuevo.propietario	,  taxi_nuevo.Soat, taxi_nuevo.Seguro]).then(function(result){
			console.log('se cargo el taxi', result);
			$scope.traer_datos()
		}, function(tx){
			console.log('error', tx);
		});
		$scope.taxi_nuevo = {}

		$scope.ver2 = false;
	}
  $scope.mostrartabla = function(taxi){
   
   if ($scope.ver2 == false) {
   	$scope.ver2 = true;
   } else{$scope.ver2 = false;}; 
 

 		$scope.ocultarboton = !$scope.ocultarboton;
  }


 $scope.traer_datos = function(){ 

	consulta = 'SELECT t.*, t.rowid, c.nombres, c.apellidos 	from taxis t INNER JOIN taxistas c ON t.taxista_id = c.rowid where t.eliminado ="0"'
		ConexionServ.query(consulta, []).then(function(result){
			$scope.taxis = result;
			console.log('se subio el taxi', result);

		}, function(tx){
			console.log('error', tx);

		});

	}

	$scope.traer_datos()

	consulta = 'SELECT *, rowid from taxistas'
		ConexionServ.query(consulta, []).then(function(result){
			$scope.taxistas = result;
			console.log('se trajo el taxista', result);

		}, function(tx){
			console.log('error', tx);

		});

		$scope.eliminar = function(taxi){
		console.log('f')
	    var modalInstance = $uibModal.open({
			templateUrl: 'templates/taximodal.html',
			controller: 'ModaltaxiCtrl',
			resolve: {
				elemento: function(){
					return taxi;
				}
			}
	    });

	    modalInstance.result.then(function (selectedItem) {
	      console.log(selectedItem);
	      $scope.traer_datos();
	    }, function () {
	      console.log('Modal dismissed at: ' + new Date() +'hola');
	    });



	}




	$scope.mostrareditar = function(){
		$scope.tablaeditar = true;

	}


 
  $scope.editar = function(taxi){
   
   	$scope.ver = true;
   $scope.taxi_Editar = taxi;
   		$location.hash('id-editar-taxi');
		$anchorScroll();
	
  }
    
  $scope.cancelar = function(){
	$scope.ver2 = false;
   	$scope.ver = false;
   	$location.hash('');
   	
 		$scope.ocultarboton = !$scope.ocultarboton;
	
  }
    

	$scope.guardartaxi = function(taxi_Editar){

		if (taxi_Editar.modelos == undefined) {
			alert('Debe poner modelos');
			return;
		}

		if (taxi_Editar.placas == undefined) {
			alert('Debe poner placas');
			return;
		}
	
		if (taxi_Editar.Soat == undefined) {
			alert('Debe poner Soat');
			return;
		}
		if (taxi_Editar.Seguro == undefined) {
			alert('Debe poner Seguro');
			return;
		}
		
		if (taxi_Editar.id == null) {
				consulta = 'UPDATE taxis SET modelo=?, numero=?, placa=?, taxista_id=?, propietario=?, Soat=?, Seguro=? where rowid=? '
		ConexionServ.query(consulta, [taxi_Editar.modelos, taxi_Editar.numero, taxi_Editar.placas,  taxi_Editar.taxista_id, taxi_Editar.propietario, taxi_Editar.Soat, taxi_Editar.Seguro, taxi_Editar.rowid]).then(function(result){
			console.log('se cargo el taxi en el compu', result);
			$scope.traer_datos()
		}, function(tx){
			console.log('error', tx);
		});

		} else {
		consulta = 'UPDATE taxis SET modelo=?, numero=?, placa=?, taxista_id=?, propietario=?, Soat=?, Seguro=?, modificado=? where rowid=? '
		ConexionServ.query(consulta, [taxi_Editar.modelos, taxi_Editar.numero, taxi_Editar.placas,  taxi_Editar.taxista_id, taxi_Editar.propietario, taxi_Editar.Soat, taxi_Editar.Seguro, "1", taxi_Editar.rowid]).then(function(result){
			console.log('se cargo el taxi en la nubeichon', result);
			$scope.traer_datos()
		}, function(tx){
			console.log('error', tx);
		});
		}
	
			$scope.ver = false;
	}	

});