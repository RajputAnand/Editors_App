import { FC } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { buildRequest } from "../../Api/buildRequest";
import Avatar from "../Avatar/Avatar";
import Typography from "../Typography/Typography";
import { useInfiniteQuery } from "@tanstack/react-query";
import Button from "../Buttons/Button";
import Loading from "../Common/Loading";
import { AxiosResponse } from "axios";
import { useSelector } from "react-redux";
import { NetworkGroup } from "../../Types/networkGroupInfoTypes";
import { Endpoints } from "../../Api/Endpoints";
import { useNavigate } from "react-router-dom";
import { PathConstants } from "../../Router/PathConstants";
import { useNetworkPost } from "../../Hooks/useNetworkPost";
import toast from "react-hot-toast";
import { queryClient } from "../../Api/Client";

interface INetworkUsers {
  networkGroupId: any;
  memberUserIds?: any;
  emptyString?: string;
  searchText?: string;
  setMemberCount?: (count: number) => void;
  setAdminCount?: (count: number) => void;
  setUserCount?: (count: number) => void;
  setFriendsCount?: (count: number) => void;
  setTotalCount?: (count: number) => void;
  networkGroupInfo: NetworkGroup | undefined;
  removeMemberUserId?: any;
  status?: any;
  roles: any;
}

const NetworkPrivateGroupRequestList: FC<INetworkUsers> = ({
  emptyString,
  networkGroupId,
  roles,
  status,
}) => {
  const selector = useSelector((state: any) => state.AuthData);
  const navigate = useNavigate();

  const filterResponse = (data: AxiosResponse<any>) => {
    const res = data?.data;

    return {
      ...res,
      admin_count: res?.admin_count,
      total: res?.total,
      user_count: res?.user_count,
      member_count: res?.member_count,
      user: res?.data?.filter((user: any) => user),
    };
  };

  const { fetchNextPage, hasNextPage, data, isLoading, isRefetching } =
    useInfiniteQuery({
      queryKey: [
        Endpoints.NetworkGroupMemberList,
        "GET",
        {
          per_page: 10,
          network_group_id: networkGroupId,
          roles: JSON.stringify(roles),
          status: JSON.stringify(status),
        },
      ],
      queryFn: (args) => buildRequest(args, filterResponse),
      initialPageParam: 1,
      getNextPageParam: (lastPage: any, allPages: any) => {
        return lastPage.data.length === 10 ? allPages.length + 1 : undefined;
      },
      staleTime: Infinity,
      refetchOnMount: "always",
      refetchOnWindowFocus: "always",
    });

  const { acceptNetworkMember, rejectNetworkMember } = useNetworkPost();
  const { mutate: acceptNetworkMemberRequest, isPending: isAcceptPending } =
    acceptNetworkMember({
      mutationKey: [
        Endpoints.AcceptNetworkMember.replaceWithObject({
          network_group_id: networkGroupId || "",
        }),
        "PATCH",
      ],
    });
  const { mutate: rejectNetworkMemberRequest, isPending: isRejectionPending } =
    rejectNetworkMember({
      mutationKey: [
        Endpoints.RejectNetworkMember.replaceWithObject({
          network_group_id: networkGroupId || "",
        }),
        "PATCH",
      ],
    });

  const handleAccept = (member_user_id: number) => {
    acceptNetworkMemberRequest(
      {
        member_user_id: member_user_id,
      },
      {
        onSuccess: (data) => {
          toast.success(data?.message);
          queryClient.invalidateQueries({
            queryKey: [Endpoints.NetworkGroupMemberList],
          });
        },
      }
    );
  };

  const handleReject = (member_user_id: number) => {
    rejectNetworkMemberRequest(
      {
        member_user_id: member_user_id,
      },
      {
        onSuccess: (data) => {
          toast.success(data?.message);
          queryClient.invalidateQueries({
            queryKey: [Endpoints.NetworkGroupMemberList],
          });
        },
      }
    );
  };

  const loadingWithText = (
    <div className="flex items-center gap-1 w-full justify-center my-8">
      <Loading iconClassName="!w-[2rem] !h-[2rem]" />
      <Typography variant="title" size="small">
        Loading
      </Typography>
    </div>
  );

  const handleClickUserProfile = (user_name: string) => () => {
    return navigate(
      PathConstants.UserView.replaceWithObject({ username: user_name })
    );
  };

  if (isLoading || isRefetching) return loadingWithText;

  const dataLength =
    data?.pages.reduce((counter, page) => counter + page?.data.length, 0) ?? 0;
  if (dataLength === 0)
    return (
      <div className="h-16 flex items-center justify-center">
        <Typography
          variant="body"
          size="large"
          className="text-secondary-light/40"
        >
          No request found
        </Typography>
      </div>
    );

  return (
    <div className="p-4 bg-white !mr-2 mb-4">
      <div className="flex items-start flex-col gap-[0.75rem justify-start w-full">
        <div className="flex flex-1 flex-col gap-[0.1rem] w-full">
          <InfiniteScroll
            next={fetchNextPage}
            hasMore={hasNextPage}
            loader={<div>Loading...</div>}
            dataLength={dataLength}
            className="flex flex-col gap-4"
          >
            {data?.pages?.map((page) =>
              page?.data.map((item: any, key: number) => (
                <div
                  className="flex flex-wrap items-center gap-[0.50rem] justify-between"
                  key={key}
                >
                  <div
                    className="flex items-center gap-[0.50rem] text-sm cursor-pointer"
                    onClick={handleClickUserProfile(
                      item?.member_user?.user_name
                    )}
                  >
                    <Avatar image={item?.member_user?.profile_image} />
                    <div className="flex flex-col flex-wrap">
                      <h2 className="!text-black-900_01 font-bold text-base">
                        {item?.member_user?.name}
                      </h2>
                      <p className="!font-normal !text-blue_gray_300 text-xs !text-secondary-50">
                        {item?.role}
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="flex px-2 items-center gap-2">
                      <Button
                        variant="outline"
                        className="px-2"
                        onClick={() => handleReject(item?.member_user_id)}
                        isLoading={isRejectionPending}

                        //  onClick={handleDeleteButton}
                      >
                        <Typography
                          variant="body"
                          size="small"
                          className="text-primary-100"
                        >
                          Reject
                        </Typography>
                      </Button>

                      <Button
                        variant="primary"
                        onClick={() => handleAccept(item?.member_user_id)}
                        isLoading={isAcceptPending}
                      >
                        <Typography
                          variant="body"
                          size="small"
                          className="text-white cursor-pointer"
                        >
                          Accept
                        </Typography>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
};

export default NetworkPrivateGroupRequestList;
