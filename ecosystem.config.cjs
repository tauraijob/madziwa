/**
 * PM2 ecosystem configuration for production deployment on a VPS (e.g., Contabo).
 *
 * Usage on the VPS (run from the `madziwa` project directory):
 * 1) npm ci
 * 2) npm run build
 * 3) pm2 start config.cjs --env production
 * 4) pm2 save && pm2 startup
 */

module.exports = {
  apps: [
    {
      name: 'matcollegewil.co.zw',
      cwd: __dirname,
      // Run the built Nuxt Nitro server output
      script: 'node',
      args: '.output/server/index.mjs',
      // Process management
      instances: 1, // set to 'max' to use all CPU cores (cluster mode)
      exec_mode: 'fork', // use 'cluster' if you set instances > 1
      watch: false,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 5000,
      // Logs
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // Environment
      env: {
        NODE_ENV: 'production',
        PORT: '3000',
        HOST: '0.0.0.0',
        // Update this with your actual production database connection URL
        DATABASE_URL: 'mysql://root:@localhost:3306/madziwa'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};


