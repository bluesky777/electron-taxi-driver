var app = angular.module('TaxisFast');

app.controller('nubeCtrl', function($scope, $http, $filter, ConexionServ, toastr, rutaServidor, $uibModal, SyncServ){


	$scope.mostrardatos = false;
	$scope.botonmostrar = true;
	$scope.boton_cerrar = false;
	
	$scope.mostradita = function(){

		$scope.mostrardatos = !$scope.mostrardatos;
		$scope.botonmostrar = !$scope.botonmostrar;
		$scope.boton_cerrar = !$scope.boton_cerrar;
	}
	
	
	SyncServ.traerCambios().then(function(datos){
		$scope.datos 	= datos;
	})


	$scope.descargar_datos = function (){
		$scope.BARRA_CREA = true;


		$http.get(rutaServidor.ruta + 'taxis/all', {params: {username: $scope.USER.usuario, password: $scope.USER.password}}).then (function(result){
			taxis = result.data.taxis;
			taxistas = result.data.taxistas;
			usuarios = result.data.usuarios;
			carreras = result.data.carreras;

			$scope.valor_barra = taxis.length + taxistas.length + carreras.length + usuarios.length;
			$scope.porcentaje_en_cantidad = $scope.valor_barra / 100;
			$scope.progreso_barra = 0;
			

			console.log('porcentaje', $scope.porcentaje);
			for (var i = 0; i < taxis.length; i++) {
				


				
				consulta = 'INSERT INTO taxis ( id, rowid, numero, placa, taxista_id, propietario) VALUES( ?, ?, ?, ?, ?, ?)'
					ConexionServ.query(consulta, [taxis[i].id, taxis[i].id, taxis[i].numero, taxis[i].placa, taxis[i].taxista_id, taxis[i].propietario]).then(function(result){
						console.log('se cargo el taxi', result);
					
						if ($scope.progreso_barra >= 100) {

					$scope.progreso_barra = 100	
							} else {

							$scope.progreso_barra = $scope.progreso_barra +Math.trunc($scope.porcentaje_en_cantidad);

							}
					}, function(tx){
						console.log('error', tx);
					});
				} 
				for (var i = 0; i < taxistas.length; i++) {
				
				consulta = 'INSERT INTO taxistas (id, rowid, nombres, apellidos, sexo, documento, celular, usuario, password) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)'
				ConexionServ.query(consulta, [taxistas[i].id, taxistas[i].id, taxistas[i].nombres, taxistas[i].apellidos, taxistas[i].sexo, taxistas[i].documento, taxistas[i].celular,taxistas[i].usuario, taxistas[i].password]).then(function(result){
						console.log('se cargo el taxista', result);
		
						if ($scope.progreso_barra >= 100) {

					$scope.progreso_barra = 100	
					} else {

					$scope.progreso_barra = $scope.progreso_barra +Math.trunc($scope.porcentaje_en_cantidad);

					}
				
					}, function(tx){
						console.log('error', tx);
					});
				} 
			
			for (var i = 0; i < carreras.length; i++) {
				consulta = 'INSERT INTO carreras (id, rowid, taxi_id, taxista_id, zona, fecha_ini, lugar_inicio, lugar_fin, fecha_fin, estado) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
				ConexionServ.query(consulta, [carreras[i].id, carreras[i].id, carreras[i].taxi_id, carreras[i].taxista_id, carreras[i].zona, carreras[i].fecha_ini, carreras[i].lugar_ini, carreras[i].lugar_fin, carreras[i].fecha_fin, carreras[i].estado]).then(function(result){
					console.log('se guardo la carrera papi', result);
				
					if ($scope.progreso_barra >= 100) {

					$scope.progreso_barra = 100	
					} else {

					$scope.progreso_barra = $scope.progreso_barra +Math.trunc($scope.porcentaje_en_cantidad);

					}
					$scope.BARRA_CREA = false;
		
				}, function(tx){
					console.log('error', tx);
				});
				} 

			ConexionServ.query('DELETE FROM users').then(function(){
				for (var i = 0; i < usuarios.length; i++) {
				
					consulta = 'INSERT INTO users (id, rowid, nombres, apellidos, sexo, tipo, usuario, password) VALUES(?, ?, ?, ?, ?, ?, ?, ?)'
					ConexionServ.query(consulta, [usuarios[i].id, usuarios[i].id, usuarios[i].nombres, usuarios[i].apellidos, usuarios[i].sexo, usuarios[i].tipo, usuarios[i].usuario, usuarios[i].password]).then(function(result){
						console.log('se guardo la carrera papi', result);
						
						if ($scope.progreso_barra >= 100) {
							$scope.progreso_barra = 100	
						} else {

							$scope.progreso_barra = $scope.progreso_barra +Math.trunc($scope.porcentaje_en_cantidad);

						}
						$scope.BARRA_CREA = false;

						toastr.success('Datos Descargados')
			
					}, function(tx){
						console.log('error', tx);
					});
				}
			});



		}), function(){
			toastr.success('Error Descargando datos, no conexion a internet')
			console.log('error db')
		}
		
	}

	$scope.basededatos = function (){


		
		SyncServ.sincronizarCambios($scope.datos).then(function(){

			
			SyncServ.traerCambios().then(function(datos){
				$scope.datos 	= datos;
			})
			$scope.mostrardatos = false;

		})


		
	}


	$scope.eliminar_todo = function(){

	    var modalInstance = $uibModal.open({
			templateUrl: 'templates/nubemodal.html',
			controller: 'ModalnubeCtrl',
			resolve: {
				elemento: function(){
					return;
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
	
});