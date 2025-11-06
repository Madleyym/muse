"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[MiniApp Error Boundary]:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8 border-2 border-red-200">
        <div className="text-center">
          {/* Error Icon */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* Error Message */}
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Oops! Something went wrong
          </h2>

          <p className="text-sm text-slate-600 mb-6">
            {error.message || "An unexpected error occurred"}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={reset}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 rounded-xl hover:opacity-90 transition font-medium text-sm"
            >
              Try Again
            </button>
            <a
              href="/"
              className="flex-1 border-2 border-purple-200 text-purple-600 px-4 py-3 rounded-xl hover:bg-purple-50 transition font-medium text-sm text-center"
            >
              Go Home
            </a>
          </div>

          {/* Dev Error Details */}
          {process.env.NODE_ENV === "development" && (
            <details className="mt-4 text-left">
              <summary className="text-xs text-slate-500 cursor-pointer hover:text-slate-700 font-medium">
                Error Details (Dev Only)
              </summary>
              <pre className="mt-2 text-[10px] bg-slate-100 p-3 rounded overflow-auto max-h-40 text-left font-mono">
                {error.stack}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}
