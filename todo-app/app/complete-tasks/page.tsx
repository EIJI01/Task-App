"use server";
import React from "react";
import { CompleteTasks } from "./components/complete-task";
import { getCompleteTasks, getNumberWithCompleteTask } from "@/servers/server-task";

export default async function CompleteTasksPage() {
  const completeTask = await getCompleteTasks();
  const number_of_task = await getNumberWithCompleteTask();
  return (
    <CompleteTasks
      task={completeTask.success ? completeTask.data : null}
      number_of_task={number_of_task.success ? number_of_task.data.number_of_task : null}
    />
  );
}
