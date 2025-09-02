import {RouteObject} from "react-router-dom";
import {RegisterPage} from "../Utils/RegisterPage.tsx";
import {PathConstants} from "./PathConstants.ts";
import PublicLayout from "../Components/Layouts/PublicLayout.tsx";

export const CommonRoutes = (attach?: RouteObject[]): RouteObject[] => {
    return [
        {
            path: "/",
            children: [
                RegisterPage(PathConstants.ERROR404, "Common/404/404Page"),
            ]
        },
        {
            path: '/',
            element: <PublicLayout isOnboarding className="!h-auto min-h-screen"/>,
            children: [
                RegisterPage(PathConstants.TermsOfService, "Common/TermsOfService/TermsOfServicePage"),
                RegisterPage(PathConstants.PrivacyPolicy, "Common/PrivacyPolicy/PrivacyPolicyPage"),
                RegisterPage(PathConstants.OurAdsPolicy, "Common/OurAdsPolicy/OurAdsPolicyPage"),
                RegisterPage(PathConstants.OurConcept, "Common/OurConcept/OurConceptPage"),
            ]
        },
        {
            path: '/',
            element: <PublicLayout showInstallApp isOnboarding className="!h-auto min-h-screen"/>,
            children: [
                RegisterPage(PathConstants.Post, "Common/PostView/PostViewPage"),
                RegisterPage(PathConstants.UpdatesView, "Common/PostView/UpdateViewPage"),
                RegisterPage(PathConstants.networkPostView, "Common/PostView/NetworkPostViewPage")
            ]
        },
        ...(Array.isArray(attach) ? attach : [])
    ]
};

export default CommonRoutes