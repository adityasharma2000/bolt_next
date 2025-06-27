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
import { useContext, useEffect, useState } from "react";
import { useConvex, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import SandpackPreviewClient from "./SandpackPreviewClient";
import { ActionContext } from "@/context/ActionContext";

function CodeView() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("code");
  const [files, setFiles] = useState(Lookup?.DEFAULT_FILE);
  const { messages, setMessages } = useContext(MessagesContext);
  const UpdateFiles = useMutation(api.workspace.UpdateFiles);
  const convex = useConvex();
  const [loading, setLoading] = useState(false);
  const { action, setAction } = useContext(ActionContext);

  useEffect(() => {
    id && GetWorkspaceFile();
  }, [id]);

  useEffect(() => {
    setActiveTab("preview");
  }, [action]);

  const GetWorkspaceFile = async () => {
    setLoading(true);
    const result = await convex.query(api.workspace.GetWorkspace, {
      workspaceId: id,
    });
    // console.log("Workspace data:", workspace);
    const mergedFiles = { ...Lookup.DEFAULT_FILE, ...result?.fileData };
    setFiles(mergedFiles);
    setLoading(false);
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
    const PROMPT =
      messages[messages.length - 1].content + " " + Prompt.CODE_GEN_PROMPT;
    const result = await axios.post("/api/gen-ai-code", {
      prompt: PROMPT,
    });
    console.log(result.data);
    const aiResp = result.data;

    const mergedFiles = { ...Lookup.DEFAULT_FILE, ...aiResp?.files };
    setFiles(mergedFiles);
    await UpdateFiles({ workspaceId: id, files: aiResp?.files });
    setLoading(false);
  };

  return (
    <div className="relative border border-gray-700 rounded-lg p-1 h-[88vh]">
      <div className="bg-[#181818] w-full px-2 border-b">
        <div className="flex shrink-0 bg-black p-2  w-[140px] gap-3 justify-center items-center rounded-full">
          <h2
            className={`text-sm cursor-pointer ${activeTab == "code" && "text-blue-500 bg-blue-500/25  rounded-full p-1 px-2"}`}
            onClick={() => setActiveTab("code")}
          >
            Code
          </h2>
          <h2
            className={`text-sm cursor-pointer ${activeTab != "code" && "text-blue-500 bg-blue-500/25  rounded-full p-1 px-2"}`}
            onClick={() => setActiveTab("preview")}
          >
            Preview
          </h2>
        </div>
      </div>
      <SandpackProvider
        files={files}
        template="react"
        theme={"dark"}
        customSetup={{
          dependencies: {
            ...Lookup.DEPENDANCY,
          },
        }}
        options={{
          externalResources: ["https://cdn.tailwindcss.com"],
        }}
      >
        <SandpackLayout>
          {activeTab === "code" && (
            <>
              <SandpackFileExplorer style={{ height: "80vh" }} />
              <SandpackCodeEditor style={{ height: "80vh" }} />
            </>
          )}
          {activeTab === "preview" && (
            <>
              <SandpackPreviewClient />
            </>
          )}
        </SandpackLayout>
      </SandpackProvider>

      {loading && (
        <div className="p-10 bg-gray-900/80 absolute top-0 rounded-lg w-full h-full flex justify-center items-center">
          <Loader2Icon className="animate-spin h-10 w-10 text-white" />
          <h2 className="text-white">Generating your files... </h2>
        </div>
      )}
    </div>
  );
}

export default CodeView;
