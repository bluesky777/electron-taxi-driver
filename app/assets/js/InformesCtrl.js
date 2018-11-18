var app = angular.module('TaxisFast');

app.controller('InformesCtrl', function($scope, $http, $filter, ConexionServ, AuthServ, $state){

ConexionServ.createTables();

	$scope.imprimir = function() {
		
		const {ipcRenderer} = require('electron');
		console.log(ipcRenderer);
		window.print();
    };



  
$scope.ver = false;
$scope.mesesito = false;

$scope.mostrarmes = function(){

	$scope.mesesito = ! $scope.mesesito
}
  
$scope.ver2 = false;
$scope.informe = {};
 

$scope.ver3 = false;
 
$scope.fechamostrar = false;
$scope.taximostrar = false;
$scope.taxistamostrar = false;



	$scope.fechaclick = function(){
	$scope.fechamostrar = !$scope.fechamostrar;
	$scope.taximostrar = false;
	$scope.taxistamostrar = false;


	}

	$scope.taxiclick = function(){
	$scope.taximostrar = !$scope.taximostrar;
	$scope.fechamostrar = false;
	$scope.taxistamostrar = false;

	}

	$scope.taxistaclick = function(){
	$scope.taxistamostrar = !$scope.taxistamostrar;
	$scope.fechamostrar = false;
	$scope.taximostrar = false;

	}





$scope.ver4 = false;
$scope.vertablacarreras = false;


 

	consulta = 'SELECT *, rowid from users where eliminado = 0'
	ConexionServ.query(consulta, []).then(function(result){
		$scope.usuarios = result;
	
		console.log('se trajeron los usuarios', result);

	}, function(tx){
		console.log('error', tx);
	})


	consulta = 'SELECT *, rowid from taxistas where eliminado = 0'
	ConexionServ.query(consulta, []).then(function(result){
		$scope.taxistas = result;
	
		console.log('se trajeron los taxistas', result);

	}, function(tx){
		console.log('error', tx);
	})


	consulta = 'SELECT *, rowid from taxis where eliminado = 0'
	ConexionServ.query(consulta, []).then(function(result){
		$scope.taxis = result;
	
		console.log('se trajeron los taxis', result);

	}, function(tx){
		console.log('error', tx);
	})

	

$scope.traer_datos4 = function(informe){



	fecha_inicios = informe.fecha_ini.getMonth() ;


		consulta = 'SELECT c.*, c.rowid, t.nombres, t.apellidos, tx.numero from carreras c ' + 
				'INNER JOIN taxistas t ON c.taxista_id = t.rowid ' + 
				'INNER JOIN taxis tx ON c.taxi_id = tx.rowid ' +
				'where c.fecha_ini = ?';

			ConexionServ.query(consulta, [fecha_inicios]).then(function(result){
			$scope.carreras = result;
	
			console.log('se trajeron las carreras',result);

		}, function(tx){
			console.log('error', tx);

		})


		$scope.vertablacarreras = !$scope.vertablacarreras;

	
	}

$scope.traer_datos = function(informe){

fecha_inicio = window.fixDate(informe.fecha_ini);

	consulta = 'SELECT c.*, c.rowid, t.nombres, t.apellidos, tx.numero, SUBSTR(c.fecha_ini, 0, 11) as fecha_sub from carreras c ' + 
				'INNER JOIN taxistas t ON c.taxista_id = t.rowid ' + 
				'INNER JOIN taxis tx ON c.taxi_id = tx.rowid ' +
				'where SUBSTR(c.fecha_ini, 0, 11) = ?';
			ConexionServ.query(consulta, [fecha_inicio]).then(function(result){
			$scope.carreras = result;
	
			console.log('se trajeron las carreras',result);

		}, function(tx){
			console.log('error', tx);

		})



		$scope.vertablacarreras = !$scope.vertablacarreras;

	
	}

$scope.traer_datos2 = function(informe){



		consulta = 'SELECT c.*, c.rowid, t.nombres, t.apellidos, tx.numero from carreras c ' + 
				'INNER JOIN taxistas t ON c.taxista_id = t.rowid ' + 
				'INNER JOIN taxis tx ON c.taxi_id = tx.rowid ' +
				'where t.nombres = ?';

			ConexionServ.query(consulta, [informe.taxista.nombres]).then(function(result){
			$scope.carreras = result;
	
			console.log('se trajeron las carreras',result);

		}, function(tx){
			console.log('error', tx);

		})


		$scope.vertablacarreras = !$scope.vertablacarreras;	
	}

$scope.traer_datos3 = function(informe){



		consulta = 'SELECT c.*, c.rowid, t.nombres, t.apellidos, tx.numero from carreras c ' + 
				'INNER JOIN taxistas t ON c.taxista_id = t.rowid ' + 
				'INNER JOIN taxis tx ON c.taxi_id = tx.rowid ' +
				'where tx.numero = ?';

			ConexionServ.query(consulta, [informe.taxi.numero]).then(function(result){
			$scope.carreras = result;
	
			console.log('se trajeron las carreras',result);

		}, function(tx){
			console.log('error', tx);

		})


		$scope.vertablacarreras = !$scope.vertablacarreras;

	
	}








	$scope.mostrartabla = function(){
	$scope.ver = !$scope.ver;
	$scope.ver2 = false;
	$scope.ver4 = false;
	$scope.ver3 = false;
	vertablacarreras = false;
	$scope.fechamostrar = false;
	$scope.taximostrar = false;
	$scope.taxistamostrar = false;

	}
		$scope.mostrartabla2 = function(){
	$scope.ver2= !$scope.ver2;
		$scope.ver = false;
	$scope.ver4 = false;
	$scope.ver3 = false;	
	
	$scope.vertablacarreras = false;
		$scope.fechamostrar = false;
	$scope.taximostrar = false;
	$scope.taxistamostrar = false;

	}
		$scope.mostrartabla3 = function(){
	$scope.ver3= !$scope.ver3;
	$scope.ver2 = false;
	$scope.ver4 = false;
	$scope.ver = false;
	$scope.vertablacarreras = false;
		$scope.fechamostrar = false;
	$scope.taximostrar = false;
	$scope.taxistamostrar = false;


	}
		$scope.mostrartabla4 = function(){
		$scope.ver4= !$scope.ver4;
	$scope.ver2 = false;
	$scope.ver = false;
	$scope.ver3 = false;
	$scope.vertablacarreras = false;
		$scope.fechamostrar = false;
	$scope.taximostrar = false;
	$scope.taxistamostrar = false;
	}

 

	

});