"use client";
import React, { useState, useEffect } from "react";
import { useSandpack } from "@codesandbox/sandpack-react";
import { AlertTriangle, CheckCircle, XCircle, RefreshCw } from "lucide-react";

function PreviewDebugger({ onRefresh }) {
  const { sandpack } = useSandpack();
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [isMinimized, setIsMinimized] = useState(true);

  useEffect(() => {
    if (sandpack) {
      const { status: sandpackStatus, error: sandpackError } = sandpack;
      setStatus(sandpackStatus);
      setError(sandpackError);
    }
  }, [sandpack]);

  const getStatusColor = () => {
    switch (status) {
      case "running":
        return "text-green-600";
      case "error":
        return "text-destructive";
      case "loading":
        return "text-primary";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "running":
        return <CheckCircle className="h-4 w-4" />;
      case "error":
        return <XCircle className="h-4 w-4" />;
      case "loading":
        return <RefreshCw className="h-4 w-4 animate-spin" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  if (process.env.NODE_ENV === "production") {
    return null; // Don't show in production
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`bg-card border border-border rounded-lg shadow-lg transition-all duration-200 ${
          isMinimized ? "w-12 h-12" : "w-64 p-3"
        }`}
      >
        <div className={`flex items-center ${isMinimized ? "justify-center" : "justify-between"}`}>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className={`${getStatusColor()} hover:opacity-80 transition-opacity ${
              isMinimized ? "items-center justify-center mt-3" : ""
            }`}
          >
            {getStatusIcon()}
          </button>
          
          {!isMinimized && (
            <button
              onClick={onRefresh}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          )}
        </div>

        {!isMinimized && (
          <div className="mt-2 text-sm text-foreground">
            <div className="mb-2">
              <span className="font-medium">Status:</span>
              <span className={`ml-2 ${getStatusColor()}`}>
                {status || "unknown"}
              </span>
            </div>
            
            {error && (
              <div className="mb-2">
                <span className="font-medium text-destructive">Error:</span>
                <div className="text-xs text-destructive/80 mt-1 break-words">
                  {error.message || error.toString()}
                </div>
              </div>
            )}

            <div className="text-xs text-muted-foreground">
              Files loaded: {sandpack?.files ? Object.keys(sandpack.files).length : 0}
            </div>
            
            {status === "error" && (
              <div className="mt-2 text-xs text-muted-foreground">
                💡 Try refreshing the preview or switching tabs
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PreviewDebugger; 