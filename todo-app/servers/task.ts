import { Api_Response, CreateTask, TaskType, Error_Response } from "@/lib/types";

export async function createTask(
  formData: Partial<CreateTask>
): Promise<Api_Response<TaskType> | Error_Response> {
  const response = await fetch("/api/task", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(formData),
  });

  const result = await response.json();
  console.log("result ", result);
  return result;
}
export async function searchTaskList(query: string): Promise<Api_Response<TaskType[]> | Error_Response> {
  const response = await fetch(`api/task/search?title=${query}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const result = await response.json();
  return result;
}
