import React, { FC } from "react";
import { IWithRouter } from "../../../../Hoc/WithRouter.tsx";
import { AxiosResponse } from "axios";
import {
  QueryObserverResult,
  RefetchOptions,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { buildRequest } from "../../../../Api/buildRequest.ts";
import Loading from "../../../../Components/Common/Loading.tsx";
import Typography from "../../../../Components/Typography/Typography.tsx";
import InfiniteScroll from "react-infinite-scroll-component";
import PostCard from "../../../../Components/Cards/PostCard.tsx";
import UpdatesCard from "../../../../Components/Cards/UpdatesCard.tsx";
import { useParams } from "react-router-dom";

interface IListPost extends IWithRouter {
  user_id: string;
  isMe?: boolean;
  profileId?: number;
  reFetchProfileData: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<any, any>>;
}

const ListPosts: FC<IListPost> = (props) => {
  const LIMIT_PAGINATION = 10;
  let { location } = useParams();

  const { user_id, endpoints, isMe, reFetchProfileData, profileId } = props;

  const filterResponse = (data: AxiosResponse<any>) => {
    const res = data?.data;
    return {
      ...res,
      posts: res?.data?.filter((_: any) => _),
      updates: res?.data?.filter((_: any) => _?.video?.length !== 0),
    };
  };

  const {
    hasNextPage,
    fetchNextPage,
    isLoading,
    data,
    refetch: profileDataOnly,
  } = useInfiniteQuery({
    queryKey: [
      endpoints.FeedPosts,
      "GET",
      {
        per_page: LIMIT_PAGINATION,
        user_id: user_id,
        hashtags: "",
        show_tagged_network_post: 1,
      },
    ],
    queryFn: (args) => buildRequest(args, filterResponse),
    getNextPageParam: (lastPage: any, allPages: any) => {
      return lastPage.data.length === LIMIT_PAGINATION
        ? allPages.length + 1
        : undefined;
    },
    initialPageParam: 1,
  });
  const {
    hasNextPage: _hasNextPage,
    fetchNextPage: _fetchNextPage,
    isLoading: _isLoading,
    data: Pinpost,
  } = useInfiniteQuery({
    queryKey: [
      endpoints.FeedPosts,
      "GET",
      {
        per_page: LIMIT_PAGINATION,
        show_pinned_post_only: 1,
        user_id: profileId,
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

  const handleOnDeleteSuccess = () => {
    reFetchProfileData().then((r) => r);
    window.location.reload();
  };

  const loadingWithText = (
    <div className="flex items-center gap-1 w-full justify-center my-8">
      <Loading iconClassName="!w-[2rem] !h-[2rem]" />
      <Typography variant="title" size="large">
        Loading
      </Typography>
    </div>
  );

  if (isLoading) return loadingWithText;

  const dataLength =
    data?.pages.reduce((counter, page) => counter + page?.data.length, 0) ?? 0;

  if (dataLength == 0)
    return (
      <div className="flex items-center flex-col mt-8">
        <Typography
          variant="headline"
          size="medium"
          className="!font-bold text-secondary-light"
        >
          No Posts Yet
        </Typography>
        <Typography variant="body" size="medium" className="text-outline">
          Looks like this person hasn't posted anything yet.
        </Typography>
      </div>
    );
  const renderListingPinngpost = () => {
    const dataLength =
      data?.pages.reduce((counter, page) => counter + page?.data.length, 0) ??
      0;
    return (
      <div id="homescrollableDiv">
        <InfiniteScroll
          next={_fetchNextPage}
          hasMore={_hasNextPage}
          loader={""}
          dataLength={dataLength}
          className="flex flex-col gap-[1rem]"
          scrollableTarget="homescrollableDiv"
        >
          {Pinpost?.pages?.map((page) => {
            return page.posts?.map?.((item: any, key: number) => {
              return (
                <React.Fragment key={key}>
                  <PostCard
                    {...item}
                    key={key}
                    reFetchHomepageData={fetchNextPage}
                    profileDataOnly={profileDataOnly}
                  />
                  {key == 0 && page?.updates?.length !== 0 && (
                    <UpdatesCard
                      key={`k_${key}`}
                      video={page?.updates?.slice(0, 2)}
                    />
                  )}
                </React.Fragment>
              );
            });
          })}
        </InfiniteScroll>
      </div>
    );
  };

  return (
    <>
      {renderListingPinngpost()}

      <InfiniteScroll
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={loadingWithText}
        dataLength={dataLength}
        className="flex flex-col gap-[1rem] mt-4"
      >
        {data?.pages?.map((page) => {
          return page.posts?.map?.((item: any, key: number) => (
            <React.Fragment key={key}>
              <PostCard
                isMe={isMe}
                {...item}
                key={key}
                onDeleteSuccess={handleOnDeleteSuccess}
              />
              {key == 0 && page?.updates?.length !== 0 && (
                <UpdatesCard
                  key={`k_${key}`}
                  video={page?.updates?.slice(0, 2)}
                />
              )}
            </React.Fragment>
          ));
        })}
      </InfiniteScroll>
    </>
  );
};

export default ListPosts;
