# Tillster Proactive Monitoring Dashboard - Deployment Guide

This guide provides step-by-step instructions to deploy the dashboard using **GitHub Pages** (static site) and **AWS Lambda + API Gateway** (API proxy).

---

## Architecture Overview

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────┐
│  GitHub Pages   │─────▶│  API Gateway +   │─────▶│  NewRelic   │
│  (Static Site)  │      │  Lambda Function │      │     API     │
└─────────────────┘      └──────────────────┘      └─────────────┘
```

The static dashboard is hosted on GitHub Pages, and API calls are proxied through AWS Lambda to keep API keys secure.

---

## Part 1: Deploy AWS Lambda Function

### Step 1: Create IAM Role for Lambda

1. Go to **AWS Console** → **IAM** → **Roles** → **Create role**
2. Select **AWS service** → **Lambda** → **Next**
3. Attach policy: **AWSLambdaBasicExecutionRole**
4. Role name: `newrelic-lambda-role`
5. Click **Create role**
6. Copy the **Role ARN** (e.g., `arn:aws:iam::123456789012:role/newrelic-lambda-role`)

### Step 2: Package Lambda Function

Navigate to the lambda folder and create a zip file:

**Windows (PowerShell):**
```powershell
cd lambda
Compress-Archive -Path newrelic-proxy.js -DestinationPath newrelic-proxy.zip -Force
```

**Mac/Linux:**
```bash
cd lambda
zip newrelic-proxy.zip newrelic-proxy.js
```

### Step 3: Create Lambda Function

1. Go to **AWS Console** → **Lambda** → **Create function**
2. Choose **Author from scratch**
3. Function name: `newrelic-proxy`
4. Runtime: **Node.js 20.x**
5. Architecture: **x86_64**
6. Execution role: **Use an existing role** → Select `newrelic-lambda-role`
7. Click **Create function**

### Step 4: Upload Lambda Code

1. In the Lambda function page, scroll to **Code source**
2. Click **Upload from** → **.zip file**
3. Upload `newrelic-proxy.zip`
4. Click **Save**

### Step 5: Configure Lambda Settings

1. Go to **Configuration** → **General configuration** → **Edit**
2. Set **Memory**: 256 MB
3. Set **Timeout**: 30 seconds
4. Click **Save**

### Step 6: Add Environment Variables

1. Go to **Configuration** → **Environment variables** → **Edit**
2. Click **Add environment variable**
3. Add both keys:
   - Key: `NEWRELIC_API_KEY_BKUS` → Value: `NRAK-YOUR-BK-US-API-KEY`
   - Key: `NEWRELIC_API_KEY_PLKUS` → Value: `NRAK-YOUR-PLK-US-API-KEY`
4. Click **Save**

> **⚠️ IMPORTANT - Managing API Keys:**
> - **NEVER commit API keys to Git** - they are stored in AWS Lambda environment variables only
> - For local development, use `.env.local` file (this file is gitignored)
> - Rotate API keys regularly and update them in AWS Lambda environment variables
> - Use separate API keys for different tenants (BK-US and PLK-US)

---

## Part 2: Create API Gateway

### Step 1: Create REST API

1. Go to **AWS Console** → **API Gateway** → **Create API**
2. Choose **REST API** (not Private or HTTP API) → **Build**
3. Choose **REST** protocol
4. Create new API: **New API**
5. API name: `newrelic-api`
6. Endpoint type: **Regional**
7. Click **Create API**

### Step 2: Create Resource and Method

1. Click **Actions** → **Create Resource**
2. Resource name: `newrelic`
3. Resource path: `/newrelic`
4. Enable **CORS**
5. Click **Create Resource**

6. Select the `/newrelic` resource
7. Click **Actions** → **Create Method** → Choose **POST** → Click ✓
8. Integration type: **Lambda Function**
9. Use Lambda Proxy integration: **✓ Check this box**
10. Lambda Region: Select your Lambda region (e.g., `us-east-1`)
11. Lambda Function: `newrelic-proxy`
12. Click **Save** → **OK** to grant permissions

### Step 3: Enable CORS

1. Select the `/newrelic` resource
2. Click **Actions** → **Enable CORS**
3. Check:
   - **POST** method
   - Access-Control-Allow-Headers: Add `Content-Type,X-Api-Key,X-Tenant`
4. Click **Enable CORS and replace existing CORS headers** → **Yes, replace**

### Step 4: Deploy API

1. Click **Actions** → **Deploy API**
2. Deployment stage: **[New Stage]**
3. Stage name: `prod`
4. Click **Deploy**
5. **Copy the Invoke URL** (e.g., `https://abc123xyz.execute-api.us-east-1.amazonaws.com/prod`)

---

## Part 3: Configure Frontend for Production

### Step 1: Update next.config.ts

Add the API Gateway endpoint:

```typescript
const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/tv-dashboard',
  assetPrefix: '/tv-dashboard',
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_API_ENDPOINT: 'https://YOUR_API_GATEWAY_URL/prod/newrelic',
  },
};
```

Replace `YOUR_API_GATEWAY_URL` with your actual API Gateway URL (without `/newrelic` at the end).

### Step 2: Build Static Site

```bash
npm run build
```

This creates an `out/` folder with the static site.

---

## Part 4: Deploy to GitHub Pages

### Step 1: Create GitHub Repository

1. Create a new repository on GitHub (e.g., `tv-dashboard`)
2. Push your code:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/tv-dashboard.git
git push -u origin main
```

### Step 2: Create gh-pages Branch

```bash
npm run build
git checkout -b gh-pages
git add -f out/
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

### Step 3: Enable GitHub Pages

1. Go to your GitHub repository
2. Click **Settings** → **Pages**
3. Source: **Deploy from a branch**
4. Branch: **gh-pages** → Folder: **/(root)**
5. Click **Save**

### Step 4: Update GitHub Pages to Use /out Directory

```bash
# Create a .nojekyll file to prevent GitHub from ignoring files starting with _
cd out
touch .nojekyll
cd ..
git add out/.nojekyll
git commit -m "Add .nojekyll for GitHub Pages"
git push origin gh-pages
```

### Step 5: Access Your Dashboard

Your dashboard will be available at:
```
https://YOUR_USERNAME.github.io/tv-dashboard/
```

---

## Running Locally on Another Machine

To run the dashboard on another machine for development/testing:

### Prerequisites

- **Node.js 18+** installed
- **Git** installed
- **NewRelic API keys** (BK-US and PLK-US)

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/tv-dashboard.git
   cd tv-dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env.local` file:**
   
   Copy the example file:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your API keys:
   ```env
   NEWRELIC_API_KEY_BKUS=NRAK-YOUR-BK-US-API-KEY
   NEWRELIC_API_KEY_PLKUS=NRAK-YOUR-PLK-US-API-KEY
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Open browser:**
   ```
   http://localhost:3000
   ```

The dashboard will run locally using the Next.js API routes (not AWS Lambda). This is perfect for development and testing.

---

## API Key Security Best Practices

### ✅ DO:
- Store API keys in AWS Lambda environment variables (production)
- Use `.env.local` file for local development (file is gitignored)
- Rotate API keys regularly (every 90 days recommended)
- Use separate API keys for different environments (dev, staging, prod)
- Use separate API keys for different tenants (BK-US, PLK-US)
- Restrict API key permissions to minimum required access in NewRelic

### ❌ DON'T:
- Commit API keys to Git
- Share API keys via email or chat
- Hardcode API keys in source code
- Use production API keys for local development
- Store API keys in `next.config.ts` or any committed file

### Updating API Keys in Production:

If you need to rotate/update API keys:

1. Go to **AWS Lambda** → Your function → **Configuration** → **Environment variables**
2. Click **Edit**
3. Update the values for:
   - `NEWRELIC_API_KEY_BKUS`
   - `NEWRELIC_API_KEY_PLKUS`
4. Click **Save**
5. Lambda automatically uses new keys (no redeployment needed)

---

## Updating the Dashboard

### For Code Changes:

1. **Make changes locally** and test with `npm run dev`
2. **Build:** `npm run build`
3. **Deploy to GitHub Pages:**
   ```bash
   git checkout gh-pages
   rm -rf *
   cp -r out/* .
   git add .
   git commit -m "Update dashboard"
   git push origin gh-pages
   ```

### For Lambda Changes:

1. **Update `lambda/newrelic-proxy.js`**
2. **Package:** `zip newrelic-proxy.zip newrelic-proxy.js`
3. **Upload to Lambda:**
   - Go to Lambda → Code source → Upload from .zip file
   - Select new zip file → Save

---

## Troubleshooting

### Dashboard shows "Loading..." forever
- Check browser console for errors
- Verify API Gateway URL is correct in `next.config.ts`
- Test Lambda function directly in AWS Console

### CORS errors in browser
- Ensure CORS is enabled on API Gateway
- Check that `X-Tenant` and `Content-Type` are in allowed headers
- Redeploy API Gateway after CORS changes

### Lambda function timeout
- Increase timeout in Lambda Configuration (default 30s)
- Check NewRelic API is responding

### Wrong data showing
- Verify `X-Tenant` header is being sent correctly
- Check Lambda environment variables have correct API keys
- Test both tenants separately

---

## Cost Estimate

**AWS Lambda:**
- Free tier: 1M requests/month, 400,000 GB-seconds compute
- After free tier: ~$0.20 per 1M requests
- Expected monthly cost: **$0-5**

**API Gateway:**
- Free tier: 1M API calls/month for 12 months
- After free tier: $3.50 per 1M requests
- Expected monthly cost: **$0-10**

**GitHub Pages:**
- **Free** for public repositories
- 100GB bandwidth/month

**Total estimated cost: $0-15/month** (likely $0 if under free tier limits)

---

## Support

For issues or questions:
1. Check CloudWatch Logs in AWS Lambda for errors
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly
4. Test Lambda function independently using AWS Console Test feature
