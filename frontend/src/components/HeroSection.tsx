import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export interface Props {
  className?: string;
}

export function HeroSection({ className = "" }: Props) {
  const navigate = useNavigate();

  return (
    <section className={`py-16 md:py-24 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="block">Seamless Full-Stack</span>
              <span className="block text-primary/80">Development with Supabase</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
              Build powerful web applications with integrated frontend and backend services. StackFusion brings together the best tools in a unified environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg" 
                onClick={() => navigate("/signup")}
                className="text-lg px-8"
              >
                Get Started Free
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-8"
                onClick={() => navigate("/demo")}
              >
                View Demo
              </Button>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-full max-w-md bg-gradient-to-br from-blue-50 to-purple-50 p-1 rounded-lg shadow-xl">
              <div className="bg-white rounded-md p-6 shadow-sm">
                <div className="space-y-4">
                  <div className="h-6 w-3/4 bg-gray-100 rounded-md"></div>
                  <div className="h-6 w-1/2 bg-gray-100 rounded-md"></div>
                  <div className="h-6 w-5/6 bg-gray-100 rounded-md"></div>
                  <div className="pt-4">
                    <div className="h-10 w-full bg-primary/10 rounded-md"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
