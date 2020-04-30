const  createApiResponse  = require('./../Util/createApiResponse');
const mysql = require('../connection/connect');
var express = require('express');
var router = express.Router();
var lib = require('./combo.lib');
// middleware that is specific to this router

// define the home page route
router.post('/accounting/comboFilter',async (req, res, next) => {

  //context.callbackWaitsForEmptyEventLoop = false;
  let error;
  let results;
  

  let comboValue = req.query.comboValue;
  let searchValue = req.query.search;


  let body = req.body;


    let filtroObject = body['filtroObject'] ;


  let filtro = filtroObject['filtro'] ;
  let principalId = req.cognito['cognito:username'];

 

  let profileUser= req.cognito['cognito:groups'];
 


try {

    if (comboValue === 'sello') {
      results = await lib.findSello(searchValue, principalId);

    } else if (comboValue == 'album') {

      results = await lib.findAlbum(searchValue, principalId, profileUser, filtro);

    } else if (comboValue == 'artista') {

      results = await lib.findArtista(searchValue, principalId, profileUser, filtro);

    } else if (comboValue == 'track') {

      results = await lib.findTracks(searchValue, principalId, profileUser, filtro);

    } else if (comboValue == 'servicio') {

      results = await lib.findServicio(searchValue, principalId);

    } else if (comboValue == 'pais') {
      results = await lib.findPais(searchValue, principalId);
    } else {
      results = [];
    }
    res.json(createApiResponse(200, error, results));
  }  catch (e) {

    console.log(e);
res.json(JSON.stringify(createApiResponse(400, e, {})));

       //next(e);
      }
  
  

});


module.exports = router;