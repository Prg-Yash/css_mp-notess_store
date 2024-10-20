"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Container from "./Container";
import { House, Menu, Store } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/config";

const Header = () => {
  const [isUser, setIsUser] = useState(null);
  const pathname = usePathname();
  console.log(pathname, typeof pathname);

  // Check if the user is logged in or not
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log("USER", user);
        setIsUser(true);
      } else {
        setIsUser(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [pathname, auth]);

  return (
    <Container>
      <div className="pt-4">
        <div className="flex justify-between items-center gap-6 md:gap-16 px-6">
          {/* Logo */}
          <div>
            <Link href="/">
              <Image
                src="/logo.png"
                alt="Demo Logo"
                width={1000}
                height={1000}
                className="w-full h-[100px]"
              />
            </Link>
          </div>
          {/* Mobile Nav */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger>
                <Menu />
              </SheetTrigger>
              <SheetContent className="flex flex-col justify-between items-center h-full">
                <SheetHeader className="my-4 w-full">
                  <SheetTitle className="flex justify-center items-center w-full mb-4">
                    <Image
                      src="/logo.png"
                      alt="Navkar Academy Logo"
                      width={1000}
                      height={1000}
                      className="h-[100px] object-contain w-fit"
                    />
                  </SheetTitle>
                  <div className="w-full h-[2px] bg-black/10 rounded-full" />
                  {/* NavLinks */}
                  <div className="flex justify-center items-center flex-col w-full gap-x-4 gap-y-2 pt-4">
                    <div
                      className={`text-black text-lg tracking-wide ${
                        pathname === "/" && "font-semibold"
                      }`}
                    >
                      <Link href="/">Home</Link>
                    </div>
                    <div
                      className={`text-black text-lg tracking-wide ${
                        pathname === "/cart" && "font-semibold"
                      }`}
                    >
                      <Link href="/cart">Cart</Link>
                    </div>
                    {isUser && (
                      <div
                        className={`text-black text-lg tracking-wide ${
                          pathname === "/account" && "font-semibold"
                        }`}
                      >
                        <Link href="/account">Account</Link>
                      </div>
                    )}
                    {isUser === false && (
                      <div
                        className={`text-black text-lg tracking-wide ${
                          pathname === "/sign-in" && "font-semibold"
                        }`}
                      >
                        <Link href="/sign-in">Sign In</Link>
                      </div>
                    )}
                  </div>
                </SheetHeader>

                <div className="w-full">
                  <div className="flex justify-center items-center mb-4">
                    <Button asChild className="w-full">
                      <Link
                        href="https://navkaracademy.in"
                        target="_blank"
                        className="flex gap-2"
                      >
                        <House /> Off. Website
                      </Link>
                    </Button>
                  </div>
                  <div className="w-full h-[2px] bg-black/10 rounded-full my-4" />
                  {/* CTA Information */}
                  <div className="flex flex-col gap-4">
                    <div>
                      <h3 className="text-[18px] font-semibold">Call:</h3>
                      <a
                        href="tel:+919930840042"
                        className="text-muted-foreground text-[14px] hover:text-accent"
                      >
                        +91 99308 40042
                      </a>
                    </div>
                    <div>
                      <h3 className="text-[18px] font-semibold">Mail:</h3>
                      <a
                        href="mailto:info@navkaracademy.in"
                        className="text-muted-foreground text-[14px] hover:text-accent"
                      >
                        info@navkaracademy.in
                      </a>
                    </div>
                    <div>
                      <h3 className="text-[18px] font-semibold">Address:</h3>
                      <a
                        href="https://maps.app.goo.gl/hdBZkiWsvrDG7mncA"
                        target="_blank"
                        className="text-muted-foreground text-[14px] hover:text-accent"
                      >
                        Plot No - 40, Shub Nil Shivam, Sector - 11, Kamothe,
                        Panvel, Navi Mumbai, Maharashtra 410209
                      </a>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          {/* CTA Information */}
          <div className="hidden md:items-center h-full md:flex md:gap-10">
            <div>
              <h3 className="text-[18px] font-semibold">Call:</h3>
              <a
                href="tel:+919930840042"
                className="text-muted-foreground text-[14px] hover:text-accent"
              >
                +91 99308 40042
              </a>
            </div>
            <div className="w-[2px] h-[40px] bg-black/10 rounded-full" />
            <div>
              <h3 className="text-[18px] font-semibold">Mail:</h3>
              <a
                href="mailto:info@navkaracademy.in"
                className="text-muted-foreground text-[14px] hover:text-accent"
              >
                info@navkaracademy.in
              </a>
            </div>
            <div className="w-[2px] h-[40px] bg-black/10 rounded-full" />
            <div className="w-[460px]">
              <h3 className="text-[18px] font-semibold">Address:</h3>
              <a
                href="https://maps.app.goo.gl/hdBZkiWsvrDG7mncA"
                target="_blank"
                className="text-muted-foreground text-[14px] hover:text-accent"
              >
                Plot No - 40, Shub Nil Shivam, Sector - 11, Kamothe, Panvel,
                Navi Mumbai, Maharashtra 410209
              </a>
            </div>
          </div>
        </div>
        <div className="w-full h-[2px] bg-black/0 rounded-full my-4" />
        <div className="hidden md:block mb-4">
          {/* Page Links */}
          <div className="flex justify-between items-center px-6">
            <div className="flex justify-between items-center gap-10 w-[30%]">
              <div
                className={
                  pathname === "/"
                    ? "custom-header-underline"
                    : "custom-header-hover-underline"
                }
              >
                <Link href="/">Home</Link>
              </div>
              <div
                className={
                  pathname === "/cart"
                    ? "custom-header-underline"
                    : "custom-header-hover-underline"
                }
              >
                <Link href="/cart">Cart</Link>
              </div>
              {isUser && (
                <div
                  className={
                    pathname === "/account"
                      ? "custom-header-underline"
                      : "custom-header-hover-underline"
                  }
                >
                  <Link href="/account">Account</Link>
                </div>
              )}
              {isUser === false && (
                <div
                  className={
                    pathname === "/sign-in"
                      ? "custom-header-underline"
                      : "custom-header-hover-underline"
                  }
                >
                  <Link href="/sign-in">Sign In</Link>
                </div>
              )}
              {/* <div className="custom-header-hover-underline">
                <a
                  href="https://navkar-academy-store.vercel.app/"
                  target="_blank"
                >
                  Store
                </a>
              </div> */}
            </div>
            <div className="">
              <div>
                <Link href="https://navkaracademy.in" target="_blank">
                  <Button
                    variant="native"
                    className="flex justify-center items-center gap-2"
                  >
                    <House /> Off. Website
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Header;
