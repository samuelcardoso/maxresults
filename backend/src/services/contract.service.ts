import { Contractor, Contract } from 'servicesol.entities';

export default class ContractService {
  public static async maybeCreateAndGet(conn, ourNumber): Promise<Contract> {
    const query = {
      where: {
        identification: ourNumber
      }
    };

    let contract = await conn.getRepository(Contract.TABLE_NAME).findOne(query);

    if(!contract) {
      contract = new Contract();
      contract.identification = ourNumber;
      // await ValidatorObject.validate(BillToReceive, { ...billToReceive });
      await conn.getRepository(Contract.TABLE_NAME).save(contract);
    }

    return contract;
  }
}
