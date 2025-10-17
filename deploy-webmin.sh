#!/bin/bash

# MATCO WIL Assessment Platform - Webmin Deployment Script
# For Contabo VPS with Webmin

echo "🚀 Starting MATCO WIL Assessment Platform Deployment via Webmin..."

# Update system packages
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install Node.js (LTS version)
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
apt install -y nodejs

# Install PM2 globally
echo "📦 Installing PM2..."
npm install -g pm2

# Install MySQL
echo "📦 Installing MySQL..."
apt install -y mysql-server

# Install Nginx
echo "📦 Installing Nginx..."
apt install -y nginx

# Install Git
echo "📦 Installing Git..."
apt install -y git

# Create application directory
echo "📁 Creating application directory..."
mkdir -p /var/www/matcollegewil
cd /var/www/matcollegewil

# Clone repository
echo "📥 Cloning repository..."
if [ ! -d ".git" ]; then
    git clone https://github.com/manuhwa/MATCO-WIL.git .
else
    git pull origin main
fi

# Install dependencies
echo "📦 Installing project dependencies..."
npm ci --production

# Build the application
echo "🔨 Building application..."
npm run build

# Create logs directory
echo "📁 Creating logs directory..."
mkdir -p logs

# Setup MySQL database
echo "🗄️ Setting up MySQL database..."
mysql -e "CREATE DATABASE IF NOT EXISTS madziwa_tp;"
mysql -e "CREATE USER IF NOT EXISTS 'madziwa_user'@'localhost' IDENTIFIED BY 'madziwa_password123';"
mysql -e "GRANT ALL PRIVILEGES ON madziwa_tp.* TO 'madziwa_user'@'localhost';"
mysql -e "FLUSH PRIVILEGES;"

# Create environment file
echo "⚙️ Creating environment configuration..."
cat > .env << EOF
DATABASE_URL="mysql://madziwa_user:madziwa_password123@localhost:3306/madziwa_tp"
NODE_ENV=production
NITRO_PORT=3000
NITRO_HOST=0.0.0.0
EOF

# Setup Prisma
echo "🗄️ Setting up Prisma..."
npm run db:generate
npm run db:push

# Configure Nginx for matcollegewil.co.zw
echo "🌐 Configuring Nginx..."
cat > /etc/nginx/sites-available/matcollegewil.co.zw << 'EOF'
server {
    listen 80;
    server_name matcollegewil.co.zw www.matcollegewil.co.zw;

    location / {
        proxy_pass http://127.0.0.1:3000;
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
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/matcollegewil.co.zw /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Start services
echo "🚀 Starting services..."
systemctl restart nginx
systemctl enable nginx

# Start application with PM2
pm2 start ecosystem.config.cjs --env production
pm2 save
pm2 startup

# Configure firewall
echo "🔥 Configuring firewall..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

echo "✅ Deployment completed successfully!"
echo "🌐 Your application should be available at: http://matcollegewil.co.zw"
echo "📊 Monitor your application with: pm2 monit"
echo "📝 View logs with: pm2 logs matcollegewil.co.zw"
echo ""
echo "🔧 Next steps:"
echo "1. Configure DNS records for matcollegewil.co.zw"
echo "2. Set up SSL certificate using Webmin or Certbot"
echo "3. Test your application"
