import {AxiosResponse} from "axios";

export const responsesCommonFilter = (data: AxiosResponse) => {
    return data?.data
}