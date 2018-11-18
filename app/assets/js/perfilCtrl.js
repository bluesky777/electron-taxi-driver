var app = angular.module('TaxisFast');

app.controller('perfilCtrl', function($scope, $http, $filter, ConexionServ, AuthServ,  $state, USER, toastr){

$scope.USER = USER;

 
   $scope.usu = USER;

   $scope.passwords = {
   		antiguo: '',
   		nuevo: '',
   		nuevo2: ''
   };



	$scope.GUARDARUSUARIO = function(usu){
			fecha_nac = '' + usu.fecha_nac.getFullYear() + '/' + (usu.fecha_nac.getMonth() + 1) + '/' + usu.fecha_nac.getDate();
		consulta = 'UPDATE users SET  nombres=?, apellidos=?, sexo=?, documento=?, celular=?, fecha_nac=?, modificado=? where rowid=?'
		ConexionServ.query(consulta, [usu.nombres,usu.apellidos, usu.sexo, usu.documento, usu.celular,fecha_nac, "1", usu.rowid]).then(function(result){
			console.log('se cargo el usuario', result);
			AuthServ.update_user_storage(usu);
			toastr.success('Guardado con éxito', 'Guardado');
		}, function(tx){
			console.log('error', tx);
			toastr.error('No se pudo guardar');
		});
		$scope.ver = false;
	}	

	$scope.cambiar_pass = function(passwords){


		if (passwords.nuevo != passwords.nuevo2) {
			toastr.warning('No coincide la contraseña nueva');
			return;
		}
		
		datos = { username: $scope.USER.usuario, password: passwords.antiguo}
		
		AuthServ.loguear(datos).then(function(){
			
			consulta = 'UPDATE users SET password=?, modificado=? WHERE rowid=?';
			ConexionServ.query(consulta, [passwords.nuevo, "1", $scope.USER.rowid]).then(function(){
				toastr.success('Contraseña cambiada');
			}, function(){
				toastr.error('Contraseña NO cambiada');
			})

		}, function(err){
			toastr.error('Contraseña antigua inválida');
		});
	}	

});