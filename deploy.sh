#!/bin/bash

# MATCO WIL Assessment Platform Deployment Script
# For Contabo VPS deployment

echo "🚀 Starting MATCO WIL Assessment Platform Deployment..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js (LTS version)
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Install MySQL
echo "📦 Installing MySQL..."
sudo apt install -y mysql-server

# Install Nginx
echo "📦 Installing Nginx..."
sudo apt install -y nginx

# Install Git
echo "📦 Installing Git..."
sudo apt install -y git

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /var/www/matcollege
sudo chown -R $USER:$USER /var/www/matcollege

# Clone repository (if not already cloned)
echo "📥 Cloning repository..."
cd /var/www/matcollege
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
sudo mysql -e "CREATE DATABASE IF NOT EXISTS madziwa_tp;"
sudo mysql -e "CREATE USER IF NOT EXISTS 'madziwa_user'@'localhost' IDENTIFIED BY 'madziwa_password123';"
sudo mysql -e "GRANT ALL PRIVILEGES ON madziwa_tp.* TO 'madziwa_user'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

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

# Configure Nginx
echo "🌐 Configuring Nginx..."
sudo tee /etc/nginx/sites-available/matcollege.co.zw > /dev/null << EOF
server {
    listen 80;
    server_name matcollege.co.zw www.matcollege.co.zw;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/matcollege.co.zw /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Start services
echo "🚀 Starting services..."
sudo systemctl restart nginx
sudo systemctl enable nginx

# Start application with PM2
pm2 start ecosystem.config.cjs --env production
pm2 save
pm2 startup

# Configure firewall
echo "🔥 Configuring firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

echo "✅ Deployment completed successfully!"
echo "🌐 Your application should be available at: http://matcollege.co.zw"
echo "📊 Monitor your application with: pm2 monit"
echo "📝 View logs with: pm2 logs matcollege.co.zw"
