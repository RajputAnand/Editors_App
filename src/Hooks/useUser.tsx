import {useMutationQuery} from "../Api/QueryHooks/useMutationQuery.tsx";
import {UseMutationOptions} from "@tanstack/react-query";
import {Endpoints} from "../Api/Endpoints.ts";
import {useGetQuery} from "../Api/QueryHooks/useGetQuery.tsx";
import {UndefinedInitialDataOptions} from "@tanstack/react-query";

function useUser() {

    const me = (args?: UndefinedInitialDataOptions) => useGetQuery({ queryKey: [Endpoints.Me, "GET"], refetchOnWindowFocus: false, refetchOnMount: false, retry: false, retryOnMount: false, refetchOnReconnect: false, ...args })

    const unFollow = (args?: UseMutationOptions) => {
        return useMutationQuery({ mutationKey: [Endpoints.UnFollowUser, "DELETE"], ...args})
    }

    const follow = (args?: UseMutationOptions)  => {
        return useMutationQuery({ mutationKey: [Endpoints.FollowUser, "POST"], ...args})
    }

    return {
        follow,
        unFollow,
        me
    }
}
export default useUser