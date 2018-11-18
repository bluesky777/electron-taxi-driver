angular.module('TaxisFast')

.factory('ConexionServ', function($q, $http, $timeout) {

  var db;


  db = window.openDatabase("TaxiD.db", '1', 'Taxi Driver', 1024 * 1024 * 49);

  sqlusers = "CREATE TABLE IF NOT EXISTS users (id integer," +
                "nombres varchar(100)  NOT NULL collate nocase," +
                "apellidos varchar(100)  DEFAULT NULL collate nocase," +
                "sexo varchar(1)  NOT NULL," +
                "fecha_nac date DEFAULT NULL," +
                "celular varchar(20) DEFAULT NULL," +
                "documento varchar(100)  NULL collate nocase,"+
                "tipo varchar(100)  NOT NULL collate nocase," + 
                "usuario varchar(100)  NOT NULL collate nocase,"+
                "password varchar(100)  NOT NULL collate nocase,"+
                "modificado integer DEFAULT 0,"+
                "eliminado integer  DEFAULT 0)";

  sqltaxistas = "CREATE TABLE IF NOT EXISTS taxistas (id integer," +
                "nombres varchar(100)  NOT NULL collate nocase," +
                "apellidos varchar(100)  DEFAULT NULL collate nocase," +
                "sexo varchar(1)  NOT NULL," +
               
                "celular varchar(20) DEFAULT NULL," +
                "fecha_nac date DEFAULT NULL," +
                "documento varchar(100)  NULL collate nocase,"+
                "usuario varchar(100)  NOT NULL collate nocase,"+
                "password varchar(100)  NULL collate nocase,"+
                  "modificado integer DEFAULT 0,"+
                "eliminado integer  DEFAULT 0)";


  sqltaxis = "CREATE TABLE IF NOT EXISTS taxis (id integer," +
                "modelo varchar(100)  DEFAULT NULL collate nocase," +
                "numero varchar(100)  NOT NULL collate nocase," +
                "placa varchar(100)  DEFAULT NULL collate nocase," +
                "taxista_id integer  DEFAULT NULL," +
                "propietario varchar(100)  DEFAULT NULL collate nocase," +
                "Soat varchar(100)  DEFAULT NULL collate nocase," +
                "Seguro varchar(100)  DEFAULT NULL collate nocase,"+
                   "modificado integer DEFAULT 0,"+
                "eliminado integer  DEFAULT 0)";

  sqlcarreras = "CREATE TABLE IF NOT EXISTS carreras (id integer," +
                "taxi_id integer  DEFAULT NULL,"+
                "taxista_id integer  DEFAULT NULL," +
                "zona varchar(100)  NOT NULL collate nocase,"+
                "fecha_ini date DEFAULT NULL," +
                "lugar_inicio varchar(100) DEFAULT NULL,"+
                 "lugar_fin varchar(100) DEFAULT NULL,"+
                "fecha_fin date DEFAULT NULL," +
                "estado varchar(100) NOT NULL collate nocase,"+
                "registrada_por integer(100) DEFAULT NULL collate nocase,"+
                 "modificado varchar(100)  DEFAULT 0,"+
                "eliminado integer  DEFAULT 0)";
              
    result = {
          
        createTables: function(){
            var defered = $q.defer();
            
            db.transaction(function (tx) {
            
                tx.executeSql(sqlusers, [], function (tx, result) {
                    console.log('Hasta tabla users creada');
                    defered.resolve('Hasta tabla users creada');
                }, function(tx,error){
                    console.log("Tabla users NO se pudo crear", error.message);
                })
            
                tx.executeSql(sqltaxis, [], function (tx, result) {
                    console.log('tabla taxis creada');
                    defered.resolve('tabla taxis creada');
                }, function(tx,error){
                    console.log("Tabla taxis NO se pudo crear", error.message);
                })
                  tx.executeSql(sqlcarreras, [], function (tx, result) {
                    console.log('tabla carreras creada');
                    defered.resolve('tabla carreras creada');
                }, function(tx,error){
                    console.log("Tabla carreras NO se pudo crear", error.message);
                })

                  tx.executeSql(sqltaxistas, [], function (tx, result) {
                    console.log('tabla taxistas creada');
                    defered.resolve('tabla taxistas creada');
                }, function(tx,error){
                    console.log("Tabla taxistas NO se pudo crear", error.message);
                })
            });
  
        return defered.promise;
        
        },
        query: function(sql, datos, datos_callback){ // datos_callback para los alumnos en for, porque el i cambia
            var defered = $q.defer();
      
            if(typeof datos === "undefined") {
              datos = [];
            }
      
            db.transaction(function (tx) {
              tx.executeSql(sql, datos, function (tx, result) {
                var items = [];
                for (i = 0, l = result.rows.length; i < l; i++) {
                  items.push(result.rows.item(i));
                }
                if (datos_callback) {
                  defered.resolve({items: items, callback: datos_callback});
                }else{
                  defered.resolve(items);
                }
      
                
      
              }, function(tx,error){
                console.log(error.message, sql, datos);
                defered.reject(error.message, datos_callback)
              }) // db.executeSql
            }); // db.transaction
            return defered.promise;
          },
    }
    
    
    return result;

});