import { useQuery } from "@tanstack/react-query";
import { columns } from "./columns";
import { QUERY_KEYS } from "@/constants/query-keys";
import { Spinner } from "@/components/shared/Spinner";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { paths } from "@/constants/paths";
import { DataTable } from "@/components/shared/DataTable";
import userService from "@/services/user";

const DashboardUsersPage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_USERS],
    queryFn: () => userService.getAll(),
  });

  if (isLoading) {
    <div className="flex flex-col gap-1 jkustify-center items-center mt-32">
      <Spinner />
      Loading...
    </div>;
  }

  const users = data?.data?.users || [];

  if (isError) {
    return (
      <div className="flex flex-col gap-1 jkustify-center items-center mt-32">
        <p className="text-2xl font-bold mb-3 text-primary">
          Something went wrong!
        </p>
        <Button className="mt-4">
          <Link to={paths.HOME}>Go Back To Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="pt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-primary font-bold text-2xl ">Users</h2>
      </div>
      <DataTable columns={columns} data={users} />
    </div>
  );
};

export default DashboardUsersPage;
