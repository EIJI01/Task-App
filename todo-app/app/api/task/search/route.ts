import { API_GET } from "@/lib/api-requests";
import { TaskType, Error_Response } from "@/lib/types";
import { verifySession } from "@/servers/session";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title");
    const session = await verifySession();
    const result = await API_GET<TaskType[]>(`/search?title=${title}`, undefined, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch tasks",
      statusCode: 500,
    } as Error_Response);
  }
}
