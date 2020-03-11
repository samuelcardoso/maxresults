import BusinessException from "../exceptions/business.exception";

const headers = {
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Credentials': true
};

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
    return {
      statusCode: data ? (data.statusCode || 200) : 404,
      body: JSON.stringify(data),
      headers: headers
    };
  };

  public static Fail(data) {
    return {
      statusCode: (data instanceof Array || data instanceof BusinessException) ? 403 : 500,
      body: JSON.stringify(data),
      headers: headers
    };
  };
}
