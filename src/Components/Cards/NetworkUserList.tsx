import { FC, useEffect, useState } from "react";
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
import { useNetworkPost } from "../../Hooks/useNetworkPost";
import DeleteConfirm from "../Modal/DeleteConfirm";
import toast from "react-hot-toast";
import { queryClient } from "../../Api/Client";
import { Endpoints } from "../../Api/Endpoints";
import useUser from "../../Hooks/useUser";
import { useNavigate } from "react-router-dom";
import { PathConstants } from "../../Router/PathConstants";
import IconButton from "../Buttons/IconButton/IconButton";

interface INetworkUsers {
  endpoint: string;
  queryKey: string;
  roles: any;
  limitPagination: number;
  networkGroupId: number | undefined;
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
}

const NetworkUserList: FC<INetworkUsers> = ({
  endpoint,
  roles,
  limitPagination,
  networkGroupId,
  memberUserIds,
  emptyString,
  searchText,
  networkGroupInfo,
  removeMemberUserId,
  setTotalCount,
  status,
}) => {
  const [seeMore, setSeeMore] = useState(false);
  const [memberUserId, setMemberUserId] = useState("");
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
        endpoint,
        "GET",
        {
          per_page: limitPagination,
          network_group_id: networkGroupId,
          name: searchText || "",
          member_user_ids: JSON.stringify(memberUserIds) || "",
          remove_member_user_ids: JSON.stringify(removeMemberUserId) || "",
          roles: JSON.stringify(roles),
          status: JSON.stringify(status) || "",
        },
      ],
      queryFn: (args) => buildRequest(args, filterResponse),
      initialPageParam: 1,
      getNextPageParam: (lastPage: any, allPages: any) => {
        if (!seeMore) return undefined;
        return lastPage.data.length === limitPagination
          ? allPages.length + 1
          : undefined;
      },
      staleTime: Infinity,
      refetchOnMount: "always",
      refetchOnWindowFocus: "always",
    });

  // const admin_count = data?.pages[0]?.admin_count || 0;
  // const user_count = data?.pages[0]?.user_count || 0;
  // const member_count = data?.pages[0]?.member_count || 0;
  const total_count = data?.pages[0]?.total || 0;

  useEffect(() => {
    if (setTotalCount) {
      setTotalCount(total_count);
    }
  }, [total_count]);

  const handleClickSeeMore = () => setSeeMore((prev) => !prev);

  const loadingWithText = (
    <div className="flex items-center gap-1 w-full justify-center my-8">
      <Loading iconClassName="!w-[2rem] !h-[2rem]" />
      <Typography variant="title" size="small">
        Loading
      </Typography>
    </div>
  );
  const [openConfirmDelete, setConfirmDelete] = useState<boolean>(false);
  const { updateNetworkMember, deleteNetworkMember } = useNetworkPost();
  const { mutate: deleteMutate } = deleteNetworkMember();

  const { follow, unFollow } = useUser();
  const { mutate: unFollowMutate, isPending: unFollowIsPending } = unFollow({});
  const { mutate: followMutate, isPending: followIsPending } = follow();

  const triggerAction = (is_following: boolean, id: any) => {
    if (is_following) {
      return unFollowMutate(
        { admired_user_id: id },
        {
          onSuccess: () =>
            queryClient.invalidateQueries({
              queryKey: [Endpoints.NetworkGroupMemberList],
            }),
        }
      );
    } else {
      return followMutate(
        { admired_user_id: id },
        {
          onSuccess: () =>
            queryClient.invalidateQueries({
              queryKey: [Endpoints.NetworkGroupMemberList],
            }),
        }
      );
    }
  };

  const handleOpenConfirmDeleteModal = () => {
    setConfirmDelete((_) => !_);
  };

  const handleDeleteButton = () => {
    deleteMutate(
      {
        network_group_id: networkGroupId,
        member_user_id: memberUserId,
      },
      {
        onSuccess: (data) => {
          toast.success(data?.message);
          handleOpenConfirmDeleteModal();
          queryClient.invalidateQueries({
            queryKey: [
              endpoint,
              "GET",
              {
                per_page: limitPagination,
                network_group_id: networkGroupId,
                name: searchText || "",
                member_user_ids: JSON.stringify(memberUserIds) || "",
                remove_member_user_ids: JSON.stringify(removeMemberUserId) || "",
                roles: JSON.stringify(roles),
                status: JSON.stringify(status) || "",
              },
            ],
          });
        },
      }
    );
  };

  const handleUpdateButton = (userId: any) => {
    if (memberUserId)
      return updateMember(
        { make_as: "admin" },
        {
          onSuccess: (data) => {
            toast.success(data?.message);
            queryClient.invalidateQueries({
              queryKey: [Endpoints.NetworkGroupMemberList],
            });
          },
          onError: (data) => {
            toast.success(data?.message);
          },
        }
      );
  };

  const { mutate: updateMember, isPending } = updateNetworkMember({
    mutationKey: [
      Endpoints.UpdateNetworkGroupMember.replaceWithObject({
        id: memberUserId || "",
      }),
      "PUT",
    ],
  });

  const handleClickUserProfile = (user_name: string) => () => {
    return navigate(
      PathConstants.UserView.replaceWithObject({ username: user_name })
    );
  };

  const isAdmin = networkGroupInfo?.data.network_group_members.find(
    (member) =>
      member.member_user_id === selector.isLoginUserId &&
      member.role === "admin"
  );

  if (isLoading || isRefetching) return loadingWithText;

  const dataLength =
    data?.pages.reduce((counter, page) => counter + page?.data.length, 0) ?? 0;
  if (dataLength === 0)
    return (
      <div className="h-16 flex items-center justify-center">
        <Typography
          variant="body"
          size="small"
          className="text-secondary-light/40"
        >
          {emptyString}
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
              page?.data
                ?.slice(0, !seeMore ? 2 : limitPagination)
                .map((item: any, key: number) => (
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
                          {item?.role === "user" ? "member" : item?.role === "invited user" ? "invited member" : item?.role}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="flex px-2 items-center gap-2">
                        {item?.role === "admin" ? (
                          <></>
                        ) : (
                          isAdmin && (
                            <div className="flex items-center gap-3">
                              <IconButton 
                              onClick={()=>{
                                setMemberUserId(item?.member_user?.id)
                                handleOpenConfirmDeleteModal()
                              }} 
                              title="Remove Member" 
                              Icon="close" 
                              />
                              <Button
                                variant="outline"
                                isLoading={isPending}
                                className="px-2"
                                onClick={() => {
                                  setMemberUserId(item?.id);
                                  handleUpdateButton(item?.member_user?.id);
                                }}
                              >
                                <Typography
                                  variant="body"
                                  size="small"
                                  className="text-primary-100"
                                >
                                  Make Admin
                                </Typography>
                              </Button>
                            </div>
                          )
                        )}
                        <Button
                          hidden={
                            selector.isLoginUserId === item?.member_user_id
                          }
                          variant="primary"
                          disabled={unFollowIsPending || followIsPending}
                          onClick={() =>
                            triggerAction(
                              item?.is_following,
                              item?.member_user_id
                            )
                          }
                        >
                          <Typography
                            variant="body"
                            size="small"
                            className="text-white cursor-pointer"
                          >
                            {item?.is_following ? "Admiring" : "Admire"}
                          </Typography>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </InfiniteScroll>
          {!seeMore && dataLength > 2 ? (
            <Button
              variant="outline"
              onClick={handleClickSeeMore}
              className="!p-0 !pl-4 !pr-6 !py-[0.5rem] laptop:!flex mt-2 justify-center w-full"
            >
              <Typography variant="title" size="medium">
                See more
              </Typography>
            </Button>
          ) : (
            <div className="mt-2 mb-2">
              <hr className="w-full" />
            </div>
          )}
        </div>
      </div>
      <DeleteConfirm
        isOpen={openConfirmDelete}
        closeModal={handleOpenConfirmDeleteModal}
        onClickYes={handleDeleteButton}
        buttonName="Yes"
      >
        <div className="pb-6 flex items-center justify-center">
          <Typography variant="body" size="large" className="text-black">
            Are you sure you want to remove this member?
          </Typography>
        </div>
      </DeleteConfirm>
    </div>
  );
};

export default NetworkUserList;
