import { NextRequest, NextResponse } from 'next/server';
import { TENANT_CONFIG } from '@/app/config/tenant-config';

const NEWRELIC_ENDPOINT = 'https://api.newrelic.com/graphql';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenant, ...graphqlBody } = body;
    
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
    
    const response = await fetch(NEWRELIC_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'API-Key': apiKey,
      },
      body: JSON.stringify(graphqlBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('NewRelic API Error Response:', errorText);
      return NextResponse.json(
        { error: `NewRelic API error: ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data.errors) {
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
