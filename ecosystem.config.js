module.exports = {
  apps: [
    {
      name: "[MYCV] main",
      script: "./backend/bin/www",
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 9000,
      },
    },
    {
      name: "[MYCV] file worker 1",
      script: "./backend/bin/www",
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 9001,
      },
    },
    {
      name: "[MYCV] file worker 2",
      script: "./backend/bin/www",
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 9002,
      },
    },
    {
      name: "[MYCV] file worker 3",
      script: "./backend/bin/www",
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 9003,
      },
    },
  ],
};
