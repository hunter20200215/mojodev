let lib = {};
const pool = require('../connection/connect');
lib._ = require('lodash');
lib.SqlString = require('sqlstring');


lib.findSello = async function (value, user) {

  let sql = this.SqlString.format(`SELECT distinct(label) as value , label as descripcion FROM albums  where label  LIKE \'%${value}%\'`);


  console.log(sql);
  let error;
  let results = await  pool.promise().query(sql)
    .then(([rows,fields]) =>{
      return rows;
    }).catch(function (err) {
      console.error(err);
      throw "No se puedo obtener los sellos";
    })

 

  return results;

}


lib.findServicio = async function (value, user) {


  let sql = this.SqlString.format('SELECT id as value , nombre as descripcion FROM canales  WHERE nombre  LIKE \'%' + value + '%\'');

//  console.log(sql);
  let error;
  let results = await  pool.promise().query(sql)
    .then(([rows,fields]) => {
      return rows;
    }).catch(function (err) {
      console.error(err);
      throw "No se puedo obtener los sellos";
    })

 

  return results;

}


lib.findPais = async function (value, user) {
  let sql = this.SqlString.format('SELECT id as value ,  nombre as descripcion FROM paises  WHERE nombre  LIKE \'%' + value + '%\'');
//  console.log(sql);
  let error;
  let results = await  pool.promise().query(sql)
    .then(([rows,fields]) => {

      return rows;
    }).catch(function (err) {
      console.error(err);
      throw "No se puedo obtener los sellos";
    })

 

  return results;

}


lib.findAlbum = async function (value, user, userProfile, filterObject) {


  let artista = this._.find(filterObject, {
    tipo: 'artista'
  });



  let esAdmin = this._.includes(userProfile, 'ADMIN');

  let sql = ` SELECT albums.id as value ,   albums.titulo as descripcion FROM albums `;
//  console.log(sql);
  if (!esAdmin) {
    sql = sql + ' inner join  distribucionAlbum dist on albums.id = dist.idAlbum ';
  }
  
  sql = this.SqlString.format(sql + ' where albums.titulo  LIKE \'%' + value + '%\'');
//  console.log(sql);
  if (!esAdmin) {

    sql = this.SqlString.format(sql + ' and dist.idAfiliado in (select idAfiliado from users where nombreUsuario = \'' + user + '\')');

  }

//  console.log(sql);
  if (artista){
    sql = this.SqlString.format(sql + ' and albums.artistaPrincipalId=' + artista.valor.value);

  }
  sql = sql + ' group by albums.id  ';
   

  sql = sql + ' limit 10  ';






  let error;
  let results = await  pool.promise().query(sql)
    .then(([rows,fields]) => {
      return rows;
    }).catch(function (err) {
      console.error(err);
      throw "No se puedo obtener los albums";
    })

 

  return results;

}


lib.findArtista = async function (value, user, userProfile, filterObject) {

  let album = this._.find(filterObject, {
    tipo: 'album'
  });


  let esAdmin = this._.includes(userProfile, 'ADMIN');

  let sql = ` SELECT artistas.id as value ,   artistas.nombres as descripcion FROM artistas `;

  if (!esAdmin) {
    sql = sql + ' inner join  artistaxafiliados  on artistas.id = artistaxafiliados.artistasId ';
  }
 // console.log(sql);
  if(album){
    sql = sql + ' inner join  albums  on artistas.id = albums.artistaPrincipalId ';
  }

  sql = this.SqlString.format(sql + ' where artistas.nombres  LIKE \'%' + value + '%\'');

  if (!esAdmin) {

    sql = this.SqlString.format(sql + ' and artistaxafiliados.afiliadoId in (select idAfiliado from users where nombreUsuario = \'' + user + '\')');

  }
// console.log(sql);

  if(album){
    sql = this.SqlString.format(sql + ' and albums.id =' + album.valor.value );    
  }




  sql = sql + ' limit 10 ';


console.log(sql);


  let error;
  let results = await  pool.promise().query(sql)
    .then(([rows,fields]) => {
      return rows;
    }).catch(function (err) {
      console.error(err);
      throw "No se puedo obtener los albums";
    })

 

  return results;

}

lib.findTracks = async function (value, user, userProfile, filterObject) {

  console.log(filterObject);

  let album = this._.find(filterObject, {
    tipo: 'album'
  });


  let artista = this._.find(filterObject, {
    tipo: 'artista'
  });


  

  let esAdmin = this._.includes(userProfile, 'ADMIN');

  let sql = ` SELECT track.id as value ,   track.nombre as descripcion FROM track  `;
  sql = sql + '  inner join  trackxAlbum tpalbum on track.id = tpalbum.idTrack   ';


  if (artista) {
    sql = this.SqlString.format(sql + ' inner join trackxartista tpartista on tpartista.idTrack = track.id');
  }

  if (!esAdmin) {
    sql = sql + ' inner join  distribucionAlbum dist on tpalbum.idAlbums = dist.idAlbum ';
  }

  sql = this.SqlString.format(sql + ' where track.nombre  LIKE \'%' + value + '%\'');

  if (!esAdmin) {
    sql = this.SqlString.format(sql + ' and dist.idAfiliado in (select idAfiliado from users where nombreUsuario = \'' + user + '\')');

  }

  if (album) {
    sql = this.SqlString.format(sql + ' and tpalbum.idAlbums = ' + album.valor.value);
  }


  if (artista) {
    sql = this.SqlString.format(sql + ' and tpartista.idArtista=' + artista.valor.value);
  }



  sql = sql + ' limit 10  ';


 
  let error;
  let results = await  pool.promise().query(sql)
    .then(([rows,fields]) => {
      return rows;
    }).catch(function (err) {
      console.error(err);
      throw "No se pueden obtener los tracks";
    })

 

  return results;

}

module.exports =lib;


