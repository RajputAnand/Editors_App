import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import { Endpoints } from "../../Api/Endpoints";
import { buildRequest } from "../../Api/buildRequest";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../Common/Loading";
import Typography from "../Typography/Typography";
import { AxiosResponse } from "axios";
import FeedCard from "../Cards/FeedCard";

const NetworkFeeds: React.FC = () => {
  const LIMIT_PAGINATION = 10;
  const filterResponse = (data: AxiosResponse<any>) => {
    const res = data?.data;

    return {
      ...res,
      posts: res?.data?.filter((_: any) => _),
      updates: res?.data?.filter((_: any) => _?.video?.length !== 0),
    };
  };

  const { hasNextPage, fetchNextPage, isLoading, data, error } =
    useInfiniteQuery({
      queryKey: [
        Endpoints.NetworkFeedPosts,
        "GET",
        {
          per_page: LIMIT_PAGINATION,
          hide_private_not_joined_network_posts: 1,
        },
      ],
      queryFn: (args) => buildRequest(args, filterResponse),
      getNextPageParam: (lastPage: any, allPages: any) => {
        return lastPage.data.length === 10 ? allPages.length + 1 : undefined;
      },
      initialPageParam: 1,
      staleTime: Infinity,
    });    

  const dataLength =
    data?.pages.reduce((counter, page) => counter + page?.data.length, 0) ?? 0;

  const loadingWithText = (
    <div className="flex items-center gap-1 w-full justify-center my-8">
      <Loading iconClassName="!w-[2rem] !h-[2rem]" />
      <Typography variant="title" size="large">
        Loading
      </Typography>
    </div>
  );
  const renderListing = () => {
    if (isLoading) return loadingWithText;

    if (error)
      return (
        <Typography
          variant="body"
          size="large"
          className="flex justify-center flex-wrap"
        >
          Something went wrong
        </Typography>
      );

    if (dataLength === 0)
      return (
        <Typography
          variant="body"
          size="large"
          className="flex justify-center flex-wrap"
        >
          No Posts
        </Typography>
      );
    return (
      <InfiniteScroll
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={loadingWithText}
        dataLength={dataLength}
        className="flex flex-col gap-[1rem]"
      >
        {data?.pages?.map((page) => {
          return page.posts?.map?.((item: any, key: number) => {
            return (
              <React.Fragment key={key}>
                <FeedCard
                  {...item}
                  key={key}
                  showGroupName={true}
                  reFetchHomepageData={fetchNextPage}
                />
              </React.Fragment>
            );
          });
        })}
      </InfiniteScroll>
    );
  };

  return (
    <div className="px-2">
      <div className="sticky top-0 bg-[#ffff] pt-[20px] pb-[27px] w-full laptop:top-[50px] left-0 z-[10]">
        <h3 className="text-xl font-semibold px-4 text-[1rem] text-[#0E0E0E]">
          Your feeds
        </h3>
      </div>
      {renderListing()}
    </div>
  );
};

export default NetworkFeeds;
