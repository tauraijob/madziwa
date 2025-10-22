# 🚀 Contabo VPS Deployment Guide

## Quick Deployment Steps

### Option 1: Automated Deployment (Recommended)

1. **Run the Windows deployment script:**
   ```cmd
   deploy-contabo-windows.bat
   ```
   - Enter your VPS IP when prompted
   - Follow the on-screen instructions

### Option 2: Manual Deployment

1. **Upload files to VPS:**
   ```bash
   scp -r . root@YOUR_VPS_IP:/var/www/matcollege/
   ```

2. **SSH into your VPS:**
   ```bash
   ssh root@YOUR_VPS_IP
   cd /var/www/matcollege
   ```

3. **Run the deployment script:**
   ```bash
   chmod +x deploy-contabo.sh
   ./deploy-contabo.sh
   ```

## What the Deployment Script Does

- ✅ Updates system packages
- ✅ Installs Node.js LTS
- ✅ Installs PM2 process manager
- ✅ Installs MySQL database
- ✅ Installs Nginx web server
- ✅ Clones/updates the repository
- ✅ Installs project dependencies
- ✅ Sets up MySQL database and user
- ✅ Configures environment variables
- ✅ Sets up Prisma database schema
- ✅ Configures Nginx reverse proxy
- ✅ Starts the application with PM2
- ✅ Configures firewall rules

## After Deployment

### Access Your Application
- **Direct IP:** http://YOUR_VPS_IP
- **Domain:** http://matcollegewil.co.zw (if DNS configured)

### Monitor Your Application
```bash
# View application status
pm2 status

# View logs
pm2 logs madziwa-tp-dev

# Monitor in real-time
pm2 monit

# Restart application
pm2 restart madziwa-tp-dev
```

### Database Access
- **Database:** madziwa_tp
- **User:** madziwa_user
- **Password:** madziwa_password123

### Useful Commands
```bash
# Restart application
pm2 restart madziwa-tp-dev

# Stop application
pm2 stop madziwa-tp-dev

# Start application
pm2 start madziwa-tp-dev

# Delete application
pm2 delete madziwa-tp-dev

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

## Troubleshooting

### If deployment fails:
1. Check VPS IP address
2. Ensure SSH access is working
3. Verify VPS has enough resources (1GB RAM minimum)
4. Check if ports 80 and 443 are open

### If application doesn't start:
1. Check logs: `pm2 logs madziwa-tp-dev`
2. Verify database connection
3. Check if port 3000 is available
4. Restart services: `systemctl restart nginx`

### If domain doesn't work:
1. Ensure DNS A record points to your VPS IP
2. Check Nginx configuration: `nginx -t`
3. Restart Nginx: `systemctl restart nginx`

## Security Notes

- Change default database password
- Set up SSL certificate (Let's Encrypt)
- Configure firewall rules
- Regular system updates

## Support

If you encounter issues:
1. Check the logs first
2. Verify all services are running
3. Ensure database is accessible
4. Check network connectivity
