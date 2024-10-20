import React, { useContext, useState } from "react";
import { Button } from "./ui/button";
import CartContext from "@/context/CartContext";
import { paymentOptions } from "@/actions/payments";
import { auth } from "@/firebase/config";

const PayButton = ({ uname, uphone, uemail }) => {
  const [isPayed, setIsPayed] = useState(null);

  const { cart, clearCart } = useContext(CartContext);

  const totalAmount = cart?.cartItems?.reduce(
    (acc, item) => acc + Number(item.price),
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
        receipt: `receipt#${Math.floor(Math.random() * 1000) + 1}`,
        // notes: {
        //   key1: "value1",
        //   key2: "value2",
        // },
      }),
    });

    console.log("ORDERDATA", orderData);

    const order = await orderData.json();
    console.log("ORDER", order);

    // Add the name, phone, and email to the order object
    order.name = uname;
    order.email = uemail;
    order.phone = uphone;

    const rzp = new window.Razorpay(
      await paymentOptions(
        order,
        setIsPayed,
        clearCart,
        cart?.cartItems,
        auth?.currentUser?.uid
      )
    );
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
      <Button
        onClick={payHandler}
        className="px-4 py-4 mb-4 text-lg w-full text-center font-medium text-white border border-transparent rounded-md hover:bg-accent"
      >
        Pay Now
      </Button>
    </div>
  );
};

export default PayButton;
