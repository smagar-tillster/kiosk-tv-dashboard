/**
 * Express server to proxy NewRelic GraphQL API requests
 * Handles both BK-US and PLK-US tenants with separate API keys
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3053;

const NEWRELIC_API_KEY_BKUS = process.env.NEWRELIC_API_KEY_BKUS;
const NEWRELIC_API_KEY_PLKUS = process.env.NEWRELIC_API_KEY_PLKUS;
const NEWRELIC_ENDPOINT = 'https://api.newrelic.com/graphql';

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'newrelic-proxy' });
});

// NewRelic proxy endpoint
app.post('/api/newrelic', async (req, res) => {
  try {
    // Get tenant from header (defaults to BKUS)
    const tenant = req.headers['x-tenant'] || 'BKUS';
    
    // Select API key based on tenant
    const apiKey = tenant === 'PLKUS' ? NEWRELIC_API_KEY_PLKUS : NEWRELIC_API_KEY_BKUS;
    
    if (!apiKey) {
      return res.status(400).json({ 
        error: `No API key configured for tenant: ${tenant}` 
      });
    }
    
    // Call NewRelic API
    const response = await fetch(NEWRELIC_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'API-Key': apiKey,
      },
      body: JSON.stringify(req.body),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return res.status(response.status).json({
        error: 'NewRelic API error',
        details: data,
      });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`NewRelic proxy server running on port ${PORT}`);
  console.log(`Tenant BKUS API Key configured: ${!!NEWRELIC_API_KEY_BKUS}`);
  console.log(`Tenant PLKUS API Key configured: ${!!NEWRELIC_API_KEY_PLKUS}`);
});
