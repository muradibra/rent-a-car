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

import { QUERY_KEYS } from "@/constants/query-keys";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { paths } from "@/constants/paths";
import categoryService from "@/services/category";
import { AxiosResponseError } from "@/types";
import { RenderIf } from "@/components/shared/RenderIf";

const getFormSchema = (isEdit: boolean, isDelete: boolean) =>
  z.object({
    title: isEdit
      ? z.string().nonempty()
      : isDelete
      ? z.string().optional()
      : z.string().nonempty(),
  });
type Props = {
  type: "create" | "update" | "delete";
};

const onError = (error: AxiosResponseError) => {
  toast.error(error.response?.data.message ?? "Something went wrong!");
};

const CategoryActionForm = ({ type }: Props) => {
  const isEdit = type === "update";
  const isDelete = type === "delete";
  const { id } = useParams();
  const { data } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_CATEGORY_BY_ID, id],
    queryFn: () => categoryService.getById({ id: id! }),
    enabled: isEdit || isDelete,
  });

  const editItem = data?.data.item || null;

  const navigate = useNavigate();
  const { mutate: mutateCreate } = useMutation({
    mutationFn: categoryService.create,
    onSuccess: () => {
      toast.success("Category created successfully.");
      navigate(paths.DASHBOARD.CATEGORIES.LIST);
    },
    onError,
  });

  const { mutate: mutateUpdate } = useMutation({
    mutationFn: categoryService.edit,
    onSuccess: () => {
      toast.success("Category updated successfully.");
      navigate(paths.DASHBOARD.CATEGORIES.LIST);
    },
    onError,
  });

  const { mutate: mutateDelete } = useMutation({
    mutationFn: categoryService.remove,
    onSuccess: () => {
      toast.success("Category deleted successfully.");
      navigate(paths.DASHBOARD.CATEGORIES.LIST);
    },
    onError,
  });

  const formSchema = useMemo(
    () => getFormSchema(isEdit, isDelete),
    [isEdit, isDelete]
  );

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      title: "",
    },
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (editItem) {
      form.setValue("title", editItem.title);
    }
  }, [editItem]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const data = {
      title: values.title!,
    };
    if (type === "create") {
      mutateCreate(data);
    } else if (type === "update") {
      mutateUpdate({
        id: id!,
        ...data,
      });
    } else if (type === "delete") {
      mutateDelete({
        id: id!,
      });
    }
  }

  return (
    <div className="pt-6">
      <h1 className="text-2xl font-bold text-primary mb-4">
        {isEdit ? "Edit" : isDelete ? "Delete" : "Create"} Category
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <FormField
              disabled={isDelete}
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Sport" {...field} />
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
                <Link to="/dashboard/categories" className="mr-2">
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

export default CategoryActionForm;
