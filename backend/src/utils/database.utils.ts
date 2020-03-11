// eslint-disable-next-line no-unused-vars
import { Connection, ConnectionOptions, createConnection } from 'typeorm';

export class Database {
  public static async getConnection(connectionManager): Promise<Connection> {
    const CONNECTION_NAME = 'default';

    let connection: Connection;

    if (connectionManager.has(CONNECTION_NAME)) {
      console.debug('Database.getConnection() - using existing connection ...');
      connection = await connectionManager.get(CONNECTION_NAME);

      if (!connection.isConnected) {
        connection = await connection.connect();
      }
    } else {
      console.info('Database.getConnection() - creating connection ... ');
      const connectionOptions: ConnectionOptions = {
        name: CONNECTION_NAME,
        type: 'postgres',
        synchronize: false,
        logging: true,
        url: process.env.SERVICE_SOL_CONNECTION,
        dropSchema: false,
        entities: [
          // __dirname + '/../types/*.type.ts'
          // __dirname + '../types/*{.type.ts}'
        ]
      };

      connection = await createConnection(connectionOptions);
    }

    return connection;
  }
};
