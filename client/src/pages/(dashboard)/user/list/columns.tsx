import { User } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "avatar",
    header: "Avatar",
    cell: (data) => (
      <img
        src={data.row.original.avatar!}
        alt={"A"}
        className="w-8 h-8 rounded-full"
      />
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "email",
    header: "Email",
  },

  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
];
