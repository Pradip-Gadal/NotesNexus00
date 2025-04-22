import { createClient } from "@supabase/supabase-js";

// Get Supabase URL and Anon Key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://mfiohghefivdtspfjlgk.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1maW9oZ2hlZml2ZHRzcGZqbGdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyMjQ4NDQsImV4cCI6MjA2MDgwMDg0NH0.iRgBh6umEJZB4WL_VrbmhzErF8HzepP-BWwjnt_yUtM";

// Validate that the URL and Key are provided
if (!supabaseUrl) {
  console.error(
    "Error: Missing Supabase URL. Check ui/src/utils/supabaseClient.ts",
  );
}
if (!supabaseAnonKey) {
  console.error(
    "Error: Missing Supabase Anon Key. Check ui/src/utils/supabaseClient.ts",
  );
}

// Create and export the Supabase client
// We check if the variables exist to prevent errors during initialization,
// although the console errors above should guide the user.
export const supabase = createClient(
  supabaseUrl || "",
  supabaseAnonKey || "",
);

console.log("Supabase client initialized successfully.");
