// "use client";
// import useCart from "../context/CartContext";
// import { useContext } from "react";
// import CartContext from "../context/CartContext";
// import Link from "next/link";
import Banner from "@/components/Banner";
import OurProducts from "@/components/OurProducts";

// const products = [
//   { id: 1, name: "Pdf1", price: 10, quantity: 1 },
//   { id: 2, name: "Pdf2", price: 20, quantity: 1 },
//   { id: 3, name: "Pdf3", price: 30, quantity: 1 },
// ];

export default function Home() {
  // const { addItemToCart } = useContext(CartContext);

  // const addCartHandler = (product) => {
  //   console.log("Item added to cart", product);
  //   addItemToCart({
  //     product: product.id,
  //     name: product.name,
  //     price: product.price,
  //   });
  // };
  return (
    <main>
      <Banner />
      <OurProducts />
    </main>
  );
}
