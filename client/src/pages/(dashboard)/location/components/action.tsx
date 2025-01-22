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
import { AxiosResponseError } from "@/types";
import { RenderIf } from "@/components/shared/RenderIf";
import locationService from "@/services/location";

const getFormSchema = (isEdit: boolean, isDelete: boolean) =>
  z.object({
    title: isEdit
      ? z.string().min(2)
      : isDelete
      ? z.string().optional()
      : z.string().min(2),
  });
type Props = {
  type: "create" | "update" | "delete";
};

const onError = (error: AxiosResponseError) => {
  toast.error(error.response?.data.message ?? "Something went wrong!");
};

const LocationActionForm = ({ type }: Props) => {
  const isEdit = type === "update";
  const isDelete = type === "delete";
  const { id } = useParams();
  const { data } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_LOCATION_BY_ID, id],
    queryFn: () => locationService.getById({ id: id! }),
    enabled: isEdit || isDelete,
  });

  const editItem = data?.data.item || null;

  const navigate = useNavigate();
  const { mutate: mutateCreate } = useMutation({
    mutationFn: locationService.create,
    onSuccess: () => {
      toast.success("Location created successfully.");
      navigate(paths.DASHBOARD.LOCATIONS.LIST);
    },
    onError,
  });

  const { mutate: mutateUpdate } = useMutation({
    mutationFn: locationService.edit,
    onSuccess: () => {
      toast.success("Location updated successfully.");
      navigate(paths.DASHBOARD.LOCATIONS.LIST);
    },
    onError,
  });

  const { mutate: mutateDelete } = useMutation({
    mutationFn: locationService.remove,
    onSuccess: () => {
      toast.success("Location deleted successfully.");
      navigate(paths.DASHBOARD.LOCATIONS.LIST);
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
      title: values.title,
    };
    if (type === "create") {
      mutateCreate({
        title: data.title!,
      });
    } else if (type === "update") {
      mutateUpdate({
        id: id!,
        title: data.title!,
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
        {isEdit ? "Edit" : isDelete ? "Delete" : "Create"} Locatioon
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
                    <Input placeholder="Baku" {...field} />
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
                <Link to="/dashboard/locations" className="mr-2">
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

export default LocationActionForm;
