"use client";
import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formEditSchema } from "@/lib/schema";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Button } from "./ui/button";
import { editProfile, upload } from "@/servers/profile";
import { useUserContext } from "@/contexts/user-context";
import { Loader2 } from "lucide-react";
import { User } from "@/lib/types";
import Image from "next/image";
export interface UploadFileResponse {
  success: boolean;
  file_path: string;
}
const EditProfile = () => {
  const { user } = useUserContext();
  const form = useForm<z.infer<typeof formEditSchema>>({
    resolver: zodResolver(formEditSchema),
    defaultValues: {
      name: user?.name,
    },
  });
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null | undefined>(user?.profile_picture);
  console.log(previewImage);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (value: z.infer<typeof formEditSchema>) => {
    setLoading(true);
    const formDataToSend = new FormData();
    let filePath: UploadFileResponse | null = null;
    if (file) {
      formDataToSend.append("file", file);
      const response = await upload(formDataToSend);
      if (response.success) {
        console.log(response.data);
        filePath = response.data;
      } else {
        console.log(response);
      }
    }
    let res: User | null = null;
    if (filePath) {
      const response = await editProfile({
        name: value.name,
        profile_picture: filePath.file_path,
      });
      if (response.success) res = response.data;
      else console.log(response);
    } else {
      const response = await editProfile({ name: value.name });
      if (response.success) res = response.data;
      else console.log(response);
    }

    if (res) {
      window.location.reload();
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Edit Profile</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className="block text-gray-600 font-medium">Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter your name"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
            <div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="picture" className="block text-gray-600 font-medium">
                  Profile Picture
                </Label>
                <Input
                  id="picture"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full"
                />
              </div>
              {previewImage && (
                <div className="relative w-32 h-32 mx-auto rounded-full mt-4">
                  <Image
                    src={previewImage}
                    alt="Preview"
                    className=" rounded-full absolute"
                    style={{ objectFit: "cover" }}
                    fill
                  />
                </div>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-theme-blue text-white py-2 rounded-lg hover:bg-theme-blue/80 transition duration-200"
            >
              {loading && <Loader2 className="animate-spin" />}
              Save Changes
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export { EditProfile };
