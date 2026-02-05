# TV Dashboard Architecture

## Project Structure

This is a **Next.js 16 App Router** project with **complete client-side rendering** (static export) except for the NewRelic API proxy.

```
tv-dashboard/
├── app/                          # Next.js App Router directory
│   ├── api/                      # Server-side API routes (NOT exported to static)
│   │   └── newrelic/route.ts    # NewRelic GraphQL proxy (for local dev only)
│   │
│   ├── components/               # All reusable UI components (client-side)
│   │   ├── AlertHeatmap.tsx     # ECharts US map with alerts
│   │   ├── ConfigurableLineChart.tsx
│   │   ├── ConfigurableBarChart.tsx
│   │   ├── ConfigurableMapChart.tsx
│   │   └── index.ts             # Component exports
│   │
│   ├── config/                   # Configuration files
│   │   ├── bar-chart.config.ts
│   │   ├── city-coordinates.ts  # US city/state coordinates for maps
│   │   ├── heatmap.config.ts
│   │   ├── index.ts
│   │   ├── line-chart.config.ts
│   │   ├── main-dashboard.config.ts
│   │   ├── map-dashboard.config.ts
│   │   ├── map.config.ts
│   │   └── tenant-config.ts     # BK-US & PLK-US credentials
│   │
│   ├── connectors/              # Data source connectors
│   │   └── newrelic-connector.ts
│   │
│   ├── dtos/                    # Data Transfer Objects / TypeScript types
│   │   └── charts.ts
│   │
│   ├── queries/                 # NewRelic NRQL queries
│   │   └── newrelic-queries.ts
│   │
│   ├── services/                # Business logic services
│   │   └── dashboard-data-service.ts
│   │
│   ├── utils/                   # Utility functions
│   │   └── cn.ts
│   │
│   ├── page.tsx                 # Main dashboard page (/)
│   ├── dashboard/
│   │   └── page.tsx            # Full dashboard (/dashboard)
│   └── map-dashboard/
│       └── page.tsx            # Combined map view (/map-dashboard)
│
├── lambda/                      # AWS Lambda functions (for production)
│   └── newrelic-proxy/         # Production NewRelic API proxy
│
├── public/                      # Static assets
├── .env.local                   # Local environment variables (gitignored)
├── next.config.ts              # Next.js configuration
└── package.json

```

## Key Architecture Decisions

### 1. **Client-Side Only (Static Export)**
- All pages are marked with `'use client'` directive
- Uses Next.js `output: 'export'` for static site generation
- No server-side rendering (SSR) or incremental static regeneration (ISR)
- Can be deployed to GitHub Pages, S3, or any static host

### 2. **API Routes (Development Only)**
- `app/api/newrelic/route.ts` is server-side and runs only in development
- In production, this is replaced by AWS Lambda function
- API routes are NOT included in the static export

### 3. **Adding New Pages**
Since this uses Next.js App Router, add new pages inside `app/` directory:

```typescript
// To add a new page at /analytics:
// Create: app/analytics/page.tsx

'use client';

export default function AnalyticsPage() {
  return <div>Analytics Dashboard</div>;
}
```

**Routing Structure:**
- `app/page.tsx` → `/`
- `app/dashboard/page.tsx` → `/dashboard`
- `app/map-dashboard/page.tsx` → `/map-dashboard`
- `app/analytics/page.tsx` → `/analytics` (example)
- `app/reports/[id]/page.tsx` → `/reports/:id` (dynamic route example)

### 4. **No `pages/` Folder**
- Next.js 13+ App Router uses `app/` folder, NOT `pages/`
- The old `pages/` directory is for Next.js 12 and earlier
- All new routes go in `app/`

### 5. **Component Organization**
- **All components in `app/components/`** - No separate `components/` or `lib/` at root
- Chart components are configurable via config objects
- Shared logic in `app/services/`
- Data types in `app/dtos/`

### 6. **Environment Variables**

**Development (.env.local):**
```bash
NEWRELIC_ACCOUNT_ID_BKUS=4502664
NEWRELIC_API_KEY_BKUS=NRAK-xxx
NEWRELIC_TENANT_BKUS=BK-US

NEWRELIC_ACCOUNT_ID_PLKUS=4817770
NEWRELIC_API_KEY_PLKUS=NRAK-xxx
NEWRELIC_TENANT_PLKUS=PLK-US
```

**Production:**
- Uses AWS Lambda for API calls
- Credentials stored in AWS Secrets Manager
- Frontend uses `NEXT_PUBLIC_API_ENDPOINT` to point to Lambda

### 7. **Data Flow**

```
Client Component (page.tsx)
    ↓
DashboardDataService
    ↓
NewRelicConnector
    ↓
[DEV] → app/api/newrelic/route.ts → NewRelic API
[PROD] → AWS Lambda → NewRelic API
```

## Routes

| Route | Purpose | Components Used |
|-------|---------|----------------|
| `/` | Main dashboard with stats & charts | AlertHeatmap, ConfigurableLineChart, ConfigurableBarChart |
| `/dashboard` | Alternative main dashboard layout | Same as above |
| `/map-dashboard` | Full-page combined tenant map | AlertHeatmap (combined BK-US + PLK-US) |

## Technologies

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Recharts** - Line and bar charts
- **ECharts** - Interactive US maps (AlertHeatmap)
- **react-simple-maps** - Alternative map library (ConfigurableMapChart)
- **Lucide React** - Icons

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production (static export)
npm run build

# Preview production build
npm run start
```

## Deployment

The app exports to static HTML/CSS/JS in the `out/` directory:

```bash
npm run build
# Deploy the out/ folder to:
# - GitHub Pages
# - AWS S3
# - Netlify
# - Vercel
# - Any static host
```

## Adding New Features

### Add a New Dashboard Page

1. Create file: `app/my-dashboard/page.tsx`
2. Add 'use client' directive
3. Import components from `@/app/components`
4. Use `DashboardDataService` to fetch data

```typescript
'use client';

import { useState, useEffect } from 'react';
import { AlertHeatmap } from '@/app/components';
import { DashboardDataService } from '@/app/services/dashboard-data-service';
import { TENANT_CONFIG } from '@/app/config/tenant-config';

export default function MyDashboard() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    const service = new DashboardDataService(
      TENANT_CONFIG.BKUS.accountId,
      TENANT_CONFIG.BKUS.apiKey,
      'BKUS'
    );
    
    service.fetchChartData('BKUS').then(result => {
      setData(result.alertHeatmap);
    });
  }, []);
  
  return (
    <div className="h-screen p-4">
      <h1>My Custom Dashboard</h1>
      <AlertHeatmap data={data} />
    </div>
  );
}
```

### Add a New Chart Component

1. Create file: `app/components/MyChart.tsx`
2. Export from `app/components/index.ts`
3. Use in any page

### Add a New NewRelic Query

1. Add to `app/queries/newrelic-queries.ts`
2. Use in `DashboardDataService`

## Notes

- **No `lib/` folder** - Everything is in `app/`
- **No `pages/` folder** - Using App Router, not Pages Router
- **All client-side** - Except API routes which only work in dev
- **Lambda for production** - API proxy runs on AWS Lambda in production
