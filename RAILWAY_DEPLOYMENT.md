# Railway Deployment Guide

## 🚀 Deploying Your BUAI App to Railway

### Prerequisites
- GitHub account with your code repository
- Railway account (sign up at [railway.app](https://railway.app))

### Step 1: Sign Up for Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with your GitHub account
3. Complete the verification process

### Step 2: Create a New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your BUAI repository
4. Railway will automatically detect it's a Node.js project

### Step 3: Add MongoDB Database
1. In your Railway project dashboard, click "New"
2. Select "Database" → "MongoDB"
3. Railway will provision a MongoDB instance
4. Copy the MongoDB connection string (you'll need this for environment variables)

### Step 4: Configure Environment Variables
In your Railway project dashboard, go to "Variables" tab and add:

```
NODE_ENV=production
MONGODB_URI=mongodb://your-railway-mongodb-url
ENCRYPTION_KEY=your-secure-encryption-key-here
CHAIN_ID=4157
PORT=3030
```

**Important Notes:**
- Replace `your-railway-mongodb-url` with the actual MongoDB URL from Step 3
- Generate a secure `ENCRYPTION_KEY` (32+ characters, mix of letters, numbers, symbols)
- The `CHAIN_ID=4157` is for CrossFi testnet

### Step 5: Deploy
1. Railway will automatically start building and deploying your app
2. Monitor the build logs for any errors
3. Once deployed, Railway will provide a public URL

### Step 6: Update Frontend Configuration
Update your frontend `src/utils/constants.ts`:

```typescript
// Replace with your Railway backend URL
export const BACKEND_URL = "https://your-railway-app-url.railway.app";
```

### Step 7: Test Your Deployment
1. Visit your Railway app URL
2. Test the `/health` endpoint: `https://your-app.railway.app/health`
3. Test the `/test` endpoint: `https://your-app.railway.app/test`
4. Test the `/debug/db` endpoint: `https://your-app.railway.app/debug/db`

### Troubleshooting

#### Build Errors
- Check Railway build logs
- Ensure all dependencies are in `package.json`
- Verify TypeScript compilation

#### Database Connection Issues
- Verify `MONGODB_URI` is correct
- Check if MongoDB service is running in Railway
- Test database connection with `/debug/db` endpoint

#### Environment Variables
- Ensure all required variables are set
- Check for typos in variable names
- Verify `ENCRYPTION_KEY` is properly set

#### Performance Issues
- Railway provides good performance for most use cases
- Consider upgrading to paid plan for better resources

### Monitoring
- Use Railway's built-in monitoring dashboard
- Check logs for errors and performance issues
- Monitor database connections and response times

### Scaling
- Railway automatically scales based on traffic
- Consider upgrading plan for production workloads
- Monitor resource usage in Railway dashboard

## 🎉 Success!
Your BUAI app should now be running on Railway with:
- ✅ Persistent server environment
- ✅ MongoDB database
- ✅ Proper environment variables
- ✅ Health monitoring
- ✅ Automatic scaling

## Next Steps
1. Deploy your frontend to Vercel or another hosting service
2. Update the frontend to point to your Railway backend
3. Test the complete application flow
4. Set up custom domain if needed 