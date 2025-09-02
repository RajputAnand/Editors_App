import { FC, Fragment, useState } from "react";
import { MaterialSymbol } from "react-material-symbols";
import { LOGO, ProfilePopoverMenu, TITLE } from "../../../Constants/Common.ts";
import SearchInput from "../../Inputs/SearchInput/SearchInput.tsx";
import Avatar from "../../Avatar/Avatar.tsx";
import Typography from "../../Typography/Typography.tsx";
import Button from "../../Buttons/Button.tsx";
import PopoverTemplate from "../../Popover/Popover.tsx";
import { useNavigate } from "react-router-dom";
import { PathConstants } from "../../../Router/PathConstants.ts";
import NotificationCard from "../../Cards/NotificationCard.tsx";
import { Endpoints } from "../../../Api/Endpoints.ts";
import { useInfiniteQuery } from "@tanstack/react-query";
import { buildRequest } from "../../../Api/buildRequest.ts";
import { useSelector } from "react-redux";

interface IDashboardHeader {
  openMenu: () => void;
  profileIsLoading?: boolean;
  image?: string;
  searchOnChange: (value: string) => void;
  handleHashOnChange?: any;
  handleUsernameOnChange?: any;
  onLogoutClick: () => void;
  userID: number;
  adminVerified?: number;
}
// interface notificationContext{
//   addClass:boolean

// }
// const UserContext =createContext<notificationContext| undefined>(undefined)
const DashboardHeader: FC<IDashboardHeader> = (props) => {
  const { userID, adminVerified } = props;
  const navigate = useNavigate();
  const selector = useSelector((state: any) => state.AuthData);
  const handleNavigate = (path: string) => () => {
    ProfilePopoverMenu;
    navigate(path);
    if (typeof document !== 'undefined') {
      document.getElementById("profile_menu_close")?.click();
    }
  };

  const {
    openMenu,
    profileIsLoading,
    image,
    searchOnChange,
    onLogoutClick,
    handleHashOnChange,
    handleUsernameOnChange,
  } = props;

  const LIMIT_PAGINATION = 10;
  const { hasNextPage, fetchNextPage, isLoading, data, refetch } =
    useInfiniteQuery({
      queryKey: [
        Endpoints.NotificationData,
        "GET",
        { per_page: LIMIT_PAGINATION, user_id: userID },
      ],
      queryFn: (args) => buildRequest(args),
      getNextPageParam: (lastPage: any, allPages: any) => {
        return lastPage.data.length === LIMIT_PAGINATION
          ? allPages.length + 1
          : undefined;
      },
      initialPageParam: 1,
      staleTime: Infinity,
      refetchInterval:120000
    });

  const handleDelete = () => {
    if (typeof document !== 'undefined') {
      document.getElementById("profile_menu_close")?.click();
      return navigate(PathConstants.DeleteAccountMe);
    }
  };
  const renderProfileMenu = () => {
    return (
      <div className="flex flex-col gap-[1.5rem] pl-[3rem] tablet:pl-0">
        {ProfilePopoverMenu?.map((item, key) => {
          return (
            <Typography
              variant="body"
              size="large"
              key={key}
              className="cursor-pointer"
              component="div"
              nodeProps={{ onClick: handleNavigate(item?.path) }}
            >
              {item?.title}
            </Typography>
          );
        })}
        <Typography
          variant="body"
          size="large"
          className="text-red-1 cursor-pointer"
          nodeProps={{ onClick: onLogoutClick }}
        >
          Logout
        </Typography>
        {/* <a href="https://be.editorsapp.com/AccDeleteRequests"> */}
        <div
          className="flex gap-[0.52rem] text-red-1 cursor-pointer"
          onClick={handleDelete}
        >
          <MaterialSymbol
            icon="delete_outline"
            className="!text-[1.4rem] text-red-1"
          />
          <Typography
            variant="body"
            size="large"
            className="text-center text-red-1"
          >
            Delete Account
          </Typography>
        </div>
        {/* </a> */}
      </div>
    );
  };
  const [addClass, setAddclass] = useState(false);
  const handleClickClass = () => {
    setAddclass(!addClass);
  };

  const handleAddPost = () => handleNavigate(PathConstants.AddPost)();
  return (
    <Fragment>
      {/* <div className="flex flex-row items-center py-2 pl-4 pr-2 b500:px-0" id="dashboard-header"> */}
      {/* <div className=""> */}
      <MaterialSymbol
        icon={"menu"}
        onClick={openMenu}
        className="!text-[2rem] cursor-pointer p-2 text-surface-20 b500:!hidden"
        fill
        as="div"
      />
      <div
        className="flex items-center w-auto tablet:w-[30%] max-w-[18.375rem] pl-[0.5rem] pr-[1rem] cursor-pointer"
        onClick={handleNavigate(PathConstants.Home)}
      >
        <img src={LOGO} alt={TITLE} className={`w-[2rem] h-[2rem]`} />
        <Typography
          variant="title"
          size="large"
          className="text-primary-100 hidden !text-[1.2rem] min-[700px]:!text-[1.375rem] tablet:block ml-[0.62rem] text-center"
        >
          {TITLE}
        </Typography>
      </div>
      <SearchInput
        searchOnChange={searchOnChange}
        handleHashOnChange={handleHashOnChange}
        handleUsernameOnChange={handleUsernameOnChange}
        className="flex-1 mr-1"
      />
      <Button
        variant="outline"
        className="!p-0 !pl-4 !pr-6 !py-[0.5rem] !hidden laptop:!flex laptop:!ml-[5%]"
        onClick={handleAddPost}
      >
        <MaterialSymbol
          icon={"add_circle"}
          className="!text-[1.5rem] cursor-pointer text-primary !hidden b500:!inline-block"
          fill
          as={"div"}
        />
        <Typography variant="title" size="medium">
          Add post
        </Typography>
      </Button>
      <MaterialSymbol
        onClick={handleAddPost}
        icon={"add_circle"}
        className="!text-[2rem] cursor-pointer text-primary ml-4 !hidden b500:!inline-block laptop:!hidden"
        fill
        as={"div"}
      />

      <PopoverTemplate
        classNotification="pl-2"
        closeButtonId="notification_menu_close"
        button={
          <div onClick={handleClickClass}>
            <MaterialSymbol
              icon={"notifications_none"}
              className="!text-[2rem] !cursor-pointer p-2 text-surface-10 relative"
              as={"div"}
            />
            <span className="absolute -top-1 right-1 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold mt-2">
              {data?.pages[0]?.total_unread}
            </span>
          </div>
        }
        title="Notifications"
      >
        {/* {renderNotification()} */}
        {/* <UserContext.Provider value={addClass}> */}
        <NotificationCard
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          isLoading={isLoading}
          data={data}
          refetch={refetch}
          addClass={addClass}
        />
        {/* </UserContext.Provider> */}
      </PopoverTemplate>

      <PopoverTemplate
        closeButtonId="profile_menu_close"
        button={
          <div className="relative">
            <Avatar
              classNameAvatarContainer="ml-1 hidden b500:flex"
              isLoading={profileIsLoading}
              image={image}
            />
            {(selector?.isLoginAdminverifiedId === 1 ||
              adminVerified === 1) && (
                <>
                  <MaterialSymbol
                    className={`text-primary text-center !text-[1.4rem] absolute bottom-[-6px] right-0`}
                    icon={"verified"}
                    fill
                  />
                </>
              )}
          </div>
        }
        title="Profile settings"
      >
        {renderProfileMenu()}
      </PopoverTemplate>
      {/* </div> */}
    </Fragment>
  );
};

export default DashboardHeader;
