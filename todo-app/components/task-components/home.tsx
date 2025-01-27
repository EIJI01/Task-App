"use client";
import React, { useRef, useState } from "react";
import { TaskList } from "./task";
import { useUserContext } from "@/contexts/user-context";
import { TaskType } from "@/lib/types";
import { UserPermission } from "@/servers/permission";
import { FormTaskCreate } from "./form-task-create";
import { NotFoundCustom } from "./not-found";
import DialogTask from "./dialog-task";
import { getTask } from "@/servers/server-task";
import { searchTaskList } from "@/servers/task";

type TaskProps = {
  task: TaskType[] | null;
  number_of_task: number | null;
};

const FirstPage = ({ task, number_of_task }: TaskProps) => {
  const { user } = useUserContext();
  const permission = new UserPermission(user);
  const [tasks, setTasks] = useState<TaskType[]>(task || []);
  const oldTaskRef = useRef<TaskType[]>(task || []);
  const [taskNumber, setTaskNumber] = useState<number>(number_of_task || 0);

  const messageNumber = (taskNumber: number) => {
    return <p>You&apos;ve got {taskNumber} task.</p>;
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
      getTaskFunction={getTask}
      searchTaskList={searchTaskList}
      numberTaskMessage={messageNumber}
      formTaskCreate={
        <FormTaskCreate
          tasks={tasks}
          setTasks={setTasks}
          oldTaskRef={oldTaskRef}
          taskNumber={taskNumber}
          setTaskNumber={setTaskNumber}
        />
      }
      notFoundTask={
        <NotFoundCustom>
          <p className="text-theme-text-second mt-3">You have no tasks listed.</p>
          <DialogTask setTasks={setTasks} setTaskNumber={setTaskNumber} oldTaskRef={oldTaskRef} />
        </NotFoundCustom>
      }
    />
  );
};

export { FirstPage };
