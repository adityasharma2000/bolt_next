import { NextResponse } from "next/server";
import { model } from "@/configs/AiModel";

export async function POST(req) {
  const { prompt } = await req.json();
  // console.log("Prompt received:", prompt);
  try {
    const result = await model.generateContent(prompt);
    const AIResp = result.response.text();

    console.log("route ", AIResp);
    return NextResponse.json({ result: AIResp });
  } catch (error) {
    console.error("Error sending message:", error);
    return new Response("Error sending message", { status: 500 });
  }
}
