module.exports = {
  apps: [
    {
      name: "[MYCV] main",
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
      name: "[MYCV] file worker",
      script: "./backend/bin/www",
      instances: 2,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        MONGO_DB:
          "mongodb://root:password@localhost:27017/mongodb?authSource=admin&retryWrites=true&w=majority",
        PORT: 9001,
      },
    },
  ],
};
