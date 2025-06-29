"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";

export function SignInButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signIn } = useAuthActions();
  const [showModal, setShowModal] = useState(false);
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      <button
        className="px-4 py-2 rounded bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold hover:from-purple-700 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        onClick={() => setShowModal(true)}
      >
        Sign In
      </button>

      {/* Sign In Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[70]">
          {/* Modal Content Container */}
          <div className="min-h-screen flex items-center justify-center p-4" style={{ paddingTop: '80px' }}>
            <div className="relative bg-white rounded-2xl p-4 sm:p-6 w-full max-w-md max-h-[calc(100vh-120px)] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-brand text-[#171717]">
                {flow === "signIn" ? "Welcome Back!" : "Join Girlie"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form
              className="flex flex-col gap-3 sm:gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitting(true);
                const formData = new FormData(e.target as HTMLFormElement);
                formData.set("flow", flow);
                void signIn("password", formData)
                  .then(() => {
                    setShowModal(false);
                    toast.success(flow === "signIn" ? "Welcome back!" : "Welcome to Girlie!");
                  })
                  .catch((error) => {
                    let toastTitle = "";
                    if (error.message.includes("Invalid password")) {
                      toastTitle = "Invalid password. Please try again.";
                    } else {
                      toastTitle =
                        flow === "signIn"
                          ? "Could not sign in, did you mean to sign up?"
                          : "Could not sign up, did you mean to sign in?";
                    }
                    toast.error(toastTitle);
                    setSubmitting(false);
                  });
              }}
            >
              <input
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-base"
                type="email"
                name="email"
                placeholder="Email"
                required
              />
              <input
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-base"
                type="password"
                name="password"
                placeholder="Password"
                required
              />
              <button 
                className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 text-base" 
                type="submit" 
                disabled={submitting}
              >
                {submitting ? "Please wait..." : (flow === "signIn" ? "Sign In" : "Sign Up")}
              </button>
              
              <div className="text-center text-sm text-gray-600">
                <span>
                  {flow === "signIn"
                    ? "Don't have an account? "
                    : "Already have an account? "}
                </span>
                <button
                  type="button"
                  className="text-purple-600 hover:text-purple-700 hover:underline font-medium cursor-pointer"
                  onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
                >
                  {flow === "signIn" ? "Sign up instead" : "Sign in instead"}
                </button>
              </div>
            </form>
            
            <div className="flex items-center justify-center my-3 sm:my-4">
              <hr className="grow border-gray-200" />
              <span className="mx-4 text-gray-500 text-sm">or</span>
              <hr className="grow border-gray-200" />
            </div>
            
            <button 
              className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors border border-gray-200 text-base"
              onClick={() => {
                void signIn("anonymous").then(() => {
                  setShowModal(false);
                  toast.success("Welcome! You're browsing anonymously.");
                });
              }}
            >
              Continue as Guest
            </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 