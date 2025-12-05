# Running Dashboard on Another Machine

Quick guide to run the Tillster Proactive Monitoring Dashboard on any machine.

## Prerequisites

Install these first:
- **Node.js 18+**: Download from https://nodejs.org/
- **Git**: Download from https://git-scm.com/
- **NewRelic API Keys**: Get from NewRelic account (both BK-US and PLK-US)

## Steps

### 1. Clone Repository

```bash
git clone <your-repository-url>
cd tv-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages (takes 1-2 minutes).

### 3. Configure API Keys

**Option A - Copy example file:**
```bash
# Windows
copy .env.local.example .env.local

# Mac/Linux
cp .env.local.example .env.local
```

**Option B - Create new file:**

Create a file named `.env.local` in the project root with:

```env
NEWRELIC_API_KEY_BKUS=NRAK-YOUR-BK-US-API-KEY-HERE
NEWRELIC_API_KEY_PLKUS=NRAK-YOUR-PLK-US-API-KEY-HERE
```

> **Important**: Replace the placeholder values with actual API keys from NewRelic

### 4. Run Development Server

```bash
npm run dev
```

You should see:
```
▲ Next.js 16.0.6
- Local:        http://localhost:3000
- Ready in X.Xs
```

### 5. Open Dashboard

Open your browser and go to:
```
http://localhost:3000
```

You should see:
- Dashboard title: "Tillster Proactive monitoring dashboard" (in orange)
- 6 stat cards at the top (3 for BK-US, 3 for PLK-US)
- 8 charts below (trends, types, maps)
- Shimmer loading animations while data loads

## Troubleshooting

### "Command not found: npm"
- Install Node.js from https://nodejs.org/
- Restart your terminal after installation

### "Port 3000 already in use"
- Kill any existing Node processes
- Or run on different port: `npm run dev -- -p 3001`

### Dashboard shows "Loading..." forever
- Check your API keys in `.env.local` are correct
- Verify you have internet connection
- Check browser console (F12) for errors

### "Module not found" errors
- Delete `node_modules` folder
- Delete `package-lock.json`
- Run `npm install` again

### Changes not reflecting
- Stop the dev server (Ctrl+C)
- Delete `.next` folder
- Run `npm run dev` again

## What's Running Locally vs Production

**Local Development:**
- Uses Next.js API routes (`/app/api/newrelic/route.ts`)
- API keys stored in `.env.local` file
- No AWS Lambda needed
- Hot reload enabled (changes reflect instantly)

**Production (GitHub Pages + Lambda):**
- Uses AWS Lambda function
- API keys stored in AWS Lambda environment variables
- Static site hosted on GitHub Pages
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions

## Configuration

### Change Auto-refresh Interval

Edit `lib/config/dashboard-config.ts`:

```typescript
export const DASHBOARD_CONFIG = {
  showRefreshButton: false,    // false = auto-refresh
  autoRefreshMinutes: 30,      // change this number
};
```

### Enable Manual Refresh Button

Edit `lib/config/dashboard-config.ts`:

```typescript
export const DASHBOARD_CONFIG = {
  showRefreshButton: true,     // true = show button
  autoRefreshMinutes: 30,      // ignored when button shown
};
```

## Stopping the Server

Press **Ctrl+C** in the terminal where `npm run dev` is running.

## Next Steps

- Make changes to the code (changes reflect automatically)
- See [DEPLOYMENT.md](./DEPLOYMENT.md) to deploy to production
- Check [README.md](./README.md) for project structure and details
