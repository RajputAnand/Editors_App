import { RouteObject } from "react-router-dom";
import { WithRouter } from "../Hoc/WithRouter.tsx";
export const RegisterPage = (
  path: string,
  pageLocation: string,
  other?: any
): RouteObject => {
  return {
    path: path,
    lazy: async () => {
      try {
        const Page = await import(`./../Pages/${pageLocation}.tsx`);
        return { Component: WithRouter(Page?.default) };
      } catch (e) {
        console.error("import error", pageLocation, e);
      }
    },
    ...other,
  };
};
