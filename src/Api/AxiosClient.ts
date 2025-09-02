import axios, {AxiosError} from "axios";
import {store} from "../Store/CreateStore.tsx";
import {setAuthData} from "../Store/Reducers/AuthReducer.ts";
import {PathConstants} from "../Router/PathConstants.ts";

const AxiosClient = () => {
    const Client = axios.create({
        baseURL: import.meta.env.VITE_API_URL,
        timeout: 1200000,
    })
    Client.interceptors.request.use(
        (config) => {
            const EE: any = store.getState().AuthData?.authKey
            if (Boolean(EE)) {
                config.headers['Token'] = EE
            }
            return config
        },
        (error) => {
            return Promise.reject(error)
        }
    )
    Client.interceptors.response.use(
        undefined,
        (error: AxiosError<{ message?: any }>) => {
            if (error.response?.data) {
                if (error.response?.data?.message == "Unauthorized") {
                    store.dispatch(setAuthData({ isLoggedIn: false, authKey: undefined,
                         isCompletedProfile: undefined
                        //  ,isLoginEmail: undefined,
                         }))
                    window.location.pathname = PathConstants.SingIn
                    return Promise.reject(error)
                }
                return Promise.reject(error)
            }
            return Promise.reject(error)
        }
    )

    return Client
}

export default AxiosClient()