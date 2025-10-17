#!/bin/bash

# SSL Setup Script for matcollegewil.co.zw using Webmin
# This script can be run after basic deployment

echo "🔒 Setting up SSL for matcollegewil.co.zw..."

# Install Certbot
echo "📦 Installing Certbot..."
apt update
apt install -y certbot python3-certbot-nginx

# Stop Nginx temporarily
echo "⏸️ Stopping Nginx..."
systemctl stop nginx

# Obtain SSL certificate
echo "🔐 Obtaining SSL certificate..."
certbot --nginx -d matcollegewil.co.zw -d www.matcollegewil.co.zw --non-interactive --agree-tos --email admin@matcollegewil.co.zw

# Test the configuration
echo "🧪 Testing Nginx configuration..."
nginx -t

# Start Nginx
echo "▶️ Starting Nginx..."
systemctl start nginx
systemctl enable nginx

# Setup auto-renewal
echo "🔄 Setting up certificate auto-renewal..."
echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -

echo "✅ SSL setup completed successfully!"
echo "🌐 Your application is now available at: https://matcollegewil.co.zw"
echo "🔄 Certificates will auto-renew every 12 hours"
