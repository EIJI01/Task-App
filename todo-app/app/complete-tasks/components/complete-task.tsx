"use client";
import { TaskList } from "@/components/task-components/task";
import { useUserContext } from "@/contexts/user-context";
import { TaskType } from "@/lib/types";
import { UserPermission } from "@/servers/permission";
import { getTaskWithComplete, searchWithCompleteTaskList } from "@/servers/server-task";
import React, { useRef, useState } from "react";

type TaskCompleteProps = {
  task: TaskType[] | null;
  number_of_task: number | null;
};

const CompleteTasks = ({ task, number_of_task }: TaskCompleteProps) => {
  const { user } = useUserContext();
  const permission = new UserPermission(user);
  const [tasks, setTasks] = useState<TaskType[]>(task || []);
  const oldTaskRef = useRef<TaskType[]>(task || []);
  const [taskNumber, setTaskNumber] = useState<number>(number_of_task || 0);
  const messageNumber = (taskNumber: number) => {
    return <p>You&apos;ve got {taskNumber} complete task.</p>;
  };

  return (
    <TaskList
      name={user?.name}
      tasks={tasks}
      setTasks={setTasks}
      oldTaskRef={oldTaskRef}
      taskNumber={taskNumber}
      setTaskNumber={setTaskNumber}
      permission={permission}
      getTaskFunction={getTaskWithComplete}
      searchTaskList={searchWithCompleteTaskList}
      numberTaskMessage={messageNumber}
    />
  );
};

export { CompleteTasks };
