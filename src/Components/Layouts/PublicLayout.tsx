import { FC, Suspense } from "react";
import { Outlet } from "react-router-dom";
import PublicHeader from "./Header/PublicHeader.tsx";
import PublicFooter from "./Footer/PublicFooter.tsx";
import Button from "../Buttons/Button.tsx";
import { PLAY_STORE_APP_LINK } from "../../Constants/Common.ts";

export interface IPublicLayout {
    isOnboarding?: boolean,
    className?: string,
    showInstallApp?: boolean
}

const PublicLayout: FC<IPublicLayout> = (props) => {
    const { isOnboarding, className, showInstallApp } = props

    const handleAppOpen = () => {
        return window.open(PLAY_STORE_APP_LINK, "_blank");
    }

    const renderInstallButton = () => {
        if (!showInstallApp) return <></>
        return (
            <div className="w-[80%] mx-auto mt-4 laptop:hidden">
                <Button className="w-full" onClick={handleAppOpen}>Get the app</Button>
            </div>
        )
    }

    return (
        <div id="publicLayout" className={`${isOnboarding ? "bg-white tablet:bg-surface" : ""} flex flex-col h-[100vh] ${className}`}>
            <PublicHeader {...props} />
            {renderInstallButton()}
            <Suspense fallback={<>Loading</>}>
                <Outlet />
            </Suspense>
            {/* { !isOnboarding && <PublicFooter {...props}/> } */}
            <PublicFooter {...props} />
        </div>
    )
}

export default PublicLayout;
