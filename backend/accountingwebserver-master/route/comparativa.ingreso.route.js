const  createApiResponse  = require('./../Util/createApiResponse');
const pool = require('../connection/connect');
const mysql = require('../connection/connect');
var express = require('express');
var router = express.Router();
var lib = require('./combo.lib');
var SqlString = require('sqlstring');
var _ = require('lodash');
// middleware that is specific to this router

// define the home page route
router.post('/accounting/comparativaIngreso',async (req, res, next) => {








try{

let body = req.body;

  
  let filtroObject = body['filtroObject'] ;
  let periodo = filtroObject['periodo'] ;
  let filtro = filtroObject['filtro'] ;
  let search = req.query.tipo;
    let afiliadoId = null;
    let principalId = req.cognito['cognito:username'];

 

    let profileUser= req.cognito['cognito:groups'];
   

  let esAdmin = _.includes(profileUser, 'ADMIN');


  let sql =SqlString.format( " select  date_format(ing.periodo, '%Y-%m') periodo, sum(ia.montoAfiliado) monto, ");

  //Se arma filtro en base a la busqueda requerida (pais or tienda)


  if(search == 'pais'){
    sql = SqlString.format(sql + " p.nombre from ingreso ing inner join ingreso_afiliado ia on ing.id = ia.idIngreso  left join paises p on pais = p.id  ");
  }else{
    sql = SqlString.format(sql + "  nombre  from ingreso ing inner join ingreso_afiliado ia on ing.id = ia.idIngreso left join canales can on idCanal = can.id ");
  }


  let track =  _.find(filtro, {
    tipo: 'track'
  });
  let sello =  _.find(filtro, {
    tipo: 'sello'
  });
  let album =  _.find(filtro, {
    tipo: 'album'
  });
  let artista =  _.find(filtro, {
    tipo: 'artista'
  });
  let pais =  _.find(filtro, {
    tipo: 'pais'
  });
  let tienda =  _.find(filtro, {
    tipo: 'tienda'
  });
  

  if (artista) {
    
    if(sello){
      /*periodo entre fechas*/ 
      //sql = SqlString.format(sql + " inner join albums al on al.artistaPrincipalId = " +  artista.valor + " and al.id =  ing.idAlbum and al.label = " + label.valor + " where DATE_FORMAT(ing.periodo,'%Y-%m') BETWEEN '" + periodo.fechaInicio + "' AND '" + periodo.fechaFin + "'");  
      sql = SqlString.format(sql + " inner join albums al on al.artistaPrincipalId = " +  artista.valor.value + " and al.id =  ing.idAlbum and al.label = " + sello.valor + " where periodo >= date_sub(curdate(), interval 12 month) ");
      
    }
    /*periodo entre fechas*/
    //sql = SqlString.format(sql + " inner join albums al on al.artistaPrincipalId = " +  artista.valor + " and al.id =  ing.idAlbum  where DATE_FORMAT(ing.periodo,'%Y-%m') BETWEEN '" + periodo.fechaInicio + "' AND '" + periodo.fechaFin + "'" ); 
    sql = SqlString.format(sql + " inner join albums al on al.artistaPrincipalId = " +  artista.valor.value + " and al.id =  ing.idAlbum  where  periodo >= date_sub(curdate(), interval 12 month) " );

  }else if (sello){
     /*periodo entre fechas*/
    //sql = SqlString.format(sql + " inner join albums al on al.label = " + sello.valor + " where DATE_FORMAT(ing.periodo,'%Y-%m') BETWEEN '" + periodo.fechaInicio + "' AND '" + periodo.fechaFin + "'");
    sql = SqlString.format(sql + " inner join albums al on al.label = " + sello.valor.value + " where periodo >= date_sub(curdate(), interval 12 month) ");

  }else{

    /*periodo entre fechas*/
    //sql = SqlString.format(sql + " where DATE_FORMAT(ing.periodo, '%Y-%m') BETWEEN'"  + periodo.fechaInicio + "'  AND  '" + periodo.fechaFin  + "'");
    sql = SqlString.format(sql + " where periodo >= date_sub(curdate(), interval 12 month) ");

  }

  if (track) {

    sql = SqlString.format(sql + " and idTrack = " + track.valor.value);
  }

  if (album) {

    sql =SqlString.format( sql + " and idAlbum = " + album.valor.value);
  }

  if(pais){
    
    sql = SqlString.format(sql + " and pais = " + pais.valor.value);
  }

  if(tienda){
    
    sql = SqlString.format(sql + " and idCanal = " + tienda.valor.value);
  }

  if(!esAdmin){

    sql = SqlString.format(sql + ' and ia.idAfiliado in (select idAfiliado from users where nombreUsuario = \'' + principalId + '\')');

  }


  sql = SqlString.format(sql + `and  conversionDolar = 0 `);


  if(search == 'pais'){
    sql = SqlString.format(sql + " and pais is not null and  pais In (73,13,52,46,75,29,146,229) and idCanal != 81  group by periodo, pais ");
  }else{
    sql = SqlString.format(sql + " and idCanal in ( 7 , 4 )  group by periodo, idCanal ");
  }

  //console.log(sql);
  /*console.log(artista.valor);*/
 


  let error;
  
  let results = await pool.promise().query(sql)
    .then(([rows,fields]) =>  {
      return JSON.parse(JSON.stringify(rows));
    }).catch(function (err) {
      if (err instanceof TypeError) {     
        error = err.message;
          } else {
            console.error(err);
        error = "No hay datos para el filtro seleccionado";
      }

     
    })




    //await mysql.quit();


  
 



  let coleccionordenada = _.orderBy(results, ['nombre'],['asc']); 
  let periodos =_.uniq( _.map(coleccionordenada, 'periodo')).sort();
  let dataGraficos = [];




  coleccionordenada.forEach(function(element) {   

    var objEditado ={ label: '' ,data:[]};
    objEditado.data= Array(periodos.length).fill(0) ;

    var index = _.findIndex(dataGraficos, {label: element.nombre});

    if (index !== -1 ){
       objEditado =  _.find(dataGraficos, {
        label: element.nombre
      });
    
    }
    
      objEditado.label = element.nombre;
      objEditado.data[periodos.indexOf(element.periodo)] = element.monto == null ? 0 : element.monto; 
     
    if (index !== -1 ){        
      _.replace(dataGraficos, { label: objEditado.label }, objEditado);
    }else {
      dataGraficos.push(objEditado);
    }



     
     


  });

  let retornoGrafica = {
    datosChart: dataGraficos,
    periodo : periodos

}

res.json(createApiResponse(200, error, retornoGrafica));
 
	  } catch (e) {
        //this will eventually be handled by your error handling middleware
      console.log(e);
     res.json(createApiResponse(400, e, {}));
      }
	
	
	
	
	
});


module.exports = router;