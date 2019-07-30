var app = angular.module('TaxisFast');

app.controller('GPSCtrl', function($scope, $http, $filter, ConexionServ, AuthServ, $state, $http, rutaServidor, toastr){
	$scope.data = {}

    consulta = 'SELECT *, rowid FROM taxis  ';
    ConexionServ.query(consulta).then(function(r){
        $scope.taxis = r
    });



    $scope.ubicacion = function(){
    	return
	    $http.put(rutaServidor.ruta + 'taxis/traer-posiciones', {taxi_id: $scope.data.taxi_selec.rowid}).then(function(r){
	        $scope.posiciones 		= r.data.posiciones;
	        posicion 				= $scope.posiciones[$scope.posiciones.length-1];
	        posicion.latitud 		= parseFloat(posicion.latitud);
	        posicion.longitud 		= parseFloat(posicion.longitud);

	        $scope.posicion = posicion;
	        console.log($scope.posicion);
	        
	        if ($scope.posicion) {

	        	for (var i = 0; i <  $scope.taxis.length; i++) {
	        		 if ($scope.taxis[i].rowid == $scope.posicion.taxi_id) {
	        		 	$scope.posicion.Nombre_taxi = $scope.taxis[i].numero;
	        		 }
	        	}

				map = new google.maps.Map(document.getElementById('map'), {
			      center: {lat: $scope.posicion.latitud, lng: $scope.posicion.longitud},
			      zoom: 14
		    	});

				var marker = new google.maps.Marker({
				    position: {lat: $scope.posicion.latitud, lng: $scope.posicion.longitud},
				    title: "Taxi: " + $scope.posicion.Nombre_taxi + " Fecha: "+ $scope.posicion.fecha_hora   +"  "
				});
				marker.setMap(map);

			}else{
		        toastr.warning('Este taxi no tiene ninguna posición');
			}

	        
	    })


	};

});