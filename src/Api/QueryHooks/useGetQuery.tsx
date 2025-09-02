import {useQuery} from "@tanstack/react-query";
import {UndefinedInitialDataOptions} from "@tanstack/react-query";
import AxiosClient from "../AxiosClient.ts";
import {responsesCommonFilter} from "../../Utils/requestUtils.ts";
import {AxiosResponse} from "axios";

export const useGetQuery = (args: UndefinedInitialDataOptions, isFromData?: boolean, responsesFilter?: (data: AxiosResponse) => void) => {
    function buildRequest() {
        let body = args.queryKey[2];
        if (isFromData) {
            let body = new FormData();
            for (const [key, value] of Object.entries(args.queryKey[2] as any)) {
                body.append(key, value as any);
            }
        }
        return AxiosClient.request({
            url: args.queryKey[0] as string,
            ...(isFromData ? {
                headers: { "Content-Type": "multipart/form-data" }
            } : {}),
            ...(args.queryKey?.[1] !== "GET" ? { data: body } : {}),
            ...(args.queryKey?.[1] === "GET" ? { params: body } : {}),
            method: args.queryKey?.[1] as string
        }).then(Boolean(responsesFilter) ? responsesFilter : responsesCommonFilter)
    }

    return useQuery<any, any, any>({
        queryFn: buildRequest,
        ...args
    })
}