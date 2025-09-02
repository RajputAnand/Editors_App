import { FC, Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Typography from "../../Typography/Typography.tsx";
import { MaterialSymbol } from "react-material-symbols";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Endpoints } from "../../../Api/Endpoints.ts";
import { buildRequest } from "../../../Api/buildRequest.ts";
import CommentCard from "../../Cards/CommentCard.tsx";
import MoreComment from "../../Common/MoreComment.tsx";
import Avatar from "../../Avatar/Avatar.tsx";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../../Common/Loading.tsx";
import { useMutationQuery } from "../../../Api/QueryHooks/useMutationQuery.tsx";
import { Controller, useForm } from "react-hook-form";
import useUser from "../../../Hooks/useUser.tsx";
import toast from "react-hot-toast";

interface IPostCommentModal {
  open: boolean;
  handle: () => void;
  post_id: string;
  onClose?: () => void;
  usePublic?: boolean;
  networkGroupId?: number;
}

const PostNetworkCommentModal: FC<IPostCommentModal> = (props) => {
  const { open, handle, post_id, onClose, usePublic, networkGroupId } = props;
  const { me } = useUser();
  const { data: meData, isLoading: meIsLoading } = me();
  const LIMIT_PAGINATION = 10;
  const [seeMore, setSeeMore] = useState<boolean>(false);
  const post_endpoint = Endpoints.NetworkFeedPosts;
  const { fetchNextPage, isLoading, hasNextPage, data, refetch, isRefetching } =
    useInfiniteQuery({
      queryKey: [
        post_endpoint,
        "GET",
        { per_page: LIMIT_PAGINATION, replied_to: post_id, title: "comment" },
      ],
      queryFn: (args) => buildRequest(args),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (!seeMore) return undefined;
        return lastPage.data.length === LIMIT_PAGINATION
          ? allPages.length + 1
          : undefined;
      },
      staleTime: Infinity,
      refetchOnMount: "always",
      refetchOnWindowFocus: "always",
    });

  const handleOnClose = () => {
    handle();
    if (onClose) onClose();
  };

  const { handleSubmit, control, resetField } = useForm();
  const { mutate, isPending } = useMutationQuery(
    {
      mutationKey: [Endpoints.AddNetworkPostComment, "POST"],
      onSuccess: () => {
        resetField("text");
        refetch().then(() => null);
      },
    },
    true
  );

  const onSubmit = (data: any) => {
    if (data.text === undefined)
      return toast.error("Please enter your comment");
    return mutate({
      ...data,
      title: "Comment",
      location: "",
      hashtags: "",
      link: "",
      image: [],
      video: [],
      audio: [],
      choice: "Text",
      replied_to: post_id,
      network_group_id: networkGroupId,
      repost_by: meData?.data?.id,
    });
  };

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-[1.25rem]">
        <Typography
          variant={"title"}
          size={"medium"}
          className="!text-[1.25rem] !font-medium !leading-[1.89669rem] text-secondary-light"
        >
          Remarks
        </Typography>
        <MaterialSymbol
          icon={"close"}
          fill
          className="!text-[2rem] text-surface-20 cursor-pointer"
          as={"div"}
          onClick={handleOnClose}
        />
      </div>
    );
  };

  const handleClickSeeMore = () => setSeeMore((_) => !_);

  const renderListing = () => {
    const loadingWithText = (
      <div className="flex items-center gap-1 w-full justify-center my-8">
        <Loading iconClassName="!w-[2rem] !h-[2rem]" />
        <Typography variant="title" size="large">
          Loading
        </Typography>
      </div>
    );

    if (isLoading || meIsLoading || isRefetching) return loadingWithText;
    const dataLength =
      data?.pages.reduce((counter, page) => counter + page?.data.length, 0) ??
      0;
    if (dataLength === 0)
      return (
        <div className="min-h-[15rem] flex items-center justify-center">
          <Typography
            variant="headline"
            size="small"
            className="text-secondary-light/40"
          >
            No remarks yet
          </Typography>
        </div>
      );
    return (
      <InfiniteScroll
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={loadingWithText}
        dataLength={dataLength ?? 0}
        className="flex flex-col gap-4"
      >
        {data?.pages?.map((page) => {
          return page?.data
            ?.slice(0, !seeMore ? 2 : LIMIT_PAGINATION)
            .map?.((item: any, key: number) => (
              <CommentCard
                usePublic={usePublic}
                refetch={refetch}
                {...item}
                key={key}
                networkGroupId={networkGroupId}
                type="networkCommentCard"
              />
            ));
        })}
        {!seeMore && dataLength > 2 && (
          <MoreComment onClick={handleClickSeeMore} />
        )}
      </InfiniteScroll>
    );
  };

  const renderCommentInput = () => {
    if (usePublic) return <></>;
    const renderSubmitButton = () => {
      if (isPending)
        return <Loading className="px-3" iconClassName="w-[2rem] h-[2rem]" />;
      return (
        <MaterialSymbol
          onClick={handleSubmit(onSubmit)}
          icon={"send"}
          className="text-surface-20 !text-[2rem] px-3 cursor-pointer"
          as={"div"}
        />
      );
    };

    return (
      <div className="w-full flex items-center gap-2 mt-4">
        <Avatar image={meData?.data?.profile_image} />
        <div className="flex-1 flex items-center bg-primary-95 rounded-[0.25rem] py-2">
          <Controller
            control={control}
            render={({ field }) => {
              return (
                <input
                  required
                  type="text"
                  className="bg-transparent outline-none w-full min-h-[2.5rem] text-base placeholder:text-surface-20"
                  placeholder="Post your reply..."
                  value={field.value || ""}
                  onChange={field.onChange}
                  name={field.name}
                />
              );
            }}
            name={"text"}
          />
          {renderSubmitButton()}
        </div>
      </div>
    );
  };

  return (
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
              <Dialog.Panel className="transform overflow-hidden rounded-2xl p-4 text-left align-middle bg-white shadow-[0px_1px_12px_0px_rgba(0,0,0,0.15)] transition-all w-full tablet:tablet:w-[66%] laptop:w-[43%] tablet:px-[1.88rem] laptop:px-[2rem]">
                {renderHeader()}
                {renderListing()}
                {!usePublic && renderCommentInput()}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PostNetworkCommentModal;
