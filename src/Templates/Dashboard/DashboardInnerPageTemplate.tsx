import {FC, PropsWithChildren} from "react";
import NavigationBar, {INavigationBar} from "../../Components/NavigationBar/NavigationBar.tsx";

interface IDashboardInnerPageTemplate extends PropsWithChildren {
    isMobFullScreen?: boolean,
    navBarProps: INavigationBar,
    hideNavBar?: boolean,
    className?: string
}

const DashboardInnerPageTemplate:FC<IDashboardInnerPageTemplate> = (props) => {
    const {navBarProps, hideNavBar, children, isMobFullScreen, className } = props

    const renderNavBar = () => {
        if (hideNavBar) return <></>
        return (
            <NavigationBar {...navBarProps}/>
        )
    }

    return (
        <div className={`flex-grow bg-white b500:rounded-t-[0.75rem] w-full tablet:w-auto ${className} ${isMobFullScreen ? "absolute top-0 h-full b500:h-auto b500:top-auto b500:relative" : ""}`}>
            {renderNavBar()}
            {children}
        </div>
    )
}

export default DashboardInnerPageTemplate