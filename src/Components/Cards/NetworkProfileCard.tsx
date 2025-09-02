import React, { FC, useState } from "react";
import Avatar from "../Avatar/Avatar.tsx";
import { MaterialSymbol } from "react-material-symbols";
import { useInfiniteQuery } from "@tanstack/react-query";
import Button from "../Buttons/Button.tsx";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Endpoints } from "../../Api/Endpoints";
import { buildRequest } from "../../Api/buildRequest";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../Common/Loading";
import Typography from "../Typography/Typography";
import { AxiosResponse } from "axios";
import FeedCard from "../Cards/FeedCard";
import "react-tabs/style/react-tabs.css";
import MemberSearch from "../Inputs/MemberSearch.tsx";
import NetworkAboutCard from "./NetworkAboutCard.tsx";
import NetworkFeedHeaderCard from "./NetworkFeedHeaderCard.tsx";
import { useFriendsList, useNetworkDetais } from "../../Hooks/useNetwork.tsx";
import ReSharePostModal from "../Modal/ReSharePostModal.tsx";
import { copyToClipboard } from "../../Utils/copyToClipboard.ts";
import NetworkUserList from "./NetworkUserList.tsx";
import { useSelector } from "react-redux";
import { useNetworkPost } from "../../Hooks/useNetworkPost.tsx";
import { queryClient } from "../../Api/Client.tsx";
import toast from "react-hot-toast";
import DeleteConfirm from "../Modal/DeleteConfirm.tsx";
import InviteUser from "../Invite/InviteUsers.tsx";
import NetworkPrivateGroupRequestList from "./NetworkPrivateGroupRequestList.tsx";
import { useSearchParams } from "react-router-dom";
import { RE_SHARE_NETWORK_LINK } from "../../Constants/Common.ts";

interface INetworkProfileCard {
  networkGroupId?: any;
  banner_image?: string;
  profile_image?: string;
}

const NetworkProfileCard: FC<INetworkProfileCard> = (props) => {
  const { profile_image, networkGroupId } = props;
  const [isOpenShare, setIsShareOpen] = useState(false);
  const [searchMember, setSearchMember] = useState("");
  const [adminCount, setAdminCount] = useState<number>(0);
  const [memberCount, setMemberCount] = useState<number>(0);
  const [friendsCount, setFriendsCount] = useState<number>(0);
  const selector = useSelector((state: any) => state.AuthData);
  const { combined } = useFriendsList(selector.isLoginUserId);
  const LIMIT_PAGINATION = 10;
  const { networkGroupInfo, refetch, networkGroupInfoLoading } =
    useNetworkDetais(networkGroupId);
  const isAdmin = networkGroupInfo?.data.network_group_members.find(
    (member) =>
      member.member_user_id === selector.isLoginUserId &&
      member.role === "admin"
  );
  // const type = networkGroupInfo?.data.type || "";
  const [searchParams] = useSearchParams();
  const groupPostId = searchParams.get("postId");
  const groupPostIds = groupPostId ? [parseInt(groupPostId)] : [];

  const removeInviteUsersIds = networkGroupInfo?.data.network_group_members.map(
    (member) => member.member_user_id
  );

  const [openConfirmDelete, setConfirmDelete] = useState<boolean>(false);
  const { joinNetwork, deleteNetworkMember } = useNetworkPost();
  const { mutate: deleteMutate } = deleteNetworkMember();
  const { mutate: cancelRequest, isPending: isRequestCancelPending } =
    deleteNetworkMember();
  const { mutate, isPending: isJoiningNetworkPending } = joinNetwork({
    mutationKey: [
      Endpoints.NetworkMemberJoin.replaceWithObject({
        invitation_code: networkGroupInfo?.data?.invitation_code || "",
      }),
      "PUT",
    ],
  });

  const networkGroupName = networkGroupInfo?.data.name || "";
  const currentUrl = window.location.href;
  let networkSharelink;

  if (currentUrl.includes("/network/invite/pending")) {
    networkSharelink = currentUrl.replace(
      "/network/invite/pending",
      `/network/${networkGroupId}`
    );
  } else {
    networkSharelink = `${currentUrl}/${networkGroupId}`;
  }

  const { follow, unFollow } = useNetworkPost();
  const { mutate: unFollowMutate, isPending: unFollowIsPending } = unFollow({});
  const { mutate: followMutate, isPending: followIsPending } = follow();

  const triggerAction = () => {
    if (networkGroupInfo?.data.is_following) {
      return unFollowMutate(
        { admired_network_id: networkGroupId },
        {
          onSuccess: () =>
            queryClient.invalidateQueries({
              queryKey: ["network-details"],
            }),
        }
      );
    } else {
      return followMutate(
        { admired_network_id: networkGroupId },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["network-details"],
            });
          },
        }
      );
    }
  };

  const handleOpenConfirmDeleteModal = () => {
    setConfirmDelete((_) => !_);
  };

  const handleJoin = () => {
    mutate(
      {},
      {
        onSuccess: () => {
          toast.success(
            `${
              networkGroupInfo?.data.type === "private"
                ? "Join request sent successfully"
                : `You have joined the ${networkGroupName}`
            } `
          );
          refetch();
          queryClient.invalidateQueries({
            queryKey: [Endpoints.NetworkListJoinAndNotJoin],
          });
        },
        onError: (data) => {
          toast.success(data?.message);
        },
      }
    );
  };

  const handleDeleteButton = () => {
    deleteMutate(
      {
        network_group_id: networkGroupId,
        member_user_id: selector.isLoginUserId,
      },
      {
        onSuccess: () => {
          handleOpenConfirmDeleteModal();
          toast.success(`You have lefted the ${networkGroupName} `);
          refetch();
          queryClient.invalidateQueries({
            queryKey: [Endpoints.NetworkListJoinAndNotJoin],
          });
        },
      }
    );
  };

  const { acceptNetworkMember, rejectNetworkMember } = useNetworkPost();
  const { mutate: acceptNetworkMemberRequest, isPending: isAcceptPending } =
    acceptNetworkMember({
      mutationKey: [
        Endpoints.AcceptNetworkMember.replaceWithObject({
          network_group_id: networkGroupId,
        }),
        "PATCH",
      ],
    });
  const { mutate: rejectNetworkMemberRequest, isPending: isRejectionPending } =
    rejectNetworkMember({
      mutationKey: [
        Endpoints.RejectNetworkMember.replaceWithObject({
          network_group_id: networkGroupId,
        }),
        "PATCH",
      ],
    });

  const handleAccept = (event: React.MouseEvent) => {
    event.stopPropagation();
    acceptNetworkMemberRequest(
      {},
      {
        onSuccess: (data) => {
          toast.success(data?.message);
          refetch();
          queryClient.invalidateQueries({
            queryKey: [Endpoints.NetworkListJoinAndNotJoin],
          });
        },
      }
    );
  };

  const handleReject = (event: React.MouseEvent) => {
    event.stopPropagation();
    rejectNetworkMemberRequest(
      {},
      {
        onSuccess: (data) => {
          toast.success(data?.message);
          refetch();
          queryClient.invalidateQueries({
            queryKey: [Endpoints.NetworkListJoinAndNotJoin],
          });
        },
      }
    );
  };

  const handleRequestCancel = (event: React.MouseEvent) => {
    event.stopPropagation();
    cancelRequest(
      {
        network_group_id: networkGroupInfo?.data.id,
        member_user_id: selector.isLoginUserId,
      },
      {
        onSuccess: () => {
          toast.success("Request canceled successfully");
          queryClient.invalidateQueries({
            queryKey: ["network-details"],
          });
        },
        onError: () => {
          toast.error("Cancel request failed");
        },
      }
    );
  };

  const handleCopy = () => {
    copyToClipboard(
      RE_SHARE_NETWORK_LINK.replaceWithObject({ id: networkGroupId })
    );
    setIsShareOpen(false);
  };

  const filterResponse = (data: AxiosResponse<any>) => {
    const res = data?.data;

    return {
      ...res,
      posts: res?.data?.filter((_: any) => _),
      updates: res?.data?.filter((_: any) => _?.video?.length !== 0),
    };
  };

  const renderBannerImage = () => {
    const CClassName = "w-full h-[12rem] tablet:h-[9.94rem] mt-5";
    if (networkGroupInfo?.data.cover_photo)
      return (
        <img
          src={networkGroupInfo.data.cover_photo}
          className={`${CClassName} object-cover rounded-lg md:h-auto`}
          alt="banner image"
        />
      );
    return (
      <div
        className={`${CClassName} bg-surface-light mt-[0.38rem flex-1 md:self-stretch] pr-20 rounded-lg`}
      />
    );
  };

  const renderProfileImagedetails = () => {
    if (networkGroupInfoLoading) return <div></div>;
    return (
      <div className="mt-[1.00rem] flex items-center flex-wrap justify-between md:flex-col relative">
        <div className="flex justify-start gap-[1.00rem] md:w-full">
          <Avatar
            image={networkGroupInfo?.data.profile_photo}
            iconType={"groups"}
            className="!text-[3rem]"
            classNameAvatarContainer={` h-[4.5rem] w-[4.5rem] rounded-full ${
              networkGroupInfo?.data.profile_photo ? "" : "!bg-surface-light"
            }`}
          />
        </div>
        <div className="flex flex-1 flex-col gap-[0.25rem]">
          <div className="flex-wrap items-center ">
            <h1 className="!text-black-900 font-bold text-[1rem]  laptop:text-[1.4rem] md:text-[1.38rem] pr-2 pl-2">
              {networkGroupInfo?.data.name}
            </h1>
            <br />
            <div className="!text-[#8F92AB] text-sm laptop:text-lg items-center flex-wrap pl-3 -mt-5">
              @{networkGroupInfo?.data.user_name}
            </div>
          </div>
          <div className="flex w-[78%] items-center md-full">
            <div className=" flex-1 items-center gap-[0.31rem] pl-2">
              {/* <MaterialSymbol
                icon={"public"}
                className="cursor-pointer !text-[1.5rem] !text-[#8F92AB]"
                as={"div"}
              /> */}
              <div className="flex flex-1 items-center">
                <img
                  src="Assets/Images/group-icon.png"
                  className="w-[0.875rem]"
                  alt="share"
                />

                <div className="!text-[#8F92AB] text-[12px] laptop:text-lg flex items-center flex-wrap capitalize pl-1">
                  {networkGroupInfo?.data.type} Network
                </div>
              </div>
              <div className="flex flex-1 items-center">
                <MaterialSymbol
                  icon={"fiber_manual_record"}
                  className="cursor-pointer !text-[.5rem] text-primary-50"
                  as={"div"}
                />
                <div className="!text-[#8F92AB] text-[12px] laptop:text-lg flex items-center flex-wrap pl-2">
                  {networkGroupInfo?.data.member_count} Members
                </div>
              </div>
            </div>
          </div>
        </div>

        {networkGroupInfo?.data.join_status === "invited user" ? (
          <div className="flex w-full gap-x-4 p-2 laptop:p-0  laptop:gap-x-0 laptop:w-[40%] justify-end md:w-full laptop:pr-[35px] items-center">
            <Button
              onClick={handleAccept}
              isLoading={isAcceptPending}
              variant="outline"
              className="w-full !p-0 !pl-4 !pr-6 !py-[0.5rem] laptop:!flex  justify-center text-center "
            >
              <Typography variant="title" size="medium">
                Accept
              </Typography>
            </Button>
            <Button
              onClick={handleReject}
              isLoading={isRejectionPending}
              variant="primary"
              className="w-full !p-0 !pl-4 !pr-6 !py-[0.5rem] laptop:!flex laptop:!ml-[5%] justify-center text-center "
            >
              <Typography variant="title" size="medium">
                Reject
              </Typography>
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap laptop:flex-nowrap  w-full gap-x-4 p-2 laptop:p-0  laptop:gap-x-0 laptop:w-[40%] justify-end md:w-full laptop:pr-[35px] items-center">
            {networkGroupInfo?.data.is_joined && (
              <InviteUser
                networkGroupId={networkGroupId}
                removeMemberUserId={removeInviteUsersIds}
              />
            )}
            {networkGroupInfo?.data.is_joined &&
              networkGroupInfo.data.type === "public" && (
                <button
                  onClick={() => setIsShareOpen(!isOpenShare)}
                  className="flex gap-2 items-center ml-4"
                >
                  <div className="bg-primary w-5 rounded-lg cursor-pointer">
                    <img
                      src="Assets/Images/share.png"
                      className="w-4 h-5"
                      alt="share"
                    />
                  </div>
                  <div>Share</div>
                </button>
              )}
            <button className="cursor-pointer">
              <div className="flex gap-1 ml-2 items-center justify-center">
                {/* <ViewIcon className="w-[1.2rem] h-[1.2rem] text-[#575B7F]" /> */}
                <MaterialSymbol
                  icon="radio_button_checked"
                  className={`!text-[1.4rem] text-primary-100 bg-[#ffff]`}
                  // //  ${isLiked ? "text-primary" : ""}
                  //  `}
                />
                <div>Views</div>
                <Typography
                  variant="body"
                  size="large"
                  className="text-[#575B7F]"
                >
                  {networkGroupInfo?.data.view_count}
                </Typography>
              </div>
            </button>

            {networkGroupInfo?.data.join_status === "request for join" ? (
              <Button
                onClick={handleRequestCancel}
                variant={
                  networkGroupInfo?.data.join_status ? "outline" : "primary"
                }
                className="w-[40%] !p-0 !pl-4 !pr-6 !py-[0.5rem] laptop:!flex laptop:!ml-[5%] cursor-pointer  justify-center"
              >
                <Typography variant="title" size="small">
                  {isRequestCancelPending ? "loading" : "Cancel request"}
                </Typography>
              </Button>
            ) : (
              <Button
                onClick={
                  networkGroupInfo?.data.join_status === "active"
                    ? handleOpenConfirmDeleteModal
                    : handleJoin
                }
                variant={
                  networkGroupInfo?.data.join_status ? "outline" : "primary"
                }
                className="w-[40%] !p-0 !pl-4 !pr-6 !py-[0.5rem] laptop:!flex laptop:!ml-[5%] justify-center"
              >
                <Typography variant="title" size="medium">
                  {isJoiningNetworkPending
                    ? "loading"
                    : networkGroupInfo?.data.is_joined
                    ? "Leave"
                    : "Join"}
                </Typography>
              </Button>
            )}
          </div>
        )}

        <Button
          className="absolute -top-16 right-5 laptop:right-10"
          onClick={triggerAction}
          disabled={unFollowIsPending || followIsPending}
        >
          <Typography
            variant="body"
            size="medium"
            className="text-white font-bold cursor-pointer"
          >
            {unFollowIsPending || followIsPending ? (
              <div className="flex items-center justify-center gap-x-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <div>Loading</div>
              </div>
            ) : networkGroupInfo?.data.is_following ? (
              <div className="font-bold">Admiring</div>
            ) : (
              <div className="font-bold">Admire</div>
            )}
          </Typography>
        </Button>
      </div>
    );
  };

  const { hasNextPage, fetchNextPage, isLoading, data } = useInfiniteQuery({
    queryKey: [
      Endpoints.NetworkFeedPosts,
      "GET",
      {
        per_page: LIMIT_PAGINATION,
        network_group_id: networkGroupId,
        post_ids: JSON.stringify(groupPostIds),
      },
    ],
    queryFn: (args) => buildRequest(args, filterResponse),
    getNextPageParam: (lastPage: any, allPages: any) => {
      return lastPage.data.length === LIMIT_PAGINATION
        ? allPages.length + 1
        : undefined;
    },
    initialPageParam: 1,
    staleTime: Infinity,
  });

  const {
    hasNextPage: _hasNextPage,
    fetchNextPage: _fetchNextPage,
    isLoading: _isLoading,
    data: PinPostData,
  } = useInfiniteQuery({
    queryKey: [
      Endpoints.NetworkFeedPosts,
      "GET",
      {
        per_page: LIMIT_PAGINATION,
        network_group_id: networkGroupId,
        show_pinned_post_only: 1,
        post_ids: JSON.stringify(groupPostIds),
      },
    ],
    queryFn: (args) => buildRequest(args, filterResponse),
    getNextPageParam: (lastPage: any, allPages: any) => {
      return lastPage.data.length === LIMIT_PAGINATION
        ? allPages.length + 1
        : undefined;
    },
    initialPageParam: 1,
    staleTime: Infinity,
  });

  const loadingWithText = (
    <div className="flex items-center gap-1 w-full justify-center my-8">
      <Loading iconClassName="!w-[2rem] !h-[2rem]" />
      <Typography variant="title" size="large">
        Loading
      </Typography>
    </div>
  );
  const renderAbout = () => {
    return (
      <NetworkAboutCard
        profile_image={profile_image}
        networkInfo={networkGroupInfo}
        isAdmin={isAdmin}
      />
    );
  };
  const renderMember = () => {
    return (
      <div className="p-4 bg-white b500:rounded-lg border-b border border-solid border-[#E2E5FF] !mr-2 mb-4">
        <div className="flex items-start flex-col gap-[0.75rem justify-start w-full">
          {/* header section */}
          <div className="flex flex-1 flex-col gap-[0.1rem] w-full">
            <div className="flex flex-wrap items-center gap-[0.50rem]">
              <Typography
                className="!text-[#0E0E0E] font-bold flex items-center flex-wrap"
                variant="title"
                size="small"
              >
                Members
              </Typography>
              <MaterialSymbol
                icon={"fiber_manual_record"}
                className="cursor-pointer !text-[.5rem] text-primary-50 pl-2"
                as={"div"}
              />
              <Typography
                className="!text-[#8F92AB] flex items-center flex-wrap"
                variant="body"
                size="large"
              >
                {networkGroupInfo?.data.member_count}
              </Typography>
            </div>
            <div className="flex w-[78%] items-center gap-[0.50rem] md-full">
              <div className="flex flex-1 items-center gap-[0.31rem]">
                <Typography
                  className="!text-[#8F92AB] flex items-center flex-wrap"
                  variant="body"
                  size="large"
                >
                  New people that join this network will appear here.
                </Typography>
              </div>
            </div>
            <div className="mt-4 mb-8">
              <MemberSearch
                className="w-full"
                searchOnChange={setSearchMember}
                placeHolder="Search for network members"
              />
            </div>

            {/* Admins moderator */}
            <div>
              <div className="flex flex-1 flex-col gap-[0.1rem] w-full">
                <div className="flex flex-wrap items-center gap-[0.50rem]">
                  <Typography
                    className="!text-[#0E0E0E] font-bold flex items-center flex-wrap"
                    variant="title"
                    size="small"
                  >
                    Admins & Moderator
                  </Typography>
                  <MaterialSymbol
                    icon={"fiber_manual_record"}
                    className="cursor-pointer !text-[.5rem] text-primary-50 pl-2"
                    as={"div"}
                  />
                  <Typography
                    className="!text-[#8F92AB] flex items-center flex-wrap"
                    variant="body"
                    size="large"
                  >
                    {adminCount}
                  </Typography>
                </div>
              </div>
            </div>
            {renderMemberListing()}
            {/* friends */}
            <div>
              <div className="flex flex-1 flex-col gap-[0.1rem] w-full">
                <div className="flex flex-wrap items-center gap-[0.50rem]">
                  <Typography
                    className="!text-[#0E0E0E] font-bold flex items-center flex-wrap"
                    variant="title"
                    size="small"
                  >
                    Members
                  </Typography>
                  <MaterialSymbol
                    icon={"fiber_manual_record"}
                    className="cursor-pointer !text-[.5rem] text-primary-50 pl-2"
                    as={"div"}
                  />
                  <Typography
                    className="!text-[#8F92AB] flex items-center flex-wrap"
                    variant="body"
                    size="large"
                  >
                    {friendsCount}
                  </Typography>
                </div>
              </div>
            </div>
            {renderFriendsListing()}
            <div>
              <div className="flex flex-1 flex-col gap-[0.1rem] w-full">
                <div className="flex flex-wrap items-center gap-[0.50rem]">
                  <Typography
                    className="!text-[#0E0E0E] font-bold flex items-center flex-wrap"
                    variant="title"
                    size="small"
                  >
                    Others
                  </Typography>
                  <MaterialSymbol
                    icon={"fiber_manual_record"}
                    className="cursor-pointer !text-[.5rem] text-primary-50 pl-2"
                    as={"div"}
                  />
                  <Typography
                    className="!text-[#8F92AB] flex items-center flex-wrap"
                    variant="body"
                    size="large"
                  >
                    {memberCount}
                  </Typography>
                </div>
              </div>
            </div>
            {renderOthersListing()}
          </div>
        </div>
      </div>
    );
  };

  const renderOthersListing = () => {
    return (
      <NetworkUserList
        endpoint={Endpoints.NetworkGroupMemberList}
        limitPagination={LIMIT_PAGINATION}
        networkGroupId={networkGroupId}
        roles={["user", "invited user"]}
        queryKey="user"
        searchText={searchMember}
        removeMemberUserId={combined}
        setTotalCount={setMemberCount}
        networkGroupInfo={networkGroupInfo}
        status={[1]}
      />
    );
  };

  const renderFriendsListing = () => {
    return (
      <NetworkUserList
        endpoint={Endpoints.NetworkGroupMemberList}
        limitPagination={LIMIT_PAGINATION}
        networkGroupId={networkGroupId}
        roles={["user"]}
        memberUserIds={combined}
        queryKey="friends"
        searchText={searchMember}
        setTotalCount={setFriendsCount}
        networkGroupInfo={networkGroupInfo}
      />
    );
  };
  const renderMemberListing = () => {
    return (
      <NetworkUserList
        endpoint={Endpoints.NetworkGroupMemberList}
        limitPagination={LIMIT_PAGINATION}
        networkGroupId={networkGroupId}
        roles={["admin"]}
        queryKey="admin"
        searchText={searchMember}
        setTotalCount={setAdminCount}
        networkGroupInfo={networkGroupInfo}
      />
    );
  };
  const renderFeedsHeader = () => {
    if (!networkGroupInfo?.data.is_joined) return null;
    return (
      <NetworkFeedHeaderCard
        networkGroupId={networkGroupId}
        is_joined={networkGroupInfo?.data.is_joined}
      />
    );
  };
  const renderPinPostListing = () => {
    const dataLength =
      PinPostData?.pages.reduce(
        (counter, page) => counter + page?.data.length,
        0
      ) ?? 0;
    return (
      <div id="homescrollableDiv">
        <InfiniteScroll
          next={_fetchNextPage}
          hasMore={_hasNextPage}
          loader={loadingWithText}
          dataLength={dataLength}
          className="flex flex-col gap-[1rem]"
          scrollableTarget="homescrollableDiv"
        >
          {PinPostData?.pages?.map((page) => {
            return page.posts?.map?.((item: any, key: number) => {
              return (
                <React.Fragment key={key}>
                  <FeedCard
                    {...item}
                    key={key}
                    reFetchHomepageData={_fetchNextPage}
                    isAdmin={isAdmin}
                    is_from={true}
                  />
                </React.Fragment>
              );
            });
          })}
        </InfiniteScroll>
      </div>
    );
  };

  const renderListing = () => {
    const dataLength =
      data?.pages.reduce((counter, page) => counter + page?.data.length, 0) ??
      0;
    if (dataLength === 0)
      return (
        <Typography
          variant="body"
          size="large"
          className="flex justify-center flex-wrap"
        >
          No posts
        </Typography>
      );
    return (
      <div id="homescrollableDiv">
        <InfiniteScroll
          next={fetchNextPage}
          hasMore={hasNextPage}
          loader={loadingWithText}
          dataLength={dataLength}
          className="flex flex-col gap-[1rem]"
          scrollableTarget="homescrollableDiv"
        >
          {data?.pages?.map((page) => {
            return page.posts?.map?.((item: any, key: number) => {
              return (
                <React.Fragment key={key}>
                  <FeedCard
                    {...item}
                    key={key}
                    reFetchHomepageData={fetchNextPage}
                    isAdmin={isAdmin}
                    is_from={true}
                    refetch={refetch}
                  />
                </React.Fragment>
              );
            });
          })}
        </InfiniteScroll>
      </div>
    );
  };
  const rendertabs = () => {
    return (
      <div className="mt-[2rem] h-[75rem]md:h-auto relative" id="feedcardtabs">
        <Tabs>
          <TabList>
            <Tab>Feeds</Tab>
            <Tab>Members</Tab>
            <Tab>Concept</Tab>
            {isAdmin && networkGroupInfo?.data.type === "private" && (
              <Tab>Pending Requests</Tab>
            )}
          </TabList>

          <TabPanel>
            {renderFeedsHeader()}
            {_isLoading || isLoading ? (
              <>{loadingWithText}</>
            ) : (
              <>
                {networkGroupInfo?.data.type === "private" &&
                !networkGroupInfo.data.is_joined ? (
                  <Typography
                    variant="body"
                    size="large"
                    className="flex justify-center flex-wrap"
                  >
                    Join the group to view posts
                  </Typography>
                ) : (
                  <>
                    {renderPinPostListing()}
                    {renderListing()}
                  </>
                )}
              </>
            )}
          </TabPanel>
          <TabPanel>{renderMember()}</TabPanel>
          <TabPanel>{renderAbout()}</TabPanel>
          <TabPanel>
            {isAdmin && networkGroupInfo?.data.type === "private" && (
              <NetworkPrivateGroupRequestList
                networkGroupId={networkGroupId}
                networkGroupInfo={networkGroupInfo}
                roles={["requested user"]}
                status={[6]}
              />
            )}
          </TabPanel>
        </Tabs>
      </div>
    );
  };

  return (
    <div className="tablet:rounded-[0.75rem] bg-white overflow-hidden">
      {renderBannerImage()}
      {renderProfileImagedetails()}
      {rendertabs()}
      {isOpenShare && (
        <ReSharePostModal
          link={RE_SHARE_NETWORK_LINK.replaceWithObject({ id: networkGroupId })}
          openReshareModal={isOpenShare}
          handleOpenReShareModal={() => setIsShareOpen(false)}
          copyPostLink={handleCopy}
        />
      )}

      <DeleteConfirm
        isOpen={openConfirmDelete}
        closeModal={handleOpenConfirmDeleteModal}
        onClickYes={handleDeleteButton}
        buttonName="Yes"
      >
        <div className="pb-6 flex items-center justify-center">
          <Typography variant="body" size="large" className="text-black">
            Are you sure you want to leave{" "}
            <span className="font-bold">{networkGroupName}</span>
          </Typography>
        </div>
      </DeleteConfirm>
    </div>
  );
};

export default NetworkProfileCard;
