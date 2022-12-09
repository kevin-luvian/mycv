module.exports = {
  apps: [
    {
      name: "[MYCV] main #1",
      script: "./backend/bin/www",
      instances: 1,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 9000,
      },
    },
    {
      name: "[MYCV] main #2",
      script: "./backend/bin/www",
      instances: 1,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 9001,
      },
    },
    {
      name: "[MYCV] file worker #1",
      script: "./backend/bin/www",
      instances: 1,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 9002,
      },
    },
    {
      name: "[MYCV] file worker #2",
      script: "./backend/bin/www",
      instances: 1,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 9003,
      },
    },
  ],
};
