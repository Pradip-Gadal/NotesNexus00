import React from "react";

export interface Props {
  className?: string;
}

export function Footer({ className = "" }: Props) {
  return (
    <footer className={`py-8 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="font-semibold text-lg">NoteNexus</h3>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">About</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-800">
          <p className="text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} NoteNexus. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
