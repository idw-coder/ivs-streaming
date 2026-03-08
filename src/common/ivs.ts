import { IvsClient } from '@aws-sdk/client-ivs';

const region = process.env.AWS_REGION ?? 'ap-northeast-1';

export const ivsClient = new IvsClient({ region });
