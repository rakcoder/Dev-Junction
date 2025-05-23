import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import Cookies from "js-cookie";

interface UserProfile {
  email?: string;
  phone?: string;
  bio?: string;
  skills?: string[];
  age: number;
  hourlyRate?: number;
  githubUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  availability?: {
    monday: string[];
    tuesday: string[];
    wednesday: string[];
    thursday: string[];
    friday: string[];
  };
}

interface User {
  _id: string;
  address: string;
  name: string;
  role: "developer" | "customer";
  age: number;
  profile?: UserProfile;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData?: Omit<User, "_id">) => Promise<void>;
  logout: () => Promise<void>;
  connectWallet: () => Promise<string>;
  checkWalletAuth: (address: string) => Promise<User | null>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  getProfile: () => Promise<UserProfile>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = "https://dev-junction.onrender.com";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/api/auth/me`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`, // Add token to headers
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.data);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };

    checkAuth();
  }, []);

  const connectWallet = async (): Promise<string> => {
    if (!window.ethereum) {
      throw new Error("Please install MetaMask");
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      return accounts[0];
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      throw error;
    }
  };

  const checkWalletAuth = async (address: string): Promise<User | null> => {
    try {
      const response = await fetch(`${API_URL}/api/auth/wallet/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add token to headers
        },
        credentials: "include",
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        throw new Error("Failed to check wallet");
      }

      const data = await response.json();
      return data.exists ? data.data : null;
    } catch (error) {
      console.error("Failed to check wallet:", error);
      throw error;
    }
  };

  const login = async (userData?: Omit<User, "_id">) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      // Sign message for verification
      const message = `Welcome to Synergy!\n\nPlease sign this message to verify your wallet ownership.\n\nNonce: ${Math.floor(
        Math.random() * 1000000
      )}`;
      const signature = await signer.signMessage(message);

      const response = await fetch(`${API_URL}/api/auth/wallet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
        body: JSON.stringify({
          address,
          signature,
          ...userData,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Authentication failed");
      }

      const data = await response.json();
      if (data.data.token) {
        localStorage.setItem("token", data.data.token);
      }
      setUser(data.data);

      // Redirect based on user role
      if (data.data.role === "developer") {
        navigate("/developer/dashboard");
      } else {
        navigate("/customer/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add token to headers
        },
      });
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getProfile = async (): Promise<UserProfile> => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/users/profile`, {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`, // Add token to headers
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      throw error;
    }
  };

  const updateProfile = async (
    profileData: Partial<UserProfile>
  ): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      setUser((prev) => (prev ? { ...prev, ...data.data } : null));
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        connectWallet,
        checkWalletAuth,
        updateProfile,
        getProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
