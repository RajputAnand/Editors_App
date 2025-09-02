import React, { FC, useState } from "react";
import { IDashboardWithSideBar } from "../DashboardWithSideBar.tsx";
import Typography from "../../../Components/Typography/Typography.tsx";
import RecentPostCard from "../../../Components/Cards/RecentPostCard.tsx";
import UpdatesPostCard from "../../../Components/Cards/UpdatesPostCard.tsx";
import Loading from "../../../Components/Common/Loading.tsx";
import { useGetQuery } from "../../../Api/QueryHooks/useGetQuery.tsx";
import { PathConstants } from "../../../Router/PathConstants.ts";
import FooterCard from "../../../Components/Cards/FooterCard.tsx";

const PostSideBar: FC<IDashboardWithSideBar> = (props) => {
  const { endpoints, navigatePage } = props;
  const [seeMore, setSeeMore] = useState<boolean>(false);

  const { data: recentPostsData, isLoading: recentPostsIsLoading } =
    useGetQuery({ queryKey: [endpoints.RecentPosts, "GET"] });
  

  const loadingWithText = (
    <div className="flex items-center gap-1 w-full justify-center my-8">
      <Loading iconClassName="!w-[2rem] !h-[2rem]" />
      <Typography variant="title" size="large">
        Loading
      </Typography>
    </div>
  );
  const handleSeeMore = () => setSeeMore((_) => !_);
  const renderRecentPosts = () => {
    if (recentPostsIsLoading) return loadingWithText;
    return (
      <React.Fragment>
        <div className="flex flex-wrap gap-4">
          {recentPostsData?.data &&
            recentPostsData?.data
              ?.slice?.(0, seeMore ? 4 : 2)
              ?.map((item: any, key: number) => {
                if (String(item?.choice).toLowerCase() != "video")
                  return (
                    <RecentPostCard
                      id={item?.id}
                      title={item.title}
                      text={item?.text}
                      image={item?.image}
                      key={key}
                      profileDetails={item?.user}
                    />
                  );
                return (
                  <UpdatesPostCard
                    onClick={()=>navigatePage(
                      PathConstants.UpdatesView.replaceWithObject({
                        id: item?.id,
                      })
                    )}
                    key={key}
                    className="mb-4 !max-w-none !h-[25vw]"
                    profileDetails={item?.user}
                    title={item.title}
                    video={item?.video}
                  />
                );
              })}
        </div>
        {recentPostsData?.data &&
          recentPostsData?.data?.length > 2 &&
          !seeMore && (
            <div className="my-4 flex items-center justify-end">
              <Typography
                variant="body"
                size="medium"
                className="text-primary cursor-pointer"
                nodeProps={{ onClick: handleSeeMore }}
              >
                See more
              </Typography>
            </div>
          )}
      </React.Fragment>
    );
  };

  return (
    <>
      <div className="hidden laptop:block w-[20%] pl-[1.5rem] relative">
        <div
          className="w-[100%] custom-scrollbar"
          style={{ overflow: "auto", scrollBehavior: "smooth" }}
        >
          <Typography variant="title" size="large" className="!font-medium">
            Recent updates
          </Typography>
          {renderRecentPosts()}
        </div>
        <Typography variant="title" size="large" className="!font-medium left-0 top-[70px] sticky ">
          <FooterCard />
        </Typography>
      </div>
    </>

    //   <div className="hidden laptop:block w-[20%] pl-[1.5rem]">
    //   <Typography variant="title" size="large" className="!font-medium">
    //     Recent updates
    //   </Typography>
    //   {renderRecentPosts()}
    // </div>
  );
};

export default PostSideBar;
