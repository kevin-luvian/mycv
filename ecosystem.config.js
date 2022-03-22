module.exports = {
  apps: [
    {
      name: "[MYCV] main",
      script: "./backend/bin/www",
      instances: 2,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 9000,
      },
    },
    {
      name: "[MYCV] file worker",
      script: "./backend/bin/www",
      instances: 2,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 9001,
      },
    },
  ],
};
