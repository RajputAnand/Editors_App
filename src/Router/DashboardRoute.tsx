import { RouteObject } from "react-router-dom";
import PublicLayout from "../Components/Layouts/PublicLayout.tsx";
import { RegisterPage } from "../Utils/RegisterPage.tsx";
import { PathConstants } from "./PathConstants.ts";
import WithDashboardLayout from "../Hoc/WithDashboardLayout.tsx";
import DashboardLayout from "../Components/Layouts/DashboardLayout.tsx";

export const DashboardRoutes = (attach?: RouteObject[]): RouteObject[] => {
  return [
    {
      path: "/",
      element: <WithDashboardLayout />,
      children: [
        {
          path: "",
          element: <DashboardLayout />,
          children: [
            RegisterPage(PathConstants.Home, "Dashboard/Home/HomePage", {
              index: true,
            }),
            RegisterPage(PathConstants.HashTag, "Dashboard/Home/HomePage"),
            RegisterPage(
              PathConstants.AddPost,
              "Dashboard/AddPost/AddPostPage"
            ),
            RegisterPage(PathConstants.Live, "Dashboard/Live/LivePage"),
            RegisterPage(PathConstants.LiveNow, "Dashboard/Live/LivePage"),
            RegisterPage(
              PathConstants.LiveJoin,
              "Dashboard/JoinLive/JoinLivePage"
            ),
            RegisterPage(
              PathConstants.EditProfile,
              "Dashboard/EditProfile/EditProfilePage"
            ),
            RegisterPage(
              PathConstants.IDverification,
              "Dashboard/IDverification/IdProof"
            ),
            RegisterPage(
              PathConstants.ChangePassword,
              "Dashboard/ChangePassword/ChangePasswordPage"
            ),
            RegisterPage(
              PathConstants.Settings,
              "Dashboard/Settings/SettingsPage"
            ),
            RegisterPage(PathConstants.Post, "Dashboard/PostView/PostViewPage"),
            RegisterPage(
              PathConstants.networkPostView,
              "Dashboard/NetworkPostView/PostViewPage"
            ),
            RegisterPage(
              PathConstants.Updates,
              "Dashboard/Updates/UpdatesPage"
            ),
            RegisterPage(
              PathConstants.Networks,
              "Dashboard/Networks/NetworkPage"
            ),
            RegisterPage(
              PathConstants.NetworkInviteView,
              "Dashboard/Networks/NetworkPage"
            ),
            RegisterPage(
              PathConstants.NetworkView,
              "Dashboard/Networks/NetworkPage"
            ),
            RegisterPage(
              PathConstants.UpdatesView,
              "Dashboard/UpdatesView/UpdateViewPage"
            ),
            RegisterPage(PathConstants.Profile, "Dashboard/Me/MePage"),
            RegisterPage(PathConstants.UserView, "Dashboard/Me/MePage"),
            RegisterPage(
              PathConstants.AccountDeletes,
              "Dashboard/Sample/SamplePage"
            ),
            RegisterPage(
              PathConstants.DeleteAccountMe,
              "Dashboard/AccountDelete/AccountDeletePage"
            ),
            RegisterPage(
              PathConstants.Messages,
              "Dashboard/Messages/MessagePage"
            ),
            RegisterPage(
              PathConstants.MessageView,
              "Dashboard/Messages/MessagePage"
            ),
          ],
        },
        {
          path: "/",
          element: <PublicLayout isOnboarding={true} />,
          children: [
            RegisterPage(
              PathConstants.CompleteProfile,
              "Dashboard/CompleteProfile/CompleteProfilePage"
            ),
            RegisterPage(
              PathConstants.FindPeople,
              "Dashboard/FindPeople/FindPeoplePage"
            ),
            RegisterPage(
              PathConstants.SelectUpdates,
              "Dashboard/SelectUpdates/SelectUpdatesPage"
            ),
            RegisterPage(
              PathConstants.YouAreIn,
              "Dashboard/YouAreIn/YouAreInPage"
            ),
          ],
        },
        ...(Array.isArray(attach) ? attach : []),
      ],
    },
  ];
};

export default DashboardRoutes;
