import { create } from "zustand";
import { supabase } from "utils/supabaseClient";
import { useAuthStore } from "./authStore"; // Import auth store to get user ID
import { toast } from "sonner";

// Define the structure for a Project
export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: Error | null;
  fetchProjects: () => Promise<void>;
  createProject: (name: string, description?: string) => Promise<Project | null>;
  deleteProject: (projectId: string) => Promise<void>;
  // Add updateProject later if needed
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  loading: false,
  error: null,

  fetchProjects: async () => {
    const user = useAuthStore.getState().user;
    if (!user) {
        console.log("Fetch projects called, but no user logged in.");
        set({ projects: [], loading: false, error: null }); // Clear projects if no user
        return;
    }

    set({ loading: true, error: null });
    console.log("Fetching projects for user:", user.id);
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }); // Show newest first

      if (error) {
        console.error("Error fetching projects:", error);
        throw error;
      }

      console.log("Projects fetched:", data);
      set({ projects: data || [], loading: false });
    } catch (error: any) {
      console.error("Exception while fetching projects:", error);
      set({ error, loading: false, projects: [] });
      toast.error("Failed to load projects: " + error.message);
    }
  },

  createProject: async (name: string, description?: string) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      toast.error("You must be logged in to create a project.");
      return null;
    }

    set({ loading: true }); // Indicate loading state
    try {
      const newProjectData = {
        user_id: user.id,
        name,
        description: description || null, // Set to null if empty
      };

      console.log("Creating project with data:", newProjectData);

      const { data, error } = await supabase
        .from("projects")
        .insert(newProjectData)
        .select() // Select the newly created project data
        .single(); // Expecting a single row back

      if (error) {
        console.error("Error creating project:", error);
        throw error;
      }

      console.log("Project created successfully:", data);
      // Add the new project to the start of the list
      set((state) => ({
        projects: [data as Project, ...state.projects],
        loading: false,
        error: null,
      }));
      toast.success(`Project "${name}" created!`);
      return data as Project;

    } catch (error: any) {
        console.error("Exception while creating project:", error);
        set({ error, loading: false });
        toast.error("Failed to create project: " + error.message);
        return null;
    } 
    // No finally needed, handled by success/error paths
  },

  deleteProject: async (projectId: string) => {
    const user = useAuthStore.getState().user;
     if (!user) {
      toast.error("You must be logged in to delete a project.");
      return;
    }

    // Optional: Find project name for toast message before deleting
    const projectName = get().projects.find(p => p.id === projectId)?.name || 'Project';

    // Optimistic update: remove project from UI immediately
    const originalProjects = get().projects;
    set((state) => ({
        projects: state.projects.filter(p => p.id !== projectId),
    }));
    
    console.log("Attempting to delete project:", projectId);
    toast.info(`Deleting "${projectName}"...`);

    try {
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', projectId)
            .eq('user_id', user.id); // Ensure user owns the project

        if (error) {
            console.error("Error deleting project:", error);
            throw error;
        }

        console.log("Project deleted successfully from DB:", projectId);
        toast.success(`"${projectName}" deleted successfully!`);
        // No need to update state again, already done optimistically

    } catch (error: any) {
        console.error("Exception while deleting project:", error);
        // Revert optimistic update on error
        set({ projects: originalProjects, error });
        toast.error(`Failed to delete "${projectName}": ${error.message}`);
    }
  },

}));
