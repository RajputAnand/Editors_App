import React, { FC, Fragment, Suspense, useEffect, useState } from "react";
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";
import DashboardHeader from "./Header/DashboardHeader.tsx";
import useUser from "../../Hooks/useUser.tsx";
import { Dialog, Transition } from "@headlessui/react";
import IconButton from "../Buttons/IconButton/IconButton.tsx";
import Avatar from "../Avatar/Avatar.tsx";
import DashboardMenu from "./Menu/DashboardMenu.tsx";
import useLogin from "../../Hooks/useLogin.tsx";
import PromptModal from "../Modal/PromptModal.tsx";
import Typography from "../Typography/Typography.tsx";
import { PathConstants } from "../../Router/PathConstants.ts";
import PopoverTemplate from "../Popover/Popover.tsx";
import { ProfilePopoverMenu } from "../../Constants/Common.ts";
// import AgoraRTC, { AgoraRTCProvider, useRTCClient } from "agora-rtc-react";
import { useLocation } from "react-router-dom";
import { MaterialSymbol } from "react-material-symbols";
import PublicFooter from "./Footer/PublicFooter.tsx";
import { HashTagCard } from "../Cards/HashTagCard.tsx";
import AdUnit from "../Adsense/AdUnit.tsx";

interface IDashboardLayout {}

const DashboardLayout: FC<IDashboardLayout> = () => {
  const { me } = useUser();
  const { Logout } = useLogin();
  const location = useLocation();
  const [Agora, setAgora] = useState<any>(null);

  const { data, isLoading } = me();

  const [open, setOpen] = useState(false);
  const [closeModal, setCloseModal] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [searchHashText, setSearchHashText] = useState<string>("");
  const [searchUsernameText, setSearchUsernameText] = useState<string>("");
  // const [AgoraRTC, setAgoraRTC] = useState<any>(null);
  const handleSearchOnChange = (value: string) => setSearchText(value);
  const handleHashOnChange = (value: string) => setSearchHashText(value);
  const handleUsernameOnChange = (value: string) =>
    setSearchUsernameText(value);
  const navigate = useNavigate();
  const handleNavigate = (path: string) => () => {
    navigate(path);
    if (typeof document !== "undefined") {
      document.getElementById("profile_menu_close")?.click();
    }
    triggerClose();
  };
  // useEffect(() => {
  //   // Load AgoraRTC only in client-side
  //   if (typeof window !== "undefined") {
  //     import("agora-rtc-react").then((module) => {
  //       // setAgoraRTC(module);
  //       module?.AgoraRTC?.setLogLevel(2);
  //     });
  //   }
  // }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      Promise.all([import("agora-rtc-react"), import("agora-rtc-sdk-ng")]).then(
        ([reactMod, rtcMod]) => {
          setAgora({
            AgoraRTCProvider: reactMod.AgoraRTCProvider,
            useRTCClient: reactMod.useRTCClient,
            AgoraRTC: rtcMod.default, // AgoraRTC is the default export of agora-rtc-sdk-ng
          });
        }
      );
    }
  }, []);

  if (!Agora) {
    return null;
  }

  const triggerClose = () => setOpen((_) => !_);
  const handleEndModal = () => setCloseModal((_) => !_);
  const handleDelete = () => {
    if (typeof document !== "undefined") {
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
          nodeProps={{ onClick: handleEndModal }}
        >
          Logout
        </Typography>
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
      </div>
    );
  };

  const renderMobileMenu = () => {
    return (
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setOpen}>
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="-translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="-translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                    <Transition.Child
                      as={"div"}
                      enter="ease-in-out duration-500"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-500"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    ></Transition.Child>
                    <div className="flex h-full flex-col bg-surface-1">
                      <div className="relative mt-6 flex-1 flex flex-col pl-[1.75rem] pr-[0.75rem]">
                        <div className="flex justify-between items-center pr-[1rem] pl-[0.5rem] pb-[2rem]">
                          <IconButton Icon={"close"} onClick={triggerClose} />
                          <PopoverTemplate
                            closeButtonId={"profile_menu_close"}
                            button={
                              <Avatar
                                isLoading={isLoading}
                                image={data?.data?.profile_image}
                              />
                            }
                            title="Profile settings"
                          >
                            {renderProfileMenu()}
                          </PopoverTemplate>
                        </div>
                        <DashboardMenu onClickClose={triggerClose} />
                        {/* mobile */}

                        <HashTagCard
                          searchText={searchText}
                          searchHashText={searchHashText}
                          searchUsernameText={searchUsernameText}
                          handleUsernameOnChange={handleUsernameOnChange}
                          handleHashOnChange={handleHashOnChange}
                        />
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    );
  };
  // AgoraRTC.setLogLevel(2);
  // const agoraEngine = useRTCClient(
  // AgoraRTC.createClient({ codec: "vp8", mode: "live" })
  // );
  // const agoraEngine = AgoraRTC
  //   ? useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "live" }) as any)
  //   : null;

  // if (!agoraEngine) {
  //   return null;
  // }

  if (!Agora) return null;

  const client = Agora.useRTCClient(
    Agora.AgoraRTC.createClient({ codec: "vp8", mode: "live" })
  );

  return (
    <Agora.AgoraRTCProvider client={client}>
      <React.Fragment>
        {renderMobileMenu()}
        <div
          className="flex flex-row items-center h-[3.6rem] fixed  w-[100%]  mb-2 px-0 b500:px-4 tablet:px-[1.88rem] laptop:px-[8%]
               bg-white z-40 sm:bg-transparent !lg:z-25"
          id="headerLarge"
        >
          <DashboardHeader
            onLogoutClick={handleEndModal}
            searchOnChange={handleSearchOnChange}
            handleHashOnChange={handleHashOnChange}
            handleUsernameOnChange={handleUsernameOnChange}
            profileIsLoading={isLoading}
            image={data?.data?.profile_image}
            openMenu={triggerClose}
            userID={data?.data?.id}
            adminVerified={data?.data?.is_admin_verified}
          />
        </div>
        <div className="bg-surface-1 px-0 b500:px-4 tablet:px-[1.88rem] laptop:px-[8%] flex flex-col h-full min-h-[100vh] pt-[4rem]">
          {/* <DashboardHeader onLogoutClick={handleEndModal} searchOnChange={handleSearchOnChange} profileIsLoading={isLoading} image={data?.data?.profile_image} openMenu={triggerClose}/> */}
          <div className="my-0">
            {/* <AdUnit slot="6300978111" /> */}
            <div className="my-4">
              <AdUnit slot="1234567890" format="auto" />
            </div>
          </div>
          <div className="flex flex-row flex-grow tablet:pb-8">
            {/* // videocontainernotification"> */}
            <div className="hidden b500:block b500:w-[13%] tablet:w-[30%] max-w-[18.375rem] h-0">
              <div className="flex flex-col b500:gap-[0.5rem] b500:block tablet:hidden">
                <DashboardMenu isMob={true} hideAddPost />
              </div>
              <div className="flex-col b500:gap-[0.5rem] hidden tablet:flex p-3">
                <DashboardMenu hideAddPost />
              </div>
              <div>
                <HashTagCard
                  handleHashOnChange={handleHashOnChange}
                  handleUsernameOnChange={handleUsernameOnChange}
                  searchHashText={searchHashText}
                  searchText={searchText}
                  searchUsernameText={searchUsernameText}
                  className={"hidden tablet:flex p-3"}
                />
              </div>
              <div className="my-4">
                <AdUnit
                  slot="1234567890"
                  format="auto"
                  // maxWidth={90} // e.g., leaderboard
                />
              </div>
            </div>
            <Suspense fallback={<>Loading</>}>
              <Outlet
                context={{
                  searchText: searchText,
                  searchHashText: searchHashText,
                  searchUsernameText: searchUsernameText,
                }}
              />
            </Suspense>
          </div>
        </div>
        <PromptModal
          isOpen={closeModal}
          closeModal={handleEndModal}
          onClickYes={() => Logout(PathConstants.SingIn)}
        >
          <div className="pb-6 flex items-center justify-center">
            <Typography variant="body" size="large" className="text-black">
              Are you sure you want to logout?
            </Typography>
          </div>
        </PromptModal>
        {(location.pathname === PathConstants.Live ||
          location.pathname === PathConstants.LiveNow ||
          location.pathname === PathConstants.LiveJoin ||
          location.pathname === PathConstants.AddPost ||
          location.pathname === PathConstants.EditProfile ||
          location.pathname === PathConstants.IDverification ||
          location.pathname === PathConstants.ChangePassword ||
          location.pathname === PathConstants.Settings ||
          location.pathname === PathConstants.UserView ||
          location.pathname === PathConstants.UpdatesView) && <PublicFooter />}
      </React.Fragment>
    </Agora.AgoraRTCProvider>
  );
};

export default DashboardLayout;
