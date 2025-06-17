import { create } from "zustand";
import { User } from "../types";
import supabase from "./../helper/SupabaseClient";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) {
        console.error("Auth Error:", authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error("No user data returned from authentication");
      }

     
      const { data: userData, error: userError } = await supabase
        .from("user_admin")
        .select("id_user, username, email, password_hash")
        .eq("id_user", authData.user.id) // Use auth user ID
        .single();

      if (userError) {
        console.error("User Data Error:", userError);
        throw new Error("Failed to get user profile");
      }

      set({
        user: userData,
        isAuthenticated: true,
        loading: false,
        error: null,
      });

      return true;
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      set({
        error: errorMessage,
        loading: false,
        isAuthenticated: false,
        user: null,
      });
      return false;
    }
  },

  register: async (username: string, email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      
      const { data: existingUser, error: checkError } = await supabase
        .from("user_admin")
        .select("username")
        .eq("username", username)
        .maybeSingle();

      if (checkError && checkError.code !== "PGRST116") {
        console.error("Username check error:", checkError);
        throw checkError;
      }

      if (existingUser) {
        throw new Error("Username sudah digunakan");
      }

      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        console.error("Auth signup error:", authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error("Failed to create user account");
      }

     
      await new Promise((resolve) => setTimeout(resolve, 1000));

     
      const userProfile = {
        id_user: authData.user.id,
        username: username,
        email: email,
        password_hash: "", 
      };

      const { data: userData, error: userError } = await supabase
        .from("user_admin")
        .insert([userProfile])
        .select("id_user, username, email, password_hash")
        .single();

      if (userError) {
        console.error("User profile creation error:", userError);

        
        await supabase.auth.signOut();

        if (userError.code === "23505") {
          if (userError.message.includes("username")) {
            throw new Error("Username sudah terdaftar");
          } else if (userError.message.includes("email")) {
            throw new Error("Email sudah terdaftar");
          } else {
            throw new Error("Email atau username sudah terdaftar");
          }
        }
        throw new Error("Gagal membuat profil user: " + userError.message);
      }

      set({
        user: userData,
        isAuthenticated: true,
        loading: false,
        error: null,
      });

      return true;
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Registration failed";
      set({
        error: errorMessage,
        loading: false,
        isAuthenticated: false,
        user: null,
      });
      return false;
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Logout error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Logout failed";
      set({ error: errorMessage, loading: false });
    }
  },

  checkAuth: async () => {
    set({ loading: true });
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      if (session?.user) {
        // Get user profile
        const { data: userData, error } = await supabase
          .from("user_admin")
          .select("id_user, username, email, password_hash")
          .eq("id_user", session.user.id)
          .single();

        if (error) {
          console.error("Failed to get user profile:", error);
          // Jika user tidak ditemukan di tabel custom, logout dari auth
          if (error.code === "PGRST116") {
            await supabase.auth.signOut();
            set({
              user: null,
              isAuthenticated: false,
              loading: false,
              error: null,
            });
            return;
          }
          throw error;
        }

        set({
          user: userData,
          isAuthenticated: true,
          loading: false,
          error: null,
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error("Auth check error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Auth check failed";
      set({
        error: errorMessage,
        loading: false,
        user: null,
        isAuthenticated: false,
      });
    }
  },
}));
