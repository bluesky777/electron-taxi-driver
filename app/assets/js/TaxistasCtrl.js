var app = angular.module('TaxisFast');

app.controller('TaxistasCtrl', function($scope, $http, $filter, ConexionServ, $location, $anchorScroll, $uibModal){

ConexionServ.createTables();

	$scope.ocultarboton = true;
    $scope.color_seleccion1 = false;
    $scope.color_seleccion2 = false;


$scope.ver = false;
$scope.ver2 = false;

	$scope.caja_genero1 = function(opcion){
		$scope.color_seleccion1 = true;
		$scope.color_seleccion2 = false;
		$scope.opcion = opcion;
	}

	$scope.caja_genero2 = function(opcion){
		$scope.color_seleccion1 = false;
		$scope.color_seleccion2 = true;
		$scope.opcion = opcion;
	}

	$scope.CREARTAXISTA = function(taxista_nuevo){
		if (taxista_nuevo.nombres == undefined) {
			alert('Debe poner nombres');
			return;
		}

		if (taxista_nuevo.apellidos == undefined) {
			alert('Debe poner apellidos');
			return;
		}
		if ($scope.opcion == undefined) {
			alert('Debe poner sexo');
			return;
		}
		if (taxista_nuevo.documento == undefined) {
			alert('Debe poner documento');
			return;
		}
		if (taxista_nuevo.usuario == undefined) {
			alert('Debe poner usuario');
			return;
		}
		if (taxista_nuevo.password == undefined) {
			alert('Debe poner password');
			return;
		}

		if (taxista_nuevo.password.length < 4) {
			alert('Contraseña con mayor caracteres');
			return;
		}

			if (taxista_nuevo.password == undefined) {
			alert('Debe poner contraseña');
			return;
		}

		console.log(taxista_nuevo);
		if (taxista_nuevo.password != taxista_nuevo.password2) {
			alert('iguaesl contraseña');
			return;
		}

		fecha_nac = '';
		if (taxista_nuevo.fecha_nac) {
			fecha_nac = '' + taxista_nuevo.fecha_nac.getFullYear() + '/' + (taxista_nuevo.fecha_nac.getMonth() + 1) + '/' + taxista_nuevo.fecha_nac.getDate();	
		}
		

		consulta = 'INSERT INTO taxistas (nombres, apellidos, sexo, documento, celular, fecha_nac, usuario, password) VALUES(?, ?, ?, ?, ?, ?, ?, ?)'
		ConexionServ.query(consulta, [taxista_nuevo.nombres, taxista_nuevo.apellidos, $scope.opcion, taxista_nuevo.documento, taxista_nuevo.celular, fecha_nac, taxista_nuevo.usuario, taxista_nuevo.password]).then(function(result){
			console.log('se cargo el taxista', result);
			$scope.traer_datos()
		}, function(tx){
			console.log('error', tx);
		});
	$scope.ver2 = false;

	}
  $scope.mostrartabla = function(taxista){
   
   if ($scope.ver2 == false) {
   	$scope.ver2 = true;
   } else{$scope.ver2 = false;}; 
 
 		$scope.ocultarboton = !$scope.ocultarboton;
  }
  
	$scope.traer_datos = function(){
		consulta = 'SELECT id, nombres, apellidos, sexo, documento, celular, fecha_nac, usuario, password, rowid from taxistas where eliminado ="0"'
		ConexionServ.query(consulta, []).then(function(result){
			$scope.taxistas = result;
			for (var i = 0; i < $scope.taxistas.length; i++) {
				if($scope.taxistas[i].fecha_nac){
					$scope.taxistas[i].fecha_nac = new Date($scope.taxistas[i].fecha_nac);
				}				
			}
			console.log('se subio el taxista', result);

		}, function(tx){
			console.log('error', tx);
 
		});
	}
	
$scope.traer_datos()

	$scope.eliminar = function(taxista){
		console.log('f')
	    var modalInstance = $uibModal.open({
			templateUrl: 'templates/taxistamodal.html',
			controller: 'ModaltaxistaCtrl',
			resolve: {
				elemento: function(){
					return taxista;
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


 
  $scope.editar = function(taxista){
   
   	$scope.ver = true;
   taxista.fecha_nac = new Date(taxista.fecha_nac);
   $scope.taxista_Editar = taxista;
   		$location.hash('id-editar-taxista');
		$anchorScroll();
	
  }
    
  $scope.cancelar = function(){
   
	$scope.ver2 = false;
   	$scope.ver = false;
   	$location.hash('');
   	
 		$scope.ocultarboton = !$scope.ocultarboton;
  }
    
	$scope.guardartaxista = function(taxista_Editar){

		fecha_nac = '';
		if (taxista_Editar.fecha_nac) {
			fecha_nac = '' + taxista_Editar.fecha_nac.getFullYear() + '/' + (taxista_Editar.fecha_nac.getMonth() + 1) + '/' + taxista_Editar.fecha_nac.getDate();	
		}

		if (taxista_Editar.id == null) {
					consulta = 'UPDATE taxistas SET  nombres=?, apellidos=?, sexo=?, documento=?, celular=?, fecha_nac=?, usuario=?, password=? where rowid=? '
		ConexionServ.query(consulta, [taxista_Editar.nombres, taxista_Editar.apellidos, $scope.opcion, taxista_Editar.documento, taxista_Editar.celular, fecha_nac, taxista_Editar.usuario, taxista_Editar.password, taxista_Editar.rowid]).then(function(result){
			console.log('se cargo el taxista en la compu', result);
			$scope.traer_datos()
		}, function(tx){
			console.log('error', tx);
		});
	} else	{
				consulta = 'UPDATE taxistas SET  nombres=?, apellidos=?, sexo=?, documento=?, celular=?, fecha_nac=?, usuario=?, password=?, modificado=? where rowid=? '
		ConexionServ.query(consulta, [taxista_Editar.nombres, taxista_Editar.apellidos, $scope.opcion, taxista_Editar.documento, taxista_Editar.celular, fecha_nac, taxista_Editar.usuario, taxista_Editar.password, "1", taxista_Editar.rowid]).then(function(result){
			console.log('se cargo el taxista en la nube', result);
			$scope.traer_datos()
		}, function(tx){
			console.log('error', tx);
		});
	}

	
$scope.ver = false;


	}	


});