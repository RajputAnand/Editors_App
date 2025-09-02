import React, { FC, useState } from "react";
import { IWithRouter } from "../../../Hoc/WithRouter.tsx";
import DashboardWithSideBar from "../../../Templates/Dashboard/DashboardWithSideBar.tsx";
import ProfileCard from "../../../Components/Cards/ProfileCard.tsx";
import { useGetQuery } from "../../../Api/QueryHooks/useGetQuery.tsx";
import Loading from "../../../Components/Common/Loading.tsx";
import Typography from "../../../Components/Typography/Typography.tsx";
import ListPosts from "./Components/ListPosts.tsx";
import ListFollowing from "./Components/ListFollowing.tsx";
import ListNetwork from "./Components/ListNetwork.tsx";
import UserSeo from "../../../Components/Helmet/UserSeo.tsx";

export type TScreens = "Posts" | "Admiring" | "Admirers" | "Network" | "Message";
const MePage: FC<IWithRouter> = (props) => {
  if (typeof document !== 'undefined') {
    document.title = "Profile | EditorsApp";
  }

  const { endpoints, location, paths, params } = props;
  const { username } = params;
  const isMe = location.pathname == paths.Profile;
  const [screen, setScreen] = useState<TScreens>("Posts");
  const {
    isLoading,
    data,
    refetch: reFetchMe,
  } = useGetQuery({
    queryKey: [
      isMe
        ? endpoints.Me
        : endpoints.UserView.replaceWithObject({ username: username }),
      "GET",
    ],
    staleTime: Infinity,
    refetchInterval: 5000,
  });
  const {
    isLoading: profileLoading,
    data: profileData,
    refetch: reFetchProfileData,
  } = useGetQuery({ queryKey: [endpoints.Me, "GET"], staleTime: Infinity });

  const loadingWithText = (
    <div className="flex items-center gap-1 w-full justify-center my-8">
      <Loading iconClassName="!w-[2rem] !h-[2rem]" />
      <Typography variant="title" size="large">
        Loading
      </Typography>
    </div>
  );

  const handleScreen = (action: TScreens) => {
    return setScreen(action);
  };

  const renderListing = () => {
    if (isLoading || profileLoading) return loadingWithText;

    const renderScreen = () => {
      switch (screen) {
        case "Posts":
          return (
            <ListPosts
              {...props}
              reFetchProfileData={reFetchProfileData}
              isMe={profileData?.data?.id === data?.data?.id}
              user_id={data?.data?.id}
              profileId={data?.data?.id}
            />
          );

        case "Admirers":
          return (
            <ListFollowing
              {...props}
              reFetchProfileData={reFetchProfileData}
              currentUserid={profileData?.data?.id}
              id={data?.data?.id}
            />
          );
        case "Admiring":
          return (
            <ListFollowing
              {...props}
              reFetchProfileData={reFetchProfileData}
              currentUserid={profileData?.data?.id}
              id={data?.data?.id}
              isFollowing
            />
          );
        case "Network":
          return (
            <ListNetwork
              {...props}
              id={data?.data?.id}
            />
          )
      }
    };
    return (
      <React.Fragment>
        <ProfileCard
          {...data?.data}
          reFetchProfileData={reFetchMe}
          screen={screen}
          handleScreen={handleScreen}
          isMe={profileData?.data?.id === data?.data?.id}
          currentUserId={profileData?.data?.id}
        />
        {renderScreen()}
      </React.Fragment>
    );
  };

  return (
    <>
      <UserSeo data={data} />
      <DashboardWithSideBar {...props} sideBar="find_people">
        <div className="flex-1 grow videocontainernotification">
          {renderListing()}
        </div>
      </DashboardWithSideBar>
    </>
  );
};

export default MePage;
