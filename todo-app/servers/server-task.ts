"use server";

import { Api_Response, TaskType, Error_Response } from "@/lib/types";
import { verifySession } from "./session";
import { API_DELETE, API_GET, API_PATCH } from "@/lib/api-requests";

export async function getTask(query: string = ""): Promise<Api_Response<TaskType[]> | Error_Response> {
  const session = await verifySession();
  const response = await API_GET<TaskType[]>(`/task/user${query}`, undefined, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });
  return response;
}

export async function getTaskWithComplete(
  query: string = ""
): Promise<Api_Response<TaskType[]> | Error_Response> {
  const session = await verifySession();
  const response = await API_GET<TaskType[]>(`/task/complete-task${query}`, undefined, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });
  return response;
}

export async function getCountTask(): Promise<
  Api_Response<{ success: boolean; number_of_task: number }> | Error_Response
> {
  const session = await verifySession();
  const response = await API_GET<{ success: boolean; number_of_task: number }>(
    "/task/getAll-tasks-user",
    undefined,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`,
      },
    }
  );
  return response;
}

export async function deleteTask(id: number): Promise<Api_Response<{ success: boolean }> | Error_Response> {
  const session = await verifySession();
  const response = await API_DELETE<{ success: boolean }>(id, "/task", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });
  return response;
}

export async function editTask(
  data: Partial<TaskType>,
  taskId: number
): Promise<Api_Response<TaskType> | Error_Response> {
  const session = await verifySession();
  const response = await API_PATCH<Partial<TaskType>, TaskType>(data, "/task", taskId, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  return response;
}

export async function getCompleteTasks(): Promise<Api_Response<TaskType[]> | Error_Response> {
  const session = await verifySession();
  const response = await API_GET<TaskType[]>("/task/complete-task", undefined, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });
  console.log(response);
  return response;
}

export async function searchWithCompleteTaskList(
  query: string
): Promise<Api_Response<TaskType[]> | Error_Response> {
  const session = await verifySession();

  const response = await API_GET<TaskType[]>(`/search/complete-task?title=${query}`, undefined, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  return response;
}

export async function getNumberWithCompleteTask(): Promise<
  Api_Response<{ success: boolean; number_of_task: number }> | Error_Response
> {
  const session = await verifySession();
  const response = await API_GET<{ success: boolean; number_of_task: number }>(
    `/task/getAll-tasks-complete`,
    undefined,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`,
      },
    }
  );
  return response;
}
