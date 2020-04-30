'use strict'
const header = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
  "Access-Control-Allow-Credentials" : true 
}

const createApiResponse = (statusCode = 200, msg = '', result = {}) => {
  let response ={
      retorno: statusCode === 200 && !msg ? 'OK' : 'ERROR',
      mensaje: msg,
      result: result
    
  };
  return response
}



module.exports = createApiResponse;
