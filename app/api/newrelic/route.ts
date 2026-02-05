import { NextRequest, NextResponse } from 'next/server';
import { TENANT_CONFIG } from '@/app/config/tenant-config';

const NEWRELIC_ENDPOINT = 'https://api.newrelic.com/graphql';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenant, ...graphqlBody } = body;
    
    // Debug: Log the exact query being sent to NewRelic
    console.log('[NewRelic API Route] ========== INCOMING REQUEST ==========');
    console.log('[NewRelic API Route] Full body received:', JSON.stringify(body, null, 2));
    console.log('[NewRelic API Route] Tenant:', tenant);
    console.log('[NewRelic API Route] GraphQL Body:', JSON.stringify(graphqlBody, null, 2));
    console.log('[NewRelic API Route] Query field:', graphqlBody.query);
    console.log('[NewRelic API Route] =========================================');
    
    // Get API key based on tenant
    const apiKey = tenant && TENANT_CONFIG[tenant as keyof typeof TENANT_CONFIG]
      ? TENANT_CONFIG[tenant as keyof typeof TENANT_CONFIG].apiKey
      : '';
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured for tenant' },
        { status: 401 }
      );
    }
    
    const payloadToNewRelic = JSON.stringify(graphqlBody);
    console.log('[NewRelic API Route] ========== SENDING TO NEWRELIC ==========');
    console.log('[NewRelic API Route] Endpoint:', NEWRELIC_ENDPOINT);
    console.log('[NewRelic API Route] Payload string length:', payloadToNewRelic.length);
    console.log('[NewRelic API Route] Payload:', payloadToNewRelic);
    console.log('[NewRelic API Route] ============================================');
    
    const response = await fetch(NEWRELIC_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'API-Key': apiKey,
      },
      body: payloadToNewRelic,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[NewRelic API Route] NewRelic Error Response:', errorText);
      return NextResponse.json(
        { error: `NewRelic API error: ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    console.log('[NewRelic API Route] NewRelic Success Response:', JSON.stringify(data, null, 2));

    if (data.errors) {
      console.error('[NewRelic API Route] NerdGraph Errors:', JSON.stringify(data.errors, null, 2));
      return NextResponse.json(
        { error: 'NerdGraph query error', details: data.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('NewRelic proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from NewRelic', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
