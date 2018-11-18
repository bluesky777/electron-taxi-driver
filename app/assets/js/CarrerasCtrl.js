var app = angular.module('TaxisFast');

app.controller('CarrerasCtrl', function($scope, toastr, $filter, ConexionServ, USER, $location, $anchorScroll, $uibModal){


	ConexionServ.createTables();

	fecha = new Date();

	$scope.carrera_nuevo = {
		zona: 'Z1',
		fecha_ini: fecha,
		fecha_fin: fecha,
		lugar_inicio: '',
		lugar_fin: '',
		hora_ini: fecha,
		hora_fin: fecha,
		estado: 'En curso'
	};


	$scope.carrera_Editar = {
		zona: 'Z1',
		fecha_ini: fecha,
		fecha_fin: fecha,
		lugar_inicio: '',
		lugar_fin: '',
		hora_ini: fecha,
		hora_fin: fecha,
		estado: 'En curso'
	};
	

	$scope.ver = false;
	$scope.ver2 = true;
	$scope.vercarreras = false;

	consulta = 'SELECT *, rowid FROM taxistas';
	ConexionServ.query(consulta, []).then(function(result){
		$scope.taxistas = result;
	}, function(tx){
		console.log('error', tx);
	});


	consulta = 'SELECT *, rowid  FROM taxis';
	ConexionServ.query(consulta, []).then(function(result){
		$scope.taxis = result;
	}, function(tx){
		console.log('error', tx);
	});




	



	$scope.select_taxista = function(carrera_nuevo){

		consulta = 'SELECT *, rowid FROM taxistas WHERE rowid =?';
			ConexionServ.query(consulta, [carrera_nuevo.taxi.taxista_id]).then(function(result){

				if (result.length > 0) {
					$scope.carrera_nuevo.taxista = result[0];
				}
				
			}, function(tx){
				console.log('error', tx);
			});


	}

	



	


	$scope.guardarc = function(carrera_nuevo){
		
		
		if(!carrera_nuevo.taxi){
			toastr.warning('Debe elegir taxi');
			return
		}
		taxista_id = null;
		if(carrera_nuevo.taxista){
			taxista_id = carrera_nuevo.taxista.rowid;
		}
		 
		fecha_inicio 	= window.fixDate(carrera_nuevo.fecha_ini);
		fecha_fin 		= window.fixDate(carrera_nuevo.fecha_fin);
	
		hora_inicio 	= '' + carrera_nuevo.hora_ini.getHours() + ':' +    carrera_nuevo.hora_ini.getMinutes();   //+ (carrera_nuevo.hora_ini.getHours() >= 12 ? "PM" : "AM");
		hora_final 		= '' + carrera_nuevo.hora_fin.getHours() + ':' +    carrera_nuevo.hora_fin.getMinutes();   //+ (carrera_nuevo.hora_fin.getHours() >= 12 ? "PM" : "AM");
	
		fechayhora_inicio 	= fecha_inicio  + ' ' + hora_inicio;
		fechayhora_fin 		= fecha_fin 	+ ' ' + hora_final;

		consulta = 'INSERT INTO carreras (taxi_id, taxista_id, zona, fecha_ini, lugar_inicio, lugar_fin, fecha_fin, estado, registrada_por) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)'
		ConexionServ.query(consulta, [carrera_nuevo.taxi.rowid,  taxista_id, carrera_nuevo.zona, fechayhora_inicio, carrera_nuevo.lugar_inicio, carrera_nuevo.lugar_fin, fechayhora_fin, carrera_nuevo.estado, usu.rowid]).then(function(result){
			toastr.success('Carrera guardada');
			$scope.traer_datos();
			
			fecha = new Date();
			$scope.carrera_nuevo = {
				taxi: null,
				taxista: null,
				lugar_inicio: '',
				lugar_fin: '',
				fecha_ini: fecha,
				fecha_fin: fecha,
				hora_ini: fecha,
				hora_fin: fecha,
				estado: 'En curso'
			}
		}, function(tx){
			console.log('error', tx);
		});
	}



  

/*
$scope.traer_datos = function(){
	consulta = 'SELECT taxi_id, taxista_id, fecha_ini, lugar_inicio, lugar_fin, fecha_fin, estado, rowid from carreras'
		ConexionServ.query(consulta, []).then(function(result){
			$scope.carreras = result;
			console.log('se subio la carrera', result);

		}, function(tx){
			console.log('error', tx);

		});
}

*/

	$scope.traer_datos = function(dato){
		
		consulta 	= '';
		fechita 	= window.fixDate(new Date());
		
		if (dato) {
			
			if (dato.select_year && dato.select_year != "0") {
			
				fechita 	= dato.select_year;
				console.log(dato);
				if (dato.select_month && dato.select_month != "0") {
					console.log(3456);
					fechita = fechita + '/' + dato.select_month;
					
					if (dato.select_day) {
						fechita = fechita + '/' + dato.select_day;
					}
					//fechita = fechita + '/' + hoy.substring(8, 10);
				}

			}else{
				fechita = '';
			}

		}
		
		consulta 	= 'SELECT c.*, c.rowid, t.nombres, t.apellidos, tx.numero from carreras c ' + 
			'INNER JOIN taxistas t ON c.taxista_id = t.rowid ' + 
			'INNER JOIN taxis tx ON c.taxi_id = tx.rowid ' + 
			'WHERE c.eliminado = "0" and fecha_ini like "'+ fechita +'%" ' +
			'order by c.rowid desc' ;
			

		
		ConexionServ.query(consulta).then(function(result){
		$scope.carreras = result;
			for (var i = 0; i < $scope.carreras.length; i++) {
				$scope.carreras[i].fecha_ini = new Date($scope.carreras[i].fecha_ini);
				$scope.carreras[i].fecha_fin = new Date($scope.carreras[i].fecha_fin);
			}

		}, function(tx){
			console.log('error', tx);

		});

	}

	$scope.traer_datos()


	$scope.eliminar = function(carrera){
		console.log('f')
	    var modalInstance = $uibModal.open({
			templateUrl: 'templates/carreramodal.html',
			controller: 'ModalcarreraCtrl',
			resolve: {
				elemento: function(){
					return carrera;
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


 
	$scope.editar = function(carrera){
   
		$scope.ver = true;
		$scope.carrera_Editar = carrera;

		$location.hash('id-editar-carrera');
		$anchorScroll();
	
	}
    
	$scope.cancelar = function(){
		$scope.ver2 = false;
		$scope.ver = false;
		$location.hash('');
	}
    

	$scope.guardarcarrera = function(carrera_Editar){
	

		fecha_inicio = '' + carrera_Editar.fecha_ini.getFullYear() + '/' + (carrera_Editar.fecha_ini.getMonth() + 1 )    + '/' + carrera_Editar.fecha_ini.getDate();
		fecha_fin = '' + carrera_Editar.fecha_fin.getFullYear() + '/' +  (  carrera_Editar.fecha_ini.getMonth()  +1 ) + '/' + carrera_Editar.fecha_ini.getDate();
	
		hora_inicio = '' + carrera_Editar.hora_ini.getHours() + ':' +    carrera_Editar.hora_ini.getMinutes();   //+ (carrera_nuevo.hora_ini.getHours() >= 12 ? "PM" : "AM");
		hora_final = '' + carrera_Editar.hora_fin.getHours() + ':' +    carrera_Editar.hora_fin.getMinutes();   //+ (carrera_nuevo.hora_fin.getHours() >= 12 ? "PM" : "AM");
	
		fechayhora_inicio 	= fecha_inicio  + ' ' + hora_inicio;
		fechayhora_fin 		= fecha_fin 	+ ' ' + hora_final;
 if (carrera_Editar.id == null) {
 		consulta = 'UPDATE carreras SET  taxi_id=?, taxista_id=?, zona=?, fecha_ini=?, lugar_inicio=?, lugar_fin=?, fecha_fin=?, estado=? where rowid=? '
		ConexionServ.query(consulta, [carrera_Editar.taxi.rowid, carrera_Editar.taxista.rowid, carrera_Editar.zona, fechayhora_inicio, carrera_Editar.lugar_inicio, carrera_Editar.lugar_fin, fechayhora_fin, carrera_Editar.estado, carrera_Editar.rowid]).then(function(result){
			console.log('se cargo la carrera en la compu', result);
		$scope.traer_datos()
				}, function(tx){
					console.log('error', tx);
				});
	
	} else {
			consulta = 'UPDATE carreras SET  taxi_id=?, taxista_id=?, zona=?, fecha_ini=?, lugar_inicio=?, lugar_fin=?, fecha_fin=?, estado=?, modificado=? where rowid=? '
		ConexionServ.query(consulta, [carrera_Editar.taxi.rowid, carrera_Editar.taxista.rowid, carrera_Editar.zona, fechayhora_inicio, carrera_Editar.lugar_inicio, carrera_Editar.lugar_fin, fechayhora_fin, carrera_Editar.estado, "1", carrera_Editar.rowid]).then(function(result){
			console.log('se cargo la carrera en la nube', result);
		$scope.traer_datos()
				}, function(tx){
					console.log('error', tx);
				});
	
	}
				 $scope.ver = false;
	}	


$scope.modificarcarrera =function(carrera){
	
	for (var i = 0; i < $scope.carreras.length; i++) {
		$scope.carreras[i].seleccionada = false;
	}

	carrera.seleccionada = true;
	$scope.carrera_estado = carrera;

}



	$scope.en_curso = function(carrera_estado){

		consulta = 'UPDATE carreras SET estado=?,  modificado="1" where rowid=? '
		ConexionServ.query(consulta, ['En curso', carrera_estado.rowid]).then(function(result){
			console.log('se cargo la carrera', result);

			carrera_estado.estado = 'En curso';

		}, function(tx){
			console.log('error', tx);
		});

	}

$scope.finalizada = function(carrera_estado){

consulta = 'UPDATE carreras SET estado=?,  modificado="1" where rowid=? '
		ConexionServ.query(consulta, ['Finalizada', carrera_estado.rowid]).then(function(result){
			console.log('se cargo la carrera', result);
							carrera_estado.estado = 'Finalizada';

		}, function(tx){
			console.log('error', tx);
		});

}

$scope.cancelada = function(carrera_estado){

consulta = 'UPDATE carreras SET estado=?,  modificado="1" where rowid=? '
		ConexionServ.query(consulta, ['Cancelada', carrera_estado.rowid]).then(function(result){
			console.log('se cargo la carrera', result);
					carrera_estado.estado = 'Cancelada';

		}, function(tx){

			console.log('error', tx);
		});

}


});