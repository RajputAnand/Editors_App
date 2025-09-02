import {
  UseMutationOptions,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { buildRequest } from "../Api/buildRequest";
import { Endpoints } from "../Api/Endpoints";
import { AxiosResponse } from "axios";
import AxiosClient from "../Api/AxiosClient";
import { NetworkGroup } from "../Types/networkGroupInfoTypes";
import { useMutationQuery } from "../Api/QueryHooks/useMutationQuery";
import { UserData } from "../Types/userinfo";

const filterResponse = (data: AxiosResponse<any>) => {
  const res = data?.data;

  return {
    ...res,
    total: res?.total,
    networks: res?.data?.filter((network: any) => network),
  };
};

export const useNetworkList = (
  is_show: string,
  searchText?: string,
  roles?: any,
  LIMIT_PAGINATION?: number
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
      Endpoints.NetworkListJoinAndNotJoin,
      "GET",
      {
        per_page: LIMIT_PAGINATION || 10,
        name: searchText,
        is_show: is_show,
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

export const useNetworkDetais = (networkId: number | undefined) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["network-details", networkId],
    queryFn: async () => {
      const response = await AxiosClient.get<NetworkGroup>(
        `user/network/${networkId}`
      );
      return response.data;
    },
  });

  return {
    networkGroupInfo: data,
    networkGroupInfoLoading: isLoading,
    refetch,
  };
};

export const useFriendsList = (userId: number | undefined) => {
  const { data, isLoading } = useQuery({
    queryKey: ["friends-details", userId],
    queryFn: async () => {
      const response = await AxiosClient.get<UserData>(`user/user/${userId}`);
      return response.data;
    },
  });

  const combinedList = data
    ? {
        followers: JSON.parse(data.data.followers),
        following: JSON.parse(data.data.following),
      }
    : { followers: [], following: [] };

  const combined = [...combinedList.followers, ...combinedList.following];

  return {
    combined,
    isLoading,
  };
};

export const useNetworkListPagination = (
  page: number,
  per_page: number,
  is_show?: string
) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [Endpoints.NetworkListJoinAndNotJoin, page, per_page],
    queryFn: async () => {
      const response = await AxiosClient.get(
        `user/network?page=${page}&per_page=${per_page}&is_show=${is_show}`
      );
      return response.data;
    },
  });

  return {
    data,
    isLoading,
    error,
  };
};
