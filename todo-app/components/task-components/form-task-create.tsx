import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { z } from "zod";
import { createTask } from "@/servers/task";
import { zodResolver } from "@hookform/resolvers/zod";
import { formTaskCreate } from "@/lib/schema";
import { TaskType } from "@/lib/types";

type FormCreateTask = {
  tasks: TaskType[];
  setTasks: React.Dispatch<React.SetStateAction<TaskType[]>>;
  oldTaskRef: React.RefObject<TaskType[]>;
  taskNumber: number;
  setTaskNumber: React.Dispatch<React.SetStateAction<number>>;
};
const FormTaskCreate = ({ tasks, setTasks, oldTaskRef, taskNumber, setTaskNumber }: FormCreateTask) => {
  const form = useForm<z.infer<typeof formTaskCreate>>({
    resolver: zodResolver(formTaskCreate),
    defaultValues: {
      title: "",
      description: "",
    },
  });
  const [isFocused, setIsFocused] = useState<{ title: boolean; note: boolean }>({
    title: false,
    note: false,
  });
  const titleRef = useRef<HTMLInputElement | null>(null);

  async function onSubmit(value: z.infer<typeof formTaskCreate>) {
    const response = await createTask({ ...value, is_completed: false });
    if (response.success) {
      setTasks((prev) => {
        oldTaskRef.current = [...prev, response.data];
        return [...prev, response.data];
      });
      setTaskNumber((prev) => {
        return prev + 1;
      });
    } else {
      throw new Error(response.message);
    }
    form.reset();
  }

  return (
    taskNumber > 0 &&
    tasks.length > 0 && (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div
            className={`mt-6 text-sm text-theme-text-second flex items-center gap-2 cursor-pointer `}
            onClick={() => titleRef.current?.focus()}
          >
            <div
              className={` rounded-md  text-center w-5 h-5 flex items-center pb-[1px] justify-center  ${
                isFocused.title
                  ? "border-theme-blue border-2 text-theme-blue"
                  : "border-theme-text-second border-[1.5px]"
              }`}
            >
              +
            </div>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => {
                return (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        {...field}
                        aria-autocomplete="none"
                        type="text"
                        placeholder='Tap "Enter" to create task...'
                        className="border-0 shadow-[0px]"
                        ref={titleRef}
                        onFocus={() =>
                          setIsFocused((prev) => {
                            return { ...prev, title: true, note: true };
                          })
                        }
                        onBlur={() => {
                          console.log(isFocused.note);
                          if (!isFocused.note) {
                            setIsFocused((prev) => {
                              return { ...prev, title: false };
                            });
                            form.resetField("title");
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>

          <div
            className={`text-sm text-theme-text-second flex items-center gap-2 cursor-pointer transition-all duration-300 overflow-hidden ${
              isFocused.title || isFocused.note ? "h-10" : "h-0"
            }`}
          >
            {(isFocused.title || isFocused.note) && (
              <>
                <div
                  className={` rounded-md  text-center w-5 h-5 flex items-center pb-[1px] justify-center `}
                >
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 26 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M18.6229 1H7.37714C3.45714 1 1 3.7745 1 7.70219V18.2978C1 22.2255 3.44571 25 7.37714 25H18.6229C22.5543 25 25 22.2255 25 18.2978V7.70219C25 3.7745 22.5543 1 18.6229 1Z"
                      stroke="#C6CFDC"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7 16.6403V18.6667C7 18.8534 7.14665 19 7.33329 19H9.35967C9.44633 19 9.53298 18.9667 9.59297 18.9L16.872 11.6277L14.3723 9.12804L7.09999 16.4004C7.03333 16.467 7 16.547 7 16.6403ZM18.805 9.69463C19.065 9.43466 19.065 9.01472 18.805 8.75476L17.2452 7.19497C16.9853 6.93501 16.5653 6.93501 16.3054 7.19497L15.0855 8.4148L17.5852 10.9145L18.805 9.69463Z"
                      fill="#C6CFDC"
                    />
                  </svg>
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => {
                    return (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input
                            {...field}
                            aria-autocomplete="none"
                            type="text"
                            placeholder="Add a note..."
                            className="border-0 shadow-[0px] w-full"
                            onFocus={() =>
                              setIsFocused((prev) => {
                                return { ...prev, note: true, title: true };
                              })
                            }
                            onBlur={() => {
                              setIsFocused((prev) => {
                                return { ...prev, note: false, title: false };
                              });
                              form.resetField("description");
                              form.resetField("title");
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </>
            )}
          </div>

          <button type="submit" hidden>
            submit
          </button>
        </form>
      </Form>
    )
  );
};

export { FormTaskCreate };
