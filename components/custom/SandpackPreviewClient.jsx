"use client";
import React, { useEffect, useRef, useContext, useState } from "react";
import { SandpackPreview, useSandpack } from "@codesandbox/sandpack-react";
import { ActionContext } from "@/context/ActionContext";
import { RefreshCw } from "lucide-react";

function SandpackPreviewClient() {
  const previewRef = useRef();
  const { sandpack } = useSandpack();
  const { action, setAction } = useContext(ActionContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [key, setKey] = useState(0); // Force re-render key

  useEffect(() => {
    if (sandpack && action) {
      GetSandpackClient();
    }
  }, [sandpack, action]);

  // Add a refresh mechanism to force reload the preview
  const refreshPreview = () => {
    setKey(prev => prev + 1);
    setError(null);
  };

  const GetSandpackClient = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const client = previewRef.current?.getClient();
      if (client) {
        const result = await client.getCodeSandboxURL();
        if (action?.actionType === "deploy") {
          window.open(`https://${result?.sandboxId}.csb.app`);
        } else if (action?.actionType === "export") {
          window.open(result?.editorUrl);
        }
      }
    } catch (err) {
      console.error("Error getting Sandpack client:", err);
      setError("Failed to load preview");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Refresh button */}
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={refreshPreview}
          className="p-2 bg-secondary hover:bg-secondary/80 rounded-md text-secondary-foreground transition-colors"
          title="Refresh Preview"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Error display */}
      {error && (
        <div className="absolute top-12 right-2 z-10 bg-red-600 text-white p-2 rounded-md text-sm">
          {error}
        </div>
      )}

      <SandpackPreview
        key={key} // Force re-render when key changes
        ref={previewRef}
        style={{ height: "80vh", width: "64vw" }}
        showNavigator={true}
        showRefreshButton={false} // We have our own refresh button
        showOpenInCodeSandbox={false}
        actionsChildren={
          <button
            onClick={refreshPreview}
            className="sp-button"
            title="Refresh Preview"
          >
            <RefreshCw className="h-3 w-3" />
          </button>
        }
      />
    </div>
  );
}

export default SandpackPreviewClient;
