import { useEffect } from "react";
import { useLocation } from "react-router";
import Swal from "sweetalert2";

const PaymentStatus = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/success") {
      Swal.fire("✅ Payment Successful!", "Thank you for your payment.", "success");
    } else if (location.pathname === "/fail") {
      Swal.fire("❌ Payment Failed", "Something went wrong. Please try again.", "error");
    } else if (location.pathname === "/cancel") {
      Swal.fire("⚠️ Payment Cancelled", "You cancelled the payment.", "warning");
    } else if (location.pathname === "/invalid") {
      Swal.fire("⚠️ Invalid Payment", "Payment was not valid.", "warning");
    } else if (location.pathname === "/error") {
      Swal.fire("❌ Server Error", "An error occurred while processing payment.", "error");
    }
  }, [location.pathname]);

  return null; // You don't need to render anything
};

export default PaymentStatus;
