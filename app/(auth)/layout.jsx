"use client";
import { auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const layout = ({ children }) => {
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is already signed in, redirect them
        router.push("/account");
      } else {
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-row gap-2">
          <div className="w-4 h-4 rounded-full bg-accent animate-bounce"></div>
          <div className="w-4 h-4 rounded-full bg-accent animate-bounce [animation-delay:-.3s]"></div>
          <div className="w-4 h-4 rounded-full bg-accent animate-bounce [animation-delay:-.5s]"></div>
        </div>
      </div>
    );
  }
  return <div>{children}</div>;
};

export default layout;
