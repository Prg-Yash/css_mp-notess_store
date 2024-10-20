"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Save } from "lucide-react";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import { onValue, ref, set } from "firebase/database";
import { auth, db } from "@/firebase/config";

const InputField = ({ label, ...props }) => (
  <div className="w-full">
    <label className="text-black font-bold ml-1 text-lg">{label}</label>
    <input
      className="p-3 border-2 border-gray-300 rounded-md w-full disabled:opacity-75 disabled:cursor-not-allowed"
      {...props}
    />
  </div>
);

const AccountForm = () => {
  const [formData, setFormData] = useState({
    uphone: "",
    uclass: "",
    uaddress: "",
  });

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const validateForm = () => {
    const { uname, uphone, uemail, uaddress } = formData;
    if (uname.trim().length < 4) return "Enter a valid name!";
    if (uphone.trim().length !== 10) return "Enter a valid phone number!";
    if (uaddress.trim().length < 4) return "Enter a valid address!";
    return null;
  };

  const saveAccountInfoHandler = useCallback(
    async (e) => {
      e.preventDefault();
      const savingInfo = toast.loading("Saving Account Info...");

      const error = validateForm();
      if (error) {
        toast.error(error, { id: savingInfo });
        return;
      }

      try {
        await set(ref(db, `users/${auth?.currentUser?.uid}`), {
          ...formData,
          uname: formData.uname.trim(),
          uemail: auth?.currentUser?.email,
          uaddress: formData.uaddress.trim(),
        });
        toast.success("Account Info Saved!", { id: savingInfo });
      } catch (err) {
        toast.error(err.message, { id: savingInfo });
        console.error("Error saving account info:", err);
      }
    },
    [formData]
  );

  useEffect(() => {
    const fetchUserInfo = () => {
      const usersRef = ref(db, `users/${auth?.currentUser?.uid}`);
      onValue(usersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setFormData(data);
        }
      });
    };

    if (auth?.currentUser?.uid) {
      fetchUserInfo();
    }
  }, []);

  return (
    <form
      onSubmit={saveAccountInfoHandler}
      className="flex justify-center items-center w-full"
    >
      <div className="flex flex-col gap-x-4 gap-y-2 w-full">
        <div className="flex md:flex-row flex-col items-center gap-x-8 gap-y-2">
          <InputField
            label="Name"
            type="text"
            name="uname"
            placeholder="Enter Your Name"
            value={formData.uname}
            onChange={handleInputChange}
            required
          />
          <InputField
            label="Phone"
            type="tel"
            name="uphone"
            placeholder="Enter Your Phone"
            value={formData.uphone}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="flex md:flex-row flex-col items-center gap-x-8 gap-y-2">
          <InputField
            label="Your Class"
            type="number"
            name="uclass"
            placeholder="Enter Your Class"
            min={1}
            max={12}
            value={formData.uclass}
            onChange={handleInputChange}
            required
          />
          <InputField
            label="Email"
            type="email"
            name="uemail"
            placeholder="Enter Your Email"
            value={auth?.currentUser?.email}
            // onChange={handleInputChange}
            disabled
            required
          />
        </div>
        <div className="flex md:flex-row flex-col items-center gap-x-8">
          <div className="w-full">
            <label className="text-black font-bold ml-1 text-lg">Address</label>
            <textarea
              name="uaddress"
              rows="4"
              className="p-3 bg-white border-2 border-gray-300 rounded-md w-full resize-none"
              placeholder="Enter Your Address Here..."
              value={formData.uaddress}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
        </div>
        <div className="flex md:justify-end justify-center">
          <Button
            className="flex border-2 px-8 gap-2 text-lg border-accent"
            variant="outline"
            type="submit"
          >
            <Save />
            Save
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AccountForm;
