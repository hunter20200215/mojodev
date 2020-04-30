let lib = {};
const pool = require('../connection/connect');
lib._ = require('lodash');
lib.SqlString = require('sqlstring');



const perf = require('execution-time')(console.log);

lib.searchSello = async function (filtro, user, userProfile, periodo, filterObject, pagina, cantidad,busqueda) {

    let results = {};
  
    /*results.column = ['Label', 'Monto', 'Periodo'];
    results.columnType = ['text', 'currency', 'date'];*/
  
    perf.start();
  
  
    let complexObject
  
    let sello = this._.find(filterObject, {
      tipo: 'sello'
    });
  
  
    let track = this._.find(filterObject, {
      tipo: 'track'
    });
  
    let album = this._.find(filterObject, {
      tipo: 'album'
    });
  
    let artista = this._.find(filterObject, {
      tipo: 'artista'
    });
  
    let pais = this._.find(filterObject, {
      tipo: 'pais'
    });
  
    let canal = this._.find(filterObject, {
      tipo: 'servicio'
    })
  
    let esAdmin = this._.includes(userProfile, 'ADMIN');
  
    let sql = ` select COALESCE(label,'') sello,  sum(inga.montoAfiliado) total , DATE_FORMAT( ingreso.periodo  ,'%Y-%m') periodo  `;
    let sqlgral = this.SqlString.format(` from ingreso  inner join ingreso_afiliado inga on ingreso.id = inga.idIngreso  `);
  //  sqlgral = this.SqlString.format(sqlgral + ` inner join track on ingreso.idTrack = track.id inner join trackxAlbum on track.id = trackxAlbum.idTrack  and trackxAlbum.idAlbums = ingreso.idAlbum `);
    sqlgral = this.SqlString.format(sqlgral + ` inner join albums on ingreso.idAlbum= albums.id   `);
    sqlgral = this.SqlString.format(sqlgral + ` where ingreso.periodo between  DATE_FORMAT('` + periodo.fechaInicio + `','%Y-%m-01') AND LAST_DAY('` + periodo.fechaFin + `')   `);
  
    if (sello) {
      sqlgral = this.SqlString.format(sqlgral + ' and albums.label like \'%' + sello.valor.value + '%\'');
    }
  
    if (track) {
      sqlgral = this.SqlString.format(sqlgral + ' and ingreso.idTrack = ' + track.valor.value);
    }
  
    if (album) {
      sqlgral = this.SqlString.format(sqlgral + ' and ingreso.idAlbum = ' + album.valor.value);
    }
  
    if (artista) {
      sqlgral = this.SqlString.format(sqlgral + ' and albums.artistaPrincipalId = ' + artista.valor.value);
    }
  
    if (pais) {
      sqlgral = this.SqlString.format(sqlgral + ' and ingreso.pais = ' + pais.valor.value);
    }
  
    if (canal) {
      sqlgral = this.SqlString.format(sqlgral + ' and ingreso.idCanal = ' + canal.valor.value);
    }
  
    if (!esAdmin) {
      sqlgral = this.SqlString.format(sqlgral + ' and  inga.idAfiliado in (select idAfiliado from users where nombreUsuario = \'' + user + '\')');
    }
    
    
    sqlgral = this.SqlString.format(sqlgral + ` and  ingreso.conversionDolar = 0 `);
  
  
    if(busqueda &&  busqueda != "null"){    
      sqlgral = this.SqlString.format(sqlgral + ' and label like \'%' + busqueda + '%\'');  
    }



    
  
    sql = this.SqlString.format(sql + sqlgral + ` group by label , ingreso.periodo  `);

    sql = this.SqlString.format(sql + ` order by  total desc , ingreso.periodo desc , sello asc `);
  
    let sqlTotal = ` select sum(inga.montoAfiliado) total `;
    sqlTotal = sqlTotal + sqlgral;
    let sqlCantidad = this.SqlString.format(`SELECT COUNT(*) total FROM  (` + sql + `) as cantidad   `);
    let inicio = (pagina - 1) * cantidad;
    sql = this.SqlString.format(sql + ` limit   ` + inicio + ',' + cantidad);
  
   // console.log(sql);
  
    let error;

   

    console.log(sql);
    results.data = await pool.promise().query(sql)
      .then(([rows,fields]) => {

        return rows;

      }).catch(function (err) {
        console.error(err);
        throw "No se puedo obtener el detalle de ingresos";
      })
  


    
    

      console.log(sqlCantidad);
      results.count = await pool.promise().query(sqlCantidad)
      .then(([rows,fields]) => {
        return JSON.parse(JSON.stringify(rows[0])).total;
      }).catch(function (err) {
        console.error(err);
        throw "No se puedo obtener el detalle de ingresos";
      })
  

      
  
     
    if (filterObject.length > 0){
      results.ingreso = await this.calculoTotal(sqlTotal);
    }


    perf.stop();
 
    return results;
  
  }
  
  
  
lib.groupAlbum = async function (filtro, user, userProfile, periodo, filterObject, pagina, cantidad,busqueda) {
  
    let results = {};
  
  
  
    /*results.column = ['Albums', 'Artista', 'UPC', 'Ingreso', 'Periodo'];
    results.columnType = ['text', 'text', 'text', 'currency', 'date'];*/
  
  
  
    let complexObject
  
    let sello = this._.find(filterObject, {
      tipo: 'sello'
    });
  
  
    let track = this._.find(filterObject, {
      tipo: 'track'
    });
  
    let album = this._.find(filterObject, {
      tipo: 'album'
    });
  
    let artista = this._.find(filterObject, {
      tipo: 'artista'
    });
  
    let pais = this._.find(filterObject, {
      tipo: 'pais'
    });
  
    let canal = this._.find(filterObject, {
      tipo: 'servicio'
    })
  
  
    let esAdmin = this._.includes(userProfile, 'ADMIN');
  
    let sql = ` select albums.titulo, artistas.nombres, albums.upc, sum(inga.montoAfiliado) total , DATE_FORMAT( ingreso.periodo  ,'%Y-%m') periodo  `;
    let sqlgral = this.SqlString.format(` from ingreso  inner join ingreso_afiliado inga on ingreso.id = inga.idIngreso  `);
    sqlgral = this.SqlString.format(sqlgral + ` inner join albums on ingreso.idAlbum= albums.id `);
    sqlgral = this.SqlString.format(sqlgral + ` left outer join artistas on artistas.id = albums.artistaPrincipalId   `);
    sqlgral = this.SqlString.format(sqlgral + ` where ingreso.periodo between  DATE_FORMAT('` + periodo.fechaInicio + `','%Y-%m-01') AND LAST_DAY('` + periodo.fechaFin + `')   `);
  
  
  
    /*
      select albums.titulo,albums.upc, artistas.nombres, (inga.montoAfiliado) total , ingreso.periodo 
      from ingreso  inner join ingreso_afiliado inga on ingreso.id = inga.idIngreso 
       inner join albums on ingreso.idAlbum= albums.id   
       left outer join artistas on artistas.id = albums.artistaPrincipalId
      where ingreso.periodo between  DATE_FORMAT('2019-03-01','%Y-%m-01') AND LAST_DAY('2019-05-01')  
      -- and ingreso.idAlbum = 7
      and  inga.idAfiliado in (select idAfiliado from users where nombreUsuario = 'ggiqueaux@discosprocom.com')  
      group by periodo , ingreso.idAlbum
      order by periodo desc , albums.titulo asc*/
  
  
  
    if (sello) {
      sqlgral = this.SqlString.format(sqlgral + ' and albums.label like \'%' + sello.valor.value + '%\'');
    }
  
    if (track) {
      sqlgral = this.SqlString.format(sqlgral + ' and ingreso.idTrack = ' + track.valor.value);
    }
  
    if (album) {
      sqlgral = this.SqlString.format(sqlgral + ' and ingreso.idAlbum = ' + album.valor.value);
    }
  
    if (artista) {
      sqlgral = this.SqlString.format(sqlgral + ' and albums.artistaPrincipalId = ' + artista.valor.value);
    }
  
    if (pais) {
      sqlgral = this.SqlString.format(sqlgral + ' and ingreso.pais = ' + pais.valor.value);
    }
  
    if (canal) {
      sqlgral = this.SqlString.format(sqlgral + ' and ingreso.idCanal = ' + canal.valor.value);
    }
  
  
    if (!esAdmin) {
      sqlgral = this.SqlString.format(sqlgral + ' and  inga.idAfiliado in (select idAfiliado from users where nombreUsuario = \'' + user + '\')');
    }
  
  
    if(busqueda &&  busqueda != "null"){    
      sqlgral = this.SqlString.format(sqlgral + ' and (  albums.titulo like \'%' + busqueda + '%\' ');  
      sqlgral = this.SqlString.format(sqlgral + ' or  albums.UPC like \'%' + busqueda + '%\''); 
      sqlgral = this.SqlString.format(sqlgral + ' or  artistas.nombres like \'%' + busqueda + '%\' )');  
    }
  
    sqlgral = this.SqlString.format(sqlgral + ` and  ingreso.conversionDolar = 0 `);
  
    let sqlTotal = ` select sum(inga.montoAfiliado) total `;
    sqlTotal = sqlTotal + sqlgral;
  
    
  
    sql = this.SqlString.format(sql + sqlgral + ` group by periodo , ingreso.idAlbum  `);
    sql = this.SqlString.format(sql + ` order by  total desc, periodo desc , albums.titulo asc `);
  
    let sqlCantidad = this.SqlString.format(`SELECT COUNT(*) total FROM  (` + sql + `) as cantidad   `);
    let inicio = (pagina - 1) * cantidad;
   
    sql = this.SqlString.format(sql + ` limit   ` + inicio + ',' + cantidad);
  
  
    let error;
  
  
   // console.log(sql);
  
  console.log(sql);
    results.data = await pool.promise().query(sql)
      .then(([rows,fields]) => {
        return rows;
      }).catch(function (err) {
        console.error(err);
        throw "No se puedo obtener el detalle de ingresos";
      })
  
  
    results.count = await pool.promise().query(sqlCantidad)
      .then(([rows,fields]) => {
        return JSON.parse(JSON.stringify(rows[0])).total;
      }).catch(function (err) {
        console.error(err);
        throw "No se puedo obtener el detalle de ingresos";
      })
  
  
   // await mysql.end();
  
  
    if (filterObject.length > 0)
      results.ingreso = await this.calculoTotal(sqlTotal);
  
    return results;
  
  }
  
  
lib.groupTrack = async function (filtro, user, userProfile, periodo, filterObject, pagina, cantidad,busqueda) {
  
    let results = {};
  
  
  
    /*results.column = ['Track', 'Album', 'Artista', 'Ingreso', 'Periodo'];
    results.columnType = ['text', 'text', 'text', 'currency', 'date'];*/
  
  
  
    let complexObject;
  
    let album = this._.find(filterObject, {
      tipo: 'album'
    });
  
    let artista = this._.find(filterObject, {
      tipo: 'artista'
    });
  
    let pais = this._.find(filterObject, {
      tipo: 'pais'
    });
  
  
    let track = this._.find(filterObject, {
      tipo: 'track'
    });
    let sello = this._.find(filterObject, {
      tipo: 'sello'
    });
  
    let canal = this._.find(filterObject, {
      tipo: 'servicio'
    })
  
    let esAdmin = this._.includes(userProfile, 'ADMIN');
  
    let sql = ` select track.nombre, albums.titulo, artistas.nombres, sum(inga.montoAfiliado) total , DATE_FORMAT( ingreso.periodo  ,'%Y-%m') periodo   `;
    let sqlgral = this.SqlString.format(` from ingreso  inner join ingreso_afiliado inga on ingreso.id = inga.idIngreso   `);
    sqlgral = this.SqlString.format(sqlgral + ` inner join albums on ingreso.idAlbum= albums.id `);
    sqlgral = this.SqlString.format(sqlgral + ` inner join track on track.id = ingreso.idTrack   `);
    sqlgral = this.SqlString.format(sqlgral + ` left join trackxartista on track.id = trackxartista.idTrack `);
    sqlgral = this.SqlString.format(sqlgral + ` left outer join artistas on artistas.id = trackxartista.idArtista  `);
    sqlgral = this.SqlString.format(sqlgral + ` where ingreso.periodo between  DATE_FORMAT('` + periodo.fechaInicio + `','%Y-%m-01') AND LAST_DAY('` + periodo.fechaFin + `')   `);
  
    sqlgral = this.SqlString.format(sqlgral + ` and  ingreso.conversionDolar = 0 `);
    /*
       select track.nombre,albums.id ,  albums.titulo, artistas.nombres,  (inga.montoAfiliado) total , ingreso.periodo 
     from ingreso  inner join ingreso_afiliado inga on ingreso.id = inga.idIngreso 
      inner join albums on ingreso.idAlbum= albums.id 
      inner join track on track.id = ingreso.idTrack 
       inner join trackxartista on track.id = trackxartista.idTrack 
      left outer join artistas on artistas.id = trackxartista.idArtista 
     where ingreso.periodo between  DATE_FORMAT('2019-03-01','%Y-%m-01') AND LAST_DAY('2019-05-01') 
     and  inga.idAfiliado in (select idAfiliado from users where nombreUsuario = 'ggiqueaux@discosprocom.com') 
     -- and ingreso.idTrack = 4
     group by periodo , ingreso.idAlbum 
     order by periodo desc , track.nombre asc */
  
  
    if (sello) {
      sqlgral = this.SqlString.format(sqlgral + ' and albums.label like \'%' + sello.valor.value + '%\'');
    }
  
    if (track) {
      sqlgral = this.SqlString.format(sqlgral + ' and ingreso.idTrack = ' + track.valor.value);
    }
  
    if (album) {
      sqlgral = this.SqlString.format(sqlgral + ' and ingreso.idAlbum = ' + album.valor.value);
    }
  
    if (artista) {
      sqlgral = this.SqlString.format(sqlgral + ' and albums.artistaPrincipalId = ' + artista.valor.value);
    }
  
    if (pais) {
      sqlgral = this.SqlString.format(sqlgral + ' and ingreso.pais = ' + pais.valor.value);
    }
  
    if (canal) {
      sqlgral = this.SqlString.format(sqlgral + ' and ingreso.idCanal = ' + canal.valor.value);
    }
  
  
    if(busqueda &&  busqueda != "null"){    
      sqlgral = this.SqlString.format(sqlgral + ' and (  albums.titulo like \'%' + busqueda + '%\' ');  
      sqlgral = this.SqlString.format(sqlgral + ' or  track.nombre like \'%' + busqueda + '%\''); 
      sqlgral = this.SqlString.format(sqlgral + ' or  artistas.nombres like \'%' + busqueda + '%\' )');  
    }
  
  
  
    if (!esAdmin) {
      sqlgral = this.SqlString.format(sqlgral + ' and  inga.idAfiliado in (select idAfiliado from users where nombreUsuario = \'' + user + '\')');
    }
  
    let sqlTotal = ` select sum(inga.montoAfiliado) total `;
    sqlTotal = sqlTotal + sqlgral;
  
    sql = this.SqlString.format(sql + sqlgral + ` group by periodo , ingreso.idTrack  `);
    sql = this.SqlString.format(sql + ` order by total desc  `);
  
  
    let sqlCantidad = this.SqlString.format(`SELECT COUNT(*) total FROM  (` + sql + `) as cantidad   `);
    let inicio = (pagina - 1) * cantidad;
   // console.log(cantidad);
    sql = this.SqlString.format(sql + ` limit   ` + inicio + ',' + cantidad);
  
  
  
    let error;
  
    // console.log(sql);
    results.data = await pool.promise().query(sql)
      .then(([rows,fields]) => {
        return rows;
      }).catch(function (err) {
        console.error(err);
        throw "No se puedo obtener el detalle de ingresos";
      })
  
  
    results.count = await pool.promise().query(sqlCantidad)
      .then(([rows,fields]) => {
        return JSON.parse(JSON.stringify(rows[0])).total;
      }).catch(function (err) {
        console.error(err);
        throw "No se puedo obtener el detalle de ingresos";
      })
  
  
  //  await mysql.end();
  
    if (filterObject.length > 0)
      results.ingreso = await this.calculoTotal(sqlTotal);
  
    return results;
  
  }
  
  
  
lib.groupArtista =  async function (filtro, user, userProfile, periodo, filterObject, pagina, cantidad,busqueda) {
  
    let results = {};
  
  
  
   /* results.column = ['Artista', 'Ingreso', 'Periodo'];
    results.columnType = ['text', 'currency', 'date'];*/
  
  
  
    let complexObject;
    let album = this._.find(filterObject, {
      tipo: 'album'
    });
  
    let artista = this._.find(filterObject, {
      tipo: 'artista'
    });
  
    let pais = this._.find(filterObject, {
      tipo: 'pais'
    });
  
  
    let track = this._.find(filterObject, {
      tipo: 'track'
    });
    let sello = this._.find(filterObject, {
      tipo: 'sello'
    });
  
    let canal = this._.find(filterObject, {
      tipo: 'servicio'
    })
  
    let esAdmin = this._.includes(userProfile, 'ADMIN');
  
    let sql = `select artistas.nombres,  sum(inga.montoAfiliado) total , DATE_FORMAT( ingreso.periodo  ,'%Y-%m') periodo `;
  
    let sqlgral = this.SqlString.format(` from ingreso  inner join ingreso_afiliado inga on ingreso.id = inga.idIngreso   `);
    sqlgral = this.SqlString.format(sqlgral + ` inner join albums on ingreso.idAlbum= albums.id `);
    sqlgral = this.SqlString.format(sqlgral + ` inner join track on track.id = ingreso.idTrack   `);
    sqlgral = this.SqlString.format(sqlgral + ` left join trackxartista on track.id = trackxartista.idTrack `);
    sqlgral = this.SqlString.format(sqlgral + ` left outer join artistas on artistas.id = trackxartista.idArtista  `);
  
    sqlgral = this.SqlString.format(sqlgral + ` where ingreso.periodo between  DATE_FORMAT('` + periodo.fechaInicio + `','%Y-%m-01') AND LAST_DAY('` + periodo.fechaFin + `')   `);
  
    sqlgral = this.SqlString.format(sqlgral + ` and  ingreso.conversionDolar = 0 `);
  
    sqlgral = this.SqlString.format(sqlgral + ` and ingreso.idTrack = trackxartista.idTrack   `);
  
    /*
       select artistas.nombres, artistas.id, (inga.montoAfiliado) total , ingreso.periodo 
     from ingreso  inner join ingreso_afiliado inga on ingreso.id = inga.idIngreso 
      inner join albums on ingreso.idAlbum= albums.id 
      inner join track on track.id = ingreso.idTrack 
       inner join trackxartista on track.id = trackxartista.idTrack 
      left outer join artistas on artistas.id = trackxartista.idArtista 
     where ingreso.periodo between  DATE_FORMAT('2019-03-01','%Y-%m-01') AND LAST_DAY('2019-05-01') 
     and  inga.idAfiliado in (select idAfiliado from users where nombreUsuario = 'ggiqueaux@discosprocom.com') 
     and ingreso.idTrack = trackxartista.idTrack 
     and artistas.id  = 227
     group by periodo , artistas.id
     order by periodo desc   */
  
  
    if (sello) {
      sqlgral = this.SqlString.format(sqlgral + ' and albums.label like \'%' + sello.valor.value + '%\'');
    }
  
    if (track) {
      sqlgral = this.SqlString.format(sqlgral + ' and ingreso.idTrack = ' + track.valor.value);
    }
  
    if (album) {
      sqlgral = this.SqlString.format(sqlgral + ' and ingreso.idAlbum = ' + album.valor.value);
    }
  
    if (artista) {
      sqlgral = this.SqlString.format(sqlgral + ' and albums.artistaPrincipalId = ' + artista.valor.value);
    }
  
    if (pais) {
      sqlgral = this.SqlString.format(sqlgral + ' and ingreso.pais = ' + pais.valor.value);
    }
  
    if (canal) {
      sqlgral = this.SqlString.format(sqlgral + ' and ingreso.idCanal = ' + canal.valor.value);
    }
  
  
  
  
    if (!esAdmin) {
      sqlgral = this.SqlString.format(sqlgral + ' and  inga.idAfiliado in (select idAfiliado from users where nombreUsuario = \'' + user + '\')');
    }
  
  
    if(busqueda &&  busqueda != "null"){    
      sqlgral = this.SqlString.format(sqlgral + ' and (  artistas.nombres like \'%' + busqueda + '%\' )');  
    }
  
   

  
    let sqlTotal = ` select sum(inga.montoAfiliado) total `;
    sqlTotal = sqlTotal + sqlgral;
  
    sql = this.SqlString.format(sql + sqlgral + ` group by periodo ,  artistas.id  `);
    sql = this.SqlString.format(sql + ` order by  total desc   `);
  
  //  console.log(sql);

    let sqlCantidad = this.SqlString.format(`SELECT COUNT(*) total FROM  (` + sql + `) as cantidad   `);
    let inicio = (pagina - 1) * cantidad;
    console.log(cantidad);
    sql = this.SqlString.format(sql + ` limit   ` + inicio + ',' + cantidad);
  
  
  
    let error;
  
  
  
  
  
  //  console.log(sql);
    results.data = await pool.promise().query(sql)
      .then(([rows,fields]) =>  {
        return rows;
      }).catch(function (err) {
        console.error(err);
        throw "No se puedo obtener el detalle de ingresos";
      })
  
    results.count = await pool.promise().query(sqlCantidad)
      .then(([rows,fields]) =>  {
        return JSON.parse(JSON.stringify(rows[0])).total;
      }).catch(function (err) {
        console.error(err);
        throw "No se puedo obtener el detalle de ingresos";
      })
  
  
  
   // await mysql.end();
  
    if (filterObject.length > 0)
      results.ingreso = await this.calculoTotal(sqlTotal);
  
    return results;
  
  }
  
lib.groupCanal =  async function (filtro, user, userProfile, periodo, filterObject, pagina, cantidad,busqueda) {
  
  
    let results = {};
  
  
  
    /*results.column = ['Servicio', 'Ingreso', 'Periodo'];
    results.columnType = ['text', 'currency', 'date'];*/
  
  
  
    let complexObject;
  
    let album = this._.find(filterObject, {
      tipo: 'album'
    });
  
    let artista = this._.find(filterObject, {
      tipo: 'artista'
    });
  
    let pais = this._.find(filterObject, {
      tipo: 'pais'
    });
  
  
    let track = this._.find(filterObject, {
      tipo: 'track'
    });
    let sello = this._.find(filterObject, {
      tipo: 'sello'
    });
  
    let canal = this._.find(filterObject, {
      tipo: 'servicio'
    })
  
  
    let esAdmin = this._.includes(userProfile, 'ADMIN');
  
    let sql = ` select canales.nombre, sum(inga.montoAfiliado) total , DATE_FORMAT( ingreso.periodo  ,'%Y-%m') periodo `;
    /* let sqlgral = SqlString.format( ` from ingreso  inner join ingreso_afiliado inga on ingreso.id = inga.idIngreso   `);
     sqlgral = SqlString.format(sqlgral + `  inner join canales on ingreso.idCanal  = canales.id `);*/
  
    let sqlgral = this.SqlString.format(` from ingreso  inner join ingreso_afiliado inga on ingreso.id = inga.idIngreso   `);
    sqlgral = this.SqlString.format(sqlgral + ` inner join albums on ingreso.idAlbum= albums.id `);
    sqlgral = this.SqlString.format(sqlgral + `  inner join canales on ingreso.idCanal  = canales.id `)
    sqlgral = this.SqlString.format(sqlgral + ` inner join track on track.id = ingreso.idTrack   `);
    sqlgral = this.SqlString.format(sqlgral + ` left join trackxartista on track.id = trackxartista.idTrack `);
    sqlgral = this.SqlString.format(sqlgral + ` left outer join artistas on artistas.id = trackxartista.idArtista  `);
  
  
    /*if (artista) {
      sqlgral = SqlString.format(sqlgral + ` inner join trackxartista tpa on ingreso.idTrack = tpa.idTrack 
      inner join artistas on tpa.idArtista = artistas.id `);
    }*/
  
  
    sqlgral = this.SqlString.format(sqlgral + ` where ingreso.periodo between  DATE_FORMAT('` + periodo.fechaInicio + `','%Y-%m-01') AND LAST_DAY('` + periodo.fechaFin + `')   `);
  
    sqlgral = this.SqlString.format(sqlgral + ` and  ingreso.conversionDolar = 0 `);
  
    /*
       select canales.nombre, sum(inga.montoAfiliado) total , ingreso.periodo 
     from ingreso  inner join ingreso_afiliado inga on ingreso.id = inga.idIngreso  
      inner join canales on ingreso.idCanal  = canales.id
     where ingreso.periodo between  DATE_FORMAT('2019-03-01','%Y-%m-01') AND LAST_DAY('2019-05-01') 
     and  inga.idAfiliado in (select idAfiliado from users where nombreUsuario = 'ggiqueaux@discosprocom.com') 
     -- and ingreso.idCanal  = 227
     group by periodo , ingreso.idCanal
     order by periodo desc  */
  
  
    if (sello) {
      sqlgral = this.SqlString.format(sqlgral + ' and albums.label like \'%' + sello.valor.value + '%\'');
    }
  
    if (track) {
      sqlgral = this.SqlString.format(sqlgral + ' and ingreso.idTrack = ' + track.valor.value);
    }
  
    if (album) {
      sqlgral = this.SqlString.format(sqlgral + ' and ingreso.idAlbum = ' + album.valor.value);
    }
  
    if (artista) {
      sqlgral = this.SqlString.format(sqlgral + ' and albums.artistaPrincipalId = ' + artista.valor.value);
    }
  
    if (pais) {
      sqlgral = this.SqlString.format(sqlgral + ' and ingreso.pais = ' + pais.valor.value);
    }
  
    if (canal) {
      sqlgral = this.SqlString.format(sqlgral + ' and ingreso.idCanal = ' + canal.valor.value);
    }
  
  
    if (!esAdmin) {
      sqlgral = this.SqlString.format(sqlgral + ' and  inga.idAfiliado in (select idAfiliado from users where nombreUsuario = \'' + user + '\')');
    }
  
    if(busqueda &&  busqueda != "null"){    
      sqlgral = this.SqlString.format(sqlgral + ' and (  canales.nombre like \'%' + busqueda + '%\' )');  
    }
  
    let sqlTotal = ` select sum(inga.montoAfiliado) total `;
    sqlTotal = sqlTotal + sqlgral;
  
    sql = this.SqlString.format(sql + sqlgral + ` group by periodo , ingreso.idCanal  `);
    sql = this.SqlString.format(sql + ` order by total desc , periodo desc   `);
  
    let sqlCantidad = this.SqlString.format(`SELECT COUNT(*) total FROM  (` + sql + `) as cantidad   `);
    let inicio = (pagina - 1) * cantidad;
 //   console.log(cantidad);
    sql = this.SqlString.format(sql + ` limit   ` + inicio + ',' + cantidad);
  
  
    let error;
  
  //  console.log(sql);
    results.data = await pool.promise().query(sql)
      .then(([rows,fields]) =>  {
        return rows;
      }).catch(function (err) {
        console.error(err);
        throw "No se puedo obtener el detalle de ingresos";
      })
  
  
    results.count = await pool.promise().query(sqlCantidad)
      .then(([rows,fields]) =>  {
        return JSON.parse(JSON.stringify(rows[0])).total;
      }).catch(function (err) {
        console.error(err);
        throw "No se puedo obtener el detalle de ingresos";
      })
  
  //  await mysql.end();
  
    if (filterObject.length > 0)
      results.ingreso = await this.calculoTotal(sqlTotal);
  
    return results;
  
  }
  
  
  
  
  
  /*
     s select canales.nombre, sum(inga.montoAfiliado) total , ingreso.periodo 
   from ingreso  inner join ingreso_afiliado inga on ingreso.id = inga.idIngreso  
    inner join canales on ingreso.idCanal  = canales.id
    -- esto si viene artista
    inner join trackxartista tpa on ingreso.idTrack = tpa.idTrack
    inner join artistas on tpa.idArtista = artistas.id
    
   where ingreso.periodo between  DATE_FORMAT('2019-03-01','%Y-%m-01') AND LAST_DAY('2019-05-01') 
   and  inga.idAfiliado in (select idAfiliado from users where nombreUsuario = 'ggiqueaux@discosprocom.com') 
   
   -- esto si viene artista
   and artistas.id  = 87
   
   -- album
   and ingreso.idAlbum = 41
   
   
   group by periodo , ingreso.idCanal
   order by periodo desc 
     */
lib.groupPais =  async function (filtro, user, userProfile, periodo, filterObject, pagina, cantidad,busqueda) {
  
  
    let results = {};
  
  
  
    /*results.column = ['Pais', 'Ingreso', 'Periodo'];
    results.columnType = ['text', 'currency', 'date'];*/
  
  
  
    let complexObject;
  
    let album = this._.find(filterObject, {
      tipo: 'album'
    });
  
    let artista = this._.find(filterObject, {
      tipo: 'artista'
    });
  
    let pais = this._.find(filterObject, {
      tipo: 'pais'
    });
  
  
    let track = this._.find(filterObject, {
      tipo: 'track'
    });
    let sello = this._.find(filterObject, {
      tipo: 'sello'
    });
  
    let canal = this._.find(filterObject, {
      tipo: 'servicio'
    })
  
  
    let esAdmin = this._.includes(userProfile, 'ADMIN');
  
    let sql = ` select paises.nombre, sum(inga.montoAfiliado) total , DATE_FORMAT( ingreso.periodo  ,'%Y-%m') periodo  `;
    let sqlgral = this.SqlString.format(` from ingreso  inner join ingreso_afiliado inga on ingreso.id = inga.idIngreso   `);
    sqlgral = this.SqlString.format(sqlgral + `  inner join paises on ingreso.pais  = paises.id `);
  
    sqlgral = this.SqlString.format(sqlgral + ` inner join albums on ingreso.idAlbum= albums.id `);
    sqlgral = this.SqlString.format(sqlgral + `  inner join canales on ingreso.idCanal  = canales.id `)
    sqlgral = this.SqlString.format(sqlgral + ` inner join track on track.id = ingreso.idTrack   `);
    sqlgral = this.SqlString.format(sqlgral + ` left join trackxartista on track.id = trackxartista.idTrack `);
    sqlgral = this.SqlString.format(sqlgral + ` left outer join artistas on artistas.id = trackxartista.idArtista  `);
  
  
    /* if (artista) {
       sqlgral = SqlString.format(sqlgral + ` inner join trackxartista tpa on ingreso.idTrack = tpa.idTrack 
       inner join artistas on tpa.idArtista = artistas.id `);
     }*/
  
  
    sqlgral = this.SqlString.format(sqlgral + ` where ingreso.periodo between  DATE_FORMAT('` + periodo.fechaInicio + `','%Y-%m-01') AND LAST_DAY('` + periodo.fechaFin + `')   `);
  
  
    sqlgral = this.SqlString.format(sqlgral + ` and  ingreso.conversionDolar = 0 `);
  
  
    if (!esAdmin) {
      sqlgral = this.SqlString.format(sqlgral + ' and  inga.idAfiliado in (select idAfiliado from users where nombreUsuario = \'' + user + '\')');
    }
  
    if (sello) {
      sqlgral = this.SqlString.format(sqlgral + ' and albums.label like \'%' + sello.valor.value + '%\'');
    }
  
    if (track) {
      sqlgral = this.SqlString.format(sqlgral + ' and ingreso.idTrack = ' + track.valor.value);
    }
  
    if (album) {
      sqlgral = this.SqlString.format(sqlgral + ' and ingreso.idAlbum = ' + album.valor.value);
    }
  
    if (artista) {
      sqlgral = this.SqlString.format(sqlgral + ' and albums.artistaPrincipalId = ' + artista.valor.value);
    }
  
    if (pais) {
      sqlgral = this.SqlString.format(sqlgral + ' and ingreso.pais = ' + pais.valor.value);
    }
  
    if (canal) {
      sqlgral = this.SqlString.format(sqlgral + ' and ingreso.idCanal = ' + canal.valor.value);
    }
  
    if(busqueda &&  busqueda != "null"){    
      sqlgral = this.SqlString.format(sqlgral + ' and (  paises.nombre like \'%' + busqueda + '%\' )');  
    }
  
  
    let sqlTotal = ` select sum(inga.montoAfiliado) total `;
    sqlTotal = sqlTotal + sqlgral;
  
    sql = this.SqlString.format(sql + sqlgral + ` group by periodo , ingreso.pais  `);
    sql = this.SqlString.format(sql + ` order by total desc , periodo  desc   `);
  
    let sqlCantidad = this.SqlString.format(`SELECT COUNT(*) total FROM  (` + sql + `) as cantidad   `);
    let inicio = (pagina - 1) * cantidad;
//    console.log(cantidad);
    sql = this.SqlString.format(sql + ` limit   ` + inicio + ',' + cantidad);
  
  
    let error;
  
//    console.log(sql);
    results.data = await pool.promise().query(sql)
      .then(([rows,fields]) => {
        return rows;
      }).catch(function (err) {
        console.error(err);
        throw "No se puedo obtener el detalle de ingresos";
      })
  
  
    results.count = await pool.promise().query(sqlCantidad)
      .then(([rows,fields]) => {
        return JSON.parse(JSON.stringify(rows[0])).total;
      }).catch(function (err) {
        console.error(err);
        throw "No se puedo obtener el detalle de ingresos";
      })
  
   // await mysql.end();
  
    if (filterObject.length > 0)
      results.ingreso = await this.calculoTotal(sqlTotal);
  
    return results;
  
  }
  
  
lib.calculoTotal =  async function (sql) {
  
    let error;
  
  
 //   console.log(sql);
  
  
    let results = await pool.promise().query(sql)
      .then(([rows,fields]) =>{
        if ((rows[0].total) == null) {
          rows[0].total = "0.00";
        }
        return JSON.parse(JSON.stringify(rows[0].total));
      }).catch(function (err) {
        if (err instanceof TypeError) {
          error = err.message;
        } else {
          console.error(err);
          error = "No hay datos para el filtro seleccionado";
        }
  
  
      })
  
  
  
   // await mysql.end();
  
  
    return results;
  }





module.exports =lib;