"use client";
import { Toaster } from "react-hot-toast";

const ToasterContext = () => {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      containerStyle={{
        top: 96,
        zIndex: 999999,
      }}
      toastOptions={{
        duration: 4000,
        style: {
          background: "#18092d",
          color: "#ededf1",
          border: "1px solid rgba(225, 105, 147, 0.4)",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6), 0 0 25px rgba(225, 105, 147, 0.3)",
          backdropFilter: "blur(12px)",
          padding: "12px 20px",
          borderRadius: "14px",
          fontSize: "14px",
          fontWeight: "500",
        },
        error: {
          iconTheme: {
            primary: "#e16993",
            secondary: "#ffffff",
          },
        },
        success: {
          iconTheme: {
            primary: "#10b981",
            secondary: "#ffffff",
          },
        },
      }}
    />
  );
};

export default ToasterContext;
