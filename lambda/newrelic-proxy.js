/**
 * AWS Lambda function to proxy NewRelic GraphQL API requests
 * Handles both BK-US and PLK-US tenants with separate API keys
 */

const NEWRELIC_API_KEY_BKUS = process.env.NEWRELIC_API_KEY_BKUS;
const NEWRELIC_API_KEY_PLKUS = process.env.NEWRELIC_API_KEY_PLKUS;
const NEWRELIC_ENDPOINT = 'https://api.newrelic.com/graphql';

export const handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Tenant',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  try {
    // Parse request body
    const body = JSON.parse(event.body || '{}');
    
    // Get tenant from header (defaults to BKUS)
    const tenant = event.headers['x-tenant'] || event.headers['X-Tenant'] || 'BKUS';
    
    // Select API key based on tenant
    const apiKey = tenant === 'PLKUS' ? NEWRELIC_API_KEY_PLKUS : NEWRELIC_API_KEY_BKUS;
    
    if (!apiKey) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: `No API key configured for tenant: ${tenant}` 
        }),
      };
    }
    
    // Call NewRelic API
    const response = await fetch(NEWRELIC_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'API-Key': apiKey,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: `NewRelic API error: ${response.statusText}`,
        }),
      };
    }

    const data = await response.json();
    
    if (data.errors) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'NerdGraph query error',
          details: data.errors,
        }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Lambda proxy error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to fetch from NewRelic',
        message: error.message,
      }),
    };
  }
};
