import { Navigate, Outlet } from "react-router-dom";
import { paths } from "@/constants/paths";
import { useAppSelector } from "@/hooks/redux";
import { selectAuth } from "@/store/auth";
import { Spinner } from "./Spinner";
import { DialogTypeEnum, useDialog } from "@/hooks/useDialog";

const AuthLayout = () => {
  const { user, loading } = useAppSelector(selectAuth);
  const { openDialog } = useDialog();

  if (loading) {
    return (
      <div className="flex flex-col w-full gap-1 items-center mt-32">
        <Spinner />
        Loading...
      </div>
    );
  }

  if (!user) {
    openDialog(DialogTypeEnum.LOGIN);
    return <Navigate to={paths.HOME} />;
  }

  return <Outlet />;
};

export default AuthLayout;
