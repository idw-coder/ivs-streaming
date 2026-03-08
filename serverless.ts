import type { Serverless, IamRoleStatement } from 'serverless/aws';

/**
 * IAM ロールステートメント
 * IVS の各 API を呼び出すための権限を付与します。
 */
const ivsIamRoleStatements: IamRoleStatement[] = [
  {
    Effect: 'Allow',
    Action: [
      'ivs:ListChannels',
      'ivs:GetChannel',
      'ivs:CreateChannel',
      'ivs:DeleteChannel',
      'ivs:GetStream',
      'ivs:StopStream',
    ],
    Resource: '*',
  },
];

/**
 * Serverless Framework の設定
 * Lambda 関数の定義、API Gateway のルーティング
 */
const serverlessConfiguration: Serverless = {
  service: 'ivs-streaming-api',

  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
    prune: {
      automatic: true,
      number: 3,
    },
  },

  plugins: [
    'serverless-webpack',
    'serverless-offline',
    'serverless-plugin-aws-alerts',
    'serverless-plugin-split-stacks',
    'serverless-prune-plugin',
    'serverless-iam-roles-per-function',
  ],

  provider: {
    name: 'aws',
    runtime: (process.env.SLS_RUNTIME ?? 'nodejs16.x') as 'nodejs16.x' | 'nodejs22.x',
    timeout: 25,
    region: 'ap-northeast-1',
    stage: 'dev',
    stackName: 'ivs-streaming-api',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_ACCOUNT_ID: '${aws:accountId}',
    },
    iamRoleStatements: ivsIamRoleStatements,
  },

  functions: {
    health: {
      handler: 'src/health.handler',
      name: '${self:provider.stackName}-health',
      events: [
        {
          http: {
            cors: true,
            method: 'get',
            path: 'health',
          },
        },
      ],
    },
    createChannel: {
      handler: 'src/channel/create.handler',
      name: '${self:provider.stackName}-create-channel',
      events: [
        {
          http: {
            cors: true,
            method: 'post',
            path: 'channels',
          },
        },
      ],
    },
    listChannels: {
      handler: 'src/channel/list.handler',
      name: '${self:provider.stackName}-list-channels',
      events: [{ http: { cors: true, method: 'get', path: 'channels' } }],
    },
    getChannel: {
      handler: 'src/channel/get.handler',
      name: '${self:provider.stackName}-get-channel',
      events: [{ http: { cors: true, method: 'get', path: 'channels/{id}' } }],
    },
    deleteChannel: {
      handler: 'src/channel/delete.handler',
      name: '${self:provider.stackName}-delete-channel',
      events: [{ http: { cors: true, method: 'delete', path: 'channels/{id}' } }],
    },
    getStream: {
      handler: 'src/stream/get.handler',
      name: '${self:provider.stackName}-get-stream',
      events: [{ http: { cors: true, method: 'get', path: 'channels/{id}/stream' } }],
    },
    stopStream: {
      handler: 'src/stream/stop.handler',
      name: '${self:provider.stackName}-stop-stream',
      events: [{ http: { cors: true, method: 'post', path: 'channels/{id}/stream/stop' } }],
    },
  },
};

module.exports = serverlessConfiguration;
