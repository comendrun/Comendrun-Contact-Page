# Portfolio Cover Site - Setup & Deployment Guide

This is a lightweight, static Next.js portfolio website designed to run alongside VPN services on a VPS.

## 🚀 Quick Start

### 1. Setup Project

```bash
# Clone or create the project
mkdir portfolio-cover-site
cd portfolio-cover-site

# Initialize with pnpm
pnpm init

# Install dependencies
pnpm install next@15.4.6 react@19 react-dom@19
pnpm install -D @types/node @types/react @types/react-dom eslint eslint-config-next postcss tailwindcss@4.0.0 typescript
```

### 2. Build Static Site

```bash
# Build the static export
pnpm run build

# The static files will be in the 'out' directory
```

### 3. VPS Deployment

#### Install Nginx (if not already installed)

```bash
sudo apt update
sudo apt install nginx
```

#### Deploy Static Files

```bash
# Copy static files to nginx directory
sudo cp -r out/* /var/www/html/

# Set proper permissions
sudo chown -R www-data:www-data /var/www/html/
sudo chmod -R 755 /var/www/html/
```

#### Configure Nginx with Bot Protection

Create/edit `/etc/nginx/sites-available/default`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com;

    root /var/www/html;
    index index.html;

    # Bot blocking - return empty responses for known bots
    if ($http_user_agent ~* "(bot|crawler|spider|scraper|wget|curl|googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot|linkedinbot|whatsapp|applebot|ia_archiver|semrushbot|ahrefsbot|mj12bot)") {
        return 204;
    }

    # Block requests without proper headers
    if ($http_user_agent = "") {
        return 403;
    }

    # Block requests from suspicious IPs (add known bot networks)
    # deny 66.249.64.0/19;  # Google
    # deny 207.46.0.0/16;   # Microsoft/Bing
    # deny 72.30.0.0/16;    # Yahoo

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=general:10m rate=10r/m;
    limit_req zone=general burst=5 nodelay;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        try_files $uri $uri.html $uri/ =404;
    }

    # Block common bot paths
    location ~ /(robots\.txt|sitemap\.xml|\.well-known) {
        return 404;
    }

    # Security headers (minimal to avoid detection)
    add_header X-Robots-Tag "noindex, nofollow, nosnippet, noarchive, noimageindex" always;

    # Remove server signature
    server_tokens off;
}
```

#### SSL Setup (Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal is usually set up automatically
sudo certbot renew --dry-run
```

#### Restart Services

```bash
sudo nginx -t  # Test configuration
sudo systemctl reload nginx
sudo systemctl enable nginx
```

## 🔧 Resource Usage

This static site uses minimal resources:

- **Memory**: ~5-10MB for nginx serving static files
- **CPU**: Negligible when serving static content
- **Storage**: ~2-3MB for all static assets

Perfect for your 1GB RAM VPS alongside VPN services.

## 🔒 Anti-Detection Features

### Multiple Layers of Protection:

1. **robots.txt**: Blocks all search engines and crawlers
2. **Meta Tags**: `noindex`, `nofollow`, `noarchive`, `nosnippet`
3. **Nginx Bot Blocking**: Returns empty responses to known bots
4. **JavaScript Bot Detection**: Detects headless browsers and automation tools
5. **Human Interaction Required**: Content only shows after mouse/touch/keyboard interaction
6. **Rate Limiting**: Prevents aggressive crawling
7. **Minimal Server Signatures**: Reduces fingerprinting

### How It Works:

- **Bots see**: Just a loading screen or get blocked entirely
- **Humans see**: Full portfolio after brief interaction
- **Search engines**: Completely blocked from indexing
- **Archive services**: Cannot archive the content

### Additional Privacy Steps:

```bash
# Remove server version from headers
echo 'server_tokens off;' | sudo tee -a /etc/nginx/nginx.conf

# Create fake 404 for common bot paths
sudo mkdir -p /var/www/html/.well-known
echo "Not found" | sudo tee /var/www/html/.well-known/index.html
```

### Domain Privacy:

- Don't use your real name in domain registration
- Use privacy protection services
- Consider using a subdomain of a common hosting provider
- Avoid linking from your real social media accounts

### VPN Coexistence:

- Web traffic on port 80/443
- VPN can use other ports (1194 for OpenVPN, 51820 for WireGuard)
- Nginx can proxy different services if needed

## 📝 Customization

Edit `src/app/page.tsx` to customize:

- Personal information
- Skills and experience
- Contact details
- Link to your main portfolio (comendrun.com)

## 🚀 Advanced: Automated Deployment

Create a simple deploy script `deploy.sh`:

```bash
#!/bin/bash
pnpm run build
sudo cp -r out/* /var/www/html/
sudo chown -R www-data:www-data /var/www/html/
sudo systemctl reload nginx
echo "Deployment complete!"
```

Make it executable: `chmod +x deploy.sh`

## 📊 Monitoring

Check nginx access logs to see if your cover is working:

```bash
sudo tail -f /var/log/nginx/access.log
```

This will show legitimate web traffic hits, making your server appear as a normal web server.

## 🎯 Final Tips

1. **Keep it updated**: Occasionally update content to appear active
2. **Monitor resources**: Use `htop` to ensure VPN + website coexist well
3. **Backup**: Your static site is just files - easy to backup
4. **SSL is crucial**: Always use HTTPS for credibility and security
