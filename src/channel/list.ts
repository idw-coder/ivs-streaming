import { APIGatewayProxyHandler } from 'aws-lambda';
import { ListChannelsCommand } from '@aws-sdk/client-ivs';
import { ivsClient } from '@/common/ivs';
import { success, error } from '@/common/response';

export const handler: APIGatewayProxyHandler = async () => {
  try {
    const command = new ListChannelsCommand({});
    const result = await ivsClient.send(command);

    return success({
      channels: result.channels,
    });
  } catch (e) {
    console.error(e);
    return error(500, 'Internal Server Error');
  }
};
