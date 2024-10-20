"use client";

import { auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const layout = ({ children }) => {
  const [isUser, setIsUser] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsUser(true);
      } else {
        setIsUser(false);
        toast.error("Please sign in to access your account");
        router.push("/sign-in");
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (isUser === null) {
    <div className="flex justify-center items-center w-full min-h-[400px]">
      <h2 className="text-xl font-semibold">Loading</h2>
    </div>;
  }

  if (isUser === false) {
    <div className="flex justify-center items-center w-full min-h-[400px]">
      <h2 className="text-xl font-semibold">Redirectin</h2>
    </div>;
  }

  return <div>{children}</div>;
};

export default layout;
