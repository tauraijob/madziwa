module.exports = {
  apps: [
    {
      name: 'madziwa-tp-dev',
      cwd: __dirname,
      script: 'npm',
      args: 'run dev',
      // Process management
      instances: 1,
      exec_mode: 'fork',
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
        DATABASE_URL: 'mysql://root:@localhost:3306/madziwa_tp'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
