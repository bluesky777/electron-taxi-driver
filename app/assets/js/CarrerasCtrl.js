var app = angular.module("TaxisFast");

app.controller("CarrerasCtrl", function(
	$scope,
	toastr,
	$filter,
	ConexionServ,
	USER,
	$location,
	$anchorScroll,
	$uibModal,
	$timeout,
	$http,
	rutaServidor
) {
	ConexionServ.createTables();

	fecha = new Date();
	$scope.mostrando_mas_cell = false;

	
	$scope.carrera_nuevo = {
		zona: "Z1",
		fecha_ini: fecha,
		fecha_fin: fecha,
		lugar_inicio: "",
		lugar_fin: "",
		hora_ini: fecha,
		hora_fin: fecha,
		estado: "En curso"
	};

	$scope.imprimir = function() {
		const { ipcRenderer } = require("electron");
		window.print();
	};

	$scope.refreshHora = function(campo, campo2) {
		fecha = new Date();
		$scope.carrera_nuevo[campo] = fecha;
		$scope.carrera_nuevo[campo2] = fecha;
	};

	$scope.carrera_Editar = {
		zona: "Z1",
		fecha_ini: fecha,
		fecha_fin: fecha,
		lugar_inicio: "",
		lugar_fin: "",
		hora_ini: fecha,
		hora_fin: fecha,
		estado: "En curso"
	};

	$scope.ver = false;
	$scope.ver2 = true;
	$scope.vercarreras = false;
	$scope.dato = { select_year: '' + (new Date().getFullYear()), select_month: 0 }

	consulta = "SELECT *, rowid FROM taxistas WHERE eliminado ='0'";
	ConexionServ.query(consulta, []).then(
		function(result) {
			$scope.taxistas = result;
		},
		function(tx) {
			console.log("error", tx);
		}
	);

	consulta = "SELECT *, rowid  FROM taxis WHERE eliminado ='0'";
	ConexionServ.query(consulta, []).then(
		function(result) {
			$scope.taxis = result;
		},
		function(tx) {
			console.log("error", tx);
		}
	);

	$scope.select_taxista = function(carrera_nuevo) {

		consulta = "SELECT *, rowid FROM taxistas WHERE rowid =? and eliminado='0'";
		ConexionServ.query(consulta, [carrera_nuevo.taxi.taxista_id]).then(function(result) {
				if (result.length > 0) {
					carrera_nuevo.taxista = result[0];
				}
		}, function(tx) {
				console.log("error", tx);
		});
	};

	$scope.mostrar_mas_cell = function() {
	$scope.mostrando_mas_cell = true;
	}
	
	$scope.guardarc = function(carrera_nuevo) {
		if (!carrera_nuevo.taxi) {
			toastr.warning("Debe elegir taxi");
			return;
		}
		taxista_id = null;
		if (carrera_nuevo.taxista) {
			taxista_id = carrera_nuevo.taxista.rowid;
		}

		if (!carrera_nuevo.cell_llamado) {
			toastr.warning("Debe elegir o escribir el celular");
			return;
		}
		
		if (!$scope.USER.rowid) {
			$scope.USER.rowid = $scope.USER.id;
		}
		

		fecha_inicio 	= window.fixDate(carrera_nuevo.fecha_ini, carrera_nuevo.hora_ini);
		fecha_fin 		= window.fixDate(carrera_nuevo.fecha_fin, carrera_nuevo.hora_fin);
		/*
		hora_inicio 	= "" + carrera_nuevo.hora_ini.getHours() + ":" + carrera_nuevo.hora_ini.getMinutes() + ':00'; //+ (carrera_nuevo.hora_ini.getHours() >= 12 ? "PM" : "AM");
		hora_final 		= "" + carrera_nuevo.hora_fin.getHours() + ":" + carrera_nuevo.hora_fin.getMinutes() + ':00'; //+ (carrera_nuevo.hora_fin.getHours() >= 12 ? "PM" : "AM");

		fechayhora_inicio 	= fecha_inicio + " " + hora_inicio;
		fechayhora_fin 		= fecha_fin + " " + hora_final;
		*/
		consulta = "INSERT INTO carreras (taxi_id, taxista_id, zona, fecha_ini, lugar_inicio, cell_llamado, lugar_fin, fecha_fin, estado, registrada_por) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
		ConexionServ.query(consulta, [
			carrera_nuevo.taxi.rowid,
			taxista_id,
			carrera_nuevo.zona,
			fecha_inicio,
			carrera_nuevo.lugar_inicio,
			carrera_nuevo.cell_llamado,
			carrera_nuevo.lugar_fin,
			fecha_fin,
			carrera_nuevo.estado,
			usu.nombres + ' ' + usu.apellidos
		]).then(function(result) {
				toastr.success("Carrera guardada");
				$scope.traer_datos();

				fecha = new Date();
				$scope.carrera_nuevo = {
					taxi: null,
					taxista: null,
					lugar_inicio: "",
					lugar_fin: "",
					zona: "Z1",
					fecha_ini: fecha,
					fecha_fin: fecha,
					hora_ini: fecha,
					hora_fin: fecha,
					estado: "En curso"
				};
		},function(tx) {
				console.log("error", tx);
		});
	};




	$scope.exportar_excel = function(dato) {

		if (parseInt(dato.select_month) == 0) {
			toastr.warning('Seleccione el mes.');
			return;
		}

		defaultFileName = 'Carreras ' + dato.select_month + '/' + dato.select_year + '.xls';
		
		$http.get(rutaServidor.ruta + 'taxis/exportar-carreras', {params: dato, responseType: "blob"} ).then( function(data){
			type          = data.headers('Content-Type');
			disposition   = data.headers('Content-Disposition');
			if (disposition)
				match = disposition.match(/.*filename=\"?([^;\"]+)\"?.*/);
				if (match[1])
					defaultFileName = match[1];

			defaultFileName = defaultFileName.replace(/[<>:"\/\\|?*]+/g, '_')
			blob = new Blob([data.data], { type: type });
			window.saveAs(blob, defaultFileName);

		}, function(r2){
			console.log(r2);
		});
	}


	$scope.traer_datos = function(dato) {
		consulta 	= "";
		fechita 	= window.fixDate(new Date());

		if (dato) {
			if (dato.select_year && dato.select_year != "0") {
				fechita = dato.select_year;

				if (dato.select_month && dato.select_month != "0") {

					fechita = fechita + "/" + dato.select_month;

					if (dato.select_day) {
						fechita = fechita + "/" + dato.select_day;
					}

				}
			} else {
				fechita = "";
			}
		}

		consulta = "SELECT c.*, c.rowid, t.nombres, t.apellidos, tx.numero from carreras c " +
			"INNER JOIN taxistas t ON c.taxista_id = t.rowid " +
			"INNER JOIN taxis tx ON c.taxi_id = tx.rowid " +
			'WHERE c.eliminado = "0" and fecha_ini like "' + fechita + '%" ' +
			"order by c.rowid desc";

		ConexionServ.query(consulta).then(function(result) {
				$scope.carreras = result;
				for (var i = 0; i < $scope.carreras.length; i++) {
					$scope.carreras[i].fecha_ini = new Date($scope.carreras[i].fecha_ini);
					$scope.carreras[i].fecha_fin = new Date($scope.carreras[i].fecha_fin);
				}
		}, function(tx) {
				console.log("error", tx);
		});
	
	
		consulta = 'SELECT distinct(cell_llamado) as cell_llamado FROM carreras WHERE eliminado = "0" and cell_llamado is not null';
		ConexionServ.query(consulta, []).then(function(result) {
			$scope.celulares = result;
		}, function(tx) {
			console.log("error celulares", tx);
		});
		
		consulta = 'SELECT distinct(lugar_inicio) as direccion FROM carreras WHERE eliminado = "0" and lugar_inicio is not null and lugar_inicio!="" ';
		ConexionServ.query(consulta, []).then(function(result) {
			$scope.direcciones = result;
		}, function(tx) {
			console.log("error celulares", tx);
		});
	};

	$scope.traer_datos();

	$scope.eliminar = function(carrera) {
		console.log("f");
		var modalInstance = $uibModal.open({
			templateUrl: "templates/carreramodal.html",
			controller: "ModalcarreraCtrl",
			resolve: {
				elemento: function() {
					return carrera;
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

	$scope.mostrareditar = function() {
		$scope.tablaeditar = true;
	};

	$scope.editar = function(carrera) {

		$scope.ver = true;
	$scope.carrera_Editar = carrera;
	
	for (let i = 0; i < $scope.taxistas.length; i++) {
		if ($scope.carrera_Editar.taxista_id == $scope.taxistas[i].rowid) {
			$scope.carrera_Editar.taxista = $scope.taxistas[i];
		}
	}
	for (let i = 0; i < $scope.taxis.length; i++) {
		if ($scope.carrera_Editar.taxi_id == $scope.taxis[i].rowid) {
			$scope.carrera_Editar.taxi = $scope.taxis[i];
		}
	}
	
		$timeout(function() {
			$location.hash("id-editar-carrera");
			$anchorScroll();
		});
	};

	$scope.cancelar = function() {
		$scope.ver = false;
		$location.hash("");
	};

	
	$scope.guardarcarrera = function(carrera_Editar) {
		
		fecha_inicio 	= window.fixDate(carrera_Editar.fecha_ini, carrera_Editar.fecha_ini);
		fecha_fin 		= window.fixDate(carrera_Editar.fecha_fin, carrera_Editar.fecha_fin);
		/*
		hora_inicio 	= "" + carrera_Editar.fecha_ini.getHours() + ":" + carrera_Editar.fecha_ini.getMinutes() + ':00'; //+ (carrera_nuevo.hora_ini.getHours() >= 12 ? "PM" : "AM");
		hora_final 		= "" + carrera_Editar.fecha_fin.getHours() + ":" + carrera_Editar.fecha_fin.getMinutes() + ':00'; //+ (carrera_nuevo.hora_fin.getHours() >= 12 ? "PM" : "AM");

		fechayhora_inicio 	= fecha_inicio + " " + hora_inicio;
		fechayhora_fin 		= fecha_fin + " " + hora_final;
		*/
		if (carrera_Editar.id == null) {
			consulta = "UPDATE carreras SET  taxi_id=?, taxista_id=?, zona=?, fecha_ini=?, lugar_inicio=?, lugar_fin=?, fecha_fin=?, estado=?, cell_llamado=? where rowid=? ";
			ConexionServ.query(consulta, [
				carrera_Editar.taxi.rowid,
				carrera_Editar.taxista.rowid,
				carrera_Editar.zona,
				fecha_inicio,
				carrera_Editar.lugar_inicio,
				carrera_Editar.lugar_fin,
				fecha_fin,
				carrera_Editar.estado,
				carrera_Editar.cell_llamado,
				carrera_Editar.rowid
			]).then(
				function(result) {
					console.log("se cargo la carrera en la compu", result);
					$scope.traer_datos();
				},
				function(tx) {
					console.log("error", tx);
				}
			);
		} else {
			consulta =
				"UPDATE carreras SET  taxi_id=?, taxista_id=?, zona=?, fecha_ini=?, lugar_inicio=?, lugar_fin=?, fecha_fin=?, estado=?, modificado=? where rowid=? ";
			ConexionServ.query(consulta, [
				carrera_Editar.taxi.rowid,
				carrera_Editar.taxista.rowid,
				carrera_Editar.zona,
				fechayhora_inicio,
				carrera_Editar.lugar_inicio,
				carrera_Editar.lugar_fin,
				fechayhora_fin,
				carrera_Editar.estado,
				"1",
				carrera_Editar.rowid
			]).then(
				function(result) {
					$scope.traer_datos();
				},
				function(tx) {
					console.log("error", tx);
				}
			);
		}
		$scope.ver = false;
	};

	$scope.modificarcarrera = function(carrera, edit_hora) {
	if (edit_hora) {
		carrera.cambiando_hora = true
	}else{
		for (var i = 0; i < $scope.carreras.length; i++) {
			$scope.carreras[i].seleccionada = false;
		}
	
		carrera.seleccionada = true;
		$scope.carrera_estado = carrera;
	}
	
	};

	$scope.cancelar_fecha_fin = function(carrera) {
		$timeout(function(){
		carrera.cambiando_hora 	= false
		})
	};
	
	$scope.guardar_hora_fin = function(carrera) {
	
	fecha_fin 		= window.fixDate(carrera.fecha_fin);
	hora_final 		= "" + carrera.fecha_fin.getHours() + ":" + carrera.fecha_fin.getMinutes() + ':00'; //+ (carrera_nuevo.hora_fin.getHours() >= 12 ? "PM" : "AM");
		fechayhora_fin 	= fecha_fin + " " + hora_final;
	
	consulta = 'UPDATE carreras SET fecha_fin=?,  modificado="1" where rowid=? ';
		ConexionServ.query(consulta, [fechayhora_fin, carrera.rowid]).then(function(result) {
				carrera.fecha_fin 		= new Date(carrera.fecha_fin);
		carrera.cambiando_hora 	= false
		}, function(tx) {
				console.log("error", tx);
		});
	
	};

	$scope.en_curso = function(carrera_estado) {
		consulta = 'UPDATE carreras SET estado=?,  modificado="1" where rowid=? ';
		ConexionServ.query(consulta, ["En curso", carrera_estado.rowid]).then(function(result) {
				carrera_estado.estado = "En curso";
		}, function(tx) {
				console.log("error", tx);
		});
	};

	$scope.finalizada = function(carrera_estado) {
		consulta = 'UPDATE carreras SET estado=?,  modificado="1" where rowid=? ';
		ConexionServ.query(consulta, ["Finalizada", carrera_estado.rowid]).then(
			function(result) {
				console.log("se cargo la carrera", result);
				carrera_estado.estado = "Finalizada";
			},
			function(tx) {
				console.log("error", tx);
			}
		);
	};

	$scope.cancelada = function(carrera_estado) {
		consulta = 'UPDATE carreras SET estado=?,  modificado="1" where rowid=? ';
		ConexionServ.query(consulta, ["Cancelada", carrera_estado.rowid]).then(
			function(result) {
				console.log("se cargo la carrera", result);
				carrera_estado.estado = "Cancelada";
			},
			function(tx) {
				console.log("error", tx);
			}
		);
	};
});
