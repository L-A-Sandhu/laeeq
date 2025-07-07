# Deployment Guide for laeeqaslam.com

## Step 1: Prepare Your Local Repository Files

First, download/copy these files from your Replit project to your local machine:

### Key Files to Copy:
```
├── client/              # Complete React frontend
├── server/              # Express backend
├── shared/              # Shared schemas
├── package.json         # Dependencies
├── package-lock.json    # Lock file
├── vite.config.ts       # Vite configuration
├── tailwind.config.ts   # Tailwind CSS config
├── tsconfig.json        # TypeScript config
├── postcss.config.js    # PostCSS config
├── drizzle.config.ts    # Database config
├── .gitignore           # Git ignore rules
└── README.md            # Documentation
```

## Step 2: Connect to Your Ubuntu Server

```bash
# SSH into your Ubuntu server
ssh your-username@your-server-ip

# Navigate to your website directory
cd /path/to/your/website/directory
```

## Step 3: Create Development Branch

```bash
# Create and switch to dev branch
git checkout -b dev

# Or if dev branch exists, switch to it
git checkout dev
```

## Step 4: Upload Your Files

### Option A: Using SCP (from your local machine)
```bash
# Copy all files to your server
scp -r /path/to/your/replit/project/* username@your-server:/path/to/website/directory/
```

### Option B: Using Git (if you have the files in a separate repo)
```bash
# Add files to dev branch
git add .
git commit -m "Add enhanced portfolio with publications and real-time citations"
git push origin dev
```

## Step 5: Install Dependencies on Server

```bash
# Install Node.js 18+ if not already installed
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install project dependencies
npm install

# Install PM2 for process management
sudo npm install -g pm2
```

## Step 6: Environment Setup

Create `.env` file on your server:
```bash
nano .env
```

Add these environment variables:
```
NODE_ENV=production
PORT=5000
DATABASE_URL=your_database_connection_string
VITE_SCHOLAR_API_KEY=your_google_scholar_api_key
```

## Step 7: Build the Application

```bash
# Build the frontend
npm run build:client

# Build the backend
npm run build:server

# Or build both at once
npm run build
```

## Step 8: Test the Application

```bash
# Start the application
npm start

# Or use PM2 for production
pm2 start dist/index.js --name "laeeq-portfolio"
```

## Step 9: Configure Nginx (if using)

Create/update your Nginx configuration:
```bash
sudo nano /etc/nginx/sites-available/laeeqaslam.com
```

Add this configuration:
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
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/laeeqaslam.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 10: Start Services

```bash
# Start with PM2
pm2 start dist/index.js --name "laeeq-portfolio"
pm2 startup
pm2 save

# Check status
pm2 status
```

## Step 11: Test Your Website

Visit: `http://laeeqaslam.com`

Check that:
- ✅ Home page loads correctly
- ✅ Publications page shows all 11 papers
- ✅ PDF downloads work
- ✅ Citation count shows 27
- ✅ Packages section displays properly
- ✅ Contact form works
- ✅ Responsive design works on mobile

## Step 12: If Everything Works - Merge to Main

```bash
# Switch to main branch
git checkout main

# Merge dev into main
git merge dev

# Push to main
git push origin main
```

## Troubleshooting

### Common Issues:

1. **Port Issues**: Make sure port 5000 is available or change it in your configuration
2. **Permission Issues**: Use `sudo` for system-level operations
3. **Database Connection**: Ensure your database is accessible from the server
4. **Build Errors**: Check Node.js version (needs 18+)

### Useful Commands:

```bash
# Check application logs
pm2 logs laeeq-portfolio

# Restart application
pm2 restart laeeq-portfolio

# Stop application
pm2 stop laeeq-portfolio

# Check system resources
htop

# Check port usage
sudo netstat -tulpn | grep :5000
```

## Security Notes:

- Ensure your `.env` file is in `.gitignore`
- Keep your server and dependencies updated
- Use HTTPS (Let's Encrypt) for production
- Set up proper firewall rules

## Next Steps After Successful Deployment:

1. Set up SSL certificate with Let's Encrypt
2. Configure automatic backups
3. Set up monitoring with PM2
4. Enable gzip compression in Nginx
5. Set up log rotation