import { FC } from "react";
import {
  createBrowserRouter,
  createMemoryRouter,
  Navigate,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import { AuthenticationRoute } from "./AuthenticationRoute.tsx";
import CommonRoutes from "./CommonRoute.tsx";
import DashboardRoute from "./DashboardRoute.tsx";
import { useSelector } from "react-redux";

const AppInit: FC<any> = () => {
  const AuthData = useSelector((state: any) => state.AuthData);
  const handleRouter = (): { routes: RouteObject[]; opts?: any } => {
    if (typeof window !== "undefined") {
      if (
        window.location.pathname.startsWith("/network") &&
        !AuthData?.isLoggedIn
      ) {
        return {
          routes: [
            {
              path: "*",
              element: <Navigate to="/" replace />,
            },
            ...AuthenticationRoute([...CommonRoutes()]),
          ],
        };
      }
    }

    if (AuthData?.isLoggedIn)
      return {
        routes: DashboardRoute([...CommonRoutes()]),
      };
    return {
      routes: AuthenticationRoute([...CommonRoutes()]),
    };
  };

  const Routes = handleRouter();
  const isBrowser = typeof window !== 'undefined';
  const router = isBrowser
  ? createBrowserRouter(Routes.routes, Routes.opts)
  : createMemoryRouter(Routes.routes, Routes.opts);
  if (!isBrowser && router) {
    return null; // In SSR, render nothing or handle it appropriately
  }

  return (
    <RouterProvider router={router} />
  );
};

export default AppInit;