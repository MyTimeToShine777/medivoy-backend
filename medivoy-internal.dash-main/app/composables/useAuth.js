// composables/useAuth.js
import { ref, computed } from "vue";

const user = ref(null);
const isLoading = ref(false);
const error = ref(null);

export const useAuth = () => {
  // Mock users for demonstration
  const mockUsers = {
    "admin@medivoy.com": {
      id: "1",
      email: "admin@medivoy.com",
      name: "Dr. Sarah Mitchell",
      firstName: "Sarah",
      lastName: "Mitchell",
      role: "Super Admin",
      department: "Administration",
      avatar: "https://i.pravatar.cc/200?img=44",
      title: "Chief Medical Officer",
      phone: "+1-555-0123",
      lastLogin: new Date().toISOString(),
      permissions: ["read", "write", "delete", "admin"],
      preferences: {
        theme: "system",
        language: "en",
        notifications: true,
        emailUpdates: true,
      },
    },
  };

  const isAuthenticated = computed(() => !!user.value);

  // Initialize auth state from localStorage
  const initAuth = () => {
    if (process.client) {
      const storedUser = localStorage.getItem("medivoy_user");
      const storedToken = localStorage.getItem("medivoy_token");

      if (storedUser && storedToken) {
        try {
          user.value = JSON.parse(storedUser);
        } catch (e) {
          localStorage.removeItem("medivoy_user");
          localStorage.removeItem("medivoy_token");
        }
      }
    }
  };

  // Login with email/password
  const login = async (email, password) => {
    isLoading.value = true;
    error.value = null;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockUser = mockUsers[email];
      if (mockUser && password === "password123") {
        user.value = mockUser;

        // Store in localStorage
        if (process.client) {
          localStorage.setItem("medivoy_user", JSON.stringify(mockUser));
          localStorage.setItem("medivoy_token", "mock-jwt-token-" + Date.now());
        }

        return { success: true };
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (err) {
      error.value = err.message;
      return { success: false, error: err.message };
    } finally {
      isLoading.value = false;
    }
  };

  // Logout
  const logout = async () => {
    isLoading.value = true;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      user.value = null;

      // Clear localStorage
      if (process.client) {
        localStorage.removeItem("medivoy_user");
        localStorage.removeItem("medivoy_token");
      }

      await navigateTo("/auth/login");
    } finally {
      isLoading.value = false;
    }
  };

  // Update user profile
  const updateProfile = async (updates) => {
    isLoading.value = true;
    error.value = null;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      user.value = { ...user.value, ...updates };

      // Update localStorage
      if (process.client) {
        localStorage.setItem("medivoy_user", JSON.stringify(user.value));
      }

      return { success: true };
    } catch (err) {
      error.value = err.message;
      return { success: false, error: err.message };
    } finally {
      isLoading.value = false;
    }
  };

  return {
    user: readonly(user),
    isAuthenticated,
    isLoading: readonly(isLoading),
    error: readonly(error),
    initAuth,
    login,
    logout,
    updateProfile,
  };
};
