import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function App() {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 md:py-24 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">NoteNexus</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8">
            A collaborative platform for students to share and discover study notes
            across all educational levels.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Button
              size="lg"
              onClick={() => navigate("/browse-notes")}
              className="text-lg px-8 bg-white text-black hover:bg-gray-200"
            >
              Browse Notes
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 border-white text-white hover:bg-gray-800"
              onClick={() => navigate("/upload-note")}
            >
              Upload Your Notes
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Why Choose NoteNexus?</h2>

          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="border border-gray-700 p-6 rounded-lg text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Organized by Level</h3>
              <p className="text-gray-400">
                Easily access study notes that match your educational level and subjects for easy reference.
              </p>
            </div>

            <div className="border border-gray-700 p-6 rounded-lg text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Rating</h3>
              <p className="text-gray-400">
                Let the best study notes rise to the top with our community-driven rating system.
              </p>
            </div>

            <div className="border border-gray-700 p-6 rounded-lg text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Share Your Notes</h3>
              <p className="text-gray-400">
                Contribute your study materials and help others while building your academic reputation.
              </p>
            </div>

            <div className="border border-gray-700 p-6 rounded-lg text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Accessible Anywhere</h3>
              <p className="text-gray-400">
                Access your study materials from any device, anywhere, anytime with our cloud-based platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto border border-gray-700 rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to start your learning journey?</h2>
            <p className="text-xl text-gray-400 mb-8">Join thousands of students who are already sharing and discovering high-quality notes.</p>
            <Button
              size="lg"
              onClick={() => navigate("/browse-notes")}
              className="text-lg px-8 bg-white text-black hover:bg-gray-200"
            >
              Get Started
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
