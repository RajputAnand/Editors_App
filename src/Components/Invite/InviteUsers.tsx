import { FC, Fragment, useState } from "react";
import { Transition, Dialog } from "@headlessui/react";
import Button from "../Buttons/Button";
import Typography from "../Typography/Typography";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Endpoints } from "../../Api/Endpoints";
import { buildRequest } from "../../Api/buildRequest";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../Common/Loading";
import Avatar from "../Avatar/Avatar";
import { useNetworkPost } from "../../Hooks/useNetworkPost";
import toast from "react-hot-toast";
import MemberSearch from "../Inputs/MemberSearch";
import { MaterialSymbol } from "react-material-symbols";

interface IInviteUser {
  networkGroupId: number | undefined;
  removeMemberUserId?: any;
}

const InviteUser: FC<IInviteUser> = (props) => {
  const { networkGroupId, removeMemberUserId } = props;
  const [open, setOpen] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const LIMIT_PAGINATION = 10;
  const { inviteNetworkMember } = useNetworkPost();
  const { mutate, isPending } = inviteNetworkMember();

  const { hasNextPage, fetchNextPage, isLoading, data } = useInfiniteQuery({
    queryKey: [
      Endpoints.UserViewPost,
      "GET",
      {
        per_page: LIMIT_PAGINATION,
        is_remove_me: 1,
        name: searchText,
        remove_user_ids: JSON.stringify(removeMemberUserId) || "",
      },
    ],
    queryFn: (args) => buildRequest(args),
    getNextPageParam: (lastPage: any, allPages: any) => {
      return lastPage.data.length === LIMIT_PAGINATION
        ? allPages.length + 1
        : undefined;
    },
    initialPageParam: 1,
    staleTime: Infinity,
  });

  const handleOnClose = () => {
    setOpen(false);
  };

  const handleCheckboxToggle = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const sendInvite = () => {
    mutate(
      {
        network_group_id: networkGroupId,
        member_user_id_array: selectedUserIds,
      },
      {
        onSuccess: () => {
          toast.success("Invite sent successfully!");
          handleOnClose();
          setSelectedUserIds([]);
        },
        onError: (data) => {
          toast.success(data?.message);
        },
      }
    );
  };

  const loadingWithText = (
    <div className="flex items-center gap-1 w-full justify-center my-8">
      <Loading iconClassName="!w-[2rem] !h-[2rem]" />
      <Typography variant="title" size="large">
        Loading
      </Typography>
    </div>
  );

  const dataLength =
    data?.pages.reduce((counter, page) => counter + page?.data.length, 0) ?? 0;

  return (
    <div>
      <button
        className="flex gap-1 mr-4 items-center "
        onClick={() => setOpen(true)}
      >
        <img
          src="/assets/Images/InivteOthersIcon.png"
          className="w-8 h-6"
          alt="share"
        />

        <div className="">Invite</div>
        <span className="mr-2">Others</span>
      </button>

      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={handleOnClose}>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center tablet:items-center tablet:justify-end tablet:pr-[2.88rem] laptop:justify-center laptop:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="transform overflow-hidden  rounded-2xl p-2 text-left align-middle bg-white shadow-[0px_1px_12px_0px_rgba(0,0,0,0.15)] transition-all w-full tablet:tablet:w-[66%] laptop:w-[30%] tablet:px-[1.88rem] laptop:px-[2rem]">
                  <div className="flex justify-between mb-4">
                    <Typography
                      variant="title"
                      size="medium"
                      className="py-2 mt-2"
                    >
                      Invite Members
                    </Typography>

                    <MaterialSymbol
                      icon={"cancel"}
                      className="!text-[2rem] text-[#80839F] cursor-pointer"
                      as={"div"}
                      onClick={handleOnClose}
                    />
                  </div>
                  <MemberSearch searchOnChange={setSearchText} />

                  {isLoading ? (
                    loadingWithText
                  ) : dataLength === 0 ? (
                    <div className="min-h-[15rem] flex items-center justify-center">
                      <Typography
                        variant="headline"
                        size="small"
                        className="text-secondary-light/40"
                      >
                        No Users
                      </Typography>
                    </div>
                  ) : (
                    <div className="overflow-auto py-4" id="scrollableDiv">
                      <InfiniteScroll
                        loader={loadingWithText}
                        next={fetchNextPage}
                        hasMore={hasNextPage}
                        dataLength={dataLength}
                        scrollableTarget="scrollableDiv"
                      >
                        <div className="flex flex-col gap-4">
                          {data?.pages?.map((page) => {
                            return page?.data.map?.(
                              (user: any, key: number) => (
                                <div
                                  key={key}
                                  className="flex justify-between px-4 hover:bg-gray-100 hover:rounded-md cursor-pointer"
                                  onClick={() => handleCheckboxToggle(user.id)}
                                >
                                  <div className="flex gap-x-2 items-center py-2">
                                    <Avatar
                                      image={user?.profile_image}
                                      classNameAvatarContainer="!w-[3rem] !h-[3rem]"
                                      className="!text-[1.9rem]"
                                    />
                                    <div>{user?.name}</div>
                                  </div>
                                  <input
                                    type="checkbox"
                                    checked={selectedUserIds.includes(user.id)}
                                    onChange={(e) => e.stopPropagation()} // Prevents the checkbox from toggling twice
                                  />
                                </div>
                              )
                            );
                          })}
                        </div>
                      </InfiniteScroll>
                    </div>
                  )}
                  <div className="mt-2 mb-4">
                    <Button
                      disabled={selectedUserIds.length === 0}
                      onClick={sendInvite}
                      isLoading={isPending}
                      variant="primary"
                      className="w-full !p-0 !pl-4 !pr-6 !py-[0.6rem] laptop:!flex justify-center"
                    >
                      <Typography variant="title" size="medium">
                        Send Invite
                      </Typography>
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default InviteUser;
