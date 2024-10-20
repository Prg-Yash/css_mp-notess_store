"use server";

import { pay } from "@/actions/payments";
import PaymentForm from "@/components/PaymentForm";
import React from "react";

const PaymentPage = async () => {
  return (
    <div>
      <h1>Please click on the button below with all the information</h1>
      <PaymentForm />
    </div>
  );
};

export default PaymentPage;
