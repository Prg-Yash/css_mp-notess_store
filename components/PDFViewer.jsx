// components/PDFViewer.js
"use client";
import React from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

// Import the required CSS for styling
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const PDFViewer = ({ pdfUrl }) => {
  // Initialize the default layout plugin for the viewer
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    // Use the Worker URL matching the installed pdfjs-dist version
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
      <div style={{ height: "750px", width: "100%" }}>
        {/* Viewer component renders the PDF */}
        <Viewer fileUrl={pdfUrl} plugins={[defaultLayoutPluginInstance]} />
      </div>
    </Worker>
  );
};

export default PDFViewer;
