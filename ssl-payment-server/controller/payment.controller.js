const { v4: uuidv4 } = require('uuid');
const axios = require('axios');


const initiatePayment = async (req, res) => {
  const { cus_name, cus_phone, cus_email, total_amount } = req.body;

  const txs_id = uuidv4();

  const data = {
    store_id: process.env.STORE_ID,
    store_passwd: process.env.STORE_PASS,
    total_amount: parseFloat(total_amount),
    currency: "BDT",
    tran_id: `Inv-${txs_id}`,

    success_url: "https://localhost:300/payment/success",
    fail_url: "https://localhost:300/payment/fail",
    cancel_url: "https://localhost:300/payment/cancel",
    ipn_url: "https://localhost:300/payment/ipn",

    product_name: "T-shirt",
    product_category: "clothing",
    product_profile: "general",

    cus_name,
    cus_email,
    cus_add1: "123 Street",
    cus_add2: "Sector 10",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1207",
    cus_country: "Bangladesh",
    cus_phone,

    shipping_method: "Courier",
    ship_name: cus_name,
    ship_add1: "123 Street",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: "1207",
    ship_country: "Bangladesh",

    value_a: txs_id,
    value_b: "custom_b",
    value_c: "custom_c",
    value_d: "custom_d"
  };

  try {
    const response = await axios({
      method: "POST",
      url: "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
      data: data, 
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    console.log("SSLCommerz Response:", response.data);

    const gatewayURL = response.data?.GatewayPageURL;

    if (gatewayURL) {
      return res.status(200).json({ GatewayPageURL: gatewayURL });
    } else {
      return res.status(500).json({ error: "Payment initiation failed", response: response.data });
    }
  } catch (error) {
    console.error("SSLCommerz Error:", error?.response?.data || error.message);
    return res.status(500).json({ error: "Something went wrong", details: error.message });
  }
};

module.exports = { initiatePayment };
