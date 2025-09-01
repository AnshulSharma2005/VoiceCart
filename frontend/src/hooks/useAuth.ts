// src/hooks/useAuth.ts
import { useState, useEffect, useCallback, useRef } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser,
} from "firebase/auth";
import { auth } from "../../../shared/firebase.client";
import { FirebaseError } from "firebase/app";
import { UserType } from "../../../shared";

interface AuthState {
  user: UserType | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error?: string;
}

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

// Map Firebase User to custom UserType
const mapUser = (firebaseUser: FirebaseUser): UserType => ({
  id: firebaseUser.uid,
  name: firebaseUser.displayName || "Anonymous",
  email: firebaseUser.email || "",
  createdAt: firebaseUser.metadata?.creationTime
    ? new Date(firebaseUser.metadata.creationTime)
    : new Date(),
});

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: undefined,
  });

  const [signupSuccess, setSignupSuccess] = useState(false);

  // 🚩 flag to prevent auto-login after signup
  const signingUpRef = useRef(false);

  // Monitor Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Skip auto-login if we are in signup flow
      if (signingUpRef.current) {
        return;
      }

      if (user) {
        setAuthState({
          user: mapUser(user),
          isAuthenticated: true,
          isLoading: false,
          error: undefined,
        });
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: undefined,
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // Signup
  const signup = useCallback(
    async (email: string, password: string, name: string) => {
      email = email.trim();
      if (!isValidEmail(email)) {
        return { success: false, error: "Invalid email address format." };
      }

      try {
        if (!name || !email || !password) {
          throw new Error("Please fill all fields");
        }

        // 🚩 mark as signup flow
        signingUpRef.current = true;

        // 🚀 Create account
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await updateProfile(userCredential.user, { displayName: name });

        // 🚨 Immediately sign out
        await signOut(auth);

        // ✅ Reset state to logged-out
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: undefined,
        });

        setSignupSuccess(true);
        return { success: true };
      } catch (error) {
        let errorMessage = "Signup failed";
        if (error instanceof FirebaseError) {
          switch (error.code) {
            case "auth/invalid-email":
              errorMessage = "Invalid email address.";
              break;
            case "auth/weak-password":
              errorMessage = "Password should be at least 6 characters.";
              break;
            case "auth/email-already-in-use":
              errorMessage = "This email is already registered.";
              break;
            default:
              errorMessage = error.message;
          }
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
        return { success: false, error: errorMessage };
      } finally {
        // 🚩 clear signup flag
        signingUpRef.current = false;
      }
    },
    []
  );

  // Login
  const login = useCallback(async (email: string, password: string) => {
    email = email.trim();
    if (!isValidEmail(email)) {
      return { success: false, error: "Invalid email address format." };
    }
    setAuthState((prev) => ({ ...prev, isLoading: true, error: undefined }));
    try {
      if (!email || !password) {
        throw new Error("Please enter email and password");
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setAuthState({
        user: mapUser(userCredential.user),
        isAuthenticated: true,
        isLoading: false,
        error: undefined,
      });
      return { success: true };
    } catch (error) {
      let errorMessage = "Login failed. Please try again.";

      if (error instanceof FirebaseError) {
        errorMessage = error.code.replace("auth/", "").replace(/-/g, " ");
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: undefined,
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, []);

  // Clear error state
  const clearError = useCallback(() => {
    setAuthState((prev) => ({ ...prev, error: undefined }));
  }, []);

  // Clear signup success
  const clearSignupSuccess = useCallback(() => {
    setSignupSuccess(false);
  }, []);

  return {
    ...authState,
    signup,
    login,
    logout,
    clearError,
    signupSuccess,
    clearSignupSuccess,
  };
}
