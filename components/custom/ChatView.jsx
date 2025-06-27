"use client";
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import { api } from "@/convex/_generated/api";
import Colors from "@/data/Colors";
import { useConvex, useMutation } from "convex/react";
import { useParams } from "next/navigation";
import React, { useContext, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, Link, Loader2Icon } from "lucide-react";
import Lookup from "@/data/Lookup";
import { useState } from "react";
import axios from "axios";
import Prompt from "@/data/Prompt";
import ReactMarkdown from "react-markdown";
import { useSidebar } from "../ui/sidebar";

function ChatView() {
  const { id } = useParams();
  const convex = useConvex();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const { messages, setMessages } = useContext(MessagesContext);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const UpdateMessages = useMutation(api.workspace.UpdateMessages);
  const { toggleSidebar } = useSidebar();

  useEffect(() => {
    id && GetWorkspaceData();
  }, []);

  // get workspace data
  const GetWorkspaceData = async () => {
    const workspace = await convex.query(api.workspace.GetWorkspace, {
      workspaceId: id,
    });
    console.log("Workspace data:", workspace);
    setMessages(workspace.messages);
    // return workspace;
  };

  useEffect(() => {
    if (messages?.length > 0) {
      const role = messages[messages.length - 1].role;
      if (role === "user") {
        GetAiResponse();
      }
    }
  }, [messages]);

  const GetAiResponse = async () => {
    setLoading(true);
    const PROMPT = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
    const result = await axios.post("/api/ai-chat", {
      prompt: PROMPT,
    });
    let response;
    try {
      response = result.data.result;
    } catch (error) {
      response = "something went wrong" + error;
    }
    // console.log("AI Response:", response);
    const aiResp = {
      role: "ai",
      content: response,
    };
    setMessages((prev) => [...prev, aiResp]);
    await UpdateMessages({
      messages: [...messages, aiResp],
      workspaceId: id,
    });
    setLoading(false);
  };

  const onGenerate = async (input) => {
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: input,
      },
    ]);
    setUserInput("");
  };

  return (
    <div className="relative h-[88vh] flex flex-col">
      {/* user-ai */}
      <div className="flex-1 overflow-y-scroll pl-5">
        {messages.length > 0 &&
          messages.map((message, index) => (
            <div
              key={index}
              className="p-3 rounded-lg mb-2 flex gap-2 items-center leading-7"
              style={{ backgroundColor: Colors.CHAT_BACKGROUND }}
            >
              {message?.role === "user" && (
                <Image
                  src={userDetail?.picture}
                  alt="User"
                  width={35}
                  height={35}
                  className="rounded-full"
                />
              )}
              <div className="flex flex-col">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            </div>
          ))}
        {loading && (
          <div
            className="p-3 rounded-lg mb-2 flex gap-2 items-center"
            style={{ backgroundColor: Colors.CHAT_BACKGROUND }}
          >
            <Loader2Icon className="animate-spin " />
            <h2>Generating response...</h2>
          </div>
        )}
      </div>
      {/* input section */}
      <div className="flex gap-2 items-end pl-5">
        {userDetail && (
          <Image
            src={userDetail?.picture}
            alt="user"
            width={30}
            height={30}
            className="rounded-full cursor-pointer"
            onClick={toggleSidebar}
          />
        )}
        <div className="p-5 border border-gray-800 rounded-xl max-w-xl w-full mt-3">
          <div className="flex gap-2">
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={Lookup.INPUT_PLACEHOLDER}
              className="outline-none bg-transparent w-full h-32 max-h-56 resize-none"
            />
            {userInput && (
              <ArrowRight
                onClick={() => onGenerate(userInput)}
                className="bg-blue-500 p-2 h-8 w-8 rounded-md cursor-pointer"
              />
            )}
          </div>
          <div>
            <Link />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatView;
