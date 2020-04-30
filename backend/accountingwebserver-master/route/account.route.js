
const  createApiResponse  = require('./../Util/createApiResponse');
var express = require('express');
var router = express.Router();
var lib = require('./account.lib');


// define the home page route
router.post('/accounting/obtenerDetalle',async  (req, res, next) => {

  
    let vista = req.query.vista;
    let pagina = req.query.pagina ? parseInt(req.query.pagina) : 1;
    let cantidad = req.query.cantidad ? parseInt(req.query.cantidad) : 10;
    let busqueda = req.query.busqueda;
   

    let filtroObject = req.body['filtroObject'];

    let periodo = filtroObject['periodo'];

    let filtro = filtroObject['filtro'];

    let afiliadoId = null;


    let principalId = req.cognito['cognito:username'];

 

    let profileUser= req.cognito['cognito:groups'];   


    
    let error;

        try {
          
          let  results;

          
          
          if (vista === 'sello') {

            results = await lib.searchSello(filtro, principalId, profileUser, periodo, filtro, pagina, cantidad,busqueda);
      
          } else if (vista == 'album') {
      
            results = await lib.groupAlbum(filtro, principalId, profileUser, periodo, filtro, pagina, cantidad,busqueda);
      
          } else if (vista == 'artista') {
            
      
            results = await lib.groupArtista(filtro, principalId, profileUser, periodo, filtro, pagina, cantidad,busqueda);
            
      
          } else if (vista == 'track') {
      
            results = await lib.groupTrack(filtro, principalId, profileUser, periodo, filtro, pagina, cantidad,busqueda,busqueda);
            //  results = await findTracks(searchValue, principalId, profileUser, filtro);
      
          } else if (vista == 'servicio') {
      
            results = await lib.groupCanal(filtro, principalId, profileUser, periodo, filtro, pagina, cantidad,busqueda);
      
          } else if (vista == 'pais') {
            results = await lib.groupPais(filtro, principalId, profileUser, periodo, filtro, pagina, cantidad,busqueda);
          } else {
            results = {};
          }
        
        
        
        
        
        
        
        
        
        
          res.json(createApiResponse(200, error, results));
          } catch (e) {
            //this will eventually be handled by your error handling middleware
          res.json(createApiResponse(400, e, {}));
        
          }

   
 


 
});


module.exports = router;