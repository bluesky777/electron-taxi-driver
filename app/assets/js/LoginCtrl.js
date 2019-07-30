var app = angular.module('TaxisFast');

app.controller('LoginCtrl', function($scope, $http, $filter, ConexionServ, AuthServ, $state, toastr){

	ConexionServ.createTables();

	$scope.usu = { username: '', password: '' }

	$scope.entrar = function(user){
	
		if (!user.username || user.username.length < 2) {
			toastr.warning('Nombre de usuario incorrecto');
		}
        
        AuthServ.loguear(user).then(function(data){
			if(data.to_sync){
				$state.go('panel.nube');
				toastr.info('Debes descargar los datos si no lo has hecho.', 'Descargar');
			}else{
				$state.go('panel');
			}
        }, function(){
            toastr.error('Datos incorrectos');
        })
    
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


    
	//$scope.insertar_datos_iniciales();
	
	

});