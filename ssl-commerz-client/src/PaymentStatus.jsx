import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";


const PaymentStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/success") {
      Swal.fire("✅ Payment Successful!", "Thank you for your payment.", "success");
      navigate("/")
    } else if (location.pathname === "/fail") {
      Swal.fire("❌ Payment Failed", "Something went wrong. Please try again.", "error");
      navigate("/")
    } else if (location.pathname === "/cancel") {
      Swal.fire("⚠️ Payment Cancelled", "You cancelled the payment.", "warning");
      navigate("/")
    } else if (location.pathname === "/invalid") {
      Swal.fire("⚠️ Invalid Payment", "Payment was not valid.", "warning");
      navigate("/")
    } else if (location.pathname === "/error") {
      Swal.fire("❌ Server Error", "An error occurred while processing payment.", "error");
      navigate("/")
    }
  }, [location.pathname]);

  return null; // You don't need to render anything
};

export default PaymentStatus;
