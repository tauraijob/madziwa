module.exports = {
  apps: [
    {
      name: 'matcollegewil.co.zw',
      port: '3031',
      exec_mode: 'cluster',
      instances: '1',
      script: './.output/server/index.mjs',
    
    }
  ]
  }