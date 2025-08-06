const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const paymentRoutes = require("./routes/payment.routes");

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("✅ SSLCommerz backend running");
});

app.use("/api/payment", paymentRoutes);

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
