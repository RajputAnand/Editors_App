
import React, { FC, Fragment, Suspense, useEffect, useState } from "react";
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";
import DashboardMenu from "./Menu/DashboardMenu.tsx";
import { PathConstants } from "../../Router/PathConstants.ts";
interface IDashboardLayout {}

const NetworkLayout: FC<IDashboardLayout> = () => {
 
  const navigate = useNavigate();

  return (
      <React.Fragment>
        {/* {renderMobileMenu()} */}
        <div
          className="flex flex-row items-center h-[3.6rem] fixed  w-[100%]  mb-2 px-0 b500:px-4 tablet:px-[1.88rem] laptop:px-[8%]
               bg-white z-99 sm:bg-transparent !sm:z-0 !lg:z-25"
          id="headerLarge"
        >
         
        </div>
        <div className="bg-surface-1 px-0 b500:px-4 tablet:px-[1.88rem] laptop:px-[8%] flex flex-col h-full min-h-[100vh] pt-[4rem]">
          {/* <DashboardHeader onLogoutClick={handleEndModal} searchOnChange={handleSearchOnChange} profileIsLoading={isLoading} image={data?.data?.profile_image} openMenu={triggerClose}/> */}

          <div className="flex flex-row flex-grow tablet:pb-8">
          {/* // videocontainernotification"> */}
            <div className="hidden b500:block b500:w-[13%] tablet:w-[30%] max-w-[18.375rem] h-0">
              <div className="flex flex-col b500:gap-[0.5rem] b500:block tablet:hidden">
                {/* <DashboardMenu isMob={true} hideAddPost /> */}
              </div>
              <div className="flex-col b500:gap-[0.5rem] hidden tablet:flex p-3">
                {/* <DashboardMenu hideAddPost /> */}
              </div>
           
            </div>
          
          </div>
        </div>
       
        {(location.pathname === PathConstants.Live ||
          location.pathname === PathConstants.LiveNow ||
          location.pathname === PathConstants.LiveJoin ||
          location.pathname === PathConstants.AddPost ||
          location.pathname === PathConstants.EditProfile ||
          location.pathname === PathConstants.IDverification ||
          location.pathname === PathConstants.ChangePassword ||
          location.pathname === PathConstants.Settings ||
          location.pathname === PathConstants.UserView ||
          location.pathname === PathConstants.UpdatesView)}
      </React.Fragment>
  );
};

export default NetworkLayout;
