"use client";

import { auth, db } from "@/firebase/config";
import { onValue, ref } from "firebase/database";
import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("cart");
      return storedCart ? JSON.parse(storedCart) : { cartItems: [] };
    }
    return { cartItems: [] };
  });

  const [userInfo, setUserInfo] = useState(null);

  // Use useCallback to memoize functions
  const setCartToState = useCallback(() => {
    if (auth?.currentUser) {
      const userRef = ref(db, `users/${auth.currentUser.uid}`);
      return onValue(userRef, (snapshot) => {
        const userData = snapshot.val();
        setUserInfo(userData);
        console.log("USERINFO", userData);

        if (userData?.notesBought) {
          const notesBoughtSet = new Set(userData.notesBought);
          setCart((prevCart) => {
            const updatedCartItems = prevCart.cartItems.filter(
              (item) => !notesBoughtSet.has(item.product)
            );
            const newCart = { ...prevCart, cartItems: updatedCartItems };

            // Update localStorage with the new cart
            localStorage.setItem("cart", JSON.stringify(newCart));

            return newCart;
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    const unsubscribe = setCartToState();
    return () => unsubscribe && unsubscribe();
  }, [setCartToState]);

  const updateLocalStorage = useCallback((newCart) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(newCart));
    }
  }, []);

  const addItemToCart = useCallback(
    ({ product, name, price, coverImg, subject, pclass }) => {
      setCart((prevCart) => {
        // Check if the product is already bought
        if (userInfo?.notesBought?.includes(product)) {
          console.log("Product already bought:", product);
          return prevCart; // Don't add to cart if already bought
        }

        const existingItemIndex = prevCart.cartItems.findIndex(
          (i) => i.product === product
        );

        let newCartItems;
        if (existingItemIndex > -1) {
          // Item already exists, don't update anything
          newCartItems = prevCart.cartItems;
        } else {
          // Add new item
          newCartItems = [
            ...prevCart.cartItems,
            { product, name, price, coverImg, subject, pclass },
          ];
        }

        const newCart = { ...prevCart, cartItems: newCartItems };
        updateLocalStorage(newCart);
        return newCart;
      });
    },
    [updateLocalStorage, userInfo]
  );

  const deleteItemFromCart = useCallback(
    (id) => {
      setCart((prevCart) => {
        const newCart = {
          ...prevCart,
          cartItems: prevCart.cartItems.filter((i) => i.product !== id),
        };
        updateLocalStorage(newCart);
        return newCart;
      });
    },
    [updateLocalStorage]
  );

  const clearCart = useCallback(() => {
    const emptyCart = { cartItems: [] };
    updateLocalStorage(emptyCart);
    setCart(emptyCart);
  }, [updateLocalStorage]);

  const contextValue = useMemo(
    () => ({
      cart,
      addItemToCart,
      deleteItemFromCart,
      clearCart,
    }),
    [cart, addItemToCart, deleteItemFromCart, clearCart]
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

export default CartContext;
