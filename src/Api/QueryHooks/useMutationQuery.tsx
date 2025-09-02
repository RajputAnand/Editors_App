import { useMutation } from "@tanstack/react-query";
import { UseMutationOptions } from "@tanstack/react-query";
import AxiosClient from "../AxiosClient.ts";
import { AxiosResponse, isAxiosError } from "axios";
import { responsesCommonFilter } from "../../Utils/requestUtils.ts";
import toast from "react-hot-toast";
import { COMMON_MESSAGE } from "../../Constants/Common.ts";
import { UseFormSetError } from "react-hook-form";
import { useState } from "react";


export const useMutationQuery = (args: UseMutationOptions, isFromData?: boolean, setError?: UseFormSetError<any>, responsesFilter?: (data: AxiosResponse) => void) => {
    const [progress, setProgress] = useState<number>(0);
    function buildRequest(data?: any) {
        let body = data;
        if (isFromData) {
            let body = new FormData();
            for (const [key, value] of Object.entries(data)) {
                body.append(key, value as any);
            }
        }
        return AxiosClient.request({
            url: args.mutationKey?.[0] as string,
            ...(isFromData ? {
                headers: { "Content-Type": "multipart/form-data" }
            } : {}),
            ...(Boolean(data) ? { data: body } : {}),
            method: args.mutationKey?.[1] as string,
            onUploadProgress: (progressEvent) => {
                const total = progressEvent.total || 1; // fallback in case total is undefined
                setProgress(Math.round((progressEvent.loaded * 100) / total));
            },
        }).then(Boolean(responsesFilter) ? responsesFilter : responsesCommonFilter)
    }

    const handleError = (error: any) => {
        if (isAxiosError(error)) {
            if (typeof error.response?.data == "object") {
                if (typeof error.response.data?.errors == "object" && Object.getOwnPropertyNames(error.response.data?.errors).length !== 0) {
                    for (const field in error.response.data?.errors) {
                        try {
                            const fieldError = error.response.data?.errors[field][0];
                            if (setError) setError(field, { message: fieldError, type: "custom" })
                        } catch (e) {
                            console.log(e, "error")
                        }
                    }
                    return;
                } else {
                    if (typeof error.response.data?.errors == "string") return toast.error(error.response.data?.errors ?? COMMON_MESSAGE)
                    if (typeof error.response.data?.error == "string") return toast.error(error.response.data?.error ?? COMMON_MESSAGE)
                    return toast.error(error.response?.data?.message ?? COMMON_MESSAGE)
                }
            }
            return toast.error(COMMON_MESSAGE)
        }
    }


    return {
        ...useMutation<any, any, any>({
            mutationFn: buildRequest,
            onError: handleError,
            ...args,
        }),
        progress
    }
}