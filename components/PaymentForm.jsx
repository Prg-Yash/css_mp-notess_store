"use client";

import { paymentOptions } from "@/actions/payments";
import CartContext from "@/context/CartContext";
import React, { useContext, useState } from "react";

const PaymentForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isPayed, setIsPayed] = useState(null);

  const { cart } = useContext(CartContext);

  const totalAmount = cart?.cartItems?.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const payHandler = async (e) => {
    e.preventDefault();
    const orderData = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: totalAmount,
        currency: "INR",
        receipt: "receipt#1",
        notes: {
          key1: "value1",
          key2: "value2",
        },
      }),
    });

    console.log("ORDERDATA", orderData);

    const order = await orderData.json();
    console.log("ORDER", order);

    // Add the name, phone, and email to the order object
    order.name = formData.name;
    order.email = formData.email;
    order.phone = formData.phone;

    const rzp = new window.Razorpay(await paymentOptions(order, setIsPayed));
    rzp.on("payment.failed", (response) => {
      console.log(response.error.code);
      console.log(response.error.description);
      console.log(response.error.source);
      console.log(response.error.step);
      console.log(response.error.reason);
      console.log(response.error.metadata.order_id);
      console.log(response.error.metadata.payment_id);
      setIsPayed(false);
      alert("Payment Failed! Try again");
    });

    rzp.open();
  };

  return (
    <div>
      <form onSubmit={payHandler}>
        <input
          placeholder="Enter Name"
          name="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          placeholder="Enter Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          placeholder="Enter Phone"
          name="phone"
          type="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        <span>Price - {totalAmount}</span>
        <button type="submit">Pay</button>
      </form>

      {isPayed === true && <h1>Payment Successfull</h1>}
      {isPayed === false && <h1>Payment Failed</h1>}
    </div>
  );
};

export default PaymentForm;
