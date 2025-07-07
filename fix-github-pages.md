# Fix GitHub Pages README Issue

## Problem
GitHub Pages is showing the README.md instead of your portfolio website.

## Solution
You need to configure GitHub Pages to serve the built website files instead of the repository root.

## Quick Fix Steps

### Step 1: Update Your Repository Settings
1. Go to https://github.com/L-A-Sandhu/laeeq/settings/pages
2. Under **Source**, make sure **GitHub Actions** is selected
3. If you see **Deploy from a branch**, change it to **GitHub Actions**

### Step 2: Update Your Build Configuration
In your repository, update the `.github/workflows/deploy.yml` file with this content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build application
      run: |
        npm run build:client
        echo "laeeqaslam.com" > dist/public/CNAME
        touch dist/public/.nojekyll
      env:
        NODE_ENV: production
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist/public
        cname: laeeqaslam.com
```

### Step 3: Alternative - Use GitHub Pages Branch Method

If the Actions method doesn't work, try this:

1. In your repository settings, under **Pages**
2. Source: **Deploy from a branch**
3. Branch: **gh-pages**
4. Folder: **/ (root)**

### Step 4: Create a Simple Index.html (Temporary)
Create this file at the root of your repository as `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laeeq Aslam - Portfolio</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .container { max-width: 800px; margin: 0 auto; }
        h1 { color: #2563eb; }
        p { color: #666; }
        .btn { background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Laeeq Aslam</h1>
        <p>Machine Learning Engineer & AI Researcher</p>
        <p>Portfolio website is being deployed. Please check back in a few minutes.</p>
        <a href="/laeeq" class="btn">View Portfolio</a>
    </div>
</body>
</html>
```

### Step 5: Check Your Live Site
After making these changes:
1. Wait 3-5 minutes for GitHub to rebuild
2. Visit https://l-a-sandhu.github.io/laeeq/
3. Check if your portfolio loads correctly

### Step 6: Verify Domain Setup
If using custom domain:
1. DNS A record: `185.199.108.153` for `laeeqaslam.com`
2. DNS CNAME: `l-a-sandhu.github.io` for `www.laeeqaslam.com`

## Expected Result
Your portfolio should show:
- Hero section with your name and title
- About section with your background
- Publications page with 11 research papers
- Packages section with 6 tools
- Contact form

## If Still Showing README
1. Check the **Actions** tab for build errors
2. Verify the `dist/public` folder contains your built files
3. Make sure GitHub Pages source is set to **GitHub Actions**
4. Clear your browser cache and try again

## Alternative Quick Fix
If nothing works, you can:
1. Create a new repository specifically for GitHub Pages
2. Upload only the built files from `dist/public`
3. Enable GitHub Pages on that repository
4. Point your domain to the new repository

The issue is that GitHub Pages is serving the repository root (which contains README.md) instead of the built website files in the `dist/public` folder.