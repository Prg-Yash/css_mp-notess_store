"use server";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req, res) {
  try {
    const body = await req.json();
    const { amount, currency, receipt, notes } = body;
    console.log(req.body);
    console.log(amount, currency, receipt, notes);
    const options = {
      amount: amount * 100,
      currency,
      receipt,
      notes,
    };

    const response = await razorpay.orders.create(options);
    console.log("RESPONSE", response);
    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 500 });
  }
}
