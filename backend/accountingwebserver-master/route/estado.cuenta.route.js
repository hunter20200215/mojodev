const  createApiResponse  = require('./../Util/createApiResponse');
const pool = require('../connection/connect');
var express = require('express');
var router = express.Router();
var lib = require('./combo.lib');
var SqlString = require('sqlstring');
var _ = require('lodash');
// middleware that is specific to this router

// define the home page route
router.post('/accounting/obtenerDetalleCuentaAfiliado',async (req, res, next) => {
	
	 
  let body  = req.body;
  let error;
   
  let periodo = body.filtroObject.periodo;


  let periodoInicial = periodo.fechaInicio ? periodo.fechaInicio : ''
  let periodoFinal = periodo.fechaFin ? periodo.fechaFin : ''
    let afiliadoId = null;
  let principalId = req.cognito['cognito:username'];
  /* let principalId = 'procom';
   let profileUser= ["AFILIADO"];*/
    let profileUser= req.cognito['cognito:groups'];

   

try{
  let esAdmin = _.includes(profileUser, 'ADMIN');

  let sql = SqlString.format(`SELECT sum(ia.montoAfiliado) sumIngresos FROM ingreso ing `+
     `inner join ingreso_afiliado ia on ing.id = ia.idIngreso`);



  if (!esAdmin){
    sql = SqlString.format(sql +
      ` inner join users u on u.idAfiliado = ia.idAfiliado WHERE u.nombreUsuario = '` + principalId + `'`);
  }

  if (periodo){
    sql = SqlString.format(sql +
      ` and ing.periodo between  DATE_FORMAT('`+ periodoInicial +`','%Y-%m-01') AND LAST_DAY('`+ periodoFinal +`')`);          
  } 

  sql = SqlString.format(sql + `and  ing.conversionDolar = 0 `);
    

  let ingresos = await pool.promise().query(sql)
    .then(([rows,fields]) =>{
        return rows[0].sumIngresos;
    }).catch(function(err) {
        console.error(err);
        throw "No se pudo obtener los ingresos del afiliado" ;
    })



   
  let sql2 = SqlString.format(` SELECT descripcion , monto , DATE_FORMAT(fecha ,'%Y-%m') periodo FROM Egresos_afiliados eg `+
     `inner join users u on u.idAfiliado = eg.idAfiliado `);

  if (!esAdmin){
    sql2 = SqlString.format(sql2 +
      ` WHERE u.nombreUsuario = \'` + principalId + `\'`);
  }

  if (periodo){
    sql2 = SqlString.format(sql2 +
      ` and eg.fecha between  DATE_FORMAT('`+ periodoInicial +`','%Y-%m-01') AND LAST_DAY('`+ periodoFinal +`')`);     
   
  }

  let pagos = await pool.promise().query(sql2)
    .then(([rows,fields]) =>{
          return rows;
    }).catch(function(err) {
        console.error(err);
        throw "No se pudieron obtener los egresos del afiliado" ;
    })


    let sql3 = SqlString.format(` select af.descripcion ,   DATE_FORMAT( adf.periodo  ,'%Y-%m') periodo, adf.monto  from anticipos_detalle_afiliado adf `+
              `  inner join anticipos_afiliado af on adf.idAnticipo = af.idanticipo `+
               ` inner join users u on u.idAfiliado = af.idAfiliado `);

  if (!esAdmin){
    sql3 = SqlString.format(sql3 +
      ` WHERE u.nombreUsuario = \'` + principalId +`\'`);
  }

  if (periodo){
    sql3 = SqlString.format(sql3 +
      ` and adf.periodo between  DATE_FORMAT('`+ periodoInicial +`','%Y-%m-01') AND LAST_DAY('`+ periodoFinal +`')`);     
  }


    let descuentoAnticipos =  await pool.promise().query(sql3)
    .then(([rows,fields]) =>{
          return rows;
    }).catch(function(err) {
        console.error(err);
        throw "No se pudieron obtener los anticipos del afiliado" ;
    })

  
  

    let results = {
      anticipos :  descuentoAnticipos,
      ingresos : ingresos,
      pagos : pagos
    };
  
  
    




    res.json(createApiResponse(200, error, results));


    
	
	  } catch (e) {
        //this will eventually be handled by your error handling middleware

      res.json(createApiResponse(400, e, {}));
      }
	
	
	
	
	
});


module.exports = router;