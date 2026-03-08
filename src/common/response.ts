import { APIGatewayProxyResult } from 'aws-lambda';

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': 'true',
}

export const success = (body: object): APIGatewayProxyResult => ({
  statusCode: 200,
  headers,
  body: JSON.stringify(body),
});

export const created = (body: object): APIGatewayProxyResult => ({
  statusCode: 201,
  headers,
  body: JSON.stringify(body),
});

export const noContent = (): APIGatewayProxyResult => ({
  statusCode: 204,
  headers,
  body: '',
});

export const error = (statusCode: number, message: string): APIGatewayProxyResult => ({
  statusCode,
  headers,
  body: JSON.stringify({ message }),
});
