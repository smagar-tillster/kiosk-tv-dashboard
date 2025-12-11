/**
 * Simple test Lambda function to verify API Gateway integration
 * Returns a simple JSON response with request details
 */

export const handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: 'Lambda function is working!',
      timestamp: new Date().toISOString(),
      tenant: event.headers['x-tenant'] || event.headers['X-Tenant'] || 'not-provided',
      requestBody: event.body ? JSON.parse(event.body) : null,
      method: event.httpMethod,
      path: event.path
    }),
  };
};
