import { APIGatewayProxyHandler } from 'aws-lambda';
import { GetChannelCommand } from '@aws-sdk/client-ivs';
import { ivsClient } from '@/common/ivs';
import { success, error } from '@/common/response';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const { id } = event.pathParameters ?? {};
    const accountId = process.env.AWS_ACCOUNT_ID;
    const region = process.env.AWS_REGION ?? 'ap-northeast-1';
    const arn = `arn:aws:ivs:${region}:${accountId}:channel/${id}`;

    const command = new GetChannelCommand({ arn });
    const result = await ivsClient.send(command);

    return success({ channel: result.channel });
  } catch (e) {
    console.error(e);
    return error(500, 'Internal Server Error');
  }
};
