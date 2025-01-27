"use server";
import { FirstPage } from "@/components/task-components/home";
import { getCountTask, getTask } from "@/servers/server-task";

export default async function Home() {
  const response = await getTask();
  const resCountTasks = await getCountTask();
  return (
    <FirstPage
      task={response.success ? response.data : null}
      number_of_task={resCountTasks.success ? resCountTasks.data.number_of_task : null}
    />
  );
}
