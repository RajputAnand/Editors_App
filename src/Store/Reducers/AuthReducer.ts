import { createAction, createReducer } from "@reduxjs/toolkit";

export type TAuthReducer = {
    isLoggedIn: boolean,
    authKey?: string,
    isCompletedProfile?: boolean,
    isLoginEmail?: string,
    isLoginPhone?: string,
    isLoginPhoneCode?: any,
    isLoginUserId?: number,
    isLoginAdminverifiedId?: number,
    isLoginUsername?: string,
    agoraUsername?: string,
    agoraBearerToken?: string
}

const initialState: TAuthReducer = {
    isLoggedIn: false
}

export const setAuthData = createAction('[setAuthData] Set Data', (data: TAuthReducer) => ({
    payload: {
        data
    },
}))

export const selectAuthData = (state: any): any => state.AuthData;

const AuthReducer = createReducer(initialState, builder => {
    builder.addCase(setAuthData, (state, action) => {
        const { data } = action.payload
        return {
            ...state,
            ...data
        }
    })
})

export default AuthReducer