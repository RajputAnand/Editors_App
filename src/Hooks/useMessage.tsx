import { useInfiniteQuery, UseMutationOptions, useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import AxiosClient from "../Api/AxiosClient";
import { buildRequest } from "../Api/buildRequest";
import { Endpoints } from "../Api/Endpoints";
import { useMutationQuery } from "../Api/QueryHooks/useMutationQuery.tsx";
import { UserData } from "../Types/userinfo";

const filterResponse = (data: AxiosResponse<any>) => {
    const res = data?.data;
    return {
        ...res,
        total: res?.total,
        networks: res?.data?.filter((network: any) => network),
    };
};

export const useUserList = (
    is_show?: string,
    searchText?: string,
    roles?: any,
    LIMIT_PAGINATION?: number,
    only_show_messaged_agora_users?: number
) => {
    const {
        hasNextPage,
        fetchNextPage,
        isLoading,
        data,
        error,
        isFetchingNextPage,
        refetch,
    } = useInfiniteQuery({
        queryKey: [
            Endpoints.UserList,
            "GET",
            {
                per_page: LIMIT_PAGINATION || 10,
                name: searchText,
                is_show: is_show,
                is_remove_me: 1,
                only_show_agora_users: 1,
                only_show_messaged_agora_users,
                roles: JSON.stringify(roles),
            },
        ],
        queryFn: (args) => buildRequest(args, filterResponse),
        getNextPageParam: (lastPage: any, allPages: any) => {
            return lastPage.data.length === 10 ? allPages.length + 1 : undefined;
        },
        initialPageParam: 1,
        staleTime: Infinity,
    });
    return {
        hasNextPage,
        fetchNextPage,
        isLoading,
        data,
        error,
        isFetchingNextPage,
        refetch,
    };
};

export const useUserDetais = (userId: number | undefined) => {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ["user-details", userId],
        queryFn: async () => {
            const response = await AxiosClient.get<UserData>(
                `user/user/${userId}`
            );
            return response.data;
        },
    });
    return {
        user: data,
        userLoading: isLoading,
        refetch
    };
};

export const Agora = () => {
    const generateAgoraToken = (args?: UseMutationOptions) => {
        return useMutationQuery(
            { mutationKey: [Endpoints.NewAgoraBearerToken, "POST"], ...args },
            false
        )
    }
    return {
        generateAgoraToken
    };
};