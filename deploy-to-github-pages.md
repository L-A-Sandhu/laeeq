# 🚀 Deploy Your Portfolio to GitHub Pages

## Step-by-Step Guide to Deploy laeeqaslam.com

### Step 1: Upload These Files to Your Repository

Copy these files I created to your GitHub repository:

1. **`.github/workflows/deploy.yml`** - Automatic deployment workflow
2. **`build-static.js`** - Static build script  
3. **`static.json`** - Static site configuration
4. **`vite.config.production.ts`** - Production build config
5. **`github-pages-setup.md`** - This setup guide

### Step 2: Merge Dev Branch to Main

In your GitHub repository:

```bash
# Switch to main branch
git checkout main

# Merge dev branch
git merge dev

# Push to main
git push origin main
```

Or use GitHub web interface:
1. Go to https://github.com/L-A-Sandhu/laeeq
2. Click "Compare & pull request" 
3. Create pull request from `dev` to `main`
4. Click "Merge pull request"

### Step 3: Enable GitHub Pages

1. Go to your repository: **https://github.com/L-A-Sandhu/laeeq**
2. Click **Settings** tab
3. Scroll down to **Pages** section (left sidebar)
4. Under **Source**, select **GitHub Actions**
5. Save the settings

### Step 4: Set Custom Domain

1. In the **Pages** section, under **Custom domain**
2. Enter: `laeeqaslam.com`
3. Click **Save**
4. Check **Enforce HTTPS**

### Step 5: Configure DNS (at your domain provider)

Go to your domain registrar (where you bought laeeqaslam.com) and add these DNS records:

**For Root Domain:**
```
Type: A
Name: @ (or root)
Value: 185.199.108.153
```

**For WWW Subdomain:**
```
Type: CNAME  
Name: www
Value: l-a-sandhu.github.io
```

### Step 6: Trigger Deployment

The deployment will start automatically when you push to main. You can also:

1. Go to **Actions** tab in your repository
2. Click on the latest workflow run
3. Check if it's building successfully

### Step 7: Wait for Deployment

- **Build time**: 3-5 minutes
- **DNS propagation**: 10-15 minutes  
- **SSL certificate**: 15-20 minutes
- **Total time**: 20-30 minutes

### Step 8: Verify Your Website

Visit these URLs to confirm everything works:

- **Primary**: https://laeeqaslam.com
- **Backup**: https://l-a-sandhu.github.io/laeeq/

**Test these features:**
✅ Home page loads with hero section  
✅ Publications page shows 11 papers  
✅ PDF downloads work  
✅ 27 citations display correctly  
✅ Packages section shows 6 tools  
✅ Mobile responsive design  
✅ Contact form works  
✅ Fast loading speed  

## What GitHub Pages Provides

### ✅ **Free Features:**
- **Free hosting** (unlimited bandwidth for public repos)
- **Custom domain** support (laeeqaslam.com)
- **Automatic HTTPS** with SSL certificates
- **CDN worldwide** for fast loading
- **Automatic deployments** when you push code
- **No server maintenance** required

### ✅ **Your Portfolio Features:**
- **11 Research Publications** with PDF downloads
- **27 Citations** with tracking
- **6 Package Tools** with custom images
- **Professional Design** with academic theme
- **Mobile Responsive** layout
- **Contact Form** integration
- **Fast Performance** with optimized builds

### 🔄 **Limitations & Solutions:**
- **No server-side code** → Static site with client-side features
- **No database** → Publications stored in JSON files
- **No real-time updates** → Citations update when you push new code
- **Contact form** → Will use Formspree or email links

## Maintenance & Updates

### To update your website:
1. Edit files in your repository
2. Push changes to main branch
3. Website updates automatically in 3-5 minutes

### To add new publications:
1. Edit `client/src/lib/publications.ts`
2. Add PDF files to `client/public/papers/`
3. Push changes to GitHub

### To update citations:
1. Edit citation count in `server/storage.ts`
2. Push changes to GitHub

## Troubleshooting

### If deployment fails:
1. Check **Actions** tab for error messages
2. Verify all files are in the repository
3. Check Node.js version compatibility

### If domain doesn't work:
1. Verify DNS settings at your domain provider
2. Wait 24 hours for DNS propagation
3. Check CNAME file exists in repository

### If SSL doesn't work:
1. Wait 24 hours for certificate generation
2. Ensure "Enforce HTTPS" is enabled
3. Contact GitHub support if needed

## Support

- **GitHub Pages Documentation**: https://docs.github.com/en/pages
- **Custom Domain Setup**: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site
- **Troubleshooting**: https://docs.github.com/en/pages/getting-started-with-github-pages/troubleshooting-jekyll-build-errors-for-github-pages-sites

Your professional portfolio will be live at **https://laeeqaslam.com** within 30 minutes! 🎉