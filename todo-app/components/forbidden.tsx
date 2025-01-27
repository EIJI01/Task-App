"use client";
import React from "react";
import { useRouter } from "next/navigation";

const Forbidden = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-600">403</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mt-4">Access Denied</h2>
      <p className="text-gray-600 mt-2 text-center">You do not have permission to access this page.</p>
      <button
        className="mt-6 px-6 py-3 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition duration-200"
        onClick={() => router.push("/")}
      >
        Go Back to Home
      </button>
    </div>
  );
};

export default Forbidden;
