"use client";

import { products } from "@/data";
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { get, onValue, ref } from "firebase/database";
import { auth, db } from "@/firebase/config";
import { LoaderCircle } from "lucide-react";

const StdProducts = () => {
  const [products, setProducts] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [notesBoughtArr, setNotesBoughtArr] = useState(null);
  const [loading, setLoading] = useState(true); // {{ edit_1 }}

  useEffect(() => {
    const productsRef = ref(db, "products");
    const unsubscribeProducts = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setProducts(data);
        setLoading(false); // {{ edit_2 }}
      }
      console.log("DATA", data);
    });

    const currentUser = auth.currentUser;
    let unsubscribeUser;

    if (currentUser) {
      const userRef = ref(db, `users/${currentUser.uid}`);
      unsubscribeUser = onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        setUserDetails(data);
        const localNotesBoughtArr = data?.notesBought.map((note) => {
          return note.product;
        });
        setNotesBoughtArr(localNotesBoughtArr);
        // console.log("USERDETAILS", data, Object.keys(data));
      });
    }

    return () => {
      unsubscribeProducts();
      if (unsubscribeUser) {
        unsubscribeUser();
      }
    };
  }, [auth.currentUser]);

  return (
    <div>
      {loading ? ( // {{ edit_3 }}
        <div className="flex justify-center items-center text-lg md:text-xl font-semibold min-h-[400px]">
          <LoaderCircle className="animate-spin" /> Loading Products...
        </div>
      ) : (
        products &&
        Object.keys(products).map((standard) => {
          console.log("STANDARDS", standard);
          return (
            <div key={standard} className="py-8">
              <h2 className="md:text-center text-3xl md:text-4xl font-semibold text-center text-black">
                Standard {standard}
              </h2>
              <div className="flex justify-center items-center w-full mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 md:gap-6 lg:gap-10 ">
                  {Object.keys(products[standard]).map((subject) =>
                    Object.values(products[standard][subject]).map(
                      (product, index) => {
                        console.log("PRODUCT", product);
                        return (
                          // <div key={index}>
                          <ProductCard
                            ptitle={product.ptitle}
                            pdescription={product.pdescription}
                            pprice={product.pprice}
                            pclass={product.pclass}
                            psubject={product.psubject}
                            pcoverImg={product.pcoverImg}
                            pid={product.pid}
                            isBought={Boolean(
                              notesBoughtArr?.includes(product.pid)
                            )}
                          />
                          // </div>
                        );
                      }
                    )
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default StdProducts;
