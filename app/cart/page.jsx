"use client";

import React, { useContext, useEffect, useState } from "react";

import CartContext from "@/context/CartContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Container from "@/components/Container";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase/config";
import { ArrowLeft } from "lucide-react";
import { onValue, ref } from "firebase/database";
import PayButton from "@/components/PayButton";

const Cart = () => {
  const [isUser, setIsUser] = useState(null);
  const [isProfileComplete, setIsProfileComplete] = useState(null);
  const { deleteItemFromCart, cart } = useContext(CartContext);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const useRef = ref(db, `users/${user.uid}`);

        onValue(useRef, (snapshot) => {
          const data = snapshot.val();
          console.log("DATA", data);
          if (data) {
            setIsProfileComplete(data);
          } else {
            setIsProfileComplete(false);
          }
          setIsUser(true);
        });
      } else {
        setIsUser(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const amountWithoutTax = cart?.cartItems?.reduce(
    (acc, item) => acc + Number(item.price),
    0
  );

  const totalAmount = Number(amountWithoutTax).toFixed(2);

  console.log("CART", cart);

  return (
    <Container>
      <section className="px-4 min-h-[300px] py-2 sm:py-7 rounded-lg flex justify-center items-center flex-col gap-2 w-full">
        {/* <div className="container max-w-screen-xl mx-auto px-4"> */}
        <h2 className="text-3xl font-semibold mb-2">
          {/* Item(s) in Cart: {cart?.cartItems?.length || 0} */}
          {cart?.cartItems === null && "Loading Cart!"}
          {cart?.cartItems !== null &&
            cart?.cartItems?.length > 0 &&
            `${cart?.cartItems?.length} Note(s) in Cart`}
          {cart?.cartItems !== null &&
            cart?.cartItems?.length === 0 &&
            "Cart is empty"}
        </h2>

        {cart?.cartItems !== null && cart?.cartItems?.length === 0 && (
          <p className="text-lg font-medium text-center">
            Please add items in cart before proceeding!
          </p>
        )}
        {/* </div> */}
      </section>

      {cart?.cartItems?.length > 0 && (
        <section className="py-4">
          <div className="container max-w-screen-xl mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4">
              <main className="md:w-3/4">
                <article className="border border-gray-200 bg-white shadow-sm rounded mb-5 p-3 lg:p-5">
                  {cart?.cartItems?.map((cartItem) => (
                    <div className="border-b-2 last:border-b-0 py-4 first:pt-0 last:pb-0">
                      <div className="flex flex-wrap lg:flex-row items-center gap-5">
                        <div className="w-full lg:w-2/5 xl:w-2/4">
                          <figure className="flex leading-5">
                            <div>
                              <div className="block h-[120px] rounded border border-gray-200 overflow-hidden">
                                <img
                                  src={cartItem.coverImg}
                                  alt="PDF Image"
                                  className="w-full h-full object-cover flex items-center justify-center bg-gray-300 text-sm text-center font-bold"
                                />
                              </div>
                            </div>
                            <figcaption className="ml-3 flex flex-col justify-center gap-1">
                              <span className="font-semibold text-xl">
                                {cartItem.name}
                              </span>
                              <span className="text-lg">
                                {cartItem?.pclass}, {cartItem?.subject}
                              </span>
                            </figcaption>
                          </figure>
                        </div>
                        <div className="w-24"></div>
                        <div className="flex justify-center items-center ">
                          <div className="leading-5 ">
                            <p className="font-semibold not-italic text-lg">
                              ₹{cartItem.price}
                            </p>
                            {/* <small className="text-gray-400">
                              {" "}
                              ₹{cartItem.price} / per item{" "}
                            </small> */}
                          </div>
                        </div>
                        <div className="flex-auto">
                          <div className="float-right">
                            <a
                              className="px-4 py-2 inline-block text-red-600 bg-white shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer"
                              onClick={() =>
                                deleteItemFromCart(cartItem?.product)
                              }
                            >
                              Remove
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </article>
              </main>
              <aside className="md:w-1/4">
                <article className="border border-gray-200 bg-white shadow-sm rounded mb-5 p-3 lg:p-5">
                  <ul className="mb-6">
                    {/* <li className="flex justify-between text-gray-600  mb-1">
                      <span>Notes Amount:</span>
                      <span>₹{amountWithoutTax}</span>
                    </li> */}
                    <li className="text-lg font-bold flex justify-between">
                      <span>Total price:</span>
                      <span>₹{totalAmount}</span>
                    </li>
                  </ul>

                  {isUser === true && (
                    <>
                      {isProfileComplete === false && (
                        <div className="mb-4 flex flex-col justify-center items-center w-full">
                          <Button
                            asChild
                            className="px-4 py-4 text-lg w-full text-center font-medium text-white border border-transparent rounded-md hover:bg-accent"
                          >
                            <Link href="/account">Complete Profile</Link>
                          </Button>
                        </div>
                      )}
                      {isProfileComplete && (
                        <PayButton
                          uname={isProfileComplete?.uname}
                          uphone={isProfileComplete?.uphone}
                          uemail={isProfileComplete?.uemail}
                        />
                      )}
                    </>
                  )}

                  {isUser === false && (
                    <div className="mb-4 flex flex-col justify-center items-center w-full">
                      <Button
                        asChild
                        className="px-4 py-4 text-lg w-full text-center font-medium text-white border border-transparent rounded-md hover:bg-accent"
                      >
                        <Link href="/sign-in">Sign In</Link>
                      </Button>
                      <span className="text-sm text-center">
                        Please sign in first!
                      </span>
                    </div>
                  )}

                  <Button
                    asChild
                    className="px-4 py-4 mb-2 text-lg w-full text-center font-medium bg-transparent text-black border border-primary rounded-md hover:bg-primary hover:text-white"
                  >
                    <Link
                      href="/"
                      className="flex justify-center items-center gap-2"
                    >
                      <ArrowLeft /> Back to shop
                    </Link>
                  </Button>
                </article>
              </aside>
            </div>
          </div>
        </section>
      )}
    </Container>
  );
};

export default Cart;
