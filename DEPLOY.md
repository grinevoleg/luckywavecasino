# Deployment Guide - DigitalOcean App Platform

## Quick Start

### 1. Via DigitalOcean Dashboard (Easiest)

1. **Go to DigitalOcean App Platform**
   - Visit: https://cloud.digitalocean.com/apps
   - Sign in or create an account

2. **Create New App**
   - Click "Create App" button
   - Select "GitHub" as source
   - Authorize DigitalOcean to access your GitHub

3. **Select Repository**
   - Choose `grinevoleg/luckywavecasino`
   - Select branch: `main`
   - Enable "Autodeploy" if you want auto-deploy on push

4. **Configure App**
   - DigitalOcean will auto-detect it's a static site from `.do/app.yaml`
   - Review the configuration:
     - **Type**: Static Site
     - **Build Command**: (empty)
     - **Output Directory**: `/`
     - **Index Document**: `index.html`
     - **Error Document**: `index.html`

5. **Deploy**
   - Click "Create Resources"
   - Wait for deployment (usually 2-5 minutes)
   - Your app will be live at: `https://your-app-name.ondigitalocean.app`

### 2. Via DigitalOcean CLI

#### Install doctl

**macOS:**
```bash
brew install doctl
```

**Linux:**
```bash
cd ~
wget https://github.com/digitalocean/doctl/releases/download/v1.104.0/doctl-1.104.0-linux-amd64.tar.gz
tar xf doctl-1.104.0-linux-amd64.tar.gz
sudo mv doctl /usr/local/bin
```

**Windows:**
Download from: https://github.com/digitalocean/doctl/releases

#### Authenticate

```bash
doctl auth init
```

Enter your DigitalOcean API token (get it from: https://cloud.digitalocean.com/account/api/tokens)

#### Deploy

```bash
doctl apps create --spec .do/app.yaml
```

#### Update App

After making changes and pushing to GitHub:

```bash
# If auto-deploy is enabled, it will deploy automatically
# Otherwise, update manually:
doctl apps update <app-id> --spec .do/app.yaml
```

## Configuration File

The `.do/app.yaml` file contains:

```yaml
name: lucky-wave-casino
region: nyc
static_sites:
  - name: lucky-wave-casino
    github:
      repo: grinevoleg/luckywavecasino
      branch: main
      deploy_on_push: true
    build_command: ""
    output_dir: /
    index_document: index.html
    error_document: index.html
    catchall_document: index.html
```

### Customization

You can modify `.do/app.yaml` to:
- Change region (nyc, sfo, ams, sgp, etc.)
- Change app name
- Add environment variables
- Configure custom domains
- Set up health checks

## Environment Variables

To add environment variables:

1. **Via Dashboard:**
   - Go to your app settings
   - Navigate to "App-Level Environment Variables"
   - Add variables as needed

2. **Via CLI:**
```bash
doctl apps update <app-id> --spec .do/app.yaml
```

Then edit `.do/app.yaml` to add:
```yaml
envs:
  - key: MY_VAR
    value: my_value
    scope: RUN_TIME
```

## Custom Domain

1. Go to your app settings
2. Navigate to "Domains"
3. Click "Add Domain"
4. Enter your domain
5. Follow DNS configuration instructions

## Monitoring

- **Logs**: View in DigitalOcean dashboard under "Runtime Logs"
- **Metrics**: Available in "Metrics" tab
- **Alerts**: Set up in "Alerts" section

## Troubleshooting

### Build Fails
- Check that `index.html` exists in root
- Verify all paths in HTML are correct
- Check build logs in dashboard

### 404 Errors
- Ensure `catchall_document: index.html` is set
- Verify SPA routing is configured

### Assets Not Loading
- Check file paths (use relative paths)
- Verify all assets are committed to git
- Check browser console for errors

## Cost

DigitalOcean App Platform pricing:
- **Static Sites**: Free tier available (with limitations)
- **Paid Plans**: Starting at $5/month
- Check current pricing: https://www.digitalocean.com/pricing/app-platform

## Support

- **Documentation**: https://docs.digitalocean.com/products/app-platform/
- **Community**: https://www.digitalocean.com/community/tags/app-platform
- **Support**: https://cloud.digitalocean.com/support


