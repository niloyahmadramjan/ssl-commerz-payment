import { useState } from "react";
import axios from "axios";
import "./App.css";
import PaymentStatus from "./PaymentStatus";

export default function App() {
  const [formData, setFormData] = useState({
    cus_name: "",
    cus_phone: "",
    cus_email: "",
    total_amount: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/api/payment/initiate", formData);
      if (response.data && response.data.GatewayPageURL) {
        window.location.href = response.data.GatewayPageURL;
      } else {
        alert("Payment gateway URL not found.");
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      alert("Payment failed to initiate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <PaymentStatus></PaymentStatus>
      <div className="form-box">
        <h2 className="title">SSLCommerz Payment</h2>
        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input
            type="text"
            name="cus_name"
            value={formData.cus_name}
            onChange={handleChange}
            required
          />

          <label>Phone Number</label>
          <input
            type="text"
            name="cus_phone"
            value={formData.cus_phone}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="cus_email"
            value={formData.cus_email}
            onChange={handleChange}
            required
          />

          <label>Amount (৳)</label>
          <input
            type="number"
            name="total_amount"
            value={formData.total_amount}
            onChange={handleChange}
            required
            min="1"
          />

          <button type="submit" className="pay-button" disabled={loading}>
            {loading ? "Redirecting..." : "Pay Now"}
          </button>
        </form>
      
      </div>
      
    </div>
  );
}