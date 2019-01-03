var app = angular.module("TaxisFast");

app.controller("taxisCtrl", function(
  $scope,
  $http,
  $filter,
  ConexionServ,
  $location,
  $anchorScroll,
  $uibModal,
  $timeout,
  toastr
) {

  $scope.ocultarboton 	= true;
  $scope.ver_editar 	= false;
  $scope.ver_crear 		= false;
  $scope.taxi_nuevo 	= {};

  
  $scope.CREARTAXI = function(taxi_nuevo) {
    
    if (!taxi_nuevo.propietario) {
      taxi_nuevo.propietario = '';
    }

    consulta = "INSERT INTO taxis (modelo, numero, placa, taxista_id, propietario, Soat, Seguro) VALUES(?, ?, ?, ?, ?, ?, ?)";
	
	ConexionServ.query(consulta, [
      taxi_nuevo.modelo || null,
      taxi_nuevo.numero || null,
      taxi_nuevo.placa || null,
      taxi_nuevo.taxista.rowid,
      taxi_nuevo.propietario,
      taxi_nuevo.Soat || null,
      taxi_nuevo.Seguro || null
    ]).then(
      function(result) {
		$scope.traer_datos();
		$scope.ver_crear = false;
		$scope.taxi_nuevo = {};
		toastr.success('Taxi creado.');
      },
      function(tx) {
        console.log("error", tx);
      }
    );
    

    
  };
  
  $scope.mostrartabla = function(taxi) {
    if ($scope.ver_crear == false) {
      $scope.ver_crear = true;
    } else {
      $scope.ver_crear = false;
    }

    $scope.ocultarboton = !$scope.ocultarboton;
  };

  $scope.traer_datos = function() {
	consulta = 'SELECT t.*, t.rowid, c.nombres, c.apellidos FROM taxis t ' +
		'INNER JOIN taxistas c ON t.taxista_id = c.rowid ' +
		'WHERE t.eliminado ="0" ' +
		'ORDER BY t.numero';
		
    ConexionServ.query(consulta, []).then(
      function(result) {
        $scope.taxis = result;
        console.log("Taxis:", result);
      },
      function(tx) {
        console.log("error", tx);
      }
    );
  };

  $scope.traer_datos();

  consulta = "SELECT *, rowid from taxistas";
  ConexionServ.query(consulta, []).then(
    function(result) {
      $scope.taxistas = result;
      console.log("Taxistas:", result);
    },
    function(tx) {
      console.log("error", tx);
    }
  );

  $scope.eliminar = function(taxi) {
    console.log("f");
    var modalInstance = $uibModal.open({
      templateUrl: "templates/taximodal.html",
      controller: "ModaltaxiCtrl",
      resolve: {
        elemento: function() {
          return taxi;
        }
      }
    });

    modalInstance.result.then(
      function(selectedItem) {
        console.log(selectedItem);
        $scope.traer_datos();
      },
      function() {
        console.log("Modal dismissed at: " + new Date() + "hola");
      }
    );
  };


  $scope.editar = function(taxi) {
	console.log(taxi);
	
	for (let i = 0; i < $scope.taxistas.length; i++) {
		if ($scope.taxistas[i].rowid == taxi.taxista_id) {
			taxi.taxista = $scope.taxistas[i];
		}
	}
    $scope.ver_editar = true;
	$scope.taxi_Editar = taxi;
	
	$timeout(function(){
		$location.hash("id-editar-taxi");
		$anchorScroll();
	})
    
  };

  $scope.cancelar = function() {
    $scope.ver_crear = false;
    $scope.ver_editar = false;
    $location.hash("");

  };

  $scope.guardartaxi = function(taxi_Editar) {
	  
	

    if (taxi_Editar.id == null) {

      consulta = "UPDATE taxis SET modelo=?, numero=?, placa=?, taxista_id=?, propietario=?, Soat=?, Seguro=? where rowid=? ";
      ConexionServ.query(consulta, [
        ,
        taxi_Editar.numero || null,
        taxi_Editar.placa || null,
        taxi_Editar.taxista.rowid,
        taxi_Editar.propietario || null,
        taxi_Editar.Soat || null,
        taxi_Editar.Seguro || null,
        taxi_Editar.rowid
      ]).then(
        function(result) {
          console.log("se cargo el taxi en el compu", result);
          $scope.traer_datos();
        },
        function(tx) {
          console.log("error", tx);
        }
      );
    } else {
      consulta =
        "UPDATE taxis SET modelo=?, numero=?, placa=?, taxista_id=?, propietario=?, Soat=?, Seguro=?, modificado=? where rowid=? ";
      ConexionServ.query(consulta, [
        taxi_Editar.modelo || null,
        taxi_Editar.numero,
        taxi_Editar.placa || null,
        taxi_Editar.taxista_id,
        taxi_Editar.propietario,
        taxi_Editar.Soat || null,
        taxi_Editar.Seguro || null,
        "1",
        taxi_Editar.rowid
      ]).then(
        function(result) {
		  $scope.traer_datos();
		  $scope.ver_editar = false;
		  toastr.success('Cambios guardados.');
        },
        function(tx) {
          console.log("error", tx);
        }
      );
    }

    
  };
});
