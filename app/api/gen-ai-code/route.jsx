import { codeModel } from "@/configs/AiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { prompt } = await req.json();

  try {
    const result = await codeModel.generateContent(prompt);
    const codeResp = result.response.text();
    return NextResponse.json(JSON.parse(codeResp));
  } catch (error) {
    return NextResponse.json(
      { error: "Error generating code" },
      { status: 500 }
    );
  }
}
