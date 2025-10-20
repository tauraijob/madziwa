#!/bin/bash

# MATCO WIL Assessment Platform - Linux to Contabo VPS Deployment
# Run this script from your local Linux machine

echo "🚀 MATCO WIL Assessment Platform - Linux Deployment to Contabo VPS"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Get VPS IP from user
read -p "Enter your Contabo VPS IP address: " VPS_IP

if [ -z "$VPS_IP" ]; then
    print_error "VPS IP address is required!"
    exit 1
fi

print_status "VPS IP: $VPS_IP"

# Check if SSH key exists
if [ ! -f ~/.ssh/id_rsa ]; then
    print_warning "SSH key not found. You may need to enter password multiple times."
    print_status "Consider setting up SSH keys for easier access:"
    echo "ssh-keygen -t rsa -b 4096 -C 'your_email@example.com'"
    echo "ssh-copy-id root@$VPS_IP"
    echo ""
fi

# Test SSH connection
print_status "Testing SSH connection to VPS..."
ssh -o ConnectTimeout=10 root@$VPS_IP "echo 'SSH connection successful'" 2>/dev/null

if [ $? -ne 0 ]; then
    print_error "Cannot connect to VPS. Please check:"
    echo "1. VPS IP address is correct"
    echo "2. SSH service is running on VPS"
    echo "3. Firewall allows SSH connections"
    echo "4. You have root access"
    exit 1
fi

print_success "SSH connection successful!"

# Upload files to VPS
print_status "Uploading application files to VPS..."
rsync -avz --progress --exclude 'node_modules' --exclude '.git' --exclude '.nuxt' --exclude '.output' . root@$VPS_IP:/var/www/matcollege/

if [ $? -ne 0 ]; then
    print_error "File upload failed!"
    exit 1
fi

print_success "Files uploaded successfully!"

# Run deployment script on VPS
print_status "Running deployment script on VPS..."
ssh root@$VPS_IP "cd /var/www/matcollege && chmod +x deploy-contabo.sh && ./deploy-contabo.sh"

if [ $? -eq 0 ]; then
    print_success "Deployment completed successfully!"
    echo ""
    echo "🌐 Your application is now available at:"
    echo "   - http://$VPS_IP"
    echo "   - http://matcollegewil.co.zw (if DNS is configured)"
    echo ""
    echo "📊 Monitor your application:"
    echo "   ssh root@$VPS_IP"
    echo "   pm2 monit"
    echo "   pm2 logs madziwa-tp-dev"
    echo ""
else
    print_error "Deployment failed! Please check the VPS logs."
    echo "SSH into your VPS and check:"
    echo "   ssh root@$VPS_IP"
    echo "   cd /var/www/matcollege"
    echo "   ./deploy-contabo.sh"
fi
