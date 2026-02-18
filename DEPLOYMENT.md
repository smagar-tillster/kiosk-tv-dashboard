# Tillster Proactive Monitoring Dashboard - Deployment Guide

---

## 1. Run Locally (Development)

### Prerequisites
- Node.js 18+
- Git

### Steps
1. Clone the repository
2. Create `.env.local` file in root:
   ```env
   NEWRELIC_API_KEY_BKUS=NRAK-YOUR-BK-US-API-KEY
   NEWRELIC_API_KEY_PLKUS=NRAK-YOUR-PLK-US-API-KEY
   ```
3. Install dependencies:
   ```bash
   npm install
   cd lambda
   npm install
   cd ..
   ```
4. Run backend (terminal 1):
   ```bash
   cd lambda
   npm start
   ```
5. Run frontend (terminal 2):
   ```bash
   npm run dev
   ```
6. Open browser: `http://localhost:3000`

---

## 2. Build and Run for Production (Manual)

### Steps
1. Set environment variables in `.env.local`
2. Install dependencies (if not done):
   ```bash
   npm install
   cd lambda
   npm install
   cd ..
   ```
3. Build frontend:
   ```bash
   npm run build
   ```
4. Run backend (terminal 1):
   ```bash
   cd lambda
   npm start
   ```
5. Run frontend (terminal 2):
   ```bash
   npm run start
   ```
6. Frontend runs on port 3000, backend on port 3053

---

## 3. Deploy as Windows Service (NSSM)

### Prerequisites
- Windows Server
- NSSM installed (download from https://nssm.cc/download)
- Node.js installed

### Backend Service
```powershell
nssm install TV-Dashboard-Backend
```
**Configuration:**
- Path: `C:\Program Files\nodejs\node.exe`
- Startup directory: `<your-path>\tv-dashboard\lambda`
- Arguments: `server.js`
- Startup type: Automatic

**Set Environment Variables:**
```powershell
nssm set TV-Dashboard-Backend AppEnvironmentExtra NEWRELIC_API_KEY_BKUS=NRAK-YOUR-KEY
nssm set TV-Dashboard-Backend AppEnvironmentExtra NEWRELIC_API_KEY_PLKUS=NRAK-YOUR-KEY
```

**Start:**
```powershell
nssm start TV-Dashboard-Backend
```

### Frontend Service
```powershell
nssm install TV-Dashboard-Frontend
```
**Configuration:**
- Path: `C:\Program Files\nodejs\node.exe`
- Startup directory: `<your-path>\tv-dashboard`
- Arguments: `node_modules\next\dist\bin\next start`
- Startup type: Automatic

**Start:**
```powershell
nssm start TV-Dashboard-Frontend
```

### Update Deployment (Zero Downtime)
1. Download new code and extract
2. Run `npm install` in both root and lambda folders
3. Run `npm run build` in root
4. Restart services:
   ```powershell
   nssm restart TV-Dashboard-Backend
   nssm restart TV-Dashboard-Frontend
   ```

### Common NSSM Commands
```powershell
nssm status <ServiceName>     # Check status
nssm stop <ServiceName>        # Stop service
nssm restart <ServiceName>     # Restart service
nssm remove <ServiceName>      # Remove service
```

---

## 4. Deploy with Docker

### Prerequisites
- Docker and Docker Compose installed
- `.env` file with API keys

### Setup

**1. Create `.env` file in root:**
```env
NEWRELIC_API_KEY_BKUS=NRAK-YOUR-BK-US-API-KEY
NEWRELIC_API_KEY_PLKUS=NRAK-YOUR-PLK-US-API-KEY
NEWRELIC_TENANT_BKUS=BK-US
NEWRELIC_ACCOUNT_ID_BKUS=4502664
NEWRELIC_TENANT_PLKUS=PLK-US
NEWRELIC_ACCOUNT_ID_PLKUS=4502664
NEXT_PUBLIC_NEWRELIC_TENANT_BKUS=BK-US
NEXT_PUBLIC_NEWRELIC_ACCOUNT_ID_BKUS=4502664
NEXT_PUBLIC_NEWRELIC_API_KEY_BKUS=NRAK-YOUR-BK-US-API-KEY
NEXT_PUBLIC_NEWRELIC_TENANT_PLKUS=PLK-US
NEXT_PUBLIC_NEWRELIC_ACCOUNT_ID_PLKUS=4502664
NEXT_PUBLIC_NEWRELIC_API_KEY_PLKUS=NRAK-YOUR-PLK-US-API-KEY
```

**2. Build and run:**
```bash
docker-compose up -d --build
```

**3. Access:**
- Frontend: `http://localhost:3052`
- Backend: `http://localhost:3053`

### Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Rebuild and restart
docker-compose up -d --build

# View running containers
docker-compose ps
```

### Update Deployment

```bash
# Pull new code
git pull

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

---

## 5. Deploy on GitHub Pages (Frontend) + AWS Lambda (Backend)

### Lambda Setup (Backend)

**1. Create IAM Role:**
- AWS Console → IAM → Roles → Create role
- Service: Lambda, Policy: AWSLambdaBasicExecutionRole
- Name: `newrelic-lambda-role`

**2. Package Lambda:**
```powershell
cd lambda
Compress-Archive -Path newrelic-proxy.js -DestinationPath newrelic-proxy.zip -Force
```

**3. Create Lambda Function:**
- AWS Console → Lambda → Create function
- Name: `newrelic-proxy`, Runtime: Node.js 20.x
- Upload `newrelic-proxy.zip`
- Configuration: Memory 256 MB, Timeout 30s

**4. Add Environment Variables:**
- `NEWRELIC_API_KEY_BKUS`: Your BK-US API key
- `NEWRELIC_API_KEY_PLKUS`: Your PLK-US API key

### API Gateway Setup

**1. Create REST API:**
- API Gateway → Create API → REST API
- Name: `newrelic-api`, Type: Regional

**2. Create Resource & Method:**
- Create resource: `/newrelic`
- Create method: POST
- Integration: Lambda Function (proxy enabled)
- Select: `newrelic-proxy`

**3. Enable CORS:**
- Actions → Enable CORS
- Allow headers: `Content-Type,X-Api-Key,X-Tenant`

**4. Deploy API:**
- Actions → Deploy API
- Stage: `prod`
- Copy Invoke URL (e.g., `https://xxx.execute-api.us-east-1.amazonaws.com/prod`)

### Frontend Build & Deploy

**1. Update next.config.ts:**
```typescript
env: {
  NEXT_PUBLIC_API_ENDPOINT: 'https://YOUR_API_GATEWAY_URL/prod/newrelic',
}
```

**2. Build:**
```bash
npm run build
```

**3. Deploy to GitHub Pages:**
```bash
git checkout -b gh-pages
git add -f out/
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

**4. Enable GitHub Pages:**
- Repository → Settings → Pages
- Source: gh-pages branch, root folder
- Access: `https://YOUR_USERNAME.github.io/tv-dashboard/`

---

## API Key Security

**DO:**
- Store keys in AWS Lambda environment variables (production)
- Use `.env.local` for local development (gitignored)
- Rotate keys every 90 days

**DON'T:**
- Commit API keys to Git
- Hardcode keys in source code
- Share keys via email/chat

---

## Troubleshooting

**Dashboard not loading:**
- Check browser console for errors
- Verify API Gateway URL in `next.config.ts`
- Test Lambda function in AWS Console

**CORS errors:**
- Ensure CORS enabled on API Gateway
- Check allowed headers include `X-Tenant` and `Content-Type`
- Redeploy API Gateway after CORS changes

**Wrong data showing:**
- Verify `X-Tenant` header is correct
- Check Lambda environment variables have correct API keys
