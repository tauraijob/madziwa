#!/bin/bash

# SSL Setup Script for matcollegewil.co.zw
# This script configures SSL certificates using Let's Encrypt

echo "🔒 Setting up SSL for matcollegewil.co.zw..."

# Install Certbot
echo "📦 Installing Certbot..."
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# Stop Nginx temporarily
echo "⏸️ Stopping Nginx..."
sudo systemctl stop nginx

# Obtain SSL certificate
echo "🔐 Obtaining SSL certificate..."
sudo certbot --nginx -d matcollegewil.co.zw -d www.matcollegewil.co.zw --non-interactive --agree-tos --email admin@matcollegewil.co.zw

# Test the configuration
echo "🧪 Testing Nginx configuration..."
sudo nginx -t

# Start Nginx
echo "▶️ Starting Nginx..."
sudo systemctl start nginx
sudo systemctl enable nginx

# Setup auto-renewal
echo "🔄 Setting up certificate auto-renewal..."
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -

echo "✅ SSL setup completed successfully!"
echo "🌐 Your application is now available at: https://matcollegewil.co.zw"
echo "🔄 Certificates will auto-renew every 12 hours"
