const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://your-backend-domain.com"; // 🔁 Update this before deployment

export default API_BASE_URL;
