# GitHub Pages Deployment Guide

## Quick Setup for laeeqaslam.com

### Step 1: Push Your Code to GitHub
Since you already have the code in your dev branch, merge it to main:

```bash
# On your local machine or GitHub web interface
git checkout main
git merge dev
git push origin main
```

### Step 2: Enable GitHub Pages
1. Go to your repository: https://github.com/L-A-Sandhu/laeeq
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **GitHub Actions**
5. The workflow will automatically deploy when you push to main

### Step 3: Set Up Custom Domain
1. In the **Pages** section, under **Custom domain**
2. Enter: `laeeqaslam.com`
3. Click **Save**
4. GitHub will create a CNAME file in your repository

### Step 4: Configure DNS (at your domain provider)
Add these DNS records at your domain registrar:

**For Apex Domain (laeeqaslam.com):**
```
Type: A
Name: @
Value: 185.199.108.153
```

**For WWW Subdomain:**
```
Type: CNAME
Name: www
Value: l-a-sandhu.github.io
```

### Step 5: Add Secrets (Optional)
If you want Google Scholar real-time updates:
1. Go to repository **Settings** > **Secrets and variables** > **Actions**
2. Add new secret: `VITE_SCHOLAR_API_KEY`
3. Enter your Google Scholar API key

## Alternative: Static Site Version

Since GitHub Pages only serves static files, I'll create a static version of your portfolio:

### Features that will work:
✅ All 11 publications display  
✅ PDF downloads  
✅ Packages section with images  
✅ Contact form (using Formspree)  
✅ Responsive design  
✅ Fast loading  

### Features that need modification:
🔄 Citation count (will show static number: 27)  
🔄 Real-time updates (will update when you push new code)  

## Deploy Commands

```bash
# Build for production
npm run build:client

# Test locally
npx serve dist/public

# Deploy (automatic when you push to main)
git add .
git commit -m "Deploy enhanced portfolio"
git push origin main
```

## Expected Timeline
- **Code push**: Immediate
- **Build process**: 2-3 minutes
- **DNS propagation**: 5-10 minutes
- **SSL certificate**: 10-15 minutes
- **Full deployment**: 15-20 minutes

## Verification Steps
1. Visit https://laeeqaslam.com
2. Check all pages load correctly
3. Test PDF downloads
4. Verify mobile responsiveness
5. Check contact form works

## Benefits of GitHub Pages
- **Free hosting**
- **Automatic HTTPS**
- **CDN worldwide**
- **Custom domain support**
- **Automatic deployments**
- **No server maintenance**

## Next Steps After Deployment
1. Set up Google Analytics (optional)
2. Add SEO meta tags
3. Configure contact form with Formspree
4. Monitor site performance
5. Regular content updates via GitHub

Your portfolio will be live at both:
- https://l-a-sandhu.github.io/laeeq/
- https://laeeqaslam.com (after DNS setup)