import { FC } from "react";
import { IWithRouter } from "../../../Hoc/WithRouter.tsx";
import { useGetQuery } from "../../../Api/QueryHooks/useGetQuery.tsx";
import Typography from "../../../Components/Typography/Typography.tsx";
import Loading from "../../../Components/Common/Loading.tsx";
import PostCard from "../../../Components/Cards/PostCard.tsx";
import DashboardWithSideBar from "../../../Templates/Dashboard/DashboardWithSideBar.tsx";
import { useLocation } from "react-router-dom";
import ViolatingPostCard from "../../../Components/Cards/ViolatingPostCard.tsx";

const PostViewPage: FC<IWithRouter> = (props) => {
  // document.getElementById("notification_menu_close")?.click()
  const { endpoints, params } = props;
  // const { state } = useLocation();
  const { status, post } = useLocation() as any;

  // const { status, post } = state as any; // Read values passed on state
  const { id } = params;
  const { isLoading, data } = useGetQuery({
    queryKey: [endpoints.Postview.replaceWithObject({ id: id })],
  });
  const postdata = status == 1 ? post : data?.data;
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
    if (status === 1) return <PostCard {...post} />;
    if (data?.data?.status === 0) return <ViolatingPostCard />;
    else return <PostCard {...data?.data} />;
  };

  return (
    <DashboardWithSideBar {...props} sideBar="posts">
      <div className="flex-1 grow">{renderListing()}</div>
    </DashboardWithSideBar>
  );
};

export default PostViewPage;
