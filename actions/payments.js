import { db } from "@/firebase/config";
import { ref, runTransaction, set } from "firebase/database";

export const paymentOptions = async (
  orderData,
  setIsPayed,
  clearCart,
  cartItems,
  currentUser
) => {
  return {
    key: process.env.RAZORPAY_KEY_ID,
    amount: Number(orderData?.amountInput),
    currency: orderData.currency,
    name: "Navkar Academy",
    description: "Buy authentic and best notes for your child/siblings.",
    image: "/logo.png",
    order_id: orderData?.id,
    handler: async function (response) {
      console.log(response.razorpay_payment_id);
      console.log(response.razorpay_order_id);
      console.log(response.razorpay_signature);
      console.log("RESPONSE", response);
      await set(ref(db, `users/${currentUser}/orders/${orderData?.id}`), {
        cartItems,
        paymentId: response.razorpay_payment_id,
        signature: response.razorpay_signature,
        orderId: response.razorpay_order_id,
        amount: orderData?.amount,
        currency: orderData.currency,
        name: orderData?.name,
        email: orderData?.email,
        phone: orderData?.phone,
        status: "Paid",
      });

      // const productIds = cartItems.map((item) => item.product);

      // Get all the product, class, and subject value from the cartItems
      const products = cartItems.map((item) => ({
        product: item.product,
        name: item.name,
        subject: item.subject,
        pclass: item.pclass,
      }));

      await runTransaction(ref(db, `users/${currentUser}`), (user) => {
        if (user) {
          // const notesBoughtSet = new Set(user.notesBought || []);
          // productIds.forEach((id) => notesBoughtSet.add(id));
          // user.notesBought = Array.from(notesBoughtSet);
          const notesBought = user.notesBought || [];
          products.forEach((product) => {
            notesBought.push(product);
          });
          user.notesBought = notesBought;
        }
        return user;
      });
      setIsPayed(true);
      clearCart();
    },
    prefill: {
      name: orderData?.name,
      email: orderData?.email,
      contact: orderData?.phone,
    },
    notes: {
      address: "Navkar Academy",
    },
    theme: {
      color: "hsl(20, 88%, 58%)",
    },
  };
};
