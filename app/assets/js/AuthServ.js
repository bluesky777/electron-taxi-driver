angular.module('TaxisFast')

.factory('AuthServ', function($q, $http, $timeout, ConexionServ, $state, toastr, rutaServidor) {



    function loguear_online(datos){
        toastr.info('Entrando online...');
        return $http.post(rutaServidor.ruta + 'taxis/loguear', datos);
    }
            
                
    result = {
          
        verificar_user_logueado: function(){
            var defered = $q.defer();
            
            if (localStorage.logueado){

                if (localStorage.logueado == 'true'){
                    
                    usu = localStorage.USER;
                    usu = JSON.parse(usu);
                    defered.resolve(usu);
                    
                }else{
                    $state.go('login');
                    defered.reject('No logueado');
                }
            }else{
                defered.reject('No logueado')
            }
            
  
            return defered.promise;
        
        },
          
        loguear: function(datos){
            var defered = $q.defer();
            
            
            ConexionServ.query('SELECT * FROM users', []).then(function(result){
    
                if (result.length > 0) {
                    // LOGUEAMOS EN LA DB LOCAL OFFLINE
                    
                    consulta = 'SELECT u.rowid, u.id, u.nombres, u.apellidos, u.usuario, u.sexo, u.celular, u.documento, u.tipo, u.email, u.fecha_nac '+
                        'FROM users u '+
                        'WHERE  u.usuario=? and u.password=? ' ;

                    ConexionServ.query(consulta, [datos.username, datos.password]).then(function(result){
                        
                        if (result.length > 0) {
                            localStorage.logueado   = true
                            localStorage.USER       = JSON.stringify(result[0]);
                            defered.resolve(result[0]);
                        }else{
                            loguear_online(datos).then(function(usu){
                                usu                     = usu.data[0];
                                localStorage.logueado   = true
                                localStorage.USER       = JSON.stringify(usu);
                                
                                ConexionServ.query('DELETE FROM users').then(function(){
                                    consulta = 'INSERT INTO users(rowid, id, nombres, apellidos, sexo, usuario, password, email, fecha_nac, tipo, celular) VALUES(?,?,?,?,?,?,?,?,?,?,?)';
                                    ConexionServ.query(consulta, [usu.id, usu.id, usu.nombres, usu.apellidos, usu.sexo, usu.usuario, usu.password, usu.email, usu.fecha_nac, usu.tipo, usu.celular]).then(function(result){
                                        defered.resolve(usu);
                                    }, function(){
                                        console.log('Error logueando');
                                        defered.reject('Error logueando')
                                    })
                                })
                                
                            }, function(){
                                defered.reject('DATOS INVÁLIDOS')
                            });
                        }
                        
                    }, function(){
                        console.log('Error logueando');
                        defered.reject('Error logueando')
                    })
                    
                }else{
                    // LLAMAMOS A INTERNET PARA LOGUEAR, YA QUE NO HAY DATOS LOCALES
                    loguear_online(datos).then(function(usu){
                        usu                     = usu.data[0];
                        usu.rowid               = usu.id;
                        localStorage.logueado   = true
                        localStorage.USER       = JSON.stringify(usu); 
                            
                        consulta = 'INSERT INTO users(rowid, id, nombres, apellidos, sexo, usuario, password, email, fecha_nac, tipo, celular) VALUES(?,?,?,?,?,?,?,?,?,?,?)';
                        ConexionServ.query(consulta, [usu.id, usu.id, usu.nombres, usu.apellidos, usu.sexo, usu.usuario, usu.password, usu.email, usu.fecha_nac, usu.tipo, usu.celular]).then(function(result){
                            defered.resolve({to_sync: true});
                        }, function(){
                            console.log('Error logueando');
                            defered.reject('Error logueando')
                        })
                        
                    });
                    
                }
                
            }, function(){
                console.log('Error logueando');
                defered.reject('Error logueando')
            })
  
            return defered.promise;
        
        },
        
        get_user: function(){
            
            if (localStorage.logueado){
                if (localStorage.logueado == 'true'){
                    
                    usu = localStorage.USER;
                    usu = JSON.parse(usu);
                    return usu;
                }else{
                    $state.go('login');
                }
            }else{
                $state.go('login');
            }
            
        
        },
        
        update_user_storage: function(datos){
            var defered = $q.defer();


            consulta = 'SELECT u.rowid, u.id, u.nombres, u.apellidos, u.usuario, u.sexo, u.celular, u.documento, u.tipo, u.fecha_nac '+
                        'FROM users u '+
                        'WHERE  u.rowid=? ' ;
            
            
            ConexionServ.query(consulta, [datos.rowid]).then(function(result){

                if (result.length > 0) {
                    localStorage.logueado   = true
                    localStorage.USER       = JSON.stringify(result[0]);
                    defered.resolve(result[0]);
                }else{
                    console.log('Cero usuarios');
                    defered.reject('Cero usuarios')
                }
                
            }, function(){
                console.log('Error logueando');
                defered.reject('Error logueando')
            })
            
            return defered.promise;
            
        },
        
        cerrar_sesion: function(datos){
            localStorage.logueado   = false
            delete localStorage.USER;
            $state.go('login');
        },
          
    }
    
    
    return result;

});