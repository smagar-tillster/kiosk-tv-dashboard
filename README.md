# Tillster Proactive Monitoring Dashboard

Real-time monitoring dashboard for Kiosk alerts and metrics from NewRelic. Displays data for BK-US and PLK-US tenants with charts, maps, and statistics.

## Features

- 📊 **Multi-tenant Dashboard**: Separate views for BK-US and PLK-US
- 🗺️ **US Alert Heatmap**: State-level alert visualization with ECharts
- 📈 **Trend Analysis**: Order failure trends and type breakdowns
- 🔄 **Auto-refresh**: Configurable auto-refresh (default: 30 minutes)
- ⚡ **Fast Loading**: Shimmer UI for individual components
- 🎨 **Color-coded Themes**: Green for BK-US, Orange for PLK-US
- 🚀 **GitHub Pages + AWS Lambda**: Secure API key management

## Project Structure

```
tv-dashboard/
├── app/
│   ├── api/                    # API routes
│   │   └── newrelic/          # NewRelic proxy endpoint
│   ├── map-dashboard/         # Map dashboard page
│   │   └── page.tsx
│   ├── _components/           # Reusable chart components
│   │   ├── ConfigurableLineChart.tsx
│   │   ├── ConfigurableBarChart.tsx
│   │   ├── ConfigurableMapChart.tsx
│   │   └── index.ts
│   ├── _config/               # All configuration files
│   │   ├── tenant-config.ts   # API keys & tenant configs
│   │   ├── dashboard-config.ts
│   │   ├── map.config.ts
│   │   └── index.ts
│   ├── _dtos/                 # Data Transfer Objects
│   ├── _services/             # Business logic
│   ├── _connectors/           # External API connectors
│   ├── _queries/              # Query definitions
│   ├── _utils/                # Utility functions
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Landing page
├── lambda/                    # AWS Lambda function
├── public/                    # Static assets
└── out/                       # Static export output
```

**Note:** Folders with `_` prefix are not routes (internal code only).

## Quick Start

### Running Locally

1. **Clone and install:**
   ```bash
   git clone <repository-url>
   cd tv-dashboard
   npm install
   ```

2. **Create `.env.local` file:**
   ```bash
   cp .env.local.example .env.local
   ```
   
3. **Add your NewRelic API keys to `.env.local`:**
   ```env
   NEWRELIC_API_KEY_BKUS=NRAK-YOUR-BK-US-KEY
   NEWRELIC_API_KEY_PLKUS=NRAK-YOUR-PLK-US-KEY
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Open browser:**
   ```
   http://localhost:3000
   ```

### Production Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for complete deployment instructions:
- AWS Lambda + API Gateway setup
- GitHub Pages deployment
- API key security best practices

## Project Structure

```
tv-dashboard/
├── app/
│   ├── page.tsx              # Main dashboard
│   ├── layout.tsx            # Root layout
│   └── api/newrelic/         # Local dev API route
├── components/
│   ├── charts/               # Chart components
│   │   ├── AlertHeatmap.tsx       # US map with state alerts
│   │   ├── OrderFailureTrendChart.tsx
│   │   ├── OrderFailureTypesChart.tsx
│   │   └── TypeOfIssuesChart.tsx
│   └── ui/                   # UI components
│       ├── card.tsx
│       └── stat-card.tsx
├── lib/
│   ├── config/               # Configuration files
│   │   ├── dashboard-config.ts    # Auto-refresh settings
│   │   ├── tenant-config.ts       # Tenant details
│   │   └── city-coordinates.ts    # US state coordinates
│   ├── connectors/           # Data source connectors
│   │   └── newrelic-connector.ts
│   ├── queries/              # NRQL queries
│   │   └── newrelic-queries.ts
│   └── services/             # Business logic
│       └── dashboard-data-service.ts
├── lambda/
│   └── newrelic-proxy.js     # AWS Lambda function
├── next.config.ts            # Next.js configuration
├── DEPLOYMENT.md             # Deployment guide
└── package.json
```

## Configuration

### Auto-refresh Settings

Edit `lib/config/dashboard-config.ts`:

```typescript
export const DASHBOARD_CONFIG: DashboardConfig = {
  showRefreshButton: false,        // true = manual button, false = auto-refresh
  autoRefreshMinutes: 30,          // refresh interval when auto-refresh enabled
};
```

### Tenant Configuration

Edit `lib/config/tenant-config.ts`:

```typescript
export const TENANT_CONFIG = {
  BKUS: {
    name: 'BK-US',
    accountId: '4502664',
    apiKey: process.env.NEWRELIC_API_KEY_BKUS || '',
  },
  // Add more tenants...
};
```

## Technology Stack

- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts + Apache ECharts
- **Deployment**: GitHub Pages + AWS Lambda
- **API**: NewRelic NerdGraph (GraphQL)

## Security

- ✅ API keys stored in AWS Lambda environment variables (production)
- ✅ `.env.local` for local development (gitignored)
- ✅ No API keys in source code or Git
- ✅ CORS configured on API Gateway
- ✅ Separate keys for each tenant

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete security best practices.

## License

Private - Tillster Inc.

<div className="grid gap-6 md:grid-cols-2">
  <LineChart {...props} />
  <BarChart {...props} />
</div>

{/* 3-column layout */}
<div className="grid gap-6 md:grid-cols-3">
  <MyChart1 />
  <MyChart2 />
  <MyChart3 />
</div>

{/* Mixed layout */}
<div className="grid gap-6 md:grid-cols-12">
  <div className="md:col-span-8">
    <LineChart {...props} />
  </div>
  <div className="md:col-span-4">
    <BarChart {...props} />
  </div>
</div>
```

## Technologies

- **Next.js 16**: React framework with App Router
- **React 19**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS 4**: Utility-first CSS
- **Recharts**: Charting library
- **shadcn/ui**: Component patterns
- **Lucide React**: Icons

## GitHub Pages Deployment

The project is configured for GitHub Pages:

1. Push to GitHub repository
2. Run `npm run deploy`
3. Enable GitHub Pages in repository settings (source: gh-pages branch)

Or use GitHub Actions for automatic deployment (workflow file not included).

## Extension Examples

### Add More Chart Types

- Area Chart
- Pie Chart
- Scatter Plot
- Gauge/Radial Chart
- Heatmap

### Add More Connectors

- Prometheus
- Datadog
- Grafana
- Custom REST APIs
- GraphQL APIs
- WebSocket streams

## License

MIT
