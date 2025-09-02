import AxiosClient from "./AxiosClient.ts";
import {responsesCommonFilter} from "../Utils/requestUtils.ts";

export function buildRequest(args: any, responsesFilter?: any, isFromData?: boolean) {
    let body = args.queryKey[2];
    if (isFromData) {
        let body = new FormData();
        for (const [key, value] of Object.entries(args.queryKey[2] as any)) {
            body.append(key, value as any);
        }
    }
    return AxiosClient.request({
        url: args.queryKey[0] as string,
        ...(args.queryKey?.[1] !== "GET" ? { data: body } : {}),
        ...(args.queryKey?.[1] === "GET" ? { params: { ...(args?.pageParam ? { page: args.pageParam } : {}) ,...body } } : {}),
        method: args.queryKey?.[1] as string
    }).then(Boolean(responsesFilter) ? responsesFilter : responsesCommonFilter)
}

// export function buildRtcToken() {
//     return axios.post("")
// }