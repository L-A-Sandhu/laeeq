#!/usr/bin/env node

// Static build script for GitHub Pages deployment
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building static site for GitHub Pages...');

// Build the client
console.log('📦 Building React frontend...');
try {
  execSync('npm run build:client', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Frontend build failed:', error.message);
  process.exit(1);
}

// Create necessary files for GitHub Pages
console.log('📄 Creating GitHub Pages files...');

// Create CNAME file for custom domain
const cname = 'laeeqaslam.com';
fs.writeFileSync(path.join('dist', 'public', 'CNAME'), cname);

// Create .nojekyll file to prevent Jekyll processing
fs.writeFileSync(path.join('dist', 'public', '.nojekyll'), '');

// Create a simple 404.html for better routing
const notFoundHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Not Found - Laeeq Aslam</title>
    <script>
        // Simple client-side routing for GitHub Pages
        window.location.href = '/';
    </script>
</head>
<body>
    <p>Redirecting to homepage...</p>
</body>
</html>
`;

fs.writeFileSync(path.join('dist', 'public', '404.html'), notFoundHtml);

console.log('✅ Static build completed successfully!');
console.log('📁 Files ready in ./dist/public directory');
console.log('🌐 Deploy to GitHub Pages by pushing to main branch');