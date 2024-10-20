"use client";

import Container from "@/components/Container";
import PDFViewer from "@/components/PDFViewer";
import { auth, db } from "@/firebase/config";
import { ref, get } from "firebase/database";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

const Page = () => {
  const { noteId } = useParams();
  const [noteData, setNoteData] = useState(null);
  const [error, setError] = useState(false);

  // Fetch note data function
  const fetchNoteData = useCallback(async () => {
    try {
      const userUid = auth?.currentUser?.uid;
      if (!userUid || !noteId) {
        console.log("Invalid user or note ID");
        return setError("invalid-noteid");
      }

      // Fetch user notesBought data
      const userSnapshot = await get(ref(db, `users/${userUid}/notesBought`));
      const userData = userSnapshot.val();

      // Check if the user has bought the note from the notesBought array of objects where there is a matching product ID
      if (!userData) {
        console.log("User data not found");
        return setError("access-denied");
      }

      const noteBought = Object.values(userData).some((note) => {
        return note.product === noteId;
      });

      // Get the details of currently bought note in the noteBoughtDetails
      const noteBoughtDetails = Object.values(userData).find((note) => {
        return note.product === noteId;
      });

      if (!noteBought) {
        console.log("Note not bought");
        return setError("access-denied");
      }

      // Fetch product and note PDF data
      const noteSnapshot = await get(
        ref(
          db,
          `products/${noteBoughtDetails?.pclass}/${noteBoughtDetails?.subject}/${noteId}`
        )
      );
      console.log(
        "noteSnapshot",
        noteSnapshot?.val(),
        userData,
        noteBoughtDetails
      );
      const notepdfSnapshot = await get(ref(db, `notes/${noteId}`));

      if (!noteSnapshot.exists() || !notepdfSnapshot.exists()) {
        console.log("Note or PDF data not found");
        return setError("note-not-found");
      }

      // Set note data
      setNoteData({
        ...noteSnapshot.val(),
        ppdf: notepdfSnapshot.val()?.ppdf,
      });
    } catch (error) {
      console.error("Error fetching note data:", error);
      setError(true);
    }
  }, [noteId, auth?.currentUser?.uid]);

  useEffect(() => {
    fetchNoteData();
  }, [fetchNoteData]);

  // Handling loading, error and rendering states
  if (error !== false) {
    if (error === "invalid-noteid") {
      return (
        <div className="flex justify-center items-center w-full min-h-[400px]">
          <h2 className="text-xl font-semibold">Invalid Note ID</h2>
        </div>
      );
    }

    if (error === "access-denied") {
      return (
        <div className="flex justify-center items-center w-full min-h-[400px]">
          <h2 className="text-xl font-semibold">Access Denied</h2>
        </div>
      );
    }

    if (error === "note-not-found") {
      return (
        <div className="flex justify-center items-center w-full min-h-[400px]">
          <h2 className="text-xl font-semibold">Note Not Found</h2>
        </div>
      );
    }

    if (error === true) {
      return (
        <div className="flex justify-center items-center w-full min-h-[400px]">
          <h2 className="text-xl font-semibold">Something went wrong</h2>
        </div>
      );
    }
  }

  if (!noteData) {
    return (
      <div className="flex justify-center items-center w-full min-h-[400px]">
        <h2 className="text-xl font-semibold">Loading</h2>
      </div>
    );
  }

  return (
    <Container>
      <div className="px-4 py-8 flex flex-col items-center justify-center gap-6 w-full">
        <div className="flex flex-col justify-center items-center gap-y-4 w-full md:w-[60%]">
          <h2 className="text-2xl md:text-3xl font-bold w-full">
            {noteData.ptitle}
          </h2>
          <p className="text-base md:text-lg text-gray-800 w-full">
            {noteData.pdescription}
          </p>
          <div className="flex flex-row lg:gap-x-8 justify-between w-[80%]">
            <p className="text-base md:text-lg text-gray-800">
              <span className="font-semibold">Class</span>: {noteData.pclass}
            </p>
            <p className="text-base md:text-lg text-gray-800">
              <span className="font-semibold">Subject</span>:{" "}
              {noteData.psubject}
            </p>
          </div>
        </div>
        <div className="mt-2 w-full md:w-[60%]">
          {/* Render the PDF viewer */}
          <iframe
            src={noteData.ppdf}
            className="w-full h-[300px] md:h-[600px]"
          ></iframe>
        </div>
      </div>
    </Container>
  );
};

export default Page;
