import BusinessException from "../exceptions/business.exception";

const { assoc } = require('ramda');
const headers = {
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Credentials': true
};

const defaultResponse = (success = true) => ({
  success,
  date: new Date()
});

export class ReturnRequest {
  // public static SuccessFile(data) {
  //   const body = assoc('data', data, defaultResponse(true));
  //   return {
  //     statusCode: data ? (data.statusCode || 200) : 404,
  //     body: JSON.stringify(body),
  //     headers: { 
  //       ...headers, 
  //       'Content-type': "application/octet-stream",
  //       'Content-disposition': 'attachment; filename=file.txt'
  //     }
  //   };
  // };

  public static Success(data) {
    const body = assoc('data', data, defaultResponse(true));
    return {
      statusCode: data ? (data.statusCode || 200) : 404,
      body: JSON.stringify(body),
      headers: headers
    };
  };

  public static Fail(data) {
    const body = assoc('data', data, defaultResponse(false));

    return {
      statusCode: (data instanceof Array || data instanceof BusinessException) ? 403 : 500,
      body: JSON.stringify(body),
      headers: headers
    };
  };
}
