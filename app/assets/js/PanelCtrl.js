var app = angular.module('TaxisFast');

app.controller('ApplicationCtrl', function($scope, AuthServ, $state){
	
	$scope.kedarrata = true;
	$scope.colapsado = 'false';
	
});
 
app.controller('PanelCtrl', function($scope, AuthServ, $state, USER){
 
	$scope.USER = USER;
	
	
	
	if (localStorage.calapsado) {
		$scope.$parent.colapsado = localStorage.colapsado;
	}


	$scope.cerrar_sesion = function(){
		AuthServ.cerrar_sesion();
	}

	$scope.calapsar_menu = function(){
		
		if ($scope.$parent.colapsado == 'false') {
			localStorage.colapsado 		= 'true';
			$scope.$parent.colapsado	= 'true';
		}else{
			localStorage.colapsado 		= 'false';
			$scope.$parent.colapsado	= 'false';
		}
	}

});


window.fixDate = function(fec){
	dia 	= fec.getDate();
	mes 	= (fec.getMonth() + 1 );
	year 	= fec.getFullYear();

	if (dia < 10) {
		dia = '0' + dia;
	}

	if (mes < 10) {
		mes = '0' + mes;
	}

	fecha 	= '' + year + '/' + mes  + '/' + dia;

	return fecha;
}