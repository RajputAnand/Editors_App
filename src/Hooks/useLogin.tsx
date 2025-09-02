import { store } from "../Store/CreateStore.tsx";
import { setAuthData } from "../Store/Reducers/AuthReducer.ts";
import toast from "react-hot-toast";
import { LOGIN_MESSAGE } from "../Constants/Common.ts";
import { useNavigate } from "react-router-dom";
import { PathConstants } from "../Router/PathConstants.ts";

const useLogin = () => {

    const navigate = useNavigate();
    const paths = PathConstants

    const UpdateLoginDetails = (data: any) => {

        if (data?.success) {
            store.dispatch(setAuthData({
                isLoggedIn: Boolean(data?.data?.auth_token),
                authKey: data?.data?.auth_token,
                isCompletedProfile: Boolean(""),
                isLoginEmail: data?.data?.email,
                isLoginPhoneCode: data?.data?.phone_code,
                isLoginPhone: data?.data?.phone,
                isLoginUserId: data?.data?.id,
                isLoginAdminverifiedId: data?.data?.is_admin_verified,
                isLoginUsername: data?.data?.user_name,
                agoraUsername: data?.data?.agora_username,
                agoraBearerToken :data?.data?.agora_bearer_token
            }))
            toast.success(LOGIN_MESSAGE)
            if (!Boolean(data?.data?.user_name)) return navigate(paths.CompleteProfile, { replace: true })
            return navigate(paths.Home, { replace: true })

        }
    }
    const UpdateLoginSuccess = (data: any) => {

        if (data?.success) {
            store.dispatch(setAuthData({
                isLoggedIn: Boolean(data?.data?.auth_token),
                authKey: data?.data?.auth_token,
                isCompletedProfile: Boolean(data?.data?.user_name),
                isLoginEmail: data?.data?.email,
                isLoginPhone: data?.data?.phone,
                isLoginPhoneCode: data?.data?.phone_code,
                isLoginUserId: data?.data?.id,
                isLoginAdminverifiedId: data?.data?.is_admin_verified,
                isLoginUsername: data?.data?.user_name,
                agoraUsername: data?.data?.agora_username,
                agoraBearerToken :data?.data?.agora_bearer_token
            }))
            toast.success(LOGIN_MESSAGE)
            return navigate(paths.Home, { replace: true })
        }
    }
    const Logout = (path?: string) => {
        store.dispatch(setAuthData({ isLoggedIn: false }))
        return typeof path === "string" && window.location.replace(path)
    }

    return {
        UpdateLoginDetails,
        UpdateLoginSuccess,
        Logout,
    }
}

export default useLogin