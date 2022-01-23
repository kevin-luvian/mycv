module.exports = {
  apps: [
    {
      name: "[MYCV] main cluster",
      script: "./backend/bin/www",
      instances: 2,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        API_URL: "https://mycv.atkev.tech/api",
        PORT: 9000,
      },
    },
    {
      name: "[MYCV] worker 1",
      script: "./backend/bin/www",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        API_URL: "http://localhost:9001/api",
        PORT: 9001,
      },
    },
  ],
};
