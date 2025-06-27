"use client";
import { MessagesContext } from "@/context/MessagesContext";

import Lookup from "@/data/Lookup";
import Prompt from "@/data/Prompt";
import axios from "axios";

import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import { useContext, useEffect, useState, useCallback } from "react";
import { useConvex, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import SandpackPreviewClient from "./SandpackPreviewClient";
import PreviewDebugger from "./PreviewDebugger";
import { ActionContext } from "@/context/ActionContext";

function CodeView() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("code");
  const [files, setFiles] = useState(Lookup?.DEFAULT_FILE);
  const [prevFiles, setPrevFiles] = useState(null); // Track previous files
  const { messages, setMessages } = useContext(MessagesContext);
  const UpdateFiles = useMutation(api.workspace.UpdateFiles);
  const convex = useConvex();
  const [loading, setLoading] = useState(false);
  const { action, setAction } = useContext(ActionContext);
  const [sandpackKey, setSandpackKey] = useState(0); // Force re-render

  useEffect(() => {
    id && GetWorkspaceFile();
  }, [id]);

  useEffect(() => {
    setActiveTab("preview");
  }, [action]);

  // Force refresh Sandpack when files change significantly
  useEffect(() => {
    if (files && prevFiles && JSON.stringify(files) !== JSON.stringify(prevFiles)) {
      // Delay slightly to ensure Sandpack processes the change
      const timer = setTimeout(() => {
        setSandpackKey(prev => prev + 1);
      }, 100);
      return () => clearTimeout(timer);
    }
    setPrevFiles(files);
  }, [files]);

  const GetWorkspaceFile = async () => {
    setLoading(true);
    try {
      const result = await convex.query(api.workspace.GetWorkspace, {
        workspaceId: id,
      });
      
      if (result?.fileData) {
        const mergedFiles = { ...Lookup.DEFAULT_FILE, ...result.fileData };
        setFiles(mergedFiles);
      } else {
        setFiles(Lookup.DEFAULT_FILE);
      }
    } catch (error) {
      console.error("Error fetching workspace:", error);
      setFiles(Lookup.DEFAULT_FILE);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (messages?.length > 0) {
      const role = messages[messages.length - 1].role;
      if (role === "user") {
        GenerateAiCode();
      }
    }
  }, [messages]);

  const GenerateAiCode = async () => {
    setLoading(true);
    try {
      const PROMPT =
        messages[messages.length - 1].content + " " + Prompt.CODE_GEN_PROMPT;
      const result = await axios.post("/api/gen-ai-code", {
        prompt: PROMPT,
      });
      
      console.log("AI Response:", result.data);
      const aiResp = result.data;

      if (aiResp?.files) {
        const mergedFiles = { ...Lookup.DEFAULT_FILE, ...aiResp.files };
        setFiles(mergedFiles);
        await UpdateFiles({ workspaceId: id, files: aiResp.files });
        
        // Switch to preview tab after generating new code
        setTimeout(() => {
          setActiveTab("preview");
        }, 500);
      }
    } catch (error) {
      console.error("Error generating AI code:", error);
    } finally {
      setLoading(false);
    }
  };

  // Memoized tab switching to prevent unnecessary re-renders
  const handleTabSwitch = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  return (
    <div className="relative border border-border rounded-lg p-1 h-[88vh]">
      <div className="bg-card w-full px-2 border-b border-border">
        <div className="flex shrink-0 bg-secondary p-2 w-[140px] gap-3 justify-center items-center rounded-full">
          <h2
            className={`text-sm cursor-pointer transition-all ${activeTab == "code" ? "text-primary bg-primary/20 rounded-full p-1 px-2" : "hover:text-foreground/80"}`}
            onClick={() => handleTabSwitch("code")}
          >
            Code
          </h2>
          <h2
            className={`text-sm cursor-pointer transition-all ${activeTab != "code" ? "text-primary bg-primary/20 rounded-full p-1 px-2" : "hover:text-foreground/80"}`}
            onClick={() => handleTabSwitch("preview")}
          >
            Preview
          </h2>
        </div>
      </div>
      
      <SandpackProvider
        key={sandpackKey} // Force re-render when key changes
        files={files}
        template="react"
        theme={"light"}
        customSetup={{
          dependencies: {
            ...Lookup.DEPENDANCY,
          },
        }}
        options={{
          externalResources: ["https://cdn.tailwindcss.com"],
          bundlerURL: undefined, // Use default bundler
          startRoute: "/",
        }}
      >
        <SandpackLayout>
          {activeTab === "code" && (
            <>
              <SandpackFileExplorer style={{ height: "80vh" }} />
              <SandpackCodeEditor 
                style={{ height: "80vh" }}
                showTabs={true}
                showLineNumbers={true}
                wrapContent={true}
              />
            </>
          )}
          {activeTab === "preview" && (
            <>
              <SandpackPreviewClient />
              <PreviewDebugger onRefresh={() => setSandpackKey(prev => prev + 1)} />
            </>
          )}
        </SandpackLayout>
      </SandpackProvider>

      {loading && (
        <div className="p-10 bg-background/90 backdrop-blur-sm absolute top-0 rounded-lg w-full h-full flex justify-center items-center z-50 overflow-hidden">
          {/* Animated Background Blobs */}
          <div className="absolute inset-0">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50"></div>
            
            {/* Animated Gradient Orbs - Converging Animation */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob-1" style={{transform: 'translate(-50%, -50%)'}}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-blob-2" style={{transform: 'translate(-50%, -50%)'}}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 bg-gradient-to-r from-pink-400 to-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob-3" style={{transform: 'translate(-50%, -50%)'}}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-35 animate-blob-4" style={{transform: 'translate(-50%, -50%)'}}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-r from-green-400 to-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-blob-5" style={{transform: 'translate(-50%, -50%)'}}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob-6" style={{transform: 'translate(-50%, -50%)'}}></div>
            
            {/* Floating Particles */}
            <div className="absolute top-1/3 left-1/5 w-2 h-2 bg-blue-400 rounded-full opacity-40 animate-float"></div>
            <div className="absolute top-2/3 right-1/5 w-1 h-1 bg-purple-400 rounded-full opacity-50 animate-float animation-delay-3000"></div>
            <div className="absolute bottom-1/3 left-2/5 w-1.5 h-1.5 bg-pink-400 rounded-full opacity-30 animate-float animation-delay-1500"></div>
            <div className="absolute top-1/5 right-2/5 w-2 h-2 bg-cyan-400 rounded-full opacity-35 animate-float animation-delay-4500"></div>
          </div>
          
          {/* Loading Content */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="flex items-center">
              <Loader2Icon className="animate-spin h-10 w-10 text-primary" />
              <h2 className="text-foreground ml-3 text-lg font-medium">Generating your files... </h2>
            </div>
            
            {/* Pulsing Code Icons */}
            <div className="flex gap-4 mt-6">
              <div className="w-3 h-3 bg-blue-500 rounded opacity-70 animate-pulse"></div>
              <div className="w-3 h-3 bg-purple-500 rounded opacity-70 animate-pulse animation-delay-500"></div>
              <div className="w-3 h-3 bg-pink-500 rounded opacity-70 animate-pulse animation-delay-1000"></div>
              <div className="w-3 h-3 bg-cyan-500 rounded opacity-70 animate-pulse animation-delay-1500"></div>
            </div>
          </div>

          {/* Custom Styles for this component */}
          <style jsx>{`
            @keyframes blob-1 {
              0% { transform: translate(-100px, -100px) scale(1); }
              25% { transform: translate(-50px, -150px) scale(1.1); }
              50% { transform: translate(0px, 0px) scale(1.2); }
              70% { transform: translate(0px, 0px) scale(1.2); }
              100% { transform: translate(-150px, -100px) scale(0.8); }
            }
            
            @keyframes blob-2 {
              0% { transform: translate(100px, 100px) scale(1); }
              25% { transform: translate(150px, 50px) scale(1.1); }
              50% { transform: translate(0px, 0px) scale(1.2); }
              70% { transform: translate(0px, 0px) scale(1.2); }
              100% { transform: translate(200px, 150px) scale(0.8); }
            }
            
            @keyframes blob-3 {
              0% { transform: translate(-150px, 50px) scale(1); }
              25% { transform: translate(-100px, -50px) scale(1.1); }
              50% { transform: translate(0px, 0px) scale(1.2); }
              70% { transform: translate(0px, 0px) scale(1.2); }
              100% { transform: translate(-200px, 125px) scale(0.8); }
            }
            
            @keyframes blob-4 {
              0% { transform: translate(150px, -100px) scale(1); }
              25% { transform: translate(100px, 100px) scale(1.1); }
              50% { transform: translate(0px, 0px) scale(1.2); }
              70% { transform: translate(0px, 0px) scale(1.2); }
              100% { transform: translate(175px, -125px) scale(0.8); }
            }
            
            @keyframes blob-5 {
              0% { transform: translate(-50px, -150px) scale(1); }
              25% { transform: translate(100px, -100px) scale(1.1); }
              50% { transform: translate(0px, 0px) scale(1.2); }
              70% { transform: translate(0px, 0px) scale(1.2); }
              100% { transform: translate(-125px, 150px) scale(0.8); }
            }
            
            @keyframes blob-6 {
              0% { transform: translate(50px, 150px) scale(1); }
              25% { transform: translate(-100px, 100px) scale(1.1); }
              50% { transform: translate(0px, 0px) scale(1.2); }
              70% { transform: translate(0px, 0px) scale(1.2); }
              100% { transform: translate(150px, 100px) scale(0.8); }
            }
            
            @keyframes float {
              0%, 100% {
                transform: translateY(0px);
              }
              50% {
                transform: translateY(-20px);
              }
            }
            
            .animate-blob-1 { animation: blob-1 5s ease-in-out infinite; }
            .animate-blob-2 { animation: blob-2 5s ease-in-out infinite; }
            .animate-blob-3 { animation: blob-3 5s ease-in-out infinite; }
            .animate-blob-4 { animation: blob-4 5s ease-in-out infinite; }
            .animate-blob-5 { animation: blob-5 5s ease-in-out infinite; }
            .animate-blob-6 { animation: blob-6 5s ease-in-out infinite; }
            
            .animation-delay-500 {
              animation-delay: 0.5s;
            }
            
            .animation-delay-1000 {
              animation-delay: 1s;
            }
            
            .animation-delay-1500 {
              animation-delay: 1.5s;
            }
            
            .animation-delay-2000 {
              animation-delay: 2s;
            }
            
            .animation-delay-3000 {
              animation-delay: 3s;
            }
            
            .animation-delay-4000 {
              animation-delay: 4s;
            }
            
            .animation-delay-4500 {
              animation-delay: 4.5s;
            }
            
            .animation-delay-5000 {
              animation-delay: 5s;
            }
            
            .animation-delay-6000 {
              animation-delay: 6s;
            }
            
            .animate-float {
              animation: float 6s ease-in-out infinite;
            }
          `}</style>
        </div>
      )}
    </div>
  );
}

export default CodeView;
