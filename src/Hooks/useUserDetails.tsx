import { useQuery } from "@tanstack/react-query";
import AxiosClient from "../Api/AxiosClient";
import { UserData } from "../Types/userinfo";

export const useUserData = (userId: number | undefined) => {
    const { data, isLoading } = useQuery({
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
        userLoading: isLoading
    };
};

