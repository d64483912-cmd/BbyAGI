# 🚀 BabyAGI II - Deployment Guide

Complete guide for deploying BabyAGI II to production environments.

## 📋 Pre-Deployment Checklist

- [ ] All dependencies installed (`npm install`)
- [ ] Application tested locally (`npm run dev`)
- [ ] OpenRouter API integration verified
- [ ] PWA features tested in browser
- [ ] Build command successful (`npm run build`)
- [ ] Preview build tested (`npm run preview`)

## 🏗️ Build for Production

### 1. Install Dependencies
```bash
npm install
```

### 2. Build the Application
```bash
npm run build
```

This creates an optimized production build in the `dist/` directory with:
- Minified JavaScript and CSS
- Optimized assets
- Service worker for PWA
- Manifest.json
- All static assets

### 3. Preview Production Build (Optional)
```bash
npm run preview
```

Test the production build locally before deploying.

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

**Why Vercel?**
- ✅ Zero configuration for Vite projects
- ✅ Automatic HTTPS (required for PWA)
- ✅ Global CDN
- ✅ Free tier available
- ✅ GitHub integration

**Steps:**

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Follow the prompts:**
   - Link to existing project or create new
   - Choose default settings
   - Confirm deployment

4. **Production Deployment**
   ```bash
   vercel --prod
   ```

**GitHub Integration:**
1. Push code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel auto-deploys on every push

**Custom Domain:**
1. Go to Vercel dashboard
2. Select your project
3. Settings > Domains
4. Add your custom domain

### Option 2: Netlify

**Why Netlify?**
- ✅ Simple drag-and-drop deployment
- ✅ Automatic HTTPS
- ✅ CDN included
- ✅ Free tier available

**Steps:**

1. **Build locally**
   ```bash
   npm run build
   ```

2. **Deploy via CLI**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

3. **Or deploy via web:**
   - Go to [netlify.com](https://netlify.com)
   - Drag `dist/` folder to deploy zone
   - Done!

**Configuration File** (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 3: GitHub Pages

**Why GitHub Pages?**
- ✅ Free hosting
- ✅ Integrated with GitHub
- ✅ Custom domain support

**Steps:**

1. **Install gh-pages**
   ```bash
   npm install -D gh-pages
   ```

2. **Update package.json**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://yourusername.github.io/BbyAGI"
   }
   ```

3. **Update vite.config.ts**
   ```typescript
   export default defineConfig({
     base: '/BbyAGI/', // Your repo name
     // ... rest of config
   });
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages:**
   - Go to repository Settings > Pages
   - Source: Deploy from branch
   - Branch: gh-pages, root
   - Save

### Option 4: Static Hosting (S3, Azure, GCP)

**AWS S3 + CloudFront:**

1. **Build**
   ```bash
   npm run build
   ```

2. **Create S3 bucket**
   - Enable static website hosting
   - Upload `dist/` contents

3. **Configure CloudFront**
   - Create distribution
   - Point to S3 bucket
   - Enable HTTPS
   - Configure custom domain

4. **Deploy with AWS CLI**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
   ```

### Option 5: Docker

**Why Docker?**
- ✅ Consistent environment
- ✅ Easy scaling
- ✅ Platform independent

**Dockerfile:**
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf:**
```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Build and run:**
```bash
docker build -t babyagi-ii .
docker run -p 8080:80 babyagi-ii
```

## 🔒 Security Considerations

### 1. API Key Security
- ✅ **Never** commit API keys to repository
- ✅ Keys stored in browser localStorage (client-side only)
- ✅ Users must provide their own OpenRouter API key
- ✅ No server-side API key storage needed

### 2. HTTPS Required
- ✅ PWA features require HTTPS
- ✅ Service workers require secure context
- ✅ All modern hosting providers provide free HTTPS

### 3. Content Security Policy
Add to `index.html`:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://aistudiocdn.com; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data:; 
               connect-src 'self' https://openrouter.ai;">
```

### 4. Environment Variables
No environment variables needed for production (API keys are user-provided).

## 🎯 Post-Deployment Tasks

### 1. Verify PWA Features
- [ ] Install button appears in browser
- [ ] App can be installed to home screen
- [ ] Offline mode works
- [ ] Service worker registered
- [ ] Manifest.json accessible

### 2. Test Core Functionality
- [ ] Settings modal opens
- [ ] API key validation works
- [ ] Model selection functions
- [ ] Agent can start and execute tasks
- [ ] Task history displays correctly
- [ ] PDF export works

### 3. Performance Check
- [ ] Run Lighthouse audit
- [ ] PWA score > 90
- [ ] Performance score > 90
- [ ] Accessibility score > 90
- [ ] Best Practices score > 90
- [ ] SEO score > 90

### 4. Cross-Browser Testing
Test on:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (macOS/iOS)
- [ ] Mobile browsers

## 📊 Monitoring & Analytics

### Google Lighthouse
```bash
npm install -g @lhci/cli
lhci autorun --collect.url=https://your-domain.com
```

### PWA Audit
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Select "Progressive Web App"
4. Run audit

### User Analytics (Optional)
Add Google Analytics or similar:
```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🔄 Continuous Deployment

### GitHub Actions
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 🐛 Troubleshooting Deployment

### Build Fails
**Error**: `Module not found`
**Solution**: 
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### PWA Not Working
**Error**: Service worker not registering
**Solution**:
1. Ensure HTTPS is enabled
2. Check service worker path is correct
3. Verify manifest.json is accessible
4. Clear browser cache and reinstall

### API Calls Failing
**Error**: CORS or network errors
**Solution**:
1. Check OpenRouter API is accessible
2. Verify API key is valid
3. Check browser console for specific errors
4. Ensure HTTPS is used

### Icons Not Loading
**Error**: 404 on icon requests
**Solution**:
1. Verify icons exist in `public/icons/`
2. Check paths in manifest.json
3. Ensure base URL is correct in vite.config.ts

## 📝 Deployment Checklist

Before going live:

- [ ] Build succeeds without errors
- [ ] All environment configurations set
- [ ] HTTPS enabled
- [ ] PWA features tested
- [ ] OpenRouter API integration verified
- [ ] Cross-browser compatibility checked
- [ ] Mobile responsive design verified
- [ ] Lighthouse score > 90
- [ ] Analytics set up (optional)
- [ ] Custom domain configured (optional)
- [ ] Documentation updated
- [ ] Repository cleaned (no secrets)

## 🎉 You're Live!

Your BabyAGI II instance is now deployed and accessible to users worldwide!

### Share Your Deployment
- Update README with live URL
- Share on social media
- Add to portfolio
- Submit to PWA directories

### Maintenance
- Monitor error logs
- Update dependencies regularly
- Check OpenRouter status
- Respond to user feedback
- Keep documentation current

---

**Questions?** Check the [README](./README.md) or open an issue on GitHub.

*Happy deploying! 🚀*
