import {FC, PropsWithChildren, useEffect} from "react";
import {useLocation, useNavigate, Outlet} from "react-router-dom";
import {useSelector} from "react-redux";
import {PathConstants} from "../Router/PathConstants.ts";

const WithDashboardLayout: FC<PropsWithChildren> = () => {
    const location = useLocation()
    const navigator = useNavigate()
    const authData = useSelector((state: any) => state.AuthData)
    useEffect(() => {
        if (authData.isLoggedIn && !authData.isCompletedProfile) {
            if (location.pathname !== PathConstants.CompleteProfile) 
                return navigator(PathConstants.CompleteProfile)
           
        }
        
    }, [authData
        // location, authData
    ])
    return <Outlet />
}
export default WithDashboardLayout