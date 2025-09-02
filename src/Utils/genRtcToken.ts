import axios from "axios"

export function genRtcToken(data: any) {
    return axios.post(import.meta.env.VITE_RTC_TOKEN_URL, data)
}
