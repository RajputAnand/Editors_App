import { RouteObject } from "react-router-dom";
import PublicLayout from "../Components/Layouts/PublicLayout.tsx";
import { RegisterPage } from "../Utils/RegisterPage.tsx";
import { PathConstants } from "./PathConstants.ts";

export const AuthenticationRoute = (attach?: RouteObject[]): RouteObject[] => {
  return [
    {
      path: "/",
      element: <PublicLayout />,
      children: [
        RegisterPage(PathConstants.SingIn, "Authentication/SignIn/SignInPage"),
        RegisterPage(PathConstants.SingUp, "Authentication/SignUp/SignUpPage"),
      ],
    },
    {
      path: "/",
      element: <PublicLayout isOnboarding={true} />,
      children: [
        RegisterPage(
          PathConstants.ForgotPassword,
          "Authentication/ForgotPassword/ForgotPasswordPage"
        ),
        RegisterPage(
          PathConstants.ResetPassword,
          "Authentication/ResetPassword/ResetPasswordPage"
        ),
        RegisterPage(
          PathConstants.VerifyOtp,
          "Authentication/VerifyOtp/VerifyOtpPage"
        ),
      ],
    },
    ...(Array.isArray(attach) ? attach : []),
  ];
};
