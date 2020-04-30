const  createApiResponse  = require('./../Util/createApiResponse');
const pool = require('../connection/connect');
var express = require('express');
var router = express.Router();
var lib = require('./combo.lib');
var SqlString = require('sqlstring');
var _ = require('lodash');
var moment = require('moment');
router.get('/accounting/filterFecha',async (req, res, next) => {

 // context.callbackWaitsForEmptyEventLoop = false;


    let principalId = req.cognito['cognito:username'];
  
 // let principalId = 'procom';
  
 

     let profileUser= req.cognito['cognito:groups'];
   //let profileUser= ["ADMIN"];

   
try{

  
  let esAdmin = _.includes(profileUser, 'ADMIN');


  let sql =SqlString.format( " select min(date_format(periodo, '%Y-%m')) fechaDesde , max(date_format(periodo, '%Y-%m')) fechaHasta  from ingreso " );
  

  sql = SqlString.format(sql + ` where conversionDolar = 0 `);

  if (!esAdmin) {
    sql = SqlString.format(sql + ' and id in   (SELECT idIngreso FROM mojodev.ingreso_afiliado where idAfiliado = (select idAfiliado from users where nombreUsuario = \'' + principalId + '\' limit 1))');
  }/*else{
    sql = SqlString.format(sql + ' (SELECT idIngreso FROM mojodev.ingreso_afiliado ) ');
  }*/

  let error=[];

 let results = await pool.promise().query(sql)
    .then(([rows,fields]) => {
      return JSON.parse(JSON.stringify(rows));
    }).catch(          
      function (err) {  
            error.push('error');
    })


  if(error.length>0){
	 throw 'No se pudo realizar la consulta';
  }
  //await connection.end();
 

//esto es para afiliados que ven trimestres
  if (principalId != 'procom' && principalId != 'victorschlesingerramirez'  && principalId != 'adrianserantoni' ){   

    var ultimaFecha = moment(results[0].fechaHasta);//.format('YYYY-MM');

    var mes = ultimaFecha.format('M');

     if(mes != 3 && mes != 6 && mes != 9 && mes != 12){
       
          if (mes < 3){
            ultimaFecha.subtract(mes, 'months');
          }else if (mes < 6 ){
            ultimaFecha.subtract(mes-3, 'months');
          }else if (mes < 9 ){
            ultimaFecha.subtract(mes-6, 'months');
          }else if (mes <= 12 ){
            ultimaFecha.subtract(mes-9, 'months');
          }
     
     }


   // Descomentar para 15 marzo
    
     results[0].fechaHasta = ultimaFecha.format('YYYY-M');

   results[0].fechaDesde = '2019-07';
  }else {
  
       if (principalId === 'victorschlesingerramirez'){    
            results[0].fechaDesde = '2019-03';

       }else {
        results[0].fechaDesde = '2019-07';

       }
  }





  res.json(createApiResponse(200, error, results));


  }  catch (e) {
    console.log(e);
        res.json(createApiResponse(400, e, {}));
       //next(e);
      }
  
});


module.exports =router;


