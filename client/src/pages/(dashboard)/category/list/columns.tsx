import { paths } from "@/constants/paths";
import { Category } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Edit2Icon, Trash2Icon } from "lucide-react";
import { Link } from "react-router-dom";

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "title",
    header: "Name",
  },

  {
    accessorKey: "",
    header: "Actions",
    cell: (data) => {
      return (
        <div className="text-primary flex items-center justify-center gap-4">
          <Link to={paths.DASHBOARD.CATEGORIES.EDIT(data.row.original._id)}>
            <Edit2Icon className="w-4 h-4" />
          </Link>

          <Link to={paths.DASHBOARD.CATEGORIES.DELETE(data.row.original._id)}>
            <Trash2Icon className="w-4 h-4" />
          </Link>
        </div>
      );
    },
  },
];
