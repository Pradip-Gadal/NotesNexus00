import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export function DarkLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Navbar className="bg-black text-white border-gray-800" />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer className="bg-black text-white border-t border-gray-800" />
    </div>
  );
}
