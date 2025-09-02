import React, { FC, PropsWithChildren } from "react";
import { IWithRouter } from "../../Hoc/WithRouter.tsx";
import PostSideBar from "./SideBars/PostSideBar.tsx";
import FindPeople from "./SideBars/FindPeople.tsx";

export interface IDashboardWithSideBar extends IWithRouter, PropsWithChildren {
    sideBar: "find_people" | "posts",
}

const DashboardWithSideBar: FC<IDashboardWithSideBar> = (props) => {
    const { children, sideBar } = props

    const renderSideBar = () => {
        switch (sideBar) {
            case "posts":
                return <PostSideBar {...props} />
            case "find_people":
                return <FindPeople {...props} />
        }
    };

    return (
        <React.Fragment>
            {children}
            {renderSideBar()}
        </React.Fragment>
    )
};

export default DashboardWithSideBar;