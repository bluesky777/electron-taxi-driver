
var app = angular.module('TaxisFast');

app.controller('UsuariosCtrl', function($scope, $http, $timeout, ConexionServ, $location, $anchorScroll,toastr, $uibModal){

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

	$scope.usuario_nuevo = {
		password: '',
		password2: ''
	}

	$scope.CREARUSUARIO = function(usuario_nuevo){
		if (usuario_nuevo.nombres == undefined) {
			toastr.warning('Debe Poner Nombres');	
			return;
		}

		if (usuario_nuevo.apellidos == undefined) {
				toastr.warning('Debe Poner Apellidos');
			return;
		}

		if ($scope.opcion == undefined) {
				toastr.warning('Debe Poner Sexo');
				console.log(usuario_nuevo, $scope.opcion)
			return;
		}
		if (usuario_nuevo.tipo == undefined) {
				toastr.warning('Debe Poner Tipo');
			return;
		}
		if (usuario_nuevo.documento == undefined) {
				toastr.warning('Debe Poner Documento');
			return;
		}
			if (usuario_nuevo.apellidos == undefined) {
				toastr.warning('Debe Poner Apellidos');
			return;
		}
		if (usuario_nuevo.usuario == undefined) {
				toastr.warning('Debe Poner Usuario');
			return;
		}
			if (usuario_nuevo.password.length < 4) {
				toastr.warning('Contraseña con mayor caracteres');
			return;
		}

			if (usuario_nuevo.password == undefined) {
				toastr.error('Contraseñas incorrectas');	
			return;
		}

		console.log(usuario_nuevo);
		if (usuario_nuevo.password != usuario_nuevo.password2) {
			toastr.error('Contraseñas incorrectas');	
			return;
		}

		
		fecha_nac = '';
		if (usuario_nuevo.fecha_nac) {
			fecha_nac = '' + usuario_nuevo.fecha_nac.getFullYear() + '/' + (usuario_nuevo.fecha_nac.getMonth() + 1) + '/' + usuario_nuevo.fecha_nac.getDate();	
		}
		console.log(fecha_nac)

		consulta = 'INSERT INTO users (nombres, apellidos, sexo, tipo, documento, celular, fecha_nac, usuario, password) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)'
		ConexionServ.query(consulta, [usuario_nuevo.nombres, usuario_nuevo.apellidos, $scope.opcion, usuario_nuevo.tipo, usuario_nuevo.documento, usuario_nuevo.celular, fecha_nac, usuario_nuevo.usuario, usuario_nuevo.password]).then(function(result){
			console.log('se cargo el usuario', result);
				$scope.traer_datos()
				toastr.success('Usuario Agregado');
		}, function(tx){
			console.log('error', tx);

				toastr.error('Error al crear');	
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
		consulta = 'SELECT *, rowid from users WHERE eliminado = "0" and rowid != "1"'
		ConexionServ.query(consulta, []).then(function(result){
			$scope.usuarios = result;
			for (var i = 0; i < $scope.usuarios.length; i++) {
				$scope.usuarios[i].fecha_nac = new Date($scope.usuarios[i].fecha_nac);
					
			}
			console.log('se subio el usuario', result);

		}, function(tx){
			console.log('error', tx);
		})
	}
	$scope.traer_datos()

		


	$scope.eliminar = function(usuario){
		console.log('f')
	    var modalInstance = $uibModal.open({
			templateUrl: 'templates/usuariomodal.html',
			controller: 'ModalInstanceCtrl',
			resolve: {
				elemento: function(){
					return usuario;
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

	$scope.editar = function(usuario){
   
		$scope.ver = true;
		
		if (usuario.fecha_nac) {
			usuario.fecha_nac = new Date(usuario.fecha_nac);
		}
		
		
		if (taxista.sexo == 'M') {
			$scope.caja_genero1(taxista.sexo);
		}else{
			$scope.caja_genero2(taxista.sexo);
		}
		
		$scope.usuario_Editar = usuario;
		
		$timeout(function(){
			$location.hash('id-editar-usuario');
			$anchorScroll();
		}, 100)
		
	
	}
    
	$scope.cancelar = function(){

		$scope.ver2 = false;
		$scope.ver = false;
		$location.hash('');
   	
 		$scope.ocultarboton = !$scope.ocultarboton;
	
	}
    

	$scope.GUARDARUSUARIO = function(usuario_Editar){
		if (usuario_Editar.password != usuario_Editar.password2 && usuario_Editar.password==undefined) {
			alert('Rectifique contraseña');
			return;
		}

		fecha_nac = '' + usuario_Editar.fecha_nac.getFullYear() + '/' + (usuario_Editar.fecha_nac.getMonth() + 1) + '/' + usuario_Editar.fecha_nac.getDate();
		
		if (usuario_Editar.id == null) {
			consulta = 'UPDATE users SET  nombres=?, apellidos=?, sexo=?, tipo=?, documento=?, celular=?, fecha_nac=?, usuario=?, password=? where rowid=? '
			ConexionServ.query(consulta, [usuario_Editar.nombres, usuario_Editar.apellidos, $scope.opcion, usuario_Editar.tipo, usuario_Editar.documento, usuario_Editar.celular, fecha_nac, usuario_Editar.usuario, usuario_Editar.password, usuario_Editar.rowid]).then(function(result){
				console.log('se cargo el usuario en la compu', result);
					$scope.traer_datos()
					toastr.success('Usuario Editado');
			}, function(tx){
				console.log('error', tx);
			});
		} else {
			consulta = 'UPDATE users SET  nombres=?, apellidos=?, sexo=?, tipo=?, documento=?, celular=?, fecha_nac=?, usuario=?, password=?, modificado=? where rowid=? '
			ConexionServ.query(consulta, [usuario_Editar.nombres, usuario_Editar.apellidos, $scope.opcion, usuario_Editar.tipo, usuario_Editar.documento, usuario_Editar.celular, fecha_nac, usuario_Editar.usuario, usuario_Editar.password, "1", usuario_Editar.rowid]).then(function(result){
				console.log('se cargo el usuario en la nube', result);
				$scope.traer_datos()
				toastr.success('Usuario Editado');
			}, function(tx){
				console.log('error', tx);
			});
		}

		$scope.ver = false;
	}	

});


