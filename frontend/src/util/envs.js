import dotenv from "react-dotenv";

const environments = {
  NODE_ENV: dotenv?.NODE_ENV || "development",
  API_URL: dotenv?.API_URL || "http://localhost:9000/api",
};
export default environments;
