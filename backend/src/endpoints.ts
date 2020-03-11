import { Database } from './utils/database.utils';
import { getConnectionManager } from 'typeorm';
import { ReturnRequest } from './utils/request.utils';
import ContractService from './services/contract.service';

const connectionManager = getConnectionManager();

export const contract = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    const connection = await Database.getConnection(connectionManager);
    return ReturnRequest.Success(await ContractService.maybeCreateAndGet(connection, JSON.parse(event.body)));
  } catch (err) {
    console.error(err);
    return ReturnRequest.Fail(err);
  }
};
