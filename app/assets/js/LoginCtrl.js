var app = angular.module('TaxisFast');

app.controller('LoginCtrl', function($scope, $http, $filter, ConexionServ, AuthServ, $state, toastr){

ConexionServ.createTables();

	$scope.usu = { username: '', password: '' }

  $scope.entrar = function(usu){
	
		AuthServ.loguear(usu).then(function(){
			$state.go('panel');
			toastr.success('Bienvenido');
		}, function(err){
			toastr.error('Datos inválidados');
		});
	}

		
    $scope.insertar_datos_iniciales = function() {

    	consulta = "SELECT * from users ";
   		ConexionServ.query(consulta, []).then(function(result) {
			if (result.length == 0) {




		consulta = "INSERT INTO users(nombres, apellidos, usuario, password, tipo, sexo) VALUES(?,?,?,?,?,?) ";
				ConexionServ.query(consulta, ['Angel Guillermo', 'Peñarredonda Silva', 'Angelghack',  '123', 'Admin', 'M']).then(function(result) {

				}, function(tx) {
					console.log("Dato original no insertado", tx);
				});

		

			}

        }, function(tx) {
          console.log("", tx);
		});

	};


    
	$scope.insertar_datos_iniciales();
	
	

});