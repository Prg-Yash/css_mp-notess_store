"use client";

import { Check, ShoppingCart, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import CartContext from "@/context/CartContext";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const ProductCard = ({
  ptitle,
  pdescription,
  pprice,
  pclass,
  psubject,
  pcoverImg,
  pid,
  isBought,
}) => {
  const { addItemToCart, deleteItemFromCart, cart } = useContext(CartContext);
  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const addCartHandler = (product) => {
    console.log("Item added to cart", product);
    addItemToCart({
      product: pid,
      name: ptitle,
      price: pprice,
      coverImg: pcoverImg[0],
      subject: psubject,
      pclass: pclass,
    });
  };

  // Check if the pid is already in the cart?.cartItems
  const isItemExist = cart?.cartItems?.find((i) => i.product === pid);

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <div className="relative flex flex-col max-w-[280px] md:max-w-[320px] h-full rounded-lg border border-gray-100 bg-white shadow-md transition-all duration-200">
          <div className="relative mx-3 my-3 flex overflow-hidden rounded-xl">
            {/* <Image
              src={pcoverImg}
              alt={ptitle}
              width={1000}
              height={1000}
              className="object-cover"
            /> */}
            <Carousel
              plugins={[
                Autoplay({
                  delay: 2000,
                }),
              ]}
              setApi={setApi}
            >
              <CarouselContent>
                {/* <CarouselItem>...</CarouselItem> */}
                {pcoverImg.map((img, index) => (
                  <CarouselItem key={index}>
                    <Image
                      src={img}
                      alt={ptitle}
                      width={1000}
                      height={1000}
                      className="object-cover"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <span className="absolute top-0 left-0 m-2 rounded-full bg-black px-2 text-center text-sm font-medium text-white">
              {psubject}
            </span>
            {isBought && (
              <span className="absolute top-0 right-0 m-2 rounded-full bg-emerald-800/70 px-1 py-1 text-center text-sm font-medium text-white">
                <Check />
              </span>
            )}
          </div>
          <div className="px-6 py-8 flex flex-col items-start justify-normal w-full gap-[4px] absolute bottom-0 left-0 right-0 bg-black/80 rounded-b-lg">
            <h5 className="text-xl tracking-tight text-white font-medium text-left">
              {ptitle.length > 20 ? ptitle.slice(0, 26) + "..." : ptitle}
            </h5>
            <p className="text-lg text-white">STD {pclass}</p>
            {/* <p className="text-sm text-gray-600">
              Total purchases: {product.purchases}
            </p> */}
            <div className="flex items-center justify-between w-full">
              <p>
                <span className="text-xl font-bold text-white">₹{pprice}</span>
              </p>
              {/* <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    aria-hidden="true"
                    className="h-5 w-5 text-yellow-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
                <span className="ml-3 rounded bg-yellow-200 px-2.5 py-0.5 text-xs font-semibold">
                  {product.rating}
                </span>
              </div> */}
            </div>
            {/* <Button
              // href="/"
              className="flex items-center justify-center w-full gap-4"
              variant="cartBtn"
            >
              <ShoppingCart className="" />
              Add to cart.
            </Button> */}
          </div>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex w-full gap-4 items-center">
            <div className="w-[40%] flex justify-center items-center flex-col">
              <Carousel
                plugins={[
                  Autoplay({
                    delay: 2000,
                  }),
                ]}
                setApi={setApi}
              >
                <CarouselContent>
                  {/* <CarouselItem>...</CarouselItem> */}
                  {pcoverImg.map((img, index) => (
                    <CarouselItem key={index}>
                      <Image
                        src={img}
                        alt={ptitle}
                        width={1000}
                        height={1000}
                        className="rounded-lg w-full object-cover "
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
              <span className="text-center w-full mt-2">
                {current} of {pcoverImg.length}
              </span>
            </div>
            {/* <div className="w-3"></div> */}
            <div className="w-[60%] p-4">
              <AlertDialogTitle className=" text-2xl font-bold">
                {ptitle}
              </AlertDialogTitle>
              <p className="text-gray-600">
                {pdescription?.length > 200
                  ? pdescription.slice(0, 200) + "..."
                  : pdescription}
              </p>
              <div className="flex justify-between items-center mt-4 gap-2">
                <p className="text-gray-700 text-lg font-bold">STD: {pclass}</p>
                <p className="text-gray-700 text-lg font-bold">
                  Price: ₹{pprice}
                </p>
              </div>

              <div className="flex justify-center items-center mt-4 gap-2">
                {isBought === false && isItemExist && (
                  <>
                    <Button
                      className="flex items-center justify-center w-full gap-2 hover:bg-accent ease-in-out duration-300"
                      onClick={() => deleteItemFromCart(pid)}
                    >
                      <ShoppingCart />
                      Delete Item
                    </Button>
                    <Button
                      asChild
                      className="flex items-center justify-center w-full gap-2 hover:bg-accent ease-in-out duration-300"
                    >
                      <Link href="/cart">
                        <ShoppingCart />
                        Go to Cart
                      </Link>
                    </Button>
                  </>
                )}
                {isBought === false && !isItemExist && (
                  <Button
                    className="flex items-center justify-center w-full gap-2 hover:bg-accent ease-in-out duration-300"
                    onClick={addCartHandler}
                  >
                    <ShoppingCart />
                    Add to cart
                  </Button>
                )}
                {isBought && (
                  <span className="font-semibold text-lg mt-4">
                    Already bought the note:{" "}
                    <Link href="/account" className="underline">
                      Check Account
                    </Link>
                  </span>
                )}
              </div>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="absolute right-0 top-2 mr-4 mt-4 p-0 w-auto h-auto rounded-full">
            <X className="bg-white text-black rounded-full  p-1" />
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ProductCard;
