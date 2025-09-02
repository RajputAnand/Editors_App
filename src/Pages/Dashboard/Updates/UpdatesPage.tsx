import {IWithRouter} from "../../../Hoc/WithRouter.tsx";
import {FC, useRef} from "react";
import Loading from "../../../Components/Common/Loading.tsx";
import {AxiosResponse} from "axios";
import {Swiper, SwiperSlide} from "swiper/react";
import 'swiper/css';
import UpdatesPostVideoCard from "../../../Components/Cards/UpdatesPostVideoCard.tsx";
import type {Swiper as SwiperClass} from "swiper/types";
import {useInfiniteQuery} from "@tanstack/react-query";
import {buildRequest} from "../../../Api/buildRequest.ts";
import { Mousewheel, FreeMode, Keyboard } from 'swiper/modules';
import DashboardWithSideBar from "../../../Templates/Dashboard/DashboardWithSideBar.tsx";
import toast from "react-hot-toast";

const UpdatesPage:FC<IWithRouter> = (props) => {
    if (typeof document !== 'undefined') {
        document.title = "Updates | EditorsApp"
    }
    const {endpoints,params} = props
    const { hashtag} = params
    const videoRef = useRef<Array<HTMLVideoElement>>([]);

    const LIMIT_PAGINATION = 20;

    const filterResponse = (data: AxiosResponse) => {
        return {
            ...data?.data,
            allData: data?.data?.data,
            data: data?.data?.data?.filter((_: any) => _?.video?.length != 0)
        }
    }


    const { hasNextPage, fetchNextPage, isLoading: isLoadingFeedPost , data: feedData} = useInfiniteQuery({
        queryKey: [endpoints.FeedPosts,"GET",{ per_page: LIMIT_PAGINATION,hashtags:"" }],
        queryFn: (args) => buildRequest(args, filterResponse),
        getNextPageParam: (lastPage: any, allPages: any) => {
            return lastPage.allData.length === LIMIT_PAGINATION ? allPages.length + 1 : undefined;
        },
        initialPageParam: 1,
        retry: false
    })

    const handleOnChangeIndex = async (swiper: SwiperClass) => {
        const previousVideo = videoRef.current[swiper.previousIndex]
        const currentVideo = videoRef.current[swiper.activeIndex]
        if (previousVideo) {
            previousVideo.pause()
        }
        try {
            currentVideo.currentTime = 0;
            currentVideo.muted = false
        } catch (e) {
            console.error("Error handling video ref:", e);
        }

    }

    const handleOnReachEnd = (swiper: SwiperClass) => {
        if (swiper.isEnd && hasNextPage)
            // return fetchNextPage()
             {
          toast.promise(fetchNextPage(), { loading: "Loading", success: "Loaded", error: "Loading failed" }).then(r => r)
        }
    }

    const renderUpdatesListing = () => {
        if (isLoadingFeedPost) return <Loading className="w-full h-full flex items-center justify-center"/>
        return (
            <Swiper
                direction="vertical"
                className="!h-[calc(100%_-_3.5rem)]"
                wrapperClass="items-center"
                slidesPerView={1}
                mousewheel={{ releaseOnEdges: true }}
                scrollbar={{ draggable: true }}
                keyboard={{ enabled: true }}
                onReachEnd={handleOnReachEnd}
                modules={[Mousewheel, FreeMode, Keyboard]}
                onActiveIndexChange={handleOnChangeIndex}
            >
                {
                    feedData?.pages.map((page, keyPage) => {
                        return page?.data?.map((video: any, key: number) => {
                            return (
                                <SwiperSlide className={"!h-[100%] tablet:rounded-2xl overflow-hidden"} key={`${key}_${keyPage}`}>
                                    {({isActive}) => (isActive) && <UpdatesPostVideoCard videoRef={videoRef} src={video.video?.[0]} index={video.id} {...video}/>}
                                </SwiperSlide>
                            )
                        })
                    })
                }
            </Swiper>
        )
    }

    return (
        <DashboardWithSideBar sideBar={"find_people"} {...props}>
            <div className="flex-1 flex tablet:items-center tablet:justify-center grow bg-white tablet:rounded-t-[0.75rem] mx-auto videocontainernotification">
                {renderUpdatesListing()}
            </div>

        </DashboardWithSideBar>
)
}

export default UpdatesPage