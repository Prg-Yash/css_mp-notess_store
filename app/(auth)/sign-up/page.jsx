"use client";

import Container from "@/components/Container";
import { auth } from "@/firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon, LockKeyhole, LogIn, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const signupHandler = async (e) => {
    e.preventDefault();

    console.log("SIGNING UP");
    const loading = toast.loading("Signing Up...");

    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        console.log("USER", user);

        toast.success("Signed Up successfully", {
          id: loading,
        });
        router.push("/account");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("ERROR", error);
        toast.error("Some Error Occured! Please try again later.", {
          id: loading,
        });
      });
  };

  return (
    <Container>
      <div className="my-8">
        <div className="md:flex ">
          <div className="md:w-1/2  hidden md:flex">
            <img src="/authbanner.png" alt="" className="" />
          </div>
          <div className="flex justify-center items-center md:w-1/2 w-full">
            <form className="flex flex-col gap-4 w-full border p-4 py-10 rounded-lg h-full">
              <div className="flex flex-col justify-between gap-y-4">
                <div className="flex flex-col gap-y-4">
                  <div>
                    <h2 className="font-bold text-3xl mb-1">
                      New to our store? 🤔
                    </h2>
                    <p className="text-md text-gray-500  flex items-center gap-x-2">
                      {" "}
                      Sign Up to create an account
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                      <Mail className="w-6 h-6 text-gray-500  " />
                    </div>
                    <input
                      type="email"
                      class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="example@gmail.com"
                      required
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                      <LockKeyhole className="w-6 h-6 text-gray-500  " />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Password must be equal or more than 6 characters"
                      required
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? (
                        <EyeOffIcon size={20} />
                      ) : (
                        <EyeIcon size={20} />
                      )}
                    </button>
                  </div>

                  <Button onClick={signupHandler}>Sign Up</Button>
                </div>

                <p className="flex gap-x-2 justify-center items-center">
                  Already have an account?{" "}
                  <Link href="/sign-in" className="text-accent font-bold">
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default SignUp;
