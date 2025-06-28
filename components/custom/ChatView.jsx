"use client";
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import { api } from "@/convex/_generated/api";
import Colors from "@/data/Colors";
import { useConvex, useMutation } from "convex/react";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useRef } from "react";
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
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-scroll px-4" id="messages-container">
        {messages.length > 0 &&
          messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 flex ${
                message?.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex gap-3 max-w-[80%] ${
                  message?.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar/Icon */}
                <div className="flex-shrink-0">
                  {message?.role === "user" ? (
                    <Image
                      src={userDetail?.picture}
                      alt="User"
                      width={35}
                      height={35}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-[35px] h-[35px] bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg font-bold">∑</span>
                    </div>
                  )}
                </div>

                {/* Message Content */}
                <div
                  className={`p-3 rounded-lg leading-7 prose prose-sm max-w-none ${
                    message?.role === "user"
                      ? "bg-blue-500 text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-800 rounded-bl-sm"
                  }`}
                  style={
                    message?.role === "ai"
                      ? { backgroundColor: Colors.CHAT_BACKGROUND }
                      : {}
                  }
                >
                  <ReactMarkdown>
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
        
        {/* Loading indicator for AI response */}
        {loading && (
          <div className="mb-4 flex justify-start">
            <div className="flex gap-3 max-w-[80%]">
              <div className="flex-shrink-0">
                <div className="w-[35px] h-[35px] bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-bold">∑</span>
                </div>
              </div>
              <div
                className="p-3 rounded-lg rounded-bl-sm bg-gray-100 flex gap-2 items-center"
                style={{ backgroundColor: Colors.CHAT_BACKGROUND }}
              >
                <Loader2Icon className="animate-spin w-4 h-4" />
                <span className="text-sm text-gray-600">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input section */}
      <div className="flex gap-2 items-end px-4 py-2">
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
        <div className="p-5 border border-border rounded-xl max-w-4xl w-full mt-1 bg-white">
          <div className="flex gap-2">
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={Lookup.INPUT_PLACEHOLDER}
              className="outline-none bg-transparent w-full h-20 max-h-56 resize-none"
            />
            {userInput && (
              <ArrowRight
                onClick={() => onGenerate(userInput)}
                className="bg-primary p-2 h-8 w-8 rounded-md cursor-pointer"
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
