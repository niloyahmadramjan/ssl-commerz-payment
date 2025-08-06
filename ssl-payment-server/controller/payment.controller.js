const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const { client } = require("../config/db");

// Save to MongoDB
      const db = client.db("ssl-payment");
      const PaymentCollection = db.collection("payment-history");


const initiatePayment = async (req, res) => {
  const { cus_name, cus_phone, cus_email, total_amount } = req.body;

  const txs_id = uuidv4();

   
  const data = {
    store_id: process.env.STORE_ID,
    store_passwd: process.env.STORE_PASS,
    total_amount: parseFloat(total_amount),
    currency: "BDT",
    tran_id: `Inv-${txs_id}`,

    success_url: `${process.env.redirectURL}/success`,
    fail_url: `${process.env.redirectURL}/fail`,
    cancel_url: `${process.env.redirectURL}/cancel`,
    ipn_url: `${process.env.redirectURL}/ipn`,

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
      url: process.env.BKASH_URL,
      data: data, 
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

      await PaymentCollection.insertOne({
        customerName: cus_name,
        customerPhone: cus_phone,
        customerEmail: cus_email,
        amount: total_amount,
        tran_id: data.tran_id,
        status: "pendding",
        createdAt: new Date().toISOString(),
      });

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



// Handle SSLCommerz payment success
const paymentSuccess = async (req, res) => {
  const paymentInfo = req.body;

  try {
    if (paymentInfo.status === "VALID") {
            // update payment status
        await PaymentCollection.updateOne(
        { tran_id: paymentInfo.tran_id }, // match condition
        {
          $set: {
            status: "success",
            validated_at: new Date(),
            val_id: paymentInfo.val_id, 
            card_type: paymentInfo.card_type,
            store_amount: paymentInfo.store_amount,
            gateway_response: paymentInfo, 
          },
        }
      );

      // Redirect to success page on frontend
      return res.redirect(`${process.env.REDIRECT_CLIENTS}/success`);
    } else {
      console.warn(" Payment status is not VALID:", paymentInfo.status);
      return res.redirect(`${process.env.REDIRECT_CLIENTS}/invalid`);
    }
  } catch (error) {
    console.error(" Error in paymentSuccess:", error);
    return res.redirect(`${process.env.REDIRECT_CLIENTS}/error`);
  }
};

// Handle SSLCommerz payment Fail
const paymentFail = async (req, res) => {
  const paymentInfo = req.body;

  try {
    console.log("Payment Failed:", paymentInfo);

    await PaymentCollection.updateOne(
      { tran_id: paymentInfo.tran_id },
      {
        $set: {
          status: "FAILED",
          failed_at: new Date(),
          card_type: paymentInfo.card_type,
          store_amount: paymentInfo.store_amount,
          gateway_response: paymentInfo,
        },
      }
    );

    return res.redirect(`${process.env.REDIRECT_CLIENTS}/fail`);
  } catch (error) {
    console.error("Error in paymentFail:", error);
    return res.redirect(`${process.env.REDIRECT_CLIENTS}/error`);
  }
};

// Hanlde  SSLCommerz Cancel
const paymentCancel = async (req, res) => {
  const paymentInfo = req.body;

  try {
    console.log("Payment Cancelled by User:", paymentInfo);

    await PaymentCollection.updateOne(
      { tran_id: paymentInfo.tran_id },
      {
        $set: {
          status: "CANCELLED",
          cancelled_at: new Date(),
          card_type: paymentInfo.card_type,
          store_amount: paymentInfo.store_amount,
          gateway_response: paymentInfo,
        },
      }
    );

    return res.redirect(`${process.env.REDIRECT_CLIENTS}/cancel`);
  } catch (error) {
    console.error("Error in paymentCancel:", error);
    return res.redirect(`${process.env.REDIRECT_CLIENTS}/error`);
  }
};




module.exports = { initiatePayment ,paymentSuccess,paymentFail,paymentCancel};
