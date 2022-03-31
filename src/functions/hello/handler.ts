import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import BaseRepository from '../../libs/repository';

const repo = new BaseRepository(`accounts`)
console.log(`repo outside:`, repo.isConnected())

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  await repo.connect()
  console.log(`repo inside:`, repo.isConnected())

  const resp =  formatJSONResponse({
    message: `Hello ${event.body.name}, welcome to the exciting Serverless world!`,
    event,
  });

  await repo.disconnect()
  return resp

};

export const main = middyfy(hello);
