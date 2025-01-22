import { createBrowserRouter } from "react-router-dom";

import { paths } from "@/constants/paths";
import HomePage from "@/pages/(business)/home";
import ChartPage from "@/pages/(business)/chart";

import ProfileEditPage from "@/pages/(business)/profile/edit";
import ProfileDeletePage from "@/pages/(business)/profile/delete";

import RootLayout from "@/components/shared/RootLayout";
import RentListPage from "@/pages/(business)/list";
import FavoriteRentListPage from "@/pages/(business)/favorite";
import RentDetailPage from "@/pages/(business)/detail";
import PaymentPage from "@/pages/(business)/payment";
import DashboardMainPage from "@/pages/(dashboard)/main";
import DashboardLayout from "@/components/shared/DashboardLayout";

import DashboardUserListPage from "@/pages/(dashboard)/user/list";

import DashboardRentListPage from "@/pages/(dashboard)/rent/list";
import DashboardRentCreatePage from "@/pages/(dashboard)/rent/create";
import DashboardRentEditPage from "@/pages/(dashboard)/rent/edit";

import DashboardCategoriesPage from "@/pages/(dashboard)/category/list";
import DashboardCategoryCreatePage from "@/pages/(dashboard)/category/create";
import DashboardCategoryEditPage from "@/pages/(dashboard)/category/edit";
import DashboardCategoryDeletePage from "@/pages/(dashboard)/category/delete";

import DashboardLocationsPage from "@/pages/(dashboard)/location/list";
import DashboardLocationCreatePage from "@/pages/(dashboard)/location/create";
import DashboardLocationEditPage from "@/pages/(dashboard)/location/edit";
import DashboardLocationDeletePage from "@/pages/(dashboard)/location/delete";

import AuthLayout from "@/components/shared/AuthLayout";
import ReservationsPage from "@/pages/(business)/reservations";
import DashboardReservationListPage from "@/pages/(dashboard)/reservation/list";
import DashboardReviewListPage from "@/pages/(dashboard)/review/list";
import ChatPage from "@/pages/(dashboard)/chat";
import ProfileLayout from "@/components/shared/ProfileLayout";
import ProfilePage from "@/pages/(business)/profile";

export const router = createBrowserRouter([
  {
    path: "",
    element: <RootLayout />,
    children: [
      {
        path: paths.HOME,
        element: <HomePage />,
      },
      {
        path: paths.CHART,
        element: <ChartPage />,
      },

      {
        path: paths.LIST,
        element: <RentListPage />,
      },

      {
        path: paths.DETAIL(),
        element: <RentDetailPage />,
      },

      {
        path: "",
        element: <AuthLayout />,
        children: [
          {
            path: paths.PAYMENT(),
            element: <PaymentPage />,
          },
          {
            path: paths.FAVORITES,
            element: <FavoriteRentListPage />,
          },
          {
            path: paths.RESERVATIONS,
            element: <ReservationsPage />,
          },
          {
            path: "",
            element: <ProfileLayout />,
            children: [
              {
                path: paths.PROFILE.MAIN,
                element: <ProfilePage />,
              },
              {
                path: paths.PROFILE.EDIT,
                element: <ProfileEditPage />,
              },
              {
                path: paths.PROFILE.DELETE,
                element: <ProfileDeletePage />,
              },
            ],
          },
        ],
      },

      {
        path: "",
        element: <DashboardLayout />,
        children: [
          {
            path: paths.DASHBOARD.MAIN,
            element: <DashboardMainPage />,
          },
          {
            path: paths.DASHBOARD.USERS.LIST,
            element: <DashboardUserListPage />,
          },

          {
            path: paths.DASHBOARD.RENTS.LIST,
            element: <DashboardRentListPage />,
          },
          {
            path: paths.DASHBOARD.RENTS.CREATE,
            element: <DashboardRentCreatePage />,
          },
          {
            path: paths.DASHBOARD.RENTS.EDIT(),
            element: <DashboardRentEditPage />,
          },

          {
            path: paths.DASHBOARD.CATEGORIES.LIST,
            element: <DashboardCategoriesPage />,
          },
          {
            path: paths.DASHBOARD.CATEGORIES.CREATE,
            element: <DashboardCategoryCreatePage />,
          },
          {
            path: paths.DASHBOARD.CATEGORIES.EDIT(),
            element: <DashboardCategoryEditPage />,
          },
          {
            path: paths.DASHBOARD.CATEGORIES.DELETE(),
            element: <DashboardCategoryDeletePage />,
          },

          {
            path: paths.DASHBOARD.LOCATIONS.LIST,
            element: <DashboardLocationsPage />,
          },
          {
            path: paths.DASHBOARD.LOCATIONS.CREATE,
            element: <DashboardLocationCreatePage />,
          },
          {
            path: paths.DASHBOARD.LOCATIONS.EDIT(),
            element: <DashboardLocationEditPage />,
          },
          {
            path: paths.DASHBOARD.LOCATIONS.DELETE(),
            element: <DashboardLocationDeletePage />,
          },

          {
            path: paths.DASHBOARD.RESERVATIONS.LIST,
            element: <DashboardReservationListPage />,
          },
          {
            path: paths.DASHBOARD.REVIEWS.LIST,
            element: <DashboardReviewListPage />,
          },
          {
            path: paths.DASHBOARD.CHAT.VIEW,
            element: <ChatPage />,
          },
          {
            path: paths.DASHBOARD.CHAT.USER(),
            element: <ChatPage />,
          },
        ],
      },
    ],
  },
]);
