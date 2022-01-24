const environments = {
  NODE_ENV: process.env.REACT_APP_NODE_ENV || "development",
  API_URL: process.env.REACT_APP_API_URL || "http://localhost:9000/api",
};
export default environments;
