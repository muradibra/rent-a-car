import { Navigate, Outlet } from "react-router-dom";
import { paths } from "@/constants/paths";
import { Spinner } from "./Spinner";
import { useAppSelector } from "@/hooks/redux";
import { selectAuth } from "@/store/auth";
import { toast } from "sonner";

const ProfileLayout = () => {
  const { user, loading } = useAppSelector(selectAuth);

  if (loading) {
    return (
      <div className="flex flex-col w-full gap-1 items-center mt-32">
        <Spinner />
        Loading...
      </div>
    );
  }

  if (!user) {
    toast.error("You are not authorized to access this page!");
    return <Navigate to={paths.HOME} />;
  }
  return (
    <main className="w-full px-6 relative pt-4">
      <div className="p-6 rounded-[10px] bg-white w-full">
        <Outlet />
      </div>
    </main>
  );
};

export default ProfileLayout;
