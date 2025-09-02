import { IWithRouter } from "../../../Hoc/WithRouter.tsx";
import React, { FC } from "react";
import PostCard from "../../../Components/Cards/PostCard.tsx";
import Typography from "../../../Components/Typography/Typography.tsx";
import { useInfiniteQuery } from "@tanstack/react-query";
import { buildRequest } from "../../../Api/buildRequest.ts";
import Loading from "../../../Components/Common/Loading.tsx";
import InfiniteScroll from "react-infinite-scroll-component";
import { AxiosResponse } from "axios";
import UpdatesCard from "../../../Components/Cards/UpdatesCard.tsx";
import { useOutletContext, useParams } from "react-router-dom";
import DashboardWithSideBar from "../../../Templates/Dashboard/DashboardWithSideBar.tsx";
import FeedCard from "../../../Components/Cards/FeedCard.tsx";

const HomePage: FC<IWithRouter> = (props) => {
    if (typeof document !== 'undefined') {
        document.title = "Home | EditorsApp"
    }
    const { endpoints, params } = props;
    const { id, hashtag } = params;
    const LIMIT_PAGINATION = 10;
    const { searchText, searchHashText, searchUsernameText } = useOutletContext<{
        searchText: string, searchHashText: string,
        searchUsernameText: string
    }>();
    const headerparam = useParams();

    const filterResponse = (data: AxiosResponse<any>) => {
        const res = data?.data;
        return {
            ...res,
            posts: res?.data?.filter((_: any) => _),
            updates: res?.data?.filter((_: any) => _?.video?.length !== 0)
        }
    }

    const { hasNextPage, fetchNextPage, isLoading, data } = useInfiniteQuery({
        queryKey: [endpoints.FeedPosts, "GET", {
            per_page: LIMIT_PAGINATION, name: searchText, id: id, hashtags: searchHashText ? searchHashText : headerparam?.hashtag,
            username: searchUsernameText?.replace("@", "")
        }],
        queryFn: (args) => buildRequest(args, filterResponse),
        getNextPageParam: (lastPage: any, allPages: any) => {
            return lastPage.data.length === LIMIT_PAGINATION ? allPages.length + 1 : undefined;
        },
        initialPageParam: 1,
        staleTime: Infinity,
    })
    const { hasNextPage: _hasNextPage, fetchNextPage: _fetchNextPage, data: Pinpost } = useInfiniteQuery({
        queryKey: [endpoints.FeedPosts, "GET", {
            per_page: LIMIT_PAGINATION, show_pinned_post_only: 1
        }],
        queryFn: (args) => buildRequest(args, filterResponse),
        getNextPageParam: (lastPage: any, allPages: any) => {
            return lastPage.data.length === LIMIT_PAGINATION ? allPages.length + 1 : undefined;
        },
        initialPageParam: 1,
        staleTime: Infinity,
    });

    const loadingWithText = (
        <div className="flex items-center gap-1 w-full justify-center my-8">
            <Loading iconClassName="!w-[2rem] !h-[2rem]" />
            <Typography variant="title" size="large">Loading...</Typography>
        </div>
    )
    const renderNoElementsFound = () => {
        return (
            <div className="flex items-center gap-1 w-full justify-center my-8">
                <Typography
                    variant="headline"
                    size="medium"
                    className="!font-bold text-secondary-light"
                >
                    No Items Found
                </Typography>
            </div>
        )
    }
    const renderListingPinngpost = () => {
        const dataLength = data?.pages.reduce((counter, page) => counter + page?.data.length, 0) ?? 0;
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
                    {
                        Pinpost?.pages?.map((page) => {
                            return page.posts?.map?.((item: any, key: number) => {
                                return (
                                    <React.Fragment key={key}>
                                        <PostCard {...item} key={key}
                                            reFetchHomepageData={_fetchNextPage}
                                        />
                                        {key == 0 && page?.updates?.length !== 0 &&
                                            <UpdatesCard key={`k_${key}`}
                                                video={page?.updates}
                                            //   video={page?.updates?.slice(0, 2)}
                                            />
                                        }
                                    </React.Fragment>
                                )
                            })
                        })
                    }
                </InfiniteScroll>
            </div>
        )
    }

    const renderListing = () => {
        if (isLoading) return loadingWithText;
        const dataLength = data?.pages.reduce((counter, page) => counter + page?.data.length, 0) ?? 0;
        return (
            <InfiniteScroll
                next={fetchNextPage}
                hasMore={hasNextPage}
                loader={loadingWithText}
                dataLength={dataLength}
                className="flex flex-col gap-[1rem]"
            >
                {
                    data?.pages?.map((page) => {
                        if (page?.posts?.length > 0) {
                            return page.posts?.map?.((item: any, key: number) => {
                                return (
                                    <React.Fragment key={key}>
                                        {item.network_group ?
                                        <FeedCard 
                                        {...item} 
                                        key={key}
                                        showGroupName={true} 
                                        home
                                        />
                                        :
                                        <PostCard {...item} key={key}
                                            reFetchHomepageData={fetchNextPage}
                                        />
                                        }
                                        {key == 0 && page?.updates?.length !== 0 &&
                                            <UpdatesCard key={`k_${key}`}
                                                //  video={page?.updates?.slice(0, 2)}
                                                video={page?.updates}
                                            />
                                        }
                                    </React.Fragment>
                                )
                            })
                        }
                        return renderNoElementsFound()
                    })
                }
            </InfiniteScroll>
        )
    }


    return (
        <DashboardWithSideBar {...props} sideBar={"posts"}>
            <div className="flex-1 grow videocontainernotification">
                {renderListingPinngpost()}
                {renderListing()}
            </div>
        </DashboardWithSideBar>
    )
}

export default HomePage