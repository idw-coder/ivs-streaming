import { APIGatewayProxyHandler } from 'aws-lambda';
import { CreateChannelCommand } from '@aws-sdk/client-ivs';
import { ivsClient } from '@/common/ivs';
import { created, error } from '@/common/response';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const body = JSON.parse(event.body ?? '{}');
    const { name } = body;

    if (!name) {
      return error(422, 'name is required');
    }

    const command = new CreateChannelCommand({ name });
    const result = await ivsClient.send(command);

    return created({
      channel: result.channel,
    });
  } catch (e) {
    console.error(e);
    return error(500, 'Internal Server Error');
  }
};
