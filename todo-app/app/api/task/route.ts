import { API_POST } from "@/lib/api-requests";
import { Error_Response, CreateTask, TaskType } from "@/lib/types";
import { parseJWT } from "@/lib/utils";
import { verifySession } from "@/servers/session";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await verifySession();
    const body: Partial<CreateTask> = await request.json();
    const { sub } = parseJWT(session?.accessToken);
    const result = await API_POST<CreateTask, TaskType>(
      {
        user_id: sub,
        title: body.title,
        description: body.description,
        is_completed: body.is_completed,
      } as CreateTask,
      "/task",
      undefined,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );

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
