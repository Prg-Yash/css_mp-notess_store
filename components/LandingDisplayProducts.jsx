"use client";

import React, { useEffect, useState, useCallback } from "react";
import ProductCard from "./ProductCard";
import { onValue, ref } from "firebase/database";
import { auth, db } from "@/firebase/config";
import { LoaderCircle } from "lucide-react";

const LandingDisplayProducts = () => {
  const [products, setProducts] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const productsRef = ref(db, "products");
    const unsubscribeProducts = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setProducts(Object.values(data));
    });

    const currentUser = auth.currentUser;
    let unsubscribeUser;

    if (currentUser) {
      const userRef = ref(db, `users/${currentUser.uid}`);
      unsubscribeUser = onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        setUserDetails(data);
        console.log("USERDETAILS", data);
      });
    }

    return () => {
      unsubscribeProducts();
      if (unsubscribeUser) {
        unsubscribeUser();
      }
    };
  }, [auth.currentUser]);

  const renderProductCard = useCallback(
    (product) => (
      <ProductCard
        key={product.pid}
        product={product}
        ptitle={product.ptitle}
        pdescription={product.pdescription}
        pprice={product.pprice}
        pclass={product.pclass}
        psubject={product.psubject}
        pcoverImg={product.pcoverImg}
        pid={product.pid}
        isBought={Boolean(userDetails?.notesBought?.includes(product.pid))}
      />
    ),
    [userDetails?.notesBought]
  );

  if (products === null) {
    return (
      <div className="flex justify-center items-center">
        <p className="text-lg font-semibold flex justify-center items-center gap-4">
          <LoaderCircle className="animate-spin" /> Loading Products...
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 md:gap-6 lg:gap-10">
      {products.length === 0 ? ( // Check if products array is empty
        <p className="text-center text-2xl">No Products Available</p>
      ) : (
        products.map((product) => renderProductCard(product)) // Directly map over products
      )}
    </div>
  );
};

export default LandingDisplayProducts;
