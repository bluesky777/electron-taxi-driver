angular.module('TaxisFast')

.factory('SyncServ', function($q, $http, $timeout, ConexionServ, $state, toastr, rutaServidor) {


 
                
    result = {
          
        traerCambios: function(){
            var defered = $q.defer();
            
            datos       = {};
            promesas    = [];
            
            consulta = 'SELECT *, rowid from users WHERE eliminado = "1" or modificado ="1" or id is null and id !=1'
            prom = ConexionServ.query(consulta, []);
            prom.then(function(result){
                datos.usuarios = result;
            }, function(tx){
                console.log('error', tx);
            })
            promesas.push(prom);
        

            consulta = 'SELECT c.*, c.rowid, t.nombres, t.apellidos, tx.numero from carreras c ' + 
                    'INNER JOIN taxistas t ON c.taxista_id = t.rowid ' + 
                    'INNER JOIN taxis tx ON c.taxi_id = tx.rowid WHERE c.eliminado = "1" or c.modificado="1" or c.id is null ' +
                    'order by c.rowid desc' ;
            prom = ConexionServ.query(consulta, []);
            prom.then(function(result){
                datos.carreras = result;
                console.log(datos.carreras);
            }, function(tx){
                console.log('error', tx);
            });
            promesas.push(prom);

        

            consulta = 'SELECT *, rowid from taxistas where eliminado ="1" or modificado="1" or id is null '
            prom = ConexionServ.query(consulta, []);
            prom.then(function(result){
                datos.taxistas = result;
            }, function(tx){
                console.log('error', tx);
            });
            promesas.push(prom);


            consulta = 'SELECT t.*, t.rowid, c.nombres, c.apellidos 	from taxis t INNER JOIN taxistas c ON t.taxista_id = c.rowid where t.eliminado ="1" or t.modificado="1" or t.id is null'
            prom = ConexionServ.query(consulta, []);
            prom.then(function(result){
                datos.taxis = result;
            }, function(tx){
                console.log('error', tx);
            });
            promesas.push(prom);

            
            Promise.all(promesas).then(function(){
                defered.resolve(datos);
            })
  
            return defered.promise;
        
        },
          
        sincronizarCambios: function(cambiosLocales){
            var defered = $q.defer();
            
            
            $http.put(rutaServidor.ruta + 'taxis/subir-datos', datos).then(function(r){

                consulta = 'DELETE FROM taxis Where id is null'
                prom = ConexionServ.query(consulta, []).then(function(result){
                    console.log('se elimino el taxi en la compu', result);
                }, function(tx){
                    console.log('error', tx);
                });
                consulta = 'DELETE FROM users Where id is null'
                prom = ConexionServ.query(consulta, []).then(function(result){
                    console.log('se elimino el usuario', result);
                }, function(tx){
                    console.log('error', tx);
                });
                consulta = 'DELETE FROM taxistas Where id is null'
                prom = ConexionServ.query(consulta, []).then(function(result){
                    console.log('se elimino el taxista en la compu', result);
                }, function(tx){
                    console.log('error', tx);
                });

                consulta = 'DELETE FROM carreras Where id is null'
                prom = ConexionServ.query(consulta, []).then(function(result){
                    console.log('se elimino el carrera en la compu', result);
                }, function(tx){
                    console.log('error', tx);
                });

                consulta = 'UPDATE taxistas SET eliminado ="0", modificado="0"'
                prom = ConexionServ.query(consulta, []).then(function(result){
                    console.log('se elimino el taxistas en la nube', result);
                }, function(tx){
                    console.log('error', tx);
                });
                consulta = 'UPDATE taxis SET eliminado ="0", modificado="0"'
                prom = ConexionServ.query(consulta, []).then(function(result){
                    console.log('se elimino el SET en la nube', result);
                }, function(tx){
                    console.log('error', tx);
                });
                consulta = 'UPDATE carreras SET eliminado ="0", modificado="0"'
                prom = ConexionServ.query(consulta, []).then(function(result){
                    console.log('se elimino el carreras en la nube', result);
                }, function(tx){
                    console.log('error', tx);
                });
                consulta = 'UPDATE users SET eliminado ="0", modificado="0"'
                prom = ConexionServ.query(consulta, []).then(function(result){
                    console.log('se eliminó el users en la nube', result);
                }, function(tx){
                    console.log('error', tx);
                });

                promesas = [];
                taxis = r.data.taxis;
                for (var i = 0; i < taxis.length; i++) {
                    taxi = taxis[i];
                    
                    consulta = 'INSERT INTO taxis ( id, rowid, modelo, numero, placa, taxista_id, propietario, soat, seguro) VALUES( ?, ?, ?, ?, ?, ?, ?, ?, ?)'
                    prom = ConexionServ.query(consulta, [taxi.id, taxi.id, taxi.modelo, taxi.numero, taxi.placa, taxi.taxista_id, taxi.propietario, taxi.soat, taxi.seguro]).then(function(result){
                        console.log('se insertó taxis', result);
                    }, function(tx){
                        console.log('error', tx);
                    });
                    promesas.push(prom);
                } 

                taxistas = r.data.taxistas;

                for (var i = 0; i < taxistas.length; i++) {

                    taxista =  taxistas[i];
                    consulta = 'INSERT INTO taxistas (id, rowid, nombres, apellidos, sexo, documento, celular, usuario, password, fecha_nac) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
                    prom = ConexionServ.query(consulta, [taxista.id, taxista.id, taxista.nombres, taxista.apellidos, taxista.sexo, taxista.documento, taxista.celular, taxista.usuario, taxista.password, taxista.fecha_nac]).then(function(result){
                        console.log('se cargo el taxista', result);
                    }, function(tx){
                        console.log('error', tx);
                    });
                    promesas.push(prom);
                } 

                carreras = r.data.carreras;

                for (var i = 0; i < carreras.length; i++) {
                        
                    carrera =  carreras[i];
                
                    consulta = 'INSERT INTO carreras (id, rowid, taxi_id, taxista_id, zona, fecha_ini, lugar_inicio, cell_llamado, lugar_fin, fecha_fin, estado, registrada_por) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
                    prom = ConexionServ.query(consulta, [carrera.id, carrera.id, carrera.taxi_id, carrera.taxista_id, carrera.zona, carrera.fecha_ini, carrera.cell_llamado, carrera.lugar_ini, carrera.lugar_fin, carrera.fecha_fin, carrera.estado, carrera.registrada_por]).then(function(result){
                        console.log('se guardo la carrera', result);
                    }, function(tx){
                        console.log('error', tx);
                    });
                    promesas.push(prom);
                }
                
                /*
                usuarios = r.data.usuarios;
                for (var i = 0; i < usuarios.length; i++) {

                    consulta = 'INSERT INTO users (id, rowid, nombres, apellidos, sexo, fecha_nac, celular, documento,  tipo, usuario, password) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
                    ConexionServ.query(consulta, [usuarios[i].id, usuarios[i].id, usuarios[i].nombres, usuarios[i].apellidos, usuarios[i].sexo, usuarios[i].fecha_nac, usuarios[i].celular, usuarios[i].documento, usuarios[i].tipo, usuarios[i].usuario, usuarios[i].password]).then(function(result){
                        console.log('se guardo la carrera papi', result);

                        toastr.success('Datos Subidos')

                    }, function(tx){
                        console.log('error', tx);
                    });
                } 
        
                */
               
                Promise.all(promesas).then(function(){
                    defered.resolve(datos);
                })
    
            
            }, function(error){
                console.log('error db', error)
            });
            
            return defered.promise;
        } 
    }
    
    
    return result;

});