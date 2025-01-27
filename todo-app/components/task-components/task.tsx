"use client";
import { TaskType, Error_Response, Api_Response } from "@/lib/types";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { formTaskCreate } from "@/lib/schema";
import { z } from "zod";
import { deleteTask, editTask } from "@/servers/server-task";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { EditTaskDialog } from "./edit_task-dialog";
import { UserPermission } from "@/servers/permission";
import { NotFoundCustom } from "./not-found";

const defaultNotFound = (
  <NotFoundCustom>
    <p className="text-theme-text-second mt-3">No tasks found.</p>
  </NotFoundCustom>
);

const TaskList = ({
  name,
  tasks,
  setTasks,
  oldTaskRef,
  taskNumber,
  permission,
  setTaskNumber,
  formTaskCreate,
  notFoundTask = defaultNotFound,
  getTaskFunction,
  searchTaskList,
  numberTaskMessage,
}: {
  name: string | undefined;
  tasks: TaskType[];
  setTasks: React.Dispatch<React.SetStateAction<TaskType[]>>;
  oldTaskRef: React.RefObject<TaskType[]>;
  taskNumber: number;
  setTaskNumber: React.Dispatch<React.SetStateAction<number>>;
  permission: UserPermission;
  formTaskCreate?: React.JSX.Element;
  notFoundTask?: React.JSX.Element;
  getTaskFunction: (query: string) => Promise<Api_Response<TaskType[]> | Error_Response>;
  searchTaskList: (query: string) => Promise<Api_Response<TaskType[]> | Error_Response>;
  numberTaskMessage: (task_number: number) => React.JSX.Element;
}) => {
  const [limit] = useState<number>(10);
  const [page, setPage] = useState<number>(Math.ceil(taskNumber / limit));
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [start, setStart] = useState<boolean>(true);
  const [error, setError] = useState<Error_Response | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [focusSearch, setFocusSearch] = useState<boolean>(false);

  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(() => {
      searchTasks(searchQuery);
    }, 300);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchQuery, setSearchQuery, searchTasks]);

  useEffect(() => {
    if (hasMore && !start) {
      fetchTasks();
    }
  }, [page, setPage, hasMore, start, setStart]);

  useEffect(() => {
    const lastTask = document.querySelector(".task:last-of-type");
    console.log("querySelector child", lastTask);
    if (!lastTask) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => {
            setHasMore(prev - 1 !== 0);
            if (prev !== 1) {
              return prev - 1;
            }
            return 1;
          });
          setStart(false);
        }
      },
      { threshold: 0.1 }
    );
    observer.current.observe(lastTask);
  }, [tasks, hasMore, loading]);

  async function fetchTasks() {
    setLoading(true);
    const response = await getTaskFunction(`?page=${page}&limit=${limit}`);
    if (response.success) {
      setLoading(false);
      console.log("data = ", response.data);
      setTasks((prev: TaskType[]) => {
        oldTaskRef.current = [...prev, ...response.data];
        return [...prev, ...response.data];
      });
    } else {
      setLoading(false);
      throw new Error(response.message);
    }
  }

  async function searchTasks(query: string) {
    console.log(query);
    if (query.trim() === "") {
      if (focusSearch) {
        setTasks(oldTaskRef.current);
      }
      return;
    }

    const response = await searchTaskList(query);
    if (response.success) {
      setTasks(response.data);
      setError(null);
    } else {
      if (response.statusCode === 404) {
        setTasks([]);
        setError(response);
      } else {
        throw new Error(response.message);
      }
    }
  }

  return (
    <div>
      <div className="mt-10 text-2xl text-theme-text-main font-bold">
        Welcome, <span className="text-theme-blue">{name}</span>
      </div>
      <div className="text-sm text-theme-text-second mb-3 flex justify-between items-end">
        {numberTaskMessage(taskNumber)}
        {permission.has({ permissions: ["search:task"] }) && taskNumber > 0 && (
          <Input
            placeholder="Search..."
            className="w-52 bg-theme-gray"
            onChange={(e) => setSearchQuery(e.target.value)}
            onClick={() => setFocusSearch(true)}
          />
        )}
      </div>
      {formTaskCreate}
      {taskNumber > 0 ? (
        tasks.length > 0 ? (
          <TaskListCards
            task={tasks}
            loading={loading}
            setTask={setTasks}
            setTaskNumber={setTaskNumber}
            oldTaskRef={oldTaskRef}
          />
        ) : (
          <NotFoundCustom>
            <p className="text-theme-text-second mt-3">{error?.message || "No tasks found."}</p>
          </NotFoundCustom>
        )
      ) : (
        notFoundTask
      )}
    </div>
  );
};

const TaskListCards = ({
  task,
  loading,
  setTask,
  setTaskNumber,
  oldTaskRef,
}: {
  task: TaskType[];
  loading: boolean;
  setTask: React.Dispatch<React.SetStateAction<TaskType[]>>;
  setTaskNumber: React.Dispatch<React.SetStateAction<number>>;
  oldTaskRef: React.RefObject<TaskType[]>;
}) => {
  const [state, setState] = useState<{ showDetail: number[]; checked: number[] }>({
    showDetail: [],
    checked: [],
  });

  const [editNumber, setEditNumber] = useState<number | null>(null);

  function setStateHandler(key: keyof { showDetail: number[]; checked: number[] }, index: number) {
    setState((prev) => {
      if (prev[key].includes(index)) {
        return { ...prev, [key]: [...prev[key].filter((p) => p !== index)] };
      }
      return { ...prev, [key]: [...prev[key], index] };
    });
  }

  async function deleteTaskHandler(id: number) {
    const response = await deleteTask(id);
    if (response.success) {
      setTask((prev) => {
        oldTaskRef.current = [...prev.filter((t) => t.id !== id)];
        return [...prev.filter((t) => t.id !== id)];
      });
      setTaskNumber((prev) => {
        if (prev - 1 < 0) {
          return 0;
        }
        return prev - 1;
      });
    } else {
      console.log(response);
    }
  }
  async function callbackEditTask(value: z.infer<typeof formTaskCreate>) {
    if (editNumber) {
      const response = await editTask({ ...value }, editNumber);
      if (response.success) {
        setTask((prev) => {
          oldTaskRef.current = [
            ...prev.map((t) => {
              if (t.id === response.data.id) {
                return { ...t, ...response.data };
              }
              return t;
            }),
          ];
          return [
            ...prev.map((t) => {
              if (t.id === response.data.id) {
                return { ...t, ...response.data };
              }
              return t;
            }),
          ];
        });
        setTaskNumber((prev) => {
          return prev + 1;
        });
      } else {
        throw new Error(response.message);
      }
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-5 task-container">
        {task
          .sort((a: TaskType, b: TaskType) => {
            return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
          })
          .map((task: TaskType, i: number) => {
            return (
              <div key={i} className="bg-theme-gray rounded-xl px-10 task cursor-pointer ">
                <div className="flex items-start gap-5 w-full">
                  <div className="py-4">
                    <Checkbox onClick={() => setStateHandler("checked", i)} />
                  </div>
                  <div className="w-full">
                    <div className="flex items-start w-full justify-between">
                      <div
                        className="text-theme-text-main text-sm flex flex-col justify-start py-[17px] w-full"
                        onClick={() => setStateHandler("showDetail", i)}
                      >
                        <span className="font-semibold ">{task.title}</span>

                        <div
                          className={`transition-all duration-300 overflow-hidden ${
                            state.showDetail.includes(i) ? "h-10" : "h-0"
                          }`}
                        >
                          <p
                            className={`${
                              state.showDetail.includes(i) ? "mt-4" : "hidden"
                            } text-xs text-theme-text-second1`}
                          >
                            {task.description}
                          </p>
                        </div>
                      </div>
                      <div className="py-[16px]">
                        {state.showDetail.includes(i) ? (
                          <div
                            className="cursor-pointer w-6 h-6 relative"
                            onClick={() => setStateHandler("showDetail", i)}
                          >
                            <Image src={"/arrow.png"} alt="arrow" fill />
                          </div>
                        ) : state.checked.includes(i) ? (
                          <div className="flex item start gap-5">
                            <div onClick={() => setEditNumber(task.id)}>
                              <EditTaskDialog callbackEditTask={callbackEditTask}>
                                <div className="cursor-pointer w-6 h-6 relative">
                                  <Image src={"/edit.png"} alt="edit" fill />
                                </div>
                              </EditTaskDialog>
                            </div>
                            <div
                              className="cursor-pointer w-6 h-6 relative"
                              onClick={() => deleteTaskHandler(task.id)}
                            >
                              <Image src={"/delete.png"} alt="delete" fill />
                            </div>
                          </div>
                        ) : task.is_completed ? (
                          <p className="text-green-400 text-sm font-semibold">{"complete"}</p>
                        ) : (
                          <p className="text-theme-blue text-sm font-semibold">{"todo"}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        {loading && <Loader2 className={` ${loading ? "animate-spin" : ""} mx-auto text-theme-blue`} />}
      </div>
    </div>
  );
};

export { TaskList };
