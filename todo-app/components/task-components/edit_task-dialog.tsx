import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { formTaskCreate } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const EditTaskDialog = ({
  callbackEditTask,
  children,
}: {
  children: React.ReactNode;
  callbackEditTask: (value: z.infer<typeof formTaskCreate>) => Promise<void>;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formTaskCreate>>({
    resolver: zodResolver(formTaskCreate),
    defaultValues: {
      title: "",
      description: "",
    },
  });
  document.body.removeAttribute("data-scroll-locked");
  useEffect(() => {
    return () => {
      form.reset();
    };
  }, [open, setOpen, form]);

  async function onSubmit(value: z.infer<typeof formTaskCreate>) {
    setLoading(true);
    callbackEditTask(value);
    setLoading(false);
    setOpen(false);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>
                Edit <span className="text-theme-blue">Task</span>
              </DialogTitle>
              <DialogDescription className="text-theme-text-second">Edit your task.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => {
                  return (
                    <FormItem className="grid grid-cols-4 items-center ">
                      <FormLabel htmlFor="title" className="text-right text-theme-text-main text-sm mr-4">
                        Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id="title"
                          placeholder="Add a new task..."
                          className="border-0 shadow-[0px] col-span-3"
                          aria-autocomplete="none"
                        />
                      </FormControl>
                      <div className="col-span-1" />
                      <FormMessage className="col-span-3" />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => {
                  return (
                    <FormItem className="grid grid-cols-4 items-center">
                      <FormLabel
                        htmlFor="description"
                        className="text-right text-theme-text-main text-sm mr-4"
                      >
                        Description
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id="description"
                          aria-autocomplete="none"
                          placeholder="Add a note..."
                          className="border-0 shadow-[0px] col-span-3"
                        />
                      </FormControl>
                      <div className="col-span-1" />
                      <FormMessage className="col-span-3" />
                    </FormItem>
                  );
                }}
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="bg-theme-blue-second text-theme-blue mt-3 hover:bg-theme-blue-second/10"
              >
                {loading && <Loader2 className="animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export { EditTaskDialog };
