@echo off
echo 🚀 MATCO WIL Assessment Platform - Windows Deployment Helper
echo.

echo 📋 Pre-deployment Checklist:
echo.
echo 1. Ensure you have SSH access to your Contabo VPS
echo 2. Make sure your domain matcollege.co.zw points to your VPS IP
echo 3. Have your VPS root/sudo password ready
echo.

pause

echo 📤 Uploading files to VPS...
echo.

REM Upload the project files to VPS
echo Uploading project files...
scp -r . root@YOUR_VPS_IP:/var/www/matcollege/

echo.
echo 📋 Next steps on your VPS:
echo.
echo 1. SSH into your VPS: ssh root@YOUR_VPS_IP
echo 2. Navigate to project: cd /var/www/matcollege
echo 3. Make deploy script executable: chmod +x deploy.sh
echo 4. Run deployment: ./deploy.sh
echo.

echo 🔧 Manual VPS Commands (if needed):
echo.
echo # Update system
echo sudo apt update && sudo apt upgrade -y
echo.
echo # Install Node.js
echo curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
echo sudo apt install -y nodejs
echo.
echo # Install PM2
echo sudo npm install -g pm2
echo.
echo # Install MySQL and Nginx
echo sudo apt install -y mysql-server nginx
echo.
echo # Clone repository
echo git clone https://github.com/manuhwa/MATCO-WIL.git /var/www/matcollege
echo cd /var/www/matcollege
echo.
echo # Install dependencies and build
echo npm ci --production
echo npm run build
echo.
echo # Setup database
echo sudo mysql -e "CREATE DATABASE madziwa_tp;"
echo.
echo # Start with PM2
echo pm2 start ecosystem.config.cjs --env production
echo pm2 save
echo pm2 startup
echo.

pause
