"use client";

import AccountForm from "@/components/AccountForm";
import NoteCard from "@/components/NoteCard";
import { NotebookPen, Search, User } from "lucide-react";

import React, { useEffect, useState } from "react";
import Dropdown from "@/components/Dropdown";
import { Button } from "@/components/ui/button";
import Container from "@/components/Container";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useRouter } from "next/navigation";
import { ref, onValue, get } from "firebase/database";
import { db } from "@/firebase/config";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const page = () => {
  const [isUser, setIsUser] = useState(null);
  const [formData, setFormData] = useState(null);
  const [products, setProducts] = useState([]);
  const [classFilter, setClassFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [uniqueClasses, setUniqueClasses] = useState([]);
  const [uniqueSubjects, setUniqueSubjects] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const router = useRouter();

  const signoutHandler = async () => {
    await signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log("Signout successful");
        // toast.success("Signout successful");
      })
      .catch((error) => {
        console.log("ERROR", error);
        // toast.error("Some error occured! Please try again later.")
      });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsUser(true);
        const usersRef = ref(db, `users/${user.uid}`);
        onValue(usersRef, async (snapshot) => {
          // Changed to async
          const data = snapshot.val();
          if (data) {
            setFormData(data);
            console.log("USER DATAA", data);

            // Fetch products data concurrently
            if (data.notesBought && data.notesBought.length > 0) {
              console.log("NOTES BOUGHT", data.notesBought);
              const productPromises = data.notesBought.map((note) =>
                get(
                  ref(
                    db,
                    `products/${note.pclass}/${note.subject}/${note.product}`
                  )
                ).then((snapshot) => {
                  if (snapshot.exists()) {
                    console.log("PRODUCT", snapshot.val());
                    return snapshot.val(); // Return product data
                  }
                })
              );

              const productsData = await Promise.all(productPromises); // Wait for all promises
              console.log("PRODUCTDATA", productsData.filter(Boolean));
              setProducts(productsData.filter(Boolean)); // Filter out undefined values
              setFilteredProducts(productsData.filter(Boolean));

              const localUniqueClass = new Set();

              productsData.forEach((product) => {
                if (product) {
                  localUniqueClass.add(product.pclass);
                }
              });
              setUniqueClasses(
                Array.from(localUniqueClass).sort((a, b) => a - b)
              );
            } else {
              setProducts([]);
            }
          }
        });
      } else {
        router.push("/");
        setIsUser(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (classFilter === "all" && subjectFilter === "all") {
      setFilteredProducts(products);
    } else if (classFilter === "all") {
      setFilteredProducts(
        products.filter((product) => product.psubject === subjectFilter)
      );
    } else if (subjectFilter === "all") {
      setFilteredProducts(
        products.filter((product) => product.pclass === classFilter)
      );
    } else {
      setFilteredProducts(
        products.filter(
          (product) =>
            product.pclass === classFilter && product.psubject === subjectFilter
        )
      );
    }
  }, [classFilter, subjectFilter]);

  useEffect(() => {
    const localUniqueSubjects = new Set();
    filteredProducts.forEach((product) => {
      if (product) {
        localUniqueSubjects.add(product.psubject);
      }
    });
    console.log("LOCALUNIQUESUBJECTS", localUniqueSubjects);
    setUniqueSubjects(Array.from(localUniqueSubjects).sort((a, b) => a - b));
  }, [products]);

  if (isUser === null)
    return (
      <div className="w-full h-[200px] flex justify-center items-center">
        <h2 className="text-lg md:text-2xl font-semibold">Loading</h2>
      </div>
    );

  if (isUser === false)
    return (
      <div className="w-full h-[200px] flex justify-center items-center">
        <h2 className="text-lg md:text-2xl font-semibold">Redirecting</h2>
      </div>
    );

  return (
    <Container>
      <div className="py-8 flex flex-col gap-8 px-4">
        <div className="flex flex-col gap-y-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <h2 className="text-3xl text-gray-800 font-bold flex gap-2 items-center">
              <User className="w-8 h-8 font-bold" /> Account Information
            </h2>
            <Button
              onClick={signoutHandler}
              variant="outline"
              className="border-2 px-4 text-lg border-accent"
            >
              Logout
            </Button>
          </div>

          <AccountForm />
        </div>
        <div className="flex flex-col gap-y-4 mt-4">
          <h2 className="text-3xl text-gray-800 font-bold flex gap-2 items-center">
            <NotebookPen className="w-8 h-8 font-bold" /> View Bought Notes
          </h2>

          <div className="flex justify-center items-center w-full gap-4">
            <div className="flex flex-row items-center md:gap-y-0 gap-y-2 gap-x-8 w-full">
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="p-6 rounded-lg w-full border-2 border-gray-300 ">
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {uniqueClasses.map((classs) => (
                    <SelectItem key={classs} value={classs}>
                      {classs}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="p-6 rounded-lg w-full border-2 border-gray-300 ">
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {uniqueSubjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* //search bar */}
          </div>
          {products.length === 0 && (
            <div className="w-full h-[200px] flex justify-center items-center">
              <h2 className="text-lg md:text-2xl font-bold">
                No notes bought yet!
              </h2>
            </div>
          )}
          {products.length > 0 && filteredProducts.length === 0 && (
            <div className="w-full h-[200px] flex justify-center items-center">
              <h2 className="text-lg md:text-2xl font-bold">No notes found!</h2>
            </div>
          )}
          {products.length > 0 && (
            <div className="grid md:grid-cols-2 gap-4 md:gap-6 mt-4">
              {filteredProducts.map((product) => (
                <NoteCard
                  key={product.pid}
                  pid={product.pid}
                  ptitle={product.ptitle}
                  psubject={product.psubject}
                  pclass={product.pclass}
                  coverImg={product.pcoverImg}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default page;
