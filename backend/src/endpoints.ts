import { Database } from './utils/database.utils';
// import { getConnectionManager } from 'typeorm';
import { ReturnRequest } from './utils/request.utils';
import MaxMilhasService from './services/maxmilhas.service';

// const connectionManager = getConnectionManager();

export const maxmilhas_postSearchIntention = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    // const connection = await Database.getConnection(connectionManager);
    return ReturnRequest.Success(await MaxMilhasService.postSearchIntention(JSON.parse(event.body)));
  } catch (err) {
    console.error(err);
    return ReturnRequest.Fail(err);
  }
};

export const maxmilhas_searchFlights = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    // const connection = await Database.getConnection(connectionManager);
    return ReturnRequest.Success(await MaxMilhasService.searchFlights(JSON.parse(event.body)));
  } catch (err) {
    console.error(err);
    return ReturnRequest.Fail(err);
  }
};
