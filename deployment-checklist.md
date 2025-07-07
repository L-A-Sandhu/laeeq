# Deployment Checklist for laeeqaslam.com

## Pre-Deployment Checklist ✅

### 1. Files Ready for Transfer
- [ ] Complete `client/` directory with all React components
- [ ] Complete `server/` directory with Express backend
- [ ] `shared/` directory with database schemas
- [ ] All configuration files (vite.config.ts, tailwind.config.ts, etc.)
- [ ] `package.json` with all dependencies
- [ ] `.gitignore` file
- [ ] `README.md` documentation

### 2. Build & Test Locally
- [ ] Run `npm install` successfully
- [ ] Run `npm run dev` - application starts on port 5000
- [ ] Test all pages: Home, Publications, Contact
- [ ] Verify all 11 publications display correctly
- [ ] Check PDF download functionality
- [ ] Test citation counter (shows 27 citations)
- [ ] Verify Packages section with 6 tools
- [ ] Test responsive design on mobile

### 3. Database & Environment
- [ ] Database connection string ready
- [ ] Environment variables configured
- [ ] Google Scholar API key (if using real-time updates)

## Ubuntu Server Deployment Steps

### Step 1: Access Your Server
```bash
# SSH into your Ubuntu server
ssh your-username@your-server-ip
cd /path/to/your/website/directory
```

### Step 2: Create Development Branch
```bash
# Create dev branch for testing
git checkout -b dev

# Or switch to existing dev branch
git checkout dev
```

### Step 3: Transfer Files
Choose one method:

**Method A: Direct Copy (Recommended)**
```bash
# From your local machine, copy all files
scp -r /path/to/replit/project/* username@server:/path/to/website/
```

**Method B: Git Push**
```bash
# Add all files to git
git add .
git commit -m "Enhanced portfolio with publications and real-time citations"
git push origin dev
```

### Step 4: Install Dependencies
```bash
# Install Node.js 18+ if needed
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install project dependencies
npm install

# Install PM2 for process management
sudo npm install -g pm2
```

### Step 5: Environment Configuration
```bash
# Create environment file
nano .env

# Add these variables:
NODE_ENV=production
PORT=5000
DATABASE_URL=your_database_connection_string
VITE_SCHOLAR_API_KEY=your_google_scholar_api_key
```

### Step 6: Build Application
```bash
# Build frontend
npm run build:client

# Build backend  
npm run build:server

# Or build both
npm run build
```

### Step 7: Test on Dev Branch
```bash
# Start application
npm start

# Or use PM2
pm2 start dist/index.js --name "laeeq-portfolio-dev"
```

### Step 8: Configure Web Server
Update your Nginx configuration:
```nginx
server {
    listen 80;
    server_name laeeqaslam.com www.laeeqaslam.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Step 9: Test Live Website
Visit: `http://laeeqaslam.com`

**Critical Tests:**
- [ ] Home page loads with hero section
- [ ] About section displays correctly
- [ ] Research areas show properly
- [ ] Packages section shows 6 tools with images
- [ ] Contact form works
- [ ] Publications page loads
- [ ] All 11 publications display
- [ ] PDF downloads work for all papers
- [ ] Citation count shows 27
- [ ] Statistics show: 11 total, 8 journal, 3 conference
- [ ] Responsive design works on mobile
- [ ] Citation refresh button works

### Step 10: If Tests Pass - Deploy to Main
```bash
# Switch to main branch
git checkout main

# Merge dev into main
git merge dev

# Push to main
git push origin main

# Restart production service
pm2 restart laeeq-portfolio
```

## Post-Deployment Tasks

### Security & Performance
- [ ] Set up SSL certificate (Let's Encrypt)
- [ ] Configure firewall rules
- [ ] Enable gzip compression
- [ ] Set up log rotation

### Monitoring
- [ ] Configure PM2 monitoring
- [ ] Set up automated backups
- [ ] Monitor server resources

### Testing
- [ ] Test from different devices
- [ ] Check loading speeds
- [ ] Verify all functionality works
- [ ] Test contact form submissions

## Rollback Plan (if needed)
```bash
# Switch back to previous version
git checkout main
git reset --hard HEAD~1

# Restart services
pm2 restart laeeq-portfolio
```

## Support Commands
```bash
# Check application logs
pm2 logs laeeq-portfolio

# Monitor resources
htop

# Check port usage
sudo netstat -tulpn | grep :5000

# Restart services
pm2 restart laeeq-portfolio
sudo systemctl restart nginx
```

## Success Criteria ✅
- [ ] Website loads at laeeqaslam.com
- [ ] All pages function correctly
- [ ] PDF downloads work
- [ ] Citation tracking works
- [ ] Mobile responsive
- [ ] Fast loading times
- [ ] No console errors

## Contact for Support
If you encounter issues during deployment, check:
1. Server logs: `pm2 logs laeeq-portfolio`
2. Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Application status: `pm2 status`