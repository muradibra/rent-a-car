import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { paths } from "@/constants/paths";
import { AxiosResponseError, User } from "@/types";
import { RenderIf } from "@/components/shared/RenderIf";
import userService from "@/services/user";
import { Trash2Icon } from "lucide-react";
import { useAppDispatch } from "@/hooks/redux";
import { getCurrentUserAsync } from "@/store/auth";

const getFormSchema = (isEdit: boolean, isDelete: boolean) =>
  z.object({
    avatar: isDelete ? z.any().optional() : z.any().optional(),
    name: isEdit ? z.string().min(2) : z.string().optional(),
    email: isEdit ? z.string().email() : z.string().optional(),
  });
type Props = {
  type: "update" | "delete";
  user: User;
};

const onError = (error: AxiosResponseError) => {
  toast.error(error.response?.data.message ?? "Something went wrong!");
};

const ProfileActionForm = ({ type, user }: Props) => {
  const dispatch = useAppDispatch();
  const [isImgDeleteClicked, setIsImgDeleteClicked] = useState(false);
  const isEdit = type === "update";
  const isDelete = type === "delete";
  const id = user._id;
  const editItem = user;

  const navigate = useNavigate();

  const { mutate: mutateUpdate } = useMutation({
    mutationFn: userService.edit,
    onSuccess: () => {
      toast.success("User updated successfully.");
      dispatch(getCurrentUserAsync());
      navigate(paths.PROFILE.MAIN);
    },
    onError,
  });

  const { mutate: mutateDelete } = useMutation({
    mutationFn: userService.remove,
    onSuccess: () => {
      dispatch(getCurrentUserAsync());
      navigate(paths.HOME);
    },
    onError,
  });

  const formSchema = useMemo(
    () => getFormSchema(isEdit, isDelete),
    [isEdit, isDelete]
  );

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      avatar: "",
      name: "",
      email: "",
    },
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (editItem) {
      form.setValue("avatar", editItem.avatar);
      form.setValue("name", editItem.name);
      form.setValue("email", editItem.email);
    }
  }, [editItem]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const data = {
      name: values.name,
      email: values.email,
      avatar: values.avatar === "delete" ? "delete" : values.avatar,
    };
    if (type === "update") {
      mutateUpdate({
        id: id!,
        data,
      });
    } else if (type === "delete") {
      mutateDelete();
    }
  }

  return (
    <div className="pt-6">
      <h1 className="text-2xl font-bold text-primary mb-4">
        {isEdit ? "Edit" : "Delete"} User
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <FormControl>
                    <Input
                      multiple
                      disabled={
                        (!!editItem.avatar && !isImgDeleteClicked) || isDelete
                      }
                      type="file"
                      onChange={(e) => {
                        field.onChange(e.target.files![0]);
                        setIsImgDeleteClicked(true);
                      }}
                      accept="image/*"
                    />
                  </FormControl>
                  <div className="text-sm text-gray-500 relative">
                    <img
                      src={editItem.avatar ?? ""}
                      alt="avatar"
                      className={` ${
                        isImgDeleteClicked || !editItem.avatar
                          ? "hidden"
                          : "block"
                      } `}
                    />

                    <Button
                      type="button"
                      disabled={isDelete}
                      variant={"destructive"}
                      onClick={() => {
                        form.setValue("avatar", "delete");
                        setIsImgDeleteClicked(true);
                      }}
                      className={`absolute p-2 top-2 right-2 ${
                        isImgDeleteClicked || !editItem.avatar
                          ? "hidden"
                          : "block"
                      }`}
                    >
                      <Trash2Icon size={18} />
                    </Button>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isDelete}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="user" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              disabled={isDelete}
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="example@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end mt-4">
            <RenderIf condition={isDelete}>
              <Button type="submit" variant={"destructive"} className="mt-4">
                Delete
              </Button>
            </RenderIf>
            <RenderIf condition={!isDelete}>
              <Button asChild variant="secondary">
                <Link to="/profile" className="mr-2">
                  Back
                </Link>
              </Button>
              <Button type="submit">Submit</Button>
            </RenderIf>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProfileActionForm;
