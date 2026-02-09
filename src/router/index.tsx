import { createBrowserRouter, Navigate, useRouteError } from "react-router-dom";
import { lazy } from "react";
import { cabinsLoader } from "@/loader/cabinsLoader";
import { bookingsLoader } from "@/loader/bookingsLoader";
import { QueryClient } from "@tanstack/react-query";
import { settingsLoader } from "@/loader/settingsLoader";
import { bookingLoader } from "@/loader/bookingItemLoader";
import { userLoader } from "@/loader/userLoader";
import { dashboardLoader } from "@/loader/dashboardLoader";
import ProtectedRoute from "@/ui/ProtectedRoute";
import ErrorFallback from "@/ui/ErrorFallback";
import { Suspense } from "react";
import Spinner from "@/ui/Spinner";

const AppLayout = lazy(() => import("@/ui/AppLayout"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Users = lazy(() => import("@/pages/Users"));
const Settings = lazy(() => import("@/pages/Settings"));
const Cabins = lazy(() => import("@/pages/Cabins"));
const Login = lazy(() => import("@/pages/Login"));
const Booking = lazy(() => import("@/pages/Booking"));
const PageNotFound = lazy(() => import("@/pages/PageNotFound"));
const BookingItem = lazy(() => import("@/pages/BookingItem"));
const Checkin = lazy(() => import("@/pages/Checkin"));
const Account = lazy(() => import("@/pages/Account"));

// 创建queryClient实例
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
function ErrorElement() {
  const error = useRouteError();
  return (
    <ErrorFallback
      error={error}
      resetErrorBoundary={() => window.location.replace("/")}
    />
  );
}

const router = createBrowserRouter([
  {
    element: (
      <ProtectedRoute>
        <Suspense fallback={<Spinner />}>
          <AppLayout />
        </Suspense>
      </ProtectedRoute>
    ),
    errorElement: <ErrorElement />,
    loader: userLoader(queryClient),
    children: [
      {
        path: "/",
        element: <Navigate replace to="dashboard" />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
        loader: dashboardLoader(queryClient),
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "settings",
        element: <Settings />,
        loader: settingsLoader(queryClient),
      },
      {
        path: "cabins",
        element: <Cabins />,
        // 将queryClient注入loader
        loader: cabinsLoader(queryClient),
      },
      {
        path: "bookings",
        element: <Booking />,
        loader: bookingsLoader(queryClient, "eq"),
      },
      {
        path: "bookings/:id",
        element: <BookingItem />,
        loader: bookingLoader(queryClient),
      },
      {
        path: "checkin/:id",
        element: <Checkin />,
      },
      {
        path: "account",
        element: <Account />,
      },
    ],
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

export default router;
